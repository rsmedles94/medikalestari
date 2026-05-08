# 🔍 Analytics Production Debug Steps

## Problem
- ✅ Localhost: Data terbaca (counter naik)
- ❌ Production (Vercel): Semua counter 0

## Root Cause
Ada 2 kemungkinan:

1. **Timezone Issue**
   - Localhost & Vercel timezone berbeda
   - Date filtering query tidak sesuai
   - Events tersimpan tapi query return 0

2. **Service Role Key**
   - SUPABASE_SERVICE_ROLE_KEY tidak benar
   - Events tidak bisa ditulis ke database
   - Atau events ditulis tapi beda database

## Debug Steps

### Step 1: Check Vercel Logs

1. Buka Vercel Dashboard
2. Project "medikalestari"
3. Tab "Logs" → "Function Logs"
4. Filter untuk `/api/admin/analytics`
5. Lihat log messages:

**Expected logs saat tracking:**
```
[Analytics Track] Inserting event: { event_type: '...', event_name: '...', ... }
[Analytics Track] Event inserted successfully
```

**Jika tidak ada logs:** Tracking tidak ter-kirim dari client

**Jika ada error:** Database error atau credential issue

### Step 2: Check Supabase Database

1. Buka Supabase Dashboard
2. Tab "Editor" → "analytics_events" table
3. Lihat apakah ada data di table?

**If ada data:**
- ✅ Tracking working
- ❌ Query filtering issue
- → Lihat Step 3 untuk fix

**If tidak ada data:**
- ❌ Tracking not working
- → Lihat Step 4 untuk debug

### Step 3: Check Database Data & Timezone

```sql
-- Jalankan di Supabase SQL Editor

-- Lihat semua events
SELECT COUNT(*) as total_events FROM analytics_events;

-- Lihat events dengan timestamps
SELECT 
  id,
  event_type,
  event_name,
  created_at,
  created_at AT TIME ZONE 'UTC' as created_at_utc,
  created_at AT TIME ZONE 'Asia/Jakarta' as created_at_jakarta
FROM analytics_events
ORDER BY created_at DESC
LIMIT 10;

-- Lihat events dari hari ini (UTC)
SELECT COUNT(*) as today_count
FROM analytics_events
WHERE created_at >= CURRENT_DATE
  AND created_at < CURRENT_DATE + INTERVAL '1 day';

-- Lihat events dari hari ini (Jakarta time)
SELECT COUNT(*) as today_count_jakarta
FROM analytics_events
WHERE created_at >= CURRENT_DATE AT TIME ZONE 'Asia/Jakarta'
  AND created_at < (CURRENT_DATE + INTERVAL '1 day') AT TIME ZONE 'Asia/Jakarta';
```

### Step 4: Test Event Insertion Manually

```sql
-- Test insert manual event
INSERT INTO analytics_events (
  event_type,
  event_name,
  page_path,
  metadata,
  created_at
) VALUES (
  'page_view',
  '/test-page',
  '/test-page',
  '{}',
  NOW()
);

-- Verify insert
SELECT * FROM analytics_events 
WHERE event_name = '/test-page'
ORDER BY created_at DESC
LIMIT 1;
```

Jika test insert berhasil tapi tracking tidak bekerja:
- ❌ SUPABASE_SERVICE_ROLE_KEY issue
- ❌ RLS Policy issue

### Step 5: Verify Credentials & Permissions

```sql
-- Check RLS policies
SELECT * FROM pg_policies 
WHERE tablename = 'analytics_events';

-- Check table grants
SELECT * FROM information_schema.role_table_grants 
WHERE table_name='analytics_events';
```

## Solutions

### Fix 1: Timezone Issue (If data exists but query returns 0)

```
Issue: Query filtering by local time, data stored in UTC (or vice versa)

Solution: Already fixed in code
- Changed from setHours() to setUTCHours()
- Now all queries use UTC

Action: Redeploy to Vercel
```

### Fix 2: RLS Policy Too Strict (If insert fails)

```sql
-- Reset policies completely
DROP POLICY IF EXISTS "Allow insert for tracking" ON analytics_events;
DROP POLICY IF EXISTS "Allow read for authenticated" ON analytics_events;
DROP POLICY IF EXISTS "Allow service role" ON analytics_events;

-- Create permissive policies
CREATE POLICY "Allow insert" ON analytics_events
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read auth" ON analytics_events
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role" ON analytics_events
  FOR SELECT
  USING (true);
```

### Fix 3: Wrong Service Role Key (If can't insert)

1. Vercel Dashboard
2. Settings → Environment Variables
3. Update `SUPABASE_SERVICE_ROLE_KEY` dengan yang benar dari Supabase
4. Redeploy

## Production Debugging Checklist

- [ ] Check Vercel logs → see insert events?
- [ ] Check Supabase → analytics_events has data?
- [ ] If yes to both → Run SQL queries to check timestamps
- [ ] Test manual insert → works?
- [ ] Check RLS policies → correct?
- [ ] Check service role key → correct?
- [ ] Redeploy after fixes

## After Fix

```
1. Redeploy to Vercel (push to repo or manual redeploy)
2. Wait 30 seconds for deployment
3. Buka https://medikalestari.vercel.app/analytics-debug
4. Klik "Check Supabase connection"
5. Lihat response berhasil?
6. Buka /admin/analytics
7. Refresh → lihat counter naik?
```

## Temporary Disable Date Filter (Testing)

Jika timezone issue susah di-debug, bisa temporary disable period filter:

```typescript
// In getVisitorStats(), change all periods to return 0 except 'all'
const countEvents = async (period: Period) => {
  // TEMP: Disable period filtering for debugging
  if (period !== 'all') {
    return 0; // Return 0 for today/week/month
  }
  
  // Only count all events
  const { count, error } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("event_type", "page_view");
    // No date filtering
  
  // ... rest of code
};
```

Ini untuk test apakah basic query works (data ada atau tidak).
