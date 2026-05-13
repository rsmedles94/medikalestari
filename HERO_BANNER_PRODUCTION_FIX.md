# 🔧 Hero Banner Production Fix - Checklist

## ❌ Masalah yang Diperbaiki

- Hero banner blank hitam di production
- Image tidak tampil
- Fetch API gagal di production tapi OK di localhost

---

## ✅ Perbaikan yang Dilakukan

### 1. **Update `lib/api.ts` - Enhanced fetchHeroBanners()**

- ✓ Validasi environment variables (Supabase URL & Key)
- ✓ Validasi image URL sebelum return data
- ✓ Better error logging dengan error code & status
- ✓ Logging detail untuk debugging production

### 2. **Update `components/HeroSection.tsx` - Better Error Handling**

- ✓ Environment variable check saat component mount
- ✓ Enhanced console logs dengan emoji & checklist
- ✓ Stack trace logging untuk errors
- ✓ Detailed debug info untuk production troubleshooting

---

## 📋 Checklist Production Setup

### **Environment Variables (.env.local atau Vercel Settings)**

```env
# REQUIRED - Harus ada di production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OPTIONAL - Untuk server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Vercel Setup:**

1. Go to **Settings → Environment Variables**
2. Add semua variable di atas
3. Select production environment
4. Redeploy

### **Database (Supabase) Setup**

```sql
-- Pastikan table ini ada:
CREATE TABLE IF NOT EXISTS hero_banners (
  id BIGINT PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('desktop', 'mobile')),
  order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert test data:
INSERT INTO hero_banners (image_url, device_type, order, is_active)
VALUES
  ('https://example.com/banner1.jpg', 'desktop', 1, true),
  ('https://example.com/banner2.jpg', 'mobile', 1, true);

-- Check data:
SELECT * FROM hero_banners WHERE is_active = true ORDER BY order;
```

### **Image URL Requirements**

- ✓ Must be **full URL** (http:// atau https://)
- ✓ Must be **publicly accessible**
- ✓ CORS headers harus allow Next.js domain
- ✓ File harus ada & tidak corrupted

**Testing Image URL:**

```bash
curl -I "https://your-image-url.com/banner.jpg"
# Harus return 200 OK, bukan 404 atau 403
```

---

## 🧪 Debugging Steps (Production)

### 1. **Check Browser Console (DevTools)**

Buka F12 → Console, cari logs dengan prefix `[fetchHeroBanners]` atau `[HeroSection]`

**Expected output jika OK:**

```
[HeroSection] 🔄 Loading desktop banners...
[HeroSection] Environment check: {supabaseUrl: 'SET', supabaseKey: 'SET'}
[fetchHeroBanners] Starting fetch with config: {deviceType: 'desktop', ...}
[fetchHeroBanners] ✅ Success - fetched 2 valid banners [{id: 1, url: 'https://...'}, ...]
```

### 2. **Jika Error Muncul**

**Masalah: "Missing NEXT_PUBLIC_SUPABASE_URL"**

- ❌ Env var belum di-set di Vercel
- ✓ Set di Vercel Settings → Environment Variables

**Masalah: "No active banners found"**

- ❌ Table kosong atau tidak ada data
- ✓ Insert data ke hero_banners table

**Masalah: "Invalid image URL"**

- ❌ Image URL bukan full URL atau tidak valid
- ✓ Gunakan full URL (http:// atau https://)
- ✓ Test di curl bahwa image accessible

**Masalah: "CORS error" (di DevTools Network tab)**

- ❌ Image domain tidak allow Next.js domain
- ✓ Update CORS settings di image host

---

## 🚀 Deployment Steps

### 1. **Local Testing**

```bash
# Test di localhost terlebih dahulu
npm run build
npm run start

# Buka browser console & cek logs
# Harus tampil banner
```

### 2. **Commit & Push**

```bash
git add .
git commit -m "fix: improve hero banner fetch & error handling"
git push origin main
```

### 3. **Vercel Auto-Deploy**

- Tunggu deployment selesai
- Cek production logs: Vercel Dashboard → Deployments → Function Logs

### 4. **Production Testing**

- Buka website production
- Buka DevTools Console (F12)
- Cek apakah banner tampil & logs OK

---

## 📊 Expected Behavior

### ✅ Working (Banner Tampil)

```
[HeroSection] ✅ Loaded 2 desktop banners
Banner image visible di halaman
Carousel bergerak otomatis setiap 5 detik
```

### ❌ Not Working (Blank Hitam)

```
[HeroSection] ⚠️ No desktop banners found
image_url di console logs: null atau empty
```

---

## 🔍 Quick Fix Checklist

- [ ] Environment variables di Vercel: NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Supabase hero_banners table punya data dengan is_active=true
- [ ] Image URL adalah full URL (http/https), bukan relative path
- [ ] Image URL publicly accessible (test dengan curl)
- [ ] CORS headers OK di image server
- [ ] Build & deploy ulang di Vercel
- [ ] Check browser DevTools Console untuk error messages
- [ ] Test di incognito mode (clear cache)

---

## 📞 Still Not Working?

1. Share DevTools Console logs
2. Run SQL query: `SELECT * FROM hero_banners WHERE is_active = true;`
3. Test image URL di browser: paste image URL di address bar
4. Check Vercel Function Logs untuk server-side errors

---

**Last Updated:** May 13, 2026
