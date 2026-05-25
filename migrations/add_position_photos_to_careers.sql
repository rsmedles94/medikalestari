-- Add position_photos column to careers_config table
ALTER TABLE careers_config
ADD COLUMN position_photos JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance
CREATE INDEX idx_careers_config_position_photos ON careers_config USING GIN (position_photos);

-- If you want to add a comment to document the column
COMMENT ON COLUMN careers_config.position_photos IS 'JSON array containing position photo objects with id, image_url, position_name, and order';
