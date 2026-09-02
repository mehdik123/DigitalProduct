-- Allow French as a UI language.
--
-- 002_add_language_preference.sql restricted language_preference to ('en','ar'),
-- so saving 'fr' failed. The client does not surface that error, so the choice
-- was silently lost on reload.

ALTER TABLE public.profiles
    DROP CONSTRAINT IF EXISTS profiles_language_preference_check;

ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_language_preference_check
    CHECK (language_preference IN ('en', 'ar', 'fr'));

COMMENT ON COLUMN public.profiles.language_preference IS
    'User interface language: en (English), ar (Moroccan Darija) or fr (French)';
