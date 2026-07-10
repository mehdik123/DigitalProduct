-- =============================================================================
-- 014_days_per_week.sql
-- Let each client pick their training frequency (3, 4, or 5 days/week) at signup.
-- The choice is PERMANENT: once set it can never be changed.
-- Safe to run multiple times.
-- =============================================================================

-- 1. Column: days_per_week on profiles ---------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS days_per_week SMALLINT;

-- Existing accounts (created before this feature) default to the 5-day program.
UPDATE profiles SET days_per_week = 5 WHERE days_per_week IS NULL;

-- Only 3, 4 or 5 are valid (NULL allowed transiently before the trigger fills it).
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_days_per_week_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_days_per_week_check
  CHECK (days_per_week IS NULL OR days_per_week IN (3, 4, 5));

-- 2. Signup: capture the choice from auth metadata ---------------------------
-- The client passes { full_name, days_per_week } in the signUp metadata; the
-- profile row is created by this trigger, so read days_per_week here (default 5).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_days SMALLINT;
BEGIN
  v_days := NULLIF(new.raw_user_meta_data->>'days_per_week', '')::SMALLINT;
  IF v_days IS NULL OR v_days NOT IN (3, 4, 5) THEN
    v_days := 5;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, username, days_per_week)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    v_days
  )
  ON CONFLICT (id) DO UPDATE
    SET days_per_week = COALESCE(public.profiles.days_per_week, EXCLUDED.days_per_week);

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Irreversibility: block any change once a value is set --------------------
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

DROP TRIGGER IF EXISTS trg_days_per_week_immutable ON profiles;
CREATE TRIGGER trg_days_per_week_immutable
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.enforce_days_per_week_immutable();
