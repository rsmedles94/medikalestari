import React from "react";
import { trackPageView as track } from "./tracking";

// Re-export tracking functions for backward compatibility
export { trackPageView, trackButtonClick } from "./tracking";

// Hook untuk auto-track page view
export const useTrackPageView = (pageName: string) => {
  React.useEffect(() => {
    track(pageName);
  }, [pageName]);
};
