-- Drop existing table if exists
DROP TABLE IF EXISTS popups CASCADE;

-- Create popups table
CREATE TABLE popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_popups_is_active ON popups(is_active);
CREATE INDEX idx_popups_display_order ON popups(display_order);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_popups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_popups_updated_at ON popups;
CREATE TRIGGER trigger_popups_updated_at
  BEFORE UPDATE ON popups
  FOR EACH ROW
  EXECUTE FUNCTION update_popups_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read active popups" ON popups;
DROP POLICY IF EXISTS "Allow admin full access" ON popups;

-- Policy for public: can only read active popups
CREATE POLICY "Allow public read active popups" ON popups
  FOR SELECT
  USING (is_active = true);

-- Policy for admin: full access (authenticated users with admin role)
-- Adjust the condition based on your authentication setup
CREATE POLICY "Allow admin full access" ON popups
  USING (true)
  WITH CHECK (true);

-- Storage bucket for popup images
INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for popup images
DROP POLICY IF EXISTS "Allow public read content" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload content" ON storage.objects;

CREATE POLICY "Allow public read content" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'content');

CREATE POLICY "Allow authenticated upload content" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'content');

CREATE POLICY "Allow authenticated delete content" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'content');
