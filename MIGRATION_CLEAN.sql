CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

CREATE TABLE public.doctors (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_name ON doctors USING GIN(name gin_trgm_ops);
CREATE INDEX idx_doctors_is_active ON doctors(is_active);
CREATE INDEX idx_doctors_created_at ON doctors(created_at DESC);
CREATE UNIQUE INDEX idx_doctors_email ON doctors(email) WHERE email IS NOT NULL;

CREATE TABLE public.schedules (
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

CREATE INDEX idx_schedules_doctor_id ON schedules(doctor_id);
CREATE INDEX idx_schedules_day_availability ON schedules(day_of_week, is_available);
CREATE INDEX idx_schedules_doctor_day ON schedules(doctor_id, day_of_week) WHERE is_available = TRUE;
CREATE INDEX idx_schedules_updated_at ON schedules(updated_at);

CREATE TABLE public.hero_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('desktop', 'mobile')),
  title VARCHAR(255),
  alt_text VARCHAR(255),
  link_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_hero_order CHECK ("order" >= 0)
);

CREATE INDEX idx_hero_banners_active ON hero_banners(is_active, device_type);
CREATE INDEX idx_hero_banners_order ON hero_banners("order");
CREATE INDEX idx_hero_banners_is_public ON hero_banners(is_public);
CREATE INDEX idx_active_hero_desktop ON hero_banners("order") WHERE is_active = TRUE AND device_type = 'desktop';
CREATE INDEX idx_active_hero_mobile ON hero_banners("order") WHERE is_active = TRUE AND device_type = 'mobile';

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
  category VARCHAR(100),
  author VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mading_type ON mading_content(type);
CREATE INDEX idx_mading_order ON mading_content("order");
CREATE INDEX idx_mading_dates ON mading_content("date", start_date, end_date);
CREATE INDEX idx_mading_type_order ON mading_content(type, "order");
CREATE INDEX idx_mading_is_featured ON mading_content(is_featured);
CREATE INDEX idx_mading_category ON mading_content(category);

CREATE TABLE public.popups (
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

CREATE INDEX idx_popups_active ON popups(is_active);
CREATE INDEX idx_popups_order ON popups(display_order);
CREATE INDEX idx_popups_date_range ON popups(start_date, end_date) WHERE (is_active = TRUE);
CREATE INDEX idx_popups_view_count ON popups(view_count);
CREATE INDEX idx_active_popups ON popups(display_order) WHERE is_active = TRUE;

CREATE TABLE public.room_types (
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
  CONSTRAINT check_room_price CHECK (price ~ '^\d+$' OR price = '')
);

CREATE INDEX idx_room_types_order ON room_types(display_order);
CREATE INDEX idx_room_types_availability ON room_types(availability);
CREATE INDEX idx_room_types_order_availability ON room_types(display_order, availability);

CREATE TABLE public.room_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  facility_name VARCHAR(255) NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  icon_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_facility_order CHECK (display_order >= 0)
);

CREATE INDEX idx_room_facilities_room_id ON room_facilities(room_id);
CREATE INDEX idx_room_facilities_order ON room_facilities(display_order);

CREATE TABLE public.room_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_image_order CHECK (display_order >= 0)
);

CREATE INDEX idx_room_images_room_id ON room_images(room_id);
CREATE INDEX idx_room_images_order ON room_images(display_order);
CREATE INDEX idx_room_images_is_primary ON room_images(is_primary);

CREATE TABLE public.mcu_packages (
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

CREATE INDEX idx_mcu_packages_order ON mcu_packages(display_order);
CREATE INDEX idx_mcu_packages_featured ON mcu_packages(is_featured) WHERE (is_featured = TRUE);
CREATE INDEX idx_mcu_packages_availability ON mcu_packages(availability);

CREATE TABLE public.careers_config (
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

CREATE UNIQUE INDEX idx_careers_config_single ON careers_config((1)) WHERE (TRUE);

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
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_careers_registrations_email ON careers_registrations(email);
CREATE INDEX idx_careers_registrations_created ON careers_registrations(created_at);
CREATE INDEX idx_careers_status ON careers_registrations(status);
CREATE INDEX idx_careers_reviewed_at ON careers_registrations(reviewed_at);

CREATE TABLE public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) DEFAULT 'admin',
  password_hash VARCHAR(255),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX idx_admin_users_last_login ON admin_users(last_login);

INSERT INTO storage.buckets (id, name, public) VALUES ('doctors', 'doctors', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('content', 'content', true) ON CONFLICT DO NOTHING;

UPDATE storage.buckets 
SET allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    file_size_limit = 5242880
WHERE id IN ('doctors', 'content');

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

DROP POLICY IF EXISTS "Public read doctors" ON doctors;
CREATE POLICY "Public read doctors" ON doctors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read schedules" ON schedules;
CREATE POLICY "Public read schedules" ON schedules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read hero_banners" ON hero_banners;
CREATE POLICY "Public read hero_banners" ON hero_banners FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read mading_content" ON mading_content;
CREATE POLICY "Public read mading_content" ON mading_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read popups" ON popups;
CREATE POLICY "Public read popups" ON popups FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read room_types" ON room_types;
CREATE POLICY "Public read room_types" ON room_types FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read room_facilities" ON room_facilities;
CREATE POLICY "Public read room_facilities" ON room_facilities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read room_images" ON room_images;
CREATE POLICY "Public read room_images" ON room_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read mcu_packages" ON mcu_packages;
CREATE POLICY "Public read mcu_packages" ON mcu_packages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read careers_config" ON careers_config;
CREATE POLICY "Public read careers_config" ON careers_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read careers_registrations" ON careers_registrations;
CREATE POLICY "Public read careers_registrations" ON careers_registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create career registration" ON careers_registrations;
CREATE POLICY "Anyone can create career registration" ON careers_registrations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read own profile" ON admin_users;
CREATE POLICY "Admin read own profile" ON admin_users FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Admin update all doctors" ON doctors;
CREATE POLICY "Admin update all doctors" ON doctors FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin insert all doctors" ON doctors;
CREATE POLICY "Admin insert all doctors" ON doctors FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete all doctors" ON doctors;
CREATE POLICY "Admin delete all doctors" ON doctors FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update all schedules" ON schedules;
CREATE POLICY "Admin update all schedules" ON schedules FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin insert all schedules" ON schedules;
CREATE POLICY "Admin insert all schedules" ON schedules FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete all schedules" ON schedules;
CREATE POLICY "Admin delete all schedules" ON schedules FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update all hero_banners" ON hero_banners;
CREATE POLICY "Admin update all hero_banners" ON hero_banners FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin insert all hero_banners" ON hero_banners;
CREATE POLICY "Admin insert all hero_banners" ON hero_banners FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete all hero_banners" ON hero_banners;
CREATE POLICY "Admin delete all hero_banners" ON hero_banners FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update all mading_content" ON mading_content;
CREATE POLICY "Admin update all mading_content" ON mading_content FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin insert all mading_content" ON mading_content;
CREATE POLICY "Admin insert all mading_content" ON mading_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete all mading_content" ON mading_content;
CREATE POLICY "Admin delete all mading_content" ON mading_content FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update all popups" ON popups;
CREATE POLICY "Admin update all popups" ON popups FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin insert all popups" ON popups;
CREATE POLICY "Admin insert all popups" ON popups FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete all popups" ON popups;
CREATE POLICY "Admin delete all popups" ON popups FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update all room_types" ON room_types;
CREATE POLICY "Admin update all room_types" ON room_types FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin insert all room_types" ON room_types;
CREATE POLICY "Admin insert all room_types" ON room_types FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete all room_types" ON room_types;
CREATE POLICY "Admin delete all room_types" ON room_types FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update all room_facilities" ON room_facilities;
CREATE POLICY "Admin update all room_facilities" ON room_facilities FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin insert all room_facilities" ON room_facilities;
CREATE POLICY "Admin insert all room_facilities" ON room_facilities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete all room_facilities" ON room_facilities;
CREATE POLICY "Admin delete all room_facilities" ON room_facilities FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update all room_images" ON room_images;
CREATE POLICY "Admin update all room_images" ON room_images FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin insert all room_images" ON room_images;
CREATE POLICY "Admin insert all room_images" ON room_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete all room_images" ON room_images;
CREATE POLICY "Admin delete all room_images" ON room_images FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update all mcu_packages" ON mcu_packages;
CREATE POLICY "Admin update all mcu_packages" ON mcu_packages FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin insert all mcu_packages" ON mcu_packages;
CREATE POLICY "Admin insert all mcu_packages" ON mcu_packages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete all mcu_packages" ON mcu_packages;
CREATE POLICY "Admin delete all mcu_packages" ON mcu_packages FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update all careers_config" ON careers_config;
CREATE POLICY "Admin update all careers_config" ON careers_config FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin insert all careers_config" ON careers_config;
CREATE POLICY "Admin insert all careers_config" ON careers_config FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update all careers_registrations" ON careers_registrations;
CREATE POLICY "Admin update all careers_registrations" ON careers_registrations FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete all careers_registrations" ON careers_registrations;
CREATE POLICY "Admin delete all careers_registrations" ON careers_registrations FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access admin_users" ON admin_users;
CREATE POLICY "Admin full access admin_users" ON admin_users FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX idx_doctors_search ON doctors USING GIN (
  (
    setweight(to_tsvector('indonesian', name), 'A') ||
    setweight(to_tsvector('indonesian', specialty), 'B') ||
    setweight(to_tsvector('indonesian', COALESCE(bio, '')), 'C')
  )
);

SELECT 'Migration completed successfully!' as status;
