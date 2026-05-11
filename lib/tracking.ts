// Analytics feature disabled - requires Vercel Pro
// import { supabase } from "./supabase";

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

export async function trackEvent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _eventType: EventType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _metadata?: Metadata,
) {
  // Analytics feature disabled - requires Vercel Pro
  // try {
  //   // Client-side tracking via API
  //   const response = await fetch("/api/admin/analytics", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       event_type: eventType,
  //       event_name: eventName,
  //       page_path: getWindowPath(),
  //       metadata: metadata || {},
  //     }),
  //   });

  //   if (!response.ok) {
  //     console.warn(
  //       `Track API error: ${response.status} ${response.statusText}`,
  //     );
  //   }
  // } catch (err) {
  //   console.error("Error tracking event:", err);
  // }
}

export async function trackPageView(pagePath: string) {
  await trackEvent("page_view", pagePath, {
    userAgent: getUserAgent(),
  });
}

export async function trackButtonClick(buttonName: string, pagePath?: string) {
  await trackEvent("button_click", buttonName, {
    page: pagePath || getWindowPath(),
  });
}
