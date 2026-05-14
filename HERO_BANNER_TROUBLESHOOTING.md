# 🔧 Troubleshooting Hero Banner di Produksi

## Masalah
Hero banner blank hitam di produksi, padahal di localhost tampil semua.

## Akar Masalah

Masalah ini biasanya terjadi karena:

### 1. **Konfigurasi Next.js Image tidak sesuai dengan Supabase URL**
   - File: `next.config.ts`
   - **Perbaikan yang sudah dilakukan:**
     - Update `pathname` dari `/storage/**` menjadi `/storage/v1/object/public/**`
     - Ini memastikan Next.js mengizinkan image dari bucket Supabase

### 2. **Image URL tidak dalam format lengkap**
   - Database menyimpan path seperti `/content/hero-banners/image.jpg`
   - Perlu di-construct menjadi full URL: `https://zecqskgvmfyorhxzhoeu.supabase.co/storage/v1/object/public/content/hero-banners/image.jpg`
   - **Perbaikan yang sudah dilakukan:**
     - Update `fetchHeroBanners()` untuk auto-construct URL jika belum lengkap

### 3. **Error Handling di Client**
   - Image gagal load tapi tidak ada error message yang jelas
   - **Perbaikan yang sudah dilakukan:**
     - Tambah `handleImageError()` untuk logging error
     - Skeleton tetap muncul jika image gagal load

### 4. **Next.config.ts Path Pattern**
   - Pattern `/storage/**` terlalu generic dan tidak spesifik ke Supabase format
   - **Perbaikan yang dilakukan:**
     - Ubah ke `/storage/v1/object/public/**` untuk lebih spesifik

## Perbaikan yang Sudah Dilakukan

### ✅ 1. Update `next.config.ts`
```typescript
// Dari:
pathname: "/storage/**",

// Menjadi:
pathname: "/storage/v1/object/public/**",
```

### ✅ 2. Update `lib/api.ts` - `fetchHeroBanners()`
- Auto-construct URL jika path tidak lengkap
- URL dari database: `/content/hero-banners/image.jpg`
- Menjadi: `https://zecqskgvmfyorhxzhoeu.supabase.co/storage/v1/object/public/content/hero-banners/image.jpg`

### ✅ 3. Create `lib/image-url-helper.ts`
- Helper functions untuk validate dan construct Supabase URLs
- `constructSupabaseImageUrl()` - build full URL
- `parseSupabaseStorageUrl()` - extract bucket & path
- `debugSupabaseImageUrl()` - debug URL issues

### ✅ 4. Update `components/HeroSection.tsx`
- Tambah `handleImageError()` untuk better error logging
- Improve error handling di image loading

## Cara Verify Perbaikan

### 1. **Check Console di Browser (F12)**
Cari log dari `[fetchHeroBanners]` dan `[HeroSection]`:
```
[fetchHeroBanners] ✅ Success - fetched 2 valid banners
[fetchHeroBanners] Starting fetch with config: {supabaseUrl: "SET", supabaseKey: "SET", deviceType: "desktop", ...}
```

### 2. **Check Image URLs di Production**
Di browser console, jalankan:
```javascript
// Check apakah image URL valid
const urls = document.querySelectorAll('img[src*="supabase"]');
urls.forEach(img => console.log(img.src, img.complete ? '✅ Loaded' : '❌ Failed'));
```

### 3. **Test di Localhost Dahulu**
```bash
# Run dev server
npm run dev
# atau
pnpm dev

# Buka http://localhost:3000
# Check console untuk verify image loading
```

### 4. **Build & Test Production Build Locally**
```bash
# Build
npm run build
# atau
pnpm build

# Start production build locally
npm run start
# atau
pnpm start

# Open http://localhost:3000
```

## Checklist Database

Pastikan di Supabase, tabel `hero_banners`:

```sql
SELECT id, image_url, device_type, is_active, "order" 
FROM hero_banners 
WHERE is_active = true 
ORDER BY "order" ASC;
```

**Harus memenuhi:**
1. ✅ Minimal satu row dengan `is_active = true` untuk `device_type = 'desktop'`
2. ✅ Minimal satu row dengan `is_active = true` untuk `device_type = 'mobile'`
3. ✅ `image_url` harus:
   - Relative path: `/bucket-name/folder/image.jpg` (akan di-construct di app)
   - ATAU full URL: `https://zecqskgvmfyorhxzhoeu.supabase.co/storage/v1/object/public/...`
4. ✅ Kolom `order` untuk menentukan urutan slide

### Contoh Data yang Benar:

```json
[
  {
    "id": "uuid-1",
    "image_url": "/content/hero-banners/banner-1.jpg",
    "device_type": "desktop",
    "is_active": true,
    "order": 1
  },
  {
    "id": "uuid-2",
    "image_url": "/content/hero-banners/banner-2.jpg",
    "device_type": "desktop",
    "is_active": true,
    "order": 2
  }
]
```

## Environment Variables Check

Pastikan di `.env.local` dan `.env.production`:

```bash
# REQUIRED - Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://zecqskgvmfyorhxzhoeu.supabase.co

# REQUIRED - Supabase anonymous key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Optional - Service role key untuk server-side operations
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Supabase Storage Bucket Permissions

Di Supabase Dashboard:
1. Go to **Storage** → **Buckets**
2. Select `content` bucket (atau nama bucket yang digunakan)
3. Click **Policies** / **Settings**
4. Pastikan ada policy yang allow **SELECT** untuk anonymous users:

```sql
-- READ policy untuk anonymous
(bucket_id = 'content'::text)
  
-- atau lebih specific untuk hero-banners folder
(bucket_id = 'content'::text 
  AND (storage.foldername(name))[1] = 'hero-banners')
```

## Jika Masalah Tetap Ada

### 1. Check Supabase Logs
- Go to Supabase Dashboard
- Check **Logs** → **Edge Functions** atau **API**
- Lihat apakah ada error 403/404

### 2. Test Direct URL
Coba akses image URL langsung di browser:
```
https://zecqskgvmfyorhxzhoeu.supabase.co/storage/v1/object/public/content/hero-banners/image.jpg
```

Harus return gambar, bukan 404 atau 403.

### 3. Check CORS
Di Supabase Dashboard → **Settings** → **API**:
- Pastikan CORS sudah dikonfigurasi jika needed

### 4. Check Network Tab
Di browser DevTools → **Network** tab:
- Lihat request ke image
- Status code harus 200, bukan 404/403/500

### 5. Clear Cache
```bash
# Di production, jika menggunakan CDN/cache:
# Invalidate cache untuk files di /public/storage/...
```

## Production Deployment

Jika menggunakan Vercel:

1. **Environment Variables**
   - Set di Vercel Dashboard:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (jika diperlukan)

2. **Redeploy**
   ```bash
   git push origin main
   # Vercel akan auto-deploy dengan env vars baru
   ```

3. **Verify**
   - Buka production URL
   - Check console di DevTools
   - Verify image loading

## Next Steps

Setelah perbaikan ini, silakan:

1. **Test di localhost** dengan `pnpm dev`
2. **Build production version** dengan `pnpm build && pnpm start`
3. **Push ke production** dengan `git push`
4. **Check production URL** dan verify di console

Jika masih ada masalah, check console logs di F12 untuk error messages yang lebih detail!
