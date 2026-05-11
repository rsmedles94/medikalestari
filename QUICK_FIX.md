# 🔧 FIX: SUPABASE_SERVICE_ROLE_KEY is not set

## ❌ MASALAH

```
Error: Gagal menghapus banner: SUPABASE_SERVICE_ROLE_KEY is not set
```

---

## ✅ SOLUSI (Gampang!)

### **STEP 1: Buka `.env.local`**

Di root project, buka atau buat file: `.env.local`

### **STEP 2: Copy-Paste Ini**

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ganti `YOUR_PROJECT`, `ANON_KEY`, dan `SERVICE_ROLE_KEY` dari Supabase:**

1. Buka: https://app.supabase.com
2. Login → Pilih project
3. Settings → API
4. Copy 3 value dan paste ke template di atas

### **STEP 3: Restart Dev Server**

```bash
# Di terminal:
Ctrl+C

# Jalankan:
pnpm dev
```

---

## ✅ DONE!

- ✅ Bisa delete banner tanpa error
- ✅ Hero banner desktop akan muncul
- ✅ Admin panel bisa work dengan baik
