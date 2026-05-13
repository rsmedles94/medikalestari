# 🔧 PERBAIKAN HERO BANNER - PRODUCTION FIX

## 🚨 MASALAH

Hero banner blank hitam (tidak tampil) saat di production/Vercel, padahal di localhost normal.

**Root Cause:**

1. ❌ `SUPABASE_SERVICE_ROLE_KEY` tidak di-set di Vercel environment
2. ❌ RLS Policies tidak mengizinkan public read banner yang sudah di-buat
3. ❌ Banner tidak di-marked sebagai `is_active = true`

---

## ✅ SOLUSI STEP BY STEP

### **LANGKAH 1: Setup Environment Variables di Vercel**

**Pergi ke:** https://vercel.com → Project **medikalestari** → Settings → Environment Variables

Pastikan 3 variabel ini sudah ada dan filled:

| Variabel                           | Value                                      | Environment                      |
| ---------------------------------- | ------------------------------------------ | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`         | `https://zecqskgvmfyorhxzhoeu.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`    | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`  | Production, Preview, Development |
| **`SUPABASE_SERVICE_ROLE_KEY`** ⚠️ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`  | **Production only**              |

**Catatan:** `SUPABASE_SERVICE_ROLE_KEY` harus di Production saja (bukan di Preview/Development) untuk keamanan.

---

### **LANGKAH 2: Konfigurasi RLS Policies di Supabase**

**Buka:** https://app.supabase.com → Project "medikalestari" → SQL Editor

**Jalankan query ini:**

```sql
-- ===== STEP 1: Enable RLS =====
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- ===== STEP 2: Drop existing policies (cleanup) =====
DROP POLICY IF EXISTS "Allow public read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow anon read hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role CRUD hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role create hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role update hero_banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role delete hero_banners" ON hero_banners;

-- ===== STEP 3: Create RLS Policy - ANON READ (untuk public/frontend) =====
-- Hanya bisa membaca banner yang is_active = true
CREATE POLICY "Allow anon read active hero_banners"
ON hero_banners
FOR SELECT
TO anon
USING (is_active = true);

-- ===== STEP 4: Create RLS Policies - SERVICE ROLE CRUD (untuk admin) =====
-- Service role bisa membuat, update, delete (bypass RLS)
CREATE POLICY "Allow service role all operations on hero_banners"
ON hero_banners
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ===== STEP 5: Activate existing banners =====
UPDATE hero_banners
SET is_active = true
WHERE device_type IN ('desktop', 'mobile');

-- ===== STEP 6: Verify =====
SELECT id, image_url, device_type, is_active, created_at
FROM hero_banners
WHERE is_active = true
ORDER BY device_type, "order" ASC;
```

**Expected Output:**

- Minimal 1-2 banner dengan `is_active = true` untuk desktop
- Minimal 1-2 banner dengan `is_active = true` untuk mobile

---

### **LANGKAH 3: Redeploy di Vercel**

1. Buka Vercel dashboard
2. Pilih project **medikalestari**
3. Klik tombol **"Redeploy"** (atau tunggu auto-deploy jika ada push ke main)
4. Tunggu deploy selesai (green checkmark)

**Alternative: Manual deploy via Git**

```bash
git add .
git commit -m "chore: update hero banner env variables"
git push origin main
```

---

### **LANGKAH 4: Test di Production**

1. Buka website production: https://medikalestari.vercel.app/
2. **Refresh page** (Ctrl+F5 untuk hard refresh)
3. Lihat apakah hero banner muncul (jangan blank hitam)

**Jika masih blank:**

1. Buka DevTools (F12) → Console
2. Lihat ada error apa
3. Copy error message

---

## 🐛 Troubleshooting

### Kasus 1: "Hero banner masih blank hitam"

**Solusi:**

1. Pastikan step 2 sudah benar (cek RLS policies di Supabase)
2. Cek apakah ada banner dengan `is_active = true`:
   ```sql
   SELECT COUNT(*) FROM hero_banners WHERE is_active = true;
   ```
3. Jika count = 0, insert dummy banner:
   ```sql
   INSERT INTO hero_banners (image_url, device_type, is_active, "order")
   VALUES
   ('/mcu.png', 'desktop', true, 1),
   ('/mcu.png', 'mobile', true, 1);
   ```

### Kasus 2: "API error: SUPABASE_SERVICE_ROLE_KEY is not set"

**Solusi:**

1. Cek Vercel environment variables sudah di-set (Step 1)
2. Pastikan Vercel project sudah di-redeploy setelah set env
3. Cek di Vercel Deployments - lihat recent deploy apakah ada

### Kasus 3: "Cannot read banner, permission denied"

**Solusi:**

1. RLS policy tidak dikonfigurasi dengan benar
2. Lakukan STEP 2 lagi (pastikan semua query dijalankan)
3. Verify dengan query di STEP 2 poin 6

---

## 📊 Checklist Production Ready

- [ ] ✅ `NEXT_PUBLIC_SUPABASE_URL` ada di Vercel (Production)
- [ ] ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` ada di Vercel (Production)
- [ ] ✅ `SUPABASE_SERVICE_ROLE_KEY` ada di Vercel (Production only)
- [ ] ✅ RLS policies sudah di-buat (Step 2)
- [ ] ✅ Minimal 1 banner desktop dengan `is_active = true`
- [ ] ✅ Minimal 1 banner mobile dengan `is_active = true`
- [ ] ✅ Vercel sudah di-redeploy
- [ ] ✅ Hero banner tampil di https://medikalestari.vercel.app/
- [ ] ✅ Bisa membuat/edit/delete banner di `/admin/hero`

---

## 📚 Referensi

- **Supabase RLS:** https://supabase.com/docs/guides/auth/row-level-security
- **Vercel Env Vars:** https://vercel.com/docs/projects/environment-variables
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
