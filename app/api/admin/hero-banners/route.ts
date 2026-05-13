import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * API route untuk mengelola hero banners
 * Menggunakan service role key untuk bypass RLS di production
 */

function getAdminClient() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const normalized = raw?.replace(/\/+$/g, "")?.replace(/\/rest\/v1$/i, "");

  if (!normalized) {
    console.error("[hero-banners] invalid NEXT_PUBLIC_SUPABASE_URL", { raw });
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set or invalid");
  }

  if (!supabaseServiceKey) {
    console.error("[hero-banners] SUPABASE_SERVICE_ROLE_KEY missing");
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createClient(normalized, supabaseServiceKey);
}

function getPublicClient() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const normalized = raw?.replace(/\/+$/g, "")?.replace(/\/rest\/v1$/i, "");

  if (!normalized || !supabaseAnonKey) {
    console.error("[hero-banners-public] Missing Supabase env", { raw });
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(normalized, supabaseAnonKey);
}

// GET - Fetch hero banners (public read)
export async function GET(request: Request) {
  try {
    const publicClient = getPublicClient();
    const { searchParams } = new URL(request.url);
    const deviceType = searchParams.get("device_type");

    let query = publicClient
      .from("hero_banners")
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (deviceType) {
      query = query.eq("device_type", deviceType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching hero banners:", error);
      return NextResponse.json(
        {
          error: "Gagal mengambil banner",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Error in GET /api/admin/hero-banners:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminClient = getAdminClient();

    const body = await request.json();
    const { image_url, order, is_active, device_type } = body;

    // Validate required fields
    if (!image_url || device_type === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "image_url dan device_type harus disediakan",
        },
        { status: 400 },
      );
    }

    const { data, error } = await adminClient
      .from("hero_banners")
      .insert([
        {
          image_url,
          order: order || 0,
          is_active: is_active !== false,
          device_type,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating hero banner:", error);
      return NextResponse.json(
        {
          error: "Gagal membuat banner",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data?.[0],
    });
  } catch (error) {
    console.error("Error in POST /api/admin/hero-banners:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const adminClient = getAdminClient();
    const body = await request.json();
    const { id, image_url, order, is_active, device_type } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "Missing ID",
          details: "Banner ID harus disediakan",
        },
        { status: 400 },
      );
    }

    const { data, error } = await adminClient
      .from("hero_banners")
      .update({
        image_url,
        order,
        is_active,
        device_type,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating hero banner:", error);
      return NextResponse.json(
        {
          error: "Gagal mengupdate banner",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data?.[0],
    });
  } catch (error) {
    console.error("Error in PUT /api/admin/hero-banners:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const adminClient = getAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error: "Missing ID",
          details: "Banner ID harus disediakan",
        },
        { status: 400 },
      );
    }

    const { error } = await adminClient
      .from("hero_banners")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting hero banner:", error);
      return NextResponse.json(
        {
          error: "Gagal menghapus banner",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Banner berhasil dihapus",
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/hero-banners:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
