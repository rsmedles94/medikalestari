/**
 * Enhanced Request Cache Module
 * Improves upon existing request-cache.ts with better error handling
 * and retry logic
 */

interface CacheEntry {
  promise: Promise<unknown>;
  timestamp: number;
  attempts?: number;
  lastError?: Error;
}

const requestCache = new Map<string, CacheEntry>();

// Cache TTL - now delegated to cache-manager.ts per key
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 seconds as fallback

/**
 * Deduplicate concurrent requests to same resource
 * Shares promise between simultaneous requests
 * Includes exponential backoff retry logic
 *
 * @param cacheKey - Unique cache key
 * @param requestFn - Function that makes the request
 * @param options - Retry configuration
 */
export async function deduplicateRequest<T>(
  cacheKey: string,
  requestFn: () => Promise<T>,
  options: { maxRetries?: number; backoffMultiplier?: number } = {},
): Promise<T> {
  const { maxRetries = 2, backoffMultiplier = 2 } = options;
  const now = Date.now();
  const cached = requestCache.get(cacheKey);

  // Return cached result if still fresh
  if (cached) {
    const age = now - cached.timestamp;
    if (age < DEFAULT_CACHE_TTL) {
      console.debug(`[deduplicateRequest] Cache hit for ${cacheKey}`);
      return cached.promise as Promise<T>;
    }
  }

  // If request in flight, return existing promise (even if it will fail)
  if (cached?.promise) {
    console.debug(`[deduplicateRequest] Request in flight for ${cacheKey}`);
    return cached.promise as Promise<T>;
  }

  // Create new request with retry logic
  const promise = executeWithRetry<T>(
    requestFn,
    0,
    maxRetries,
    backoffMultiplier,
  )
    .then((result) => {
      // Success: store in cache
      requestCache.set(cacheKey, {
        promise: Promise.resolve(result),
        timestamp: Date.now(),
        attempts: 1,
      });
      console.debug(`[deduplicateRequest] Success for ${cacheKey}`);
      return result;
    })
    .catch((error) => {
      // Error: keep in cache but mark as stale
      // This prevents retry storms - failed requests expire quickly
      requestCache.set(cacheKey, {
        promise: Promise.reject(error),
        timestamp: Date.now() - DEFAULT_CACHE_TTL * 0.8, // Expire in 20%
        lastError: error as Error,
      });
      console.error(`[deduplicateRequest] Failed for ${cacheKey}:`, error);
      throw error;
    });

  // Store the in-flight promise
  requestCache.set(cacheKey, {
    promise,
    timestamp: now,
    attempts: 1,
  });

  return promise;
}

/**
 * Execute with exponential backoff retry
 */
async function executeWithRetry<T>(
  fn: () => Promise<T>,
  attempt: number,
  maxRetries: number,
  backoffMultiplier: number,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempt >= maxRetries) {
      throw error;
    }

    // Exponential backoff: 500ms, 1000ms, 2000ms, etc.
    const delay = 500 * Math.pow(backoffMultiplier, attempt);
    console.warn(
      `[executeWithRetry] Attempt ${attempt + 1}/${maxRetries + 1} failed, retrying in ${delay}ms`,
      error,
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return executeWithRetry(fn, attempt + 1, maxRetries, backoffMultiplier);
  }
}

/**
 * Clear specific cache entry
 */
export function clearRequestCache(cacheKey: string): void {
  requestCache.delete(cacheKey);
  console.debug(`[clearRequestCache] Cleared ${cacheKey}`);
}

/**
 * Clear all cache entries
 */
export function clearAllRequestCache(): void {
  requestCache.clear();
  console.debug("[clearAllRequestCache] Cleared all");
}

/**
 * Clear cache entries matching pattern
 */
export function clearRequestCachePattern(pattern: RegExp | string): void {
  const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
  const toDelete: string[] = [];

  requestCache.forEach((_, key) => {
    if (regex.test(key)) {
      toDelete.push(key);
    }
  });

  toDelete.forEach((key) => requestCache.delete(key));
  console.debug(
    `[clearRequestCachePattern] Cleared ${toDelete.length} entries matching ${pattern}`,
  );
}

/**
 * Get cache statistics for debugging and monitoring
 */
export function getRequestCacheStats() {
  const now = Date.now();
  const stats = {
    total: requestCache.size,
    fresh: 0,
    stale: 0,
    inFlight: 0,
    failed: 0,
    keys: Array.from(requestCache.keys()),
  };

  requestCache.forEach((entry) => {
    const age = now - entry.timestamp;
    if (age < DEFAULT_CACHE_TTL) {
      stats.fresh++;
    } else if (entry.lastError) {
      stats.failed++;
    } else {
      stats.stale++;
    }

    // If promise is pending (not settled), it's in-flight
    let isInFlight = true;
    entry.promise
      .then(() => {
        isInFlight = false;
      })
      .catch(() => {
        isInFlight = false;
      });

    if (isInFlight) {
      stats.inFlight++;
    }
  });

  return stats;
}

/**
 * Wait for all in-flight requests to complete
 * Useful for testing or graceful shutdown
 */
export async function waitForAllRequests(
  timeoutMs: number = 30000,
): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const promises = Array.from(requestCache.values()).map(
      (entry) => entry.promise,
    );
    await Promise.allSettled(promises);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Export for testing/debugging
 */
export function getRequestCacheSize(): number {
  return requestCache.size;
}

export function getRequestCacheEntries() {
  return Array.from(requestCache.entries());
}
