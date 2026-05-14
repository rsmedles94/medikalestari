-- Fix storage permissions untuk hero-banners
-- Jalankan ini di SQL Editor Supabase

-- Hapus policy lama jika ada
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to read" ON storage.objects;

-- Create public read policy untuk bucket content
CREATE POLICY "Public read for content" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'content' AND auth.role() = 'anon');

-- Create write policy untuk admin (via service role)
CREATE POLICY "Service role write" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'content' AND auth.role() = 'service_role');

-- Update delete policy
CREATE POLICY "Service role delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'content' AND auth.role() = 'service_role');
