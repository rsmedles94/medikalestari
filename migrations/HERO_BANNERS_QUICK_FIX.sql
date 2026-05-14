-- ============================================================================
-- QUICK COPY PASTE - HERO BANNERS TABLE RESET
-- ============================================================================
-- Salin SEMUA kode di bawah, buka Supabase SQL Editor, paste, dan RUN!

DROP TABLE IF EXISTS public.hero_banners CASCADE;

CREATE TABLE public.hero_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  device_type VARCHAR(20) NOT NULL DEFAULT 'desktop' CHECK (device_type IN ('desktop', 'mobile')),
  order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_hero_banners_is_active ON public.hero_banners(is_active);
CREATE INDEX idx_hero_banners_device_type ON public.hero_banners(device_type);
CREATE INDEX idx_hero_banners_order ON public.hero_banners(order);
CREATE INDEX idx_hero_banners_active_device_order ON public.hero_banners(is_active, device_type, order);

ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read active banners"
  ON public.hero_banners
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow authenticated users full access"
  ON public.hero_banners
  FOR ALL
  USING (auth.role() = 'authenticated');

GRANT SELECT ON public.hero_banners TO anon;
GRANT SELECT ON public.hero_banners TO authenticated;
GRANT ALL ON public.hero_banners TO service_role;
