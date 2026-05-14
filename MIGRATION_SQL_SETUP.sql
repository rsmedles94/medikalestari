-- ============================================================================
-- RS MEDIKA LESTARI - MIGRATION SQL SCRIPT
-- ============================================================================
-- Tanggal: 14 Mei 2026
-- Tujuan: Setup database lengkap untuk migrasi ke akun Supabase baru
-- Version: 1.0
-- ============================================================================

-- STEP 1: Enable Extension untuk UUID
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 2: CREATE TABLES
-- ============================================================================

-- ========================================
-- TABLE 1: doctors
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

CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_name ON public.doctors(name);
CREATE INDEX IF NOT EXISTS idx_doctors_email ON public.doctors(email);

COMMENT ON TABLE public.doctors IS 'Tabel untuk menyimpan data dokter RS Medika Lestari';
COMMENT ON COLUMN public.doctors.id IS 'UUID Primary Key';
COMMENT ON COLUMN public.doctors.name IS 'Nama dokter';
COMMENT ON COLUMN public.doctors.specialty IS 'Spesialisasi dokter (Dokter Umum, Dokter Gigi, dll)';
COMMENT ON COLUMN public.doctors.image_url IS 'URL foto dokter dari storage bucket';
COMMENT ON COLUMN public.doctors.experience_years IS 'Tahun pengalaman praktik';
COMMENT ON COLUMN public.doctors.bio IS 'Biografi singkat dokter';

-- ========================================
-- TABLE 2: schedules
-- ========================================
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL,
  day_of_week VARCHAR(20) NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_schedules_doctor FOREIGN KEY (doctor_id) 
    REFERENCES public.doctors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_schedules_doctor ON public.schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day ON public.schedules(day_of_week);

COMMENT ON TABLE public.schedules IS 'Jadwal praktik dokter per hari';
COMMENT ON COLUMN public.schedules.day_of_week IS 'Hari dalam format: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu';
COMMENT ON COLUMN public.schedules.start_time IS 'Waktu mulai dalam format HH:mm (00:00-23:59)';
COMMENT ON COLUMN public.schedules.end_time IS 'Waktu selesai dalam format HH:mm';
COMMENT ON COLUMN public.schedules.is_available IS 'Status ketersediaan dokter pada hari/jam tersebut';

-- ========================================
-- TABLE 3: hero_banners
-- ========================================
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  device_type VARCHAR(10) NOT NULL CHECK (device_type IN ('desktop', 'mobile')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hero_banners_device ON public.hero_banners(device_type, is_active);
CREATE INDEX IF NOT EXISTS idx_hero_banners_order ON public.hero_banners("order");

COMMENT ON TABLE public.hero_banners IS 'Banner utama di halaman beranda (carousel/slider)';
COMMENT ON COLUMN public.hero_banners.device_type IS 'desktop (1900x720) atau mobile (2208x2760)';
COMMENT ON COLUMN public.hero_banners."order" IS 'Urutan tampilan dalam carousel';

-- ========================================
-- TABLE 4: mading_content
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

CREATE INDEX IF NOT EXISTS idx_mading_type ON public.mading_content(type);
CREATE INDEX IF NOT EXISTS idx_mading_order ON public.mading_content("order");
CREATE INDEX IF NOT EXISTS idx_mading_date ON public.mading_content(date, start_date);

COMMENT ON TABLE public.mading_content IS 'Konten untuk mading/information board (edukasi kesehatan & event)';
COMMENT ON COLUMN public.mading_content.type IS 'Tipe konten: edukasi (artikel kesehatan) atau event (acara rumah sakit)';
COMMENT ON COLUMN public.mading_content.date IS 'Tanggal publikasi untuk tipe edukasi';
COMMENT ON COLUMN public.mading_content.start_date IS 'Tanggal mulai event untuk tipe event';

-- ========================================
-- TABLE 5: room_types
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

CREATE INDEX IF NOT EXISTS idx_room_types_order ON public.room_types(display_order);

COMMENT ON TABLE public.room_types IS 'Tipe-tipe kamar perawatan yang tersedia (VIP, Regular, dll)';
COMMENT ON COLUMN public.room_types.price IS 'Harga per malam dalam format string (contoh: "Rp. 1.500.000")';

-- ========================================
-- TABLE 6: room_facilities
-- ========================================
CREATE TABLE IF NOT EXISTS public.room_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL,
  facility_name VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_room_facilities FOREIGN KEY (room_id) 
    REFERENCES public.room_types(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_room_facilities_room ON public.room_facilities(room_id);

COMMENT ON TABLE public.room_facilities IS 'Fasilitas yang tersedia di setiap tipe kamar (TV, WiFi, AC, dll)';

-- ========================================
-- TABLE 7: room_images
-- ========================================
CREATE TABLE IF NOT EXISTS public.room_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_room_images FOREIGN KEY (room_id) 
    REFERENCES public.room_types(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_room_images_room ON public.room_images(room_id);

COMMENT ON TABLE public.room_images IS 'Galeri foto untuk setiap tipe kamar';

-- ========================================
-- TABLE 8: career_registrations
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

CREATE INDEX IF NOT EXISTS idx_career_email ON public.career_registrations(email);
CREATE INDEX IF NOT EXISTS idx_career_position ON public.career_registrations(position);
CREATE INDEX IF NOT EXISTS idx_career_created ON public.career_registrations(created_at DESC);

COMMENT ON TABLE public.career_registrations IS 'Data registrasi pencari kerja untuk lowongan yang ada';
COMMENT ON COLUMN public.career_registrations.criteria_fields IS 'Field dinamis berdasarkan kriteria lowongan (JSON object)';

-- ========================================
-- TABLE 9: careers_banner_config
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

COMMENT ON TABLE public.careers_banner_config IS 'Konfigurasi banner dan form untuk halaman lowongan kerja';
COMMENT ON COLUMN public.careers_banner_config.criteria IS 'Array JSON untuk field dinamis form registrasi';

-- ========================================
-- TABLE 10: mcu_packages
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

CREATE INDEX IF NOT EXISTS idx_mcu_order ON public.mcu_packages(display_order);

COMMENT ON TABLE public.mcu_packages IS 'Paket Medical Check-Up (MCU) yang ditawarkan rumah sakit';
COMMENT ON COLUMN public.mcu_packages.price IS 'Harga paket dalam format string';
COMMENT ON COLUMN public.mcu_packages.href IS 'Link untuk booking atau detail paket';

-- ========================================
-- TABLE 11: admin_users
-- ========================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_email ON public.admin_users(email);

COMMENT ON TABLE public.admin_users IS 'Admin users yang dapat mengakses dashboard management';

-- ========================================
-- TABLE 12: popups
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

CREATE INDEX IF NOT EXISTS idx_popup_active ON public.popups(is_active);
CREATE INDEX IF NOT EXISTS idx_popup_dates ON public.popups(start_date, end_date);

COMMENT ON TABLE public.popups IS 'Popup/modal yang ditampilkan di website dengan date range';

-- ============================================================================
-- STEP 3: CREATE STORAGE BUCKETS
-- ============================================================================
-- NOTE: Storage buckets harus dibuat melalui Supabase Dashboard atau CLI
-- Buckets yang diperlukan:
-- 1. "doctors" - untuk foto dokter
-- 2. "content" - untuk gambar content (mading, hero banners, kamar, dll)
--
-- Jalankan melalui CLI:
-- supabase storage create doctors --public
-- supabase storage create content --public

-- ============================================================================
-- STEP 4: VERIFICATION QUERIES
-- ============================================================================
-- Gunakan query di bawah untuk verify setup:

-- Lihat semua tables yang telah dibuat:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Lihat struktur masing-masing table:
-- \d+ doctors
-- \d+ schedules
-- \d+ hero_banners
-- dll

-- Lihat semua indexes:
-- SELECT * FROM pg_indexes WHERE schemaname = 'public';

-- Lihat foreign keys:
-- SELECT constraint_name, table_name FROM information_schema.table_constraints 
-- WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public';

-- ============================================================================
-- END OF MIGRATION SCRIPT
-- ============================================================================
-- 
-- Instruksi Penggunaan:
-- 1. Copy seluruh script ini
-- 2. Buka Supabase Dashboard akun baru
-- 3. Buka SQL Editor
-- 4. Paste script ini
-- 5. Klik "Run" atau tekan Ctrl+Enter
-- 6. Tunggu sampai selesai (lihat notifikasi success)
-- 7. Verify dengan query di STEP 4
--
-- ============================================================================
