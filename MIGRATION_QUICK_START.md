# ✅ MIGRATION CHECKLIST & QUICK START

**Project:** RS Medika Lestari  
**Tanggal:** 14 Mei 2026  
**Status:** Ready for Production

---

## 📋 PRE-MIGRATION CHECKLIST

### Persiapan Akun

- [ ] Akun Supabase baru sudah terdaftar
- [ ] Email terkonfirmasi di akun baru
- [ ] Akses ke Supabase Dashboard akun baru
- [ ] Note Project ID akun baru: `_________________________________`
- [ ] Save API URL akun baru: `https://[PROJECT_ID].supabase.co`

### Backup Data Lama

- [ ] Backup database lama di-download/di-export
- [ ] Storage files (doctors, content) ter-backup
- [ ] Backup files disimpan di lokasi aman
- [ ] Backup location: `_________________________________`

### Persiapan Dokumen

- [ ] File `MIGRATION_GUIDE_SUPABASE.md` sudah dibaca
- [ ] File `MIGRATION_SQL_SETUP.sql` sudah disiapkan
- [ ] File `BACKUP_RESTORE_GUIDE.md` sudah disiapkan

---

## 🚀 QUICK START - 5 LANGKAH UTAMA

### LANGKAH 1️⃣: Setup Database Schema (5 menit)

```bash
# Waktu: ~5 menit
# File: MIGRATION_SQL_SETUP.sql

# 1. Buka: https://app.supabase.com
# 2. Login dengan akun baru Anda
# 3. Buka project baru
# 4. Pergi ke SQL Editor (sidebar kiri)
# 5. Copy isi file MIGRATION_SQL_SETUP.sql
# 6. Paste ke SQL Editor
# 7. Klik "Run" atau Ctrl+Enter
# 8. Tunggu sampai selesai (lihat notifikasi)
# 9. Verify: Lihat 12 tabel di bagian Tables
```

**Verification:**

```sql
-- Paste di SQL Editor untuk verify
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Seharusnya ada 12 tabel:
-- admin_users
-- career_registrations
-- careers_banner_config
-- doctors
-- hero_banners
-- mading_content
-- mcu_packages
-- popups
-- room_facilities
-- room_images
-- room_types
-- schedules
```

---

### LANGKAH 2️⃣: Setup Storage Buckets (3 menit)

```bash
# Waktu: ~3 menit
# Tools: Supabase Dashboard atau CLI

# OPSI A: Via Supabase Dashboard
# 1. Login: https://app.supabase.com
# 2. Buka project baru
# 3. Pergi ke Storage (sidebar)
# 4. Klik "Create Bucket"
#    - Nama: "doctors"
#    - Public: ON
#    - Klik Create
# 5. Ulangi untuk bucket "content"

# OPSI B: Via Supabase CLI
supabase link --project-ref [NEW_PROJECT_ID]
supabase storage create doctors --public
supabase storage create content --public
```

**Verification:**

```
Buka Storage di Dashboard, seharusnya ada 2 bucket:
- doctors
- content
```

---

### LANGKAH 3️⃣: Get API Keys (2 menit)

```bash
# Waktu: ~2 menit
# Lokasi: Project Settings

# 1. Login: https://app.supabase.com/projects
# 2. Pilih project baru
# 3. Buka Settings (gear icon di sidebar)
# 4. Klik "API" di sidebar settings
# 5. Copy nilai berikut:

# Project URL:
NEXT_PUBLIC_SUPABASE_URL = https://[PROJECT_ID].supabase.co

# Anon Key:
NEXT_PUBLIC_SUPABASE_ANON_KEY = [COPY DARI HALAMAN]

# Service Role Key (scroll ke bawah):
SUPABASE_SERVICE_ROLE_KEY = [COPY DARI HALAMAN]
```

---

### LANGKAH 4️⃣: Migrate Data (10-30 menit)

```bash
# Waktu: ~10-30 menit tergantung volume data
# File: BACKUP_RESTORE_GUIDE.md

# Pilih salah satu metode:

# OPSI A: Via CSV Import (TERMUDAH untuk data kecil)
node scripts/export-csv.js          # Export dari akun lama
node scripts/restore-data.js        # Import ke akun baru

# OPSI B: Via SQL Backup
pg_dump [OLD_CONNECTION_STRING] > backup_old.sql
psql [NEW_CONNECTION_STRING] < backup_old.sql

# OPSI C: Via Supabase CLI
supabase db pull --db-url [OLD_CONNECTION_STRING]
supabase db push --db-url [NEW_CONNECTION_STRING]
```

**Verification:**

```sql
-- Paste di SQL Editor akun baru
SELECT
  'doctors' as tbl, COUNT(*) as cnt FROM public.doctors
UNION ALL SELECT 'schedules', COUNT(*) FROM public.schedules
UNION ALL SELECT 'hero_banners', COUNT(*) FROM public.hero_banners
UNION ALL SELECT 'mading_content', COUNT(*) FROM public.mading_content
UNION ALL SELECT 'room_types', COUNT(*) FROM public.room_types
UNION ALL SELECT 'room_facilities', COUNT(*) FROM public.room_facilities
UNION ALL SELECT 'room_images', COUNT(*) FROM public.room_images
UNION ALL SELECT 'career_registrations', COUNT(*) FROM public.career_registrations
UNION ALL SELECT 'careers_banner_config', COUNT(*) FROM public.careers_banner_config
UNION ALL SELECT 'mcu_packages', COUNT(*) FROM public.mcu_packages
UNION ALL SELECT 'admin_users', COUNT(*) FROM public.admin_users
UNION ALL SELECT 'popups', COUNT(*) FROM public.popups;

-- Data seharusnya sama dengan jumlah di akun lama
```

---

### LANGKAH 5️⃣: Update Environment & Deploy (5-10 menit)

```bash
# Waktu: ~5-10 menit
# File: .env.local & Hosting Provider

# 1. Update file .env.local di project
# ---
# .env.local (LOCAL DEVELOPMENT)
NEXT_PUBLIC_SUPABASE_URL=https://[NEW_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[NEW_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[NEW_SERVICE_ROLE_KEY]
# ---

# 2. Update di Hosting Provider (Vercel/Railway/etc)
# Dashboard → Settings → Environment Variables
# Update:
#   - NEXT_PUBLIC_SUPABASE_URL
#   - NEXT_PUBLIC_SUPABASE_ANON_KEY
#   - SUPABASE_SERVICE_ROLE_KEY

# 3. Deploy
git add .env.local
git commit -m "chore: update to new supabase account"
git push origin main

# atau jika menggunakan Vercel:
vercel deploy --prod

# 4. Tunggu build selesai (~3-5 menit)
```

---

## ✔️ POST-MIGRATION TESTING

### Test di Local Environment

```bash
# 1. Start dev server
npm run dev

# 2. Test setiap fitur:
```

#### ✅ Halaman Dokter

- [ ] Buka: http://localhost:3000/dokter
- [ ] Data dokter tampil dari database baru
- [ ] Filter spesialisasi bekerja
- [ ] Search dokter bekerja
- [ ] Foto dokter loading

#### ✅ Jadwal Dokter

- [ ] Buka: http://localhost:3000/jadwal-dokter
- [ ] Jadwal dokter tampil
- [ ] Filter hari bekerja
- [ ] Filter dokter bekerja

#### ✅ Hero Banners

- [ ] Buka: http://localhost:3000/
- [ ] Banner carousel tampil
- [ ] Desktop banners tampil
- [ ] Mobile banners tampil (test dengan mobile view)

#### ✅ Mading Content

- [ ] Buka: http://localhost:3000/
- [ ] Edukasi content tampil
- [ ] Event content tampil

#### ✅ Kamar Perawatan

- [ ] Buka: http://localhost:3000/services/kamar-perawatan
- [ ] Daftar kamar tampil
- [ ] Foto kamar loading
- [ ] Fasilitas kamar tampil

#### ✅ Lowongan Kerja

- [ ] Buka: http://localhost:3000/careers
- [ ] Banner tampil
- [ ] Form registrasi tampil
- [ ] Submit form (check email diterima)

#### ✅ MCU Packages

- [ ] Buka: http://localhost:3000/services/mcu
- [ ] Paket MCU tampil
- [ ] Foto paket loading

#### ✅ Admin Dashboard

- [ ] Buka: http://localhost:3000/admin/dashboard
- [ ] Login sebagai admin
- [ ] Dashboard stats tampil
- [ ] Data dokter tampil
- [ ] Bisa edit dokter
- [ ] Bisa upload gambar

#### ✅ Storage/Upload

- [ ] Upload foto dokter
- [ ] Upload gambar content
- [ ] Upload foto kamar
- [ ] Verify URL publik bekerja

### Test di Production

```bash
# Setelah deploy ke production, test:
# - Buka: https://[PRODUCTION_URL]
# - Ulangi semua test di atas
# - Monitor error logs
```

---

## 📊 Data Migration Status

### Expected Record Counts

| Tabel                 | Expected Count | Actual Count | Status |
| --------------------- | -------------- | ------------ | ------ |
| doctors               | [FROM_OLD]     | **\_**       | [ ]    |
| schedules             | [FROM_OLD]     | **\_**       | [ ]    |
| hero_banners          | [FROM_OLD]     | **\_**       | [ ]    |
| mading_content        | [FROM_OLD]     | **\_**       | [ ]    |
| room_types            | [FROM_OLD]     | **\_**       | [ ]    |
| room_facilities       | [FROM_OLD]     | **\_**       | [ ]    |
| room_images           | [FROM_OLD]     | **\_**       | [ ]    |
| career_registrations  | [FROM_OLD]     | **\_**       | [ ]    |
| careers_banner_config | [FROM_OLD]     | **\_**       | [ ]    |
| mcu_packages          | [FROM_OLD]     | **\_**       | [ ]    |
| admin_users           | [FROM_OLD]     | **\_**       | [ ]    |
| popups                | [FROM_OLD]     | **\_**       | [ ]    |

---

## 🆘 QUICK TROUBLESHOOTING

### ❌ "Missing Supabase environment variables"

```
✓ Solusi:
1. Check .env.local memiliki 3 variable
2. Pastikan URL tidak include /rest/v1
3. Restart npm run dev
4. Verify di browser: http://localhost:3000/analytics-debug
```

### ❌ "Cannot read property 'doctors' of undefined"

```
✓ Solusi:
1. Verify table doctors ada di database baru
2. Jalankan query di SQL Editor
3. Check koneksi Supabase berfungsi
```

### ❌ "Storage bucket not found"

```
✓ Solusi:
1. Verify buckets "doctors" dan "content" ada
2. Set bucket ke public
3. Check file permissions
```

### ❌ "Foreign key constraint violated"

```
✓ Solusi:
1. Restore data dalam urutan: doctors → schedules → rooms
2. Verify tidak ada orphaned records
```

### ❌ Gambar tidak tampil

```
✓ Solusi:
1. Verify image URLs masih valid
2. Check bucket permissions
3. Validate image format (jpg, png, webp)
4. Check CORS settings di Supabase Dashboard
```

---

## 📝 Important Notes

### ⚠️ Pre-Migration

- Backup data lama SEBELUM mulai migrasi
- Test di staging environment dulu
- Jangan hapus akun lama sampai migrasi selesai

### ⚠️ During Migration

- Jangan edit data saat migrasi berlangsung
- Monitor error logs
- Verify setiap step sebelum lanjut

### ⚠️ Post-Migration

- Keep backup files untuk 30 hari
- Monitor production logs
- Inform team tentang akun baru
- Update internal documentation

---

## 📞 Reference Documents

- 📄 [MIGRATION_GUIDE_SUPABASE.md](./MIGRATION_GUIDE_SUPABASE.md) - Panduan lengkap
- 🗄️ [MIGRATION_SQL_SETUP.sql](./MIGRATION_SQL_SETUP.sql) - SQL setup script
- 💾 [BACKUP_RESTORE_GUIDE.md](./BACKUP_RESTORE_GUIDE.md) - Backup & restore guide

---

## 🎯 Timeline Estimate

| Tahap                  | Waktu           | Status |
| ---------------------- | --------------- | ------ |
| Pre-migration checks   | 15 menit        | [ ]    |
| Database schema setup  | 5 menit         | [ ]    |
| Storage buckets setup  | 3 menit         | [ ]    |
| Get API keys           | 2 menit         | [ ]    |
| Data migration         | 10-30 menit     | [ ]    |
| Update environment     | 5 menit         | [ ]    |
| Deploy                 | 5-10 menit      | [ ]    |
| Testing & verification | 20 menit        | [ ]    |
| **TOTAL**              | **60-90 menit** |        |

---

**Last Updated:** 14 Mei 2026  
**Version:** 1.0  
**Status:** ✅ READY FOR MIGRATION

---

_Untuk pertanyaan lebih lanjut, lihat MIGRATION_GUIDE_SUPABASE.md_
