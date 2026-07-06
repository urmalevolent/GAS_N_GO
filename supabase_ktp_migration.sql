-- Migration script to add KTP verification fields to profiles table

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS ktp_photo_url TEXT,
ADD COLUMN IF NOT EXISTS nik TEXT,
ADD COLUMN IF NOT EXISTS tempat_lahir TEXT,
ADD COLUMN IF NOT EXISTS tanggal_lahir DATE,
ADD COLUMN IF NOT EXISTS jenis_kelamin TEXT,
ADD COLUMN IF NOT EXISTS alamat TEXT,
ADD COLUMN IF NOT EXISTS rt_rw TEXT,
ADD COLUMN IF NOT EXISTS kecamatan TEXT,
ADD COLUMN IF NOT EXISTS agama TEXT,
ADD COLUMN IF NOT EXISTS status_perkawinan TEXT,
ADD COLUMN IF NOT EXISTS pekerjaan TEXT,
ADD COLUMN IF NOT EXISTS kewarganegaraan TEXT,
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'pending';

-- Update existing users to be verified if needed, or leave them pending
-- UPDATE public.profiles SET account_status = 'verified' WHERE account_status = 'pending';

-- You also need to create a storage bucket in Supabase called 'ktp_documents'
-- and set its visibility to public or private depending on your security needs.
-- Example SQL to create bucket if you have access to storage schema:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ktp_documents', 'ktp_documents', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for storage to allow authenticated users to upload their KTP
-- and admins to read them
CREATE POLICY "Allow authenticated users to upload KTP" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'ktp_documents');

CREATE POLICY "Allow authenticated users to read KTP" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'ktp_documents');
