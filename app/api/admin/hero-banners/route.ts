import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * API route untuk mengelola hero banners
 * Menggunakan service role key untuk bypass RLS di production
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create admin client dengan service role key
const adminClient = createClient(supabaseUrl || "", supabaseServiceKey || "");

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          details: "SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di environment",
        },
        { status: 500 },
      );
    }

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
