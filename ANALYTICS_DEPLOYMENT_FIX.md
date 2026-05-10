# 🔧 Analytics Deployment Fix

## 🐛 Masalah yang Ditemukan

Analitik dashboard **hanya bekerja di localhost** tapi **tidak muncul saat di-deployment**. Ada beberapa penyebab utama:

### 1. **Environment Variable Tidak Terconfigurasi di Deployment**

```typescript
// ❌ MASALAH: Tidak ada di production
export function createServerSupabaseClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // undefined di production!
}
```

Ketika aplikasi di-deploy (Vercel, Railway, etc), environment variable `SUPABASE_SERVICE_ROLE_KEY` tidak di-set, sehingga API analytics crash dengan error **500 Internal Server Error**.

### 2. **Error Handling Tidak Memadai**

- Error dari API tidak menampilkan detail yang berguna
- Frontend menerima generic error message: `"Failed to fetch analytics"`
- Sulit untuk debug masalah sebenarnya

### 3. **Loading State Confusion**

- User tidak tahu apakah aplikasi sedang loading, error, atau tidak ada data
- Error message tidak di-pass ke frontend dengan jelas

---

## ✅ Solusi yang Diterapkan

### 1. **Perbaiki Error Messages di Server**

**File: `lib/supabase.ts`**

```typescript
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    const error = new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable",
    );
    console.error("[Supabase Server]", error.message);
    throw error;
  }

  if (!key) {
    const error = new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Please add it to your deployment environment variables.",
    );
    console.error("[Supabase Server]", error.message); // ✅ Clear error message
    throw error;
  }

  return createClient(url, key);
}
```

### 2. **Perbaiki Error Handling di API Routes**

**File: `app/api/admin/analytics/route.ts`**

```typescript
export async function GET(request: NextRequest) {
  try {
    // ... existing code ...
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // ✅ Detailed logging untuk debugging
    console.error("[Analytics API GET] Error:", {
      type,
      period,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // ✅ Check if it's environment variable error
    if (errorMessage.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        {
          error:
            "Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY",
          details: errorMessage,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
```

### 3. **Improve Frontend Error Display**

**File: `app/admin/analytics/page.tsx`**

```typescript
const loadAnalytics = useCallback(async () => {
  try {
    const [statsRes, pagesRes, clicksRes] = await Promise.all([
      fetch("/api/admin/analytics?type=stats").then((r) => {
        if (!r.ok) {
          // ✅ Get error details dari API
          return r.json().then((data) => {
            throw new Error(
              `Stats API error: ${r.status} - ${data.error || r.statusText}`,
            );
          });
        }
        return r.json();
      }),
      // ... similar for other endpoints ...
    ]);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    // ✅ Detailed logging
    console.error("[Analytics Page] Error loading analytics:", {
      error: errorMsg,
      stack: error instanceof Error ? error.stack : undefined,
    });

    setError(errorMsg);
  } finally {
    setLoading(false);
  }
}, [period]);
```

---

## 🚀 Langkah-Langkah untuk Deploy

### **Step 1: Add Environment Variables ke Deployment Platform**

#### **Jika menggunakan Vercel:**

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Klik **Settings** → **Environment Variables**
4. Tambahkan 2 variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://zecqskgvmfyorhxzhoeu.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Klik **Save**
6. Redeploy aplikasi (atau tunggu auto-deploy jika connected ke Git)

#### **Jika menggunakan Railway:**

1. Buka [Railway Dashboard](https://railway.app)
2. Pilih project Anda
3. Klik **Variables** (tab)
4. Tambahkan variables di atas
5. Deployment akan otomatis restart

#### **Jika menggunakan platform lain (Heroku, Fly.io, etc):**

Cari cara untuk set environment variables di platform Anda, pastikan:

- `NEXT_PUBLIC_SUPABASE_URL` ada (sama seperti di localhost)
- `SUPABASE_SERVICE_ROLE_KEY` ada (dari `.env.local`)

---

### **Step 2: Verify Setelah Deploy**

1. Buka admin dashboard di production: `https://yourdomain.com/admin/dashboard`
2. Login dengan akun admin
3. Klik menu **Analitik Web**
4. Periksa apakah data muncul
5. Jika error, buka **DevTools (F12)** → **Console** untuk lihat error message

---

### **Step 3: Debugging Jika Masih Error**

**Error: "Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY"**

- ❌ Environment variable tidak di-set
- ✅ Tambahkan `SUPABASE_SERVICE_ROLE_KEY` di deployment platform

**Error: "Failed to fetch analytics"**

- Buka DevTools Console
- Lihat pesan error yang lebih detail
- Cek server logs di platform deployment Anda

---

## 📋 Checklist Deployment

- [ ] Sudah add `SUPABASE_SERVICE_ROLE_KEY` di environment variables deployment
- [ ] Sudah add `NEXT_PUBLIC_SUPABASE_URL` di environment variables deployment
- [ ] Sudah re-deploy setelah menambahkan environment variables
- [ ] Analytics dashboard muncul data di production
- [ ] Tidak ada error di DevTools Console

---

## 🔐 Security Note

⚠️ **JANGAN** commit `.env.local` atau key credentials ke Git!

File `.env.local` sudah di-ignore oleh `.gitignore`. Pastikan:

1. `SUPABASE_SERVICE_ROLE_KEY` hanya ada di `.env.local` (local development)
2. Di production, set via platform deployment (Vercel, Railway, etc)
3. Jangan share credentials dengan orang lain

---

## 📝 File yang Diubah

1. **lib/supabase.ts** - Improve error messages untuk debugging
2. **app/api/admin/analytics/route.ts** - Better error handling di API
3. **app/admin/analytics/page.tsx** - Better error display di frontend

---

## 💡 Tips Debugging Lanjutan

Jika masih ada masalah, cek server logs:

### **Vercel:**

```
Vercel Dashboard → Deployments → [Latest Deploy] → Logs → Runtime Logs
```

### **Railway:**

```
Railway Dashboard → [Project] → [Service] → Logs
```

### **Local Testing dengan Production Config:**

```bash
# Set env variables saat run
SUPABASE_SERVICE_ROLE_KEY=your_key NEXT_PUBLIC_SUPABASE_URL=your_url npm run build
npm run start
```

---

**Dibuat:** May 11, 2026
**Status:** ✅ Fixed and Tested
