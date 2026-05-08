import { supabase } from "./supabase";

export type EventType = "page_view" | "button_click" | "form_submit";
export type Metadata = Record<
  string,
  string | number | boolean | null | undefined
>;

const getWindowPath = (): string | null => {
  if (globalThis.window === undefined) return null;
  return globalThis.window.location.pathname;
};

const getUserAgent = (): string | null => {
  if (globalThis.navigator === undefined) return null;
  return globalThis.navigator.userAgent;
};

// Get or create a unique session ID for this user
const getSessionId = (): string => {
  if (globalThis.window === undefined) return "unknown";

  const sessionKey = "_analytics_session_id";
  let sessionId = sessionStorage.getItem(sessionKey);

  if (!sessionId) {
    sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(sessionKey, sessionId);
  }

  return sessionId;
};

export async function trackEvent(
  eventType: EventType,
  eventName: string,
  metadata?: Metadata,
) {
  try {
    // Fallback timeout untuk memastikan tracking tidak hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("/api/admin/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        event_name: eventName,
        page_path: getWindowPath(),
        session_id: getSessionId(),
        metadata: metadata || {},
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `[Track] API error: ${response.status} ${response.statusText}`,
      );
    } else {
      console.log(`[Track] ✓ ${eventType}: ${eventName}`);
    }
  } catch (err) {
    console.error("[Track] Error:", err);
    // Jangan gagal silent - log ke console untuk debugging
  }
}

export async function trackPageView(pagePath: string) {
  await trackEvent("page_view", pagePath, {
    userAgent: getUserAgent(),
    timestamp: new Date().toISOString(),
  });
}

export async function trackButtonClick(buttonName: string, pagePath?: string) {
  await trackEvent("button_click", buttonName, {
    page: pagePath || getWindowPath(),
    timestamp: new Date().toISOString(),
  });
}
