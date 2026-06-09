"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";

// Data Asuransi Rekanan (27 Item)
const ASURANSI_DATA = [
  { id: 1, src: "/images/awards/bpjs.png", alt: "BPJS Kesehatan" },
  { id: 2, src: "/images/awards/bpjamsostek.png", alt: "BPJAMSOSTEK" },
  { id: 3, src: "/images/awards/tafakurkeluarga.png", alt: "Tafakur Keluarga" },
  { id: 4, src: "/images/awards/jasaraharja.png", alt: "Jasa Raharja" },
  { id: 5, src: "/images/awards/sinarmas.png", alt: "Asuransi Sinar Mas" },
  { id: 6, src: "/images/awards/brilife.png", alt: "BRI Life" },
  { id: 7, src: "/images/awards/adira.png", alt: "Adira Insurance" },
  { id: 8, src: "/images/awards/fwd.webp", alt: "FWD Insurance" },
  { id: 9, src: "/images/awards/allianz.jpeg", alt: "Allianz" },
  { id: 10, src: "/images/awards/fullerton.jpeg", alt: "Fullerton Health" },
  { id: 11, src: "/images/awards/aca.jpeg", alt: "ACA Asuransi" },
  { id: 12, src: "/images/awards/aa.png", alt: "Asuransi Astra" },
  { id: 13, src: "/images/awards/mega.png", alt: "PFI Mega Life" },
  { id: 14, src: "/images/awards/lippo.jpeg", alt: "Lippo Insurance" },
  { id: 15, src: "/images/awards/msig.png", alt: "MSIG" },
  { id: 16, src: "/images/awards/greateastern.jpeg", alt: "Great Eastern" },
  { id: 17, src: "/images/awards/prudential.jpeg", alt: "Prudential" },
  { id: 18, src: "/images/awards/bca.png", alt: "BCA Insurance" },
  { id: 19, src: "/images/awards/meditap.png", alt: "Meditap" },
  { id: 20, src: "/images/awards/pacificcross.png", alt: "Pacific Cross" },
  { id: 21, src: "/images/awards/zurich.png", alt: "Zurich Insurance" },
  { id: 22, src: "/images/awards/aia.jpeg", alt: "AIA Financial" },
  { id: 23, src: "/images/awards/mag.png", alt: "Asuransi MAG" },
  { id: 24, src: "/images/awards/carlife.webp", alt: "Central Asia Raya" },
  { id: 25, src: "/images/awards/admedika.png", alt: "AdMedika" },
  { id: 26, src: "/images/awards/alodokter.jpeg", alt: "Alodokter" },
  { id: 27, src: "/images/awards/ocbc.png", alt: "OCBC NISP" },
];

export default function AsuransiRekanPage() {
  const [activeAwardIndex, setActiveAwardIndex] = useState(0);

  // Inisialisasi Keen Slider
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setActiveAwardIndex(slider.track.details.rel);
    },
    loop: true,
  });

  // Hitung jumlah halaman dot (27 data / 9 per halaman = 3 halaman)
  const totalPages = Math.ceil(ASURANSI_DATA.length / 9);
  const awardDots = Array.from({ length: totalPages }, (_, i) => i);

  // Handler klik dot slider
  const handleAwardDotClick = (index: number) => {
    instanceRef.current?.moveToIdx(index);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section dengan Background Image */}
      <section
        className="bg-cover bg-center bg-no-repeat text-white py-8 md:py-15 relative"
        style={{
          backgroundImage: "url(/informasi.jpg)",
        }}
      >
        {/* Blue Overlay dengan 90% opacity */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#003f88]/90 to-[#013a63]/90 z-0" />

        {/* Content */}
        <div className="max-w-[1172px] mx-auto px-4 md:px-8 py-0 md:py-2 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <div className="flex items-center gap-1 text-[14px] font-normal">
              <Link
                href="/"
                className="text-white/70 hover:text-white transition-colors"
              >
                Beranda
              </Link>
              <ChevronRight
                size={12}
                className="text-white/70"
                aria-hidden="true"
              />
              <span className="font-normal text-white">Asuransi Rekanan</span>
            </div>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Asuransi dan Rekanan
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
            RS Medika Lestari bekerja sama dengan berbagai asuransi kesehatan
            untuk memberikan kemudahan akses layanan kesehatan berkualitas.
          </p>
        </div>
      </section>

      {/* Insurance Gallery Section - Ditambahkan latar belakang soft agar dot putih terlihat kontras */}
      <section className="w-full py-12 md:py-16 pb-32 md:pb-24 bg-slate-100">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8">
          {/* Slider Container */}
          <div ref={sliderRef} className="keen-slider overflow-hidden">
            {/* Halaman/Grup Pertama (Logo 1-9) */}
            <div className="keen-slider__slide w-full shrink-0 grid grid-cols-3 gap-2 pr-1">
              {ASURANSI_DATA.slice(0, 9).map((award) => (
                <div
                  key={award.id}
                  className="bg-white p-2 aspect-[4/3] flex items-center justify-center shadow transition-all duration-300"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={award.src}
                      alt={award.alt}
                      fill
                      sizes="(max-width: 768px) 33vw, 20vw"
                      className="object-contain"
                      priority={award.id <= 9}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Halaman/Grup Kedua (Logo 10-18) */}
            <div className="keen-slider__slide w-full shrink-0 grid grid-cols-3 gap-2 pl-1">
              {ASURANSI_DATA.slice(9, 18).map((award) => (
                <div
                  key={award.id}
                  className="bg-white p-2 aspect-[4/3] flex items-center justify-center shadow transition-all duration-300"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={award.src}
                      alt={award.alt}
                      fill
                      sizes="(max-width: 768px) 33vw, 20vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Halaman/Grup Ketiga (Logo 18-27) */}
            <div className="keen-slider__slide w-full shrink-0 grid grid-cols-3 gap-2 pl-1">
              {ASURANSI_DATA.slice(18, 27).map((award) => (
                <div
                  key={award.id}
                  className="bg-white p-2 aspect-[4/3] flex items-center justify-center shadow transition-all duration-300"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={award.src}
                      alt={award.alt}
                      fill
                      sizes="(max-width: 768px) 33vw, 20vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indikator Dot Rekanan - Sesuai Permintaan Anda */}
          <div className="mt-12 flex items-center justify-center gap-4">
            {awardDots.map((index) => {
              const isAwardActive = index === activeAwardIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAwardDotClick(index)}
                  className="focus:outline-none flex items-center justify-center h-8 w-8 relative"
                  aria-label={`Go to award page ${index + 1}`}
                >
                  <motion.div
                    animate={{
                      backgroundColor: isAwardActive ? "#ffffff" : "#3D8ECB",
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-5 h-5 rounded-full z-10 pointer-events-none"
                  />

                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{
                      scale: isAwardActive ? 1 : 0.4,
                      opacity: isAwardActive ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 22,
                    }}
                    className="absolute w-9 h-9 rounded-full border-[5px] border-[#3D8ECB] bg-[#3D8ECB] z-0 origin-center pointer-events-none"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        