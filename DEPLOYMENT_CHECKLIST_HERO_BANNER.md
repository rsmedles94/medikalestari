# Deployment Checklist - Hero Banner RLS Fix

## Sebelum Deploy

### 1. ✅ Code Changes

- [x] Update `/app/api/admin/hero-banners/route.ts` - Baru dibuat
- [x] Update `/lib/api.ts` - Functions sudah menggunakan API route
- [x] Pastikan tidak ada lint errors

**Cara cek:**

```bash
npm run lint
```

### 2. ✅ Supabase RLS Configuration

Buka Supabase Dashboard → Select Database → hero_banners table

#### Enable RLS

- Pastikan RLS sudah ENABLED untuk tabel `hero_banners`
- Path: `Authentication` → `Policies` → Pilih `hero_banners`

#### Setup Policies

**Policy 1: Allow Public Read**

```sql
-- CREATE POLICY "Allow public read hero_banners"
-- ON hero_banners FOR SELECT
-- USING (true)
```

- Name: `Allow public read hero_banners`
- Command: `SELECT`
- Target roles: `anon`, `authenticated`
- USING: `true`

**Policy 2: Service Role Create** (PENTING!)

```sql
-- CREATE POLICY "Allow service role create hero_banners"
-- ON hero_banners FOR INSERT
-- USING (auth.role() = 'service_role')
-- WITH CHECK (auth.role() = 'service_role')
```

- Name: `Allow service role create hero_banners`
- Command: `INSERT`
- Target roles: `service_role`
- USING: `true`
- WITH CHECK: `true`

**Policy 3: Service Role Update** (PENTING!)

```sql
-- CREATE POLICY "Allow service role update hero_banners"
-- ON hero_banners FOR UPDATE
-- USING (auth.role() = 'service_role')
-- WITH CHECK (auth.role() = 'service_role')
```

- Name: `Allow service role update hero_banners`
- Command: `UPDATE`
- Target roles: `service_role`
- USING: `true`
- WITH CHECK: `true`

**Policy 4: Service Role Delete** (PENTING!)

```sql
-- CREATE POLICY "Allow service role delete hero_banners"
-- ON hero_banners FOR DELETE
-- USING (auth.role() = 'service_role')
```

- Name: `Allow service role delete hero_banners`
- Command: `DELETE`
- Target roles: `service_role`
- USING: `true`

### 3. ✅ Environment Variables

Pastikan di platform deployment (Vercel, Railway, Netlify, dll):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**⚠️ PENTING:**

- `NEXT_PUBLIC_*` prefix = bisa di-expose ke client (public)
- `SUPABASE_SERVICE_ROLE_KEY` = JANGAN punya prefix `NEXT_PUBLIC_`
- Service Role Key hanya digunakan di server-side

### 4. ✅ Testing Checklist

Setelah deploy, test di production:

- [ ] Login ke admin panel
- [ ] Buka halaman "Hero Banner"
- [ ] Klik tombol "Tambah Banner"
- [ ] Upload atau masukkan gambar URL
- [ ] Set device type (desktop/mobile)
- [ ] Klik "Simpan"
- [ ] Seharusnya banner berhasil dibuat tanpa error RLS

## Troubleshooting

### Error: "Missing environment variables"

**Solusi:** Set `SUPABASE_SERVICE_ROLE_KEY` di environment variables platform deployment

### Error: "violates row-level security policy"

**Solusi:**

1. Pastikan semua 4 policies sudah dibuat di Supabase
2. Refresh halaman admin
3. Cek console browser untuk detail error

### Error: "Gagal membuat banner: 500"

**Solusi:**

1. Cek server logs di platform deployment
2. Pastikan `SUPABASE_SERVICE_ROLE_KEY` valid
3. Cek bahwa `NEXT_PUBLIC_SUPABASE_URL` correct

### API Response 400 "Missing required fields"

**Solusi:** Pastikan form di admin memiliki:

- `image_url` - wajib diisi
- `device_type` - wajib dipilih (desktop/mobile)

## Rollback (jika diperlukan)

Jika ada masalah, bisa revert ke versi lama:

```bash
git revert <commit-hash>
git push origin main
```

## Next Steps

1. Commit dan push perubahan:

```bash
git add .
git commit -m "fix: implement server-side API for hero banner CRUD to bypass RLS"
git push origin main
```

2. Setup RLS policies di Supabase Dashboard

3. Set environment variables di deployment platform

4. Deploy dan test

## References

- File baru: `/app/api/admin/hero-banners/route.ts`
- File update: `/lib/api.ts`
- Dokumentasi: `RLS_HERO_BANNER_FIX.md`
