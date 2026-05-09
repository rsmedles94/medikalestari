"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

// Data Demo
const PROMO_DATA = [
  {
    id: 1,
    title: "Vaksin Influenza & Prevenar",
    description:
      "Lindungi diri dan keluarga dari virus Influenza dan bakteri Pneumonia dengan paket vaksinasi komprehensif.",
    image: "/promo/paket1.jpeg",
  },
  {
    id: 2,
    title: "Sirkumsisi Anak (Khitan)",
    description:
      "Layanan khitan anak dengan metode modern yang minim nyeri, proses penyembuhan cepat.",
    image: "/promo/paket2.jpeg",
  },
  {
    id: 3,
    title: "Skrining Batu Empedu",
    description:
      "Deteksi dini adanya batu empedu melalui pemeriksaan radiologi dan laboratorium.",
    image: "/promo/paket3.jpeg",
  },
  {
    id: 4,
    title: "Persalinan Bunda",
    description:
      "Wujudkan momen kelahiran buah hati yang aman dan nyaman dengan paket persalinan lengkap.",
    image: "/promo/paket4.jpeg",
  },
  {
    id: 5,
    title: "Persalinan ERACS",
    description:
      "Metode persalinan caesar ERACS untuk pemulihan yang jauh lebih cepat.",
    image: "/promo/paket5.jpeg",
  },
  {
    id: 6,
    title: "Operasi Mata Katarak",
    description:
      "Kembalikan kejernihan penglihatan Anda dengan prosedur operasi katarak teknologi Phacoemulsification.",
    image: "/promo/paket6.jpeg",
  },
  {
    id: 7,
    title: "Medical Checkup Jamaah Haji",
    description:
      "Pemeriksaan kesehatan menyeluruh bagi calon jamaah haji untuk memastikan kondisi fisik prima.",
    image: "/promo/paket7.jpeg",
  },
];

function SkeletonCard() {
  return (
    <div
      className="bg-white border border-gray-100 flex flex-col h-full shadow-sm overflow-hidden"
      aria-hidden="true"
    >
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.2s_infinite]" />
      </div>
      <div className="p-4 md:p-5 flex flex-col grow text-center">
        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-11/12 mx-auto mb-2 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-10/12 mx-auto mb-2 animate-pulse" />
        <div className="mt-auto">
          <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

const PromoKesehatan = () => {
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const visibleData = showAll ? PROMO_DATA : PROMO_DATA.slice(0, 4);

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const handleToggle = () => {
    if (showAll) {
      setShowAll(false);
      sectionRef.current?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    } else {
      setShowAll(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="bg-[#003366]/5 py-12 px-4 sm:px-6 lg:px-8 min-h-screen mt-10"
      aria-labelledby="promo-title"
    >
      <div className="relative z-10 max-w-[1180px] mx-auto md:px-8">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h2
            id="promo-title"
            className="text-2xl md:text-3xl font-bold text-black uppercase tracking-widest"
          >
            PROMO PAKET KESEHATAN
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            Kenali jenis pemeriksaan yang Anda butuhkan melalui pilihan paket
            Kesehatan Medika Lestari.
          </p>
        </header>

        {/* Grid */}
        <ul
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 list-none p-0"
          aria-busy={isLoading}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <li key={"skeleton-" + idx}>
                  <SkeletonCard />
                </li>
              ))
            : visibleData.map((item) => (
                <li key={item.id}>
                  <article className="bg-white border border-gray-100 flex flex-col h-full shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={item.image}
                        alt={`Promo ${item.title}`}
                        width={800}
                        height={800}
                        className="object-cover w-full h-full"
                        priority={item.id <= 4}
                      />
                    </div>

                    <div className="p-4 md:p-5 flex flex-col grow text-center">
                      <h3 className="text-sm md:text-lg font-bold text-[#003366] mb-3 min-h-12 flex items-center justify-center leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-[10px] md:text-sm text-gray-500 leading-relaxed mb-6 line-clamp-4">
                        {item.description}
                      </p>
                      <div className="mt-auto">
                        <button
                          type="button"
                          className="w-full py-2 border border-[#003366] text-[#003366] text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[#003366] hover:text-white"
                        >
                          Selengkapnya
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
        </ul>

        {/* Toggle Text Link */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={showAll}
            className="text-[#003366] text-xs md:text-sm font-bold uppercase tracking-widest underline underline-offset-4 decoration-2 transition-opacity hover:opacity-70"
          >
            {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoKesehatan;
