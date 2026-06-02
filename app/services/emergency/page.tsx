"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  PhoneCall,
  MapPin,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function Emergency() {
  // Fungsi untuk melakukan panggilan telepon langsung ketika di-klik di mobile
  const handleCallEmergency = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Fungsi untuk navigate ke WhatsApp
  const handleWhatsAppEmergency = () => {
    const message = `Saya memerlukan bantuan gawat darurat. Mohon segera hubungi saya.`;
    const link = getWhatsAppLink(message);
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* BREADCRUMB & TITLE SECTION */}
      <div className="max-w-[1106px] mx-auto px-4 md:px-0 pt-8 md:pt-16 pb-6">
        <nav className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-4">
          <Link
            href="/"
            className="text-black/60 hover:text-gray-300 transition-colors"
          >
            Beranda
          </Link>
          <ChevronRight size={12} className="text-black/60" />
          <span className="font-normal">Emergency</span>
        </nav>
      </div>

      {/* Konten Utama */}
      <main className="max-w-[1106px] mx-auto px-4 md:px-0 pb-16">
        {/* Banner Utama - Panggilan Darurat */}
        <div className="bg-white  p-6 md:p-10 text-center mb-8 border border-slate-200">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-950 tracking-tight mb-2">
            Instalasi Gawat Darurat (IGD)
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto text-sm md:text-base mb-8">
            Jika Anda atau orang di sekitar Anda mengalami kondisi medis kritis,
            segera hubungi nomor di bawah ini atau datang langsung ke IGD kami.
          </p>

          {/* Tombol Kontak Darurat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => handleCallEmergency("(021) 584 4521")}
              className="flex items-center justify-center gap-3 bg-red-600 text-white py-4 px-6 rounded-xl font-semibold text-md active:bg-red-700 transition-colors cursor-pointer"
            >
              <PhoneCall size={22} />
              IGD : +62 8121 0601 963
            </button>

            <button
              onClick={handleWhatsAppEmergency}
              className="flex items-center justify-center gap-3 bg-green-500 text-white py-4 px-6 rounded-xl font-semibold text-md active:bg-green-700 transition-colors cursor-pointer"
            >
              <Image
                src="/images/icons/whatsapp-fill.svg"
                alt="WhatsApp"
                width={30}
                height={30}
                style={{ filter: "invert(1)" }}
              />
              Chat WhatsApp
            </button>
          </div>
        </div>

        {/* Info Alur & Panduan Singkat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Lokasi */}
          <div className="bg-white p-6 sm:p-5 border border-slate-200">
            <div className="text-red-600 mb-3">
              <MapPin size={24} />
            </div>
            <h3 className="font-semibold text-base mb-1">Lokasi IGD</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jl. HOS Cokroaminoto No.1, Ciledug, Tangerang
            </p>
          </div>

          {/* Card 2: Waktu Operasional */}
          <div className="bg-white p-6 sm:p-5 border border-slate-200">
            <div className="text-red-600 mb-3">
              <Clock size={24} />
            </div>
            <h3 className="font-semibold text-base mb-1">24 Jam / 7 Hari</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Selalu siap melayani hari libur nasional maupun akhir pekan tanpa
              gangguan.
            </p>
          </div>

          {/* Card 3: Prosedur Triage */}
          <div className="bg-white p-6 sm:p-5 border border-slate-200">
            <div className="text-red-600 mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-semibold text-base mb-1">Sistem Triage</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pasien ditangani berdasarkan tingkat keparahan kondisi medis,
              bukan waktu kedatangan.
            </p>
          </div>
        </div>

        {/* Catatan Kaki Alur Medis */}
        <div className="bg-slate-100 p-6 sm:p-5 border border-slate-200 text-center md:text-left md:flex md:items-center md:justify-between gap-4 mb-20 md:mb-0">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-1">
              Siapkan Informasi Ini Saat Menghubungi Kami:
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nama pasien, keluhan utama (misal: nyeri dada, sesak napas berat,
              tidak sadar), serta alamat lokasi penjemputan yang jelas.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
