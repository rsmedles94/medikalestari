/**
 * Hydration-Safe Utilities
 * Mencegah mismatch antara server render dan client render
 *
 * PATTERN NOTES:
 * - useIsClient() & useDeferredClientState(): setState di-defer via queueMicrotask()
 *   untuk trigger re-render saat client ready, preventing hydration mismatch
 * - useLocalStorage(): setState di-defer untuk populate dari localStorage setelah mount
 * - Pattern ini adalah best practices untuk SSR safety di Next.js
 *
 * Jangan modifikasi tanpa understanding hydration lifecycle.
 */
"use client";

import React, {
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";

/**
 * Hook untuk mengetahui apakah client sudah siap
 * Gunakan untuk conditional rendering yang berbeda di SSR vs client
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      // Schedule state update di next micro task untuk menghindari warning
      queueMicrotask(() => setIsClient(true));
    }
  }, []);

  return isClient;
}

/**
 * Hook untuk safe window/document access
 * Mengembalikan default value saat SSR, actual value saat client
 */
export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({
    width: globalThis.innerWidth ?? 1024,
    height: globalThis.innerHeight ?? 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: globalThis.innerWidth ?? 1024,
        height: globalThis.innerHeight ?? 768,
      });
    };

    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

/**
 * Hook untuk responsive breakpoint detection
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const mediaRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    if (typeof globalThis === "undefined" || !globalThis.matchMedia) return;

    mediaRef.current = globalThis.matchMedia(query);
    setMatches(mediaRef.current.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaRef.current.addEventListener("change", listener);
    return () => {
      mediaRef.current?.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

/**
 * Hook untuk detect mobile device
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

/**
 * Component wrapper untuk SSR-safe content
 * Render fallback di server, actual content di client
 */
interface HydrationBoundaryProps {
  readonly fallback?: ReactNode;
  readonly children: ReactNode;
}

export const HydrationBoundary = React.memo(
  ({ fallback, children }: HydrationBoundaryProps) => {
    const isClient = useIsClient();

    if (!isClient) {
      return <>{fallback}</>;
    }

    return <>{children}</>;
  },
);

HydrationBoundary.displayName = "HydrationBoundary";

/**
 * Defer state update sampai client hydration selesai
 * Berguna untuk state yang bergantung pada window/document
 */
export function useDeferredClientState<T>(
  initialValue: T,
  getClientValue: () => T,
): T {
  const [value, setValue] = useState<T>(initialValue);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      try {
        const newValue = getClientValue();
        // Schedule state update di next micro task untuk menghindari warning Pylance
        queueMicrotask(() => setValue(newValue));
      } catch (error) {
        console.error("Error in useDeferredClientState:", error);
      }
    }
    // Hanya jalankan sekali saat client ready
  }, [isClient]);

  return value;
}

/**
 * Safe localStorage access yang mencegah hydration error
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const isClient = useIsClient();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (
      !isClient ||
      isInitializedRef.current ||
      typeof globalThis === "undefined"
    ) {
      return;
    }

    try {
      const item = globalThis.localStorage?.getItem(key);
      if (item) {
        // Schedule state update di next micro task untuk menghindari warning Pylance
        queueMicrotask(() => setStoredValue(JSON.parse(item) as T));
      }
      isInitializedRef.current = true;
    } catch (error) {
      console.warn(`Failed to read localStorage key "${key}":`, error);
    }
  }, [key, isClient]);

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof globalThis !== "undefined" && globalThis.localStorage) {
          globalThis.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.warn(`Failed to write localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  return [storedValue, setValue];
}

/**
 * Effect yang hanya berjalan di client-side
 * Berguna untuk side effects yang tidak perlu di SSR
 */
export function useClientEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
): void {
  const isClient = useIsClient();
  const effectRef = useRef(effect);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    if (isClient) {
      return effectRef.current();
    }
  }, [isClient, ...(deps ?? [])]);
}

/**
 * Safe document access dengan proper cleanup
 */
export function useDocumentMutation(
  callback: () => void | (() => void),
  deps?: React.DependencyList,
): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof globalThis === "undefined" || !globalThis.document) return;
    return callbackRef.current();
  }, deps);
}

/**
 * Prevent body scroll (for modals, etc.)
 */
export function usePreventScroll(prevent: boolean): void {
  useEffect(() => {
    if (typeof globalThis === "undefined" || !globalThis.document) return;

    if (!prevent) {
      globalThis.document.body.style.overflow = "";
      globalThis.document.documentElement.style.overflow = "";
      return;
    }

    const originalOverflow = globalThis.document.body.style.overflow;
    const originalHTMLOverflow =
      globalThis.document.documentElement.style.overflow;

    globalThis.document.body.style.overflow = "hidden";
    globalThis.document.documentElement.style.overflow = "hidden";

    return () => {
      globalThis.document.body.style.overflow = originalOverflow;
      globalThis.document.documentElement.style.overflow = originalHTMLOverflow;
    };
  }, [prevent]);
}

/**
 * Safe scroll listener dengan proper cleanup
 */
export function useScrollListener(
  callback: (scrollY: number) => void,
  options: { debounce?: number } = {},
): void {
  const { debounce = 0 } = options;
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof globalThis === "undefined" || !globalThis.window) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);

      if (debounce > 0) {
        timeoutId = setTimeout(() => {
          callbackRef.current(globalThis.window?.scrollY ?? 0);
        }, debounce);
      } else {
        callbackRef.current(globalThis.window?.scrollY ?? 0);
      }
    };

    globalThis.window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      globalThis.window?.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [debounce]);
}
