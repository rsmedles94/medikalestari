# 🔧 HERO BANNER PRODUCTION FIX - CHECKLIST

## ✅ PERBAIKAN YANG SUDAH DILAKUKAN:

### 1. **Improved Error Logging**

- ✅ Better console logs di `fetchHeroBanners()` untuk debugging
- ✅ Tambah context detail di HeroSection untuk tracking issues

### 2. **Debug Endpoint**

- ✅ Buat `/api/admin/debug-banners` untuk cek status database
  - Endpoint ini menampilkan:
    - Total banners
    - Active banners count
    - Count per device type
    - Semua data banners

### 3. **Admin Page**

- ✅ Page sudah ada di `/admin/hero` untuk manage banners

---

## 🔍 LANGKAH DIAGNOSIS (TO THE POINT):

### Step 1: Check Status Database

```bash
# Buka: https://yoursite.com/api/admin/debug-banners
# Lihat response JSON untuk cek:
# - Apakah ada banners di database?
# - Apakah is_active = true?
# - Apakah ada device_type yang sesuai?
```

### Step 2: Cek di Admin Panel

```bash
# Buka: https://yoursite.com/admin/hero
# Lihat apakah ada banner yang sudah upload
# Pastikan is_active = true
```

### Step 3: Manual Add Test Banner

```bash
# Jika kosong, gunakan POST ke /api/admin/hero-banners:
curl -X POST https://yoursite.com/api/admin/hero-banners \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://via.placeholder.com/1900x720",
    "order": 1,
    "is_active": true,
    "device_type": "desktop"
  }'
```

---

## 📋 POSSIBLE ROOT CAUSES (In Order):

### 1. **NO DATA IN DATABASE** (Most Common)

- `hero_banners` table empty
- **Fix:** Upload banners via admin panel atau manual POST request

### 2. **ALL BANNERS SET TO is_active = false**

- Banners ada tapi sedang inactive
- **Fix:** Set `is_active = true` di database atau admin panel

### 3. **WRONG device_type**

- Desktop banners tidak upload, hanya mobile (atau sebaliknya)
- **Fix:** Upload banners untuk device type yang dibutuhkan

### 4. **IMAGE URL INVALID**

- Banners ada tapi URL tidak accessible
- **Fix:** Pastikan image_url publik dan CORS enabled

### 5. **ENVIRONMENT VARIABLES**

- NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY missing
- **Fix:** Set env vars di vercel/hosting platform

---

## 🚀 QUICK FIX STEPS:

1. **Cek debug endpoint**

   ```
   GET /api/admin/debug-banners
   ```

2. **Login ke admin panel**

   ```
   /admin/hero
   ```

3. **Upload minimal 1 banner** untuk desktop dan mobile

4. **Set is_active = true**

5. **Refresh main page** - Harus muncul sekarang!

---

## 📝 NOTES:

- Localhost: Data bisa jalan karena mungkin ada test data
- Production: Data berbeda, perlu re-upload atau sync dari backup
- Hero banner fallback yang bener: Tutup section, tapi search bar tetap visible (done!)
