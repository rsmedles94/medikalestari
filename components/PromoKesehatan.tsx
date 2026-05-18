"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";

// ==========================================
// DATA DEMO PROMO KESEHATAN (Total 8 Item)
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
    title: "Skrining Jantung Koroner",
    description:
      "Pemeriksaan menyeluruh fungsi jantung demi mendeteksi penyumbatan sejak dini.",
    image: "/images/promo/paket8.jpeg",
  },
];

// ==========================================
// DATA COUNTER STATISTIK (Sesuai Gambar)
// ==========================================
const STATS_DATA = [
  {
    icon: "/images/icons/location.svg",
    number: "70+",
    text: "Lokasi di Kota Tangerang",
  },
  {
    icon: "/images/icons/patient.svg",
    number: "100k+",
    text: "Pasien pernah ditangani",
  },
  {
    icon: "/images/icons/doctor.svg",
    number: "20+",
    text: "Dokter Spesialis Profesional",
  },
  {
    icon: "/images/icons/bed.svg",
    number: "30+",
    text: "Kamar Perawatan",
  },
];

// ==========================================
// COMPONENT SKELETON LOADING
// ==========================================
function SkeletonCard() {
  return (
    <div
      className="bg-white border border-gray-100 flex flex-col h-full shadow-sm overflow-hidden rounded-xl"
      aria-hidden="true"
    >
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.2s_infinite]" />
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

// ==========================================
// COMPONENT UTAMA
// ==========================================
const PromoKesehatan = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimationControls();

  // Menentukan pembagian grup dot indikator berdasarkan screen view port
  const [itemsPerGroup, setItemsPerGroup] = useState(4);
  const totalDots = Math.ceil(PROMO_DATA.length / itemsPerGroup);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerGroup(4); // Desktop isi 4 card
      } else {
        setItemsPerGroup(2); // Mobile isi 2 card kesamping
      }
      setActiveIndex(0);
      controls.start({ x: "0%" });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const t = setTimeout(() => setIsLoading(false), 700);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t);
    };
  }, [controls]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    const targetTranslateX = -(index * 100);

    controls.start({
      x: `${targetTranslateX}%`,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 24,
        mass: 0.8,
      },
    });
  };

  return (
    <div className="w-full font-sans antialiased">
      {/* 1. SECTON ATAS: STATISTIK (Bg Image ditimpa Overlay #173A87 kekuatan 90%) */}
      <section className="relative w-full pt-20 pb-40 px-4 sm:px-6 lg:px-8 text-white text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/informasi.jpg"
            alt="Informasi Medika Lestari Background"
            fill
            className="object-cover pointer-events-none select-none"
            priority
            quality={95}
          />
        </div>
        <div className="absolute inset-0 z-10 bg-[#173A87]/90" />

        <div className="relative z-20 max-w-[1180px] mx-auto md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 items-start">
            {STATS_DATA.map((stat, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="mb-4 w-16 h-16 flex items-center justify-center relative transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={stat.icon}
                    alt={stat.text}
                    width={56}
                    height={56}
                    className="object-contain inverted-icon brightness-0 invert"
                  />
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight leading-none">
                  {stat.number}
                </div>
                <p className="text-xs md:text-sm uppercase tracking-widest font-medium opacity-90 max-w-[180px] mx-auto leading-snug">
                  {stat.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SECTION BAWAH: CAROUSEL CARD (Tumpuk di Pertengahan, Background Bawahnya Putih) */}
      <section className="relative w-full pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Menyambung sisa background gelap ke separuh atas slider */}
        <div className="absolute top-0 left-0 right-0 h-32 z-0 overflow-hidden">
          <div className="absolute inset-0 w-full h-[600px] -top-[480px]">
            <Image
              src="/informasi.jpg"
              alt="Lanjutan Background"
              fill
              className="object-cover pointer-events-none"
              quality={50}
            />
          </div>
          <div className="absolute inset-0 bg-[#173A87]/90" />
        </div>

        {/* Sisa area background ke bawah dirubah menjadi warna putih murni */}
        <div className="absolute bottom-0 left-0 right-0 top-32 z-0 bg-white" />

        {/* Main Content Area */}
        <div className="relative z-20 max-w-[1180px] mx-auto md:px-8">
          <div className="w-full overflow-hidden rounded-xl">
            <motion.div
              animate={controls}
              initial={{ x: "0%" }}
              className="flex w-full"
            >
              {isLoading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={"skeleton-" + idx}
                      className="w-1/2 lg:w-1/4 shrink-0 p-2 md:p-3"
                    >
                      <SkeletonCard />
                    </div>
                  ))
                : PROMO_DATA.map((item) => (
                    <div
                      key={item.id}
                      className="w-1/2 lg:w-1/4 shrink-0 p-2 md:p-3"
                    >
                      <article className="bg-white border border-gray-100 flex flex-col h-full shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                          <Image
                            src={item.image}
                            alt={`Promo ${item.title}`}
                            width={500}
                            height={500}
                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                            priority={item.id <= 4}
                          />
                        </div>

                        <div className="p-4 md:p-5 flex flex-col grow text-center bg-white">
                          <h3 className="text-xs md:text-base font-extrabold text-[#173A87] mb-2 min-h-12 flex items-center justify-center leading-tight tracking-tight">
                            {item.title}
                          </h3>
                          <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed mb-5 line-clamp-3 md:line-clamp-4">
                            {item.description}
                          </p>
                          <div className="mt-auto">
                            <button
                              type="button"
                              className="w-full py-2.5 border border-[#173A87] text-[#173A87] text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#173A87] hover:text-white active:scale-95"
                            >
                              Selengkapnya
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
            </motion.div>
          </div>

          {/* 3. INDIKATOR BULAT SEPERTI GAMBAR (Smooth pop in-out tanpa berkedip) */}
          <div className="mt-12 flex items-center justify-center gap-4">
            {Array.from({ length: totalDots }).map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  className="focus:outline-none flex items-center justify-center h-8 w-8 relative"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {/* Bulatan Kecil Dasar */}
                  <motion.div
                    animate={{
                      backgroundColor: isActive ? "#ffffff" : "#173A87",
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-4 h-4 rounded-full z-10 pointer-events-none"
                  />

                  {/* Ring Besar Aktif */}
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1 : 0.4,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 22,
                    }}
                    className="absolute w-8 h-8 rounded-full border-[5px] border-[#173A87] bg-white z-0 origin-center pointer-events-none"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PromoKesehatan;
