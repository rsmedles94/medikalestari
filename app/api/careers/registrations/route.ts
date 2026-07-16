import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    // Validasi field wajib
    const requiredFields = [
      "full_name",
      "email",
      "phone",
      "position",
      "education",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    const registrationData = {
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      position: body.position,
      education: body.education,
      experience_years: body.experience_years || 0,
      criteria_fields: body.criteria_fields || {},
      resume_url: body.resume_url || null,
      whatsapp_link: body.whatsapp_link || null,
    };

    console.log("Inserting registration data:", registrationData);

    const { data, error } = await supabase
      .from("career_registrations")
      .insert([registrationData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error.message, error.details);
      return NextResponse.json(
        {
          error: "Gagal menyimpan data",
          details: error.message,
        },
        { status: 500 },
      );
    }

    console.log("Registration saved successfully:", data.id);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal menyimpan data", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("career_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch registrations" },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID diperlukan untuk menghapus data" },
        { status: 400 },
      );
    }

    console.log("Deleting registration with ID:", id);

    const { data, error, count } = await supabase
      .from("career_registrations")
      .delete()
      .eq("id", id)
      .select();

    console.log("Delete result:", { data, error, count });

    if (error) {
      console.error("Supabase error:", error.message, error.code);
      return NextResponse.json(
        {
          error: "Gagal menghapus data",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      console.warn("No record found with ID:", id);
      return NextResponse.json(
        {
          error: "Data tidak ditemukan",
          details: "ID tidak sesuai atau data sudah dihapus",
        },
        { status: 404 },
      );
    }

    console.log("Successfully deleted registration with ID:", id);
    return NextResponse.json(
      { success: true, message: "Pendaftar berhasil dihapus", deleted_id: id },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal menghapus data", details: errorMessage },
      { status: 500 },
    );
  }
}
