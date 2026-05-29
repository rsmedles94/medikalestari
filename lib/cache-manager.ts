/**
 * Cache Manager
 * Centralized caching strategy per data type
 * Replaces ad-hoc TTL in request-cache.ts
 */

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// Define TTL per data type
// Static data = longer TTL
// Frequently changing data = shorter TTL
const CACHE_STRATEGIES: Record<string, number> = {
  // Static/rarely changing (30+ minutes)
  hero_banners: 30 * 60 * 1000,
  doctors: 30 * 60 * 1000,
  rooms: 60 * 60 * 1000,
  specialties: 60 * 60 * 1000,

  // Semi-dynamic (10-15 minutes)
  schedules: 10 * 60 * 1000,
  doctor_detail: 15 * 60 * 1000,

  // Dynamic (2-5 minutes)
  mading: 5 * 60 * 1000,
  popups: 2 * 60 * 1000,
  stats: 2 * 60 * 1000,

  // Default fallback
  default: 5 * 60 * 1000,
};

export class CacheManager {
  private static instance: CacheManager;
  private cache = new Map<string, CacheEntry>();
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    clears: 0,
  };

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Get TTL configuration for a cache key
   */
  static getConfig(key: string): number {
    // Extract base key without parameters (e.g., "doctors:specialty" -> "doctors")
    const baseKey = key.split(":")[0];
    return CACHE_STRATEGIES[baseKey] ?? CACHE_STRATEGIES["default"];
  }

  /**
   * Get cached data if still valid
   */
  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;
    const ttl = CacheManager.getConfig(key);

    // Check if cache is still fresh
    if (age > ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Cache hit!
    this.stats.hits++;
    return entry.data;
  }

  /**
   * Set cache data
   */
  set(key: string, data: unknown): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
    this.stats.sets++;
  }

  /**
   * Clear specific or all cache entries
   */
  clear(pattern?: string): void {
    if (pattern) {
      // Clear entries matching pattern
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all
      this.cache.clear();
    }
    this.stats.clears++;
  }

  /**
   * Get cache statistics for monitoring
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate =
      total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : "N/A";

    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: `${hitRate}%`,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0, sets: 0, clears: 0 };
  }

  /**
   * Get time-to-live for a cache entry
   */
  getTTL(key: string): number {
    const entry = this.cache.get(key);
    if (!entry) return 0;

    const now = Date.now();
    const age = now - entry.timestamp;
    const ttl = CacheManager.getConfig(key);
    const remaining = Math.max(0, ttl - age);

    return remaining;
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();
