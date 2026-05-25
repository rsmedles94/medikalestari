-- Add position_photos column to careers_config table
ALTER TABLE careers_config ADD COLUMN position_photos JSONB DEFAULT '[]';
