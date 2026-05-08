"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/tracking";

export function PageTracker({ pagePath }: { pagePath: string }) {
  useEffect(() => {
    // Skip tracking untuk halaman admin dan analytics debug
    if (
      pagePath.startsWith("/admin") ||
      pagePath.startsWith("/analytics-debug")
    ) {
      return;
    }

    // Track semua halaman public (termasuk home page)
    trackPageView(pagePath);
  }, [pagePath]);

  return null;
}
