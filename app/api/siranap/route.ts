import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface SiranapResponse {
  html: string;
}

interface ErrorResponse {
  error: string;
}

export async function GET(): Promise<
  NextResponse<SiranapResponse | ErrorResponse>
> {
  const siranapUrl =
    "https://keslan.kemkes.go.id/app/siranap/tempat_tidur?kode_rs=3603182&jenis=2&propinsi=36prop&kabkota=3603";

  try {
    const response = await fetch(siranapUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 120 }, // Turunkan cache jadi 2 menit agar lebih real-time
    });

    if (!response.ok) {
      throw new Error(
        `Gagal mengambil data dari SIRANAP (Status: ${response.status})`,
      );
    }

    const htmlText = await response.text();
    const $ = cheerio.load(htmlText);

    let combinedHtml = "";

    // JIKA DATA BERUPA BANYAK CARD:
    // Kita looping SEMUA elemen kelas '.card' lalu gabungkan kodenya
    const cards = $(".card");
    if (cards.length > 0) {
      cards.each((_, element) => {
        // Tambahkan pembungkus div margin-bottom agar antar card ada jarak saat dirender
        combinedHtml += `<div class="siranap-card-wrapper mb-6">${$(element).html()}</div>`;
      });
    }
    // JIKA DATA BERUPA TABEL:
    else {
      const tables = $("table");
      tables.each((_, element) => {
        combinedHtml += `<div class="siranap-table-wrapper mb-6">${$(element).html()}</div>`;
      });
    }

    // Jika setelah digabung masih kosong, fallback ke selector bodi utama
    if (!combinedHtml) {
      combinedHtml = $(".content").html() || $("#main-content").html() || "";
    }

    if (!combinedHtml) {
      return NextResponse.json(
        { error: "Struktur data kamar tidak ditemukan pada halaman SIRANAP." },
        { status: 404 },
      );
    }

    return NextResponse.json({ html: combinedHtml });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan internal pada server";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
