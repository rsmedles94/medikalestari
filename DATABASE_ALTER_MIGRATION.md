# 📋 Database Schema & ALTER SQL Commands - RS Medika Lestari

**Dokumentasi Lengkap untuk Migrasi ke Akun Supabase Baru**

---

## 📑 Daftar Isi

1. [Overview Database](#overview-database)
2. [Tabel-Tabel Utama](#tabel-tabel-utama)
3. [Storage Buckets](#storage-buckets)
4. [Perintah CREATE TABLE](#perintah-create-table)
5. [Perintah ALTER TABLE](#perintah-alter-table)
6. [Row Level Security (RLS)](#row-level-security-rls)
7. [Indexes & Performance](#indexes--performance)

---

## Overview Database

**Project**: RS Medika Lestari  
**Type**: Next.js + Supabase (PostgreSQL)  
**Main Tables**: 10+ tables  
**Storage Buckets**: 2 buckets (doctors, content)  
**Key Features**:

- Doctor Management
- Schedule Management
- Hero Banners
- Mading Content (Edukasi & Event)
- Popups
- Room Types with Facilities & Images
- MCU Packages
- Careers Management
- Admin Users

---

## Tabel-Tabel Utama

### 1. **doctors** - Manajemen Dokter

```
┌─────────────────────────────────────┐
│          doctors                    │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ name (VARCHAR)                      │
│ specialty (VARCHAR)                 │
│ image_url (TEXT)                    │
│ experience_years (INTEGER)          │
│ bio (TEXT)                          │
│ phone (VARCHAR)                     │
│ email (VARCHAR)                     │
│ created_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 2. **schedules** - Jadwal Dokter

```
┌─────────────────────────────────────┐
│         schedules                   │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ doctor_id (UUID, FK → doctors)      │
│ day_of_week (VARCHAR)               │
│ start_time (TIME)                   │
│ end_time (TIME)                     │
│ is_available (BOOLEAN)              │
│ created_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 3. **hero_banners** - Banner Hero Section

```
┌─────────────────────────────────────┐
│       hero_banners                  │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ image_url (TEXT)                    │
│ order (INTEGER)                     │
│ is_active (BOOLEAN)                 │
│ device_type (VARCHAR: desktop/mobile)│
│ created_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 4. **mading_content** - Konten Mading

```
┌─────────────────────────────────────┐
│      mading_content                 │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ type (VARCHAR: edukasi/event)       │
│ title (VARCHAR)                     │
│ description (TEXT)                  │
│ image_url (TEXT)                    │
│ date (DATE) [optional]              │
│ start_date (DATE) [optional]        │
│ end_date (DATE) [optional]          │
│ order (INTEGER)                     │
│ link (TEXT) [optional]              │
│ created_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 5. **popups** - Popup Display

```
┌─────────────────────────────────────┐
│         popups                      │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ image_url (TEXT)                    │
│ title (VARCHAR) [optional]          │
│ description (TEXT) [optional]       │
│ display_order (INTEGER)             │
│ is_active (BOOLEAN)                 │
│ created_at (TIMESTAMP)              │
│ updated_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 6. **room_types** - Tipe Kamar Perawatan

```
┌─────────────────────────────────────┐
│       room_types                    │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ name (VARCHAR)                      │
│ price (VARCHAR)                     │
│ image_url (TEXT)                    │
│ description (TEXT)                  │
│ display_order (INTEGER)             │
│ created_at (TIMESTAMP)              │
│ updated_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 7. **room_facilities** - Fasilitas Kamar

```
┌─────────────────────────────────────┐
│      room_facilities                │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ room_id (UUID, FK → room_types)     │
│ facility_name (VARCHAR)             │
│ display_order (INTEGER)             │
│ created_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 8. **room_images** - Gambar Kamar

```
┌─────────────────────────────────────┐
│       room_images                   │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ room_id (UUID, FK → room_types)     │
│ image_url (TEXT)                    │
│ display_order (INTEGER)             │
│ created_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 9. **mcu_packages** - Paket MCU

```
┌─────────────────────────────────────┐
│       mcu_packages                  │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ title (VARCHAR)                     │
│ price (VARCHAR)                     │
│ image_url (TEXT)                    │
│ href (VARCHAR)                      │
│ display_order (INTEGER)             │
│ created_at (TIMESTAMP)              │
│ updated_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 10. **careers_config** - Konfigurasi Careers

```
┌─────────────────────────────────────┐
│      careers_config                 │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ banner_image_url (TEXT)             │
│ is_form_active (BOOLEAN)            │
│ form_title (VARCHAR)                │
│ form_description (TEXT)             │
│ criteria (JSONB) [array]            │
│ phone_number (VARCHAR)              │
│ created_at (TIMESTAMP)              │
│ updated_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 11. **careers_registrations** - Registrasi Careers

```
┌─────────────────────────────────────┐
│     careers_registrations           │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ full_name (VARCHAR)                 │
│ email (VARCHAR)                     │
│ phone (VARCHAR)                     │
│ position (VARCHAR)                  │
│ education (VARCHAR)                 │
│ experience_years (INTEGER)          │
│ criteria_fields (JSONB)             │
│ resume_url (TEXT)                   │
│ whatsapp_link (VARCHAR) [optional]  │
│ created_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

### 12. **admin_users** - User Admin

```
┌─────────────────────────────────────┐
│       admin_users                   │
├─────────────────────────────────────┤
│ id (UUID, PK)                       │
│ email (VARCHAR, UNIQUE)             │
│ role (VARCHAR)                      │
│ created_at (TIMESTAMP)              │
└─────────────────────────────────────┘
```

---

## Storage Buckets

### Bucket 1: **doctors**

- **Path**: `/doctor-images/{filename}`
- **Visibility**: Public
- **File Types**: jpg, jpeg, png, webp
- **Purpose**: Menyimpan foto dokter

### Bucket 2: **content**

- **Subfolders**:
  - `/popups/{filename}` - Gambar popup
  - `/mading/{filename}` - Gambar konten mading
  - `/heroes/{filename}` - Gambar hero banner
  - `/room-images/{filename}` - Gambar kamar
- **Visibility**: Public
- **File Types**: jpg, jpeg, png, webp, svg
- **Purpose**: Menyimpan semua konten visual

---

## Perintah CREATE TABLE

### CREATE TABLE: doctors

```sql
CREATE TABLE public.doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  experience_years INTEGER,
  bio TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk pencarian yang lebih cepat
CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_name ON doctors USING GIN(name gin_trgm_ops);
```

### CREATE TABLE: schedules

```sql
CREATE TABLE public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk Foreign Key
CREATE INDEX idx_schedules_doctor_id ON schedules(doctor_id);
CREATE INDEX idx_schedules_day_availability ON schedules(day_of_week, is_available);
```

### CREATE TABLE: hero_banners

```sql
CREATE TABLE public.hero_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('desktop', 'mobile')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk queries umum
CREATE INDEX idx_hero_banners_active ON hero_banners(is_active, device_type);
CREATE INDEX idx_hero_banners_order ON hero_banners("order");
```

### CREATE TABLE: mading_content

```sql
CREATE TABLE public.mading_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('edukasi', 'event')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  "date" DATE,
  start_date DATE,
  end_date DATE,
  "order" INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk queries
CREATE INDEX idx_mading_type ON mading_content(type);
CREATE INDEX idx_mading_order ON mading_content("order");
CREATE INDEX idx_mading_dates ON mading_content("date", start_date, end_date);
```

### CREATE TABLE: popups

```sql
CREATE TABLE public.popups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_popups_active ON popups(is_active);
CREATE INDEX idx_popups_order ON popups(display_order);
```

### CREATE TABLE: room_types

```sql
CREATE TABLE public.room_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  image_url TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_room_types_order ON room_types(display_order);
```

### CREATE TABLE: room_facilities

```sql
CREATE TABLE public.room_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  facility_name VARCHAR(255) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_room_facilities_room_id ON room_facilities(room_id);
CREATE INDEX idx_room_facilities_order ON room_facilities(display_order);
```

### CREATE TABLE: room_images

```sql
CREATE TABLE public.room_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_room_images_room_id ON room_images(room_id);
CREATE INDEX idx_room_images_order ON room_images(display_order);
```

### CREATE TABLE: mcu_packages

```sql
CREATE TABLE public.mcu_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  image_url TEXT,
  href VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_mcu_packages_order ON mcu_packages(display_order);
```

### CREATE TABLE: careers_config

```sql
CREATE TABLE public.careers_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  banner_image_url TEXT NOT NULL,
  is_form_active BOOLEAN DEFAULT TRUE,
  form_title VARCHAR(255),
  form_description TEXT,
  criteria JSONB DEFAULT '[]'::jsonb,
  phone_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Limit satu baris konfigurasi
CREATE UNIQUE INDEX idx_careers_config_single
ON careers_config((1)) WHERE (TRUE);
```

### CREATE TABLE: careers_registrations

```sql
CREATE TABLE public.careers_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  position VARCHAR(255) NOT NULL,
  education VARCHAR(255),
  experience_years INTEGER,
  criteria_fields JSONB,
  resume_url TEXT NOT NULL,
  whatsapp_link VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_careers_registrations_email ON careers_registrations(email);
CREATE INDEX idx_careers_registrations_created ON careers_registrations(created_at);
```

### CREATE TABLE: admin_users

```sql
CREATE TABLE public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_admin_users_email ON admin_users(email);
```

---

## Perintah ALTER TABLE

### ALTER TABLE: doctors

```sql
-- Tambah kolom baru
ALTER TABLE doctors
ADD COLUMN IF NOT EXISTS phone_code VARCHAR(5) DEFAULT '+62',
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Ubah constraint
ALTER TABLE doctors
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN specialty SET NOT NULL,
ALTER COLUMN email DROP NOT NULL;

-- Tambah constraint unik
ALTER TABLE doctors
ADD CONSTRAINT unique_doctors_email UNIQUE (email) WHERE email IS NOT NULL;

-- Update kolom
UPDATE doctors SET phone_code = '+62' WHERE phone_code IS NULL;

-- Tambah index baru
CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON doctors(is_active);
CREATE INDEX IF NOT EXISTS idx_doctors_created_at ON doctors(created_at DESC);
```

### ALTER TABLE: schedules

```sql
-- Tambah kolom
ALTER TABLE schedules
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Ubah constraints
ALTER TABLE schedules
ALTER COLUMN day_of_week SET NOT NULL,
ALTER COLUMN start_time SET NOT NULL,
ALTER COLUMN end_time SET NOT NULL;

-- Tambah check constraint
ALTER TABLE schedules
ADD CONSTRAINT check_schedule_time CHECK (start_time < end_time);

-- Index
CREATE INDEX IF NOT EXISTS idx_schedules_updated_at ON schedules(updated_at);
```

### ALTER TABLE: hero_banners

```sql
-- Tambah kolom
ALTER TABLE hero_banners
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255),
ADD COLUMN IF NOT EXISTS link_url TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;

-- Tambah check constraint untuk order
ALTER TABLE hero_banners
ADD CONSTRAINT check_hero_order CHECK ("order" >= 0);

-- Index tambahan
CREATE INDEX IF NOT EXISTS idx_hero_banners_is_public ON hero_banners(is_public);
```

### ALTER TABLE: mading_content

```sql
-- Tambah kolom
ALTER TABLE mading_content
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS author VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Update tipe kolom date jika diperlukan (dari DATE ke TIMESTAMP)
-- ALTER TABLE mading_content
-- ALTER COLUMN "date" TYPE TIMESTAMP WITH TIME ZONE USING "date"::TIMESTAMP WITH TIME ZONE;

-- Index
CREATE INDEX IF NOT EXISTS idx_mading_is_featured ON mading_content(is_featured);
CREATE INDEX IF NOT EXISTS idx_mading_category ON mading_content(category);
```

### ALTER TABLE: popups

```sql
-- Tambah kolom
ALTER TABLE popups
ADD COLUMN IF NOT EXISTS target_url TEXT,
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Index
CREATE INDEX IF NOT EXISTS idx_popups_date_range
ON popups(start_date, end_date) WHERE (is_active = TRUE);
CREATE INDEX IF NOT EXISTS idx_popups_view_count ON popups(view_count);
```

### ALTER TABLE: room_types

```sql
-- Tambah kolom
ALTER TABLE room_types
ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
ADD COLUMN IF NOT EXISTS color_hex VARCHAR(7);

-- Tambah check untuk price
ALTER TABLE room_types
ADD CONSTRAINT check_room_price CHECK (price ~ '^\d+$' OR price = '');

-- Index
CREATE INDEX IF NOT EXISTS idx_room_types_availability ON room_types(availability);
```

### ALTER TABLE: room_facilities

```sql
-- Ubah constraints
ALTER TABLE room_facilities
ALTER COLUMN facility_name SET NOT NULL;

-- Tambah kolom
ALTER TABLE room_facilities
ADD COLUMN IF NOT EXISTS icon_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Constraint
ALTER TABLE room_facilities
ADD CONSTRAINT check_facility_order CHECK (display_order >= 0);
```

### ALTER TABLE: room_images

```sql
-- Tambah kolom
ALTER TABLE room_images
ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE;

-- Constraint order
ALTER TABLE room_images
ADD CONSTRAINT check_image_order CHECK (display_order >= 0);

-- Index
CREATE INDEX IF NOT EXISTS idx_room_images_is_primary ON room_images(is_primary);
```

### ALTER TABLE: mcu_packages

```sql
-- Tambah kolom
ALTER TABLE mcu_packages
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT TRUE;

-- Constraint
ALTER TABLE mcu_packages
ADD CONSTRAINT check_package_order CHECK (display_order >= 0);

-- Index
CREATE INDEX IF NOT EXISTS idx_mcu_packages_featured
ON mcu_packages(is_featured) WHERE (is_featured = TRUE);
CREATE INDEX IF NOT EXISTS idx_mcu_packages_availability ON mcu_packages(availability);
```

### ALTER TABLE: careers_config

```sql
-- Tambah kolom
ALTER TABLE careers_config
ADD COLUMN IF NOT EXISTS email_to VARCHAR(255),
ADD COLUMN IF NOT EXISTS acceptance_message TEXT,
ADD COLUMN IF NOT EXISTS reject_message TEXT;

-- Constraint
ALTER TABLE careers_config
ADD CONSTRAINT careers_config_single_row CHECK (id = (SELECT id FROM careers_config LIMIT 1));
```

### ALTER TABLE: careers_registrations

```sql
-- Tambah kolom
ALTER TABLE careers_registrations
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by UUID,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Index
CREATE INDEX IF NOT EXISTS idx_careers_status ON careers_registrations(status);
CREATE INDEX IF NOT EXISTS idx_careers_reviewed_at ON careers_registrations(reviewed_at);
```

### ALTER TABLE: admin_users

```sql
-- Tambah kolom
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Index
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_last_login ON admin_users(last_login);
```

---

## Row Level Security (RLS)

### Enable RLS untuk semua tabel

```sql
-- Enable RLS
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE mading_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcu_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (untuk data yang dapat dibaca publik)
CREATE POLICY "Public read doctors" ON doctors
FOR SELECT USING (true);

CREATE POLICY "Public read schedules" ON schedules
FOR SELECT USING (true);

CREATE POLICY "Public read hero_banners" ON hero_banners
FOR SELECT USING (is_active = true);

CREATE POLICY "Public read mading_content" ON mading_content
FOR SELECT USING (true);

CREATE POLICY "Public read popups" ON popups
FOR SELECT USING (is_active = true);

CREATE POLICY "Public read room_types" ON room_types
FOR SELECT USING (true);

CREATE POLICY "Public read room_facilities" ON room_facilities
FOR SELECT USING (true);

CREATE POLICY "Public read room_images" ON room_images
FOR SELECT USING (true);

CREATE POLICY "Public read mcu_packages" ON mcu_packages
FOR SELECT USING (true);

CREATE POLICY "Public read careers_config" ON careers_config
FOR SELECT USING (true);

CREATE POLICY "Public read careers_registrations" ON careers_registrations
FOR SELECT USING (true);

-- Admin Policies (untuk tabel admin_users)
CREATE POLICY "Admin read own profile" ON admin_users
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admin full access" ON admin_users
FOR ALL USING (auth.role() = 'authenticated' AND EXISTS(
  SELECT 1 FROM admin_users WHERE id = auth.uid()
));

-- Insert Career Registrations (Public dapat membuat registrasi)
CREATE POLICY "Anyone can create career registration" ON careers_registrations
FOR INSERT WITH CHECK (true);

-- Update Policies (hanya untuk admin endpoints)
CREATE POLICY "Admin can update doctors" ON doctors
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete doctors" ON doctors
FOR DELETE USING (auth.role() = 'authenticated');

-- Tambahkan policy serupa untuk tabel lainnya sesuai kebutuhan
```

---

## Indexes & Performance

### Full Text Search Index (untuk pencarian dokter)

```sql
-- Buat EXTENSION untuk text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Full text search index
CREATE INDEX idx_doctors_search ON doctors USING GIN (
  (
    setweight(to_tsvector('indonesian', name), 'A') ||
    setweight(to_tsvector('indonesian', specialty), 'B') ||
    setweight(to_tsvector('indonesian', bio), 'C')
  )
);
```

### Performance Optimization Indexes

```sql
-- Composite Index untuk query umum
CREATE INDEX idx_schedules_doctor_day ON schedules(doctor_id, day_of_week)
WHERE is_available = TRUE;

CREATE INDEX idx_mading_type_order ON mading_content(type, "order");

CREATE INDEX idx_room_types_order_availability ON room_types(display_order, availability);

-- Partial Index untuk query yang sering filter
CREATE INDEX idx_active_popups ON popups(display_order)
WHERE is_active = TRUE;

CREATE INDEX idx_active_hero_desktop ON hero_banners("order")
WHERE is_active = TRUE AND device_type = 'desktop';

CREATE INDEX idx_active_hero_mobile ON hero_banners("order")
WHERE is_active = TRUE AND device_type = 'mobile';
```

### Vacuum & Analyze

```sql
-- Optimize database setelah banyak perubahan
VACUUM ANALYZE;

-- Untuk tabel spesifik
VACUUM ANALYZE doctors;
VACUUM ANALYZE schedules;
VACUUM ANALYZE mading_content;
```

---

## 🔐 Storage Buckets Configuration

### Create Storage Buckets

```sql
-- Bucket 1: doctors
INSERT INTO storage.buckets (id, name, public) VALUES ('doctors', 'doctors', true);

-- Bucket 2: content
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', true);

-- Set CORS untuk bucket
UPDATE storage.buckets
SET allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml'
],
file_size_limit = 5242880 -- 5MB
WHERE id IN ('doctors', 'content');
```

### Storage RLS Policies

```sql
-- Enable RLS for storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read doctors" ON storage.objects
FOR SELECT USING (bucket_id = 'doctors');

CREATE POLICY "Public read content" ON storage.objects
FOR SELECT USING (bucket_id = 'content');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload doctors" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'doctors' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated upload content" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'content' AND
  auth.role() = 'authenticated'
);
```

---

## 📋 Checklist Migrasi

- [ ] Buat database baru di Supabase account baru
- [ ] Enable Extensions: `pg_trgm`, `uuid-ossp`
- [ ] Jalankan semua CREATE TABLE statements
- [ ] Jalankan semua CREATE INDEX statements
- [ ] Setup Storage Buckets (doctors, content)
- [ ] Setup RLS Policies
- [ ] Setup Storage RLS Policies
- [ ] Setup environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Migrasi data dari database lama (jika ada)
- [ ] Test semua endpoint API
- [ ] Verifikasi upload image
- [ ] Test admin panel

---

## 🚨 Important Notes

1. **Backup First**: Selalu backup database lama sebelum migrasi
2. **Test Environment**: Test di environment development terlebih dahulu
3. **Data Validation**: Validate semua data setelah migrasi
4. **RLS Security**: Pastikan RLS policies sudah benar sebelum go live
5. **Storage Permissions**: Verify bucket permissions sudah public
6. **Environment Variables**: Update `.env.local` dengan credentials baru
7. **Rollback Plan**: Siapkan rollback plan jika ada masalah

---

## 📞 Support

Untuk bantuan lebih lanjut, hubungi tim Supabase atau check dokumentasi:

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Terakhir diupdate**: May 14, 2026
**Version**: 1.0
**Status**: Ready for Migration
