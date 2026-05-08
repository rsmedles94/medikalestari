## 📊 Cara Memperbaiki Analytics yang Tidak Naik di Localhost

### ✅ Yang Sudah Saya Lakukan

1. **Aktifkan PageTracker** di `app/layout.tsx`
   - Sekarang setiap page view otomatis di-track

2. **Perbaiki Format Tracking** di `lib/analytics.ts`
   - Format sekarang konsisten: `{ event_type, event_name, page_path, metadata }`

3. **Dokumentasi Setup** di `ANALYTICS_SETUP.md`
   - SQL untuk membuat table `analytics_events`

---

### 🔧 Yang Perlu Anda Lakukan

#### **Langkah 1: Buat Database Table di Supabase**

1. Login ke Supabase Dashboard
2. Buka SQL Editor
3. Copy-paste SQL query ini:

```sql
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  event_name VARCHAR(255) NOT NULL,
  page_path VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_event_name ON analytics_events(event_name);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for tracking" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read for authenticated" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');
```

4. Klik "RUN" untuk menjalankan SQL

#### **Langkah 2: Verifikasi Environment Variables**

Pastikan file `.env.local` atau `.env` memiliki:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

#### **Langkah 3: Test Analytics**

1. **Buka halaman debug:**
   - Kunjungi: `http://localhost:3000/analytics-debug`

2. **Tes tracking:**
   - Klik tombol "Test trackPageView()"
   - Klik tombol "Test trackButtonClick()"
   - Lihat response "✅ sent successfully" atau "❌ Error"

3. **Cek dashboard:**
   - Kunjungi: `http://localhost:3000/admin/analytics`
   - Refresh beberapa kali untuk lihat data bertambah

---

### 🎯 Expected Results

Setelah semua langkah selesai:

- ✅ Counter "Pengunjung" akan naik saat refresh page
- ✅ Halaman yang dikunjungi akan tercatat
- ✅ Button clicks akan tercatat jika ada

### ⚠️ Jika Masih Tidak Muncul Data

1. **Cek Browser Console:**
   - Buka DevTools (F12)
   - Lihat tab "Console" untuk error messages

2. **Cek Network Tab:**
   - Lihat apakah request ke `/api/admin/analytics` berhasil (status 200)

3. **Cek Supabase Logs:**
   - Masuk ke Supabase Dashboard
   - Lihat query logs untuk error

4. **Restart Server:**
   ```bash
   # Hentikan server dengan Ctrl+C
   # Jalankan ulang
   npm run dev
   ```

---

**File yang diubah:**

- ✅ `app/layout.tsx` - Tambah PageTracker
- ✅ `lib/analytics.ts` - Perbaiki format tracking
