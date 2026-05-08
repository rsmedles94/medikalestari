# 🚀 Quick Start - Analytics Supabase

## ✅ Status: SIAP DIGUNAKAN

Analytics sudah berhasil diintegrasikan dengan Supabase dan **otomatis refresh setiap 30 detik** (near real-time).

## 📋 Yang Sudah Dibuat

### 1. Dashboard Analytics (`/admin/analytics`)

- ✅ Tampilkan pengunjung: hari ini, minggu, bulan, total
- ✅ Halaman paling dikunjungi (Top 10)
- ✅ Button paling sering diklik (Top 10)
- ✅ Auto-refresh setiap 30 detik
- ✅ Tampil waktu last update

### 2. Tracking Functions (`lib/tracking.ts`)

- ✅ `trackPageView(pagePath)` - Track halaman
- ✅ `trackButtonClick(buttonName, pagePath)` - Track button
- ✅ `trackEvent(type, name, metadata)` - Custom event

### 3. API Endpoints

- ✅ `POST /api/admin/analytics/track` - Submit event
- ✅ `GET /api/admin/analytics?type=stats` - Ambil stats
- ✅ `GET /api/admin/analytics?type=pages&period=week` - Top pages
- ✅ `GET /api/admin/analytics?type=clicks&period=month` - Top clicks

## 🔧 Setup (HANYA 2 LANGKAH!)

### Langkah 1: Buat Tabel di Supabase

Buka **Supabase Dashboard** → **SQL Editor** → Jalankan:

```sql
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  page_path VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_event_name ON analytics_events(event_name);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON analytics_events
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated select" ON analytics_events
  FOR SELECT USING (auth.role() = 'service_role');
```

### Langkah 2: Update `.env.local`

Dapatkan dari **Supabase Dashboard → Settings → API**, lalu tambahkan ke `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**✅ SELESAI! Analytics sudah bisa digunakan.**

## 📝 Cara Pakai: Track Page Views

Di setiap halaman, tambahkan di `useEffect`:

```tsx
"use client";
import { useEffect } from "react";
import { trackPageView } from "@/lib/tracking";

export default function DoctorPage() {
  useEffect(() => {
    trackPageView("/dokter");
  }, []);

  return <div>Daftar Dokter</div>;
}
```

## 🖱️ Cara Pakai: Track Button Clicks

Untuk button penting (booking, lihat detail, dll):

```tsx
import { trackButtonClick } from "@/lib/tracking";

export default function DoctorCard({ doctorId }: { doctorId: string }) {
  const handleViewDetail = async () => {
    await trackButtonClick("View Doctor Detail");
    // Navigate atau action lainnya
  };

  return <button onClick={handleViewDetail}>Lihat Detail</button>;
}
```

## 📊 Hasil yang Bisa Dilihat

Di `/admin/analytics` akan tampilkan:

1. **Pengunjung**
   - Hari ini
   - Minggu ini
   - Bulan ini
   - Total sepanjang waktu

2. **Halaman Paling Dikunjungi**
   - Nama halaman
   - Jumlah kunjungan
   - Bar chart dengan persentase

3. **Button Paling Sering Diklik**
   - Nama button/action
   - Jumlah clicks
   - Bar chart dengan persentase

4. **Auto-Refresh**
   - Update otomatis setiap 30 detik
   - Tampil jam last update di top right

## ⚡ Real-Time atau Delayed?

**Saat ini: NEAR REAL-TIME**

- Data update otomatis setiap 30 detik
- Tidak true real-time (tidak update per detik)
- Optimal untuk monitoring, tidak resource-heavy

**Jika ingin true real-time:**

- Bisa upgrade dengan WebSocket/Supabase Realtime
- Hubungi untuk setup lebih lanjut

## 📁 File-File Penting

```
lib/
  └─ tracking.ts                    # Utility untuk tracking
app/api/admin/analytics/
  ├─ route.ts                       # Main API endpoint
  ├─ track.ts                       # POST endpoint untuk track
  └─ page-views.ts                  # Query helpers
app/admin/analytics/
  └─ page.tsx                       # Dashboard
ANALYTICS_SETUP.md                  # Dokumentasi lengkap
ANALYTICS_SUMMARY.md                # Summary fitur
```

## 🎯 Next Steps

1. ✅ Buat tabel Supabase (Langkah 1)
2. ✅ Update `.env.local` (Langkah 2)
3. ✅ Tambah tracking di halaman (gunakan contoh di atas)
4. ✅ Buka `/admin/analytics` untuk melihat data
5. 🎉 Selesai!

## ❓ FAQ

**Q: Kapan data muncul?**
A: Otomatis muncul di dashboard setelah tracking di halaman/button dilakukan.

**Q: Berapa lama delay-nya?**
A: Max 30 detik (sesuai interval refresh).

**Q: Data real-time?**
A: Near real-time (update setiap 30 detik), bukan per detik.

**Q: Bisa track custom data?**
A: Ya, pakai `trackEvent()` dengan metadata.

**Q: Kalau environment variable belum diisi?**
A: Error di console, tabel tidak terkoneksi. Lengkapi `.env.local` terlebih dahulu.

## 📞 Butuh Bantuan?

- Cek browser console untuk error
- Verifikasi tabel di Supabase Dashboard
- Pastikan `.env.local` sudah benar
- Lihat `ANALYTICS_SETUP.md` untuk setup detail
