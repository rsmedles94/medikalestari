import { NextRequest, NextResponse } from "next/server";
import {
  getVisitorStats,
  getPageViews,
  getButtonClicks,
  type Period,
} from "./page-views";

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
