# 🏥 Dokumentasi Lengkap Migrasi Supabase - RS Medika Lestari

**Tanggal Dokumen:** 14 Mei 2026  
**Status:** Draft untuk Migrasi ke Akun Supabase Baru  
**Aplikasi:** RS Medika Lestari Website (Next.js 16.2.3)

---

## 📋 Daftar Isi

1. [Ringkasan Proyek](#ringkasan-proyek)
2. [Struktur Database Lengkap](#struktur-database-lengkap)
3. [Perintah SQL untuk Setup](#perintah-sql-untuk-setup)
4. [Environment Variables](#environment-variables)
5. [Panduan Migrasi Data](#panduan-migrasi-data)
6. [Checklist Migrasi](#checklist-migrasi)

---

## 📱 Ringkasan Proyek

### Informasi Umum

- **Nama Proyek:** RS Medika Lestari Website
- **Framework:** Next.js 16.2.3
- **Database:** Supabase (PostgreSQL)
- **Runtime:** Node.js
- **Package Manager:** pnpm
- **TypeScript:** ✅ Ya
- **Tailwind CSS:** ✅ Ya

### Dependencies Utama

```json
{
  "@supabase/supabase-js": "^2.103.0",
  "next": "16.2.3",
  "react": "19.2.4",
  "framer-motion": "^12.38.0",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

### Fitur Utama Aplikasi

- 👨‍⚕️ Manajemen Data Dokter dan Jadwal
- 📅 Jadwal Dokter Fleksibel
- 🎆 Hero Banners (Desktop & Mobile)
- 📰 Mading Content (Edukasi & Event)
- 🏥 Manajemen Kamar Perawatan
- 💼 Manajemen Lowongan Kerja & Registrasi
- 🏥 Paket MCU (Medical Check-Up)
- 👤 Admin User Management
- 🎨 Popup Management

---

## 🗄️ Struktur Database Lengkap

### Tabel 1: `doctors`

**Deskripsi:** Menyimpan data dokter di RS Medika Lestari

```sql
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  experience_years INTEGER,
  bio TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key, auto-generated |
| name | VARCHAR(255) | Nama dokter (Required) |
| specialty | VARCHAR(100) | Spesialisasi dokter (Required) |
| image_url | TEXT | URL foto dokter (Required) |
| experience_years | INTEGER | Tahun pengalaman |
| bio | TEXT | Biografi singkat |
| phone | VARCHAR(20) | Nomor telepon kontak |
| email | VARCHAR(255) | Email dokter |
| created_at | TIMESTAMP | Waktu pembuatan record |

**Contoh Data:**

```json
{
  "name": "Dr. Budi Santoso",
  "specialty": "Dokter Umum",
  "image_url": "https://...",
  "experience_years": 10,
  "bio": "Dokter berpengalaman...",
  "phone": "081234567890",
  "email": "budi@medikalestari.com"
}
```

---

### Tabel 2: `schedules`

**Deskripsi:** Menyimpan jadwal praktik dokter per hari

```sql
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL,
  day_of_week VARCHAR(20) NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| doctor_id | UUID | Foreign Key ke doctors (Required) |
| day_of_week | VARCHAR(20) | Hari (Senin, Selasa, dll) |
| start_time | VARCHAR(5) | Jam mulai (HH:mm) |
| end_time | VARCHAR(5) | Jam selesai (HH:mm) |
| is_available | BOOLEAN | Status ketersediaan |
| created_at | TIMESTAMP | Waktu pembuatan |

**Contoh Data:**

```json
{
  "doctor_id": "550e8400-e29b-41d4-a716-446655440000",
  "day_of_week": "Senin",
  "start_time": "08:00",
  "end_time": "16:00",
  "is_available": true
}
```

---

### Tabel 3: `hero_banners`

**Deskripsi:** Menyimpan banner utama halaman beranda (Desktop & Mobile)

```sql
CREATE TABLE hero_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  device_type VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| image_url | TEXT | URL gambar banner (Required) |
| order | INTEGER | Urutan tampilan |
| is_active | BOOLEAN | Status aktif/nonaktif |
| device_type | VARCHAR(10) | 'desktop' atau 'mobile' |
| created_at | TIMESTAMP | Waktu pembuatan |

**Device Type:**

- `desktop`: 1900x720 px
- `mobile`: 2208x2760 px

**Contoh Data:**

```json
{
  "image_url": "https://...",
  "order": 1,
  "is_active": true,
  "device_type": "desktop"
}
```

---

### Tabel 4: `mading_content`

**Deskripsi:** Menyimpan konten untuk mading (edukasi & event)

```sql
CREATE TABLE mading_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date DATE,
  start_date DATE,
  end_date DATE,
  order INTEGER DEFAULT 0,
  link TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| type | VARCHAR(20) | 'edukasi' atau 'event' (Required) |
| title | VARCHAR(255) | Judul konten (Required) |
| description | TEXT | Deskripsi lengkap (Required) |
| image_url | TEXT | URL gambar (Required) |
| date | DATE | Tanggal untuk type 'edukasi' |
| start_date | DATE | Tanggal mulai untuk type 'event' |
| end_date | DATE | Tanggal akhir event |
| order | INTEGER | Urutan tampilan |
| link | TEXT | Link artikel/event tambahan |
| created_at | TIMESTAMP | Waktu pembuatan |

**Contoh Data:**

```json
{
  "type": "edukasi",
  "title": "Tips Kesehatan Jantung",
  "description": "Panduan lengkap menjaga kesehatan jantung...",
  "image_url": "https://...",
  "date": "2026-05-14",
  "order": 1
}
```

---

### Tabel 5: `room_types`

**Deskripsi:** Tipe-tipe kamar perawatan di rumah sakit

```sql
CREATE TABLE room_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price VARCHAR(50) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| name | VARCHAR(100) | Nama tipe kamar (Required) |
| price | VARCHAR(50) | Harga per malam |
| image_url | TEXT | Foto utama kamar |
| description | TEXT | Deskripsi kamar |
| display_order | INTEGER | Urutan tampilan |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu update terakhir |

**Contoh Data:**

```json
{
  "name": "Kamar VIP",
  "price": "Rp. 1.500.000",
  "image_url": "https://...",
  "description": "Kamar dengan AC, TV, dan WiFi",
  "display_order": 1
}
```

---

### Tabel 6: `room_facilities`

**Deskripsi:** Fasilitas yang tersedia di setiap kamar

```sql
CREATE TABLE room_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL,
  facility_name VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES room_types(id) ON DELETE CASCADE
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| room_id | UUID | Foreign Key ke room_types |
| facility_name | VARCHAR(100) | Nama fasilitas |
| display_order | INTEGER | Urutan tampilan |
| created_at | TIMESTAMP | Waktu pembuatan |

**Contoh Data:**

```json
{
  "room_id": "550e8400-e29b-41d4-a716-446655440000",
  "facility_name": "TV 42 inch",
  "display_order": 1
}
```

---

### Tabel 7: `room_images`

**Deskripsi:** Galeri foto untuk setiap kamar

```sql
CREATE TABLE room_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES room_types(id) ON DELETE CASCADE
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| room_id | UUID | Foreign Key ke room_types |
| image_url | TEXT | URL foto kamar |
| display_order | INTEGER | Urutan tampilan |
| created_at | TIMESTAMP | Waktu pembuatan |

---

### Tabel 8: `career_registrations`

**Deskripsi:** Data registrasi lowongan kerja

```sql
CREATE TABLE career_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  position VARCHAR(100) NOT NULL,
  education VARCHAR(100) NOT NULL,
  experience_years INTEGER NOT NULL,
  criteria_fields JSONB DEFAULT '{}'::jsonb,
  resume_url TEXT NOT NULL,
  whatsapp_link TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| full_name | VARCHAR(255) | Nama lengkap pendaftar |
| email | VARCHAR(255) | Email |
| phone | VARCHAR(20) | Nomor telepon |
| position | VARCHAR(100) | Posisi yang dilamar |
| education | VARCHAR(100) | Pendidikan terakhir |
| experience_years | INTEGER | Tahun pengalaman |
| criteria_fields | JSONB | Field criteria dinamis |
| resume_url | TEXT | URL CV/Resume |
| whatsapp_link | TEXT | Link WhatsApp |
| created_at | TIMESTAMP | Waktu pembuatan |

**Contoh Data:**

```json
{
  "full_name": "Ahmad Rahman",
  "email": "ahmad@email.com",
  "phone": "082123456789",
  "position": "Perawat",
  "education": "D3 Keperawatan",
  "experience_years": 5,
  "resume_url": "https://...",
  "criteria_fields": {
    "skill_1": "Komunikasi baik",
    "availability": "Siap mulai segera"
  }
}
```

---

### Tabel 9: `careers_banner_config`

**Deskripsi:** Konfigurasi banner dan form lowongan kerja

```sql
CREATE TABLE careers_banner_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  banner_image_url TEXT NOT NULL,
  is_form_active BOOLEAN DEFAULT TRUE,
  form_title VARCHAR(255) NOT NULL,
  form_description TEXT NOT NULL,
  criteria JSON DEFAULT '[]'::json,
  phone_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| banner_image_url | TEXT | URL banner |
| is_form_active | BOOLEAN | Form aktif/nonaktif |
| form_title | VARCHAR(255) | Judul form |
| form_description | TEXT | Deskripsi form |
| criteria | JSON | Array criteria dinamis |
| phone_number | VARCHAR(20) | Nomor kontak |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu update |

---

### Tabel 10: `mcu_packages`

**Deskripsi:** Paket Medical Check-Up

```sql
CREATE TABLE mcu_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  image_url TEXT NOT NULL,
  href VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| title | VARCHAR(255) | Nama paket |
| price | VARCHAR(50) | Harga paket |
| image_url | TEXT | Foto paket |
| href | VARCHAR(255) | Link detail/booking |
| display_order | INTEGER | Urutan tampilan |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu update |

**Contoh Data:**

```json
{
  "title": "Basic Check-Up",
  "price": "Rp. 500.000",
  "image_url": "https://...",
  "href": "/services/mcu/basic",
  "display_order": 1
}
```

---

### Tabel 11: `admin_users`

**Deskripsi:** Admin users untuk dashboard management

```sql
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| email | VARCHAR(255) | Email admin (Unique) |
| role | VARCHAR(50) | Role admin ('admin', dll) |
| created_at | TIMESTAMP | Waktu pembuatan |

---

### Tabel 12: `popups`

**Deskripsi:** Data popup yang ditampilkan di website

```sql
CREATE TABLE popups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Kolom:**
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary Key |
| title | VARCHAR(255) | Judul popup |
| description | TEXT | Deskripsi |
| image_url | TEXT | Gambar popup |
| is_active | BOOLEAN | Status aktif |
| start_date | DATE | Tanggal mulai tampil |
| end_date | DATE | Tanggal akhir tampil |
| created_at | TIMESTAMP | Waktu pembuatan |
| updated_at | TIMESTAMP | Waktu update |

---

## 💾 Perintah SQL untuk Setup

### A. Persiapan - Aktifkan Extension (Jika Belum)

```sql
-- Aktifkan extension untuk UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### B. Buat Semua Tabel

```sql
-- ========================================
-- 1. CREATE TABLE: doctors
-- ========================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  experience_years INTEGER,
  bio TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_name ON public.doctors(name);

-- ========================================
-- 2. CREATE TABLE: schedules
-- ========================================
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL,
  day_of_week VARCHAR(20) NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_schedules_doctor FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_schedules_doctor ON public.schedules(doctor_id);

-- ========================================
-- 3. CREATE TABLE: hero_banners
-- ========================================
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  device_type VARCHAR(10) NOT NULL CHECK (device_type IN ('desktop', 'mobile')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_hero_banners_device ON public.hero_banners(device_type, is_active);
CREATE INDEX IF NOT EXISTS idx_hero_banners_order ON public.hero_banners("order");

-- ========================================
-- 4. CREATE TABLE: mading_content
-- ========================================
CREATE TABLE IF NOT EXISTS public.mading_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('edukasi', 'event')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date DATE,
  start_date DATE,
  end_date DATE,
  "order" INTEGER DEFAULT 0,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_mading_type ON public.mading_content(type);
CREATE INDEX IF NOT EXISTS idx_mading_order ON public.mading_content("order");

-- ========================================
-- 5. CREATE TABLE: room_types
-- ========================================
CREATE TABLE IF NOT EXISTS public.room_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price VARCHAR(50) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_room_types_order ON public.room_types(display_order);

-- ========================================
-- 6. CREATE TABLE: room_facilities
-- ========================================
CREATE TABLE IF NOT EXISTS public.room_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL,
  facility_name VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_room_facilities FOREIGN KEY (room_id) REFERENCES public.room_types(id) ON DELETE CASCADE
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_room_facilities_room ON public.room_facilities(room_id);

-- ========================================
-- 7. CREATE TABLE: room_images
-- ========================================
CREATE TABLE IF NOT EXISTS public.room_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_room_images FOREIGN KEY (room_id) REFERENCES public.room_types(id) ON DELETE CASCADE
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_room_images_room ON public.room_images(room_id);

-- ========================================
-- 8. CREATE TABLE: career_registrations
-- ========================================
CREATE TABLE IF NOT EXISTS public.career_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  position VARCHAR(100) NOT NULL,
  education VARCHAR(100) NOT NULL,
  experience_years INTEGER NOT NULL,
  criteria_fields JSONB DEFAULT '{}'::jsonb,
  resume_url TEXT NOT NULL,
  whatsapp_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_career_email ON public.career_registrations(email);
CREATE INDEX IF NOT EXISTS idx_career_position ON public.career_registrations(position);

-- ========================================
-- 9. CREATE TABLE: careers_banner_config
-- ========================================
CREATE TABLE IF NOT EXISTS public.careers_banner_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  banner_image_url TEXT NOT NULL,
  is_form_active BOOLEAN DEFAULT TRUE,
  form_title VARCHAR(255) NOT NULL,
  form_description TEXT NOT NULL,
  criteria JSON DEFAULT '[]'::json,
  phone_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 10. CREATE TABLE: mcu_packages
-- ========================================
CREATE TABLE IF NOT EXISTS public.mcu_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  image_url TEXT NOT NULL,
  href VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_mcu_order ON public.mcu_packages(display_order);

-- ========================================
-- 11. CREATE TABLE: admin_users
-- ========================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_admin_email ON public.admin_users(email);

-- ========================================
-- 12. CREATE TABLE: popups
-- ========================================
CREATE TABLE IF NOT EXISTS public.popups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_popup_active ON public.popups(is_active);
CREATE INDEX IF NOT EXISTS idx_popup_dates ON public.popups(start_date, end_date);
```

### C. Setup Storage Buckets

```sql
-- CATATAN: Jalankan perintah ini melalui Supabase Dashboard UI
-- atau gunakan Supabase CLI, BUKAN melalui SQL editor

-- Buckets yang dibutuhkan:
-- 1. "doctors" - Menyimpan foto dokter
-- 2. "content" - Menyimpan gambar content (mading, hero, room)
```

### D. Setup RLS (Row Level Security) - OPSIONAL

Jika ingin menambah keamanan dengan RLS:

```sql
-- Enable RLS untuk public tables
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mading_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers_banner_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcu_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;

-- Policy: Semua orang bisa baca, hanya admin bisa write
CREATE POLICY "Allow public read" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Allow admin write" ON public.doctors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update" ON public.doctors FOR UPDATE WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete" ON public.doctors FOR DELETE USING (auth.role() = 'authenticated');

-- Repeat untuk tabel lain...
```

---

## 🔐 Environment Variables

### File: `.env.local`

Perbarui dengan nilai dari akun Supabase baru Anda:

```env
# Supabase Configuration - NEW ACCOUNT
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-NEW-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-NEW-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-NEW-SERVICE-ROLE-KEY]

# Optional: Analytics (jika menggunakan)
NEXT_PUBLIC_GA_ID=[Google Analytics ID jika ada]
```

**Cara mendapatkan nilai:**

1. Login ke Supabase Dashboard akun baru
2. Buka project settings
3. Copy URL dan keys dari section "API"

---

## 📊 Panduan Migrasi Data

### OPSI 1: Migrasi Manual via Supabase Dashboard

#### Langkah 1: Export Data dari Akun Lama

```bash
# Gunakan Supabase CLI untuk export
supabase db pull --db-url "postgresql://[OLD_CONNECTION_STRING]"
```

#### Langkah 2: Import ke Akun Baru

1. Buka Supabase Dashboard akun baru
2. Masuk ke SQL Editor
3. Copy-paste semua perintah SQL dari bagian "Perintah SQL untuk Setup"
4. Jalankan query

#### Langkah 3: Upload Data via CSV/JSON

1. Export data dari akun lama sebagai CSV/JSON
2. Import via Supabase Dashboard atau API

### OPSI 2: Migrasi via Supabase CLI (Recommended)

```bash
# 1. Install Supabase CLI (jika belum)
npm install -g supabase

# 2. Login ke CLI
supabase login

# 3. Link ke project lama
supabase link --project-ref [OLD_PROJECT_ID]

# 4. Dump database lama
supabase db pull

# 5. Login ke project baru
supabase login --new-project

# 6. Link ke project baru
supabase link --project-ref [NEW_PROJECT_ID]

# 7. Push schema ke project baru
supabase db push

# 8. Migrasi data (gunakan script Python/Node)
```

### OPSI 3: Migrasi via Node.js Script

**File: `scripts/migrate-db.js`**

```javascript
const { createClient } = require("@supabase/supabase-js");

// Connection ke akun lama
const oldSupabase = createClient(
  process.env.OLD_SUPABASE_URL,
  process.env.OLD_SUPABASE_KEY,
);

// Connection ke akun baru
const newSupabase = createClient(
  process.env.NEW_SUPABASE_URL,
  process.env.NEW_SUPABASE_KEY,
);

const tables = [
  "doctors",
  "schedules",
  "hero_banners",
  "mading_content",
  "room_types",
  "room_facilities",
  "room_images",
  "career_registrations",
  "careers_banner_config",
  "mcu_packages",
  "admin_users",
  "popups",
];

async function migrateData() {
  for (const table of tables) {
    console.log(`Migrating ${table}...`);

    // Fetch dari akun lama
    const { data, error } = await oldSupabase.from(table).select("*");

    if (error) {
      console.error(`Error fetching ${table}:`, error);
      continue;
    }

    if (data && data.length > 0) {
      // Insert ke akun baru
      const { error: insertError } = await newSupabase.from(table).insert(data);

      if (insertError) {
        console.error(`Error inserting ${table}:`, insertError);
      } else {
        console.log(`✓ ${table}: ${data.length} records migrated`);
      }
    }
  }

  console.log("Migration complete!");
}

migrateData().catch(console.error);
```

**Jalankan:**

```bash
OLD_SUPABASE_URL=... OLD_SUPABASE_KEY=... \
NEW_SUPABASE_URL=... NEW_SUPABASE_KEY=... \
node scripts/migrate-db.js
```

---

## ✅ Checklist Migrasi

### Pre-Migration

- [ ] Backup semua data dari akun lama
- [ ] Export schema database lama
- [ ] Siapkan akun Supabase baru
- [ ] Catat semua Environment Variables baru
- [ ] Test koneksi ke Supabase baru

### During Migration

- [ ] Jalankan semua perintah SQL CREATE TABLE
- [ ] Buat storage buckets ("doctors", "content")
- [ ] Migrasi data dari akun lama
- [ ] Verify integritas data
- [ ] Update `.env.local` dengan credentials baru

### Post-Migration

- [ ] Test semua API endpoints
- [ ] Verify fetch dokter berfungsi
- [ ] Test upload gambar
- [ ] Test filter dan search
- [ ] Check dashboard admin
- [ ] Test booking/form submissions
- [ ] Update dokumentasi deployment
- [ ] Inform tim tentang akun baru

### Testing

- [ ] ✅ Halaman dokter (fetch & display)
- [ ] ✅ Halaman jadwal dokter
- [ ] ✅ Hero banners tampil dengan benar
- [ ] ✅ Mading content load
- [ ] ✅ Kamar perawatan display
- [ ] ✅ Form registrasi kerja submit
- [ ] ✅ Admin dashboard akses
- [ ] ✅ Upload gambar (dokter, kamar, content)

---

## 📝 Data Cleanup & Optimization

### Hapus Data Duplikat

```sql
DELETE FROM doctors a USING doctors b
WHERE a.id > b.id AND a.email = b.email;
```

### Vacuum & Analyze

```sql
VACUUM ANALYZE;
```

### Check Constraints

```sql
-- Verify foreign keys
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY';
```

---

## 🚀 Deployment Steps

### 1. Update Environment Variables

**Di hosting provider Anda (Vercel/Railway/etc):**

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-NEW-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-NEW-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-NEW-SERVICE-ROLE-KEY]
```

### 2. Test Build Locally

```bash
npm run build
npm run start
```

### 3. Deploy

```bash
# jika menggunakan Vercel
vercel deploy

# atau jika menggunakan Git
git add .
git commit -m "chore: update to new supabase account"
git push origin main
```

---

## 🆘 Troubleshooting

### Problem: "Missing Supabase environment variables"

**Solution:**

- Pastikan `NEXT_PUBLIC_SUPABASE_URL` tidak include `/rest/v1`
- Verify keys di `.env.local`
- Restart development server

### Problem: "Foreign key constraint failed"

**Solution:**

- Migrasi data dalam urutan yang benar (tabel parent dulu)
- Check referential integrity

### Problem: "Storage bucket not found"

**Solution:**

- Buat buckets "doctors" dan "content" di Supabase Dashboard
- Set bucket policies ke public read

### Problem: "RLS policy denying access"

**Solution:**

- Temporarily disable RLS untuk testing
- Atau update policies sesuai kebutuhan

---

## 📚 Referensi Tambahan

- [Dokumentasi Supabase](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## 📞 Catatan Penting

1. **Backup Terlebih Dahulu**: Selalu backup data lama sebelum migrasi
2. **Test di Environment Dev**: Jangan langsung migrasi ke production
3. **Monitor Logs**: Check logs aplikasi setelah deployment
4. **Update Documentation**: Inform tim tentang perubahan akun

---

**Dokumen ini dibuat pada:** 14 Mei 2026  
**Status:** Ready for Production Migration  
**Versi:** 1.0

---

_Generated for: RS Medika Lestari  
Project: medikalestari (Next.js 16.2.3)_
