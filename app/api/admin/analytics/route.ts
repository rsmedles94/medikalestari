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
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Analytics API GET] Error:", {
      type,
      period,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Check if it's an environment variable error
    if (
      errorMessage.includes("SUPABASE_SERVICE_ROLE_KEY") ||
      errorMessage.includes("environment variable")
    ) {
      return NextResponse.json(
        {
          error:
            "Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY",
          details: errorMessage,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        details: errorMessage,
      },
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
        { error: "Missing required fields: event_type and event_name" },
        { status: 400 },
      );
    }

    const supabase = createServerSupabaseClient();
    const createdAt = new Date().toISOString();

    console.log("[Analytics Track] Inserting event:", {
      event_type,
      event_name,
      page_path,
      created_at: createdAt,
    });

    const { error } = await supabase.from("analytics_events").insert({
      event_type,
      event_name,
      page_path,
      metadata: metadata || {},
      created_at: createdAt,
    });

    if (error) {
      console.error("[Analytics Track] Insert error:", error);
      throw error;
    }

    console.log("[Analytics Track] Event inserted successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Analytics API POST] Error:", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (errorMessage.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        {
          error:
            "Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY",
          details: errorMessage,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to track event",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
