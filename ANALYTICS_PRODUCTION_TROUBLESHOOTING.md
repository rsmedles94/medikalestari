# 🔍 Analytics Production Issues Troubleshooting

## Masalah

Di `https://medikalestari.vercel.app/admin/analytics`, analytics menunjukkan 0 atau tidak terbaca data setelah login.

## Penyebab Kemungkinan

### 1. **Environment Variables tidak benar di Vercel**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. **Supabase RLS (Row Level Security) terlalu ketat**

- Policy untuk read analytics mungkin tidak allow

### 3. **Tracking tidak ter-kirim di production**

- Network error atau timeout
- CORS issue
- API endpoint error

### 4. **Database query error**

- Table `analytics_events` struktur tidak match
- Index issue

## Solusi

### Step 1: Check Environment Variables di Vercel

1. Login ke Vercel Dashboard
2. Pilih project "medikalestari"
3. Buka "Settings" → "Environment Variables"
4. Pastikan ada:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   ```
5. Jika ada yang missing atau salah, tambahkan/update dan **redeploy**

### Step 2: Check Browser Console Error

1. Buka https://medikalestari.vercel.app/admin/analytics
2. Login
3. Buka DevTools (F12) → "Console" tab
4. Lihat apakah ada error merah
5. Catat error message lengkap

### Step 3: Check Network Requests

1. DevTools → "Network" tab
2. Refresh page
3. Lihat request ke `/api/admin/analytics`
4. Lihat response status (200, 401, 403, 500?)
5. Jika ada error, lihat response body

### Step 4: Verify Supabase Settings

#### Check RLS Policy

```sql
-- Jalankan di Supabase SQL Editor
-- Lihat semua policy untuk analytics_events table
SELECT * FROM pg_policies WHERE tablename = 'analytics_events';

-- Pastikan ada policy untuk read yang benar
SELECT * FROM information_schema.role_table_grants
WHERE table_name='analytics_events';
```

#### Reset RLS Policy (jika diperlukan)

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow insert for tracking" ON analytics_events;
DROP POLICY IF EXISTS "Allow read for authenticated" ON analytics_events;

-- Create new policies
CREATE POLICY "Allow insert for tracking" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read for authenticated" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to read all
CREATE POLICY "Allow service role" ON analytics_events
  FOR SELECT USING (auth.role() = 'service_role');
```

### Step 5: Test Tracking

1. Buka `/analytics-debug` page di production
2. Klik "Check Supabase connection"
3. Lihat response
4. Jika error, catat error message

### Step 6: Check Logs

**Vercel Logs:**

1. Vercel Dashboard → "Logs" → "Function Logs"
2. Filter untuk `/api/admin/analytics`
3. Lihat error messages

**Supabase Logs:**

1. Supabase Dashboard → "Logs"
2. Filter untuk errors
3. Lihat database query errors

## Code Changes Untuk Debugging

File `app/admin/analytics/page.tsx` sudah update dengan:

- ✅ Error state tracking
- ✅ Error display di UI
- ✅ Better error messages

Sekarang error akan ditampilkan di halaman analytics untuk debugging lebih mudah.

## Common Fixes

### Fix 1: Missing Service Role Key

```
Error: Missing required environment variables for Supabase server client
```

**Solusi:** Add `SUPABASE_SERVICE_ROLE_KEY` ke Vercel environment variables

### Fix 2: RLS Policy Too Strict

```
Error: Failed to fetch analytics
```

**Solusi:** Update RLS policy dengan code di Step 4

### Fix 3: Tracking API 500 Error

```
Track API error: error
```

**Solusi:**

- Check Supabase logs
- Pastikan table `analytics_events` struktur benar
- Rebuild & redeploy

## Quick Redeploy

Jika sudah update environment variables:

1. Vercel Dashboard
2. Pilih project medikalestari
3. Buka "Deployments"
4. Klik "⋮" pada latest deployment
5. Klik "Redeploy"

Atau push ke repo untuk auto-deploy.
