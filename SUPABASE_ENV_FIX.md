# Fix: Supabase Environment Variables di Vercel

## 🔴 Masalah

Error saat build di Vercel:

```
Error: supabaseKey is required.
    at new rT (.next/server/chunks/096._@supabase_supabase-js_dist_index_mjs_0qqs3z-._.js:37:43730)
```

## ✅ Solusi

### 1. Perbaikan Code (SUDAH DILAKUKAN)

File yang diperbaiki:

- `app/api/admin/hero-banners/route.ts` - Memindahkan `createClient()` dari module scope ke dalam fungsi handler

**Alasan:** Ketika code di-build, Supabase client tidak boleh diinisialisasi di module scope dengan empty string. Harus dilakukan di runtime ketika environment variables sudah tersedia.

### 2. Konfigurasi Vercel Environment Variables (HARUS DILAKUKAN)

Tambahkan ke Vercel Project Settings → Environment Variables:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Langkah-langkah:**

1. Buka https://vercel.com/dashboard
2. Pilih project "medikalestari"
3. Pergi ke **Settings** → **Environment Variables**
4. Klik **Add New Variable**
5. Key: `SUPABASE_SERVICE_ROLE_KEY`
6. Value: (copy dari `.env.local` atau Supabase dashboard)
7. Environments: Select **Production**, **Preview**, dan **Development**
8. Klik **Save**

### 3. Dapatkan Service Role Key

Jika tidak punya:

1. Buka https://app.supabase.com
2. Pilih project "rs-medika-lestari"
3. Pergi ke **Settings** → **API**
4. Copy token di bagian **Service Role Secret** (bukan Anon Key)

### 4. Environment Variables yang Diperlukan

Di Vercel, pastikan sudah ada:

```
NEXT_PUBLIC_SUPABASE_URL=https://zecqskgvmfyorhxzhoeu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Catatan:**

- `NEXT_PUBLIC_*` bisa di-commit ke repo (aman, sudah public)
- `SUPABASE_SERVICE_ROLE_KEY` JANGAN di-commit (sensitif!)

### 5. Deploy Ulang

Setelah setting environment variables:

1. Pergi ke **Deployments**
2. Klik menu (...) pada deployment terakhir
3. Pilih **Redeploy**
4. Tunggu hingga selesai

## 📋 Files Modified

### `/app/api/admin/hero-banners/route.ts`

- ❌ Removed: Client initialization di module scope
- ✅ Added: `getAdminClient()` function yang lazy-load client di runtime
- ✅ Updated: POST, PUT, DELETE handlers untuk memanggil `getAdminClient()`

## 🔍 Verifikasi

Setelah deploy, cek error logs di Vercel:

1. Buka project di vercel.com
2. Tab **Functions**
3. Cari route `/api/admin/hero-banners`
4. Seharusnya tidak ada error tentang `supabaseKey`

## 🎯 Hasil Akhir

- ✅ Build tidak akan error karena environment variables
- ✅ API akan dapat akses Service Role Key untuk bypass RLS
- ✅ Client dibuat hanya saat dibutuhkan (runtime, bukan build time)
