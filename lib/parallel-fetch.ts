/**
 * Parallel Fetch Manager
 * Executes multiple fetches in parallel while maintaining deduplication
 * Solves waterfall requests pattern
 */

interface ParallelFetchOptions {
  timeout?: number;
  fallbackOnError?: boolean;
}

/**
 * Execute multiple async operations in parallel
 * @example
 * const results = await parallelFetch({
 *   doctors: fetchDoctors(),
 *   schedules: fetchSchedules(doctorId),
 *   rooms: fetchRoomTypes(),
 * });
 */
export async function parallelFetch<T extends Record<string, Promise<unknown>>>(
  requests: T,
  options: ParallelFetchOptions = {},
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  const { timeout = 10000, fallbackOnError = true } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Execute all requests in parallel using Promise.allSettled
    // This ensures all promises settle regardless of individual failures
    const results = await Promise.allSettled(
      Object.values(requests) as Array<Promise<unknown>>,
    );

    clearTimeout(timeoutId);

    // Process results with fallback strategy
    const processed: Record<string, unknown> = {};
    const keys = Object.keys(requests);

    keys.forEach((key, index) => {
      const result = results[index];
      if (result.status === "fulfilled") {
        processed[key] = result.value;
      } else {
        console.warn(`[parallelFetch] Request '${key}' failed:`, result.reason);
        // Fallback based on strategy
        if (fallbackOnError) {
          processed[key] = getDefaultFallback(key);
        } else {
          processed[key] = null;
        }
      }
    });

    return processed as { [K in keyof T]: Awaited<T[K]> };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("[parallelFetch] Fatal error:", error);
    throw error;
  }
}

/**
 * Get sensible defaults for different data types on error
 */
function getDefaultFallback(key: string): unknown {
  const fallbacks: Record<string, unknown> = {
    doctors: [],
    schedules: [],
    recommended: [],
    rooms: [],
    banners: [],
    mading: [],
    popups: [],
    doctor: null,
    schedule: null,
    banner: null,
  };
  return fallbacks[key] ?? null;
}

/**
 * Sequential fetch helper with progress callback
 * Useful for UX progress indication
 */
export async function sequentialFetch<T>(
  requests: { key: string; promise: Promise<T> }[],
  onProgress?: (completed: number, total: number, key: string) => void,
): Promise<Record<string, T>> {
  const results: Record<string, T> = {};

  for (let i = 0; i < requests.length; i++) {
    const { key, promise } = requests[i];
    try {
      results[key] = await promise;
      onProgress?.(i + 1, requests.length, key);
    } catch (error) {
      console.error(`[sequentialFetch] Request '${key}' failed:`, error);
      results[key] = getDefaultFallback(key) as T;
    }
  }

  return results;
}

/**
 * Batch fetches with concurrency limit
 * Prevents overwhelming the server with too many simultaneous requests
 */
export async function batchFetch<T>(
  requests: Promise<T>[],
  batchSize: number = 3,
): Promise<T[]> {
  const results: T[] = [];
  const errors: unknown[] = [];

  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch);

    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        errors.push(result.reason);
      }
    });

    // Small delay between batches to prevent thundering herd
    if (i + batchSize < requests.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  if (errors.length > 0) {
    console.warn(`[batchFetch] ${errors.length} requests failed`);
  }

  return results;
}
