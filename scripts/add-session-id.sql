-- Tambah kolom session_id ke analytics_events jika belum ada
ALTER TABLE analytics_events
ADD COLUMN IF NOT EXISTS session_id VARCHAR(255) DEFAULT 'unknown';

-- Buat index untuk session_id agar query lebih cepat
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics_events(session_id);

-- Verify kolom sudah ada
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'analytics_events' AND column_name = 'session_id';
