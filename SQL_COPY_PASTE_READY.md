# 📋 SQL SIAP PAKAI - COPY-PASTE KE SUPABASE SQL EDITOR

> **Gunakan file ini jika sudah setup `.env.local` dengan SUPABASE_SERVICE_ROLE_KEY**

---

## 🚀 QUICK START

1. ✅ Pastikan sudah setup `.env.local` (lihat: `ENV_LOCAL_SETUP.md`)
2. ✅ Buka Supabase Dashboard → SQL Editor
3. ✅ Copy-paste SQL di bawah sesuai kebutuhan
4. ✅ Klik tombol **RUN** (jangan copy ke console biasa)
5. ✅ Lihat output, pastikan tidak ada error
6. ✅ Restart dev server

---

## 📌 KASUS 1: RLS Setup Lengkap (Pertama Kali)

**Gunakan jika:**

- Baru pertama kali setup hero banners
- Policies belum ada atau error

**SQL:**

```sql
-- ============================================================
-- STEP 1: Enable RLS (biar database lebih secure)
-- ============================================================
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 2: Hapus policies lama (jangan sampai konflik)
-- ============================================================
DROP POLICY IF EXISTS "Allow public read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow anon read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role create hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role update hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role delete hero_banners" ON hero_banners;

-- ============================================================
-- STEP 3: Buat policy untuk anon read (public homepage)
-- ============================================================
CREATE POLICY "Allow anon read hero_banners"
ON hero_banners
FOR SELECT
USING (is_active = true);

-- ============================================================
-- STEP 4: Buat policies untuk admin operations
-- ============================================================
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

-- ============================================================
-- STEP 5: Verify - pastikan policies sudah benar
-- ============================================================
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'hero_banners'
ORDER BY policyname;
```

**Expected Output Step 5:**

```
policyname                                 cmd
-----------                                ---
Allow anon read hero_banners              SELECT
Allow service role create hero_banners    INSERT
Allow service role delete hero_banners    DELETE
Allow service role update hero_banners    UPDATE
```

---

## 📌 KASUS 2: Activate Banner Desktop Lama

**Gunakan jika:**

- Banner desktop sudah ada di database
- Tapi tidak muncul atau `is_active = false`

**SQL:**

```sql
-- ============================================================
-- STEP 1: Aktifkan semua banner desktop
-- ============================================================
UPDATE hero_banners
SET is_active = true
WHERE device_type = 'desktop';

-- ============================================================
-- STEP 2: Verify - lihat berapa banner yang ter-update
-- ============================================================
SELECT id, image_url, device_type, is_active, "order"
FROM hero_banners
WHERE device_type = 'desktop'
ORDER BY "order";
```

**Expected Output:**

```
id                                   image_url                        device_type  is_active  order
--                                   --                               --           --         --
550e8400-e29b-41d4-a716-446655440000 https://...banner-1.jpg          desktop      true       1
650e8400-e29b-41d4-a716-446655440001 https://...banner-2.jpg          desktop      true       2
```

---

## 📌 KASUS 3: Insert Banner Desktop Baru

**Gunakan jika:**

- Tidak ada banner desktop di database
- Harus buat dari awal

**SQL (EDIT URL SESUAI GAMBAR ANDA):**

```sql
-- ============================================================
-- STEP 1: Insert banner desktop baru
-- CATATAN: Ganti URL dengan gambar asli Anda!
-- ============================================================
INSERT INTO hero_banners (image_url, device_type, is_active, "order")
VALUES
  ('https://your-domain.com/images/banner-desktop-1.jpg', 'desktop', true, 1),
  ('https://your-domain.com/images/banner-desktop-2.jpg', 'desktop', true, 2),
  ('https://your-domain.com/images/banner-desktop-3.jpg', 'desktop', true, 3);

-- ============================================================
-- STEP 2: Verify - lihat banner yang ter-insert
-- ============================================================
SELECT id, image_url, device_type, is_active, "order"
FROM hero_banners
WHERE device_type = 'desktop'
ORDER BY "order";
```

**Ganti URL:**

- `https://your-domain.com/images/banner-desktop-1.jpg`
- Dengan URL image asli Anda (dari Supabase Storage atau URL eksternal)

**Expected Output:**

```
id                                   image_url                        device_type  is_active  order
--                                   --                               --           --         --
uuid-generated-1                     https://your-domain.com/...      desktop      true       1
uuid-generated-2                     https://your-domain.com/...      desktop      true       2
uuid-generated-3                     https://your-domain.com/...      desktop      true       3
```

---

## 📌 KASUS 4: Fix Device Type Typo

**Gunakan jika:**

- Ada banner tapi device_type typo (misal: "DESKTOP" atau "Desktop")

**SQL:**

```sql
-- ============================================================
-- STEP 1: Fix typo ke yang benar
-- ============================================================
UPDATE hero_banners
SET device_type = 'desktop'
WHERE device_type ILIKE '%desktop%' AND device_type != 'desktop';

-- ============================================================
-- STEP 2: Verify - lihat banner desktop sekarang
-- ============================================================
SELECT id, device_type, is_active, "order"
FROM hero_banners
WHERE device_type = 'desktop'
ORDER BY "order";
```

---

## 📌 KASUS 5: Cek Status Lengkap

**Gunakan untuk:**

- Debug dan verify semuanya berjalan ok

**SQL:**

```sql
-- ============================================================
-- QUERY 1: Cek RLS Policies
-- ============================================================
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'hero_banners'
ORDER BY policyname;

-- ============================================================
-- QUERY 2: Cek Total Banner per Device Type
-- ============================================================
SELECT
  device_type,
  COUNT(*) as total,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active,
  SUM(CASE WHEN NOT is_active THEN 1 ELSE 0 END) as inactive
FROM hero_banners
GROUP BY device_type
ORDER BY device_type;

-- ============================================================
-- QUERY 3: Cek Detail Banner Desktop
-- ============================================================
SELECT id, image_url, is_active, "order", created_at
FROM hero_banners
WHERE device_type = 'desktop'
ORDER BY "order";

-- ============================================================
-- QUERY 4: Cek Detail Banner Mobile
-- ============================================================
SELECT id, image_url, is_active, "order", created_at
FROM hero_banners
WHERE device_type = 'mobile'
ORDER BY "order";
```

---

## ⚠️ COMMON MISTAKES

### ❌ **JANGAN**: Copy ke console biasa Supabase

```
SALAH! Jangan copy-paste ke search bar atau console browser!
```

### ✅ **BENAR**: Copy ke SQL Editor

```
Klik: Supabase → SQL Editor → Paste query → Klik RUN button
```

### ❌ **JANGAN**: Lupa restart dev server

```
SALAH! Harus restart pnpm dev setelah update .env.local!
```

### ✅ **BENAR**: Restart dev server

```
Stop: Ctrl+C
Start: pnpm dev
```

---

## 🧪 TESTING CHECKLIST

Setelah jalankan SQL:

- [ ] ✅ Step 1 jalan tanpa error
- [ ] ✅ Step 5 show 4 policies
- [ ] ✅ Desktop banners ada dan is_active = true
- [ ] ✅ Mobile banners ada dan is_active = true
- [ ] ✅ Dev server sudah di-restart
- [ ] ✅ Buka homepage, desktop banner muncul
- [ ] ✅ Buka admin panel, bisa delete/update tanpa error

---

## 🎯 EXPECTED RESULT

Setelah semua SQL jalan dan dev server restart:

✅ Homepage desktop view: Hero banner carousel muncul
✅ Admin panel: Bisa delete/update banner tanpa error "SERVICE_ROLE_KEY"
✅ Console log: Show "✅ Loaded X desktop banners"
✅ Mobile view: Tetap work seperti sebelumnya

---

## 🆘 JIKA ERROR

**Error: `syntax error`**

- Pastikan copy-paste SQL yang benar
- Jangan edit query yang tidak perlu
- Jalankan per-section jika ragu

**Error: `Policy already exists`**

- Berarti DROP POLICY tidak jalan
- Jalankan lagi dari STEP 2

**Error: `SUPABASE_SERVICE_ROLE_KEY is not set`**

- Ini di admin panel/API, bukan di SQL Editor
- Setup `.env.local` dulu! (lihat: `ENV_LOCAL_SETUP.md`)

---

## 💡 TIPS

- Jalankan QUERY 5 (Check Status) setelah selesai untuk verify
- Selalu backup sebelum delete/update banyak data
- Baca output error di Supabase dengan teliti
- Jika stuck, restart Supabase connection (refresh browser)
