/**
 * Hydration-Safe Utilities
 * Mencegah mismatch antara server render dan client render
 */

import React, { useEffect, useState, ReactNode } from 'react';

/**
 * Hook untuk mengetahui apakah client sudah siap
 * Gunakan untuk conditional rendering yang berbeda di SSR vs client
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook untuk safe window/document access
 * Mengembalikan default value saat SSR, actual value saat client
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: globalThis.window?.innerWidth ?? 1024,
    height: globalThis.window?.innerHeight ?? 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: globalThis.window?.innerWidth ?? 1024,
        height: globalThis.window?.innerHeight ?? 768,
      });
    };

    globalThis.window?.addEventListener('resize', handleResize);
    return () => globalThis.window?.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * Hook untuk responsive breakpoint detection
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (globalThis.window === undefined) return;

    const media = globalThis.window.matchMedia(query);
    
    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }

    return () => {};
  }, [matches]);

  return matches;
}

/**
 * Hook untuk detect mobile device
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/**
 * Component wrapper untuk SSR-safe content
 * Render fallback di server, actual content di client
 */
interface HydrationBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

export function HydrationBoundary({ fallback, children }: HydrationBoundaryProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return fallback ?? null;
  }

  return <>{children}</>;
}

/**
 * Defer state update sampai client hydration selesai
 * Berguna untuk state yang bergantung pada window/document
 */
export function useDeferredClientState<T>(
  initialValue: T,
  getClientValue: () => T,
): T {
  const [value, setValue] = useState(initialValue);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      setValue(getClientValue());
    }
  }, [isClient, getClientValue]);

  return value;
}

/**
 * Safe localStorage access yang mencegah hydration error
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState(initialValue);
  const isClient = useIsClient();

  // Load dari localStorage di client-side
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Failed to read localStorage key "${key}":`, error);
    }
  }, [key, isClient]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Failed to write localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Effect yang hanya berjalan di client-side
 * Berguna untuk side effects yang tidak perlu di SSR
 */
export function useClientEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
) {
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      return effect();
    }
  }, [isClient, ...(deps || [])]);
}

/**
 * Safe document access dengan proper cleanup
 */
export function useDocumentMutation(
  callback: () => () => void,
  deps?: React.DependencyList,
) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    return callback();
  }, deps);
}

/**
 * Prevent body scroll (for modals, etc.)
 */
export function usePreventScroll(prevent: boolean) {
  useEffect(() => {
    if (!prevent) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalHTMLOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHTMLOverflow;
    };
  }, [prevent]);
}

/**
 * Safe scroll listener dengan proper cleanup
 */
export function useScrollListener(
  callback: (scrollY: number) => void,
  options: { debounce?: number } = {},
) {
  const { debounce = 0 } = options;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);

      if (debounce > 0) {
        timeoutId = setTimeout(
          () => callback(window.scrollY),
          debounce,
        );
      } else {
        callback(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [callback, debounce]);
}
