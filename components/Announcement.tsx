"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface AnnouncementProps {
  isVisible: boolean;
  onClose: () => void;
}

export const Announcement: React.FC<AnnouncementProps> = ({
  isVisible,
  onClose,
}) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Jeda 1 detik (1000ms) sebelum animasi turun dimulai
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <aside
      className={`hero-announcement hidden sm:flex absolute inset-x-0 top-14 lg:top-16 xl:top-12 z-[9999] h-8 w-full items-center overflow-hidden bg-[#003f88] text-white transition-all duration-300 ease-out transform ${
        showAnimation
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }`}
      style={{
        zIndex: 9999,
      }}
      aria-label="Pengumuman Penting Rumah Sakit"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between relative px-6 lg:px-8">
        {/* Track Marquee Area */}
        <div
          className="min-w-0 flex-1 overflow-hidden pr-12"
          aria-label="Informasi Rumah Sakit Medika Lestari"
        >
          <div
            className="hero-announcement-track items-center flex"
            role="marquee"
            aria-label="RS Medika Lestari buka setiap hari 24 jam. Alamat: Jalan HOS Cokroaminoto Nomor 56, Karang Tengah, Kota Tangerang, Banten 15151."
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center whitespace-nowrap py-1 text-xs md:text-sm font-medium tracking-wide"
                aria-hidden={copy === 1}
              >
                <span className="mx-8 inline-flex items-center gap-2">
                  <span className="font-semibold">
                    RS Medika Lestari Buka 24 Jam Setiap Hari
                  </span>
                </span>
                <span className="mx-8 text-white/50" aria-hidden="true">
                  |
                </span>
                <span className="mx-8 inline-flex items-center gap-2">
                  <span className="font-semibold">Alamat:</span>
                  <span>
                    Jl. HOS Cokroaminoto No.56, RT.001/RW.012, Karang Timur,
                    Kec. Karang Tengah, Kota Tangerang, Banten 15151
                  </span>
                </span>
                <span className="mx-8 text-white/50" aria-hidden="true">
                  |
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button (Selalu di Kanan) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup informasi rumah sakit"
          title="Tutup"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-full w-11 shrink-0 items-center justify-center bg-[#003f88] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white cursor-pointer"
        >
          <X className="w-[22px] h-[22px]" strokeWidth={2} />
        </button>

        {/* Gradient Fade di sebelah kiri tombol tutup */}
        <span
          className="pointer-events-none absolute inset-y-0 right-11 z-[1] w-5 bg-gradient-to-l from-[#003f88] to-transparent"
          aria-hidden="true"
        />
      </div>
    </aside>
  );
};
