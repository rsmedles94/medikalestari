-- ============================================================================
-- QUICK REFERENCE - ALTER COMMANDS ONLY
-- ============================================================================
-- File ini berisi HANYA perintah ALTER untuk modifikasi tabel yang sudah ada
-- Gunakan ini jika tabel sudah ada dan hanya perlu ditambah/dimodifikasi
-- ============================================================================

-- ============================================================================
-- ALTER TABLE: doctors
-- ============================================================================
ALTER TABLE IF EXISTS public.doctors 
ADD COLUMN IF NOT EXISTS phone_code VARCHAR(5) DEFAULT '+62',
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

ALTER TABLE IF EXISTS public.doctors 
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN specialty SET NOT NULL,
ALTER COLUMN email DROP NOT NULL;

ALTER TABLE IF EXISTS public.doctors 
ADD CONSTRAINT unique_doctors_email UNIQUE (email) WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON public.doctors(is_active);
CREATE INDEX IF NOT EXISTS idx_doctors_created_at ON public.doctors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_doctors_name ON public.doctors USING GIN(name gin_trgm_ops);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_doctors_search ON public.doctors USING GIN (
  (
    setweight(to_tsvector('indonesian', name), 'A') ||
    setweight(to_tsvector('indonesian', specialty), 'B') ||
    setweight(to_tsvector('indonesian', COALESCE(bio, '')), 'C')
  )
);


-- ============================================================================
-- ALTER TABLE: schedules
-- ============================================================================
ALTER TABLE IF EXISTS public.schedules 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE IF EXISTS public.schedules 
ALTER COLUMN day_of_week SET NOT NULL,
ALTER COLUMN start_time SET NOT NULL,
ALTER COLUMN end_time SET NOT NULL;

ALTER TABLE IF EXISTS public.schedules 
ADD CONSTRAINT check_schedule_time CHECK (start_time < end_time);

CREATE INDEX IF NOT EXISTS idx_schedules_doctor_id ON public.schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day_availability ON public.schedules(day_of_week, is_available);
CREATE INDEX IF NOT EXISTS idx_schedules_updated_at ON public.schedules(updated_at);
CREATE INDEX IF NOT EXISTS idx_schedules_doctor_day ON public.schedules(doctor_id, day_of_week) 
WHERE is_available = TRUE;


-- ============================================================================
-- ALTER TABLE: hero_banners
-- ============================================================================
ALTER TABLE IF EXISTS public.hero_banners 
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255),
ADD COLUMN IF NOT EXISTS link_url TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;

ALTER TABLE IF EXISTS public.hero_banners 
ADD CONSTRAINT check_hero_order CHECK ("order" >= 0);

ALTER TABLE IF EXISTS public.hero_banners 
ADD CONSTRAINT check_hero_device_type CHECK (device_type IN ('desktop', 'mobile'));

CREATE INDEX IF NOT EXISTS idx_hero_banners_is_public ON public.hero_banners(is_public);
CREATE INDEX IF NOT EXISTS idx_active_hero_desktop ON public.hero_banners("order") 
WHERE is_active = TRUE AND device_type = 'desktop';
CREATE INDEX IF NOT EXISTS idx_active_hero_mobile ON public.hero_banners("order") 
WHERE is_active = TRUE AND device_type = 'mobile';


-- ============================================================================
-- ALTER TABLE: mading_content
-- ============================================================================
ALTER TABLE IF EXISTS public.mading_content 
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS author VARCHAR(255),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

ALTER TABLE IF EXISTS public.mading_content 
ADD CONSTRAINT check_mading_type CHECK (type IN ('edukasi', 'event'));

CREATE INDEX IF NOT EXISTS idx_mading_is_featured ON public.mading_content(is_featured);
CREATE INDEX IF NOT EXISTS idx_mading_category ON public.mading_content(category);
CREATE INDEX IF NOT EXISTS idx_mading_type_order ON public.mading_content(type, "order");


-- ============================================================================
-- ALTER TABLE: popups
-- ============================================================================
ALTER TABLE IF EXISTS public.popups 
ADD COLUMN IF NOT EXISTS target_url TEXT,
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_popups_date_range ON public.popups(start_date, end_date) 
WHERE (is_active = TRUE);
CREATE INDEX IF NOT EXISTS idx_popups_view_count ON public.popups(view_count);


-- ============================================================================
-- ALTER TABLE: room_types
-- ============================================================================
ALTER TABLE IF EXISTS public.room_types 
ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS max_capacity INTEGER,
ADD COLUMN IF NOT EXISTS color_hex VARCHAR(7);

ALTER TABLE IF EXISTS public.room_types 
ADD CONSTRAINT check_room_price CHECK (price ~ '^\d+$' OR price = '');

ALTER TABLE IF EXISTS public.room_types 
ADD CONSTRAINT check_room_order CHECK (display_order >= 0);

CREATE INDEX IF NOT EXISTS idx_room_types_availability ON public.room_types(availability);
CREATE INDEX IF NOT EXISTS idx_room_types_order_availability ON public.room_types(display_order, availability);


-- ============================================================================
-- ALTER TABLE: room_facilities
-- ============================================================================
ALTER TABLE IF EXISTS public.room_facilities 
ALTER COLUMN facility_name SET NOT NULL;

ALTER TABLE IF EXISTS public.room_facilities 
ADD COLUMN IF NOT EXISTS icon_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE IF EXISTS public.room_facilities 
ADD CONSTRAINT check_facility_order CHECK (display_order >= 0);


-- ============================================================================
-- ALTER TABLE: room_images
-- ============================================================================
ALTER TABLE IF EXISTS public.room_images 
ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE;

ALTER TABLE IF EXISTS public.room_images 
ADD CONSTRAINT check_image_order CHECK (display_order >= 0);

CREATE INDEX IF NOT EXISTS idx_room_images_is_primary ON public.room_images(is_primary);


-- ============================================================================
-- ALTER TABLE: mcu_packages
-- ============================================================================
ALTER TABLE IF EXISTS public.mcu_packages 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT TRUE;

ALTER TABLE IF EXISTS public.mcu_packages 
ADD CONSTRAINT check_package_order CHECK (display_order >= 0);

CREATE INDEX IF NOT EXISTS idx_mcu_packages_featured ON public.mcu_packages(is_featured) 
WHERE (is_featured = TRUE);
CREATE INDEX IF NOT EXISTS idx_mcu_packages_availability ON public.mcu_packages(availability);


-- ============================================================================
-- ALTER TABLE: careers_config
-- ============================================================================
ALTER TABLE IF EXISTS public.careers_config 
ADD COLUMN IF NOT EXISTS email_to VARCHAR(255),
ADD COLUMN IF NOT EXISTS acceptance_message TEXT,
ADD COLUMN IF NOT EXISTS reject_message TEXT;


-- ============================================================================
-- ALTER TABLE: careers_registrations
-- ============================================================================
ALTER TABLE IF EXISTS public.careers_registrations 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reviewed_by UUID,
ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE IF EXISTS public.careers_registrations 
ADD CONSTRAINT check_careers_status CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_careers_status ON public.careers_registrations(status);
CREATE INDEX IF NOT EXISTS idx_careers_reviewed_at ON public.careers_registrations(reviewed_at);


-- ============================================================================
-- ALTER TABLE: admin_users
-- ============================================================================
ALTER TABLE IF EXISTS public.admin_users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON public.admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_last_login ON public.admin_users(last_login);


-- ============================================================================
-- STORAGE RLS POLICIES
-- ============================================================================

-- Enable RLS untuk storage objects
ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY IF NOT EXISTS "Public read doctors" ON storage.objects
FOR SELECT USING (bucket_id = 'doctors');

CREATE POLICY IF NOT EXISTS "Public read content" ON storage.objects
FOR SELECT USING (bucket_id = 'content');

-- Authenticated upload policies
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

-- Authenticated delete policies
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
-- UPDATE DATA EXAMPLES (Jika ada data yang perlu di-update)
-- ============================================================================

-- Contoh update untuk men-set nilai default
-- UPDATE doctors SET phone_code = '+62' WHERE phone_code IS NULL;
-- UPDATE schedules SET updated_at = NOW() WHERE updated_at IS NULL;
-- UPDATE popups SET view_count = 0 WHERE view_count IS NULL;


-- ============================================================================
-- OPTIMIZATION
-- ============================================================================

-- Jalankan VACUUM dan ANALYZE setelah banyak perubahan
VACUUM ANALYZE;

-- Analyze tabel spesifik jika diperlukan
-- VACUUM ANALYZE doctors;
-- VACUUM ANALYZE schedules;
-- VACUUM ANALYZE mading_content;
-- VACUUM ANALYZE room_types;
-- VACUUM ANALYZE careers_registrations;


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Lihat struktur tabel
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'doctors'
-- ORDER BY ordinal_position;

-- Lihat semua tabel dan RLS status
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' ORDER BY tablename;

-- Lihat semua indexes
-- SELECT schemaname, tablename, indexname FROM pg_indexes 
-- WHERE schemaname = 'public' ORDER BY tablename, indexname;

-- Lihat constraints
-- SELECT constraint_name, table_name, constraint_type FROM information_schema.table_constraints 
-- WHERE table_schema = 'public' ORDER BY table_name;

-- ============================================================================
-- END OF ALTER COMMANDS
-- ============================================================================
