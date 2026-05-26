"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import Link from "next/link";

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

// ==========================================
// DATA FITUR UTAMA (Sesuai Gambar Grid)
// ==========================================
const FEATURES_DATA = [
  {
    icon: "/images/icons/whatsapp.svg",
    title: "Make an Appointment Online",
    link: "https://wa.me/628XXXXXXXXXX",
  },
  {
    icon: "/images/icons/instagram.svg",
    title: "@rsmedikalestari",
    link: "https://www.instagram.com/rsmedikalestari",
  },
  {
    icon: "/images/icons/youtube.svg",
    title: "RS Medika Lestari",
    link: "https://www.youtube.com/@RSMedikaLestari",
  },
  {
    icon: "/images/icons/callcenter.svg",
    title: "Customer Care",
    link: "tel:1500XXX",
  },
  {
    icon: "/images/icons/threads.svg",
    title: "@rsmedikalestari",
    link: "https://www.threads.net/@rsmedikalestari",
  },
  {
    icon: "/images/icons/tiktok.svg",
    title: "RS Medika Lestari",
    link: "https://www.tiktok.com/@rsmedikalestariciledug",
  },
];

// ==========================================
// DATA LOGO REKANAN / PENGHARGAAN (Total 18 Item)
// ==========================================
const AWARDS_DATA = [
  {
    id: 1,
    src: "/images/awards/award1.png",
    alt: "America's Best Nursing Homes",
  },
  {
    id: 2,
    src: "/images/awards/award2.jpeg",
    alt: "Best Nursing Homes US News",
  },
  { id: 3, src: "/images/awards/award3.png", alt: "Best Hospitals US News" },
  {
    id: 4,
    src: "/images/awards/award4.jpeg",
    alt: "LGBTQ Healthcare Equality Leader",
  },
  {
    id: 5,
    src: "/images/awards/award5.jpeg",
    alt: "Lown Institute Hospitals Index",
  },
  { id: 6, src: "/images/awards/award6.jpeg", alt: "Healthgrades Gold Plus" },
  {
    id: 7,
    src: "/images/awards/award7.jpeg",
    alt: "Designated a Baby Friendly Hospital",
  },
  {
    id: 8,
    src: "/images/awards/award8.png",
    alt: "American College of Surgeons",
  },
  {
    id: 9,
    src: "/images/awards/award9.png",
    alt: "The Joint Commission Gold Seal",
  },
  // 9 Item Tambahan untuk melengkapi menjadi 18 item slider
  {
    id: 10,
    src: "/images/awards/award10.jpeg",
    alt: "America's Best Nursing Homes 2",
  },
  {
    id: 11,
    src: "/images/awards/award11.png",
    alt: "Best Nursing Homes US News 2",
  },
];

// ==========================================
// DATA COUNTER STATISTIK
// ==========================================
const STATS_DATA = [
  {
    icon: "/images/icons/doctor.svg",
    number: "47",
    text: "Tenaga Medis Profesional",
  },
  {
    icon: "/images/icons/poly.svg",
    number: "8K+",
    text: "Pasien Poliklinik pernah ditangani",
  },
  {
    icon: "/images/icons/patient.svg",
    number: "2k+",
    text: "Pasien Rawat Inap pernah ditangani",
  },
  {
    icon: "/images/icons/bed.svg",
    number: "100+",
    text: "Kamar Perawatan Modern",
  },
];

// ==========================================
// COMPONENT SKELETON LOADING
// ==========================================
function SkeletonCard() {
  return (
    <div
      className="bg-white border border-gray-100 flex flex-col h-full shadow-sm overflow-hidden"
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

  // State & Controls untuk Slider Promo Vaksin (Bawaan)
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimationControls();
  const [itemsPerGroup, setItemsPerGroup] = useState(4);
  const totalDots = Math.ceil(PROMO_DATA.length / itemsPerGroup);

  // State & Controls Kustom Baru untuk Slider Award (18 Item, per-grup isi 9 logo sesuai grid gambar)
  const [activeAwardIndex, setActiveAwardIndex] = useState(0);
  const awardControls = useAnimationControls();
  const awardItemsPerGroup = 9; // Grid 3x3 per halaman slider
  const totalAwardDots = Math.ceil(AWARDS_DATA.length / awardItemsPerGroup);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerGroup(4);
      } else {
        setItemsPerGroup(2);
      }
      setActiveIndex(0);
      setActiveAwardIndex(0);
      controls.start({ x: "0%" });
      awardControls.start({ x: "0%" });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const t = setTimeout(() => setIsLoading(false), 700);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t);
    };
  }, [controls, awardControls]);

  // Handler Navigasi Slider Promo Vaksin
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

  // Handler Navigasi Slider 18 Logo Rekanan Baru
  const handleAwardDotClick = (index: number) => {
    setActiveAwardIndex(index);
    const targetTranslateX = -(index * 100);

    awardControls.start({
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
    <div className="w-full font-sans antialiased bg-white relative overflow-hidden">
      {/* BACKGROUND GAMBAR UNTUK SELURUH HALAMAN */}
      <div className="absolute inset-x-0 top-0 bottom-96 z-0">
        <Image
          src="/informasi.jpg"
          alt="Informasi Medika Lestari Background"
          fill
          className="object-cover pointer-events-none select-none"
          priority
          quality={95}
        />
        <div className="absolute inset-0 bg-[#003f88]/95" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-96 bg-white z-0" />

      {/* ========================================================================= */}
      {/* 1. SECTION ATAS: KONTEN DI AREA BIRU */}
      {/* ========================================================================= */}
      <section className="relative z-10 w-full pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-[1180px] mx-auto md:px-8">
          {/* UTUH BAGIAN A: HEADER */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <img
              src="/medikalestari.png"
              alt="Logo Medika Lestari"
              className="h-20 w-auto mx-auto mb-6 object-contain"
            />

            <h2 className="text-3xl md:text-[40px] font-bold mb-4">
              Selamat Datang di Rumah Sakit Medika Lestari
            </h2>
            <p className="text-sm md:text-base text-white/90 mb-4 leading-normal">
              Kami hadir sebagai rumah sakit umum modern di Kota Tangerang yang
              berkomitmen memberikan pelayanan kesehatan terpadu, profesional,
              dan penuh kepedulian demi kenyamanan Anda dan keluarga.
            </p>
          </div>

          {/* POSISI DIPINDAH KE ATAS: BARISAN STATISTIK COUNTER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 text-center items-start mb-20">
            {STATS_DATA.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Image tetap di atas */}
                <div className="mb-3 w-15 h-15 flex items-center justify-center relative">
                  <Image
                    src={stat.icon}
                    alt={stat.text}
                    width={70}
                    height={70}
                    className="object-contain brightness-0 invert"
                  />
                </div>

                {/* Pembungkus Angka dan Teks */}
                <div className="flex flex-row items-center justify-center gap-x-3 text-left">
                  {/* Number (Leading-none wajib ada agar tidak ada spasi hantu) */}
                  <div className="text-4xl md:text-[50px] font-bold leading-none text-white flex-shrink-0">
                    {stat.number}
                  </div>

                  {/* Teks di sebelah kanan */}
                  <p className="text-xs uppercase font-bold text-white/90 max-w-[120px] leading-tight">
                    {stat.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Menu Menu */}
          <div className="mb-24 max-w-[1107px] mx-auto text-[#003f88]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {FEATURES_DATA.map((feat, index) => (
                <a
                  key={index}
                  href={feat.link}
                  className="flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-md min-h-[96px]"
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-10 h-10 flex items-center justify-center">
                      <Image
                        src={feat.icon}
                        alt={feat.title}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[17px] font-bold tracking-wide leading-snug">
                      {feat.title}
                    </span>
                  </div>
                  <div className="shrink-0 pl-2">
                    <svg
                      className="w-3 h-3 text-[#003f88]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <hr className="border-white/10 my-16" />

          {/* UTUH BAGIAN C: EXPERT CARE & SLIDER 18 LOGO REKANAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
            {/* Sisi Kiri: Deskripsi Wilayah */}
            <div className="lg:col-span-6 text-left">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight -mt-5">
                Layanan Kesehatan Tepercaya, Didukung Jaringan Mitra Luas
              </h3>
              <p className="text-sm md:text-base text-white/90 font-semibold mb-4 leading-normal text-justify">
                RS Medika Lestari berkomitmen untuk selalu hadir memberikan rasa
                aman dan kemudahan akses medis di setiap langkah penanganan
                kesehatan Anda.
              </p>
              <p className="text-xs md:text-sm text-white/80 leading-normal mb-8 text-justify">
                Melalui sinergi erat bersama penyedia jaminan kesehatan,
                asuransi terkemuka, dan mitra korporasi, kami mengintegrasikan
                layanan medis prima dengan sistem klaim yang praktis. Kami
                memastikan seluruh lapisan masyarakat dapat menikmati perawatan
                berkualitas tinggi secara nyaman dan tanpa kendala birokrasi.
              </p>
              <Link href="/tentang-kami" passHref>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-[#e67e22] hover:bg-[#003f88] text-white text-xs font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  Selengkapnya Tentang Kami →
                </button>
              </Link>
            </div>

            {/* Sisi Kanan: Slider Bungkus Kotak Putih Logo Penghargaan (18 Item smooth slider dengan Dot) */}
            <div className="lg:col-span-6 w-full overflow-hidden flex flex-col">
              <div className="w-full overflow-hidden">
                <motion.div
                  animate={awardControls}
                  initial={{ x: "0%" }}
                  className="flex w-full"
                >
                  {/* Halaman/Grup Pertama (Logo 1-9) */}
                  <div className="w-full shrink-0 grid grid-cols-3 gap-2 pr-1">
                    {AWARDS_DATA.slice(0, 9).map((award) => (
                      <div
                        key={award.id}
                        className="bg-white p-2 aspect-[4/3] flex items-center justify-center shadow transition-all duration-300"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={award.src}
                            alt={award.alt}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Halaman/Grup Kedua (Logo 10-18) */}
                  <div className="w-full shrink-0 grid grid-cols-3 gap-2 pl-1">
                    {AWARDS_DATA.slice(9, 18).map((award) => (
                      <div
                        key={award.id}
                        className="bg-white p-2 aspect-[4/3] flex items-center justify-center shadow transition-all duration-300 hover:opacity-90"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={award.src}
                            alt={award.alt}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Indikator Dot Bulat Navigasi untuk Logo Rekanan */}
              <div className="mt-12 flex items-center justify-center gap-4">
                {Array.from({ length: totalAwardDots }).map((_, index) => {
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
                          backgroundColor: isAwardActive
                            ? "#e67e22"
                            : "#ffffff",
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute w-4 h-4 rounded-full z-10 pointer-events-none"
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
                        className="absolute w-8 h-8 rounded-full border-[5px] border-white bg-[#e67e22] z-0 origin-center pointer-events-none"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION BAWAH: SLIDER CARD PROMO */}
      {/* ========================================================================= */}
      <section className="relative z-10 w-full pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 bottom-0 top-32 bg-white z-0" />

        <div className="relative z-10 max-w-[1190px] mx-auto md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 -mt-10 text-center">
            Promo Paket Kesehatan Medika Lestari
          </h2>
          <div className="w-full overflow-hidden">
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
                      <article className="bg-white border border-gray-100 flex flex-col h-full shadow-lg overflow-hidden transition-all duration-300">
                        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                          <Image
                            src={item.image}
                            alt={`Promo ${item.title}`}
                            width={500}
                            height={500}
                            className="object-cover w-full h-full"
                            priority={item.id <= 4}
                          />
                        </div>

                        <div className="p-4 md:p-5 flex flex-col grow text-center bg-white">
                          <h3 className="text-xs md:text-base font-bold text-[#003f88] mb-2 min-h-12 flex items-center justify-center leading-normal">
                            {item.title}
                          </h3>
                          <p className="text-[10px] md:text-xs text-gray-500 leading-normal mb-5 line-clamp-3 md:line-clamp-4">
                            {item.description}
                          </p>
                          <div className="mt-auto">
                            <Link href={`/promo/${item.id}`} passHref>
                              <button
                                type="button"
                                className="w-full py-2 border bg-[#003f88] text-white text-[10px] md:text-xs font-semibold transition-all duration-300 hover:bg-[#e67e22] hover:text-white"
                              >
                                Selengkapnya →
                              </button>
                            </Link>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
            </motion.div>
          </div>

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
                  <motion.div
                    animate={{
                      backgroundColor: isActive ? "#ffffff" : "#003f88",
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-4 h-4 rounded-full z-10 pointer-events-none"
                  />

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
                    className="absolute w-8 h-8 rounded-full border-[5px] border-[#003f88] bg-white z-0 origin-center pointer-events-none"
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
