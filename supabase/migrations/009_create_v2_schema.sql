-- V2 SCHEMA MIGRATION
-- Purpose: Create a fresh, clean set of tables to bypass legacy corruption/locks.

-- 1. Create Parent Table: workout_sessions (Replaces workout_logs)
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    week_number INTEGER NOT NULL,
    workout_day_id INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enables RLS but we start with a clean slate
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

-- Simple, standard policy: Users can do ANYTHING to their own rows.
CREATE POLICY "Users fully manage own sessions"
    ON public.workout_sessions
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. Create Child Table: workout_sets (Replaces exercise_logs)
CREATE TABLE IF NOT EXISTS public.workout_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Added for easier RLS
    exercise_id TEXT NOT NULL,
    exercise_name TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER,
    weight DECIMAL(10, 2),
    rpe INTEGER,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- Simple, standard policy: Users can do ANYTHING to their own rows.
CREATE POLICY "Users fully manage own sets"
    ON public.workout_sets
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_v2_sessions_lookup ON public.workout_sessions(user_id, week_number, workout_day_id);
CREATE INDEX IF NOT EXISTS idx_v2_sets_lookup ON public.workout_sets(session_id, exercise_id);

-- 3. Create V2 RPC Function
-- This function atomically manages the session and sets.
CREATE OR REPLACE FUNCTION public.save_workout_v2(
    p_user_id UUID,
    p_week_number INTEGER,
    p_workout_day_id INTEGER,
    p_exercise_id TEXT,
    p_exercise_name TEXT,
    p_sets JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as admin to bypass any complex RLS recursion
SET search_path = public
AS $$
DECLARE
    v_session_id UUID;
    v_set record;
    v_inserted_count INTEGER := 0;
BEGIN
    -- A. Find or Create Session
    SELECT id INTO v_session_id
    FROM workout_sessions
    WHERE user_id = p_user_id
      AND week_number = p_week_number
      AND workout_day_id = p_workout_day_id
    LIMIT 1;

    IF v_session_id IS NULL THEN
        INSERT INTO workout_sessions (user_id, week_number, workout_day_id)
        VALUES (p_user_id, p_week_number, p_workout_day_id)
        RETURNING id INTO v_session_id;
    END IF;

    -- B. Clean Slate for this Exercise (in this session)
    DELETE FROM workout_sets
    WHERE session_id = v_session_id
      AND exercise_id = p_exercise_id;

    -- C. Insert New Sets
    FOR v_set IN SELECT * FROM jsonb_to_recordset(p_sets) 
               AS x(set_number int, reps int, weight numeric, rpe int, completed boolean)
    LOOP
        IF v_set.reps > 0 OR v_set.weight > 0 THEN
            INSERT INTO workout_sets (
                session_id,
                user_id, -- Verified by caller (SECURITY DEFINER relies on correct p_user_id)
                exercise_id,
                exercise_name,
                set_number,
                reps,
                weight,
                rpe,
                completed
            )
            VALUES (
                v_session_id,
                p_user_id,
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

    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_session_id,
        'inserted_count', v_inserted_count
    );

EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in save_workout_v2: %', SQLERRM;
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_workout_v2 TO authenticated;
