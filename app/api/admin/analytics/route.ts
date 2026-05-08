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
    console.error("[Analytics GET] API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, event_name, page_path, session_id, metadata } = body;

    // Validasi required fields
    if (!event_type || !event_name) {
      console.warn("[Analytics POST] Missing required fields:", {
        event_type,
        event_name,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();
    const createdAt = new Date().toISOString();

    console.log("[Analytics POST] Inserting event:", {
      event_type,
      event_name,
      page_path,
      session_id,
      created_at: createdAt,
      metadata,
    });

    const { error } = await supabase.from("analytics_events").insert({
      event_type,
      event_name,
      page_path,
      session_id: session_id || "unknown",
      metadata: metadata || {},
      created_at: createdAt,
    });

    if (error) {
      console.error("[Analytics POST] Insert error:", error);
      throw error;
    }

    console.log("[Analytics POST] ✓ Event inserted successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Analytics POST] Track API error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 },
    );
  }
}
