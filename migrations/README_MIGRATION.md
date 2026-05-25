## Instruksi Menjalankan SQL Migration

### Opsi 1: Menggunakan Supabase Dashboard (Paling Mudah)

1. Buka dashboard Supabase di https://app.supabase.com
2. Pilih project RS Medika Lestari
3. Pergi ke **SQL Editor** (di sidebar kiri)
4. Klik **New Query**
5. Copy-paste SQL di bawah ini:

```sql
-- Add position_photos column to careers_config table
ALTER TABLE careers_config
ADD COLUMN position_photos JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance
CREATE INDEX idx_careers_config_position_photos ON careers_config USING GIN (position_photos);

-- If you want to add a comment to document the column
COMMENT ON COLUMN careers_config.position_photos IS 'JSON array containing position photo objects with id, image_url, position_name, and order';
```

6. Klik **Run** atau tekan `Ctrl+Enter`
7. Selesai! ✅

---

### Opsi 2: Menggunakan Supabase CLI (Recommended untuk Production)

1. Pastikan Supabase CLI sudah installed:

   ```powershell
   npm install -g supabase
   ```

2. Login ke Supabase:

   ```powershell
   supabase login
   ```

3. Run migration file:
   ```powershell
   supabase db push
   ```

---

### Opsi 3: Manual Copy-Paste ke SQL Editor

Cukup copy perintah SQL di atas ke Supabase SQL Editor dan jalankan.

---

## Verifikasi Berhasil

Setelah menjalankan SQL, cek di Supabase:

1. Buka **Table Editor**
2. Pilih table `careers_config`
3. Kamu seharusnya melihat kolom baru `position_photos` dengan tipe `jsonb`

Jika ada error "column already exists", itu berarti kolom sudah ada. Bisa lanjut test aplikasi.

---

## Perintah SQL Simple (Jika Ingin Minimal)

Jika hanya butuh kolom tanpa index dan comment:

```sql
ALTER TABLE careers_config ADD COLUMN position_photos JSONB DEFAULT '[]'::jsonb;
```

Gampang di-copy, cukup paste ke SQL Editor Supabase dan run! 🚀
