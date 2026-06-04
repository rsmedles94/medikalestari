/**
 * Cache Invalidator
 * Handles strategic cache clearing dan revalidation
 * Memastikan update di production langsung terlihat
 */

import { CacheManager } from "./cache-manager";
import {
  clearRequestCachePattern,
  clearAllRequestCache,
} from "./enhanced-request-cache";

export class CacheInvalidator {
  private static invalidationLog: Array<{
    timestamp: number;
    action: string;
    pattern: string;
  }> = [];

  /**
   * Invalidate cache untuk data doctors
   * Dipanggil ketika dokter atau jadwal berubah
   */
  static invalidateDoctors(specialty?: string): void {
    const pattern = specialty ? `doctors:${specialty}:.*` : "doctors:.*";

    CacheManager.getInstance().clear(pattern);
    clearRequestCachePattern(pattern);
    this.logInvalidation("invalidateDoctors", pattern);
  }

  /**
   * Invalidate cache untuk hero banners
   */
  static invalidateHeroBanners(): void {
    const pattern = "hero_banners:.*";
    CacheManager.getInstance().clear(pattern);
    clearRequestCachePattern(pattern);
    this.logInvalidation("invalidateHeroBanners", pattern);
  }

  /**
   * Invalidate cache untuk schedules
   */
  static invalidateSchedules(doctorId?: string): void {
    const pattern = doctorId ? `schedules:${doctorId}:.*` : "schedules:.*";

    CacheManager.getInstance().clear(pattern);
    clearRequestCachePattern(pattern);
    this.logInvalidation("invalidateSchedules", pattern);
  }

  /**
   * Invalidate cache untuk mading/news
   */
  static invalidateMading(): void {
    const pattern = "mading:.*";
    CacheManager.getInstance().clear(pattern);
    clearRequestCachePattern(pattern);
    this.logInvalidation("invalidateMading", pattern);
  }

  /**
   * Invalidate cache untuk MCU packages
   */
  static invalidateMCU(): void {
    const pattern = "mcu:.*";
    CacheManager.getInstance().clear(pattern);
    clearRequestCachePattern(pattern);
    this.logInvalidation("invalidateMCU", pattern);
  }

  /**
   * Invalidate cache untuk popups
   */
  static invalidatePopups(): void {
    const pattern = "popups:.*";
    CacheManager.getInstance().clear(pattern);
    clearRequestCachePattern(pattern);
    this.logInvalidation("invalidatePopups", pattern);
  }

  /**
   * Invalidate ALL cache
   * Gunakan dengan hati-hati, bisa impact performance
   */
  static invalidateAll(): void {
    CacheManager.getInstance().clear();
    clearAllRequestCache();
    this.logInvalidation("invalidateAll", ".*");
  }

  /**
   * Selective invalidation by pattern
   */
  static invalidateByPattern(pattern: string | RegExp): void {
    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    CacheManager.getInstance().clear(regex.source);
    clearRequestCachePattern(regex);
    this.logInvalidation("invalidateByPattern", regex.source);
  }

  /**
   * Log invalidation actions untuk debugging
   */
  private static logInvalidation(action: string, pattern: string): void {
    const entry = {
      timestamp: Date.now(),
      action,
      pattern,
    };

    this.invalidationLog.push(entry);

    // Keep only last 100 entries
    if (this.invalidationLog.length > 100) {
      this.invalidationLog.shift();
    }

    console.log(
      `[CacheInvalidator] ${action}: ${pattern}`,
      new Date().toISOString(),
    );
  }

  /**
   * Get invalidation history untuk monitoring
   */
  static getHistory(limit: number = 20): typeof this.invalidationLog {
    return this.invalidationLog.slice(-limit);
  }

  /**
   * Clear invalidation history
   */
  static clearHistory(): void {
    this.invalidationLog = [];
  }
}

/**
 * Export convenience functions
 */
export const invalidateCache = {
  doctors: (specialty?: string) =>
    CacheInvalidator.invalidateDoctors(specialty),
  heroBanners: () => CacheInvalidator.invalidateHeroBanners(),
  schedules: (doctorId?: string) =>
    CacheInvalidator.invalidateSchedules(doctorId),
  mading: () => CacheInvalidator.invalidateMading(),
  mcu: () => CacheInvalidator.invalidateMCU(),
  popups: () => CacheInvalidator.invalidatePopups(),
  all: () => CacheInvalidator.invalidateAll(),
  byPattern: (pattern: string | RegExp) =>
    CacheInvalidator.invalidateByPattern(pattern),
};
