/**
 * useCachedFetch Hook
 * Optimized data fetching dengan deduplication, caching, dan abort support
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  deduplicateRequest,
  clearRequestCache,
} from "@/lib/enhanced-request-cache";

interface UseCachedFetchOptions {
  skip?: boolean;
  deduplicate?: boolean;
}

interface CacheState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook untuk fetch data dengan automatic deduplication dan caching
 * Mencegah duplicate requests saat multiple components mount bersamaan
 */
export function useCachedFetch<T>(
  fetchFn: () => Promise<T>,
  cacheKey: string,
  options: UseCachedFetchOptions = {},
): CacheState<T> & { refetch: () => Promise<void> } {
  const { skip = false, deduplicate = true } = options;
  const [state, setState] = useState<CacheState<T>>({
    data: null,
    loading: !skip,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const fetchFnRef = useRef(fetchFn);

  // Update ref when function changes, but don't trigger re-fetch
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  useEffect(() => {
    isMountedRef.current = true;
    if (skip) {
      return;
    }

    const performFetch = async (): Promise<void> => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        // Fast-path: try localStorage first (synchronous) so UI can show cached data instantly
        let cachedData: T | null = null;
        const cacheKeyUrl = `/__cached/${cacheKey}`;
        try {
          if (typeof globalThis !== "undefined" && globalThis.window) {
            const raw = localStorage.getItem(cacheKeyUrl);
            if (raw) {
              try {
                cachedData = JSON.parse(raw) as T;
              } catch {
                cachedData = null;
              }
            }
          }
        } catch {
          // ignore localStorage errors
          cachedData = null;
        }

        // If localStorage didn't have it, fallback to Cache Storage (async)
        if (!cachedData) {
          try {
            if (typeof globalThis !== "undefined" && "caches" in globalThis) {
              const cache = await caches.open("rs-medika-api-v1");
              const match = await cache.match(new Request(cacheKeyUrl));
              if (match) {
                try {
                  cachedData = (await match.json()) as T;
                } catch {
                  cachedData = null;
                }
              }
            }
          } catch {
            // ignore cache reading errors
          }
        }

        if (cachedData) {
          if (isMountedRef.current) {
            setState({ data: cachedData, loading: false, error: null });
          }
          // still perform network fetch in background to update cache/state
          const data = deduplicate
            ? await deduplicateRequest(cacheKey, fetchFnRef.current)
            : await fetchFnRef.current();

          if (isMountedRef.current) {
            setState({ data, loading: false, error: null });
          }

          // update cache with fresh data (Cache Storage) and also write to localStorage for instant fallback
          try {
            if (typeof globalThis !== "undefined" && "caches" in globalThis) {
              const cache = await caches.open("rs-medika-api-v1");
              await cache.put(
                new Request(cacheKeyUrl),
                new Response(JSON.stringify(data), {
                  headers: { "content-type": "application/json" },
                }),
              );
            }
          } catch (e) {
            // ignore cache write errors
            console.warn("[useCachedFetch] cache write failed:", e);
          }

          try {
            if (typeof globalThis !== "undefined" && globalThis.window) {
              localStorage.setItem(cacheKeyUrl, JSON.stringify(data));
            }
          } catch {
            // ignore localStorage write errors
          }
        } else {
          // no cache found -> show loading state while fetching
          if (isMountedRef.current)
            setState({ data: null, loading: true, error: null });

          const data = deduplicate
            ? await deduplicateRequest(cacheKey, fetchFnRef.current)
            : await fetchFnRef.current();

          if (isMountedRef.current) {
            setState({ data, loading: false, error: null });
          }

          // store into cache for next navigations and localStorage for instant fallback
          try {
            if (typeof globalThis !== "undefined" && "caches" in globalThis) {
              const cache = await caches.open("rs-medika-api-v1");
              await cache.put(
                new Request(cacheKeyUrl),
                new Response(JSON.stringify(data), {
                  headers: { "content-type": "application/json" },
                }),
              );
            }
          } catch (e) {
            console.warn("[useCachedFetch] cache write failed:", e);
          }

          try {
            if (typeof globalThis !== "undefined" && globalThis.window) {
              localStorage.setItem(cacheKeyUrl, JSON.stringify(data));
            }
          } catch {
            // ignore localStorage write errors
          }
        }
      } catch (err) {
        if (isMountedRef.current) {
          const error = err instanceof Error ? err : new Error(String(err));
          setState({ data: null, loading: false, error });
        }
      }
    };

    performFetch();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [cacheKey, skip, deduplicate]);

  const refetch = useCallback(async (): Promise<void> => {
    clearRequestCache(cacheKey);
    try {
      setState({ data: null, loading: true, error: null });
      const data = await fetchFnRef.current();
      if (isMountedRef.current) {
        setState({ data, loading: false, error: null });
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState({ data: null, loading: false, error });
      }
    }
  }, [cacheKey]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { ...state, refetch };
}
