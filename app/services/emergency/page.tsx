"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, PhoneCall } from "lucide-react";
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
      <header className="max-w-[1106px] mx-auto px-4 md:px-0 pt-8 md:pt-16 pb-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-4"
        >
          <Link
            href="/"
            className="text-black/60 hover:text-gray-300 transition-colors"
          >
            Beranda
          </Link>
          <ChevronRight size={12} className="text-black/60" />
          <span className="font-normal">Emergency</span>
        </nav>
      </header>

      {/* Konten Utama */}
      <main className="max-w-[1106px] mx-auto px-4 md:px-0 pb-16">
        {/* Banner Utama - Panggilan Darurat */}
        <section
          aria-labelledby="emergency-heading"
          className="bg-white p-6 md:p-10 text-center mb-8 border border-slate-200 rounded-lg shadow-sm"
        >
          <h1
            id="emergency-heading"
            className="text-2xl md:text-5xl font-semibold text-slate-950 tracking-tight mb-2"
          >
            Instalasi Gawat Darurat
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-sm md:text-base mb-8">
            Jika Anda atau orang di sekitar Anda mengalami kondisi medis kritis,
            segera hubungi nomor di bawah ini atau datang langsung ke IGD kami.
          </p>

          {/* button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => handleCallEmergency("+6281210601963")}
              className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-700 text-white py-4 px-7 font-bold text-md active:bg-rose-800 active:scale-95 transition-all duration-200 cursor-pointer rounded-full w-full sm:w-auto"
            >
              <PhoneCall size={22} />
              Nomer Darurat
            </button>

            <button
              type="button"
              onClick={handleWhatsAppEmergency}
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-700 text-white py-4 px-7 font-bold text-md active:bg-emerald-800 active:scale-95 transition-all duration-200 cursor-pointer rounded-full w-full sm:w-auto"
            >
              <Image
                src="/images/icons/whatsapp-fill.svg"
                alt="WhatsApp"
                width={30}
                height={30}
                style={{ filter: "invert(1)" }}
              />
              Whatsapp
            </button>
          </div>
        </section>

        {/* MAPS SECTION */}
        <section aria-labelledby="maps-heading" className="mt-8">
          <h2 id="maps-heading" className="sr-only">
            Lokasi Rumah Sakit
          </h2>

          <div className="w-full h-[450px] md:h-[550px] overflow-hidden border border-slate-200 shadow-md mb-5 md:mb-5 rounded-lg">
            <iframe
              title="Google Maps Lokasi Rumah Sakit"
              src={embedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        {/* Catatan Kaki Alur Medis */}
        <aside
          aria-label="Informasi yang perlu disiapkan"
          className="bg-slate-100 p-6 sm:p-5 border border-slate-200 text-center md:text-left md:flex md:items-center md:justify-between gap-4 mb-12 rounded-lg"
        >
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Siapkan Informasi Ini Saat Menghubungi Kami:
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nama pasien, keluhan utama (misal: nyeri dada, sesak napas berat,
              tidak sadar), serta alamat lokasi penjemputan yang jelas.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
