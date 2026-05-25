# Setup Kolom Position Photos - Career Lowongan

## 🔧 Cara Menjalankan Migration

### Step 1: Buka Supabase Dashboard

1. Buka browser, masuk ke [Supabase](https://supabase.com)
2. Login ke project RS Medika Lestari
3. Klik menu **SQL Editor** di sidebar kiri

### Step 2: Jalankan SQL Query

Copy perintah SQL ini dan paste ke SQL Editor:

```sql
ALTER TABLE careers_config
ADD COLUMN IF NOT EXISTS position_photos JSONB DEFAULT '[]'::jsonb;
```

### Step 3: Eksekusi

1. Paste SQL di atas ke SQL Editor
2. Klik tombol **Run** (panah hijau di pojok kanan)
3. Tunggu sampai sukses (akan muncul pesan "Success")

---

## ✅ Verifikasi Sukses

Jika ingin memverifikasi kolom sudah ditambahkan, jalankan query ini:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'careers_config'
AND column_name = 'position_photos';
```

Hasil yang diharapkan:
| column_name | data_type |
|---|---|
| position_photos | jsonb |

---

## 📝 Catatan

- Kolom `position_photos` akan berisi array JSON dari foto dan nama posisi
- Default value adalah empty array `[]`
- Kolom otomatis dibuat jika belum ada (IF NOT EXISTS)

---

## 🚀 Selesai!

Setelah migration berhasil, aplikasi sudah siap menggunakan fitur Position Photos di Admin Panel Careers.
