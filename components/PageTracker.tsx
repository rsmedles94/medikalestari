"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/tracking";

export function PageTracker({ pagePath }: { pagePath: string }) {
  useEffect(() => {
    trackPageView(pagePath);
  }, [pagePath]);

  return null;
}
