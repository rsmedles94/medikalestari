/**
 * Image Loader Utility - Optimized image loading dengan priority queue
 * Mencegah lazy load dari mengblock initial paint
 * Menggunakan requestIdleCallback untuk low-priority image loads
 */

import React from "react";

interface ImageLoadConfig {
  url: string;
  priority?: "high" | "medium" | "low";
  timeout?: number;
}

class ImageLoaderManager {
  private readonly loadingMap = new Map<string, Promise<void>>();

  /**
   * Load image dengan priority queue
   * High priority images load immediately
   * Low priority images load during idle time
   */
  async loadImage(config: ImageLoadConfig): Promise<void> {
    const { url, priority = "medium", timeout = 5000 } = config;

    // Return existing promise if already loading
    if (this.loadingMap.has(url)) {
      return this.loadingMap.get(url)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Image load timeout: ${url}`));
      }, timeout);

      const img = new Image();
      img.onload = () => {
        clearTimeout(timeoutId);
        this.loadingMap.delete(url);
        resolve();
      };
      img.onerror = () => {
        clearTimeout(timeoutId);
        this.loadingMap.delete(url);
        reject(new Error(`Failed to load image: ${url}`));
      };

      // Schedule based on priority
      if (priority === "high") {
        img.src = url; // Start immediately
      } else if (priority === "medium") {
        // Start after short delay
        setTimeout(() => {
          img.src = url;
        }, 100);
      } else {
        // Use requestIdleCallback for low priority
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ("requestIdleCallback" in (globalThis as any)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (globalThis as any).requestIdleCallback(
            () => {
              img.src = url;
            },
            { timeout: 2000 },
          );
        } else {
          // Fallback to setTimeout if requestIdleCallback not available
          setTimeout(() => {
            img.src = url;
          }, 5000);
        }
      }
    });

    this.loadingMap.set(url, promise);
    return promise;
  }

  /**
   * Preload multiple images dengan optimal batching
   */
  async preloadBatch(
    images: ImageLoadConfig[],
    maxConcurrent = 3,
  ): Promise<void> {
    const batches: ImageLoadConfig[][] = [];
    for (let i = 0; i < images.length; i += maxConcurrent) {
      batches.push(images.slice(i, i + maxConcurrent));
    }

    for (const batch of batches) {
      await Promise.allSettled(batch.map((img) => this.loadImage(img)));
    }
  }

  /**
   * Check if image is already loaded
   */
  isLoaded(url: string): boolean {
    return !this.loadingMap.has(url);
  }

  /**
   * Clear cache (careful with this!)
   */
  clear(): void {
    this.loadingMap.clear();
  }
}

// Export singleton instance
export const imageLoader = new ImageLoaderManager();

/**
 * React hook untuk image preloading
 * @example
 * useImageLoader([
 *   { url: '/img1.jpg', priority: 'high' },
 *   { url: '/img2.jpg', priority: 'low' },
 * ]);
 */
export function useImageLoader(images: ImageLoadConfig[]): {
  loaded: Set<string>;
  loading: boolean;
} {
  const [loaded, setLoaded] = React.useState(new Set<string>());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadImages = async (): Promise<void> => {
      setLoading(true);
      const loadedSet = new Set<string>();

      await Promise.allSettled(
        images.map(async (config) => {
          try {
            await imageLoader.loadImage(config);
            loadedSet.add(config.url);
          } catch (err) {
            // Image failed to load - log and continue
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.warn(
              `Failed to preload image: ${config.url} - ${errorMsg}`,
            );
          }
        }),
      );

      setLoaded(loadedSet);
      setLoading(false);
    };

    void loadImages();
  }, [images]);

  return { loaded, loading };
}
