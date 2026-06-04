/**
 * useOptimizedAnimation Hook - Smooth animations tanpa blocking touch interaction
 * Menggunakan requestAnimationFrame untuk smooth 60fps animations
 * dan pointer events untuk responsive touch
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AnimationOptions {
  duration: number; // ms
  easing?: "ease" | "linear" | "easeIn" | "easeOut" | "easeInOut";
  onComplete?: () => void;
}

const easingFunctions = {
  linear: (t: number): number => t,
  easeIn: (t: number): number => t * t,
  easeOut: (t: number): number => t * (2 - t),
  easeInOut: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  ease: (t: number): number => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

export function useOptimizedAnimation(options: AnimationOptions): {
  progress: number;
  isAnimating: boolean;
  stop: () => void;
} {
  const { duration, easing = "ease", onComplete } = options;
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const easeFn = easingFunctions[easing];

  useEffect(() => {
    if (!isAnimating) return;

    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    }

    const animationFrame = (currentTime: number): void => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }
      const elapsed = currentTime - startTimeRef.current;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeFn(rawProgress);

      setProgress(easedProgress);

      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animationFrame);
      } else {
        setIsAnimating(false);
        startTimeRef.current = null;
        onComplete?.();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animationFrame);
  }, [isAnimating, duration, easeFn, onComplete]);

  const stop = useCallback((): void => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsAnimating(false);
    setProgress(0);
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return { progress, isAnimating, stop };
}

/**
 * Hook untuk carousel/slide animation yang responsive terhadap touch
 * Menggunakan transform3d untuk GPU acceleration dan smooth scrolling
 */
export function useCarouselAnimation(
  itemCount: number,
  options: Partial<AnimationOptions> = {},
): {
  currentIndex: number;
  transform: string;
  animate: (toIndex: number) => Promise<void>;
  canInteract: boolean;
} {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const { duration = 300, easing = "easeInOut" } = options;
  const { progress, isAnimating } = useOptimizedAnimation({
    duration,
    easing,
  });

  const easeFn = easingFunctions[easing || "easeInOut"];

  let displayIndex = currentIndex;
  if (nextIndex !== null) {
    const direction = nextIndex > currentIndex ? 1 : -1;
    const distance = Math.abs(nextIndex - currentIndex);
    const shortestDistance = Math.min(distance, itemCount - distance);
    displayIndex =
      (currentIndex + shortestDistance * direction * easeFn(progress)) %
      itemCount;
  }

  const transform = `translate3d(${-displayIndex * 100}%, 0, 0)`;

  const animate = useCallback(
    async (toIndex: number): Promise<void> => {
      if (isAnimating) return;

      setNextIndex(toIndex);

      return new Promise((resolve) => {
        const handleComplete = (): void => {
          setCurrentIndex(toIndex % itemCount);
          setNextIndex(null);
          resolve();
        };

        const timeoutId = setTimeout(handleComplete, duration);
        const originalOnComplete = options.onComplete;
        options.onComplete = () => {
          clearTimeout(timeoutId);
          originalOnComplete?.();
          handleComplete();
        };
      });
    },
    [isAnimating, itemCount, duration, options],
  );

  return {
    currentIndex,
    transform,
    animate,
    canInteract: !isAnimating,
  };
}
