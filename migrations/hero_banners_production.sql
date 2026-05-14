-- Drop tabel lama beserta RLS policies
BEGIN;
DROP TABLE IF EXISTS hero_banners CASCADE;

-- Buat tabel baru dengan support production URL
CREATE TABLE public.hero_banners (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  image_url TEXT NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk query yang lebih cepat
CREATE INDEX idx_hero_banners_active ON public.hero_banners(is_active);
CREATE INDEX idx_hero_banners_order ON public.hero_banners("order");

-- Enable RLS
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Policy untuk read (public)
CREATE POLICY "hero_banners_read_policy" ON public.hero_banners
  FOR SELECT
  USING (is_active = true);

-- Policy untuk write (admin only - via service role)
CREATE POLICY "hero_banners_write_policy" ON public.hero_banners
  FOR ALL
  USING (auth.role() = 'authenticated');

COMMIT;
