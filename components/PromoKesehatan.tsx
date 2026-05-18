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
// DATA FITUR UTAMA (Sisi Kanan Gambar 1)
// ==========================================
const FEATURES_DATA = [
  {
    icon: "/images/icons/mychart.svg",
    title: "MyChart",
    desc: "Your online patient portal to connect with doctors and your health information.",
  },
  {
    icon: "/images/icons/phone.svg",
    title: "Telephone Visits",
    desc: "Speak to a doctor by telephone.",
  },
  {
    icon: "/images/icons/express.svg",
    title: "Virtual ExpressCare",
    desc: "Skip the emergency room. Talk to a doctor now for virtual urgent care.",
  },
  {
    icon: "/images/icons/video.svg",
    title: "Video Visits",
    desc: "Video visit with a doctor on your smartphone or computer.",
  },
];

// ==========================================
// DATA LOGO REKANAN / PENGHARGAAN (Gambar 2)
// ==========================================
const AWARDS_DATA = [
  {
    id: 1,
    src: "/images/awards/award1.png",
    alt: "America's Best Nursing Homes",
  },
  {
    id: 2,
    src: "/images/awards/award2.png",
    alt: "Best Nursing Homes US News",
  },
  { id: 3, src: "/images/awards/award3.png", alt: "Best Hospitals US News" },
  {
    id: 4,
    src: "/images/awards/award4.png",
    alt: "LGBTQ Healthcare Equality Leader",
  },
  {
    id: 5,
    src: "/images/awards/award5.png",
    alt: "Lown Institute Hospitals Index",
  },
  { id: 6, src: "/images/awards/award6.png", alt: "Healthgrades Gold Plus" },
  {
    id: 7,
    src: "/images/awards/award7.png",
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
];

// ==========================================
// DATA COUNTER STATISTIK (Sesuai Gambar 2)
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
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimationControls();

  const [itemsPerGroup, setItemsPerGroup] = useState(4);
  const totalDots = Math.ceil(PROMO_DATA.length / itemsPerGroup);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerGroup(4);
      } else {
        setItemsPerGroup(2);
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
    // Pembungkus Tunggal Utama: Tempat gambar background tunggal diletakkan agar benar-benar menyambung sempurna
    <div className="w-full font-sans antialiased bg-white relative overflow-hidden">
      {/* SATU-SATUNYA BACKGROUND GAMBAR UNTUK SELURUH HALAMAN */}
      <div className="absolute inset-x-0 top-0 bottom-32 z-0">
        <Image
          src="/informasi.jpg"
          alt="Informasi Medika Lestari Background"
          fill
          className="object-cover pointer-events-none select-none"
          priority
          quality={95}
        />
        {/* Overlay Biru Gelap merata di atas gambar background */}
        <div className="absolute inset-0 bg-[#173A87]/95" />
      </div>

      {/* Sisa area background paling bawah sendiri setelah slider card dijadikan putih murni */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-white z-0" />

      {/* ========================================================================= */}
      {/* 1. SECTON ATAS: KONTEN DI AREA BIRU (HEADER, LAYOUT DUA KOLOM, REKANAN, STATS) */}
      {/* ========================================================================= */}
      <section className="relative z-10 w-full pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-[1180px] mx-auto md:px-8">
          {/* UTUH BAGIAN A: HEADER (Virtual Care - Gambar 1) */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Virtual Care – Anytime, Anywhere
            </h2>
            <p className="text-sm md:text-base text-white/90 mb-4 leading-normal">
              We have several options to connect with our health care providers
              without coming into the doctor’s office or hospital.
            </p>
            <a
              href="#learn-more"
              className="text-sm font-semibold text-orange-400 hover:underline inline-flex items-center gap-1"
            >
              Learn More About Virtual Care →
            </a>
          </div>

          {/* UTUH BAGIAN B: DUA KOLOM DENGAN GAMBAL VISUAL & FITUR (Gambar 1) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            {/* Sisi Kiri: Gambar Representasi */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] ">
                <Image
                  src="/mcu.png"
                  alt="Virtual Care Info"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Sisi Kanan: Grid 4 Fitur Utama */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {FEATURES_DATA.map((feat, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20">
                    <Image
                      src={feat.icon}
                      alt={feat.title}
                      width={24}
                      height={24}
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-bold mb-1">{feat.title}</h4>
                    <p className="text-xs text-white/80 leading-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-white/10 my-16" />

          {/* UTUH BAGIAN C: EXPERT CARE & GRID LOGO REKANAN (Gambar 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            {/* Sisi Kiri: Deskripsi Wilayah */}
            <div className="lg:col-span-6 text-left">
              <h3 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Expert Care in Every NYC Neighborhood
              </h3>
              <p className="text-sm md:text-base text-white/90 font-semibold mb-4 leading-normal">
                No matter your health care needs, the NYC Health + Hospitals
                system is there for you.
              </p>
              <p className="text-xs md:text-sm text-white/80 leading-normal mb-8">
                Our hospitals, nursing homes, and Gotham Health Centers are
                recognized for racial equity and outstanding services. We offer
                quality, affordable care in every New York City neighborhood.
              </p>
              <button
                type="button"
                className="px-5 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white text-xs font-bold uppercase transition-colors inline-flex items-center gap-2"
              >
                What makes us unique →
              </button>
            </div>

            {/* Sisi Kanan: 9 Kotak Putih Logo Penghargaan */}
            <div className="lg:col-span-6 grid grid-cols-3 gap-2">
              {AWARDS_DATA.map((award) => (
                <div
                  key={award.id}
                  className="bg-white p-2 aspect-[4/3] flex items-center justify-center shadow"
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
          </div>

          <hr className="border-white/10 my-16" />

          {/* UTUH BAGIAN D: BARISAN STATISTIK COUNTER (Paling Bawah Bagian Biru) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 text-center items-start">
            {STATS_DATA.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-3 w-12 h-12 flex items-center justify-center relative">
                  <Image
                    src={stat.icon}
                    alt={stat.text}
                    width={40}
                    height={40}
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <div className="text-4xl md:text-5xl font-black mb-1 leading-none text-white">
                  {stat.number}
                </div>
                <p className="text-xs uppercase font-medium text-white/90 max-w-[180px] mx-auto leading-normal">
                  {stat.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION BAWAH: SLIDER CARD PROMO (Memotong Separuh Lapisan BG Biru & BG Putih) */}
      {/* ========================================================================= */}
      <section className="relative z-10 w-full pb-20 px-4 sm:px-6 lg:px-8">
        {/* Layer penutup warna putih murni khusus untuk menutupi separuh area bawah slider card */}
        <div className="absolute inset-x-0 bottom-0 top-32 bg-white z-0" />

        {/* Konten Utama Slider */}
        <div className="relative z-10 max-w-[1180px] mx-auto md:px-8">
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
                          <h3 className="text-xs md:text-base font-bold text-[#173A87] mb-2 min-h-12 flex items-center justify-center leading-normal">
                            {item.title}
                          </h3>
                          <p className="text-[10px] md:text-xs text-gray-500 leading-normal mb-5 line-clamp-3 md:line-clamp-4">
                            {item.description}
                          </p>
                          <div className="mt-auto">
                            <button
                              type="button"
                              className="w-full py-2 border border-[#173A87] text-[#173A87] text-[10px] md:text-xs font-bold uppercase transition-all duration-300 hover:bg-[#173A87] hover:text-white"
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

          {/* Indikator Dot Bulat */}
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
                  {/* Dot Pusat */}
                  <motion.div
                    animate={{
                      backgroundColor: isActive ? "#ffffff" : "#173A87",
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-4 h-4 rounded-full z-10 pointer-events-none"
                  />

                  {/* Ring Aktif */}
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
