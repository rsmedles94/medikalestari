# 🔧 SQL FIX: Setup RLS & Activate Banner Desktop

**Copy-paste semua query ini ke Supabase SQL Editor dan klik RUN**

---

## 📋 QUERY UNTUK SETUP RLS & DATA

```sql
-- Enable RLS
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Drop policies lama
DROP POLICY IF EXISTS "Allow public read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow anon read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role create hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role update hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role delete hero_banners" ON hero_banners;

-- Create RLS policies
CREATE POLICY "Allow anon read hero_banners"
ON hero_banners
FOR SELECT
USING (is_active = true);

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

-- Activate all desktop banners
UPDATE hero_banners
SET is_active = true
WHERE device_type = 'desktop';

-- Verify
SELECT id, image_url, device_type, is_active, "order"
FROM hero_banners
WHERE device_type = 'desktop'
ORDER BY "order";
```

---

## 🎯 CARA MENGGUNAKAN

1. Buka: https://app.supabase.com → Project → SQL Editor
2. Copy-paste semua query di atas
3. Klik tombol **RUN**
4. Tunggu selesai (pastikan tidak ada error)

✅ Done! Hero banner desktop sekarang aktif.
