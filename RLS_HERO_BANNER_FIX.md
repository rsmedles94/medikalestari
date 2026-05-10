# Perbaikan Hero Banner RLS Error di Deployment

## Masalah

Saat menambahkan hero banner di deployment, muncul error:

```
Error: Gagal membuat banner: Supabase error: new row violates row-level security policy for table "hero_banners"
```

Namun di localhost berfungsi normal.

## Penyebab

Masalah ini terjadi karena:

1. **Localhost** menggunakan anon key yang mungkin punya akses penuh atau RLS policy masih permissive
2. **Production/Deployment** memiliki RLS policy yang ketat dan mencegah insert dari anon key

## Solusi

### Step 1: Update API Routes

Saya telah membuat API route baru di `/app/api/admin/hero-banners/route.ts` yang menggunakan service role key (bypass RLS).

### Step 2: Update lib/api.ts

Fungsi `createHeroBanner()`, `updateHeroBanner()`, dan `deleteHeroBanner()` telah diupdate untuk menggunakan API route baru bukan direct Supabase client.

### Step 3: Konfigurasi Supabase RLS Policy (Penting!)

Di Supabase Dashboard, buka tabel `hero_banners` dan setup RLS policy seperti ini:

#### Policy untuk READ (Select)

- **Policy Name**: `Allow public read hero_banners`
- **Target roles**: `anon`, `authenticated`
- **Action**: `SELECT`
- **Expression**: `true` (atau lebih ketat sesuai kebutuhan)

```sql
SELECT true
```

#### Policy untuk INSERT (Create) - HANYA Service Role

- **Policy Name**: `Allow service role create hero_banners`
- **Target roles**: `service_role`
- **Action**: `INSERT`
- **Expression**: `true`

```sql
INSERT true
```

#### Policy untuk UPDATE (Edit) - HANYA Service Role

- **Policy Name**: `Allow service role update hero_banners`
- **Target roles**: `service_role`
- **Action**: `UPDATE`
- **Expression**: `true`

```sql
UPDATE true
```

#### Policy untuk DELETE - HANYA Service Role

- **Policy Name**: `Allow service role delete hero_banners`
- **Target roles**: `service_role`
- **Action**: `DELETE`
- **Expression**: `true`

```sql
DELETE true
```

### Step 4: Verifikasi Environment Variables

Pastikan di file deployment (Vercel, Railway, dll), variable berikut sudah set:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  ← PENTING!
```

**⚠️ PENTING**: Service role key adalah rahasia dan HANYA boleh disimpan di server-side environment variables, BUKAN di client-side.

### Step 5: Testing

1. Deploy aplikasi
2. Login ke admin panel
3. Coba tambah hero banner baru
4. Seharusnya sekarang berfungsi tanpa error RLS

## Keamanan

Solusi ini AMAN karena:

- Service role key hanya digunakan di server-side (API route)
- Client hanya bisa mengakses endpoint `/api/admin/hero-banners`
- Endpoint memvalidasi input sebelum insert ke database
- RLS policy tetap ketat untuk anon key

## Troubleshooting

### Masih error "violates row-level security policy"?

1. Pastikan RLS policies sudah di-setup dengan benar
2. Refresh halaman admin
3. Cek bahwa `SUPABASE_SERVICE_ROLE_KEY` ada di environment variables
4. Cek browser console untuk error detail

### API returns 500 error?

1. Cek server logs di deployment platform (Vercel, Railway, dll)
2. Pastikan environment variables ter-set dengan benar
3. Cek Supabase logs untuk detail error

### Bisa create tapi tidak bisa update/delete?

Pastikan semua 4 policies sudah di-setup (SELECT, INSERT, UPDATE, DELETE)
