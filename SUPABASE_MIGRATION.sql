CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS uuid-ossp;

DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.careers_registrations CASCADE;
DROP TABLE IF EXISTS public.careers_config CASCADE;
DROP TABLE IF EXISTS public.room_images CASCADE;
DROP TABLE IF EXISTS public.room_facilities CASCADE;
DROP TABLE IF EXISTS public.room_types CASCADE;
DROP TABLE IF EXISTS public.mcu_packages CASCADE;
DROP TABLE IF EXISTS public.popups CASCADE;
DROP TABLE IF EXISTS public.mading_content CASCADE;
DROP TABLE IF EXISTS public.hero_banners CASCADE;
DROP TABLE IF EXISTS public.schedules CASCADE;
DROP TABLE IF EXISTS public.doctors CASCADE;
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  experience_years INTEGER,
  bio TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  phone_code VARCHAR(5) DEFAULT '+62',
  verified_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (email) WHERE email IS NOT NULL
);

-- TABLE: schedules
-- Deskripsi: Jadwal kerja dokter per hari
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_schedule_time CHECK (start_time < end_time)
);

-- TABLE: hero_banners
-- Deskripsi: Banner untuk hero section di halaman utama
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  device_type VARCHAR(20) NOT NULL,
  title VARCHAR(255),
  alt_text VARCHAR(255),
  link_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_hero_device_type CHECK (device_type IN ('desktop', 'mobile')),
  CONSTRAINT check_hero_order CHECK ("order" >= 0)
);

-- TABLE: mading_content
-- Deskripsi: Konten untuk mading (edukasi atau event)
CREATE TABLE IF NOT EXISTS public.mading_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  "date" DATE,
  start_date DATE,
  end_date DATE,
  "order" INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  category VARCHAR(100),
  author VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_mading_type CHECK (type IN ('edukasi', 'event'))
);

-- TABLE: popups
-- Deskripsi: Pop-up yang ditampilkan di website
CREATE TABLE IF NOT EXISTS public.popups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  target_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: room_types
-- Deskripsi: Tipe-tipe kamar perawatan yang tersedia
CREATE TABLE IF NOT EXISTS public.room_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  image_url TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  availability BOOLEAN DEFAULT TRUE,
  max_capacity INTEGER,
  color_hex VARCHAR(7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_room_order CHECK (display_order >= 0),
  CONSTRAINT check_room_price CHECK (price ~ '^\d+$' OR price = '')
);

-- TABLE: room_facilities
-- Deskripsi: Fasilitas yang tersedia di setiap kamar
CREATE TABLE IF NOT EXISTS public.room_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  facility_name VARCHAR(255) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  icon_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_facility_order CHECK (display_order >= 0)
);

-- TABLE: room_images
-- Deskripsi: Gambar-gambar untuk setiap kamar
CREATE TABLE IF NOT EXISTS public.room_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_image_order CHECK (display_order >= 0)
);

-- TABLE: mcu_packages
-- Deskripsi: Paket Medical Check-Up yang tersedia
CREATE TABLE IF NOT EXISTS public.mcu_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price VARCHAR(50) NOT NULL,
  image_url TEXT,
  href VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  availability BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_package_order CHECK (display_order >= 0)
);

-- TABLE: careers_config
-- Deskripsi: Konfigurasi halaman careers
CREATE TABLE IF NOT EXISTS public.careers_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  banner_image_url TEXT NOT NULL,
  is_form_active BOOLEAN DEFAULT TRUE,
  form_title VARCHAR(255),
  form_description TEXT,
  criteria JSONB DEFAULT '[]'::jsonb,
  phone_number VARCHAR(20),
  email_to VARCHAR(255),
  acceptance_message TEXT,
  reject_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: careers_registrations
-- Deskripsi: Registrasi dari pelamar kerja
CREATE TABLE IF NOT EXISTS public.careers_registrations (
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
  status VARCHAR(50) DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_careers_status CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected'))
);

-- TABLE: admin_users
-- Deskripsi: User admin yang memiliki akses panel admin
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  password_hash VARCHAR(255),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================================================
-- 3. CREATE INDEXES - PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Indexes untuk doctors table
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_name ON doctors USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON doctors(is_active);
CREATE INDEX IF NOT EXISTS idx_doctors_created_at ON doctors(created_at DESC);

-- Indexes untuk schedules table
CREATE INDEX IF NOT EXISTS idx_schedules_doctor_id ON schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day_availability ON schedules(day_of_week, is_available);
CREATE INDEX IF NOT EXISTS idx_schedules_doctor_day ON schedules(doctor_id, day_of_week) 
  WHERE is_available = TRUE;
CREATE INDEX IF NOT EXISTS idx_schedules_updated_at ON schedules(updated_at);

-- Indexes untuk hero_banners table
CREATE INDEX IF NOT EXISTS idx_hero_banners_active ON hero_banners(is_active, device_type);
CREATE INDEX IF NOT EXISTS idx_hero_banners_order ON hero_banners("order");
CREATE INDEX IF NOT EXISTS idx_hero_banners_is_public ON hero_banners(is_public);
CREATE INDEX IF NOT EXISTS idx_active_hero_desktop ON hero_banners("order") 
  WHERE is_active = TRUE AND device_type = 'desktop';
CREATE INDEX IF NOT EXISTS idx_active_hero_mobile ON hero_banners("order") 
  WHERE is_active = TRUE AND device_type = 'mobile';

-- Indexes untuk mading_content table
CREATE INDEX IF NOT EXISTS idx_mading_type ON mading_content(type);
CREATE INDEX IF NOT EXISTS idx_mading_order ON mading_content("order");
CREATE INDEX IF NOT EXISTS idx_mading_dates ON mading_content("date", start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_mading_type_order ON mading_content(type, "order");
CREATE INDEX IF NOT EXISTS idx_mading_is_featured ON mading_content(is_featured);
CREATE INDEX IF NOT EXISTS idx_mading_category ON mading_content(category);

-- Indexes untuk popups table
CREATE INDEX IF NOT EXISTS idx_popups_active ON popups(is_active);
CREATE INDEX IF NOT EXISTS idx_popups_order ON popups(display_order);
CREATE INDEX IF NOT EXISTS idx_popups_date_range ON popups(start_date, end_date) 
  WHERE (is_active = TRUE);
CREATE INDEX IF NOT EXISTS idx_popups_view_count ON popups(view_count);
CREATE INDEX IF NOT EXISTS idx_active_popups ON popups(display_order) 
  WHERE is_active = TRUE;

-- Indexes untuk room_types table
CREATE INDEX IF NOT EXISTS idx_room_types_order ON room_types(display_order);
CREATE INDEX IF NOT EXISTS idx_room_types_availability ON room_types(availability);
CREATE INDEX IF NOT EXISTS idx_room_types_order_availability ON room_types(display_order, availability);

-- Indexes untuk room_facilities table
CREATE INDEX IF NOT EXISTS idx_room_facilities_room_id ON room_facilities(room_id);
CREATE INDEX IF NOT EXISTS idx_room_facilities_order ON room_facilities(display_order);

-- Indexes untuk room_images table
CREATE INDEX IF NOT EXISTS idx_room_images_room_id ON room_images(room_id);
CREATE INDEX IF NOT EXISTS idx_room_images_order ON room_images(display_order);
CREATE INDEX IF NOT EXISTS idx_room_images_is_primary ON room_images(is_primary);

-- Indexes untuk mcu_packages table
CREATE INDEX IF NOT EXISTS idx_mcu_packages_order ON mcu_packages(display_order);
CREATE INDEX IF NOT EXISTS idx_mcu_packages_featured ON mcu_packages(is_featured) 
  WHERE (is_featured = TRUE);
CREATE INDEX IF NOT EXISTS idx_mcu_packages_availability ON mcu_packages(availability);

-- Indexes untuk careers_registrations table
CREATE INDEX IF NOT EXISTS idx_careers_registrations_email ON careers_registrations(email);
CREATE INDEX IF NOT EXISTS idx_careers_registrations_created ON careers_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_careers_status ON careers_registrations(status);
CREATE INDEX IF NOT EXISTS idx_careers_reviewed_at ON careers_registrations(reviewed_at);

-- Indexes untuk admin_users table
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_last_login ON admin_users(last_login);

-- Full-text search index untuk doctors
CREATE INDEX IF NOT EXISTS idx_doctors_search ON doctors USING GIN (
  (
    setweight(to_tsvector('indonesian', name), 'A') ||
    setweight(to_tsvector('indonesian', specialty), 'B') ||
    setweight(to_tsvector('indonesian', COALESCE(bio, '')), 'C')
  )
);


-- ============================================================================
-- 4. SETUP ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS untuk semua tabel
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mading_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcu_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES - PUBLIC READ
CREATE POLICY "Public read doctors" ON public.doctors
FOR SELECT USING (true);

CREATE POLICY "Public read schedules" ON public.schedules
FOR SELECT USING (true);

CREATE POLICY "Public read hero_banners" ON public.hero_banners
FOR SELECT USING (is_active = true);

CREATE POLICY "Public read mading_content" ON public.mading_content
FOR SELECT USING (true);

CREATE POLICY "Public read popups" ON public.popups
FOR SELECT USING (is_active = true);

CREATE POLICY "Public read room_types" ON public.room_types
FOR SELECT USING (true);

CREATE POLICY "Public read room_facilities" ON public.room_facilities
FOR SELECT USING (true);

CREATE POLICY "Public read room_images" ON public.room_images
FOR SELECT USING (true);

CREATE POLICY "Public read mcu_packages" ON public.mcu_packages
FOR SELECT USING (true);

CREATE POLICY "Public read careers_config" ON public.careers_config
FOR SELECT USING (true);

CREATE POLICY "Public read careers_registrations" ON public.careers_registrations
FOR SELECT USING (true);

-- RLS POLICIES - ADMIN
CREATE POLICY "Admin read own profile" ON public.admin_users
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admin full access doctors" ON public.doctors
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access schedules" ON public.schedules
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access hero_banners" ON public.hero_banners
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access mading_content" ON public.mading_content
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access popups" ON public.popups
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access room_types" ON public.room_types
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access room_facilities" ON public.room_facilities
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access room_images" ON public.room_images
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access mcu_packages" ON public.mcu_packages
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access careers_config" ON public.careers_config
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin full access careers_registrations" ON public.careers_registrations
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');

-- RLS POLICIES - PUBLIC CREATE CAREER REGISTRATION
CREATE POLICY "Anyone can create career registration" ON public.careers_registrations
FOR INSERT WITH CHECK (true);

-- RLS POLICIES - ADMIN USERS
CREATE POLICY "Admin users full access" ON public.admin_users
FOR ALL USING (auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'authenticated');


-- ============================================================================
-- 5. STORAGE BUCKETS CONFIGURATION
-- ============================================================================

-- Buat bucket untuk doctors
INSERT INTO storage.buckets (id, name, public) 
VALUES ('doctors', 'doctors', true)
ON CONFLICT (id) DO NOTHING;

-- Buat bucket untuk content
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Update bucket settings
UPDATE storage.buckets 
SET allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml'
],
file_size_limit = 5242880
WHERE id IN ('doctors', 'content');

-- Enable RLS untuk storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage RLS Policies - Public Read
CREATE POLICY IF NOT EXISTS "Public read doctors" ON storage.objects
FOR SELECT USING (bucket_id = 'doctors');

CREATE POLICY IF NOT EXISTS "Public read content" ON storage.objects
FOR SELECT USING (bucket_id = 'content');

-- Storage RLS Policies - Authenticated Upload
CREATE POLICY IF NOT EXISTS "Authenticated upload doctors" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'doctors' AND
  auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated upload content" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'content' AND
  auth.role() = 'authenticated'
);

-- Storage RLS Policies - Authenticated Delete
CREATE POLICY IF NOT EXISTS "Authenticated delete doctors" ON storage.objects
FOR DELETE USING (
  bucket_id = 'doctors' AND
  auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated delete content" ON storage.objects
FOR DELETE USING (
  bucket_id = 'content' AND
  auth.role() = 'authenticated'
);


-- ============================================================================
-- 6. OPTIMIZE DATABASE
-- ============================================================================

-- Vacuum dan Analyze untuk optimasi
VACUUM ANALYZE;


-- ============================================================================
-- 7. VERIFICATION QUERIES
-- ============================================================================

-- Check semua tabel sudah dibuat
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check semua indexes
-- SELECT schemaname, tablename, indexname FROM pg_indexes WHERE schemaname = 'public';

-- Check RLS status
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- ============================================================================
-- END OF MIGRATION SCRIPT
-- ============================================================================
