import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("careers_config")
      .select("*")
      .limit(1);

    const defaultConfig = {
      id: randomUUID(),
      form_title: "Bergabunglah dengan Tim Kami",
      form_description: "Kami mencari profesional berbakat",
      criteria: [],
      position_photos: [],
      phone_number: "082246232527",
      is_form_active: true,
      banner_image_url: null,
    };

    if (error) {
      console.error("Error fetching config:", error.message);
      return NextResponse.json(defaultConfig);
    }

    if (!data || data.length === 0) {
      return NextResponse.json(defaultConfig);
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    console.log("=== PUT /api/careers/config ===");
    console.log("Request body:", JSON.stringify(body, null, 2));

    // Validasi id harus ada
    if (!body.id) {
      console.error("ERROR: No ID provided");
      return NextResponse.json(
        { error: "ID harus disediakan" },
        { status: 400 },
      );
    }

    // Pisahkan id dari data update agar primary key tidak ikut ter-update
    const { id, ...updateData } = body;

    console.log("Update ID:", id);
    console.log("Update Data:", JSON.stringify(updateData, null, 2));

    const { data, error } = await supabase
      .from("careers_config")
      .upsert([{ id, ...updateData }], { onConflict: "id" })
      .select();

    console.log("Supabase response - error:", error);
    console.log("Supabase response - data:", data);

    if (error) {
      console.error("SUPABASE ERROR:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      return NextResponse.json(
        {
          error: "Gagal menyimpan konfigurasi",
          details: error.message,
          hint: error.hint,
        },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      console.error("ERROR: No data returned from upsert");
      return NextResponse.json(
        { error: "Data tidak ditemukan setelah penyimpanan" },
        { status: 500 },
      );
    }

    console.log("SUCCESS: Config saved:", data[0]);
    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error("=== EXCEPTION ===", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal menyimpan konfigurasi", details: errorMessage },
      { status: 500 },
    );
  }
}
