# 📱 Analytics Deployment Guide - Vercel Free (No Pro Required)

## ✅ Solusi: Gunakan Anon Key sebagai Fallback

Kami sudah update `lib/supabase.ts` untuk menggunakan fallback strategy:

- **Di development**: Gunakan `SUPABASE_SERVICE_ROLE_KEY` dari `.env.local`
- **Di production (Vercel Free)**: Fallback otomatis ke `NEXT_PUBLIC_SUPABASE_ANON_KEY` (sudah public)

---

## 🚀 Deployment Steps (SUPER SIMPLE)

### Step 1: Development (Localhost)

✅ Sudah berjalan - tidak ada yang perlu diubah!

```bash
npm run dev
# Analytics sudah jalan dengan SERVICE_ROLE_KEY dari .env.local
```

### Step 2: Deploy ke Vercel (FREE TIER)

Tidak perlu tambah environment variable apapun di Vercel!

Cukup:

```bash
git add .
git commit -m "Fix analytics deployment with anon key fallback"
git push
```

Vercel akan auto-detect dan deploy. Aplikasi akan:

1. Detect `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari source code
2. Analytics API akan jalan dengan Anon Key
3. ✅ Selesai!

---

## 🔐 Security Note

**Anon Key vs Service Role Key:**

- ✅ **Anon Key**: Public, safe untuk client/browser
- ❌ **Service Role Key**: Private, hanya untuk server (jangan commit!)

**Untuk Analytics (read-only):**

- Anon Key sudah cukup aman
- Bedakan dengan data admin yang sensitive

**RLS (Row Level Security):**

- Pastikan database sudah punya RLS policy
- Anon user hanya bisa akses data yang allow-nya untuk public

---

## 🧪 Testing Setelah Deploy

### Di Localhost:

```bash
npm run dev
# Buka http://localhost:3000/admin/analytics
# Harus muncul data ✅
```

### Di Production (Vercel):

```
https://yourdomain.com/admin/analytics
Login → Lihat analytics data
```

### Jika Error:

1. Buka DevTools (F12) → Console
2. Cari error message
3. Common issues:
   - RLS policy tidak allow Anon user → Update di Supabase
   - Network error → Check internet connection

---

## 📝 Environment Variables Reference

### `.env.local` (Development - DON'T COMMIT)

```env
NEXT_PUBLIC_SUPABASE_URL=https://zecqskgvmfyorhxzhoeu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Vercel Production (Automatic)

- `NEXT_PUBLIC_SUPABASE_URL` ✅ Detect dari source
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ Detect dari source
- `SUPABASE_SERVICE_ROLE_KEY` ❌ Tidak perlu (fallback ke Anon)

---

## 💡 Cara Kerja di Background

### Di Localhost:

```
App Request
  ↓
API Route (Server)
  ↓
createServerSupabaseClient()
  ↓
Check: SUPABASE_SERVICE_ROLE_KEY? → YES ✅
  ↓
Create Supabase client dengan SERVICE_ROLE_KEY
  ↓
Query database dengan full permissions
  ↓
Return data
```

### Di Vercel Production:

```
App Request
  ↓
API Route (Server)
  ↓
createServerSupabaseClient()
  ↓
Check: SUPABASE_SERVICE_ROLE_KEY? → NO ❌
  ↓
Fallback ke: NEXT_PUBLIC_SUPABASE_ANON_KEY ✅
  ↓
Create Supabase client dengan ANON_KEY
  ↓
Query database dengan RLS restrictions
  ↓
Return data (hanya yang diizinkan RLS)
```

---

## ✨ Key Changes Made

**File: `lib/supabase.ts`**

```typescript
// BEFORE: Throw error jika SERVICE_ROLE_KEY tidak ada
if (!key) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY...");
}

// AFTER: Fallback ke ANON_KEY jika SERVICE_ROLE_KEY tidak ada
const key = serviceRoleKey || anonKey;
if (!key) {
  throw new Error("Missing Supabase keys...");
}
```

---

## 🎯 Requirements untuk Analytics Work di Production

1. ✅ `NEXT_PUBLIC_SUPABASE_URL` - Set (automatic)
2. ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Set (automatic)
3. ✅ Database table `analytics_events` - Must exist
4. ✅ RLS Policy - Allow anon select pada `analytics_events`

**Check RLS Policy:**

1. Buka https://app.supabase.com
2. Database → RLS → analytics_events
3. Pastikan ada policy untuk anon user (select)

---

## ⚠️ If Analytics Still Not Working

### Debug Checklist:

- [ ] RLS policy enabled untuk `analytics_events`?
- [ ] Anon user bisa SELECT dari `analytics_events`?
- [ ] Supabase service berjalan (cek status)
- [ ] Network request ke API jalan (check Network tab di DevTools)

### Check RLS Policy:

```sql
-- Jalankan di Supabase SQL Editor
SELECT * FROM auth.policies WHERE table_name = 'analytics_events';

-- Jika kosong, buat policy:
CREATE POLICY "Enable read access for anon users"
ON public.analytics_events
FOR SELECT
TO anon
USING (true);
```

---

## 🚀 Next Steps

1. ✅ Code sudah di-fix
2. 📤 Push ke Git
3. 🔄 Vercel auto-deploy
4. ✅ Test analytics di production

**That's it! No Vercel Pro needed! 🎉**

---

**Last Updated:** May 11, 2026
**Status:** ✅ Ready for Vercel Free Tier Deployment
