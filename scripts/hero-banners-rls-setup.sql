-- Hero Banners RLS Policy Setup SQL
-- Run ini di Supabase SQL Editor untuk memastikan RLS policy sudah benar

-- 1. Enable RLS on hero_banners table
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (jika ada yang error)
DROP POLICY IF EXISTS "Allow public read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role create hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role update hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role delete hero_banners" ON hero_banners;

-- 3. Create public read policy
CREATE POLICY "Allow public read hero_banners"
ON hero_banners
FOR SELECT
USING (is_active = true);

-- 4. Create service role policies
CREATE POLICY "Allow service role create hero_banners"
ON hero_banners
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow service role update hero_banners"
ON hero_banners
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service role delete hero_banners"
ON hero_banners
FOR DELETE
USING (true);

-- Verify: Check existing policies
SELECT schemaname, tablename, policyname, cmd, QUAL, WITH_CHECK 
FROM pg_policies 
WHERE tablename = 'hero_banners' 
ORDER BY policyname;
