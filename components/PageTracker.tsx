"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/tracking";

export function PageTracker({ pagePath }: { pagePath: string }) {
  useEffect(() => {

    if (
      pagePath.startsWith("/admin") ||
      pagePath.startsWith("/analytics-debug") ||
      pagePath === "/"
    ) {
      return;
    }

    trackPageView(pagePath);
  }, [pagePath]);

  return null;
}
