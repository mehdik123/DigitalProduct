-- =============================================================================
-- 012_no_baseline_calisthenics.sql
-- Skip Week 0 baseline: new users start at Week 1.
-- Calisthenics exercises: reps-only logging, rep-based progression.
-- Safe to run multiple times.
-- =============================================================================

-- New users default to Week 1 (not 0).
ALTER TABLE profiles ALTER COLUMN current_week SET DEFAULT 1;

-- Start program without baseline (sets current_week = 1, unlocks week 1).
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

  RETURN jsonb_build_object('success', true, 'current_week', 1);
END;
$$;

GRANT EXECUTE ON FUNCTION start_program() TO authenticated;

-- Week completion + progression (calisthenics = reps only, no weight required).
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

  -- Validate every exercise is fully logged.
  FOR r_ex IN SELECT id, default_sets, progression_type, day_id FROM exercises LOOP
    v_is_cali := r_ex.progression_type = 'calisthenics';
    v_expected := CASE WHEN _is_deload(p_week)
                       THEN GREATEST(1, FLOOR(r_ex.default_sets / 2.0)::INTEGER)
                       ELSE r_ex.default_sets END;

    SELECT COUNT(*) INTO v_done
    FROM set_logs
    WHERE user_id = v_user AND week = p_week AND exercise_id = r_ex.id
      AND completed = true
      AND actual_reps IS NOT NULL
      AND rpe IS NOT NULL
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
    v_inc := _increment(r_ex.progression_type);
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
      -- Rep-only double progression for bodyweight movements.
      v_next_weight := NULL;
      IF v_deload THEN
        v_next_reps := v_lo;
      ELSIF COALESCE(v_all_top, false) THEN
        v_next_reps := v_lo;
      ELSE
        v_next_reps := LEAST(COALESCE(v_min_reps, v_lo) + 1, v_hi);
      END IF;
    ELSIF v_deload THEN
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

  INSERT INTO week_status(user_id, week, status) VALUES (v_user, p_week, 'completed')
  ON CONFLICT (user_id, week) DO UPDATE SET status = 'completed', updated_at = NOW();

  INSERT INTO week_status(user_id, week, status) VALUES (v_user, v_next, 'active')
  ON CONFLICT (user_id, week) DO UPDATE SET status = 'active', updated_at = NOW();

  UPDATE profiles SET current_week = v_next WHERE id = v_user;

  RETURN jsonb_build_object('success', true, 'completed_week', p_week, 'unlocked_week', v_next);
END;
$$;

GRANT EXECUTE ON FUNCTION complete_week_and_generate(INTEGER) TO authenticated;
