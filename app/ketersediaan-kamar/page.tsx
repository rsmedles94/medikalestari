"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, RefreshCw, Loader2 } from "lucide-react";

// Tipe data yang dicocokkan dengan API Route internal
interface SiranapData {
  html: string;
}

interface ApiErrorResponse {
  error: string;
}

export default function KetersediaanKamarPage() {
  const siranapUrl =
    "https://keslan.kemkes.go.id/app/siranap/tempat_tidur?kode_rs=3603182&jenis=2&propinsi=36prop&kabkota=3603";

  const [tableHtml, setTableHtml] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Menggunakan useCallback agar fungsi stabil dan tidak memicu re-render di useEffect
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/siranap");

      if (!res.ok) {
        const errorData = (await res.json()) as ApiErrorResponse;
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = (await res.json()) as SiranapData;
      setTableHtml(data.html);
    } catch (err: unknown) {
      // Perbaikan Type-Safe tanpa 'any' untuk menghilangkan garis merah error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memuat data dari server");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="min-h-screen bg-white pb-28 md:pb-12">
      <div className="max-w-[1139px] w-full mx-auto px-4">
        {/* Breadcrumb */}
        <div className="pt-8 md:pt-17 pb-2 md:pb-4">
          <nav
            className="flex items-center gap-1 text-[14px] font-normal mb-8"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-black/60 hover:text-gray-400 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight
              size={12}
              className="text-black/60"
              aria-hidden="true"
            />
            <span className="font-normal text-gray-300">
              Ketersediaan Kamar
            </span>
          </nav>
        </div>

        {/* Page Title & Action */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#001e3d] mb-2">
              Ketersediaan Kamar
            </h1>
            <p className="text-sm text-gray-500">
              Data diambil dari website resmi SIRANAP Kemenkes RI, silahkan refresh untuk melihat data ketersediaan kamar terbaru.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh Data
            </button>
            <a
              href={siranapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#003f88] hover:bg-[#e67e22] text-white font-medium text-sm transition-colors"
            >
              Lihat Situs Resmi
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        {/* Area Penampilan Data (Sudah dihapus rounded dan shadow) */}
        <div className="w-full border border-gray-200 p-4 md:p-6 bg-white min-h-[300px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 size={32} className="animate-spin text-[#003f88]" />
              <p className="text-sm font-medium">
                Sedang mengambil data real-time...
              </p>
            </div>
          ) : error ? (
            <div className="text-center p-6">
              <p className="text-red-500 font-medium mb-2">Gagal Memuat Data</p>
              <p className="text-sm text-gray-500 mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="text-sm text-[#003f88] underline font-semibold cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            /* RENDER DATA CLEAN SCRAPING + TAILWIND INLINE STYLING (Sudah flat tanpa rounded/shadow) */
            <div
              className="siranap-clean-table overflow-x-auto w-full
                         [&_table]:w-full [&_table]:border-collapse [&_table]:my-2
                         [&_th]:bg-slate-50 [&_th]:text-[#001e3d] [&_th]:p-4 [&_th]:text-sm [&_th]:font-semibold [&_th]:border-b-2 [&_th]:border-slate-200 [&_th]:text-left
                         [&_td]:p-4 [&_td]:text-sm [&_td]:text-slate-600 [&_td]:border-b [&_td]:border-slate-100 [&_td]:vertical-middle
                         [&_tr:hover]:bg-slate-50/80
                         [&_.siranap-card-wrapper]:bg-white [&_.siranap-card-wrapper]:border [&_.siranap-card-wrapper]:border-slate-100 [&_.siranap-card-wrapper]:p-5"
              dangerouslySetInnerHTML={{ __html: tableHtml }}
            />
          )}
        </div>
      </div>
    </main>
  );
}
