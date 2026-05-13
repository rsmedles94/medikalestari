/**
 * SQL Script: Fix Hero Banners RLS Policy
 * Tanggal: May 13, 2026
 * 
 * Tujuan:
 * 1. Hapus semua data hero_banners yang ada
 * 2. Hapus semua RLS policy yang lama
 * 3. Buat RLS policy yang benar untuk public dan admin access
 */

-- =====================================================
-- 1. HAPUS SEMUA DATA HERO_BANNERS
-- =====================================================
DELETE FROM hero_banners;

-- Reset sequence/serial jika ada
ALTER SEQUENCE IF EXISTS hero_banners_id_seq RESTART WITH 1;

-- =====================================================
-- 2. DISABLE RLS SEMENTARA (untuk setup policy)
-- =====================================================
ALTER TABLE hero_banners DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. HAPUS SEMUA POLICY YANG LAMA
-- =====================================================
DROP POLICY IF EXISTS "Allow public to view active banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow admin to manage banners" ON hero_banners;
DROP POLICY IF EXISTS "Allow authenticated users to read" ON hero_banners;
DROP POLICY IF EXISTS "Allow service role to do anything" ON hero_banners;
DROP POLICY IF EXISTS "Public can read active hero banners" ON hero_banners;
DROP POLICY IF EXISTS "Authenticated users can read all hero banners" ON hero_banners;
DROP POLICY IF EXISTS "Service role can do anything" ON hero_banners;

-- =====================================================
-- 4. ENABLE RLS KEMBALI
-- =====================================================
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. BUAT POLICY BARU YANG BENAR
-- =====================================================

-- Policy 1: Public users dapat melihat HANYA banner yang is_active = true
CREATE POLICY "policy_public_read_active_banners"
  ON hero_banners
  FOR SELECT
  USING (is_active = true);

-- Policy 2: Authenticated users (admin) dapat melihat SEMUA banner
CREATE POLICY "policy_authenticated_read_all_banners"
  ON hero_banners
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy 3: Authenticated users (admin) dapat INSERT banner baru
CREATE POLICY "policy_authenticated_insert_banners"
  ON hero_banners
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Authenticated users (admin) dapat UPDATE banner
CREATE POLICY "policy_authenticated_update_banners"
  ON hero_banners
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 5: Authenticated users (admin) dapat DELETE banner
CREATE POLICY "policy_authenticated_delete_banners"
  ON hero_banners
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Policy 6: Service role (backend) dapat melakukan apapun (bypass RLS)
-- Note: Service role automatically bypasses RLS, tapi kita buat policy ini untuk clarity
CREATE POLICY "policy_service_role_all"
  ON hero_banners
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- =====================================================
-- 6. VERIFIKASI SETUP
-- =====================================================
-- Jalankan queries ini untuk verify:

-- Check RLS status
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'hero_banners';

-- Check policies
-- SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check FROM pg_policies WHERE tablename = 'hero_banners' ORDER BY policyname;

-- =====================================================
-- 7. CATATAN PENTING
-- =====================================================
/*
FLOW AKSES:
1. Public User (tidak login):
   - Bisa baca: HANYA banner dengan is_active = true
   - Tidak bisa: INSERT, UPDATE, DELETE

2. Admin User (login dengan authenticated role):
   - Bisa baca: SEMUA banner (active atau inactive)
   - Bisa: INSERT, UPDATE, DELETE

3. Service Role (backend/API dengan SUPABASE_SERVICE_ROLE_KEY):
   - Bisa: SEMUA operasi (bypass RLS)
   - Digunakan oleh: NextJS API routes dengan admin client

TROUBLESHOOTING:
- Jika preview tidak tampil: user belum login, set is_active = true
- Jika admin tidak bisa edit: pastikan user sudah login sebagai authenticated
- Jika API failed: pastikan SUPABASE_SERVICE_ROLE_KEY di env production
*/
