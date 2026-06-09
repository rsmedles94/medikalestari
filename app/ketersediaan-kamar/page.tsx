"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, Hotel } from "lucide-react"; // Pastikan lucide-react terinstall

export default function KetersediaanKamarPage() {
  const siranapUrl =
    "https://keslan.kemkes.go.id/app/siranap/tempat_tidur?kode_rs=3603182&jenis=2&propinsi=36prop&kabkota=3603";

  return (
    <main className="min-h-screen bg-white pb-28 md:pb-0">
      <div className="max-w-[1139px] w-full mx-auto px-4">
        {/* Breadcrumb */}
        <div className="pt-8 md:pt-16 pb-2 md:pb-4">
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
            <span className="font-normal text-gray-400">
              Ketersediaan Kamar
            </span>
          </nav>
        </div>

        {/* Page Title */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#001e3d] mb-4">
            Ketersediaan Kamar
          </h1>
        </header>

        {/* Info Card */}
        <div className="max-w-2xl border border-gray-100 bg-gradient-to-br from-slate-50 to-white p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl text-[#001e3d] mb-6">
            <Hotel size={24} />
          </div>

          <h2 className="text-xl font-bold text-[#001e3d] mb-3">
            Lihat Data Real-Time SIRANAP
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Untuk menjaga keamanan dan keakuratan data, informasi ketersediaan
            tempat tidur (bed) rumah sakit diintegrasikan langsung melalui
            sistem resmi <strong>SIRANAP Kemenkes RI</strong>. Silakan klik
            tombol di bawah untuk melihat rincian kamar yang tersedia saat ini.
          </p>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-400 text-center sm:text-left">
              *Anda akan diarahkan ke situs resmi keslan.kemkes.go.id
            </div>

            <a
              href={siranapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#003f88] hover:bg-[#e67e22] text-white font-medium text-sm group"
            >
              Cek Ketersediaan Kamar
              <ExternalLink
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
