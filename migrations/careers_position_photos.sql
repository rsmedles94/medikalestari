-- Migration: Add position_photos column to careers_config table
-- Date: 2026-05-25
-- Description: Add support for storing position photos with their metadata

-- Jalankan perintah SQL ini di Supabase SQL Editor
-- Atau copy-paste ke Supabase > SQL Editor > pilih database > paste > Run

ALTER TABLE careers_config
ADD COLUMN IF NOT EXISTS position_photos JSONB DEFAULT '[]'::jsonb;

-- Verify kolom sudah ditambahkan (optional, untuk pengecekan)
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'careers_config' AND column_name = 'position_photos';
