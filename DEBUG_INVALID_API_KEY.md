## Debug "Invalid API Key" Error di Vercel

### Checklist:

1. **Verify API Key di Supabase Dashboard**
   - Buka https://app.supabase.com
   - Project: medikalestari
   - Settings → API
   - Copy fresh ANON KEY dan SERVICE ROLE KEY
   - Pastikan key tidak ter-truncate (ada titik di akhir berarti incomplete)

2. **Verify Environment Variables di Vercel**
   - Buka https://vercel.com/dashboard
   - Project settings
   - Environment Variables
   - Lihat apakah variables sudah ter-save dengan benar
   - Coba hapus dan buat ulang

3. **Pastikan Format URL Benar**
   ```
   ✓ BENAR:   https://rmuojxmwdyxwhpnelolm.supabase.co
   ✗ SALAH:   https://rmuojxmwdyxwhpnelolm.supabase.co/rest/v1/
   ✗ SALAH:   https://rmuojxmwdyxwhpnelolm.supabase.co/
   ```

4. **Check Supabase Project Status**
   - Verifikasi project aktif (bukan suspended)
   - Cek apakah ada quota warning
   - Pastikan database sudah buat tables

5. **Regenerate API Keys (Jika Diperlukan)**
   - Buka Supabase Dashboard → Settings → API
   - Klik icon refresh/rotate di sebelah ANON KEY
   - Copy key baru
   - Update di Vercel environment variables
   - Wait 5 minutes untuk propagasi

6. **Test di Local Dulu**
   ```bash
   # Di terminal lokal, pastikan .env.local correct
   pnpm run dev
   # Coba login → pastikan berhasil di local
   ```

7. **Vercel Logs**
   - Buka Vercel Dashboard → Deployments → Latest
   - Klik "Logs" tab
   - Lihat error details di sana
   - Cari "Invalid API key" message

### Solution Jika Masih Error:

**Option A: Regenerate Semua Keys**
1. Di Supabase Dashboard → Settings → API
2. Klik "Reset to Anon Key" dan "Reset to Service Role Key"
3. Copy keys baru
4. Update di Vercel
5. Trigger redeploy

**Option B: Create New Supabase Project**
1. Jika keys sudah corrupted, create project baru
2. Copy migration SQL ke project baru
3. Update semua environment variables
4. Test lagi

**Option C: Check Request Headers**
Di browser DevTools → Network tab:
- Buka Vercel app di production
- Klik request ke Supabase (biasanya `/rest/v1/*`)
- Headers tab → lihat authorization header
- Pastikan key ada dan format benar

### Temporary Solution: Disable Production untuk Debug
Kalau butuh quick fix, bisa:
1. Disable Vercel production deployment
2. Test semua di local development
3. Fix issues di local
4. Push ke main → auto-deploy ke Vercel

Mari provide:
- Screenshot dari error?
- Atau logs dari Vercel Logs tab?
