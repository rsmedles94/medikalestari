"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  animate,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import PromoCardSkeleton from "./PromoCardSkeleton";

//data promo kesehatan
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

//logo rekanan
const AWARDS_DATA = [
  {
    id: 1,
    src: "/images/awards/bpjs.png",
    alt: "bpjs",
  },
  {
    id: 2,
    src: "/images/awards/bpjamsostek.png",
    alt: "bpjamsostek",
  },
  {
    id: 3,
    src: "/images/awards/tafakurkeluarga.png",
    alt: "tafakurkeluarga",
  },
  {
    id: 4,
    src: "/images/awards/jasaraharja.png",
    alt: "jasaraharja",
  },
  {
    id: 5,
    src: "/images/awards/sinarmas.png",
    alt: "sinarmas",
  },
  {
    id: 6,
    src: "/images/awards/brilife.png",
    alt: "brilife",
  },
  {
    id: 7,
    src: "/images/awards/adira.png",
    alt: "adira",
  },
  {
    id: 8,
    src: "/images/awards/fwd.webp",
    alt: "fwd",
  },
  {
    id: 9,
    src: "/images/awards/allianz.jpeg",
    alt: "allianz",
  },
  {
    id: 10,
    src: "/images/awards/fullerton.jpeg",
    alt: "fullerton",
  },
  {
    id: 11,
    src: "/images/awards/aca.jpeg",
    alt: "aca",
  },
  {
    id: 12,
    src: "/images/awards/aa.png",
    alt: "aa",
  },
  {
    id: 13,
    src: "/images/awards/mega.png",
    alt: "mega",
  },
  {
    id: 14,
    src: "/images/awards/lippo.jpeg",
    alt: "lippo",
  },
  {
    id: 15,
    src: "/images/awards/msig.png",
    alt: "msig",
  },
  {
    id: 16,
    src: "/images/awards/greateastern.jpeg",
    alt: "greateastern",
  },
  {
    id: 17,
    src: "/images/awards/prudential.jpeg",
    alt: "prudential",
  },
  {
    id: 18,
    src: "/images/awards/bca.png",
    alt: "bca",
  },
  {
    id: 19,
    src: "/images/awards/meditap.png",
    alt: "meditap",
  },
  {
    id: 20,
    src: "/images/awards/pacificcross.png",
    alt: "pacificcross",
  },
  {
    id: 21,
    src: "/images/awards/zurich.png",
    alt: "zurich",
  },
  {
    id: 22,
    src: "/images/awards/aia.jpeg",
    alt: "aia",
  },
  {
    id: 23,
    src: "/images/awards/mag.png",
    alt: "mag",
  },
  {
    id: 24,
    src: "/images/awards/carlife.webp",
    alt: "carlife",
  },
  {
    id: 25,
    src: "/images/awards/admedika.png",
    alt: "admedika",
  },
  {
    id: 26,
    src: "/images/awards/alodokter.jpeg",
    alt: "alodokter",
  },
  {
    id: 27,
    src: "/images/awards/ocbc.png",
    alt: "ocbc",
  },
];

//data statistik
const STATS_DATA = [
  {
    icon: "/images/icons/doctor.svg",
    value: 47,
    suffix: "",
    text: "Tenaga Medis Profesional",
  },
  {
    icon: "/images/icons/poly.svg",
    value: 8000,
    suffix: "+",
    text: "Pasien Poliklinik pernah ditangani",
  },
  {
    icon: "/images/icons/patient.svg",
    value: 2500,
    suffix: "+",
    text: "Pasien Rawat Inap pernah ditangani",
  },
  {
    icon: "/images/icons/bed.svg",
    value: 100,
    suffix: "+",
    text: "Kamar Perawatan Modern",
  },
];

//format data
const formatNumber = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const REVEAL_VIEWPORT = { once: true, margin: "-80px" } as const;

//komponen reveal animasi muncul
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
}

function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 28,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.7, delay, ease: REVEAL_EASE }}
    >
      {children}
    </motion.div>
  );
}

//komponen count up
interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function CountUp({ value, suffix = "", duration = 2.2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // mulai menghitung saat angka terlihat di layar (sekali saja)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || reduceMotion) return;

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setCount(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, reduceMotion, value, duration]);

  // pengguna dengan reduced motion langsung melihat angka akhir
  const current = reduceMotion ? value : count;
  const finalText = `${formatNumber(value)}${suffix}`;

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      {/* lebar tetap sesuai angka akhir supaya layout tidak bergeser saat menghitung */}
      <span className="invisible" aria-hidden="true">
        {finalText}
      </span>
      <span className="absolute inset-0 text-center" aria-hidden="true">
        {formatNumber(current)}
        {suffix}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}

// ==========================================
// COMPONENT KOTAK LOGO REKANAN (ANIMASI MUNCUL)
// ==========================================
interface AwardLogoBoxProps {
  award: (typeof AWARDS_DATA)[number];
  index: number;
  show: boolean;
  instant: boolean;
}

// Kotak muncul berurutan secara diagonal (kiri atas ke kanan bawah):
// naik dari bawah sambil membesar dengan pegas halus dan blur yang memudar,
// lalu logo muncul menyusul dan kilau tipis menyapu kotak satu kali.
const tileVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.8, filter: "blur(8px)" },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      y: { type: "spring", stiffness: 200, damping: 18, mass: 0.9, delay },
      scale: { type: "spring", stiffness: 200, damping: 18, mass: 0.9, delay },
      opacity: { duration: 0.5, delay },
      filter: { duration: 0.6, delay },
    },
  }),
};

function AwardLogoBox({ award, index, show, instant }: AwardLogoBoxProps) {
  // grid 3 kolom: gelombang bergerak diagonal dari kiri atas ke kanan bawah
  const row = Math.floor(index / 3);
  const col = index % 3;
  const delay = (row + col) * 0.09;

  return (
    // drop-shadow di pembungkus agar bayangan ikut bentuk kotak yang sedang beranimasi
    <div className="aspect-[4/3] drop-shadow-sm transition-[filter] duration-300 hover:drop-shadow-lg">
      <motion.div
        className="relative w-full h-full overflow-hidden bg-white p-2 flex items-center justify-center"
        variants={tileVariants}
        custom={delay}
        initial={instant ? false : "hidden"}
        animate={show ? "visible" : "hidden"}
        whileHover={instant ? undefined : { y: -4, scale: 1.03 }}
      >
        <motion.div
          className="relative w-full h-full"
          initial={instant ? false : { opacity: 0, scale: 0.85 }}
          animate={
            show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }
          }
          transition={{
            duration: 0.6,
            delay: delay + 0.25,
            ease: REVEAL_EASE,
          }}
        >
          <Image
            src={award.src}
            alt={award.alt}
            fill
            sizes="(min-width: 1024px) 15vw, 30vw"
            className="object-contain"
          />
        </motion.div>

        {!instant && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#3D8ECB]/25 to-transparent"
            initial={{ x: "0%" }}
            animate={{ x: show ? "400%" : "0%" }}
            transition={{
              duration: 1.1,
              delay: show ? delay + 0.4 : 0,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

// ==========================================
// VARIAN KARTU PROMO (MUNCUL BERURUTAN)
// ==========================================
const promoCardVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: (i % 4) * 0.1, ease: REVEAL_EASE },
  }),
};

// ==========================================
// HITUNG DOT LANGSUNG DARI SLIDER (NATIVE)
// ==========================================
// jumlah dot selalu dibaca dari kondisi slider yang sedang aktif (perView
// mobile / desktop dan jumlah card yang benar-benar dirender), bukan angka manual
const getDotsFromSlider = (slider: {
  track: { details: { maxIdx: number } | null };
}) => {
  const maxIdx = slider.track.details?.maxIdx ?? 0;
  return Array.from(Array(maxIdx + 1).keys());
};

// ==========================================
// COMPONENT UTAMA
// ==========================================
const PromoKesehatan = () => {
  // true selama "data" promo belum siap (skeleton tampil)
  const [isLoading, setIsLoading] = useState(true);
  // true setelah keen-slider promo benar-benar terbentuk (lebar slide sudah dihitung)
  const [promoReady, setPromoReady] = useState(false);

  // Indeks aktif untuk dot slider
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeAwardIndex, setActiveAwardIndex] = useState(0);

  // Menyimpan array representasi dot slider agar jumlahnya akurat
  const [promoDots, setPromoDots] = useState<number[]>([]);
  const [awardDots, setAwardDots] = useState<number[]>([]);

  // State untuk track card promo mana yang di-hover
  const [hoveredPromoId, setHoveredPromoId] = useState<number | null>(null);

  // Animasi muncul kotak rekanan: mulai saat terlihat di layar, tiap halaman
  // slider dianimasikan saat pertama kali dibuka
  const awardsWrapperRef = useRef<HTMLDivElement>(null);
  const isAwardsInView = useInView(awardsWrapperRef, {
    once: true,
    margin: "0px 0px -80px 0px",
  });
  const reduceMotion = useReducedMotion();
  const [seenAwardPages, setSeenAwardPages] = useState<number[]>([0]);
  const showAwardPage = (page: number) =>
    !!reduceMotion || (isAwardsInView && seenAwardPages.includes(page));

  // Animasi muncul kartu promo: mulai saat area slider terlihat di layar
  // dan slider sudah siap
  const promoWrapperRef = useRef<HTMLDivElement>(null);
  const isPromoInView = useInView(promoWrapperRef, {
    once: true,
    margin: "0px 0px -80px 0px",
  });

  // 1. REKANAN SLIDER (3x3 grid per halaman)
  const [awardSliderRef, awardSliderInstance] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: { perView: 1 },
    slideChanged(slider) {
      const rel = slider.track.details.rel;
      setActiveAwardIndex(rel);
      setSeenAwardPages((prev) => (prev.includes(rel) ? prev : [...prev, rel]));
    },
    created(slider) {
      if (slider.track.details?.slides) {
        setAwardDots(
          Array.from(Array(slider.track.details.slides.length).keys()),
        );
      }
    },
    updated(slider) {
      if (slider.track.details?.slides) {
        setAwardDots(
          Array.from(Array(slider.track.details.slides.length).keys()),
        );
      }
    },
  });

  // 2. PROMO CARD SLIDER
  // Container slider ini BARU dirender setelah isLoading selesai (lihat JSX),
  // jadi keen-slider langsung dibuat dengan card asli (bukan skeleton).
  // Tidak perlu lagi update() manual / setTimeout.
  const [promoSliderRef, promoSliderInstance] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 2,
      spacing: 0,
    },
    breakpoints: {
      "(min-width: 1024px)": {
        slides: {
          perView: 4,
          spacing: 0,
        },
      },
    },
    slideChanged(slider) {
      setActiveIndex(slider.track.details.rel);
    },
    created(slider) {
      // lebar slide sudah dihitung keen-slider -> aman untuk menampilkan slider
      setPromoDots(getDotsFromSlider(slider));
      setPromoReady(true);
    },
    updated(slider) {
      // dipanggil juga saat breakpoint mobile <-> desktop berganti
      setPromoDots(getDotsFromSlider(slider));
      setActiveIndex(slider.track.details.rel);
    },
  });

  useEffect(() => {
    // simulasi loading data promo (hapus timeout ini kalau data sudah statis)
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // Skeleton tampil selama data loading ATAU slider belum siap.
  // Hanya ada SATU skeleton (PromoCardSkeleton), tidak ada skeleton di dalam slider.
  const showPromoSkeleton = isLoading || !promoReady;

  // Kartu promo muncul setelah slider siap DAN area slider terlihat di layar
  const showPromoCards = !!reduceMotion || (promoReady && isPromoInView);

  // Handler Navigasi Klik Dot
  const handleDotClick = (index: number) => {
    if (promoSliderInstance.current) {
      promoSliderInstance.current.moveToIdx(index);
    }
  };

  const handleAwardDotClick = (index: number) => {
    if (awardSliderInstance.current) {
      awardSliderInstance.current.moveToIdx(index);
    }
  };

  return (
    <div className="w-full antialiased bg-white relative overflow-hidden">
      {/* BACKGROUND GAMBAR UNTUK SELURUH HALAMAN */}
      <div className="absolute inset-x-0 top-0 bottom-48 z-0">
        <Image
          src="/informasi.jpg"
          alt="Informasi Medika Lestari Background"
          fill
          sizes="100vw"
          className="object-cover pointer-events-none select-none"
          priority
          quality={75}
        />
        <div className="absolute inset-0 bg-[#003f88]/95" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-white z-0" />

      {/* section atas */}
      <section className="relative z-10 w-full pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-[1180px] mx-auto md:px-8">
          {/* header */}
          <div className="text-center mb-16">
            <Reveal y={20}>
              <img
                src="/medikalestari.png"
                alt="Logo Medika Lestari"
                className="h-20 w-auto mx-auto mb-6 object-contain"
              />
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-2xl md:text-[45px] font-bold mb-4">
                Selamat Datang di Rumah Sakit Medika Lestari
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="max-w-4xl mx-auto text-sm md:text-base text-white/90 mb-4 leading-normal">
                Kami hadir sebagai rumah sakit umum modern di Kota Tangerang
                yang berkomitmen memberikan pelayanan kesehatan terpadu,
                profesional, dan penuh kepedulian demi kenyamanan Anda dan
                keluarga.
              </p>
            </Reveal>
          </div>

          {/* data statistik medika lestari */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 md:gap-y-12 text-center items-start mb-20">
            {STATS_DATA.map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={REVEAL_VIEWPORT}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                  ease: "easeOut",
                }}
              >
                {/* Icon */}
                <div className="relative mb-3 md:mb-4 w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20">
                  <Image
                    src={stat.icon}
                    alt={stat.text}
                    fill
                    sizes="(min-width: 1280px) 80px, (min-width: 1024px) 64px, 56px"
                    className="object-contain brightness-0 invert"
                  />
                </div>

                {/* Angka dan teks */}
                <div className="flex flex-col items-center justify-center gap-y-2 md:gap-y-3 text-center">
                  {/* Angka */}
                  <div className="text-2xl sm:text-3xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-none text-white flex-shrink-0">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Teks */}
                  <p className="text-sm md:text-xs lg:text-sm xl:text-base uppercase font-bold text-white/90 max-w-[220px] md:max-w-[150px] lg:max-w-[210px] xl:max-w-[250px] leading-tight">
                    {stat.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.hr
            className="border-white/10 my-16"
            initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: 0.9, ease: REVEAL_EASE }}
          />

          {/* SLIDER LOGO REKANAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
            {/* Sisi Kiri: Deskripsi Wilayah */}
            <div className="lg:col-span-6 text-left">
              <Reveal x={-32} y={0} className="-mt-5">
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Terhubung dengan Berbagai Mitra Layanan Kesehatan
                </h3>
              </Reveal>

              <Reveal x={-32} y={0} delay={0.1}>
                <p className="text-sm md:text-base text-white/90 font-normal mb-4 leading-normal text-justify">
                  RS Medika Lestari bekerja sama dengan sejumlah perusahaan dan
                  penyedia asuransi untuk memudahkan pasien mendapatkan layanan
                  kesehatan sesuai dengan kebutuhan mereka. Kerja sama ini juga
                  membantu pasien mengetahui pilihan layanan yang tersedia
                  melalui mitra yang telah bekerja sama dengan rumah sakit.
                </p>
              </Reveal>

              <Reveal x={-32} y={0} delay={0.2}>
                <p className="text-sm md:text-base text-white/90 font-normal leading-normal mb-8 text-justify">
                  Setiap mitra memiliki ketentuan terkait penjaminan biaya dan
                  administrasi yang perlu diperhatikan sebelum pasien menjalani
                  perawatan. Karena itu, pasien dapat memperoleh informasi
                  mengenai cakupan layanan dan persyaratan yang berlaku agar
                  proses pelayanan berjalan lebih lancar.
                </p>
              </Reveal>

              <Reveal x={-32} y={0} delay={0.3}>
                <Link href="/tentang-kami" passHref>
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-[#e67e22] hover:bg-[#3D8ECB] text-white text-xs font-semibold transition-colors duration-700 inline-flex items-center gap-2 cursor-pointer"
                  >
                    Kenali Kami Lebih Dekat
                  </button>
                </Link>
              </Reveal>
            </div>

            {/* Sisi Kanan: Slider Bungkus Kotak Putih Logo Penghargaan */}
            <div
              ref={awardsWrapperRef}
              className="lg:col-span-6 w-full overflow-hidden flex flex-col"
            >
              <div
                ref={awardSliderRef}
                className="keen-slider w-full overflow-hidden"
              >
                {/* Halaman/Grup Pertama (Logo 1-9) */}
                <div className="keen-slider__slide w-full shrink-0 grid grid-cols-3 gap-2 pr-1">
                  {AWARDS_DATA.slice(0, 9).map((award, index) => (
                    <AwardLogoBox
                      key={award.id}
                      award={award}
                      index={index}
                      show={showAwardPage(0)}
                      instant={!!reduceMotion}
                    />
                  ))}
                </div>

                {/* Halaman/Grup Kedua (Logo 10-18) */}
                <div className="keen-slider__slide w-full shrink-0 grid grid-cols-3 gap-2 pl-1">
                  {AWARDS_DATA.slice(9, 18).map((award, index) => (
                    <AwardLogoBox
                      key={award.id}
                      award={award}
                      index={index}
                      show={showAwardPage(1)}
                      instant={!!reduceMotion}
                    />
                  ))}
                </div>

                {/* Halaman/Grup Ketiga (Logo 19-27) */}
                <div className="keen-slider__slide w-full shrink-0 grid grid-cols-3 gap-2 pl-1">
                  {AWARDS_DATA.slice(18, 27).map((award, index) => (
                    <AwardLogoBox
                      key={award.id}
                      award={award}
                      index={index}
                      show={showAwardPage(2)}
                      instant={!!reduceMotion}
                    />
                  ))}
                </div>
              </div>

              {/* Indikator Dot Rekanan */}
              <Reveal delay={0.5}>
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
                            backgroundColor: isAwardActive
                              ? "#e67e22"
                              : "#ffffff",
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
                          className="absolute w-8 h-8 rounded-full border-[5px] border-white bg-white z-0 origin-center pointer-events-none "
                        />
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION BAWAH: SLIDER CARD PROMO */}
      <section className="relative z-10 w-full pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 bottom-0 top-1/3 bg-white z-0" />

        <div className="relative z-10 max-w-[1190px] mx-auto md:px-8">
          <Reveal className="-mt-10 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
              Penawaran promo spesial paket kesehatan
            </h2>
          </Reveal>

          {/* Pembungkus: skeleton (alur normal) + slider (overlay transparan sampai siap) */}
          <div ref={promoWrapperRef} className="relative w-full">
            {/* SATU-SATUNYA skeleton promo card */}
            {showPromoSkeleton && <PromoCardSkeleton count={4} />}

            {/* Slider hanya dirender setelah loading selesai.
                Selama belum siap, ia ditaruh absolut + transparan: lebarnya tetap
                terukur benar oleh keen-slider, tapi tidak terlihat (tidak ada
                kotak besar), sementara skeleton menjaga tinggi area. */}
            {!isLoading && (
              <div
                ref={promoSliderRef}
                className={`keen-slider w-full overflow-hidden ${
                  promoReady
                    ? ""
                    : "absolute inset-x-0 top-0 opacity-0 pointer-events-none"
                }`}
              >
                {PROMO_DATA.slice(0, 8).map((item, index) => (
                  <div key={item.id} className="keen-slider__slide p-2 md:p-3">
                    <motion.div
                      className="h-full"
                      variants={promoCardVariants}
                      custom={index}
                      initial={reduceMotion ? false : "hidden"}
                      animate={showPromoCards ? "visible" : "hidden"}
                    >
                      <article
                        className="bg-white border border-gray-300 flex flex-col h-full overflow-hidden transition-shadow duration-300 group"
                        onMouseEnter={() => setHoveredPromoId(item.id)}
                        onMouseLeave={() => setHoveredPromoId(null)}
                      >
                        <div className="relative aspect-square w-full overflow-hidden bg-gray-50 cursor-pointer">
                          <div className="w-full h-full">
                            <Image
                              src={item.image}
                              alt={`Promo ${item.title}`}
                              width={500}
                              height={500}
                              className="object-cover w-full h-full"
                              priority={item.id <= 4}
                            />
                          </div>
                        </div>

                        <div className="p-4 md:p-10 flex flex-col grow text-center bg-white">
                          <Link href={`/promo/${item.id}`} passHref>
                            <h3 className="text-xl md:text-xl font-bold text-[#003f88] mb-2 min-h-12 flex items-center justify-center leading-normal cursor-pointer hover:text-[#e67e22] transition-colors duration-300">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-[10px] md:text-xs text-gray-500 leading-normal mb-5 line-clamp-3 md:line-clamp-4 cursor-default mt-10">
                            {item.description}
                          </p>
                          <div className="mt-auto">
                            <Link href={`/promo/${item.id}`} passHref>
                              <button
                                type="button"
                                className={`w-full py-2 text-white text-[10px] md:text-xs font-semibold transition-all duration-700 cursor-pointer ${
                                  hoveredPromoId === item.id
                                    ? "bg-[#e67e22]"
                                    : "bg-[#003f88] hover:bg-[#e67e22]"
                                }`}
                              >
                                → Selengkapnya
                              </button>
                            </Link>
                          </div>
                        </div>
                      </article>
                    </motion.div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* dot card promo (min-h-8 menjaga tinggi supaya tidak loncat saat dot muncul) */}
          <Reveal delay={0.1}>
            <div className="mt-8 flex min-h-8 items-center justify-center gap-4">
              {promoReady &&
                promoDots.map((index) => {
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
                          backgroundColor: isActive ? "#ffffff" : "#3D8ECB",
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute w-5 h-5 rounded-full z-10 pointer-events-none"
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
                        className="absolute w-9 h-9 rounded-full border-[5px] border-[#3D8ECB] bg-[#3D8ECB] z-0 origin-center pointer-events-none"
                      />
                    </button>
                  );
                })}
            </div>
          </Reveal>

          {/* Lihat Semua Promo Link */}
          <Reveal delay={0.15} className="mt-12 text-center">
            <Link href="/promo" passHref>
              <span className="text-sm md:text-base font-semibold text-[#3D8ECB] hover:text-[#e67e22] hover:underline transition-all duration-700 cursor-pointer inline-block">
                Lihat Semua Promo <span className="text-base">→</span>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default PromoKesehatan;
