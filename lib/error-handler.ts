"use client";

/**
 * Production Error Handling & Logging System
 * ===========================================
 *
 * Centralized error handling untuk:
 * 1. Client-side errors
 * 2. API errors
 * 3. Network errors
 * 4. Cache errors
 * 5. Performance monitoring
 */

type ErrorSeverity = "low" | "medium" | "high" | "critical";

interface ErrorLog {
  id: string;
  timestamp: string;
  message: string;
  severity: ErrorSeverity;
  stack?: string;
  context?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: ErrorLog[] = [];
  private readonly MAX_ERRORS = 100;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Setup global error handlers untuk menangkap unhandled errors
   */
  private setupGlobalErrorHandlers(): void {
    if (globalThis.window === undefined) return;

    // Handle uncaught errors
    globalThis.addEventListener("error", (event) => {
      this.log(
        `Uncaught Error: ${event.message}`,
        "critical",
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        event.error?.stack,
      );
    });

    // Handle unhandled promise rejections
    globalThis.addEventListener("unhandledrejection", (event) => {
      this.log(
        `Unhandled Promise Rejection: ${String(event.reason)}`,
        "critical",
        {},
        event.reason?.stack,
      );
    });
  }

  /**
   * Log error dengan context
   */
  log(
    message: string,
    severity: ErrorSeverity = "medium",
    context: Record<string, unknown> = {},
    stack?: string,
  ): ErrorLog {
    const errorLog: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      message,
      severity,
      context,
      stack,
      userAgent:
        typeof globalThis !== "undefined" && globalThis.navigator
          ? globalThis.navigator.userAgent
          : undefined,
      url: globalThis.window ? globalThis.window.location.href : undefined,
    };

    this.errors.push(errorLog);

    // Keep only recent errors
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors = this.errors.slice(-this.MAX_ERRORS);
    }

    // Log to console di development
    if (process.env.NODE_ENV === "development") {
      console.error(`[${severity.toUpperCase()}] ${message}`, context);
    }

    // Send to external logging service (Sentry, etc)
    this.sendToLoggingService(errorLog);

    return errorLog;
  }

  /**
   * Handle API errors dengan retry logic
   */
  async handleApiError(
    error: unknown,
    url: string,
    retryCount: number = 0,
    maxRetries: number = 3,
  ): Promise<void> {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);

    // Determine severity berdasarkan error type
    let severity: ErrorSeverity = "medium";
    let shouldRetry = false;

    if (error instanceof TypeError) {
      severity = "high";
    } else if (error instanceof SyntaxError) {
      severity = "high";
    } else if (error instanceof Error && error.message.includes("timeout")) {
      shouldRetry = retryCount < maxRetries;
    }

    this.log(`API Error at ${url}: ${errorMessage}`, severity, {
      url,
      retryCount,
      maxRetries,
      shouldRetry,
    });

    if (shouldRetry) {
      console.warn(
        `Retrying API call (attempt ${retryCount + 1}/${maxRetries})...`,
      );
      // Retry logic handled by caller
    }
  }

  /**
   * Handle cache errors
   */
  handleCacheError(
    error: unknown,
    cacheKey: string,
    operation: "get" | "set" | "delete",
  ): void {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);

    this.log(
      `Cache ${operation} error for key "${cacheKey}": ${errorMessage}`,
      "medium",
      {
        cacheKey,
        operation,
      },
    );
  }

  /**
   * Handle hydration errors
   */
  handleHydrationError(componentName: string, error: unknown): void {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);

    this.log(
      `Hydration Error in ${componentName}: ${errorMessage}`,
      "high",
      {
        componentName,
      },
      error instanceof Error ? error.stack : undefined,
    );
  }

  /**
   * Send error logs ke external service
   */
  private sendToLoggingService(errorLog: ErrorLog): void {
    // Jika ada Sentry atau external logging service
    if (globalThis.window) {
      const win = globalThis.window as {
        Sentry?: { captureException: (err: ErrorLog) => void };
      };
      if (win.Sentry) {
        win.Sentry.captureException(errorLog);
      }
    }

    // Optional: send ke custom API endpoint
    if (
      process.env.NEXT_PUBLIC_ERROR_LOG_URL &&
      typeof navigator !== "undefined"
    ) {
      navigator.sendBeacon(
        process.env.NEXT_PUBLIC_ERROR_LOG_URL,
        JSON.stringify(errorLog),
      );
    }
  }

  /**
   * Get all logged errors (untuk debugging)
   */
  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): ErrorLog[] {
    return this.errors.filter((e) => e.severity === severity);
  }

  /**
   * Clear error logs
   */
  clearErrors(): void {
    this.errors = [];
  }
}

// ============================================
// CUSTOM HOOKS untuk error handling
// ============================================

import { useEffect, useCallback } from "react";

/**
 * Hook untuk wrap async functions dengan error handling
 */
export function useAsyncError() {
  const handler = ErrorHandler.getInstance();

  return useCallback(
    async <T>(fn: () => Promise<T>, context: Record<string, unknown> = {}) => {
      try {
        return await fn();
      } catch (error) {
        handler.log(
          error instanceof Error ? error.message : String(error),
          "high",
          context,
          error instanceof Error ? error.stack : undefined,
        );
        throw error;
      }
    },
    [handler],
  );
}

/**
 * Hook untuk monitor component errors
 */
export function useErrorBoundary(componentName: string) {
  const handler = ErrorHandler.getInstance();

  useEffect(() => {
    return () => {
      // Cleanup
    };
  }, [componentName, handler]);

  return {
    logError: (error: unknown) => {
      handler.handleHydrationError(componentName, error);
    },
  };
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const logger = ErrorHandler.getInstance();

/**
 * USAGE EXAMPLES:
 *
 * 1. Catch API errors:
 *    logger.handleApiError(error, url);
 *
 * 2. Catch cache errors:
 *    logger.handleCacheError(error, 'cache-key', 'get');
 *
 * 3. Catch hydration errors:
 *    logger.handleHydrationError('ComponentName', error);
 *
 * 4. Manual logging:
 *    logger.log('Something went wrong', 'high', { userId: 123 });
 *
 * 5. Get errors (untuk debugging):
 *    const errors = logger.getErrors();
 *    const criticalErrors = logger.getErrorsBySeverity('critical');
 */
