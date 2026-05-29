/**
 * useParallelFetch Hook - Parallel Requests tanpa Waterfall
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ParallelFetchState<T> {
  data: T;
  loading: boolean;
  error: Record<string, Error | null>;
  refetch: () => Promise<void>;
}

export function useParallelFetch<T extends Record<string, unknown>>(fetchers: {
  [K in keyof T]: () => Promise<T[K]>;
}): ParallelFetchState<T> {
  const initialData = Object.keys(fetchers).reduce((acc, key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    acc[key as keyof T] = null as any;
    return acc;
  }, {} as T);

  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Record<string, Error | null>>({});
  const isMountedRef = useRef(true);
  const fetchersRef = useRef(fetchers);

  // Keep ref in sync without causing re-renders
  useEffect(() => {
    fetchersRef.current = fetchers;
  }, [fetchers]);

  const performFetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError({});

    const entries = Object.entries(fetchersRef.current) as Array<
      [string, () => Promise<unknown>]
    >;
    const results = await Promise.allSettled(entries.map(([, fn]) => fn()));

    if (!isMountedRef.current) return;

    const newData: Record<string, unknown> = {};
    const newErrors: Record<string, Error | null> = {};

    entries.forEach(([key], index) => {
      const result = results[index];
      if (result.status === "fulfilled") {
        newData[key] = result.value;
        newErrors[key] = null;
      } else {
        newData[key] = null;
        newErrors[key] =
          result.reason instanceof Error
            ? result.reason
            : new Error(String(result.reason));
      }
    });

    setData(newData as T);
    setError(newErrors);
    setLoading(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;

    // Use microtask to defer setState
    Promise.resolve().then(() => {
      if (!cancelled && isMountedRef.current) {
        void performFetch();
      }
    });

    return () => {
      isMountedRef.current = false;
      cancelled = true;
    };
  }, [performFetch]);

  const refetch = useCallback(async (): Promise<void> => {
    await performFetch();
  }, [performFetch]);

  return { data, loading, error, refetch };
}
