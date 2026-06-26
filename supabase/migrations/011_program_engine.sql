-- =============================================================================
-- 011_program_engine.sql
-- 12-Week Hybrid Athlete Engine — consolidated, idempotent source of truth.
-- Supersedes the experimental 009/010 workout tables.
-- Safe to run multiple times.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- profiles: relax current_week to 0..12 (0 = pre-baseline) and default to 0
-- -----------------------------------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_week INTEGER DEFAULT 0;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_current_week_check;
ALTER TABLE profiles ALTER COLUMN current_week SET DEFAULT 0;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_current_week_check CHECK (current_week >= 0 AND current_week <= 12);

-- -----------------------------------------------------------------------------
-- exercises: static catalog (read-only to authenticated users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exercises (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  day_id          INTEGER NOT NULL,
  progression_type TEXT NOT NULL,
  default_sets    INTEGER NOT NULL DEFAULT 3,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  video_url       TEXT,
  image_url       TEXT,
  tip             TEXT
);

-- -----------------------------------------------------------------------------
-- week_status: per-user state machine (locked | active | completed)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS week_status (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  week    INTEGER NOT NULL CHECK (week >= 1 AND week <= 12),
  status  TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'active', 'completed')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, week)
);

-- -----------------------------------------------------------------------------
-- set_logs: one row per planned/logged set
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS set_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  week          INTEGER NOT NULL CHECK (week >= 1 AND week <= 12),
  day_id        INTEGER NOT NULL,
  exercise_id   TEXT NOT NULL,
  set_index     INTEGER NOT NULL CHECK (set_index > 0),
  target_reps   INTEGER,
  target_weight NUMERIC(6,2),
  actual_reps   INTEGER,
  actual_weight NUMERIC(6,2),
  rpe           NUMERIC(3,1),
  completed     BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, week, day_id, exercise_id, set_index)
);

-- -----------------------------------------------------------------------------
-- baseline: Week 0 starting numbers for key lifts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS baseline (
  user_id     UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  weight      NUMERIC(6,2) NOT NULL,
  reps        INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, exercise_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_set_logs_user_week ON set_logs(user_id, week);
CREATE INDEX IF NOT EXISTS idx_set_logs_lookup ON set_logs(user_id, week, day_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_week_status_user ON week_status(user_id);

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
ALTER TABLE exercises   ENABLE ROW LEVEL SECURITY;
ALTER TABLE week_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE set_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE baseline    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Exercises readable by authenticated" ON exercises;
CREATE POLICY "Exercises readable by authenticated"
  ON exercises FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users manage own week_status" ON week_status;
CREATE POLICY "Users manage own week_status"
  ON week_status FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own set_logs" ON set_logs;
CREATE POLICY "Users manage own set_logs"
  ON set_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own baseline" ON baseline;
CREATE POLICY "Users manage own baseline"
  ON baseline FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- Engine helpers (keep in sync with src/data/programConfig.ts)
-- =============================================================================

CREATE OR REPLACE FUNCTION _phase(p_week INTEGER)
RETURNS TABLE(lo INTEGER, hi INTEGER, deload BOOLEAN)
LANGUAGE sql IMMUTABLE AS $$
  SELECT t.lo, t.hi, t.deload
  FROM (VALUES
    (1, 8, 12, false), (2, 8, 12, false),
    (3, 8, 10, false), (4, 8, 10, false), (5, 8, 10, false),
    (6, 8, 10, true),
    (7, 5, 7, false), (8, 5, 7, false), (9, 5, 7, false),
    (10, 3, 5, false), (11, 3, 5, false),
    (12, 3, 5, true)
  ) AS t(w, lo, hi, deload)
  WHERE t.w = p_week;
$$;

CREATE OR REPLACE FUNCTION _is_deload(p_week INTEGER)
RETURNS BOOLEAN LANGUAGE sql IMMUTABLE AS $$
  SELECT COALESCE((SELECT deload FROM _phase(p_week)), false);
$$;

CREATE OR REPLACE FUNCTION _increment(p_type TEXT)
RETURNS NUMERIC LANGUAGE sql IMMUTABLE AS $$
  SELECT (CASE p_type
    WHEN 'barbell_compound' THEN 5
    WHEN 'barbell_upper'    THEN 2.5
    WHEN 'dumbbell'         THEN 2
    WHEN 'machine'          THEN 5
    WHEN 'isolation'        THEN 1.5
    WHEN 'calisthenics'     THEN 2.5
    ELSE 2.5 END)::NUMERIC;
$$;

-- =============================================================================
-- RPCs (SECURITY DEFINER, user derived from auth.uid())
-- =============================================================================

DROP FUNCTION IF EXISTS save_set_log(INTEGER, INTEGER, TEXT, INTEGER, INTEGER, NUMERIC, INTEGER, NUMERIC, NUMERIC, BOOLEAN);
CREATE OR REPLACE FUNCTION save_set_log(
  p_week INTEGER,
  p_day_id INTEGER,
  p_exercise_id TEXT,
  p_set_index INTEGER,
  p_target_reps INTEGER,
  p_target_weight NUMERIC,
  p_actual_reps INTEGER,
  p_actual_weight NUMERIC,
  p_rpe NUMERIC,
  p_completed BOOLEAN
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthenticated');
  END IF;

  INSERT INTO set_logs(
    user_id, week, day_id, exercise_id, set_index,
    target_reps, target_weight, actual_reps, actual_weight, rpe, completed, updated_at
  ) VALUES (
    v_user, p_week, p_day_id, p_exercise_id, p_set_index,
    p_target_reps, p_target_weight, p_actual_reps, p_actual_weight, p_rpe, COALESCE(p_completed, false), NOW()
  )
  ON CONFLICT (user_id, week, day_id, exercise_id, set_index)
  DO UPDATE SET
    target_reps   = EXCLUDED.target_reps,
    target_weight = EXCLUDED.target_weight,
    actual_reps   = EXCLUDED.actual_reps,
    actual_weight = EXCLUDED.actual_weight,
    rpe           = EXCLUDED.rpe,
    completed     = EXCLUDED.completed,
    updated_at    = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$;

DROP FUNCTION IF EXISTS submit_baseline(JSONB);
CREATE OR REPLACE FUNCTION submit_baseline(p_lifts JSONB)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_item JSONB;
  v_lo INTEGER;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthenticated');
  END IF;

  SELECT lo INTO v_lo FROM _phase(1);

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_lifts) LOOP
    INSERT INTO baseline(user_id, exercise_id, weight, reps)
    VALUES (
      v_user,
      v_item->>'exercise_id',
      (v_item->>'weight')::NUMERIC,
      COALESCE((v_item->>'reps')::INTEGER, 0)
    )
    ON CONFLICT (user_id, exercise_id)
    DO UPDATE SET weight = EXCLUDED.weight, reps = EXCLUDED.reps;

    -- Seed Week 1 target rows for this key lift across all its sets.
    DELETE FROM set_logs
    WHERE user_id = v_user AND week = 1 AND exercise_id = v_item->>'exercise_id';

    INSERT INTO set_logs(user_id, week, day_id, exercise_id, set_index, target_reps, target_weight, completed)
    SELECT v_user, 1, e.day_id, e.id, gs, v_lo, (v_item->>'weight')::NUMERIC, false
    FROM exercises e
    CROSS JOIN generate_series(1, e.default_sets) AS gs
    WHERE e.id = v_item->>'exercise_id';
  END LOOP;

  INSERT INTO week_status(user_id, week, status) VALUES (v_user, 1, 'active')
  ON CONFLICT (user_id, week) DO UPDATE SET status = 'active', updated_at = NOW();

  UPDATE profiles SET current_week = 1 WHERE id = v_user;

  RETURN jsonb_build_object('success', true);
END;
$$;

DROP FUNCTION IF EXISTS complete_week_and_generate(INTEGER);
CREATE OR REPLACE FUNCTION complete_week_and_generate(p_week INTEGER)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_next INTEGER := p_week + 1;
  r_ex RECORD;
  v_expected INTEGER;
  v_done INTEGER;
  v_lo INTEGER; v_hi INTEGER; v_deload BOOLEAN;
  v_topN INTEGER;
  v_all_top BOOLEAN;
  v_last_weight NUMERIC;
  v_min_reps INTEGER;
  v_next_weight NUMERIC;
  v_next_reps INTEGER;
  v_inc NUMERIC;
  v_set INTEGER;
  v_next_sets INTEGER;
  v_day INTEGER;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthenticated');
  END IF;

  -- Idempotency guard: if the week was already completed, do not regenerate
  -- (regeneration would overwrite any targets/logs already in week N+1).
  IF EXISTS (
    SELECT 1 FROM week_status
    WHERE user_id = v_user AND week = p_week AND status = 'completed'
  ) THEN
    RETURN jsonb_build_object('success', true, 'completed_week', p_week, 'already', true);
  END IF;

  -- 1) Validate every exercise in the week is fully logged & completed.
  FOR r_ex IN SELECT id, default_sets FROM exercises LOOP
    v_expected := CASE WHEN _is_deload(p_week)
                       THEN GREATEST(1, FLOOR(r_ex.default_sets / 2.0)::INTEGER)
                       ELSE r_ex.default_sets END;

    SELECT COUNT(*) INTO v_done
    FROM set_logs
    WHERE user_id = v_user AND week = p_week AND exercise_id = r_ex.id
      AND completed = true
      AND actual_reps IS NOT NULL
      AND actual_weight IS NOT NULL
      AND rpe IS NOT NULL;

    IF v_done < v_expected THEN
      RETURN jsonb_build_object('success', false, 'reason', 'incomplete', 'exercise_id', r_ex.id);
    END IF;
  END LOOP;

  -- 2) Final week: mark complete, nothing to generate.
  IF p_week >= 12 THEN
    INSERT INTO week_status(user_id, week, status) VALUES (v_user, p_week, 'completed')
    ON CONFLICT (user_id, week) DO UPDATE SET status = 'completed', updated_at = NOW();
    UPDATE profiles SET current_week = 12 WHERE id = v_user;
    RETURN jsonb_build_object('success', true, 'completed_week', p_week, 'final', true);
  END IF;

  -- Upcoming phase parameters.
  SELECT lo, hi, deload INTO v_lo, v_hi, v_deload FROM _phase(v_next);
  v_topN := (SELECT hi FROM _phase(p_week));

  -- 3) Double-progression: write next week's per-exercise targets.
  FOR r_ex IN SELECT id, default_sets, progression_type, day_id FROM exercises LOOP
    v_inc := _increment(r_ex.progression_type);
    v_day := r_ex.day_id;

    SELECT MAX(actual_weight),
           BOOL_AND(actual_reps >= v_topN),
           MIN(actual_reps)
      INTO v_last_weight, v_all_top, v_min_reps
    FROM set_logs
    WHERE user_id = v_user AND week = p_week AND exercise_id = r_ex.id
      AND completed = true;

    IF v_last_weight IS NULL THEN v_last_weight := 0; END IF;

    IF v_deload THEN
      v_next_weight := ROUND((v_last_weight * 0.6) * 2) / 2;
      v_next_reps := v_lo;
    ELSIF COALESCE(v_all_top, false) THEN
      v_next_weight := ROUND((v_last_weight + v_inc) * 2) / 2;
      v_next_reps := v_lo;
    ELSE
      v_next_weight := ROUND(v_last_weight * 2) / 2;
      v_next_reps := LEAST(COALESCE(v_min_reps, v_lo) + 1, v_hi);
    END IF;

    v_next_sets := CASE WHEN v_deload
                        THEN GREATEST(1, FLOOR(r_ex.default_sets / 2.0)::INTEGER)
                        ELSE r_ex.default_sets END;

    DELETE FROM set_logs WHERE user_id = v_user AND week = v_next AND exercise_id = r_ex.id;

    v_set := 1;
    WHILE v_set <= v_next_sets LOOP
      INSERT INTO set_logs(user_id, week, day_id, exercise_id, set_index, target_reps, target_weight, completed)
      VALUES (v_user, v_next, v_day, r_ex.id, v_set, v_next_reps, v_next_weight, false);
      v_set := v_set + 1;
    END LOOP;
  END LOOP;

  -- 4) Flip the state machine.
  INSERT INTO week_status(user_id, week, status) VALUES (v_user, p_week, 'completed')
  ON CONFLICT (user_id, week) DO UPDATE SET status = 'completed', updated_at = NOW();

  INSERT INTO week_status(user_id, week, status) VALUES (v_user, v_next, 'active')
  ON CONFLICT (user_id, week) DO UPDATE SET status = 'active', updated_at = NOW();

  UPDATE profiles SET current_week = v_next WHERE id = v_user;

  RETURN jsonb_build_object('success', true, 'completed_week', p_week, 'unlocked_week', v_next);
END;
$$;

-- Grants
GRANT SELECT ON exercises TO authenticated;
GRANT EXECUTE ON FUNCTION save_set_log(INTEGER, INTEGER, TEXT, INTEGER, INTEGER, NUMERIC, INTEGER, NUMERIC, NUMERIC, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION submit_baseline(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_week_and_generate(INTEGER) TO authenticated;

-- =============================================================================
-- Seed the exercises catalog (idempotent).
-- =============================================================================
INSERT INTO exercises (id, name, day_id, progression_type, default_sets, sort_order) VALUES
  ('incline-barbell-bench-smith', 'Incline Barbell Bench Press (Smith Machine)', 1, 'barbell_upper', 3, 1),
  ('dips', 'Dips', 1, 'calisthenics', 3, 2),
  ('standing-db-lateral-raises', 'Standing Dumbbell Lateral Raises', 1, 'isolation', 3, 3),
  ('pike-push-ups', 'Pike Push Ups', 1, 'calisthenics', 3, 4),
  ('wide-grip-lat-pulldowns', 'Wide Grip Lat Pulldowns', 1, 'machine', 3, 5),
  ('barbell-bent-over-rows', 'Barbell Bent Over Rows', 1, 'barbell_upper', 3, 6),
  ('straight-bar-bicep-curls', 'Straight Bar Bicep Curls', 1, 'isolation', 3, 7),
  ('barbell-skull-crushers', 'Barbell Skull Crushers', 1, 'isolation', 4, 8),

  ('high-bar-back-squats', 'High Bar Back Squats', 2, 'barbell_compound', 3, 1),
  ('front-squats-smith', 'Front Squats (Smith Machine)', 2, 'barbell_compound', 3, 2),
  ('leg-press', 'Leg Press', 2, 'machine', 3, 3),
  ('dumbbell-lunges', 'Dumbbell Lunges', 2, 'dumbbell', 3, 4),
  ('prone-leg-curls', 'Prone Leg Curls', 2, 'machine', 3, 5),
  ('dumbbell-rdl', 'Dumbbell Romanian Deadlifts', 2, 'dumbbell', 3, 6),
  ('calf-raises-in', 'Machine Standing Calf Raises (Toes In)', 2, 'machine', 4, 7),
  ('calf-raises-out', 'Machine Standing Calf Raises (Toes Out)', 2, 'machine', 4, 8),

  ('flat-barbell-bench', 'Flat Barbell Bench Press', 3, 'barbell_upper', 3, 1),
  ('pull-ups', 'Pull Ups', 3, 'calisthenics', 3, 2),
  ('reverse-grip-bent-rows', 'Reverse Grip Bent Over Rows', 3, 'barbell_upper', 3, 3),
  ('seated-lateral-raises', 'Seated Lateral Raises', 3, 'isolation', 3, 4),
  ('db-rear-delt-kickbacks', 'Dumbbell Rear Delt Kickbacks', 3, 'isolation', 3, 5),
  ('chin-ups', 'Chin Ups', 3, 'calisthenics', 3, 6),
  ('overhead-cable-triceps', 'Overhead Cable Triceps Extensions', 3, 'isolation', 4, 7),
  ('diamond-push-ups', 'Diamond Push Ups', 3, 'calisthenics', 4, 8),

  ('front-squats-smith-day4', 'Front Squats (Smith Machine)', 4, 'barbell_compound', 3, 1),
  ('machine-leg-extensions', 'Machine Leg Extensions', 4, 'machine', 3, 2),
  ('jump-squats', 'Jump Squats', 4, 'calisthenics', 3, 3),
  ('deadlifts', 'Deadlifts', 4, 'barbell_compound', 3, 4),
  ('prone-leg-curls-day4', 'Prone Leg Curls', 4, 'machine', 3, 5),
  ('calf-raises-in-day4', 'Machine Standing Calf Raises (Toes In)', 4, 'machine', 4, 6),
  ('calf-raises-out-day4', 'Machine Standing Calf Raises (Toes Out)', 4, 'machine', 4, 7),
  ('adductor-machine', 'Adductor Machine', 4, 'machine', 3, 8),

  ('incline-db-bench', 'Incline Dumbbell Bench Press', 5, 'dumbbell', 3, 1),
  ('push-ups', 'Push Ups', 5, 'calisthenics', 3, 2),
  ('pull-ups-day5', 'Pull Ups', 5, 'calisthenics', 3, 3),
  ('neutral-grip-pull-ups', 'Neutral Grip Pull Ups', 5, 'calisthenics', 3, 4),
  ('standing-db-lateral-raises-day5', 'Standing Dumbbell Lateral Raises', 5, 'isolation', 3, 5),
  ('wide-grip-ez-curls', 'Wide Grip EZ Bar Curls', 5, 'isolation', 3, 6),
  ('db-hammer-curls', 'Dumbbell Hammer Curls', 5, 'isolation', 3, 7),
  ('overhead-cable-triceps-day5', 'Overhead Cable Triceps Extensions', 5, 'isolation', 3, 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  day_id = EXCLUDED.day_id,
  progression_type = EXCLUDED.progression_type,
  default_sets = EXCLUDED.default_sets,
  sort_order = EXCLUDED.sort_order;
