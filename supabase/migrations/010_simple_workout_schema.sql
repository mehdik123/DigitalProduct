-- Simple, Clean Workout Schema
-- Mobile-first, straightforward design

-- Drop old tables if they exist (optional - comment out if you want to keep old data)
-- DROP TABLE IF EXISTS workout_sets CASCADE;
-- DROP TABLE IF EXISTS workout_sessions CASCADE;
-- DROP TABLE IF EXISTS exercise_logs CASCADE;
-- DROP TABLE IF EXISTS workout_logs CASCADE;

-- Main workout session table
CREATE TABLE IF NOT EXISTS workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 8),
    workout_day_id INTEGER NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_number, workout_day_id)
);

-- Exercise sets table - simple and direct
CREATE TABLE IF NOT EXISTS exercise_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    exercise_id TEXT NOT NULL,
    exercise_name TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER,
    weight DECIMAL(10, 2),
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
    completed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, exercise_id, set_number)
);

-- Enable RLS
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies - users can only access their own data
CREATE POLICY "Users manage own sessions"
    ON workout_sessions
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own sets"
    ON exercise_sets
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_week_day 
    ON workout_sessions(user_id, week_number, workout_day_id);
CREATE INDEX IF NOT EXISTS idx_sets_session_exercise 
    ON exercise_sets(session_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_sets_user 
    ON exercise_sets(user_id);

-- Simple function to save exercise sets
CREATE OR REPLACE FUNCTION save_exercise_sets(
    p_user_id UUID,
    p_week_number INTEGER,
    p_workout_day_id INTEGER,
    p_exercise_id TEXT,
    p_exercise_name TEXT,
    p_sets JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session_id UUID;
    v_set JSONB;
    v_saved_count INTEGER := 0;
BEGIN
    -- Get or create session
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

    -- Delete existing sets for this exercise
    DELETE FROM exercise_sets
    WHERE session_id = v_session_id
      AND exercise_id = p_exercise_id;

    -- Insert new sets
    FOR v_set IN SELECT * FROM jsonb_array_elements(p_sets)
    LOOP
        IF (v_set->>'reps')::INTEGER > 0 OR (v_set->>'weight')::DECIMAL > 0 THEN
            INSERT INTO exercise_sets (
                session_id,
                user_id,
                exercise_id,
                exercise_name,
                set_number,
                reps,
                weight,
                rpe,
                completed
            ) VALUES (
                v_session_id,
                p_user_id,
                p_exercise_id,
                p_exercise_name,
                (v_set->>'set_number')::INTEGER,
                (v_set->>'reps')::INTEGER,
                (v_set->>'weight')::DECIMAL,
                NULLIF((v_set->>'rpe')::INTEGER, 0),
                COALESCE((v_set->>'completed')::BOOLEAN, true)
            );
            v_saved_count := v_saved_count + 1;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_session_id,
        'saved_count', v_saved_count
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

GRANT EXECUTE ON FUNCTION save_exercise_sets TO authenticated;

