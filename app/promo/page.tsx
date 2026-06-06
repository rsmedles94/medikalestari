"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

// ==========================================
// SKELETON SHIMMER COMPONENT
// ==========================================
function SkeletonCard() {
  return (
    <div
      className="bg-white border border-gray-300 flex flex-col h-full overflow-hidden"
      aria-hidden="true"
    >
      {/* Image Skeleton */}
      <div className="relative aspect-square w-full bg-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.2s_infinite]" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 md:p-5 flex flex-col grow text-center bg-white">
        {/* Title Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse" />

        {/* Description Skeleton - 3 lines */}
        <div className="space-y-2 mb-5 flex-1">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
        </div>

        {/* Button Skeleton */}
        <div className="mt-auto">
          <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DATA PROMO KESEHATAN (Total 12 Item)
// ==========================================
const PROMO_DATA = [
  {
    id: 1,
    title: "Vaksin Influenza & Prevenar",
    description:
      "Lindungi diri dan keluarga dari virus Influenza dan bakteri Pneumonia dengan paket vaksinasi komprehensif.",
    image: "/images/promo/paket1.jpeg",
  },
  {
    id: 2,
    title: "Sirkumsisi Anak (Khitan)",
    description:
      "Layanan khitan anak dengan metode modern yang minim nyeri, proses penyembuhan cepat.",
    image: "/images/promo/paket2.jpeg",
  },
  {
    id: 3,
    title: "Skrining Batu Empedu",
    description:
      "Deteksi dini adanya batu empedu melalui pemeriksaan radiologi dan laboratorium.",
    image: "/images/promo/paket3.jpeg",
  },
  {
    id: 4,
    title: "Persalinan Bunda",
    description:
      "Wujudkan momen kelahiran buah hati yang aman dan nyaman dengan paket persalinan lengkap.",
    image: "/images/promo/paket4.jpeg",
  },
  {
    id: 5,
    title: "Persalinan ERACS",
    description:
      "Metode persalinan caesar ERACS untuk pemulihan yang jauh lebih cepat.",
    image: "/images/promo/paket5.jpeg",
  },
  {
    id: 6,
    title: "Operasi Mata Katarak",
    description:
      "Kembalikan kejernihan penglihatan Anda dengan prosedur operasi katarak teknologi Phacoemulsification.",
    image: "/images/promo/paket6.jpeg",
  },
  {
    id: 7,
    title: "Medical Checkup Jamaah Haji",
    description:
      "Pemeriksaan kesehatan menyeluruh bagi calon jamaah haji untuk memastikan kondisi fisik prima.",
    image: "/images/promo/paket7.jpeg",
  },
  {
    id: 8,
    title: "Tes Bebas Narkoba",
    description:
      "Layanan uji saring narkoba yang cepat, akurat, dan rahasia untuk keperluan edukasi, kerja, maupun instansi.",
    image: "/images/promo/paket8.jpeg",
  },
  {
    id: 9,
    title: "Medical Checkup ART & Driver",
    description:
      "Pemeriksaan kesehatan menyeluruh bagi asisten rumah tangga dan pengemudi demi kenyamanan dan keamanan keluarga Anda.",
    image: "/images/promo/paket9.jpeg",
  },
  {
    id: 10,
    title: "Pap Smear",
    description:
      "Deteksi dini kanker serviks (leher rahim) melalui pemeriksaan sitologi yang aman dan ditangani oleh tim medis ahli.",
    image: "/images/promo/paket10.jpeg",
  },
  {
    id: 11,
    title: "Antenatal Care",
    description:
      "Pemeriksaan kehamilan berkala untuk memantau kesehatan ibu dan tumbuh kembang janin secara optimal.",
    image: "/images/promo/paket11.jpeg",
  },
  {
    id: 12,
    title: "Imun Booster",
    description:
      "Tingkatkan daya tahan dan kebugaran tubuh secara instan dengan injeksi vitamin dan nutrisi esensial.",
    image: "/images/promo/paket12.jpeg",
  },
];

export default function PromoPage() {
  // State untuk track card promo mana yang di-hover
  const [hoveredPromoId, setHoveredPromoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi loading untuk skeleton shimmer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section with Breadcrumb */}
      <section className="relative w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#003f88] to-[#003f88]/90 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/informasi.jpg"
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={75}
          />
          <div className="absolute inset-0 bg-[#003f88]/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-6">
            <Link
              href="/"
              className="text-white/70 hover:text-white transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={12} className="text-white/70" />
            <span className="font-normal text-white/90">Promo</span>
          </nav>

          {/* Title and Description */}
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Promo Paket Kesehatan Spesial
            </h1>
            <p className="text-sm md:text-base text-white/90 max-w-2xl">
              Temukan berbagai penawaran spesial paket kesehatan untuk anda dan
              keluarga.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Promo Cards */}
      <section className="relative w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white pb-24 sm:pb-20 lg:pb-16">
        <div className="max-w-[1180px] mx-auto md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {isLoading
              ? Array.from({ length: 12 }).map((_, idx) => (
                  <div key={`skeleton-promo-${idx}`}>
                    <SkeletonCard />
                  </div>
                ))
              : PROMO_DATA.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-300 flex flex-col h-full overflow-hidden transition-all duration-300 group"
                    onMouseEnter={() => setHoveredPromoId(item.id)}
                    onMouseLeave={() => setHoveredPromoId(null)}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-gray-50 cursor-pointer">
                      <motion.div
                        className="w-full h-full"
                        animate={{
                          scale: hoveredPromoId === item.id ? 1.1 : 1,
                        }}
                        transition={{
                          type: "tween",
                          duration: 0.6,
                          ease: "easeInOut",
                        }}
                      >
                        <Image
                          src={item.image}
                          alt={`Promo ${item.title}`}
                          width={500}
                          height={500}
                          className="object-cover w-full h-full"
                          priority={item.id <= 4}
                        />
                      </motion.div>
                    </div>

                    {/* Content Container */}
                    <div className="p-4 md:p-10 flex flex-col grow text-center bg-white">
                      {/* Title */}
                      <Link href={`/promo/${item.id}`} passHref>
                        <h3 className="text-xs md:text-base font-bold text-[#003f88] mb-2 min-h-12 flex items-center justify-center leading-normal cursor-pointer hover:text-[#e67e22] transition-colors duration-300">
                          {item.title}
                        </h3>
                      </Link>

                      {/* Description */}
                      <p className="text-[10px] md:text-xs text-gray-500 leading-normal mb-5 line-clamp-3 md:line-clamp-4 cursor-default mt-10">
                        {item.description}
                      </p>

                      {/* Button */}
                      <div className="mt-auto">
                        <Link href={`/promo/${item.id}`} passHref>
                          <button
                            type="button"
                            className={`w-full py-2 border text-white text-[10px] md:text-xs font-semibold transition-all duration-300 cursor-pointer ${
                              hoveredPromoId === item.id
                                ? "bg-[#e67e22]"
                                : "bg-[#003f88] hover:bg-[#e67e22]"
                            }`}
                          >
                            ⭢ Selengkapnya
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
