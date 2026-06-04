

import { cacheManager } from "./cache-manager";
import {
  getRequestCacheStats,
  waitForAllRequests,
} from "./enhanced-request-cache";

/**
 * Get comprehensive cache statistics untuk monitoring
 */
export function getCacheMonitoringStats() {
  const cacheManagerStats = cacheManager.getStats();
  const requestCacheStats = getRequestCacheStats();

  return {
    timestamp: new Date().toISOString(),
    memory: {
      cacheManagerSize: cacheManagerStats.size,
      requestCacheSize: requestCacheStats.total,
      estimatedMemoryMB: (cacheManagerStats.size * 0.01).toFixed(2), // Rough estimate
    },
    performance: {
      cacheHitRate: cacheManagerStats.hitRate,
      requestCacheHits: requestCacheStats.fresh,
      requestCacheMisses: requestCacheStats.total - requestCacheStats.fresh,
      inFlightRequests: requestCacheStats.inFlight,
      failedRequests: requestCacheStats.failed,
    },
    operations: {
      cacheManagerHits: cacheManagerStats.hits,
      cacheManagerMisses: cacheManagerStats.misses,
      cacheSets: cacheManagerStats.sets,
      cacheClears: cacheManagerStats.clears,
    },
    keys: {
      cacheManagerKeys: cacheManagerStats.keys.slice(0, 10), // Top 10
      requestCacheKeys: requestCacheStats.keys.slice(0, 10),
    },
  };
}

/**
 * Export cache stats sebagai JSON untuk external monitoring
 */
export function exportCacheStats() {
  const stats = getCacheMonitoringStats();
  return JSON.stringify(stats, null, 2);
}

/**
 * Wait untuk semua in-flight requests sebelum shutdown
 * Gunakan di server shutdown hook
 */
export async function gracefulCacheShutdown(timeoutMs: number = 30000) {
  console.log("[Cache] Starting graceful shutdown...");

  try {
    await waitForAllRequests(timeoutMs);
    const stats = getCacheMonitoringStats();
    console.log("[Cache] Graceful shutdown complete:", stats);
  } catch (error) {
    console.error("[Cache] Graceful shutdown timeout or error:", error);
  }
}

/**
 * Reset semua cache (gunakan untuk maintenance)
 */
export function resetAllCaches() {
  cacheManager.clear();
  cacheManager.resetStats();
  console.log("[Cache] All caches reset");
}

/**
 * Log cache health report
 */
export function logCacheHealthReport() {
  const stats = getCacheMonitoringStats();

  console.group("📊 Cache Health Report");
  console.log("⏰ Timestamp:", stats.timestamp);
  console.log("💾 Memory:", stats.memory);
  console.log("⚡ Performance:", stats.performance);
  console.log("📈 Operations:", stats.operations);
  console.groupEnd();

  return stats;
}
