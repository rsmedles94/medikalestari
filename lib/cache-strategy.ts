/**
 * Advanced Cache Strategy Configuration
 * Optimized untuk production dengan monitoring
 */

import { CacheManager } from "./cache-manager";

interface CacheConfig {
  ttl: number;
  priority: "critical" | "high" | "medium" | "low";
  maxSize: number; // bytes
  revalidateOnFocus?: boolean;
  deduplicate?: boolean;
}

/**
 * NetworkInformation API interface
 */
interface NetworkConnection {
  effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  onchange?: EventListener;
}

/**
 * Production-grade cache configurations per data type
 */
export const CACHE_CONFIGS: Record<string, CacheConfig> = {
  // CRITICAL: Core data untuk browsing
  doctors: {
    ttl: 30 * 60 * 1000, // 30 minutes
    priority: "critical",
    maxSize: 5 * 1024 * 1024, // 5MB
    revalidateOnFocus: true,
    deduplicate: true,
  },
  specialties: {
    ttl: 60 * 60 * 1000, // 1 hour
    priority: "critical",
    maxSize: 500 * 1024, // 500KB
    revalidateOnFocus: true,
    deduplicate: true,
  },
  rooms: {
    ttl: 60 * 60 * 1000, // 1 hour
    priority: "critical",
    maxSize: 2 * 1024 * 1024, // 2MB
    revalidateOnFocus: false,
    deduplicate: true,
  },

  // HIGH: User-specific dan frequently accessed
  schedules: {
    ttl: 10 * 60 * 1000, // 10 minutes
    priority: "high",
    maxSize: 3 * 1024 * 1024, // 3MB
    revalidateOnFocus: true,
    deduplicate: true,
  },
  doctor_detail: {
    ttl: 15 * 60 * 1000, // 15 minutes
    priority: "high",
    maxSize: 1 * 1024 * 1024, // 1MB
    revalidateOnFocus: true,
    deduplicate: true,
  },

  // MEDIUM: Regularly changing content
  mading: {
    ttl: 5 * 60 * 1000, // 5 minutes
    priority: "medium",
    maxSize: 2 * 1024 * 1024, // 2MB
    revalidateOnFocus: true,
    deduplicate: false,
  },
  hero_banners: {
    ttl: 30 * 60 * 1000, // 30 minutes
    priority: "medium",
    maxSize: 3 * 1024 * 1024, // 3MB
    revalidateOnFocus: false,
    deduplicate: true,
  },

  // LOW: Promotional content, less critical
  popups: {
    ttl: 2 * 60 * 1000, // 2 minutes
    priority: "low",
    maxSize: 1 * 1024 * 1024, // 1MB
    revalidateOnFocus: false,
    deduplicate: false,
  },
  mcu: {
    ttl: 30 * 1000, // 30 seconds - frequently updated
    priority: "low",
    maxSize: 1024 * 1024, // 1MB
    revalidateOnFocus: true,
    deduplicate: false,
  },
};

/**
 * Memory usage monitoring
 */
export class CacheMonitor {
  private static instance: CacheMonitor;
  private stats = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    totalBytes: 0,
    startTime: Date.now(),
  };

  private constructor() {}

  static getInstance(): CacheMonitor {
    if (!CacheMonitor.instance) {
      CacheMonitor.instance = new CacheMonitor();
    }
    return CacheMonitor.instance;
  }

  recordRequest(hit: boolean, sizeBytes: number) {
    this.stats.totalRequests++;
    if (hit) {
      this.stats.cacheHits++;
    } else {
      this.stats.cacheMisses++;
    }
    this.stats.totalBytes += sizeBytes;
  }

  getStats() {
    const uptime = Date.now() - this.stats.startTime;
    const hitRate =
      this.stats.totalRequests > 0
        ? ((this.stats.cacheHits / this.stats.totalRequests) * 100).toFixed(2)
        : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      uptime: `${(uptime / 1000 / 60).toFixed(2)} minutes`,
      avgCacheSize: `${(this.stats.totalBytes / 1024 / 1024).toFixed(2)} MB`,
    };
  }

  reset() {
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalBytes: 0,
      startTime: Date.now(),
    };
  }
}

/**
 * Smart cache invalidation based on user behavior
 */
export class CacheInvalidationStrategy {
  private static readonly userActivityMap = new Map<string, number>();
  private static readonly lastInvalidationTime = new Map<string, number>();

  /**
   * Check jika cache perlu di-invalidate berdasarkan user activity
   */
  static shouldInvalidate(cacheKey: string): boolean {
    const lastInvalidation = this.lastInvalidationTime.get(cacheKey) || 0;
    const config = CACHE_CONFIGS[cacheKey.split(":")[0]];

    if (!config) return false;

    const timeSinceLastInvalidation = Date.now() - lastInvalidation;
    return timeSinceLastInvalidation > config.ttl;
  }

  /**
   * Mark activity untuk tracking
   */
  static markActivity(cacheKey: string) {
    const baseKey = cacheKey.split(":")[0];
    const activity = this.userActivityMap.get(baseKey) || 0;
    this.userActivityMap.set(baseKey, activity + 1);
  }

  /**
   * Get activity level (0-1, untuk smart prefetch)
   */
  static getActivityLevel(cacheKey: string): number {
    const activity = this.userActivityMap.get(cacheKey) || 0;
    return Math.min(activity / 10, 1); // Normalize to 0-1
  }

  /**
   * Invalidate cache
   */
  static invalidate(cacheKey: string) {
    this.lastInvalidationTime.set(cacheKey, Date.now());
    CacheManager.getInstance().clear(cacheKey);
  }
}

/**
 * Prefetch strategy untuk mobile optimization
 */
export async function prefetchCriticalData(): Promise<void> {
  if (globalThis.window === undefined) return;

  // Prefetch only on good network conditions
  if ("connection" in navigator) {
    const connection = (
      navigator as unknown as { connection?: NetworkConnection }
    ).connection;
    if (connection?.effectiveType === "4g") {
      console.log("[Cache] Prefetching critical data on 4G...");
      // Trigger prefetch untuk critical data
      // Implementation bergantung pada API yang available
    }
  }
}

/**
 * Cache persistence untuk offline support (optional)
 */
export async function persistCacheToIndexedDB(
  key: string,
  data: unknown,
): Promise<void> {
  if (globalThis.window === undefined || !("indexedDB" in globalThis)) return;

  try {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = globalThis.indexedDB.open("RSMedikaCache", 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("cache")) {
          db.createObjectStore("cache");
        }
      };
    });

    const tx = db.transaction("cache", "readwrite");
    const store = tx.objectStore("cache");
    store.put(
      {
        data,
        timestamp: Date.now(),
      },
      key,
    );

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(undefined);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn("Failed to persist cache to IndexedDB:", error);
  }
}

/**
 * Get cached data dari IndexedDB
 */
export async function getCachedDataFromIndexedDB(
  key: string,
): Promise<unknown> {
  if (globalThis.window === undefined || !("indexedDB" in globalThis))
    return null;

  try {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = globalThis.indexedDB.open("RSMedikaCache", 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });

    const tx = db.transaction("cache", "readonly");
    const store = tx.objectStore("cache");

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.data ?? null);
    });
  } catch (error) {
    console.warn("Failed to get cache from IndexedDB:", error);
    return null;
  }
}

export default CACHE_CONFIGS;
