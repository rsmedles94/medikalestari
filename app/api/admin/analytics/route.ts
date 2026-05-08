import { NextRequest, NextResponse } from "next/server";
import {
  getVisitorStats,
  getPageViews,
  getButtonClicks,
  type Period,
} from "./page-views";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "stats";
  const period = (searchParams.get("period") || "all") as Period;

  try {
    if (type === "stats") {
      const stats = await getVisitorStats();
      return NextResponse.json(stats);
    } else if (type === "pages") {
      const pages = await getPageViews(period);
      return NextResponse.json(pages);
    } else if (type === "clicks") {
      const clicks = await getButtonClicks(period);
      return NextResponse.json(clicks);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, event_name, page_path, metadata } = body;

    if (!event_type || !event_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("analytics_events").insert({
      event_type,
      event_name,
      page_path,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track API error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 },
    );
  }
}
