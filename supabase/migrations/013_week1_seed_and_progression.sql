-- =============================================================================
-- 013_week1_seed_and_progression.sql
-- Aligns the cloud engine with the offline (client) engine:
--   * Week 1 reps are pre-populated with a value between 6 and 10 per exercise,
--     applied to every user (including future signups).
--   * Weight progression uses a fixed 2.5 kg step.
--   * Calisthenics unlock rule: reps required, weight optional.
--   * 0 is a valid logged value.
-- Safe to run multiple times.
-- =============================================================================

-- Deterministic Week 1 target reps in [6, 10] for an exercise id.
-- Deterministic (not random per call) so the value is stable across reloads
-- and identical for every user, matching the client engine's seedReps().
CREATE OR REPLACE FUNCTION _week1_reps(p_exercise_id TEXT)
RETURNS INTEGER LANGUAGE sql IMMUTABLE AS $$
  SELECT 6 + (abs(hashtext(p_exercise_id)) % 5);
$$;

-- All progression now steps weight by a fixed 2.5 kg.
CREATE OR REPLACE FUNCTION _increment(p_type TEXT)
RETURNS NUMERIC LANGUAGE sql IMMUTABLE AS $$
  SELECT 2.5::NUMERIC;
$$;

-- Seed Week 1 target rows for the current user (idempotent per exercise/set).
CREATE OR REPLACE FUNCTION _seed_week1_targets(p_user UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO set_logs(user_id, week, day_id, exercise_id, set_index, target_reps, target_weight, completed)
  SELECT p_user, 1, e.day_id, e.id, gs, _week1_reps(e.id), NULL, false
  FROM exercises e
  CROSS JOIN generate_series(1, e.default_sets) AS gs
  ON CONFLICT (user_id, week, day_id, exercise_id, set_index) DO NOTHING;
END;
$$;

-- start_program: unlock week 1 AND pre-populate its target reps.
DROP FUNCTION IF EXISTS start_program();
CREATE OR REPLACE FUNCTION start_program()
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthenticated');
  END IF;

  INSERT INTO week_status(user_id, week, status)
  VALUES (v_user, 1, 'active')
  ON CONFLICT (user_id, week) DO UPDATE SET status = 'active', updated_at = NOW();

  UPDATE profiles SET current_week = 1 WHERE id = v_user;

  PERFORM _seed_week1_targets(v_user);

  RETURN jsonb_build_object('success', true, 'current_week', 1);
END;
$$;

GRANT EXECUTE ON FUNCTION start_program() TO authenticated;

-- Week completion + progression, aligned with the client engine.
--   * Unlock requires every set of every exercise across the week to be logged.
--   * Reps required; weight required for weighted lifts only (calisthenics: optional).
--   * 0 counts as logged (NULL does not).
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
  v_set INTEGER;
  v_next_sets INTEGER;
  v_day INTEGER;
  v_is_cali BOOLEAN;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthenticated');
  END IF;

  IF EXISTS (
    SELECT 1 FROM week_status
    WHERE user_id = v_user AND week = p_week AND status = 'completed'
  ) THEN
    RETURN jsonb_build_object('success', true, 'completed_week', p_week, 'already', true);
  END IF;

  -- Validate: every set logged. Weight only required for non-calisthenics.
  FOR r_ex IN SELECT id, default_sets, progression_type FROM exercises LOOP
    v_is_cali := r_ex.progression_type = 'calisthenics';
    v_expected := CASE WHEN _is_deload(p_week)
                       THEN GREATEST(1, FLOOR(r_ex.default_sets / 2.0)::INTEGER)
                       ELSE r_ex.default_sets END;

    SELECT COUNT(*) INTO v_done
    FROM set_logs
    WHERE user_id = v_user AND week = p_week AND exercise_id = r_ex.id
      AND completed = true
      AND actual_reps IS NOT NULL
      AND (v_is_cali OR actual_weight IS NOT NULL);

    IF v_done < v_expected THEN
      RETURN jsonb_build_object('success', false, 'reason', 'incomplete', 'exercise_id', r_ex.id);
    END IF;
  END LOOP;

  IF p_week >= 12 THEN
    INSERT INTO week_status(user_id, week, status) VALUES (v_user, p_week, 'completed')
    ON CONFLICT (user_id, week) DO UPDATE SET status = 'completed', updated_at = NOW();
    UPDATE profiles SET current_week = 12 WHERE id = v_user;
    RETURN jsonb_build_object('success', true, 'completed_week', p_week, 'final', true);
  END IF;

  SELECT lo, hi, deload INTO v_lo, v_hi, v_deload FROM _phase(v_next);
  v_topN := (SELECT hi FROM _phase(p_week));

  FOR r_ex IN SELECT id, default_sets, progression_type, day_id FROM exercises LOOP
    v_is_cali := r_ex.progression_type = 'calisthenics';
    v_day := r_ex.day_id;

    SELECT MAX(COALESCE(actual_weight, 0)),
           BOOL_AND(actual_reps >= v_topN),
           MIN(actual_reps)
      INTO v_last_weight, v_all_top, v_min_reps
    FROM set_logs
    WHERE user_id = v_user AND week = p_week AND exercise_id = r_ex.id
      AND completed = true;

    IF v_last_weight IS NULL THEN v_last_weight := 0; END IF;

    IF v_is_cali THEN
      v_next_weight := CASE WHEN v_last_weight > 0 THEN ROUND(v_last_weight * 2) / 2 ELSE NULL END;
      IF v_deload OR COALESCE(v_all_top, false) THEN
        v_next_reps := v_lo;
      ELSE
        v_next_reps := LEAST(COALESCE(v_min_reps, v_lo) + 1, v_hi);
      END IF;
    ELSIF v_deload THEN
      v_next_weight := ROUND((v_last_weight * 0.6) * 2) / 2;
      v_next_reps := v_lo;
    ELSIF COALESCE(v_all_top, false) THEN
      v_next_weight := ROUND((v_last_weight + 2.5) * 2) / 2;
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

  INSERT INTO week_status(user_id, week, status) VALUES (v_user, p_week, 'completed')
  ON CONFLICT (user_id, week) DO UPDATE SET status = 'completed', updated_at = NOW();

  INSERT INTO week_status(user_id, week, status) VALUES (v_user, v_next, 'active')
  ON CONFLICT (user_id, week) DO UPDATE SET status = 'active', updated_at = NOW();

  UPDATE profiles SET current_week = v_next WHERE id = v_user;

  RETURN jsonb_build_object('success', true, 'completed_week', p_week, 'unlocked_week', v_next);
END;
$$;

GRANT EXECUTE ON FUNCTION complete_week_and_generate(INTEGER) TO authenticated;

-- Backfill Week 1 targets for existing users who are already on week 1.
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id FROM profiles WHERE current_week >= 1 LOOP
    PERFORM _seed_week1_targets(r.id);
  END LOOP;
END;
$$;
