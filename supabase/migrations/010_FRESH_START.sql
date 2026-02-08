-- 🚨 FRESH START MIGRATION (V2) 🚨
-- Run this script in the Supabase SQL Editor.
-- IT WILL DELETE ALL EXISTING DATA.

-- 1. CLEANUP: Drop everything
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.save_workout;
DROP TABLE IF EXISTS public.workout_sets CASCADE;
DROP TABLE IF EXISTS public.workout_sessions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. SCHEMA: Profiles (User Data)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    username TEXT,
    current_week INTEGER DEFAULT 1,
    program_start_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SCHEMA: Workout Tables
CREATE TABLE public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    week_number INTEGER NOT NULL,
    workout_day_id INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, week_number, workout_day_id)
);

CREATE TABLE public.workout_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    exercise_id TEXT NOT NULL,
    exercise_name TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER DEFAULT 0,
    weight DECIMAL(10, 2) DEFAULT 0,
    rpe INTEGER,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SECURITY: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Note: Insert handled by trigger, but allow manual insert just in case
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for Workouts
CREATE POLICY "Users manage own sessions" ON public.workout_sessions
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own sets" ON public.workout_sets
    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. AUTOMATION: Auto-create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. LOGIC: Atomic Save Function (RPC)
CREATE OR REPLACE FUNCTION public.save_workout(
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
SET search_path = public
AS $$
DECLARE
    v_session_id UUID;
    v_inserted_count INTEGER := 0;
    v_set record;
BEGIN
    -- A. Get or Create Session
    INSERT INTO workout_sessions (user_id, week_number, workout_day_id)
    VALUES (p_user_id, p_week_number, p_workout_day_id)
    ON CONFLICT (user_id, week_number, workout_day_id) 
    DO UPDATE SET completed_at = NOW()
    RETURNING id INTO v_session_id;

    -- B. Clear previous logs for THIS exercise only
    DELETE FROM workout_sets 
    WHERE session_id = v_session_id 
      AND exercise_id = p_exercise_id;

    -- C. Insert new sets
    FOR v_set IN SELECT * FROM jsonb_to_recordset(p_sets) 
               AS x(set_number int, reps int, weight numeric, rpe int, completed boolean)
    LOOP
        IF (v_set.reps > 0 OR v_set.weight > 0) THEN
            INSERT INTO workout_sets (
                session_id, user_id, exercise_id, exercise_name,
                set_number, reps, weight, rpe, completed
            ) VALUES (
                v_session_id, p_user_id, p_exercise_id, p_exercise_name,
                v_set.set_number, v_set.reps, v_set.weight, v_set.rpe, v_set.completed
            );
            v_inserted_count := v_inserted_count + 1;
        END IF;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'count', v_inserted_count);

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION public.save_workout TO authenticated;

DO $$
BEGIN
    RAISE NOTICE '✅ Fresh Start Migration (V2) Completed Successfully!';
END $$;
