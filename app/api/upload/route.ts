import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;

    if (!file || !path) {
      return NextResponse.json(
        { error: "File and path are required" },
        { status: 400 },
      );
    }

    // Validasi ukuran file
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    const bucketName = "uploads";
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase service role configuration for upload");
      return NextResponse.json(
        {
          error:
            "Supabase configuration error: SUPABASE_SERVICE_ROLE_KEY wajib di-set untuk upload",
        },
        { status: 500 },
      );
    }

    // Selalu pakai service role key untuk upload (bypass RLS).
    // Bucket 'uploads' harus sudah dibuat manual sekali di Supabase Dashboard
    // (Storage → New bucket → nama "uploads" → set Public).
    const uploadClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await uploadClient.storage
      .from(bucketName)
      .upload(path, uint8Array, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", {
        message: error.message,
        name: error.name,
      });

      if (error.message.includes("Bucket not found")) {
        return NextResponse.json(
          {
            error:
              "Bucket 'uploads' belum dibuat. Buat manual di Supabase Dashboard → Storage → New bucket (public).",
            details: error.message,
          },
          { status: 500 },
        );
      }

      if (error.message.includes("row-level security")) {
        return NextResponse.json(
          {
            error:
              "RLS Policy error saat upload. Pastikan service role key digunakan (bukan anon key).",
            details: error.message,
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          error: `Upload failed: ${error.message}`,
        },
        { status: 500 },
      );
    }

    if (!data) {
      console.error("No data returned from upload");
      return NextResponse.json(
        { error: "No data returned from upload" },
        { status: 500 },
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = uploadClient.storage.from(bucketName).getPublicUrl(data.path);

    console.log("Upload success:", { path: data.path, url: publicUrl });
    return NextResponse.json({ url: publicUrl, path: data.path });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 },
    );
  }
}
