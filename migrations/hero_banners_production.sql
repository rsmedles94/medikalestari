-- Drop tabel lama
DROP TABLE IF EXISTS hero_banners CASCADE;

-- Buat tabel baru dengan support production URL
CREATE TABLE hero_banners (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  image_url TEXT NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  "order" INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk query yang lebih cepat
CREATE INDEX idx_hero_banners_active ON hero_banners(is_active);
CREATE INDEX idx_hero_banners_order ON hero_banners("order");
