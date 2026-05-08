import { createServerSupabaseClient } from "@/lib/supabase";

export type Period = "today" | "week" | "month" | "all";

interface EventCount {
  event_name: string;
  count: number;
}

const getDateRange = (period: Period): { from: Date; to: Date } => {
  const to = new Date();
  const from = new Date();

  switch (period) {
    case "today":
      from.setHours(0, 0, 0, 0);
      break;
    case "week":
      from.setDate(from.getDate() - 7);
      break;
    case "month":
      from.setMonth(from.getMonth() - 1);
      break;
    case "all":
      from.setFullYear(2000); // Very old date
      break;
  }

  return { from, to };
};

export async function getPageViews(
  period: Period = "all",
): Promise<EventCount[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { from, to } = getDateRange(period);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_name")
      .eq("event_type", "page_view")
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString());

    if (error) throw error;

    // Group by event_name and count
    const grouped = data.reduce(
      (acc: Record<string, number>, item: { event_name: string }) => {
        acc[item.event_name] = (acc[item.event_name] || 0) + 1;
        return acc;
      },
      {},
    );

    return Object.entries(grouped)
      .map(([event_name, count]) => ({ event_name, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error fetching page views:", error);
    return [];
  }
}

export async function getVisitorStats() {
  try {
    const supabase = createServerSupabaseClient();

    // Helper function to count events in a date range
    const countEvents = async (period: Period) => {
      const { from, to } = getDateRange(period);
      const { count, error } = await supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "page_view")
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString());

      if (error) {
        console.error(`Error counting ${period} events:`, error);
        return 0;
      }
      return count || 0;
    };

    const [today, week, month, total] = await Promise.all([
      countEvents("today"),
      countEvents("week"),
      countEvents("month"),
      countEvents("all"),
    ]);

    return { today, week, month, total };
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return { today: 0, week: 0, month: 0, total: 0 };
  }
}

export async function getButtonClicks(
  period: Period = "all",
): Promise<EventCount[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { from, to } = getDateRange(period);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_name")
      .eq("event_type", "button_click")
      .gte("created_at", from.toISOString())
      .lte("created_at", to.toISOString());

    if (error) throw error;

    // Group by event_name and count
    const grouped = data.reduce(
      (acc: Record<string, number>, item: { event_name: string }) => {
        acc[item.event_name] = (acc[item.event_name] || 0) + 1;
        return acc;
      },
      {},
    );

    return Object.entries(grouped)
      .map(([event_name, count]) => ({ event_name, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error fetching button clicks:", error);
    return [];
  }
}
