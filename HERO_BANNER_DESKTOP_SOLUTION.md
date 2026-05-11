# 🚨 HERO BANNER DESKTOP TIDAK TAMPIL - ANALISIS & SOLUSI

## 📌 Masalah

- ✅ Banner mobile tampil dengan baik
- ❌ Banner desktop TIDAK tampil
- ❌ Di admin panel sudah diganti tapi tetap error
- ❓ Kemungkinan masalah permission/security?

---

## 🔍 ROOT CAUSE ANALYSIS

Saya telah menganalisis dan menemukan **3 kemungkinan penyebab**:

### **1️⃣ PENYEBAB: RLS Policy Tidak Jelas untuk Anon Client**

**Penjelasan:**

- Supabase menggunakan RLS (Row Level Security) untuk keamanan database
- Ada policy lama yang namanya `"Allow public read hero_banners"` yang ambigu
- Tidak jelas apakah ini untuk anon atau authenticated users
- Ini bisa menyebabkan anon client tidak bisa read data

**Bukti:**

```sql
-- Policy lama (ambigu)
CREATE POLICY "Allow public read hero_banners"
ON hero_banners
FOR SELECT
USING (is_active = true);
```

**Solusi:**
✅ Ganti dengan policy yang jelas:

```sql
CREATE POLICY "Allow anon read hero_banners"
ON hero_banners
FOR SELECT
USING (is_active = true);
```

---

### **2️⃣ PENYEBAB: Banner Desktop Tidak Ada atau `is_active = false`**

**Penjelasan:**

- Query hanya fetch banner dengan `is_active = true`
- Jika banner desktop tidak aktif, tidak akan di-fetch
- User bilang "di admin panel sudah diganti" tapi tetap error
- Mungkin banner baru dibuat tapi tidak set `is_active = true`

**Cara Cek:**

```sql
SELECT id, device_type, is_active, image_url
FROM hero_banners
WHERE device_type = 'desktop';
```

**Expected Output:**

```
id    | device_type | is_active | image_url
------|-------------|-----------|----------
uuid1 | desktop     | true      | https://...
uuid2 | desktop     | true      | https://...
```

**Jika kosong atau `is_active = false` ❌ = INI MASALAHNYA!**

---

### **3️⃣ PENYEBAB: Device Type Tidak Sesuai atau Ada Typo**

**Penjelasan:**

- Component HeroSection filter berdasarkan `device_type === "desktop"`
- Jika di database ada typo (misal: "Desktop" dengan capital D), tidak akan match
- Python case-sensitive!

**Cara Cek:**

```sql
SELECT DISTINCT device_type
FROM hero_banners
ORDER BY device_type;
```

**Expected Output:**

```
device_type
-----------
desktop
mobile
```

**Jika ada typo seperti "DESKTOP" atau "Desktop" ❌ = MASALAHNYA!**

---

## ✅ SOLUSI YANG SUDAH DILAKUKAN

### **Perbaikan 1: Update RLS Setup Script**

- 📝 File: `scripts/hero-banners-rls-setup.sql`
- ✅ Changed: `"Allow public read hero_banners"` → `"Allow anon read hero_banners"`
- ✅ Added: Explicit `DROP POLICY` untuk avoid conflicts

### **Perbaikan 2: Enhanced Debug Logging**

- 📝 File: `components/HeroSection.tsx`
- ✅ Added: Emoji icons (✅, ❌, 🔍) untuk clarity di console
- ✅ Added: Full data dump ketika tidak ada banner
- ✅ Added: Debug effect untuk show filtering logic

**Console Output Sebelum:**

```
Loading desktop banners...
Loaded 0 desktop banners
```

**Console Output Sesudah:**

```
Loading desktop banners...
❌ No desktop banners found. Device type: desktop
Full response was: []
🔍 Slide filtering debug: {
  totalSlides: 0,
  currentDeviceType: "desktop",
  desktopSlidesCount: 0,
  ...
}
```

---

## 🛠️ LANGKAH-LANGKAH PERBAIKAN

### **WAJIB DILAKUKAN - Langkah 1: Update RLS Policy**

1. Buka: https://app.supabase.com (Supabase Dashboard)
2. Pilih project Anda → SQL Editor
3. Copy-paste SEMUA script dari:
   ```
   scripts/hero-banners-rls-setup.sql
   ```
4. Klik tombol **Run** (jangan Copy-Paste ke console biasa)
5. ⏳ Tunggu sampai selesai
6. ✅ Pastikan tidak ada error message

**Script yang akan dijalankan:**

```sql
-- 1. Enable RLS
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- 2. Drop policies lama
DROP POLICY IF EXISTS "Allow public read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow anon read hero_banners" ON hero_banners;
-- dst...

-- 3. Create new policy
CREATE POLICY "Allow anon read hero_banners"
ON hero_banners
FOR SELECT
USING (is_active = true);

-- 4. Verify
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'hero_banners';
```

---

### **WAJIB DILAKUKAN - Langkah 2: Verifikasi Data di Database**

1. Tetap di SQL Editor (Supabase)
2. Jalankan query ini:

   ```sql
   SELECT id, device_type, is_active, order, image_url, created_at
   FROM hero_banners
   ORDER BY device_type, order;
   ```

3. **Cek hasil:**
   - ✅ Ada row dengan `device_type = 'desktop'` ?
   - ✅ `is_active = true` untuk desktop banner?
   - ✅ `image_url` valid dan tidak kosong?

4. **Jika tidak ada data desktop:**
   - Insert data baru:

   ```sql
   INSERT INTO hero_banners (image_url, device_type, is_active, order)
   VALUES (
     'https://your-image-url.jpg',  -- GANTI dengan URL image asli
     'desktop',
     true,
     1
   );
   ```

5. **Jika ada tapi `is_active = false`:**
   - Update menjadi true:

   ```sql
   UPDATE hero_banners
   SET is_active = true
   WHERE device_type = 'desktop';
   ```

6. **Jika device_type typo:**
   - Fix typo:
   ```sql
   UPDATE hero_banners
   SET device_type = 'desktop'
   WHERE device_type ILIKE '%desktop%';
   ```

---

### **Langkah 3: Restart Dev Server**

```bash
# Jika menggunakan pnpm:
pnpm dev

# Jika menggunakan npm:
npm run dev
```

⏳ Tunggu sampai dev server jalan lagi (biasanya 10-30 detik)

---

### **Langkah 4: Test di Browser**

1. Buka website di browser (pastikan desktop view, bukan mobile)
   - Resize window atau buka di desktop screen
   - Atau tekan F12 → Toggle device toolbar → Pilih "Desktop"

2. Buka DevTools:
   - Tekan **F12**
   - Pergi ke tab **Console**

3. Refresh halaman (F5)

4. Cek console log:

   ```
   ✅ Jika lihat: "✅ Loaded X desktop banners: [...]"
      = SUKSES! Banner sudah muncul

   ❌ Jika lihat: "❌ No desktop banners found"
      = Ada masalah, lanjut ke Langkah 5
   ```

5. Visual check:
   - ✅ Ada carousel banner dengan indikator dots di bawah?
   - ✅ Ada chevron left-right buttons?
   - ✅ Ada search form di atas banner?

---

### **Langkah 5: Debug Network Request (Jika Masih Tidak Work)**

1. DevTools masih terbuka di browser
2. Pergi ke tab **Network**
3. Refresh halaman
4. Cari request ke: `/api/admin/hero-banners?device_type=desktop`
5. Klik request tersebut
6. Lihat tab **Response**:
   ```json
   {
     "success": true,
     "data": [
       {
         "id": "...",
         "image_url": "...",
         "device_type": "desktop",
         "is_active": true
       }
     ]
   }
   ```

**Jika response empty atau error:**

- Cek pesan error di Response
- Buka Supabase logs: Project Settings → Logs
- Cari entry yang error

---

## 🧪 TESTING CHECKLIST

Setelah semua langkah, pastikan:

- [ ] ✅ RLS policy sudah di-update (no error di Supabase SQL Editor)
- [ ] ✅ Ada minimal 1 banner dengan `device_type = 'desktop'` dan `is_active = true`
- [ ] ✅ Dev server sudah di-restart
- [ ] ✅ Console show "✅ Loaded X desktop banners"
- [ ] ✅ Visual: Hero banner carousel muncul di halaman
- [ ] ✅ Visual: Indikator dots, chevron buttons, search form muncul
- [ ] ✅ Network: API response show `"success": true` dengan data

---

## 🆘 JIKA MASIH TIDAK WORK

Silakan provide:

1. **Console log screenshot** - Apa yang muncul di F12 → Console tab?
2. **Network response screenshot** - Apa yang return `/api/admin/hero-banners?device_type=desktop`?
3. **Database query result** - Hasil dari:
   ```sql
   SELECT * FROM hero_banners WHERE device_type = 'desktop';
   ```
4. **RLS policies list** - Hasil dari:
   ```sql
   SELECT policyname, cmd
   FROM pg_policies
   WHERE tablename = 'hero_banners';
   ```

---

## 📚 REFERENCE

### Mobile Banners Berhasil = Apa yang Berbeda?

**Hypothetical:**

- Mobile banners ada di database dan `is_active = true`
- RLS policy read permission sama
- Filtering logic sama

**Why desktop gagal tapi mobile ok?**
Kemungkinan besar:

1. Desktop banner tidak ada di database
2. Desktop banner `is_active = false`
3. Desktop banner `device_type` typo

**Solution:** Follow langkah-langkah di atas untuk verify & fix.

---

## 💡 TIPS

- **Jangan restart Supabase**, cukup update SQL
- **Jangan bersihkan browser cache**, biasanya tidak perlu
- **API cache = no-store**, jadi tidak perlu khawatir stale data
- **Supabase logs** sangat membantu debug: https://app.supabase.com → Logs
