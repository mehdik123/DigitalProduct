-- =============================================================================
-- 017_local_first_profiles_only.sql
--
-- Use this on a FRESH Supabase project for Hybrid Athlete local-first mode.
-- Auth + one thin profiles row per user. Workout sets live in the browser
-- (localStorage) — do NOT create set_logs / week_status / program engine tables.
--
-- Setup:
--   1. Create a new Supabase project (do not reuse a burned free-tier project).
--   2. SQL Editor → paste this file → Run.
--   3. Put the project URL + anon key in .env (see .env.example).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  current_week INTEGER DEFAULT 1 CHECK (current_week >= 1 AND current_week <= 8),
  program_start_date DATE DEFAULT CURRENT_DATE,
  days_per_week SMALLINT CHECK (days_per_week IS NULL OR days_per_week IN (3, 4, 5)),
  language_preference TEXT DEFAULT 'en'
    CHECK (language_preference IN ('en', 'ar', 'fr'))
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_days SMALLINT;
  v_username TEXT;
BEGIN
  v_days := NULLIF(new.raw_user_meta_data->>'days_per_week', '')::SMALLINT;
  IF v_days IS NULL OR v_days NOT IN (3, 4, 5) THEN
    v_days := 5;
  END IF;

  v_username := COALESCE(
    NULLIF(new.raw_user_meta_data->>'username', ''),
    split_part(new.email, '@', 1)
  );

  BEGIN
    INSERT INTO public.profiles (id, email, full_name, username, days_per_week, current_week)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      v_username,
      v_days,
      1
    )
    ON CONFLICT (id) DO UPDATE SET
      email         = COALESCE(profiles.email, EXCLUDED.email),
      full_name     = COALESCE(profiles.full_name, EXCLUDED.full_name),
      days_per_week = COALESCE(profiles.days_per_week, EXCLUDED.days_per_week);
  EXCEPTION WHEN unique_violation THEN
    INSERT INTO public.profiles (id, email, full_name, days_per_week, current_week)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      v_days,
      1
    )
    ON CONFLICT (id) DO UPDATE SET
      email         = COALESCE(profiles.email, EXCLUDED.email),
      full_name     = COALESCE(profiles.full_name, EXCLUDED.full_name),
      days_per_week = COALESCE(profiles.days_per_week, EXCLUDED.days_per_week);
  END;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed for %: %', new.id, SQLERRM;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.enforce_days_per_week_immutable()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.days_per_week IS NOT NULL
     AND NEW.days_per_week IS DISTINCT FROM OLD.days_per_week THEN
    RAISE EXCEPTION 'days_per_week is permanent and cannot be changed once set';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_days_per_week_immutable ON public.profiles;
CREATE TRIGGER trg_days_per_week_immutable
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.enforce_days_per_week_immutable();

COMMENT ON TABLE public.profiles IS
  'Auth profile only. Workout sets and progressive overload live in the client (localStorage).';
