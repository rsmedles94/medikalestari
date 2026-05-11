# 🚀 SETUP Environment Variables di Vercel

## 🎯 Masalah

Hero banner tidak bisa dibuat/diedit di production Vercel karena `SUPABASE_SERVICE_ROLE_KEY` tidak tersedia.

**Error:** `Error: Gagal membuat banner: SUPABASE_SERVICE_ROLE_KEY is not set`

---

## ✅ Solusi: Tambahkan Environment Variables ke Vercel

### STEP 1: Login ke Vercel Dashboard

1. Buka: https://vercel.com
2. Login ke akun Anda
3. Pilih project **medikalestari**

---

### STEP 2: Buka Project Settings

1. Di halaman project, klik tab **Settings** (di atas menu)
2. Di sidebar kiri, pilih **Environment Variables**

---

### STEP 3: Tambahkan 3 Environment Variables

Anda perlu menambahkan 3 variabel berikut:

#### ▶️ Variabel 1: NEXT_PUBLIC_SUPABASE_URL

- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://zecqskgvmfyorhxzhoeu.supabase.co`
- **Environments:** Production, Preview, Development
- Click **Save**

#### ▶️ Variabel 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplY3Fza2d2bWZ5b3JoeHpob2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTk5MTMsImV4cCI6MjA5MTQzNTkxM30.6sjL8Mw3QHNS7SC5DgE3aJLkh5uY3sdaI6yIVh_csUg`
- **Environments:** Production, Preview, Development
- Click **Save**

#### ▶️ Variabel 3: SUPABASE_SERVICE_ROLE_KEY ⚠️ PENTING

- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplY3Fza2d2bWZ5b3JoeHpob2V1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg1OTkxMywiZXhwIjoyMDkxNDM1OTEzfQ.w4n93si0DEKzNYb9HiC2XzLd5w4xtPurEskQmfwlqy0`
- **Environments:**
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Click **Save**

---

### STEP 4: Verifikasi Environment Variables

1. Lihat daftar semua 3 variabel sudah tersimpan
2. Pastikan tidak ada typo pada nama variabel

---

### STEP 5: Redeploy Project

Setelah menambahkan environment variables, Anda perlu redeploy:

**Opsi A: Via Vercel Dashboard**

1. Buka halaman project
2. Klik tombol **Deployments** (atau tab di atas)
3. Klik menu (...) di deploy terakhir
4. Klik **Redeploy**

**Opsi B: Via Git Push**

1. Di terminal lokal, lakukan git push
2. Vercel akan auto-deploy dengan environment variables baru

```bash
git push
```

---

### STEP 6: Test Hero Banner di Production

1. Pergi ke deployment URL Anda
2. Login ke admin panel (`/admin/login`)
3. Buka **Hero Banner** (`/admin/hero`)
4. Coba buat banner baru atau edit banner lama
5. Seharusnya berhasil tanpa error ✅

---

## 🔐 Keamanan Penting

**⚠️ JANGAN SHARE SERVICE ROLE KEY!**

- `SUPABASE_SERVICE_ROLE_KEY` adalah credential sensitif
- Jangan commit ke GitHub
- Jangan share di publik
- Hanya admin yang perlu tahu nilai ini

---

## 🆘 Troubleshooting

### Masih ada error setelah redeploy?

**Cek 1:** Verifikasi nama variabel persis seperti di atas (case-sensitive)

- ✅ `SUPABASE_SERVICE_ROLE_KEY` (benar)
- ❌ `supabase_service_role_key` (salah)

**Cek 2:** Pastikan redeploy sudah selesai

- Buka Deployments → lihat status deploy (hijau = berhasil)

**Cek 3:** Clear browser cache

- Tekan Ctrl+Shift+Delete (atau Cmd+Shift+Delete di Mac)
- Clear semua cache
- Reload halaman

**Cek 4:** Restart di incognito mode

- Buka deployment URL di incognito/private window
- Login ulang
- Coba buat banner lagi

---

## 📚 Referensi

- Dokumentasi Vercel Environment Variables: https://vercel.com/docs/environment-variables
- Dokumentasi Supabase: https://supabase.com/docs
- GitHub Repository: https://github.com/alief-faisal-project/medikalestari

---

## ✅ Checklist Sebelum Deploy

- [ ] Ketiga environment variables sudah ditambahkan di Vercel
- [ ] Redeploy sudah dilakukan
- [ ] Deploy status menunjukkan ✅ (green)
- [ ] Coba buat/edit hero banner di production
- [ ] Berhasil tanpa error ✅
