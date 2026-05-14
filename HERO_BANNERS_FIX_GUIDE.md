# 🔧 PANDUAN FIX HERO BANNERS - PRODUCTION IMAGE URLS

## 📋 MASALAH

- Gambar di production hanya tampil di localhost
- Image URLs tidak support absolute URL dari production

## ✅ SOLUSI

### STEP 1: Backup Data Lama (OPTIONAL)

Jika ingin backup data lama sebelum drop, jalankan di SQL Editor Supabase:

```sql
-- BACKUP dulu data lama (OPTIONAL)
SELECT * INTO hero_banners_backup FROM public.hero_banners;
```

---

### STEP 2: DROP & CREATE TABLE BARU

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Klik **"New Query"** atau buat tab baru
3. **COPY PASTE** seluruh kode dari file: `HERO_BANNERS_QUICK_FIX.sql`
4. Klik **"RUN"** (tombol play biru di kanan)
5. Tunggu hingga sukses ✅

---

### STEP 3: INSERT DATA SAMPLE (PRODUCTION URLS)

Setelah table dibuat, INSERT data dengan production URLs:

```sql
-- DESKTOP BANNERS (1900x720 pixels)
INSERT INTO public.hero_banners (image_url, device_type, order, is_active) VALUES
  ('https://your-domain.com/images/banner-desktop-1.jpg', 'desktop', 1, true),
  ('https://your-domain.com/images/banner-desktop-2.jpg', 'desktop', 2, true);

-- MOBILE BANNERS (540x2760 pixels)
INSERT INTO public.hero_banners (image_url, device_type, order, is_active) VALUES
  ('https://your-domain.com/images/banner-mobile-1.jpg', 'mobile', 1, true),
  ('https://your-domain.com/images/banner-mobile-2.jpg', 'mobile', 2, true);
```

**GANTI `https://your-domain.com/images/` dengan URL ANDA yang benar!**

---

### STEP 4: VERIFIKASI

Jalankan query ini untuk cek apakah data sudah ter-insert:

```sql
SELECT id, device_type, order, is_active, image_url FROM public.hero_banners;
```

---

## 📌 PENTING - IMAGE URL FORMAT

### ✅ FORMAT YANG BENAR (PRODUCTION):

**Option A: Supabase Public Storage**

```
https://abc123.supabase.co/storage/v1/object/public/hero-banners/banner.jpg
```

**Option B: External CDN / Custom Domain**

```
https://your-domain.com/images/banner.jpg
https://cdn.your-domain.com/banner.jpg
https://res.cloudinary.com/your-cloud/image/upload/banner.jpg
```

**Option C: External Image Services**

```
https://images.unsplash.com/photo-xxxxx?w=1900&h=720&fit=crop
```

### ❌ FORMAT YANG SALAH (HANYA LOCALHOST):

```
/storage/v1/object/public/hero-banners/banner.jpg  ❌ RELATIF PATH
http://localhost:3000/banner.jpg                   ❌ LOCALHOST
/images/banner.jpg                                 ❌ RELATIF PATH
```

---

## 🚀 TROUBLESHOOTING

### ❓ Gambar masih tidak muncul di production?

**Cek #1: Pastikan URL ABSOLUTE (dimulai dengan https://)**

```sql
SELECT image_url FROM public.hero_banners LIMIT 1;
-- Harus return: https://your-domain.com/...
-- Bukan: /storage/v1/object/public/...
```

**Cek #2: Pastikan CORS permission di Supabase**
Settings → API → CORS

**Cek #3: Pastikan image_url tidak kosong**

```sql
SELECT id, image_url, is_active
FROM public.hero_banners
WHERE image_url IS NULL OR image_url = '';
```

---

## 📂 STRUKTUR TABLE BARU

| Column        | Type      | Keterangan              |
| ------------- | --------- | ----------------------- |
| `id`          | UUID      | Primary key             |
| `image_url`   | TEXT      | **HARUS ABSOLUTE URL!** |
| `device_type` | VARCHAR   | 'desktop' atau 'mobile' |
| `order`       | INTEGER   | Urutan tampil           |
| `is_active`   | BOOLEAN   | Aktif atau tidak        |
| `created_at`  | TIMESTAMP | Otomatis                |
| `updated_at`  | TIMESTAMP | Otomatis                |

---

## 🔗 ENVIRONMENT VARIABLES

Pastikan `.env.local` sudah set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## ✨ DONE!

Setelah selesai, buka website Anda dan cek apakah gambar sudah muncul di production! 🎉

Jika masih ada masalah, cek browser console (F12) untuk error message.
