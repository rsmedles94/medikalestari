# 🚀 QUICK START - Hero Banner Production Fix

## ⚡ TL;DR (Versi Cepat)

**Masalah:** Hero banner blank/hitam di production Vercel

**Solusi dalam 3 langkah:**

### 1️⃣ Vercel Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://zecqskgvmfyorhxzhoeu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

👉 Pergi ke: https://vercel.com → medikalestari → Settings → Environment Variables

⚠️ `SUPABASE_SERVICE_ROLE_KEY` → **Production only**

### 2️⃣ Supabase RLS Setup

```
Copy-paste semua SQL dari: scripts/hero-banners-rls-production-setup.sql
Jalankan di: https://app.supabase.com → SQL Editor
```

### 3️⃣ Redeploy

```
Vercel → medikalestari → Redeploy
atau
git push origin main
```

---

## 🔍 Verification

Setelah semua langkah:

1. Hard refresh: https://medikalestari.vercel.app/ (Ctrl+F5)
2. Harus lihat hero banner (bukan blank hitam)
3. Test admin: https://medikalestari.vercel.app/admin/hero

---

## 📊 Status Check

| Item                          | Status | Lokasi                                                  |
| ----------------------------- | ------ | ------------------------------------------------------- |
| NEXT_PUBLIC_SUPABASE_URL      | ✅/❌  | Vercel Settings                                         |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅/❌  | Vercel Settings                                         |
| SUPABASE_SERVICE_ROLE_KEY     | ✅/❌  | Vercel Settings (Production)                            |
| RLS Policies                  | ✅/❌  | Supabase → Table Policies                               |
| Active Banners                | ✅/❌  | SELECT COUNT(\*) FROM hero_banners WHERE is_active=true |
| Vercel Deploy                 | ✅/❌  | Vercel Deployments                                      |

---

## 💡 Pro Tips

- **Caching masalah?** Ctrl+F5 (hard refresh)
- **Perlu SQL help?** Lihat: `scripts/hero-banners-rls-production-setup.sql`
- **Environment variables tetap error?** Tunggu 1-2 menit setelah save di Vercel
- **Admin bisa buat banner tapi belum tampil?** Pastikan `is_active = true` di database

---

## 🆘 Still Broken?

1. Buka DevTools (F12) → Console → copy error
2. Cek query: `SELECT * FROM hero_banners WHERE is_active = true LIMIT 5;`
3. Paste hasil ke GitHub issue
