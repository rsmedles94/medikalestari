import { createServerSupabaseClient } from "@/lib/supabase";

export type Period = "today" | "week" | "month" | "all";

interface EventCount {
  event_name: string;
  count: number;
}

const getDateRange = (period: Period): { from: string; to: string } => {
  const now = new Date();

  // Gunakan timezone lokal server, bukan UTC
  // untuk match dengan waktu user yang mengakses dari berbagai timezone

  let from = new Date(now);

  switch (period) {
    case "today":
      // Mulai dari jam 00:00:00 hari ini
      from.setHours(0, 0, 0, 0);
      break;
    case "week":
      // 7 hari terakhir
      from.setDate(from.getDate() - 7);
      from.setHours(0, 0, 0, 0);
      break;
    case "month":
      // 30 hari terakhir
      from.setDate(from.getDate() - 30);
      from.setHours(0, 0, 0, 0);
      break;
    case "all":
      // Semua data
      from = new Date("2020-01-01");
      break;
  }

  // Pastikan end date adalah akhir hari ini
  const to = new Date(now);
  to.setHours(23, 59, 59, 999);

  console.log(`[Analytics] Date range for period "${period}":`, {
    from: from.toISOString(),
    to: to.toISOString(),
    fromLocal: from.toString(),
    toLocal: to.toString(),
  });

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
};

export async function getPageViews(
  period: Period = "all",
): Promise<EventCount[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { from, to } = getDateRange(period);

    console.log(`[Analytics] Fetching page views for period: ${period}`);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_name", { count: "exact" })
      .eq("event_type", "page_view")
      .gte("created_at", from)
      .lte("created_at", to);

    if (error) {
      console.error("[Analytics] Error fetching page views:", error);
      throw error;
    }

    // Group by event_name and count
    const grouped = data.reduce(
      (acc: Record<string, number>, item: { event_name: string }) => {
        acc[item.event_name] = (acc[item.event_name] || 0) + 1;
        return acc;
      },
      {},
    );

    const result = Object.entries(grouped)
      .map(([event_name, count]) => ({ event_name, count }))
      .sort((a, b) => b.count - a.count);

    console.log(`[Analytics] Page views found: ${result.length}`);
    return result;
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
        .gte("created_at", from)
        .lte("created_at", to);

      if (error) {
        console.error(`[Analytics] Error counting ${period} events:`, error);
        return 0;
      }

      console.log(`[Analytics] ${period} page views: ${count || 0}`);
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

    console.log(`[Analytics] Fetching button clicks for period: ${period}`);

    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_name", { count: "exact" })
      .eq("event_type", "button_click")
      .gte("created_at", from)
      .lte("created_at", to);

    if (error) {
      console.error("[Analytics] Error fetching button clicks:", error);
      throw error;
    }

    // Group by event_name and count
    const grouped = data.reduce(
      (acc: Record<string, number>, item: { event_name: string }) => {
        acc[item.event_name] = (acc[item.event_name] || 0) + 1;
        return acc;
      },
      {},
    );

    const result = Object.entries(grouped)
      .map(([event_name, count]) => ({ event_name, count }))
      .sort((a, b) => b.count - a.count);

    console.log(`[Analytics] Button clicks found: ${result.length}`);
    return result;
  } catch (error) {
    console.error("Error fetching button clicks:", error);
    return [];
  }
}
