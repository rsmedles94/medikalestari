/**
 * useOptimizedAnimation Hook
 * Prevents animation rerender storms by batching state updates
 * Debounces motion trigger events
 */

import { useEffect, useState, useRef, useCallback } from "react";

interface UseOptimizedAnimationOptions {
  debounceMs?: number;
  batchUpdates?: boolean;
}

/**
 * Hook for optimized animation updates
 * Batches multiple state changes into single render
 * Prevents Framer Motion recompute storms
 *
 * @example
 * const { data, batchUpdate } = useOptimizedAnimation(initialData);
 * batchUpdate({ slides: newSlides, currentDevice: 'mobile' });
 */
export function useOptimizedAnimation<T extends Record<string, unknown>>(
  initialData: T,
  options: UseOptimizedAnimationOptions = {},
) {
  const { debounceMs = 50, batchUpdates = true } = options;

  const [data, setData] = useState<T>(initialData);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const batchUpdatesRef = useRef<Partial<T>>({});

  /**
   * Queue state updates to be batched together
   */
  const batchUpdate = useCallback(
    (updates: Partial<T>) => {
      if (!batchUpdates) {
        // If batching disabled, update immediately
        setData((prev) => ({ ...prev, ...updates }));
        return;
      }

      // Merge into pending updates
      batchUpdatesRef.current = {
        ...batchUpdatesRef.current,
        ...updates,
      };

      // Clear existing debounce timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Debounce the actual state update
      updateTimeoutRef.current = setTimeout(() => {
        setData((prev) => ({
          ...prev,
          ...batchUpdatesRef.current,
        }));
        batchUpdatesRef.current = {};
      }, debounceMs);
    },
    [batchUpdates, debounceMs],
  );

  /**
   * Immediately apply updates (bypass batching)
   */
  const immediateUpdate = useCallback((updates: Partial<T>) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    batchUpdatesRef.current = {};
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    batchUpdate,
    immediateUpdate,
    flushBatch: () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (Object.keys(batchUpdatesRef.current).length > 0) {
        setData((prev) => ({
          ...prev,
          ...batchUpdatesRef.current,
        }));
        batchUpdatesRef.current = {};
      }
    },
  };
}

/**
 * useDebounce Hook
 * Simple debounce for values with optional callback
 */
export function useDebounce<T>(
  value: T,
  delay: number,
  onDebounced?: (value: T) => void,
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      onDebounced?.(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, onDebounced]);

  return debouncedValue;
}

/**
 * useThrottle Hook
 * Throttle function calls - ensure max frequency
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  callback: T,
  limit: number,
): T {
  const inThrottleRef = useRef(false);

  return useCallback(
    (...args: unknown[]) => {
      if (!inThrottleRef.current) {
        callback(...args);
        inThrottleRef.current = true;
        setTimeout(() => {
          inThrottleRef.current = false;
        }, limit);
      }
    },
    [callback, limit],
  ) as T;
}
