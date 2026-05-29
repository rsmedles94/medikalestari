/**
 * useImagePreload Hook
 * Optimized image preloading with concurrent limits
 * Prevents blocking main thread with too many simultaneous loads
 */

import { useEffect, useRef } from "react";

interface PreloadConfig {
  urls: string[];
  lowPriority?: boolean; // Use requestIdleCallback
  maxConcurrent?: number; // Default 3 simultaneous loads
  onProgress?: (loaded: number, total: number) => void;
}

/**
 * Preload images with concurrency control
 * Great for hero sections and image galleries
 */
export function useImagePreload({
  urls,
  lowPriority = false,
  maxConcurrent = 3,
  onProgress,
}: PreloadConfig): void {
  const preloadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Filter out already preloaded URLs
    const toPreload = urls.filter((url) => !preloadedRef.current.has(url));
    if (toPreload.length === 0) {
      onProgress?.(preloadedRef.current.size, urls.length);
      return;
    }

    let isMounted = true;

    const preloadBatch = async (): Promise<void> => {
      // Process in batches to avoid overwhelming the browser
      for (let i = 0; i < toPreload.length; i += maxConcurrent) {
        if (!isMounted) return;

        const batch = toPreload.slice(i, i + maxConcurrent);

        // Preload batch concurrently
        await Promise.allSettled(
          batch.map((url) =>
            preloadImage(url, preloadedRef, onProgress, urls.length),
          ),
        );

        // Small delay between batches
        if (i + maxConcurrent < toPreload.length && isMounted) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    };

    if (
      lowPriority &&
      typeof globalThis !== "undefined" &&
      "requestIdleCallback" in globalThis
    ) {
      // Low priority: preload during idle time
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).requestIdleCallback(() => void preloadBatch(), {
        timeout: 2000,
      });
    } else {
      // Normal priority: start preloading immediately
      void preloadBatch();
    }

    return () => {
      isMounted = false;
    };
  }, [urls, lowPriority, maxConcurrent, onProgress]);
}

/**
 * Helper function to preload single image
 */
function preloadImage(
  url: string,
  preloadedRef: React.MutableRefObject<Set<string>>,
  onProgress?: (loaded: number, total: number) => void,
  total?: number,
): Promise<void> {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      preloadedRef.current.add(url);
      onProgress?.(preloadedRef.current.size, total ?? 0);
      resolve();
    };
    img.onerror = () => {
      preloadedRef.current.add(url);
      onProgress?.(preloadedRef.current.size, total ?? 0);
      resolve();
    };
    img.src = url;
  });
}
