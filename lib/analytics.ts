import React from "react";

/**
 * Utility untuk tracking analytics dari client side
 * Mengirim pageview dan button clicks ke API
 */

export const trackPageView = async (pageName: string) => {
  try {
    await fetch("/api/admin/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "pageView",
        page: pageName,
      }),
    });
  } catch (error) {
    console.error("Failed to track page view:", error);
  }
};

export const trackButtonClick = async (buttonName: string) => {
  try {
    await fetch("/api/admin/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "buttonClick",
        button: buttonName,
      }),
    });
  } catch (error) {
    console.error("Failed to track button click:", error);
  }
};

// Hook untuk auto-track page view di root layout
export const useTrackPageView = (pageName: string) => {
  React.useEffect(() => {
    trackPageView(pageName);
  }, [pageName]);
};
