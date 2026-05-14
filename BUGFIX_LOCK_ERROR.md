# Fix untuk Error: "Lock broken by another request with the 'steal' option"

## Masalah

Error `"AbortError: Lock broken by another request with the 'steal' option"` menunjukkan issue dengan **Supabase connection pooling**. Hal ini terjadi ketika:

1. **Multiple concurrent requests** ke Supabase dari berbagai komponen
2. **Race conditions** saat component mounting atau re-rendering
3. **Timeout** pada koneksi database
4. **Tidak ada retry mechanism** untuk handle temporary failures

## Solusi yang Diterapkan

### 1. **Retry Mechanism dengan Exponential Backoff** (`lib/api.ts`)

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 500,
): Promise<T>;
```

- Retry hingga 3 kali untuk lock errors
- Exponential backoff: 500ms → 1000ms → 2000ms
- Hanya untuk lock-related errors, bukan semua error

### 2. **Request Deduplication** (`lib/request-cache.ts`)

```typescript
export async function deduplicateRequest<T>(
  cacheKey: string,
  requestFn: () => Promise<T>,
): Promise<T>;
```

- Prevent multiple concurrent requests untuk resource yang sama
- Cache hasil selama 5 detik
- Jika request sudah in-flight, share promise (tidak membuat request baru)

### 3. **Improved Component Lifecycle**

- **HeroSection.tsx**: Menambah `setLoading(true)` di awal untuk prevent race conditions
- **MadingSection.tsx**: Menambah proper loading state management

## Perubahan File

### `lib/api.ts`

- Tambah `withRetry()` utility function
- Bungkus `fetchDoctors()`, `fetchMadingContent()`, `fetchHeroBanners()` dengan retry
- Bungkus `fetchHeroBanners()` dengan request deduplication

### `lib/request-cache.ts` (NEW)

- Request cache dan deduplication utility
- TTL 5 detik untuk prevent stale data
- Debug stats untuk monitoring

### `components/HeroSection.tsx`

- Tambah `setLoading(true)` di awal `loadBanners()`
- Improve debounce logic untuk resize events
- Prevent multiple concurrent loads

### `components/MadingSection.tsx`

- Tambah `setLoading(true)` di awal `loadContent()`

## Testing

Untuk verify fix bekerja:

1. **Check browser console** untuk logs:
   - `[fetchHeroBanners] Starting fetch with config:`
   - `[fetchHeroBanners] ✅ Success`
   - `[HeroSection] 🔄 Loading desktop banners...`

2. **Monitor Network tab** untuk melihat:
   - Tidak ada duplicate requests
   - Hanya 1 request per resource
   - Proper retry behavior jika ada timeout

3. **Test resize behavior**:
   - Resize window untuk trigger mobile/desktop switch
   - Seharusnya tidak ada race condition

## Konfigurasi Supabase (Optional Improvements)

Jika error masih terjadi, pertimbangkan:

```sql
-- Set connection pool size
-- Database > Settings > Connection String > Pool Configuration
-- Recommended: 10-20 connections

-- Atau gunakan Supabase edge functions untuk server-side queries
-- Reduce direct client-side DB calls
```

## Environment Variables Check

Pastikan `.env.local` memiliki:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional)
```

## Monitoring

Gunakan `getRequestCacheStats()` untuk debug:

```typescript
import { getRequestCacheStats } from "@/lib/request-cache";

console.log(getRequestCacheStats());
// Output: { total: 2, fresh: 1, stale: 1, keys: [...] }
```

## References

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooling)
- [Supabase Error Handling](https://supabase.com/docs/reference/javascript/release-notes)
