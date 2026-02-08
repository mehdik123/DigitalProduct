-- TEST SCRIPT for save_workout RPC
-- Run this in Supabase SQL Editor to verify the function logic.

DO $$
DECLARE
    v_result JSONB;
    v_user_id UUID;
BEGIN
    -- 1. Get a valid user ID (the first one found)
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'No users found! Please Sign Up first.';
    END IF;

    RAISE NOTICE 'Testing with User ID: %', v_user_id;

    -- 2. Call the RPC function manually
    v_result := public.save_workout(
        p_user_id := v_user_id,
        p_week_number := 1,
        p_workout_day_id := 1,
        p_exercise_id := 'test-exercise-1',
        p_exercise_name := 'Test Exercise',
        p_sets := '[
            {"set_number": 1, "reps": 10, "weight": 50, "rpe": 8, "completed": true},
            {"set_number": 2, "reps": 8, "weight": 55, "rpe": 9, "completed": true}
        ]'::jsonb
    );

    -- 3. Print Result
    RAISE NOTICE 'Result: %', v_result;

    -- 4. Verify Data
    IF (v_result->>'success')::boolean = true THEN
        RAISE NOTICE '✅ SUCCESS: Function returned success.';
    ELSE
        RAISE NOTICE '❌ FAILURE: Function returned error: %', v_result;
    END IF;

END $$;
