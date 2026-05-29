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
        setState({ data: null, loading: true, error: null });

        const data = deduplicate
          ? await deduplicateRequest(cacheKey, fetchFnRef.current)
          : await fetchFnRef.current();

        if (isMountedRef.current) {
          setState({ data, loading: false, error: null });
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
