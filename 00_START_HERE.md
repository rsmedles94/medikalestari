# ✨ SOLUSI FINAL - HERO BANNER DESKTOP ERROR FIX

**Problem**: Error saat delete banner "SUPABASE_SERVICE_ROLE_KEY is not set" + Banner desktop tidak muncul

**Root Cause**: Environment variable `SUPABASE_SERVICE_ROLE_KEY` tidak ada di `.env.local`

---

## 🚀 SOLUSI LENGKAP (3 STEP MUDAH)

### **STEP 1: Setup `.env.local` (~5 menit)**

**File yang perlu edit**: `.env.local` (di root project)

**Apa yang perlu copy-paste:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...SERVICE_ROLE_KEY
```

**Dapatkan value dari:**

1. Buka: https://app.supabase.com → Project → Settings → API
2. Copy 3 value di atas dari dashboard Supabase
3. Paste ke `.env.local`

**Lihat detail di**: `ENV_LOCAL_SETUP.md`

---

### **STEP 2: Setup RLS & Data di Supabase (~5 menit)**

**Pilih salah satu dari file ini:**

- `SQL_COPY_PASTE_READY.md` → KASUS 1 (jika RLS belum setup)
- `SQL_COPY_PASTE_READY.md` → KASUS 2 (jika ada banner desktop, tinggal activate)
- `SQL_COPY_PASTE_READY.md` → KASUS 3 (jika tidak ada banner, buat baru)

**Atau buka file ini untuk penjelasan detail:**

- `HERO_BANNER_FIX_ENV_AND_SQL.md`

---

### **STEP 3: Restart Dev Server & Test (~2 menit)**

```bash
# Di terminal project:
Ctrl+C  # Stop dev server

# Jalankan lagi:
pnpm dev
```

**Test di browser:**

- Buka: http://localhost:3000
- Desktop view (F12 → toggle device → Desktop)
- Lihat console log (F12 → Console tab)
- Harus ada: `✅ Loaded X desktop banners`

---

## 📋 FILE-FILE YANG TERSEDIA

| File                             | Tujuan                               | Waktu  |
| -------------------------------- | ------------------------------------ | ------ |
| `ENV_LOCAL_SETUP.md`             | Setup `.env.local` step-by-step      | 5 min  |
| `SQL_COPY_PASTE_READY.md`        | SQL siap pakai untuk 5 kasus berbeda | 5 min  |
| `HERO_BANNER_FIX_ENV_AND_SQL.md` | Penjelasan lengkap + SQL detail      | 10 min |
| `HERO_BANNER_QUICK_FIX.md`       | Ringkasan cepat perbaikan            | 2 min  |

---

## ✅ CHECKLIST FINAL

Setelah semua langkah:

- [ ] `.env.local` punya 3 variable (SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY)
- [ ] Dev server sudah di-restart
- [ ] RLS policies sudah di-setup di Supabase
- [ ] Banner desktop ada di database dan `is_active = true`
- [ ] Console log show "✅ Loaded X desktop banners" (BUKAN "❌ No desktop")
- [ ] Hero banner carousel visible di homepage
- [ ] Bisa delete/update banner di admin panel tanpa error

---

## 🎯 EXPECTED RESULT

✅ **Admin Panel** (`/admin/hero`):

- Bisa delete banner tanpa error
- Bisa create/update banner
- No "SERVICE_ROLE_KEY" error

✅ **Homepage** (desktop view):

- Hero banner carousel muncul
- Ada indikator dots
- Ada search form di atas banner
- Console: "✅ Loaded X desktop banners"

✅ **Mobile View**:

- Tetap work seperti sebelumnya

---

## 🆘 JIKA MASIH ERROR

### **Error: "SUPABASE_SERVICE_ROLE_KEY is not set"**

→ Belum setup `.env.local` dengan benar
→ Ikuti `ENV_LOCAL_SETUP.md`

### **Error: "No desktop banners found"**

→ `.env.local` ok, tapi data belum ada
→ Jalankan SQL dari `SQL_COPY_PASTE_READY.md` KASUS 2 atau 3

### **Desktop banner muncul tapi Mobile tidak?**

→ Ikuti `SQL_COPY_PASTE_READY.md` KASUS 2 untuk activate mobile banner

---

## 💡 TIPS

- **Jangan lupa restart dev server** setelah update `.env.local`
- **Copy SQL ke SQL Editor**, bukan ke console browser
- **Backup data** sebelum delete banner banyak
- **Test di incognito** browser untuk bypass cache

---

## 📞 QUICK REFERENCE

**Buat dari awal:**

1. Setup `.env.local` (ENV_LOCAL_SETUP.md)
2. Jalankan SQL KASUS 1 (SQL_COPY_PASTE_READY.md)
3. Restart dev server

**Perbaiki existing:**

1. Setup `.env.local` (ENV_LOCAL_SETUP.md)
2. Jalankan SQL KASUS 2 atau 3 (SQL_COPY_PASTE_READY.md)
3. Restart dev server

**Debug:**

1. Cek `.env.local` punya 3 variable
2. Cek RLS policies di Supabase (SQL_COPY_PASTE_READY.md KASUS 5)
3. Cek banner di database
4. Cek console log di F12

---

**Total waktu**: ~10-15 menit untuk setup lengkap + test

**Sukses**: Hero banner desktop muncul + admin panel bisa delete banner! 🎉
