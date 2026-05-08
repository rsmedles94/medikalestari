## 📋 Production Analytics Checklist

### ✅ Apa yang sudah dilakukan

1. **Improved Error Handling**
   - File: `lib/tracking.ts` - Added response status check
   - File: `app/admin/analytics/page.tsx` - Added error state & display

2. **Error Display UI**
   - Sekarang error akan terlihat di halaman analytics
   - Developer bisa debug dengan lebih mudah

### 🔍 Apa yang perlu dicek di Vercel

#### 1. Cek Environment Variables
```
Go to: Vercel Dashboard → Project → Settings → Environment Variables

Pastikan ada 3 variables:
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY

Jika ada yang missing: ADD → REDEPLOY
```

#### 2. Cek Supabase RLS Policy

```sql
-- Jalankan di Supabase SQL Editor untuk reset policies

DROP POLICY IF EXISTS "Allow insert for tracking" ON analytics_events;
DROP POLICY IF EXISTS "Allow read for authenticated" ON analytics_events;
DROP POLICY IF EXISTS "Allow service role" ON analytics_events;

CREATE POLICY "Allow insert for tracking" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read for authenticated" ON analytics_events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role" ON analytics_events
  FOR SELECT USING (auth.role() = 'service_role');
```

#### 3. Test & Debug

**Test di Production:**
1. Buka: `https://medikalestari.vercel.app/analytics-debug`
2. Klik "Check Supabase connection"
3. Lihat response:
   - ✅ `✅ Supabase connected! Data: {...}` = Berhasil
   - ❌ `❌ Supabase Error: ...` = Ada error (catat error)

**Test di Analytics Page:**
1. Buka: `https://medikalestari.vercel.app/admin/analytics`
2. Login
3. Lihat apakah ada error merah di atas
4. Buka DevTools (F12) → Console
5. Lihat error messages

### 🐛 Common Issues & Fixes

| Issue | Penyebab | Fix |
|-------|---------|-----|
| "Failed to fetch analytics" | RLS policy salah | Reset policies (lihat Step 2) |
| Empty data (0 everywhere) | Service key salah | Update SUPABASE_SERVICE_ROLE_KEY di Vercel |
| API 500 error | Environment vars missing | Check Step 1 |
| Network error | CORS or URL salah | Verify NEXT_PUBLIC_SUPABASE_URL |

### 📝 Langkah-langkah Redeploy

Setelah fix:

```
1. Vercel Dashboard
2. Select project "medikalestari"
3. Deployments tab
4. Klik ⋮ pada latest deployment
5. Klik "Redeploy"

ATAU

Push ke repo untuk auto-deploy
```

### 🎯 Expected Result

Setelah semua setup benar di production:
- ✅ Analytics page tampil dengan data real
- ✅ Data otomatis update setiap 30 detik
- ✅ Public pages ter-track (dokter, jadwal, kontak, dll)
- ✅ Admin pages tidak ter-track

---

**Files updated:**
- ✅ `lib/tracking.ts` - Better error handling
- ✅ `app/admin/analytics/page.tsx` - Error state & display
