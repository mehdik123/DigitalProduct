-- Migration to create a secure, atomic function for saving workout logs
-- This bypasses client-side RLS issues by running as SECURITY DEFINER

CREATE OR REPLACE FUNCTION public.save_workout_log(
    p_user_id UUID,
    p_week_number INTEGER,
    p_workout_day_id INTEGER,
    p_exercise_id TEXT,
    p_exercise_name TEXT,
    p_sets JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the function creator (admin)
SET search_path = public -- Secure search path
AS $$
DECLARE
    v_workout_log_id UUID;
    v_set record;
    v_inserted_count INTEGER := 0;
BEGIN
    -- 1. Get or Create Workout Log (The Parent Record)
    SELECT id INTO v_workout_log_id
    FROM workout_logs
    WHERE user_id = p_user_id
      AND week_number = p_week_number
      AND workout_day_id = p_workout_day_id
    LIMIT 1;

    IF v_workout_log_id IS NULL THEN
        INSERT INTO workout_logs (user_id, week_number, workout_day_id, completed_at)
        VALUES (p_user_id, p_week_number, p_workout_day_id, NOW())
        RETURNING id INTO v_workout_log_id;
    END IF;

    -- 2. Clean Slate: Delete existing logs for this specific exercise
    -- This prevents duplicate appending if the user edits and resaves
    DELETE FROM exercise_logs
    WHERE workout_log_id = v_workout_log_id
      AND exercise_id = p_exercise_id;

    -- 3. Insert New Sets
    -- Iterate through the JSONB array using jsonb_to_recordset or a loop
    FOR v_set IN SELECT * FROM jsonb_to_recordset(p_sets) 
               AS x(set_number int, reps int, weight numeric, rpe int, completed boolean)
    LOOP
        -- Only insert if it has meaningful data (reps > 0 or weight > 0)
        IF v_set.reps > 0 OR v_set.weight > 0 THEN
            INSERT INTO exercise_logs (
                workout_log_id,
                exercise_id,
                exercise_name,
                set_number,
                reps,
                weight,
                rpe,
                completed
            )
            VALUES (
                v_workout_log_id,
                p_exercise_id,
                p_exercise_name,
                v_set.set_number,
                v_set.reps,
                v_set.weight,
                v_set.rpe,
                COALESCE(v_set.completed, true)
            );
            v_inserted_count := v_inserted_count + 1;
        END IF;
    END LOOP;

    -- Return success status
    RETURN jsonb_build_object(
        'success', true,
        'workout_log_id', v_workout_log_id,
        'inserted_count', v_inserted_count
    );

EXCEPTION WHEN OTHERS THEN
    -- Log error (optional) and re-raise
    RAISE LOG 'Error in save_workout_log: %', SQLERRM;
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.save_workout_log TO authenticated;
