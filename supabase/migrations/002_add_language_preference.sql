-- Add language preference to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'ar'));

-- Add comment for documentation
COMMENT ON COLUMN profiles.language_preference IS 'User interface language preference: en (English) or ar (Arabic)';
