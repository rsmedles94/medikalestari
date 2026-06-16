"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, PhoneCall, MapPin } from "lucide-react";
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

  // KUSTOMISASI: Ganti teks di bawah ini dengan nama Rumah Sakit / Lokasi Anda
  const lokasiRumahSakit =
    "Rumah Sakit Umum Pusat Nasional Dr. Cipto Mangunkusumo (RSCM)";
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(lokasiRumahSakit)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

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
        <div className="bg-white p-6 md:p-10 text-center mb-8 border border-slate-200">
          <h1 className="text-2xl md:text-5xl font-semibold text-slate-950 tracking-tight mb-2">
            Instalasi Gawat Darurat (IGD)
          </h1>
          <p className="text-slate-600 max-w-lg mx-auto text-sm md:text-base mb-8">
            Jika Anda atau orang di sekitar Anda mengalami kondisi medis kritis,
            segera hubungi nomor di bawah ini atau datang langsung ke IGD kami.
          </p>

          {/* Tombol Kontak Darurat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <button
              onClick={() => handleCallEmergency("+6281210601963")}
              className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white py-4 px-6 font-bold text-md active:bg-red-700 transition-colors duration-700 cursor-pointer rounded-md"
            >
              <PhoneCall size={22} />
              Instalasi Gawat Darurat
            </button>

            <button
              onClick={handleWhatsAppEmergency}
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-4 px-6 font-bold text-md active:bg-green-700 transition-colors duration-700 cursor-pointe rounded-md  cursor-pointer"
            >
              <Image
                src="/images/icons/whatsapp-fill.svg"
                alt="WhatsApp"
                width={30}
                height={30}
                style={{ filter: "invert(1)" }}
              />
              Customer Care
            </button>
          </div>
        </div>

        {/* MAPS SECTION (BESAR & RESPONSIF) */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4"></div>

          {/* Kontainer Peta dengan Tailwind Utility */}
          <div className="w-full h-[450px] md:h-[550px] overflow-hidden border border-slate-200 shadow-md mb-5 md:mb-5">
            <iframe
              title="Google Maps Lokasi Rumah Sakit"
              src={embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Catatan Kaki Alur Medis */}
        <div className="bg-slate-100 p-6 sm:p-5 border border-slate-200 text-center md:text-left md:flex md:items-center md:justify-between gap-4 mb-12">
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
