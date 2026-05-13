# 🎨 VISUAL GUIDE - Hero Banner Production Fix

## 📊 Diagram Alur Perbaikan

```
┌─────────────────────────────────────────────────────────────────┐
│                   PROBLEM DIAGNOSIS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Localhost (✅ OK)          Production Vercel (❌ BROKEN)       │
│  ┌───────────────────┐    ┌───────────────────────┐            │
│  │ .env.local exists │    │ Env vars di-hard-coded│            │
│  │ All 3 keys set    │    │ atau tidak di-set     │            │
│  └───────────────────┘    └───────────────────────┘            │
│           ↓                         ↓                           │
│  ┌───────────────────┐    ┌───────────────────────┐            │
│  │ RLS policies OK   │    │ RLS policies belum    │            │
│  │ (atau tidak ada)  │    │ dikonfigurasi atau    │            │
│  │                   │    │ tidak benar           │            │
│  └───────────────────┘    └───────────────────────┘            │
│           ↓                         ↓                           │
│  ┌───────────────────┐    ┌───────────────────────┐            │
│  │ API call berhasil │    │ API call gagal atau   │            │
│  │ Hero banner show  │    │ return empty array    │            │
│  │                   │    │ Hero banner = BLANK   │            │
│  └───────────────────┘    └───────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Solution Flow

```
STEP 1: Vercel Environment Variables
└─────────────────────────────────────────────┐
                                               │
   Pergi ke: Vercel Dashboard                 │
   ├─ Settings                                │
   ├─ Environment Variables                   │
   └─ Add 3 variables:                        │
      ├─ NEXT_PUBLIC_SUPABASE_URL             │
      ├─ NEXT_PUBLIC_SUPABASE_ANON_KEY        │
      └─ SUPABASE_SERVICE_ROLE_KEY ⚠️        │
         (Production only)                    │
                                               ↓
STEP 2: Supabase RLS Configuration
└─────────────────────────────────────────────┐
                                               │
   Pergi ke: Supabase Dashboard               │
   ├─ SQL Editor                              │
   └─ Run SQL:                                │
      ├─ DROP old policies                    │
      ├─ CREATE RLS policies                  │
      │  ├─ Allow ANON read active banners    │
      │  └─ Allow SERVICE_ROLE all ops       │
      └─ UPDATE banners to is_active=true    │
                                               ↓
STEP 3: Vercel Redeploy
└─────────────────────────────────────────────┐
                                               │
   Vercel Dashboard                           │
   ├─ medikalestari project                   │
   ├─ Deployments                             │
   └─ Click REDEPLOY                          │
      Wait for green checkmark ✅             │
                                               ↓
SUCCESS! ✅
Hero banner now works in production
```

---

## 🔐 Data Flow - Before vs After

### BEFORE (❌ Broken Flow)

```
┌──────────────┐
│   Browser    │
│ (Production) │
└──────┬───────┘
       │ GET /api/admin/hero-banners?device_type=desktop
       ↓
┌──────────────────────────────────────────────┐
│  Next.js API Route                           │
│  /api/admin/hero-banners                     │
│                                              │
│  const publicClient = getPublicClient()      │
│  ❌ ERROR: Missing env vars!                │
│     - SUPABASE_SERVICE_ROLE_KEY not found   │
│                                              │
│  return { error: "...", data: [] }          │
└──────┬───────────────────────────────────────┘
       │
       ↓
┌──────────────┐
│   Browser    │
│ Banner: []   │ = BLANK/HITAM ❌
└──────────────┘
```

### AFTER (✅ Working Flow)

```
┌──────────────┐
│   Browser    │
│ (Production) │
└──────┬───────┘
       │ GET /api/admin/hero-banners?device_type=desktop
       ↓
┌────────────────────────────────────────────────────┐
│  Next.js API Route                                 │
│  /api/admin/hero-banners                           │
│                                                    │
│  const publicClient = getPublicClient()            │
│  ✅ ENV VARS FOUND in Vercel environment          │
│     - NEXT_PUBLIC_SUPABASE_URL ✅                 │
│     - NEXT_PUBLIC_SUPABASE_ANON_KEY ✅            │
│                                                    │
│  return { success: true, data: [...] }            │
└────────────┬─────────────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────┐
│  Supabase Database                     │
│  SELECT * FROM hero_banners            │
│  WHERE is_active = true                │
│  AND device_type = 'desktop'           │
│                                        │
│  ✅ RLS Policy allows ANON read       │
│  ✅ Banners found in DB                │
│  ✅ Return to API                      │
└────────────┬───────────────────────────┘
             │
             ↓
┌──────────────┐
│   Browser    │
│ Banners: [{  │ ✅ SHOW IMAGES
│   id: 1,     │
│   image_url: │
│   ...        │
│ }]           │
└──────────────┘
```

---

## 🧠 How It Works After Fix

```
┌─────────────────────────────────────────────────────────────────┐
│                    Architecture Overview                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PUBLIC ACCESS (Frontend)                                       │
│  ├─ Uses: NEXT_PUBLIC_SUPABASE_ANON_KEY                        │
│  ├─ Via: RLS Policy "Allow anon read active hero_banners"      │
│  ├─ Can: SELECT only (read-only)                               │
│  ├─ Limit: WHERE is_active = true                              │
│  └─ Access: ✅ Allowed                                          │
│                                                                  │
│  ADMIN ACCESS (API Server-side)                                │
│  ├─ Uses: SUPABASE_SERVICE_ROLE_KEY                            │
│  ├─ Via: RLS Policy "Allow service role all operations"        │
│  ├─ Can: INSERT, SELECT, UPDATE, DELETE (full CRUD)           │
│  ├─ Limit: None (bypass RLS)                                   │
│  └─ Access: ✅ Allowed                                          │
│                                                                  │
│  SECURITY LAYER                                                │
│  ├─ Service Role Key: NEVER exposed to client                  │
│  ├─ Only used: In server-side API routes                       │
│  ├─ Anon Key: Safe to expose, limited by RLS                  │
│  └─ Result: ✅ Secure & Scalable                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Verification Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│ ✅ STEP 1: Vercel Environment Variables                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [ ] NEXT_PUBLIC_SUPABASE_URL                                   │
│     Environment: Production, Preview, Development              │
│     ├─ Value: https://zecqskgvmfyorhxzhoeu.supabase.co        │
│     └─ Status: ✅ Set                                           │
│                                                                  │
│ [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY                              │
│     Environment: Production, Preview, Development              │
│     ├─ Value: eyJhbGciOiJIUzI1NiIsInR5cCI...                  │
│     └─ Status: ✅ Set                                           │
│                                                                  │
│ [ ] SUPABASE_SERVICE_ROLE_KEY ⚠️ CRITICAL                     │
│     Environment: Production ONLY ⚠️                             │
│     ├─ Value: eyJhbGciOiJIUzI1NiIsInR5cCI...                  │
│     ├─ Status: ✅ Set                                           │
│     └─ Security: ✅ Production only (NOT Preview/Dev)          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ✅ STEP 2: Supabase RLS Policies                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [ ] RLS Enabled on hero_banners table                          │
│     Status: ✅ ALTER TABLE ... ENABLE ROW LEVEL SECURITY       │
│                                                                  │
│ [ ] Policy: "Allow anon read active hero_banners"             │
│     Status: ✅ Policy created & active                          │
│     SELECT permission: ✅ Anon role                             │
│     WHERE clause: ✅ is_active = true                           │
│                                                                  │
│ [ ] Policy: "Allow service role all operations"               │
│     Status: ✅ Policy created & active                          │
│     Permissions: ✅ SELECT, INSERT, UPDATE, DELETE             │
│     Anon bypass: ✅ Service role                                │
│                                                                  │
│ [ ] Active Banners Status                                       │
│     SQL: SELECT COUNT(*) FROM hero_banners WHERE is_active     │
│     Result: Count > 0 ✅                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ✅ STEP 3: Vercel Redeploy                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [ ] Redeploy triggered                                          │
│     Status: ✅ Deployment started                               │
│                                                                  │
│ [ ] Deployment in progress                                      │
│     Status: ⏳ Building...                                      │
│                                                                  │
│ [ ] Deployment completed                                        │
│     Status: ✅ Ready (Green checkmark)                          │
│                                                                  │
│ [ ] Deployment live                                             │
│     URL: https://medikalestari.vercel.app/                     │
│     Status: ✅ Live                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ✅ STEP 4: Test Production                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ [ ] Hard refresh production homepage                            │
│     URL: https://medikalestari.vercel.app/                     │
│     Key: Ctrl+F5 (bypass cache)                                │
│     Result: Hero banner VISIBLE ✅                             │
│                                                                  │
│ [ ] Check DevTools Console                                      │
│     Key: F12 → Console                                          │
│     Errors: None ✅                                             │
│                                                                  │
│ [ ] Test Admin Panel                                            │
│     URL: https://medikalestari.vercel.app/admin/hero           │
│     Action: Create new banner                                   │
│     Result: Banner created ✅                                  │
│                                                                  │
│ [ ] Verify on Homepage                                          │
│     Action: Refresh homepage                                    │
│     Result: New banner visible ✅                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Summary

| Phase | Task                   | Status         | Time        |
| ----- | ---------------------- | -------------- | ----------- |
| 1     | Set Vercel Env Vars    | 🔄 In Progress | 5 min       |
| 2     | Configure Supabase RLS | ⏳ Waiting     | 3 min       |
| 3     | Redeploy Vercel        | ⏳ Waiting     | 2 min       |
| 4     | Test Production        | ⏳ Waiting     | 5 min       |
| -     | **Total**              | -              | **~15 min** |

---

**Status: Ready to Execute!** 🚀
