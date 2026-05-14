# 📚 README - Dokumentasi Database Migration RS Medika Lestari

**Dibuat**: May 14, 2026  
**Untuk**: Migrasi Database ke Akun Supabase Baru

---

## 📁 File-File Dokumentasi

Kami telah menyiapkan **3 file utama** untuk mendukung proses migrasi Anda:

### 1. **DATABASE_ALTER_MIGRATION.md**

📖 **Dokumentasi Lengkap & Komprehensif**

**Isi:**

- Overview lengkap database architecture
- Diagram struktur 12 tabel utama
- Penjelasan setiap tabel dan relasi
- Deskripsi Storage Buckets
- Semua perintah CREATE TABLE
- Semua perintah ALTER TABLE dengan penjelasan
- Konfigurasi RLS (Row Level Security)
- Optimization & Performance Tips
- Checklist lengkap migrasi

**Kapan digunakan:**

- ✅ Referensi lengkap untuk memahami struktur database
- ✅ Dokumentasi untuk tim development
- ✅ Planning dan design review
- ✅ Troubleshooting issues

---

### 2. **SUPABASE_MIGRATION.sql**

🚀 **Script SQL Siap Jalankan - LENGKAP**

**Isi:**

- Enable extensions (uuid-ossp, pg_trgm)
- CREATE TABLE statements untuk 12 tabel
- CREATE INDEX statements untuk semua indexes
- Setup RLS Policies (lengkap)
- Storage Buckets configuration
- Database optimization (VACUUM ANALYZE)
- Verification queries

**Kapan digunakan:**

- ✅ **PERTAMA** gunakan ini untuk setup database baru di Supabase
- ✅ Copy-paste seluruh script ke SQL Editor Supabase
- ✅ Jalankan sekali saja untuk setup awal

**Cara menggunakan:**

```
1. Login ke Supabase account baru
2. Buka SQL Editor
3. Copy-paste seluruh isi file SUPABASE_MIGRATION.sql
4. Klik "Run" atau Ctrl+Enter
5. Tunggu sampai selesai (tidak ada error)
6. Cek di Table Editor untuk memverifikasi tabel yang dibuat
```

---

### 3. **ALTER_COMMANDS_QUICK_REFERENCE.sql**

⚡ **Quick Reference - ALTER Commands Only**

**Isi:**

- ALTER TABLE commands untuk memodifikasi tabel yang sudah ada
- Hanya perubahan/penambahan kolom (NO CREATE TABLE)
- Index creation commands
- RLS Policies setup
- Storage RLS Policies
- Update data examples
- Verification queries

**Kapan digunakan:**

- ✅ Jika tabel sudah ada dan hanya perlu di-modify
- ✅ Untuk menambah kolom/index baru ke database existing
- ✅ Quick reference saat development
- ✅ Copy perintah spesifik yang diperlukan

**Cara menggunakan:**

```
1. Gunakan command per tabel sesuai kebutuhan
2. Atau copy seluruh file jika ingin modify semua tabel
3. Jalankan di SQL Editor Supabase
4. Cocok untuk update incremental
```

---

## 🎯 Workflow Migrasi - Langkah demi Langkah

### **SCENARIO 1: Setup Database Baru dari Nol** (Recommended untuk Supabase baru)

```
Step 1: Persiapan
  ├─ Login ke Supabase account baru
  ├─ Buat project baru
  └─ Note: NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY

Step 2: Jalankan Setup Script
  ├─ Buka SQL Editor di Supabase
  ├─ Buka file: SUPABASE_MIGRATION.sql
  ├─ Copy-paste SELURUH ISI ke SQL Editor
  └─ Klik Run / Ctrl+Enter

Step 3: Verifikasi
  ├─ Buka Table Editor → Lihat 12 tabel sudah dibuat
  ├─ Buka Storage → Lihat 2 buckets: "doctors" & "content"
  ├─ Lihat di SQL Editor → Verify indexes & RLS

Step 4: Setup Environment Variables
  ├─ Update .env.local dengan credentials baru
  ├─ NEXT_PUBLIC_SUPABASE_URL = [copy dari Supabase Settings]
  ├─ NEXT_PUBLIC_SUPABASE_ANON_KEY = [copy dari Supabase Settings]
  └─ SUPABASE_SERVICE_ROLE_KEY = [copy dari Supabase Settings]

Step 5: Test Koneksi
  ├─ Restart app Next.js
  ├─ Test halaman utama (hero, doctors, etc)
  ├─ Test admin panel
  └─ Verifikasi semua fitur jalan normal
```

---

### **SCENARIO 2: Update Database Existing** (Jika tabel sudah ada)

```
Step 1: Identifikasi Kolom yang Diperlukan
  ├─ Baca bagian ALTER TABLE di DATABASE_ALTER_MIGRATION.md
  └─ Identify tabel mana yang perlu di-modify

Step 2: Jalankan ALTER Commands
  ├─ Buka ALTER_COMMANDS_QUICK_REFERENCE.sql
  ├─ Copy command untuk tabel spesifik
  ├─ Paste ke SQL Editor Supabase
  └─ Klik Run

Step 3: Verifikasi Perubahan
  ├─ Buka Table Editor → Lihat struktur kolom baru
  ├─ Verifikasi indexes baru di SQL dengan query
  └─ Test aplikasi jalan normal

Step 4: Update Aplikasi (Optional)
  ├─ Update types.ts jika ada perubahan interface
  ├─ Update API functions jika ada kolom baru
  └─ Re-deploy aplikasi
```

---

## 📊 Database Structure Overview

```
RS MEDIKA LESTARI DATABASE
│
├─ DOCTORS & SCHEDULES
│  ├─ doctors (12 columns)
│  └─ schedules (9 columns)
│
├─ CONTENT MANAGEMENT
│  ├─ hero_banners (9 columns)
│  ├─ mading_content (11 columns)
│  ├─ popups (10 columns)
│  └─ mcu_packages (9 columns)
│
├─ ROOM MANAGEMENT
│  ├─ room_types (10 columns)
│  ├─ room_facilities (6 columns)
│  └─ room_images (6 columns)
│
├─ CAREERS MANAGEMENT
│  ├─ careers_config (9 columns)
│  └─ careers_registrations (12 columns)
│
└─ ADMIN & SECURITY
   ├─ admin_users (6 columns)
   ├─ RLS Policies (untuk semua tabel)
   └─ Storage Buckets (2 buckets)
```

---

## 🔑 Key Environment Variables

Untuk menjalankan aplikasi dengan database baru, set variable di `.env.local`:

```env
# From Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# From Supabase Settings → API (Service Role - untuk admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## 🏗️ Database Tables at a Glance

| Tabel                     | Kolom | Purpose                       |
| ------------------------- | ----- | ----------------------------- |
| **doctors**               | 12    | Manajemen data dokter         |
| **schedules**             | 9     | Jadwal kerja dokter           |
| **hero_banners**          | 9     | Banner di halaman utama       |
| **mading_content**        | 11    | Konten edukasi & event        |
| **popups**                | 10    | Pop-up yang ditampilkan       |
| **room_types**            | 10    | Tipe kamar perawatan          |
| **room_facilities**       | 6     | Fasilitas kamar               |
| **room_images**           | 6     | Gambar kamar                  |
| **mcu_packages**          | 9     | Paket Medical Check-Up        |
| **careers_config**        | 9     | Konfigurasi halaman careers   |
| **careers_registrations** | 12    | Aplikasi kerja calon karyawan |
| **admin_users**           | 6     | User admin                    |

**Total**: 12 tabel, ~120 kolom, ~30+ indexes

---

## 💾 Storage Buckets

### Bucket 1: **doctors**

```
Tujuan: Menyimpan foto dokter
Folder: /doctor-images/{filename}
Akses: Public Read
```

### Bucket 2: **content**

```
Tujuan: Menyimpan semua konten (gambar, hero, mading, dll)
Sub-folders:
  - /popups/{filename}
  - /mading/{filename}
  - /heroes/{filename}
  - /room-images/{filename}
Akses: Public Read
```

---

## 🔒 Security - Row Level Security (RLS)

Semua tabel sudah dikonfigurasi dengan RLS:

```
✅ PUBLIC READ
  - Publik bisa baca semua tabel (doctors, schedules, content, dll)

✅ AUTHENTICATED USERS (Admin)
  - Bisa CREATE, UPDATE, DELETE untuk semua tabel

✅ CAREER REGISTRATIONS
  - Publik bisa CREATE (submit aplikasi)

✅ STORAGE
  - Public bisa READ
  - Admin (authenticated) bisa UPLOAD & DELETE
```

---

## ⚠️ Important Reminders

1. **Backup First**: Selalu backup database lama sebelum migrasi
2. **Test Environment**: Test di development dulu sebelum production
3. **Update Credentials**: Jangan lupa update environment variables
4. **Check RLS**: Pastikan RLS sudah setup dengan benar
5. **Storage Permissions**: Verify bucket public read access
6. **Rollback Plan**: Siapkan cara rollback jika ada error
7. **Data Validation**: Verify semua data setelah migrasi

---

## 🚀 Quick Commands

### Verify Database Setup

```sql
-- Lihat semua tabel
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Lihat semua indexes
SELECT tablename, indexname FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;

-- Lihat RLS status
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Test Data Insert (Contoh)

```sql
-- Insert dummy doctor
INSERT INTO doctors (name, specialty, image_url, bio, phone, email)
VALUES ('Dr. Budi', 'Umum', 'https://example.com/budi.jpg', 'Dokter umum berpengalaman', '081234567890', 'budi@example.com');

-- Check inserted
SELECT * FROM doctors;
```

---

## 📞 Troubleshooting

### Masalah: "Table doesn't exist"

- ✅ Pastikan sudah jalankan SUPABASE_MIGRATION.sql
- ✅ Verifikasi di Table Editor

### Masalah: "RLS policy denying access"

- ✅ Check RLS policies di database settings
- ✅ Verify auth token valid

### Masalah: "Storage bucket not found"

- ✅ Create bucket manual via Storage UI
- ✅ Set bucket to "public"

### Masalah: "Image upload fails"

- ✅ Check bucket permissions
- ✅ Verify CORS settings
- ✅ Check file size < 5MB

---

## 📚 Additional Resources

- [Supabase Official Docs](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Supabase Integration](https://supabase.com/docs/guides/getting-started/with-nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 📋 Checklist Akhir

Sebelum go live, pastikan:

- [ ] Database setup selesai (12 tabel, indexes, RLS)
- [ ] Storage buckets sudah dibuat (doctors, content)
- [ ] Environment variables sudah update
- [ ] Test di localhost jalan normal
- [ ] Verifikasi hero banners tampil
- [ ] Verifikasi doctor list tampil
- [ ] Test admin panel bisa login
- [ ] Test upload image berhasil
- [ ] Test create/edit/delete di admin panel
- [ ] Backup database lama sudah ada
- [ ] Monitoring production sudah ready

---

## 📝 Version History

| Version | Date         | Changes               |
| ------- | ------------ | --------------------- |
| 1.0     | May 14, 2026 | Initial documentation |

---

## ✍️ Notes

**Dibuat untuk**: RS Medika Lestari  
**Database**: Supabase (PostgreSQL)  
**Framework**: Next.js + TypeScript  
**Status**: Ready for Production Migration

---

**Pertanyaan?** Refer ke file-file dokumentasi atau check Supabase documentation.

Last Updated: May 14, 2026
