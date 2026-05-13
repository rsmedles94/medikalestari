# 📋 CHECKLIST - Hero Banner Production Fix

## 🎯 Overview

Panduan langkah demi langkah untuk memperbaiki hero banner yang blank/hitam di production Vercel.

**Waktu estimasi:** 10-15 menit

---

## ✅ CHECKLIST SETUP

### Phase 1: Vercel Environment Variables (5 menit)

- [ ] Login ke https://vercel.com
- [ ] Buka Project "medikalestari"
- [ ] Klik Tab "Settings"
- [ ] Pilih "Environment Variables" di sidebar
- [ ] Verifikasi 3 variabel ini ADA dan TERISI:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://zecqskgvmfyorhxzhoeu.supabase.co`
    - Environment: Production, Preview, Development
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
    - Environment: Production, Preview, Development
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
    - **PENTING:** Environment: Production ONLY (jangan Preview/Development)

**Jika ada yang kurang:**

1. Klik "Add new"
2. Isi Name dan Value
3. Pilih Environment (sesuai tabel di atas)
4. Klik "Save"

---

### Phase 2: Supabase RLS Configuration (3 menit)

- [ ] Login ke https://app.supabase.com
- [ ] Pilih Project "medikalestari"
- [ ] Buka "SQL Editor"
- [ ] Copy-paste semua SQL dari file: `scripts/hero-banners-rls-production-setup.sql`
- [ ] Jalankan query (tombol "Run" atau Cmd+Enter)
- [ ] Tunggu sampai SUCCESS (hijau)
- [ ] Verifikasi hasil STEP 6:
  - [ ] Minimal ada 1 banner desktop dengan `is_active = true`
  - [ ] Minimal ada 1 banner mobile dengan `is_active = true`
  - Jika 0 hasil, jalankan INSERT di STEP 7

---

### Phase 3: Vercel Redeployment (2 menit)

- [ ] Kembali ke Vercel dashboard
- [ ] Buka Project "medikalestari"
- [ ] Cari tombol "Redeploy" atau "Deploy"
- [ ] Klik deploy
- [ ] Tunggu sampai status "Ready" (green checkmark)

**Alternative via Git:**

```bash
git add .
git commit -m "fix: enable hero banner RLS policies for production"
git push origin main
```

- [ ] Tunggu GitHub Actions deploy selesai

---

### Phase 4: Testing (5 menit)

**Desktop Test:**

- [ ] Buka https://medikalestari.vercel.app/
- [ ] Tekan Ctrl+F5 (hard refresh cache)
- [ ] Lihat hero banner di atas - **HARUS TERLIHAT (bukan blank hitam)**
- [ ] Buka DevTools (F12) → Console
- [ ] Lihat ada error atau tidak
- [ ] Catat error jika ada

**Admin Test:**

- [ ] Pergi ke https://medikalestari.vercel.app/admin/hero
- [ ] Login jika diminta
- [ ] Coba "Create New Banner"
- [ ] Upload image dan submit
- [ ] Verifikasi banner muncul di homepage

**Mobile Test:**

- [ ] Inspect element (F12)
- [ ] Resize ke mobile view (max-width: 768px)
- [ ] Refresh page
- [ ] Verifikasi mobile banner tampil

---

## 🐛 Troubleshooting

### ❌ Problem: "Hero banner masih blank/hitam"

**Checklist:**

1. [ ] Hard refresh page (Ctrl+F5)
2. [ ] Cek Vercel environment variables (Phase 1 - ada semua?)
3. [ ] Cek Vercel deployment status (hijau "Ready"?)
4. [ ] Cek RLS policies di Supabase (Phase 2 - SUCCESS?)
5. [ ] Cek database ada banner dengan `is_active = true`:
   ```sql
   SELECT COUNT(*) FROM hero_banners WHERE is_active = true;
   ```

   - Jika COUNT = 0, jalankan INSERT di Phase 2 STEP 7

**Kalau masih tidak fix:**

- [ ] Buka DevTools Console (F12)
- [ ] Copy error message
- [ ] Buat issue di GitHub dengan error details

---

### ❌ Problem: "Cannot create/update banner di admin"

**Error:** "SUPABASE_SERVICE_ROLE_KEY is not set"

**Solusi:**

1. [ ] Cek `SUPABASE_SERVICE_ROLE_KEY` ada di Vercel (Phase 1)
2. [ ] Jangan lupa set Environment ke "Production"
3. [ ] Vercel project sudah di-redeploy? (Phase 3)

---

### ❌ Problem: "Permission denied" atau "RLS Policy blocking"

**Solusi:**

1. [ ] Re-run semua SQL dari `scripts/hero-banners-rls-production-setup.sql`
2. [ ] Pastikan tidak ada typo di nama tabel/kolom
3. [ ] Verifikasi policy sudah di-create:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'hero_banners';
   ```

---

## 📞 Bantuan Cepat

**Hubungi Developer:**

- Siapkan:
  - [ ] Screenshot error (jika ada)
  - [ ] Output dari DevTools Console
  - [ ] Hasil dari query `SELECT COUNT(*) FROM hero_banners WHERE is_active = true;`
  - [ ] Status dari Vercel deployment

---

## 📚 File Referensi

- **SQL Setup:** `scripts/hero-banners-rls-production-setup.sql`
- **Full Guide:** `HERO_BANNER_PRODUCTION_FIX.md`
- **Environment Setup:** `ENV_LOCAL_SETUP.md`

---

**✅ Selesai!** Jika semua checklist hijau, hero banner seharusnya sudah normal di production.
