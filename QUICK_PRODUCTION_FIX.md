# 🚀 PERBAIKAN HERO BANNER PRODUCTION - LANGSUNG LANGKAH

## Masalah

Hero banner blank hitam di production, normal di localhost.

## Solusi

### 1️⃣ Copy SQL Query

Buka: https://app.supabase.com → SQL Editor

Copy-paste seluruh isi dari: `scripts/hero-banners-rls-setup.sql`

Jalankan (Ctrl+Enter).

### 2️⃣ Verify

Query ini harusnya menampilkan minimal 1-2 banner:

```sql
SELECT id, image_url, device_type, is_active FROM hero_banners WHERE is_active = true;
```

Jika kosong, insert dummy banner:

```sql
INSERT INTO hero_banners (image_url, device_type, is_active, "order")
VALUES ('/mcu.png', 'desktop', true, 1), ('/mcu.png', 'mobile', true, 1);
```

### 3️⃣ Push Code Changes

```bash
git add .
git commit -m "fix: update hero banner fetch to use supabase client directly"
git push
```

### 4️⃣ Wait for Vercel Deploy

Buka: https://vercel.com → medikalestari → lihat recent deployment

Tunggu sampai hijau ✅

### 5️⃣ Test

Buka: https://medikalestari.vercel.app/

Refresh page (Ctrl+F5) → Hero banner harus muncul

✅ Selesai!
