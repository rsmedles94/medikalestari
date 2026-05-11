# ⚡ SETUP .env.local - PANDUAN STEP BY STEP

## 🎯 Tujuan

Setup environment variables agar bisa delete/update banner di admin panel dan banner desktop muncul di homepage.

---

## 📝 STEP 1: Buka File `.env.local`

**Di VS Code:**

1. Buka project root
2. Tekan `Ctrl+P` (Command Palette di Mac: `Cmd+P`)
3. Ketik: `.env.local`
4. Tekan Enter (akan buka file)

**Jika file belum ada:**

- Klik kanan di root project → New File
- Ketik nama: `.env.local`
- Tekan Enter

---

## 🔑 STEP 2: Dapatkan Supabase Keys

**Di Supabase Dashboard:**

1. Buka: https://app.supabase.com
2. Login ke akun Anda
3. Pilih project "medikalestari"
4. Klik ⚙️ **Settings** (gear icon di bawah kiri)
5. Pilih tab: **API**
6. Lihat section **Project API keys**

**Yang Anda lihat:**

- **Project URL** - ini adalah `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** - ini adalah `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role secret** - ini adalah `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ PENTING**: Jangan publish key ini ke GitHub!

---

## ✍️ STEP 3: Copy-Paste ke `.env.local`

**Template `.env.local`:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...copy-paste-dari-dashboard
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...copy-paste-dari-dashboard
```

**Cara isi:**

1. Dari Supabase Settings → API:
   - Copy **Project URL**
   - Ganti: `YOUR_PROJECT_ID.supabase.co` dengan value yang di-copy
2. Copy **anon public**
   - Ganti: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...copy-paste...` (anon)
3. Copy **service_role secret**
   - Ganti: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...copy-paste...` (service role)

**Contoh hasil akhir:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzMxNTM2MDAwfQ.sZr_example_key_anon
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWoiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MzE1MzYwMDB9.sZr_example_key_service_role
```

---

## 💾 STEP 4: Save File

**Di VS Code:**

- Tekan `Ctrl+S` (save)
- Pastikan file `.env.local` sudah tersimpan (tidak ada dot di title tab)

---

## 🔄 STEP 5: Restart Dev Server

**Di Terminal:**

1. Lihat terminal yang menjalankan `pnpm dev`
2. Tekan `Ctrl+C` untuk stop (ada tulisan "stopped")
3. Jalankan lagi:
   ```bash
   pnpm dev
   ```
4. Tunggu sampai muncul:
   ```
   ▲ Next.js 15.x.x
   - ready started server on 0.0.0.0:3000, url: http://localhost:3000
   ```

**⏹️ PENTING**: Dev server HARUS di-restart agar `.env.local` ter-load!

---

## ✅ VERIFY: Test di Browser

1. Buka: http://localhost:3000
2. Buka DevTools (F12)
3. Pergi ke tab **Console**
4. Refresh halaman (F5)
5. Cari log:
   - ✅ Jika muncul "✅ Loaded X desktop banners" = BERHASIL
   - ❌ Jika muncul "❌ No desktop banners found" = Ada masalah lain

---

## ✅ VERIFY: Test Delete Banner di Admin Panel

1. Login ke admin: http://localhost:3000/admin/hero
2. Klik tombol ❌ delete pada banner lama
3. Hasilnya:
   - ✅ Banner terhapus tanpa error = BERHASIL
   - ❌ Error "SUPABASE_SERVICE_ROLE_KEY is not set" = `.env.local` belum benar

---

## 🆘 TROUBLESHOOTING

### **Error: SUPABASE_SERVICE_ROLE_KEY is not set**

- ✅ Pastikan `.env.local` punya 3 variable
- ✅ Pastikan tidak ada typo di nama variable
- ✅ Pastikan key-nya tidak kosong
- ✅ Restart dev server dengan `pnpm dev`

### **Dev server masih jalankan config lama**

- ✅ Stop dev server: Ctrl+C
- ✅ Jalankan lagi: `pnpm dev`
- ✅ Jangan tekan "Restart" di VS Code, harus full stop & start

### **Masih tidak bisa delete/update banner**

- ✅ Check `.env.local` punya 3 variable
- ✅ Check di Supabase SQL Editor query untuk cek RLS policies
- ✅ Check console log untuk error detail

---

## 📋 CHECKLIST

Setelah selesai, pastikan:

- [ ] File `.env.local` ada di root project
- [ ] Ada 3 variable: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- [ ] Semua key sudah di-copy dari Supabase dashboard
- [ ] Dev server sudah di-restart
- [ ] Tidak ada error di console
- [ ] Bisa delete banner di admin panel tanpa error
- [ ] Desktop banner muncul di homepage

---

## 🎉 DONE!

Sekarang Anda bisa:

- ✅ Delete/update banner di admin panel
- ✅ Banner desktop akan muncul di homepage
- ✅ API calls dari admin akan work dengan baik
