-- ===== HERO BANNERS RLS CONFIGURATION =====
-- Jalankan di Supabase SQL Editor: https://app.supabase.com

-- STEP 1: Enable RLS on hero_banners table
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- STEP 2: Drop existing policies
DROP POLICY IF EXISTS "Allow public read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role create hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role update hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role delete hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow anon read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow anon read active hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role all operations on hero_banners" ON hero_banners;

-- STEP 3: Create policy - Allow anon to read ACTIVE banners only
CREATE POLICY "Allow anon read active hero_banners"
ON hero_banners
FOR SELECT
TO anon
USING (is_active = true);

-- STEP 4: Create policy - Allow service_role to do ALL operations (bypass RLS)
CREATE POLICY "Allow service role all operations on hero_banners"
ON hero_banners
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- STEP 5: Activate existing banners
UPDATE hero_banners
SET is_active = true
WHERE device_type IN ('desktop', 'mobile');

-- STEP 6: Verify (should show at least 1 desktop and 1 mobile)
SELECT id, image_url, device_type, is_active, created_at
FROM hero_banners
WHERE is_active = true
ORDER BY device_type, "order" ASC;
