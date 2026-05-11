# ✅ Checklist Perbaikan Hero Banner Desktop

## 🔍 **Langkah 1: Cek Status Banner di Database**

1. Buka Supabase Dashboard
2. Pergi ke **SQL Editor**
3. Jalankan query ini untuk cek semua banner:

```sql
SELECT id, device_type, is_active, order, image_url, created_at
FROM hero_banners
ORDER BY device_type, order;
```

**Pastikan:**

- ✅ Ada banner dengan `device_type = 'desktop'`
- ✅ Banner desktop memiliki `is_active = true`
- ✅ Kolom `device_type` tepat: `'desktop'` (bukan typo)

---

## 🔍 **Langkah 2: Update RLS Policy di Supabase**

1. Buka Supabase Dashboard → **SQL Editor**
2. Copy-paste semua query dari file ini:
   ```
   scripts/hero-banners-rls-setup.sql
   ```
3. Jalankan queries tersebut (klik tombol **Run**)
4. Lihat di bagian **output** bahwa tidak ada error

**Verify:** Cek policies sudah tercreate:

```sql
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'hero_banners'
ORDER BY policyname;
```

Harus ada minimal 2 policy:

- `Allow anon read hero_banners` (SELECT)
- `Allow service role create/update/delete hero_banners`

---

## 🔍 **Langkah 3: Cek API Response**

1. Buka browser (Desktop), tekan **F12** (Developer Tools)
2. Pergi ke tab **Network**
3. Refresh halaman website
4. Cari request ke `/api/admin/hero-banners?device_type=desktop`
5. Klik request tersebut dan lihat **Response** tab

**Harus melihat:**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "image_url": "...",
      "device_type": "desktop",
      "is_active": true,
      ...
    }
  ]
}
```

**Jika response kosong atau error:**

- Cek console browser (F12 → Console tab) untuk error message
- Banner mungkin `is_active = false`

---

## 🔍 **Langkah 4: Cek Console Browser**

1. Buka **F12** → **Console** tab
2. Refresh halaman
3. Cari log yang dimulai dengan `Loading desktop banners...`
4. Lihat apakah:
   - ✅ `✅ Loaded X desktop banners:` = Sukses
   - ❌ `❌ No desktop banners found` = Ada masalah

**Jika log tidak muncul sama sekali:**

- Mungkin mobile viewport, ubah ke desktop dulu (F12 → klik device toggle)

---

## 🔍 **Langkah 5: Update Banner di Admin Panel**

1. Login ke Admin Panel `/admin/hero`
2. Untuk setiap banner desktop:
   - ✅ Pastikan **Active/Status** di-toggle `ON`
   - ✅ Pastikan `device_type` = `desktop`
   - ✅ Pastikan image URL valid (akses bisa di browser)
3. Klik **Save** atau **Update**
4. Refresh halaman homepage

---

## 🔍 **Langkah 6: Cek Supabase Storage Access**

Jika image URL format: `https://xxx.supabase.co/storage/v1/object/public/...`

1. Buka link image di browser
2. Harus bisa lihat image (bukan 404 atau error)
3. Jika error 404:
   - Masuk Supabase → **Storage**
   - Pastikan bucket sudah **PUBLIC** (bukan private)
   - Pastikan file ada di path yang benar

---

## 🚀 **Langkah 7: Test API Directly (Optional)**

Buka terminal dan jalankan:

```bash
# Ganti SUPABASE_URL dan SUPABASE_ANON_KEY dengan nilai real
curl -H "Content-Type: application/json" \
  "http://localhost:3000/api/admin/hero-banners?device_type=desktop"
```

Atau gunakan tools seperti **Postman** atau **REST Client extension di VS Code**

---

## ✅ **Expected Result Jika Sudah Benar**

- ✅ Desktop hero banner carousel muncul dengan smooth transition
- ✅ Indikator dots muncul di bawah banner
- ✅ Chevron left-right buttons bisa diklik (saat hover)
- ✅ Search form muncul di atas banner
- ✅ Console tidak ada error (bisa ada warning tapi ok)

---

## 🆘 **Jika Masih Error, Cek:**

1. **Environment variables** di `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` ✅
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
   - `SUPABASE_SERVICE_ROLE_KEY` ✅

2. **Supabase Table** `hero_banners` existe dan punya kolom:
   - `id` (uuid, primary key)
   - `image_url` (text)
   - `device_type` (text: desktop/mobile)
   - `is_active` (boolean)
   - `order` (integer)
   - `created_at` (timestamp)

3. **Restart dev server:**
   ```bash
   npm run dev
   # atau
   pnpm dev
   ```

---

## 📝 **Notes**

- Mobile banners muncul karena mungkin ada data & RLS less restrictive
- Desktop tidak muncul: kemungkinan tidak ada data OR RLS tidak allow read
- Anda bisa ubah resolusi browser (F12 → device toggle) untuk test mobile vs desktop
