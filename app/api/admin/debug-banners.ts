import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

/**
 * DEBUG ENDPOINT - Check hero banners status
 * GET /api/admin/debug-banners
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // Get all banners (regardless of is_active status)
    const { data: allBanners, error: allError } = await supabase
      .from("hero_banners")
      .select("*")
      .order("order", { ascending: true });

    if (allError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch banners",
          details: allError.message,
        },
        { status: 500 },
      );
    }

    // Get active banners only
    const { data: activeBanners, error: activeError } = await supabase
      .from("hero_banners")
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (activeError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch active banners",
          details: activeError.message,
        },
        { status: 500 },
      );
    }

    // Count by device type
    const desktopActive = (activeBanners || []).filter(
      (b) => b.device_type === "desktop",
    ).length;
    const mobileActive = (activeBanners || []).filter(
      (b) => b.device_type === "mobile",
    ).length;

    return NextResponse.json({
      success: true,
      summary: {
        totalBanners: (allBanners || []).length,
        activeBanners: (activeBanners || []).length,
        desktopActive,
        mobileActive,
      },
      allBanners: allBanners || [],
      activeBanners: activeBanners || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
