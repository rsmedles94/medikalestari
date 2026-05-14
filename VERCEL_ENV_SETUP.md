## Setup Environment Variables di Vercel

Untuk production deployment di Vercel, ikuti langkah-langkah berikut:

### 1. Login ke Vercel Dashboard

- Buka https://vercel.com/dashboard
- Pilih project "medikalestari"

### 2. Pergi ke Settings → Environment Variables

### 3. Tambahkan Variables Berikut:

**Variable 1:**

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://rmuojxmwdyxwhpnelolm.supabase.co
Environments: Production, Preview, Development
```

**Variable 2:**

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdW9qeG13ZHl4d2hwbmVsb2xtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MzM1MzIsImV4cCI6MjA5NDMwOTUzMn0.SUdyuD84JJHxWPlyIb5oVp6Dm8rZ-syYdKD63rV7M3s
Environments: Production, Preview, Development
```

**Variable 3:**

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtdW9qeG13ZHl4d2hwbmVsb2xtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODczMzUzMiwiZXhwIjoyMDk0MzA5NTMyfQ.5lrq0LTMyh0krPmAQANqPeqSZw-81NTFroJteusb8vs
Environments: Production, Preview, Development
```

### 4. Klik "Save"

### 5. Redeploy Project

```bash
# Di terminal lokal:
git add .
git commit -m "Update environment variables for production"
git push
```

Atau trigger redeploy manual di Vercel Dashboard → Deployments → Click latest → Redeploy

### ⚠️ PENTING:

- Jangan push `.env.local` ke git
- Pastikan `.env.local` sudah di `.gitignore`
- NEXT*PUBLIC*\* variables akan expose di client-side, itu normal untuk Supabase keys
- SUPABASE_SERVICE_ROLE_KEY hanya untuk server-side operations

### Test Production

Setelah redeploy, coba:

1. Buka aplikasi di Vercel URL
2. Coba login dengan Supabase auth
3. Cek console browser untuk error messages

Kalau masih error, check:

- Network tab di DevTools → lihat request ke Supabase
- Console tab → lihat error details
- Vercel Logs → lihat server-side errors
