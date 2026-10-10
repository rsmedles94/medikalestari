"use client";

import React from "react";
import { X } from "lucide-react";

interface AnnouncementProps {
  isVisible: boolean;
  onClose: () => void;
}

export const Announcement: React.FC<AnnouncementProps> = ({
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    // Announcement Banner Container
    <div
      className="hero-announcement hidden sm:flex absolute inset-x-0 top-1/2 z-[9999] h-11 w-full -translate-y-1/2 items-center overflow-hidden bg-[#003f88] text-white sm:h-8"
      style={{
        position: "absolute",
        top: "11%",
        left: 0,
        right: 0,
        transform: "translateY(-50%)",
        zIndex: 9999,
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between relative px-4 sm:px-6 lg:px-8">
        <div
          className="min-w-0 flex-1 overflow-hidden pr-12"
          aria-label="Informasi Rumah Sakit Medika Lestari"
        >
          <div
            className="hero-announcement-track items-center"
            role="marquee"
            aria-label="RS Medika Lestari buka setiap hari 24 jam. Alamat: Jalan HOS Cokroaminoto Nomor 56, Karang Tengah, Kota Tangerang, Banten 15151."
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center whitespace-nowrap py-2 text-[11px] font-medium tracking-wide sm:text-xs md:text-sm"
                aria-hidden={copy === 1}
              >
                <span className="mx-5 inline-flex items-center gap-2 sm:mx-8">
                  <span className="font-semibold">
                    RS Medika Lestari Buka 24 Jam Setiap Hari
                  </span>
                </span>
                <span className="mx-5 text-white/50 sm:mx-8" aria-hidden="true">
                  |
                </span>
                <span className="mx-5 inline-flex items-center gap-2 sm:mx-8">
                  <span className="font-semibold">Alamat:</span>
                  <span>
                    Jl. HOS Cokroaminoto No.56, RT.001/RW.012, Karang Timur,
                    Kec. Karang Tengah, Kota Tangerang, Banten 15151
                  </span>
                </span>
                <span className="mx-5 text-white/50 sm:mx-8" aria-hidden="true">
                  |
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup informasi rumah sakit"
          title="Tutup"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-full w-11 shrink-0 items-center justify-center bg-[#003f88] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white cursor-pointer"
        >
          <X size={22} strokeWidth={2} />
        </button>

        <span
          className="pointer-events-none absolute inset-y-0 right-11 z-[1] w-5 bg-gradient-to-l from-[#003f88] to-transparent"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
