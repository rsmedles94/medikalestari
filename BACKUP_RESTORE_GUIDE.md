# 🔄 Panduan Backup & Restore Database Supabase

## 📌 Quick Reference

- **Akun Lama:** Project ID: `zecqskgvmfyorhxzhoeu` (dari next.config.ts)
- **Akun Baru:** [GANTI_DENGAN_PROJECT_ID_BARU]
- **Database:** PostgreSQL (Supabase)
- **Tabel:** 12 tabel utama

---

## 1️⃣ BACKUP DATA DARI AKUN LAMA

### Metode A: Export via Supabase Dashboard

```bash
# 1. Login ke https://app.supabase.com
# 2. Pilih project lama (zecqskgvmfyorhxzhoeu)
# 3. Buka Settings → Backups
# 4. Klik "Download" untuk backup terbaru
```

### Metode B: Export via CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login ke CLI
supabase login

# Link ke project lama
supabase link --project-ref zecqskgvmfyorhxzhoeu

# Pull database schema & data
supabase db pull

# Export specific table ke CSV
supabase db pull --db-url "postgresql://postgres:[PASSWORD]@db.zecqskgvmfyorhxzhoeu.supabase.co:5432/postgres" --output-file backup_old.sql
```

### Metode C: Export via psql (Direct)

```bash
# Siapkan koneksi string dari Supabase akun lama
# Ambil dari Settings → Database → Connection String

# Export semua data
pg_dump "postgresql://postgres:[PASSWORD]@db.zecqskgvmfyorhxzhoeu.supabase.co:5432/postgres" \
  --clean --if-exists --file backup_old.sql

# Export hanya data (tanpa schema)
pg_dump "postgresql://postgres:[PASSWORD]@db.zecqskgvmfyorhxzhoeu.supabase.co:5432/postgres" \
  --data-only --no-privileges --output=backup_data_only.sql
```

### Metode D: Export Table by Table sebagai CSV

**File: `scripts/export-csv.js`**

```javascript
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const { stringify } = require("csv-stringify/sync");

const supabase = createClient(
  process.env.OLD_SUPABASE_URL,
  process.env.OLD_SUPABASE_KEY,
);

const tables = [
  "doctors",
  "schedules",
  "hero_banners",
  "mading_content",
  "room_types",
  "room_facilities",
  "room_images",
  "career_registrations",
  "careers_banner_config",
  "mcu_packages",
  "admin_users",
  "popups",
];

async function exportCSV() {
  for (const table of tables) {
    console.log(`Exporting ${table}...`);

    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.error(`Error exporting ${table}:`, error);
      continue;
    }

    if (data && data.length > 0) {
      const csv = stringify(data, {
        header: true,
        columns: Object.keys(data[0]),
      });

      fs.writeFileSync(`backups/${table}.csv`, csv);
      console.log(`✓ ${table}: ${data.length} records exported`);
    }
  }
}

exportCSV().catch(console.error);
```

**Jalankan:**

```bash
OLD_SUPABASE_URL=... OLD_SUPABASE_KEY=... node scripts/export-csv.js
```

---

## 2️⃣ SETUP SCHEMA DI AKUN BARU

### Step 1: Jalankan SQL Setup Script

```bash
# 1. Buka file MIGRATION_SQL_SETUP.sql
# 2. Copy isi file tersebut
# 3. Buka Supabase Dashboard akun baru
# 4. Pergi ke SQL Editor
# 5. Paste script
# 6. Klik "Run"
```

### Step 2: Verifikasi Schema

```sql
-- Check apakah semua tabel sudah dibuat
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected output: 12 tabel
```

---

## 3️⃣ RESTORE DATA KE AKUN BARU

### Metode A: Direct SQL Dump Restore

```bash
# Menggunakan psql
psql "postgresql://postgres:[NEW_PASSWORD]@db.[NEW_PROJECT].supabase.co:5432/postgres" \
  -f backup_old.sql
```

### Metode B: Restore via Supabase CLI

```bash
# Link ke project baru
supabase link --project-ref [NEW_PROJECT_ID]

# Push backup file
supabase db push < backup_old.sql
```

### Metode C: Restore via Node.js Script (Recommended)

**File: `scripts/restore-data.js`**

```javascript
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Connection ke akun baru
const supabase = createClient(
  process.env.NEW_SUPABASE_URL,
  process.env.NEW_SUPABASE_KEY,
);

// Urutan restore penting! Parent tables dulu
const restoreOrder = [
  "doctors",
  "schedules",
  "hero_banners",
  "mading_content",
  "room_types",
  "room_facilities",
  "room_images",
  "career_registrations",
  "careers_banner_config",
  "mcu_packages",
  "admin_users",
  "popups",
];

async function restoreData() {
  for (const table of restoreOrder) {
    const csvFile = `backups/${table}.csv`;

    if (!fs.existsSync(csvFile)) {
      console.warn(`⚠️  File not found: ${csvFile}`);
      continue;
    }

    console.log(`Restoring ${table}...`);

    // Read CSV file
    const csv = fs.readFileSync(csvFile, "utf-8");
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const record = {};
      headers.forEach((header, index) => {
        record[header] = values[index]?.trim() || null;
      });
      records.push(record);
    }

    // Insert data
    if (records.length > 0) {
      const { error } = await supabase.from(table).insert(records);

      if (error) {
        console.error(`❌ Error restoring ${table}:`, error);
      } else {
        console.log(`✓ ${table}: ${records.length} records restored`);
      }
    }
  }

  console.log("\n✅ Restore complete!");
}

restoreData().catch(console.error);
```

**Jalankan:**

```bash
NEW_SUPABASE_URL=... NEW_SUPABASE_KEY=... node scripts/restore-data.js
```

### Metode D: Restore dari SQL Dump (Manual)

```sql
-- 1. Copy file backup_data_only.sql
-- 2. Buka SQL Editor di Supabase Dashboard akun baru
-- 3. Paste content backup_data_only.sql
-- 4. Klik "Run"
```

---

## 4️⃣ VERIFIKASI DATA

### Query Verifikasi

```sql
-- Total records per table
SELECT
  'doctors' as table_name, COUNT(*) as record_count FROM public.doctors
UNION ALL SELECT 'schedules', COUNT(*) FROM public.schedules
UNION ALL SELECT 'hero_banners', COUNT(*) FROM public.hero_banners
UNION ALL SELECT 'mading_content', COUNT(*) FROM public.mading_content
UNION ALL SELECT 'room_types', COUNT(*) FROM public.room_types
UNION ALL SELECT 'room_facilities', COUNT(*) FROM public.room_facilities
UNION ALL SELECT 'room_images', COUNT(*) FROM public.room_images
UNION ALL SELECT 'career_registrations', COUNT(*) FROM public.career_registrations
UNION ALL SELECT 'careers_banner_config', COUNT(*) FROM public.careers_banner_config
UNION ALL SELECT 'mcu_packages', COUNT(*) FROM public.mcu_packages
UNION ALL SELECT 'admin_users', COUNT(*) FROM public.admin_users
UNION ALL SELECT 'popups', COUNT(*) FROM public.popups
ORDER BY table_name;

-- Verify referential integrity
SELECT
  COUNT(*) as orphaned_schedules
FROM public.schedules s
WHERE NOT EXISTS (SELECT 1 FROM public.doctors d WHERE d.id = s.doctor_id);

SELECT
  COUNT(*) as orphaned_facilities
FROM public.room_facilities f
WHERE NOT EXISTS (SELECT 1 FROM public.room_types r WHERE r.id = f.room_id);

SELECT
  COUNT(*) as orphaned_images
FROM public.room_images i
WHERE NOT EXISTS (SELECT 1 FROM public.room_types r WHERE r.id = i.room_id);
```

---

## 5️⃣ MIGRATE STORAGE (Images/Files)

### Opsi A: Direct Storage Copy

```bash
# 1. Download semua files dari storage bucket lama
aws s3 sync \
  s3://zecqskgvmfyorhxzhoeu/doctors \
  ./downloads/doctors

aws s3 sync \
  s3://zecqskgvmfyorhxzhoeu/content \
  ./downloads/content

# 2. Upload ke storage bucket baru
aws s3 sync \
  ./downloads/doctors \
  s3://[NEW_PROJECT]/doctors

aws s3 sync \
  ./downloads/content \
  s3://[NEW_PROJECT]/content
```

### Opsi B: Via Supabase Dashboard

1. Buka project lama → Storage
2. Download semua files
3. Buka project baru → Storage
4. Upload semua files ke bucket yang sesuai

### Opsi C: Programmatic Transfer

**File: `scripts/migrate-storage.js`**

```javascript
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const oldSupabase = createClient(
  process.env.OLD_SUPABASE_URL,
  process.env.OLD_SUPABASE_KEY,
);

const newSupabase = createClient(
  process.env.NEW_SUPABASE_URL,
  process.env.NEW_SUPABASE_KEY,
);

const buckets = ["doctors", "content"];

async function migrateStorage() {
  for (const bucket of buckets) {
    console.log(`\nMigrating bucket: ${bucket}`);

    // List files dari bucket lama
    const { data: files, error: listError } = await oldSupabase.storage
      .from(bucket)
      .list();

    if (listError) {
      console.error(`Error listing ${bucket}:`, listError);
      continue;
    }

    for (const file of files) {
      console.log(`  Migrating: ${file.name}`);

      // Download file dari bucket lama
      const { data, error: downloadError } = await oldSupabase.storage
        .from(bucket)
        .download(file.name);

      if (downloadError) {
        console.error(`    Error downloading: ${downloadError}`);
        continue;
      }

      // Upload ke bucket baru
      const { error: uploadError } = await newSupabase.storage
        .from(bucket)
        .upload(file.name, data, {
          upsert: true,
        });

      if (uploadError) {
        console.error(`    Error uploading: ${uploadError}`);
      } else {
        console.log(`    ✓ ${file.name} migrated`);
      }
    }
  }

  console.log("\n✅ Storage migration complete!");
}

migrateStorage().catch(console.error);
```

**Jalankan:**

```bash
OLD_SUPABASE_URL=... OLD_SUPABASE_KEY=... \
NEW_SUPABASE_URL=... NEW_SUPABASE_KEY=... \
node scripts/migrate-storage.js
```

---

## 6️⃣ UPDATE ENVIRONMENT VARIABLES

### File: `.env.local`

```env
# Update dengan akun Supabase baru
NEXT_PUBLIC_SUPABASE_URL=https://[NEW_PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[NEW_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[NEW_SERVICE_ROLE_KEY]
```

### Production (Vercel/Railway/etc)

1. Login ke dashboard hosting
2. Update environment variables
3. Redeploy aplikasi

---

## 7️⃣ TESTING CHECKLIST

- [ ] Halaman dokter tampil dengan data baru
- [ ] Jadwal dokter filter bekerja
- [ ] Hero banners loading
- [ ] Mading content tampil
- [ ] Kamar perawatan list lengkap
- [ ] Galeri foto kamar bekerja
- [ ] Form registrasi kerja submit
- [ ] Admin dashboard akses
- [ ] Upload gambar berfungsi
- [ ] Search/filter di semua halaman

---

## 🚨 TROUBLESHOOTING

### Error: "Foreign Key Constraint Violation"

```
Solusi: Restore dalam urutan yang benar
Urutan: doctors → schedules → (room_types → room_facilities, room_images)
```

### Error: "Duplicate Key Value"

```
Solusi: Clear data lama dulu sebelum restore
DELETE FROM tabel_name;
```

### Error: "UUID Format Invalid"

```
Solusi: Ensure field UUID di export memiliki format yang valid
```

### Storage Files Tidak Ter-migrate

```
Solusi:
1. Verify bucket permissions di Supabase Dashboard
2. Ensure bucket adalah public
3. Check image URLs masih valid
```

---

## 📊 Quick Commands

```bash
# Check backup status
ls -lah backups/

# Verify connectivity ke old account
psql "postgresql://postgres:[OLD_PASSWORD]@db.zecqskgvmfyorhxzhoeu.supabase.co:5432/postgres" -c "SELECT version();"

# Verify connectivity ke new account
psql "postgresql://postgres:[NEW_PASSWORD]@db.[NEW_PROJECT].supabase.co:5432/postgres" -c "SELECT version();"

# Count total records
grep -c '^' backups/*.csv
```

---

## 📝 Notes

- Selalu test di environment staging dulu
- Keep backup files di safe location
- Update dokumentasi setelah migrasi
- Inform team tentang perubahan akun
- Monitor logs setelah deployment

---

**Last Updated:** 14 Mei 2026  
**Status:** Ready for Migration
