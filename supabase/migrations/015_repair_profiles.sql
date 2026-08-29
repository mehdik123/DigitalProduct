-- =============================================================================
-- 015_repair_profiles.sql
-- Repairs the profiles table so signup actually persists a profile row.
--
-- Context: this database was created from 001_initial_schema.sql, where profiles
-- has no email/full_name columns (010_FRESH_START, which added them, was never
-- applied because it drops all data). The handle_new_user trigger from 014 tried
-- to insert those columns, threw, and — because 014 swallows exceptions so that
-- account creation is never blocked — every signup produced an auth user with
-- NO profile row. Without a profile, days_per_week could never be stored or read.
--
-- This migration:
--   1. adds the missing columns,
--   2. backfills them (and creates any missing profile rows) from auth.users,
--   3. reinstalls handle_new_user so it matches the real schema and cannot fail
--      on a duplicate username.
-- Safe to run multiple times.
-- =============================================================================

-- 1. Missing columns ---------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email     TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- days_per_week is expected by the app; re-assert it defensively.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS days_per_week SMALLINT;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_days_per_week_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_days_per_week_check
  CHECK (days_per_week IS NULL OR days_per_week IN (3, 4, 5));

-- The 12-week engine needs current_week 0..12; 001 originally capped it at 8.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_current_week_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_current_week_check
  CHECK (current_week >= 0 AND current_week <= 12);

-- 2. Backfill ----------------------------------------------------------------
-- Create profile rows for accounts that never got one.
INSERT INTO public.profiles (id, email, full_name, current_week, days_per_week)
SELECT
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name',
  1,
  CASE
    WHEN (u.raw_user_meta_data->>'days_per_week') IN ('3', '4', '5')
      THEN (u.raw_user_meta_data->>'days_per_week')::SMALLINT
    ELSE 5
  END
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Fill in email / full_name / days_per_week on pre-existing rows.
UPDATE public.profiles p
SET
  email         = COALESCE(p.email, u.email),
  full_name     = COALESCE(p.full_name, u.raw_user_meta_data->>'full_name'),
  days_per_week = COALESCE(p.days_per_week, 5)
FROM auth.users u
WHERE u.id = p.id
  AND (p.email IS NULL OR p.full_name IS NULL OR p.days_per_week IS NULL);

-- 3. Correct signup trigger --------------------------------------------------
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
    INSERT INTO public.profiles (id, email, full_name, username, days_per_week)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      v_username,
      v_days
    )
    -- Inside ON CONFLICT DO UPDATE the existing row is referenced by the bare
    -- table name; schema-qualifying it is a syntax error.
    ON CONFLICT (id) DO UPDATE SET
      email         = COALESCE(profiles.email, EXCLUDED.email),
      full_name     = COALESCE(profiles.full_name, EXCLUDED.full_name),
      days_per_week = COALESCE(profiles.days_per_week, EXCLUDED.days_per_week);
  EXCEPTION WHEN unique_violation THEN
    -- username is UNIQUE: two users can share an email prefix. Retry without it
    -- rather than losing the profile.
    INSERT INTO public.profiles (id, email, full_name, days_per_week)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      v_days
    )
    ON CONFLICT (id) DO NOTHING;
  END;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Never block account creation for profile bookkeeping; the app recreates a
  -- missing profile on first login.
  RAISE WARNING 'handle_new_user failed for %: %', new.id, SQLERRM;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
