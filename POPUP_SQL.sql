DROP TABLE IF EXISTS popups CASCADE;

CREATE TABLE popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER NOT NULL CHECK (display_order >= 1),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_popups_is_active ON popups(is_active);
CREATE INDEX idx_popups_display_order ON popups(display_order);
