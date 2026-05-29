/**
 * Request Cache - Prevent duplicate concurrent requests
 * Useful for handling race conditions and connection pool issues
 */

interface CacheEntry<T> {
  promise: Promise<T>;
  timestamp: number;
}

const requestCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5000; // 5 seconds - cache results to prevent thundering herd

/**
 * Deduplicate concurrent requests to the same resource
 * Multiple simultaneous requests for the same resource will share the same promise
 * @param cacheKey - Unique cache key for this request
 * @param requestFn - Function that makes the actual request
 * @returns Shared promise for this request
 */
export async function deduplicateRequest<T>(
  cacheKey: string,
  requestFn: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const cached = requestCache.get(cacheKey);

  // Return cached result if still fresh
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.promise as Promise<T>;
  }

  // If request is in flight, return the existing promise
  if (cached) {
    return cached.promise as Promise<T>;
  }

  // Create new request promise
  const promise = requestFn()
    .then((result) => {
      // Update cache with fresh result
      requestCache.set(cacheKey, {
        promise: Promise.resolve(result),
        timestamp: Date.now(),
      });
      return result;
    })
    .catch((error) => {
      // Remove failed request from cache so retry can happen
      requestCache.delete(cacheKey);
      throw error;
    });

  // Store the in-flight promise
  requestCache.set(cacheKey, {
    promise,
    timestamp: now,
  });

  return promise;
}

/**
 * Clear specific cache entry
 */
export function clearRequestCache(cacheKey: string): void {
  requestCache.delete(cacheKey);
}

/**
 * Clear all cache entries
 */
export function clearAllRequestCache(): void {
  requestCache.clear();
}

/**
 * Get cache statistics for debugging
 */
export function getRequestCacheStats() {
  const now = Date.now();
  const stats = {
    total: requestCache.size,
    fresh: 0,
    stale: 0,
    keys: Array.from(requestCache.keys()),
  };

  requestCache.forEach((entry) => {
    if (now - entry.timestamp < CACHE_TTL) {
      stats.fresh++;
    } else {
      stats.stale++;
    }
  });

  return stats;
}
