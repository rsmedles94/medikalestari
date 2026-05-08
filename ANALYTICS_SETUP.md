# Setup Analytics Database

## Langkah-langkah untuk setup Analytics di Supabase

### 1. Buat Table `analytics_events`

Jalankan SQL query ini di Supabase SQL Editor:

```sql
-- Create analytics_events table
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  page_path VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create index untuk query lebih cepat
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_event_name ON analytics_events(event_name);

-- Enable RLS (Row Level Security)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Izinkan insert dari anonymous user (untuk tracking)
CREATE POLICY "Allow insert for tracking" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Izinkan read hanya untuk authenticated users (untuk admin analytics)
CREATE POLICY "Allow read for authenticated" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 2. Verifikasi Environment Variables

Pastikan `.env.local` atau `.env` memiliki:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Test Analytics

1. Buka http://localhost:3000/analytics-debug
2. Klik "Test trackPageView()" dan "Test trackButtonClick()"
3. Lihat response dari API
4. Buka http://localhost:3000/admin/analytics untuk lihat data

## Troubleshooting

### Analytics menunjukkan 0 data di localhost?

**Penyebab:**

- Database table belum dibuat
- Environment variables tidak benar
- Events tidak di-track (PageTracker tidak aktif)

**Solusi:**

1. Buat table sesuai instruksi di atas
2. Periksa environment variables
3. Pastikan PageTracker dijalankan di layout

### Perubahan yang dibuat:

- ✅ Added `PageTracker` ke `app/layout.tsx`
- ✅ Fixed `lib/analytics.ts` untuk re-export dari `lib/tracking.ts`
- ✅ Tracking sekarang konsisten menggunakan format: `{ event_type, event_name, page_path, metadata }`
