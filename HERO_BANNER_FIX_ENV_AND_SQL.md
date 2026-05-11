# 🔧 PERBAIKAN HERO BANNER - ENV + SQL (Siap Pakai)

## 🚨 MASALAH TERIDENTIFIKASI

```
Error: Gagal menghapus banner: SUPABASE_SERVICE_ROLE_KEY is not set
```

**Root Cause**: `SUPABASE_SERVICE_ROLE_KEY` tidak ada di `.env.local`

---

## ✅ SOLUSI LENGKAP (Lakukan Berurutan)

### **LANGKAH 1: Setup Environment Variables**

**File**: `.env.local` (di root project)

1. Buka file `.env.local`
2. Pastikan sudah ada 3 variable ini:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cara dapatkan key-nya:**

1. Buka: https://app.supabase.com
2. Login ke project Anda
3. Pergi ke: **Settings** (gear icon) → **API**
4. Lihat section **Project API keys**:
   - Copy `anon public` → paste ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role secret` → paste ke `SUPABASE_SERVICE_ROLE_KEY`
5. `NEXT_PUBLIC_SUPABASE_URL` sudah ada atau copy dari Supabase dashboard

**⚠️ PENTING**:

- File `.env.local` HARUS di `.gitignore` (jangan commit!)
- Jangan share key-nya dengan siapapun
- Bisa cek apakah sudah di gitignore dengan: `git check-ignore .env.local`

**Setelah update `.env.local`:**

- ❌ Jangan lanjut ke step 2
- ⏹️ Stop dev server (Ctrl+C)
- ▶️ Jalankan lagi: `pnpm dev`

---

### **LANGKAH 2: Setup RLS Policy & Data (Pilih A atau B)**

#### **PILIHAN A: Jika Banner Desktop Sudah Ada di Database**

**Buka Supabase SQL Editor dan jalankan query ini:**

```sql
-- Query 1: Enable RLS
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Query 2: Drop policies lama (jika ada)
DROP POLICY IF EXISTS "Allow public read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow anon read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role create hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role update hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role delete hero_banners" ON hero_banners;

-- Query 3: Create RLS Policy untuk Anon Read (untuk public access)
CREATE POLICY "Allow anon read hero_banners"
ON hero_banners
FOR SELECT
USING (is_active = true);

-- Query 4: Create RLS Policies untuk Service Role (untuk admin operations)
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

-- Query 5: Activate desktop banners yang sudah ada
UPDATE hero_banners
SET is_active = true
WHERE device_type = 'desktop';

-- Query 6: Verify - lihat banner desktop yang active
SELECT id, image_url, device_type, is_active, order
FROM hero_banners
WHERE device_type = 'desktop'
ORDER BY order;
```

**Expected Output Query 6:**

```
 id                   | image_url                      | device_type | is_active | order
----------------------|--------------------------------|-------------|-----------|-------
 550e8400-e29b-41d4...| https://xxx.jpg               | desktop     | true      | 1
 650e8400-e29b-41d4...| https://yyy.jpg               | desktop     | true      | 2
```

**Jika ada hasil ✅ = Lanjut ke LANGKAH 3**

---

#### **PILIHAN B: Jika Banner Desktop TIDAK Ada (Harus Insert Baru)**

**Buka Supabase SQL Editor dan jalankan query ini:**

```sql
-- Query 1: Enable RLS
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Query 2: Drop policies lama
DROP POLICY IF EXISTS "Allow public read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow anon read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role create hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role update hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role delete hero_banners" ON hero_banners;

-- Query 3: Create RLS Policies
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

-- Query 4: Insert contoh banner desktop (EDIT URL sesuai banner Anda)
INSERT INTO hero_banners (image_url, device_type, is_active, order)
VALUES
  ('https://your-domain.com/banner-desktop-1.jpg', 'desktop', true, 1),
  ('https://your-domain.com/banner-desktop-2.jpg', 'desktop', true, 2);

-- Query 5: Verify - lihat banner yang baru di-insert
SELECT id, image_url, device_type, is_active, order
FROM hero_banners
WHERE device_type = 'desktop'
ORDER BY order;
```

**PENTING**: Ganti `https://your-domain.com/banner-desktop-X.jpg` dengan URL image asli Anda!

**Expected Output Query 5:**

```
 id                   | image_url                      | device_type | is_active | order
----------------------|--------------------------------|-------------|-----------|-------
 550e8400-e29b-41d4...| https://your-domain.com/...   | desktop     | true      | 1
 650e8400-e29b-41d4...| https://your-domain.com/...   | desktop     | true      | 2
```

**Jika ada hasil ✅ = Lanjut ke LANGKAH 3**

---

### **LANGKAH 3: Test & Verify**

**Test 1: Verify RLS Policy**

```sql
-- Lihat semua policies untuk hero_banners
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'hero_banners'
ORDER BY policyname;
```

**Expected Output** (harus ada 4 policies):

```
 policyname                          | cmd    | qual                 | with_check
-------------------------------------|--------|----------------------|-----------
 Allow anon read hero_banners        | SELECT | (is_active = true)   |
 Allow service role create...        | INSERT |                      | true
 Allow service role delete...        | DELETE | true                 |
 Allow service role update...        | UPDATE | true                 | true
```

---

**Test 2: Verify Desktop Banners**

```sql
-- Cek total banner
SELECT device_type, COUNT(*) as total, SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active
FROM hero_banners
GROUP BY device_type;
```

**Expected Output**:

```
 device_type | total | active
-------------|-------|-------
 desktop     | 2     | 2
 mobile      | 2     | 2
```

---

### **LANGKAH 4: Restart & Test di Website**

1. **Restart Dev Server:**

   ```bash
   # Tekan Ctrl+C untuk stop
   # Lalu jalankan:
   pnpm dev
   ```

2. **Test di Browser:**
   - Buka: http://localhost:3000
   - Ukuran: Desktop (F12 → toggle device → Desktop)
   - Buka Console (F12)
   - Refresh halaman

3. **Cek Console Log:**

   ```
   ✅ BERHASIL: Lihat log "✅ Loaded X desktop banners: [...]"
   ❌ GAGAL: Lihat log "❌ No desktop banners found"
   ```

4. **Visual Check:**
   - ✅ Hero banner carousel muncul?
   - ✅ Indikator dots ada?
   - ✅ Search form ada?

---

## 🧪 OPTIONAL: Test API Direct

**Di terminal, jalankan:**

```bash
curl -s "http://localhost:3000/api/admin/hero-banners?device_type=desktop" | jq '.'
```

**Expected Output:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "image_url": "https://your-domain.com/banner.jpg",
      "device_type": "desktop",
      "is_active": true,
      "order": 1,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## ✅ CHECKLIST FINAL

Setelah semua langkah di atas, pastikan:

- [ ] `.env.local` punya 3 variable (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Dev server di-restart
- [ ] RLS policies sudah di-create di Supabase (cek dengan Query di Test 1)
- [ ] Banner desktop ada di database dan is_active = true (cek dengan Query di Test 2)
- [ ] Console log show "✅ Loaded X desktop banners"
- [ ] Hero banner carousel visible di homepage
- [ ] API response `/api/admin/hero-banners?device_type=desktop` return data

---

## 🆘 JIKA MASIH ERROR

**Error: `SUPABASE_SERVICE_ROLE_KEY is not set`**

- ✅ Pastikan sudah update `.env.local`
- ✅ Pastikan dev server di-restart
- ✅ Pastikan tidak ada typo di variable name

**Error: `Policy already exists`**

- ✅ Jalankan `DROP POLICY` query dulu
- ✅ Tunggu selesai, baru jalankan `CREATE POLICY`

**Masih tidak muncul di website**

- ✅ Cek console log di F12
- ✅ Cek database punya data (Query Test 2)
- ✅ Cek RLS policies (Query Test 1)
- ✅ Clear browser cache (Ctrl+Shift+Delete)

---

## 📝 NOTES

- `.env.local` HARUS di `.gitignore` - jangan commit!
- Service role key sangat sensitive - jangan share!
- Bisa test di mode incognito untuk bypass cache
- Jika pake Supabase Self-Hosted, URL mungkin berbeda

---

## 🎯 SUMMARY

Jika semua langkah sudah dilakukan:

1. ✅ Environment variable setup (fixes delete/update error)
2. ✅ RLS policy proper setup (fixes permission)
3. ✅ Data ada di database (fixes no data)
4. ✅ Dev server restart (refresh configuration)

**Hasil**: Hero banner desktop akan muncul! 🎉
