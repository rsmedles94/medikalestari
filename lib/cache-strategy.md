# Cache Strategy Documentation

## Architecture

### 1. **CacheManager (cache-manager.ts)** - Primary Cache Layer

- **Purpose**: Centralized TTL strategy per data type
- **Keys**: Organized by data type (e.g., `doctors:specialty:name`)
- **Strategy**:
  - Static data (doctors, rooms, specialties): 30-60 minutes
  - Semi-dynamic (schedules, doctor_detail): 10-15 minutes
  - Dynamic (mading, popups, stats): 2-5 minutes
  - Default fallback: 5 minutes

**Usage**:

```typescript
import { cacheManager } from "./cache-manager";

// Get from cache
const data = cacheManager.get("doctors:cardiology");

// Set in cache
cacheManager.set("doctors:cardiology", data);

// Monitor stats
console.log(cacheManager.getStats());
```

### 2. **Enhanced Request Cache (enhanced-request-cache.ts)** - Deduplication Layer

- **Purpose**: Prevent duplicate concurrent requests
- **Features**:
  - Request deduplication (share promises between concurrent requests)
  - Exponential backoff retry (2-8 seconds)
  - In-flight request tracking
  - Error handling with stale cache

**Usage**:

```typescript
import {
  deduplicateRequest,
  getRequestCacheStats,
} from "./enhanced-request-cache";

const result = await deduplicateRequest(
  "doctors:cardiology",
  async () => {
    return fetchFromAPI();
  },
  { maxRetries: 2 },
);

// Monitor stats
console.log(getRequestCacheStats());
```

### 3. **Parallel Fetch Manager (parallel-fetch.ts)** - Waterfall Prevention

- **Purpose**: Execute multiple fetches in parallel
- **Features**:
  - Prevents N+1 queries
  - Shared AbortController for timeout
  - Graceful fallback on error
  - Progress tracking for sequential fetch

**Usage**:

```typescript
import { parallelFetch } from "./parallel-fetch";

const results = await parallelFetch({
  doctors: fetchDoctors(),
  schedules: fetchSchedules(),
  rooms: fetchRoomTypes(),
});
```

## Data Flow

```
API Request
    ↓
1. Check CacheManager (fastest - memory lookup)
    ↓ MISS
2. Check Enhanced Request Cache (in-flight dedup)
    ↓ MISS / STALE
3. Execute withRetry (3 attempts with exponential backoff)
    ↓
4. Store in CacheManager (with configured TTL)
5. Store in Enhanced Request Cache (dedup future requests)
    ↓
Return Data
```

## Next.js Integration (next.config.ts)

### Response Headers Caching Strategy

| Route Type              | Cache-Control                                                         | TTL                     |
| ----------------------- | --------------------------------------------------------------------- | ----------------------- |
| Static Assets (JS, CSS) | `public, max-age=31536000, immutable`                                 | 1 year                  |
| Images                  | `public, max-age=31536000, immutable`                                 | 1 year                  |
| Fonts                   | `public, max-age=31536000, immutable`                                 | 1 year                  |
| HTML Pages              | `public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800` | 1h (client) + 1d (edge) |
| API Routes              | `public, max-age=0, must-revalidate`                                  | No cache                |

**Security Headers**:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Production Checklist

- [x] CacheManager with typed TTL per data type
- [x] Request deduplication with retry logic
- [x] Parallel fetch to prevent waterfalls
- [x] HTTP response headers for static asset caching
- [x] Image optimization config
- [x] Security headers configured
- [x] Compression enabled
- [x] Source maps disabled in production
- [ ] Monitor cache hit rates in production (log cacheManager stats)
- [ ] Set up APM/monitoring for API response times

## Monitoring

### Cache Stats

```typescript
// Get stats from CacheManager
const stats = cacheManager.getStats();
// Output: { hits: 150, misses: 30, sets: 35, clears: 2, size: 25, hitRate: "83.33%", keys: [...] }

// Get stats from Request Cache
const requestStats = getRequestCacheStats();
// Output: { total: 5, fresh: 3, stale: 1, inFlight: 1, failed: 0, keys: [...] }
```

### Debugging

```typescript
import { cacheManager } from "./cache-manager";

// Reset stats
cacheManager.resetStats();

// Get TTL for specific key
console.log(cacheManager.getTTL("doctors:cardiology")); // milliseconds remaining

// Clear specific pattern
cacheManager.clear("doctors:.*"); // Clear all doctor cache
```

## Best Practices

1. **Always use cache keys with colons** for namespace organization
   - Good: `doctors:specialty:name`
   - Bad: `doctorsSpecialtyName`

2. **Set cache immediately after successful fetch**

   ```typescript
   const data = await fetchData();
   cacheManager.set(cacheKey, data); // Do this!
   ```

3. **Monitor cache stats regularly**
   - Low hit rate (<50%)? TTL too short
   - High memory? Cache size growing too fast

4. **Use parallelFetch for multiple unrelated data**

   ```typescript
   // Good - parallel
   const { doctors, schedules, rooms } = await parallelFetch({...});

   // Bad - sequential
   const doctors = await fetchDoctors();
   const schedules = await fetchSchedules();
   const rooms = await fetchRooms();
   ```

5. **Let retry mechanism handle transient errors**
   - Don't retry manually, let `withRetry` handle it
   - Exponential backoff prevents thundering herd

## Migration from Old Cache (request-cache.ts)

Old file removed. All imports updated to use `enhanced-request-cache.ts`:

- ✅ `import { deduplicateRequest } from './enhanced-request-cache'`
- ✅ `import { cacheManager } from './cache-manager'`
- ❌ `import { deduplicateRequest } from './request-cache'` (removed)
