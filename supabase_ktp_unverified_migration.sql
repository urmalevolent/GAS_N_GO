-- Add 'unverified' to the ENUM values for account_status
-- Since Supabase is PostgreSQL, we just drop the CHECK constraint and recreate it.

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_account_status_check;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_account_status_check 
  CHECK (account_status IN ('unverified', 'pending', 'verified', 'rejected'));

-- Update default value
ALTER TABLE public.profiles ALTER COLUMN account_status SET DEFAULT 'unverified';

-- Update existing profiles that are 'pending' but have NO ktp_photo_url to 'unverified'
UPDATE public.profiles
SET account_status = 'unverified'
WHERE account_status = 'pending' AND (ktp_photo_url IS NULL OR ktp_photo_url = '');
