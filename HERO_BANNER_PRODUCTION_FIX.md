# HERO BANNER TROUBLESHOOTING - Production Not Showing

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **GET Endpoint**

File: `/app/api/admin/hero-banners/route.ts`

✅ **ADDED** - GET endpoint baru untuk fetch hero banners secara public (tidak perlu service role key):

```typescript
export async function GET(request: Request) {
  // Fetch with public client (anon key)
  // Filter: is_active = true, ordered by order ASC
}
```

### 2. **Update fetchHeroBanners Function**

File: `/lib/api.ts`

❌ **BEFORE** - Direct Supabase query (mungkin blocked oleh RLS di production):

```typescript
const { data, error } = await supabase.from("hero_banners").select("*")...
```

✅ **AFTER** - Menggunakan API endpoint baru:

```typescript
const response = await fetch("/api/admin/hero-banners?device_type=...", {
  method: "GET",
  cache: "no-store",
});
```

## 🔍 Checklist Diagnosis

### Step 1: Verifikasi Data Exists

1. Buka https://app.supabase.com
2. Pilih project "rs-medika-lestari"
3. Pergi ke **Table Editor** → **hero_banners**
4. ✅ Pastikan ada data dengan `is_active = true`
5. ✅ Pastikan ada data untuk device_type "desktop" dan/atau "mobile"

### Step 2: Verifikasi RLS Policy (Harus Ada)

Di Supabase Dashboard → **Authentication** → **Policies** → select `hero_banners` table

**DIPERLUKAN untuk public read:**

```
Policy: "Allow public read hero_banners"
Target: hero_banners table
Rule: FOR SELECT USING (is_active = true)
```

Jika tidak ada, buat dengan SQL:

```sql
CREATE POLICY "Allow public read hero_banners"
ON hero_banners
FOR SELECT
USING (is_active = true);
```

### Step 3: Test Endpoint

Test via terminal atau browser:

```bash
curl "https://medikalestari.vercel.app/api/admin/hero-banners?device_type=desktop"
```

Harusnya response:

```json
{
  "success": true,
  "data": [
    { "id": "...", "image_url": "...", "device_type": "desktop", "is_active": true, ... }
  ]
}
```

### Step 4: Check Browser Console

1. Buka https://medikalestari.vercel.app di production
2. Buka **Developer Tools** → **Console** tab
3. Cari error logs dari HeroSection
4. Pastikan tidak ada error seperti "RLS violation" atau "403 Forbidden"

### Step 5: Verify Environment Variables

Di Vercel Dashboard → **Settings** → **Environment Variables**

✅ Pastikan ada:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (untuk admin operations)

## 🚀 Deployment Checklist

- [ ] Data hero banners sudah ada di Supabase dengan `is_active = true`
- [ ] RLS Policy untuk "Allow public read" sudah dibuat
- [ ] Environment variables sudah di-set di Vercel
- [ ] Git push dengan perubahan file:
  - `/app/api/admin/hero-banners/route.ts` (tambah GET endpoint)
  - `/lib/api.ts` (update fetchHeroBanners)
- [ ] Redeploy di Vercel (automatic via git push atau manual redeploy)
- [ ] Tunggu ~3-5 menit untuk vercel build selesai
- [ ] Buka https://medikalestari.vercel.app
- [ ] Verifikasi hero banner muncul dengan normal

## 🐛 Debugging Tips

Jika masih tidak muncul:

1. **Check Network Tab (DevTools)**
   - Buka DevTools → Network tab
   - Cari request ke `/api/admin/hero-banners`
   - Status harus 200
   - Response harus berisi data array

2. **Check HeroSection Console Logs**
   - File: `/components/HeroSection.tsx` line ~165
   - Lihat console.log untuk "Loading desktop banners..."
   - Lihat apakah data ter-fetch dengan benar

3. **Check Supabase Logs**
   - Buka Supabase Dashboard
   - Pergi ke **Logs** → **API**
   - Cari request yang di-reject dengan 403/RLS error

4. **Test di Local Machine**
   - `npm run dev`
   - Pastikan localhost bekerja
   - Jika localhost bekerja tapi production tidak, issue adalah RLS atau env vars

## 📝 Catatan Penting

- Endpoint `/api/admin/hero-banners?device_type=desktop` adalah **PUBLIC READ** (tidak perlu auth)
- POST/PUT/DELETE masih memerlukan service role key (admin operations)
- Data di-cache dengan `cache: "no-store"` agar selalu fresh
- Response hanya mengembalikan banner dengan `is_active = true`

Semoga hero banner sudah bisa muncul di production! 🎉
