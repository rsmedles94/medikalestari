-- ============================================================
-- HERO BANNER - RLS SETUP SQL (COPY-PASTE READY)
-- ============================================================
-- File ini untuk setup RLS policies agar hero banners bisa
-- diakses di production dengan benar
-- ============================================================

-- STEP 1: Enable RLS on hero_banners table
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- STEP 2: DROP existing policies (untuk cleanup)
DROP POLICY IF EXISTS "Allow public read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow anon read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role CRUD hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role create hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role update hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role delete hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow anon read active hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role all operations on hero_banners" ON hero_banners;

-- STEP 3: Create policy untuk ANON READ (public/frontend akses)
-- Hanya bisa membaca banner yang is_active = true
CREATE POLICY "Allow anon read active hero_banners"
ON hero_banners
FOR SELECT
TO anon
USING (is_active = true);

-- STEP 4: Create policy untuk SERVICE ROLE CRUD (admin operations)
-- Service role bisa MEMBACA, MEMBUAT, UPDATE, DELETE tanpa batasan
CREATE POLICY "Allow service role all operations on hero_banners"
ON hero_banners
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- STEP 5: Activate ALL existing banners
-- Set is_active = true untuk semua banner yang sudah ada
UPDATE hero_banners
SET is_active = true
WHERE is_active IS NOT NULL OR is_active IS NULL;

-- STEP 6: Verify - lihat berapa banner yang active
SELECT 
  id,
  image_url,
  device_type,
  is_active,
  "order",
  created_at
FROM hero_banners
WHERE is_active = true
ORDER BY device_type, "order" ASC;

-- STEP 7: If no banners found, insert sample data untuk testing
-- Uncomment kalau perlu insert data baru
/*
INSERT INTO hero_banners (image_url, device_type, is_active, "order")
VALUES 
  ('/mcu.png', 'desktop', true, 1),
  ('/mcu.png', 'mobile', true, 1);
*/
