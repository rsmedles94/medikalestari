-- ============================================================================
-- HERO BANNERS TABLE MIGRATION
-- Drop lama dan buat ulang dengan support production image URLs
-- ============================================================================

-- 1. DROP TABLE LAMA (jika ada)
DROP TABLE IF EXISTS public.hero_banners CASCADE;

-- 2. BUAT TABLE BARU DENGAN STRUKTUR YANG LEBIH BAIK
CREATE TABLE public.hero_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  device_type VARCHAR(20) NOT NULL DEFAULT 'desktop' CHECK (device_type IN ('desktop', 'mobile')),
  order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. BUAT INDEX UNTUK QUERY YANG SERING DIGUNAKAN
CREATE INDEX idx_hero_banners_is_active ON public.hero_banners(is_active);
CREATE INDEX idx_hero_banners_device_type ON public.hero_banners(device_type);
CREATE INDEX idx_hero_banners_order ON public.hero_banners(order);
CREATE INDEX idx_hero_banners_active_device_order ON public.hero_banners(is_active, device_type, order);

-- 4. AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICY - ANON/PUBLIC: HANYA BISA BACA YANG AKTIF
CREATE POLICY "Allow public read active banners"
  ON public.hero_banners
  FOR SELECT
  USING (is_active = true);

-- 6. RLS POLICY - ADMIN: FULL ACCESS (gunakan admin client)
-- Admin akan menggunakan service role key yang bypass RLS
-- Jadi policy ini untuk aplikasi client saja
CREATE POLICY "Allow authenticated users full access"
  ON public.hero_banners
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 7. INSERT SAMPLE DATA (PRODUCTION URL - GANTI DENGAN URL ANDA)
-- Desktop banners
INSERT INTO public.hero_banners (image_url, device_type, order, is_active) VALUES
  ('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1900&h=720&fit=crop', 'desktop', 1, true),
  ('https://images.unsplash.com/photo-1631217b22e6d4fdf4d87eb98e7f93ea8c0db7b6?w=1900&h=720&fit=crop', 'desktop', 2, true),
  ('https://images.unsplash.com/photo-1576091160595-112173faf246?w=1900&h=720&fit=crop', 'desktop', 3, true);

-- Mobile banners
INSERT INTO public.hero_banners (image_url, device_type, order, is_active) VALUES
  ('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=540&h=2760&fit=crop', 'mobile', 1, true),
  ('https://images.unsplash.com/photo-1631217b22e6d4fdf4d87eb98e7f93ea8c0db7b6?w=540&h=2760&fit=crop', 'mobile', 2, true),
  ('https://images.unsplash.com/photo-1576091160595-112173faf246?w=540&h=2760&fit=crop', 'mobile', 3, true);

-- 8. GRANT PERMISSION (SESUAIKAN DENGAN ROLE ANDA)
GRANT SELECT ON public.hero_banners TO anon;
GRANT SELECT ON public.hero_banners TO authenticated;
GRANT ALL ON public.hero_banners TO service_role;

-- ============================================================================
-- NOTES UNTUK PRODUCTION:
-- ============================================================================
-- 
-- 1. IMAGE URL HARUS ABSOLUTE URL (tidak localhost!)
--    ✅ Benar: https://your-domain.com/images/banner.jpg
--    ✅ Benar: https://cdn.your-domain.com/banner.jpg
--    ❌ Salah: /storage/v1/object/public/hero-banners/banner.jpg
--    ❌ Salah: http://localhost:3000/banner.jpg
--
-- 2. GUNAKAN SUPABASE PUBLIC STORAGE:
--    Jika menyimpan di Supabase, gunakan format:
--    https://{PROJECT_ID}.supabase.co/storage/v1/object/public/{BUCKET}/{PATH}
--    
--    Contoh:
--    https://abc123.supabase.co/storage/v1/object/public/hero-banners/desktop-banner-1.jpg
--
-- 3. UNTUK CLOUDINARY / CDN EKSTERNAL:
--    https://res.cloudinary.com/your-cloud/image/upload/hero-banner.jpg
--
-- 4. JIKA MENGGUNAKAN RELATIVE PATH, PASTIKAN SUPABASE DOMAIN DI ENVIRONMENT:
--    NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
--
-- ============================================================================
