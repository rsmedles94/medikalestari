# Analytics Setup Guide - Supabase Integration

## Daftar Isi

1. [Persiapan Supabase](#persiapan-supabase)
2. [Environment Variables](#environment-variables)
3. [Integrasi di Komponen](#integrasi-di-komponen)
4. [API Endpoints](#api-endpoints)

## Persiapan Supabase

### 1. Membuat Tabel `analytics_events`

Buka **Supabase Dashboard** → **SQL Editor** → **New Query**, lalu jalankan SQL berikut:

```sql
-- Buat tabel analytics_events
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  page_path VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat index untuk performa
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_event_name ON analytics_events(event_name);
```

### 2. Set Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy untuk insert (public dapat insert)
CREATE POLICY "Allow public insert" ON analytics_events
  FOR INSERT TO anon WITH CHECK (true);

-- Policy untuk select (hanya authenticated users)
CREATE POLICY "Allow authenticated select" ON analytics_events
  FOR SELECT USING (auth.role() = 'service_role');
```

## Environment Variables

Tambahkan ke `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

**Dapatkan nilai-nilai ini dari:**

- Supabase Dashboard → Settings → API

## Integrasi di Komponen

### Contoh 1: Track Page View

```tsx
"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/tracking";

export default function DoctorPage() {
  useEffect(() => {
    trackPageView("/dokter");
  }, []);

  return <div>Dokter Page</div>;
}
```

### Contoh 2: Track Button Click

```tsx
"use client";

import { trackButtonClick } from "@/lib/tracking";

export default function DoctorCard({ doctorId }: { doctorId: string }) {
  const handleViewDetail = async () => {
    await trackButtonClick("View Doctor Detail", `/dokter/${doctorId}`);
    // Navigate atau perform action lainnya
  };

  return <button onClick={handleViewDetail}>Lihat Detail</button>;
}
```

### Contoh 3: Track dengan Metadata

```tsx
import { trackEvent } from "@/lib/tracking";

await trackEvent("button_click", "Book Appointment", {
  doctorId: "123",
  specialization: "Cardiology",
});
```

## API Endpoints

### 1. Track Event (POST)

**Endpoint**: `/api/admin/analytics/track`

**Request Body**:

```json
{
  "event_type": "page_view",
  "event_name": "/dokter",
  "page_path": "/dokter",
  "metadata": {}
}
```

### 2. Get Analytics (GET)

**Endpoint**: `/api/admin/analytics`

**Query Parameters**:

- `type`: `"stats"` | `"pages"` | `"clicks"` (default: `"stats"`)
- `period`: `"today"` | `"week"` | `"month"` | `"all"` (default: `"all"`)

**Examples**:

```
GET /api/admin/analytics?type=stats
GET /api/admin/analytics?type=pages&period=week
GET /api/admin/analytics?type=clicks&period=month
```

**Response (stats)**:

```json
{
  "today": 42,
  "week": 289,
  "month": 1250,
  "total": 5432
}
```

**Response (pages)**:

```json
[
  { "event_name": "/dokter", "count": 156 },
  { "event_name": "/jadwal-dokter", "count": 98 },
  { "event_name": "/", "count": 312 }
]
```

## Dashboard Analytics

Akses di: `/admin/analytics`

Menampilkan:

- Pengunjung Hari Ini
- Pengunjung Minggu Ini
- Pengunjung Bulan Ini
- Total Pengunjung
- Halaman Paling Dikunjungi (Top 10)
- Button Paling Sering Diklik (Top 10)

## File-File yang Dibuat

- `lib/tracking.ts` - Utility untuk tracking events
- `app/api/admin/analytics/route.ts` - API endpoint untuk analytics
- `app/api/admin/analytics/track.ts` - API endpoint untuk track event
- `app/api/admin/analytics/page-views.ts` - Fungsi helper untuk queries
- `app/admin/analytics/page.tsx` - Dashboard analytics

## Best Practices

1. **Page View**: Track di setiap page menggunakan `useEffect`
2. **Button Click**: Track event penting seperti booking, filter, download
3. **Metadata**: Tambahkan info berguna untuk analisis
4. **Performance**: Tracking non-blocking (tidak menunggu response)
5. **Privacy**: Jangan track data sensitif user

## Troubleshooting

**Error: "Missing Supabase environment variables"**

- Pastikan `.env.local` sudah ada dan ter-fill
- Restart dev server setelah update `.env.local`

**Data tidak muncul di Analytics Page**

- Cek apakah tabel sudah dibuat
- Cek browser console untuk error
- Pastikan RLS policy sudah benar

**Query terlalu lambat**

- Pastikan index sudah dibuat
- Batasi period query
