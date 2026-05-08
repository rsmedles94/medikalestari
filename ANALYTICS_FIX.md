# 🔧 Analytics Troubleshooting Guide

## Masalah: Data hanya terlihat di localhost, tidak di production

### Root Causes yang sudah diperbaiki:

1. **❌ HOME PAGE ("/") TIDAK DI-TRACK**
   - **Fixed**: PageTracker sekarang track homepage
2. **❌ SESSION ID MISSING**
   - **Fixed**: Tambah unique session ID per user
3. **❌ TIMEZONE ISSUES**
   - **Fixed**: Gunakan local timezone instead of UTC untuk consistency
4. **❌ API TIMEOUT**
   - **Fixed**: Tambah timeout handler di tracking function
5. **❌ NO DEBUGGING INFO**
   - **Fixed**: Enhanced logging di API dan client-side

---

## ✅ Changes Made:

### 1. **lib/tracking.ts**

- ✅ Tambah session ID tracking (sessionStorage)
- ✅ Tambah timeout handler (5 detik fallback)
- ✅ Tambah timestamp di metadata
- ✅ Enhanced console logging

### 2. **components/PageTracker.tsx**

- ✅ Hapus filter untuk "/" (homepage)
- ✅ Sekarang track semua public pages

### 3. **app/api/admin/analytics/route.ts**

- ✅ Accept session_id dari client
- ✅ Better error logging dengan prefix "[Analytics POST]"
- ✅ Store session_id di database

### 4. **app/api/admin/analytics/page-views.ts**

- ✅ Fix timezone: gunakan local time bukan UTC
- ✅ Better date range calculation
- ✅ Enhanced console logging dengan period info

### 5. **app/analytics-debug/page.tsx**

- ✅ Complete UI revamp untuk debugging
- ✅ Show session info & environment details
- ✅ View today's events function
- ✅ Better troubleshooting guide

---

## 🚀 DEPLOYMENT CHECKLIST

Sebelum push ke production:

### 1. **Database Migration**

```sql
-- Jalankan di Supabase SQL Editor:
ALTER TABLE analytics_events
ADD COLUMN IF NOT EXISTS session_id VARCHAR(255) DEFAULT 'unknown';

CREATE INDEX IF NOT EXISTS idx_analytics_session_id
ON analytics_events(session_id);
```

### 2. **Environment Variables Check**

Pastikan di production Vercel/hosting:

```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### 3. **Test di Staging/Production**

1. Deploy kode ini
2. Buka `/analytics-debug` page
3. Klik "Test Page View"
4. Tunggu 2-3 detik
5. Klik "View Events"
6. Pastikan event muncul
7. Buka `/admin/analytics` dan verify data

---

## 🔍 DEBUGGING STEPS (jika masih 0 data)

### Step 1: Check Client-Side Logs

```
1. Buka production URL di browser
2. Tekan F12 → Console tab
3. Cari logs yang start dengan "[Track]"
4. Pastikan ada "✓ page_view" messages
```

### Step 2: Check Server Logs

```
1. Di Vercel: Projects → Logs → Function logs
2. Cari logs "[Analytics POST]" atau "[Analytics GET]"
3. Pastikan tidak ada error messages
```

### Step 3: Check Database Directly

```sql
-- Di Supabase SQL Editor:
SELECT COUNT(*) as total_events,
       COUNT(DISTINCT session_id) as unique_sessions,
       MAX(created_at) as last_event
FROM analytics_events;

-- Lihat recent events:
SELECT event_type, event_name, created_at, session_id
FROM analytics_events
ORDER BY created_at DESC
LIMIT 10;
```

### Step 4: Check Network Requests

```
1. Buka DevTools → Network tab
2. Filter: "analytics"
3. Navigate page → pastikan POST request ke /api/admin/analytics
4. Pastikan response status 200
5. Pastikan request body include session_id & event_name
```

---

## 🎯 Expected Behavior

### Localhost (http://localhost:3000)

- ✅ Setiap navigation → POST request dengan page_view event
- ✅ Data langsung terlihat di /admin/analytics
- ✅ Network tab → status 200, response { "success": true }

### Production (https://rsmedikalestari.com)

- ✅ Setiap navigation dari user → POST request
- ✅ Data muncul di /admin/analytics dalam 30 detik
- ✅ Server logs menunjukkan "[Analytics POST] ✓ Event inserted successfully"

---

## 📊 Monitoring

Untuk track analytics health:

```typescript
// File: lib/analytics-health.ts (optional)
export async function checkAnalyticsHealth() {
  try {
    const response = await fetch("/api/admin/analytics?type=stats");
    const data = await response.json();

    if (data.total === 0) {
      console.warn("⚠️ Analytics: No data collected!");
    }

    return data;
  } catch (error) {
    console.error("❌ Analytics health check failed:", error);
  }
}
```

---

## 📝 Notes

- **First time setup**: Pastikan sudah jalankan SQL migration
- **Data retention**: Semua events stored di Supabase (pastikan quota sufficient)
- **Performance**: Query dengan `.select(..., { head: true })` hanya count, efficient
- **Session tracking**: Setiap browser/tab punya unique session ID

---

## ❓ FAQ

**Q: Kenapa data hilang setelah 24 jam?**
A: Check database size limit di Supabase plan

**Q: Apakah tracking affect page performance?**
A: Tidak - fetch di background dengan timeout 5 detik

**Q: Bagaimana distinguish localhost vs production traffic?**
A: Check `window.location.host` - localhost vs rsmedikalestari.com

**Q: Bisa disable tracking untuk tertentu users?**
A: Ya - edit `PageTracker.tsx` untuk add filter logic
