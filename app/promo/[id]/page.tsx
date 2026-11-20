"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Phone, X } from "lucide-react";
import PromoCardSkeleton from "@/components/PromoCardSkeleton";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

// Data mentah paket promo rumah sakit
const PROMO_DATA = [
  {
    id: 1,
    title: "Vaksin Influenza & Prevenar",
    shortDescription:
      "Lindungi diri dan keluarga dari virus Influenza dan bakteri Pneumonia dengan paket vaksinasi komprehensif.",
    image: "/images/promo/paket1.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-black mb-4">Vaksin Influenza & Prevenar</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Vaksin Influenza dan Prevenar adalah solusi perlindungan kesehatan yang komprehensif untuk Anda dan seluruh keluarga. 
        Dengan teknologi vaksin terkini, kami memberikan perlindungan maksimal terhadap virus influenza dan bakteri pneumonia.
      </p>
      <h4 class="text-2xl font-semibold text-black mt-6 mb-3">Keuntungan Layanan Kami:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Vaksin berkualitas tinggi dari produsen terpercaya</li>
        <li>Tenaga medis profesional dan berpengalaman</li>
        <li>Fasilitas kesehatan modern dan steril</li>
        <li>Pencatatan riwayat vaksin digital</li>
        <li>Konsultasi gratis sebelum vaksinasi</li>
      </ul>
    `,
  },
  {
    id: 2,
    title: "Sirkumsisi Anak (Khitan)",
    shortDescription:
      "Layanan khitan anak dengan metode modern yang minim nyeri, proses penyembuhan cepat.",
    image: "/images/promo/paket2.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-black mb-4">Sirkumsisi Anak (Khitan)</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Layanan khitan kami menggunakan metode modern dengan teknologi terkini untuk memastikan prosedur yang aman, minim nyeri, 
        dan pemulihan yang cepat. Tim dokter kami berpengalaman dalam menangani sirkumsisi anak dengan pendekatan yang profesional and penuh perhatian.
      </p>
      <h4 class="text-2xl font-semibold text-black mt-6 mb-3">Metode & Keunggulan:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Metode modern dengan minimal invasive</li>
        <li>Anestesi lokal untuk kenyamanan maksimal</li>
        <li>Penyembuhan cepat dalam 7-10 hari</li>
        <li>Perawatan pasca-operasi lengkap</li>
        <li>Konsultasi pre dan post operasi gratis</li>
      </ul>
    `,
  },
  {
    id: 3,
    title: "Skrining Batu Empedu",
    shortDescription:
      "Deteksi dini adanya batu empedu melalui pemeriksaan radiologi dan laboratorium.",
    image: "/images/promo/paket3.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-black mb-4">Skrining Batu Empedu</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Skrining batu empedu kami menggunakan teknologi ultrasonografi (USG) dan pemeriksaan laboratorium terkini untuk mendeteksi 
        keberadaan batu empedu secara dini. Deteksi dini ini penting untuk mencegah komplikasi serius.
      </p>

      <h4 class="text-2xl font-semibold text-black mt-6 mb-3">Jenis Pemeriksaan:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Ultrasonografi (USG) abdomen</li>
        <li>Tes fungsi hati</li>
        <li>Tes laboratorium lengkap</li>
        <li>Konsultasi dengan dokter spesialis</li>
        <li>Laporan hasil lengkap dan penjelasan</li>
      </ul>
    `,
  },
  {
    id: 4,
    title: "Persalinan Bunda",
    shortDescription:
      "Wujudkan momen kelahiran buah hati yang aman dan nyaman dengan paket persalinan lengkap.",
    image: "/images/promo/paket4.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-black mb-4">Persalinan Bunda</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Paket persalinan Bunda kami dirancang khusus untuk memberikan pengalaman persalinan yang aman, nyaman, dan berkesan bagi ibu dan bayi. 
        Dengan dukungan tim medis profesional dan fasilitas modern, kami siap mendampingi momen spesial Anda.
      </p>
      <h4 class="text-2xl font-semibold text-black mt-6 mb-3">Fasilitas & Layanan:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Ruang bersalin modern dan nyaman</li>
        <li>Dokter obgin berpengalaman</li>
        <li>Anestesi epidural tersedia</li>
        <li>Fasilitas ibu hamil dan bayi sehat</li>
        <li>Rawat inap pasca persalinan 2-3 hari</li>
      </ul>
    `,
  },
  {
    id: 5,
    title: "Persalinan ERACS",
    shortDescription:
      "Metode persalinan caesar ERACS untuk pemulihan yang jauh lebih cepat.",
    image: "/images/promo/paket5.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-text-black mb-4">Persalinan ERACS</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        ERACS (Early Rehabilitation After Cesarean Section) adalah metode persalinan caesar modern yang memungkinkan pemulihan lebih cepat. 
        Dengan teknik ini, ibu dapat bergerak lebih cepat dan kembali ke aktivitas normal dalam waktu singkat.
      </p>

      <h4 class="text-2xl font-semibold text-text-black mt-6 mb-3">Keunggulan ERACS:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Pemulihan 3-5x lebih cepat</li>
        <li>Mobilisasi dini pasca operasi</li>
        <li>Mengurangi risiko komplikasi</li>
        <li>Ibu dapat menyusui lebih cepat</li>
        <li>Teknik minimal invasive modern</li>
      </ul>
    `,
  },
  {
    id: 6,
    title: "Operasi Mata Katarak",
    shortDescription:
      "Kembalikan kejernihan penglihatan Anda dengan prosedur operasi katarak teknologi Phacoemulsification.",
    image: "/images/promo/paket6.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-black mb-4">Operasi Mata Katarak</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Operasi katarak kami menggunakan teknologi Phacoemulsification, metode modern yang memungkinkan lensa yang keruh dihancurkan dan dihisap 
        melalui sayatan kecil. Teknik ini memberikan hasil penglihatan yang lebih baik dengan pemulihan cepat.
      </p>

      <h4 class="text-2xl font-semibold text-text-black mt-6 mb-3">Teknologi & Keunggulan:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Teknologi Phacoemulsification terkini</li>
        <li>Dokter spesialis mata berpengalaman</li>
        <li>Sayatan minimal (2-3mm)</li>
        <li>Lensa intraokular berkualitas</li>
        <li>Pemulihan penglihatan dalam 1-2 minggu</li>
      </ul>
    `,
  },
  {
    id: 7,
    title: "Medical Checkup Jamaah Haji",
    shortDescription:
      "Pemeriksaan kesehatan menyeluruh bagi calon jamaah haji untuk memastikan kondisi fisik prima.",
    image: "/images/promo/paket7.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-black mb-4">Medical Checkup Jamaah Haji</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Program medical checkup khusus untuk calon jamaah haji kami dirancang untuk memastikan kondisi kesehatan Anda prima sebelum menunaikan ibadah haji. 
        Pemeriksaan komprehensif ini mencakup berbagai tes untuk memastikan Anda siap secara fisik.
      </p>

      <h4 class="text-2xl font-semibold text-black mt-6 mb-3">Pemeriksaan Meliputi:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Pemeriksaan fisik lengkap</li>
        <li>Tes laboratorium komprehensif</li>
        <li>Pemeriksaan jantung dan paru</li>
        <li>Vaksinasi sesuai persyaratan</li>
        <li>Konsultasi kesehatan untuk haji</li>
      </ul>
    `,
  },
  {
    id: 8,
    title: "Tes Bebas Narkoba",
    shortDescription:
      "Layanan uji saring narkoba yang cepat, akurat, dan rahasia untuk keperluan edukasi, kerja, maupun instansi.",
    image: "/images/promo/paket8.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-black mb-4">Tes Bebas Narkoba</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Layanan tes narkoba kami menyediakan pemeriksaan yang cepat, akurat, dan terjaga kerahasiaannya. Kami melayani pemeriksaan untuk keperluan 
        edukasi, rekrutmen kerja, atau persyaratan instansi dengan standar internasional.
      </p>

      <h4 class="text-2xl font-semibold text-black mt-6 mb-3">Jenis Tes & Layanan:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Tes urine dan darah</li>
        <li>Hasil cepat 24-48 jam</li>
        <li>Kerahasiaan terjamin</li>
        <li>Sertifikat resmi dan legal</li>
        <li>Standar laboratorium internasional</li>
      </ul>
    `,
  },
  {
    id: 9,
    title: "Medical Checkup ART & Driver",
    shortDescription:
      "Pemeriksaan kesehatan menyeluruh bagi asisten rumah tangga dan pengemudi demi kenyamanan dan keamanan keluarga Anda.",
    image: "/images/promo/paket9.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-black mb-4">Medical Checkup ART & Driver</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Program medical checkup khusus untuk asisten rumah tangga (ART) dan pengemudi kami dirancang untuk memastikan mereka dalam kondisi 
        kesehatan yang baik sehingga dapat menjalankan tugas mereka dengan aman dan berkualitas.
      </p>

      <h4 class="text-2xl font-semibold text-black mt-6 mb-3">Pemeriksaan Mencakup:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Pemeriksaan kesehatan umum</li>
        <li>Tes laboratorium lengkap</li>
        <li>Tes kesehatan penglihatan dan pendengaran</li>
        <li>Pemeriksaan kesehatan mental</li>
        <li>Sertifikat kesehatan kerja</li>
      </ul>
    `,
  },
  {
    id: 10,
    title: "Pap Smear",
    shortDescription:
      "Deteksi dini kanker serviks (leher rahim) melalui pemeriksaan sitologi yang aman dan ditangani oleh tim medis ahli.",
    image: "/images/promo/paket10.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-black mb-4">Pap Smear</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Pap smear adalah pemeriksaan sitologi penting untuk deteksi dini kanker serviks (leher rahim) pada wanita. Pemeriksaan ini dilakukan 
        oleh tim medis ahli dengan peralatan modern untuk hasil yang akurat dan aman.
      </p>

      <h4 class="text-2xl font-semibold text-text-black mt-6 mb-3">Pentingnya Pap Smear:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Deteksi dini kanker serviks</li>
        <li>Deteksi infeksi HPV</li>
        <li>Prosedur cepat dan tidak menyakitkan</li>
        <li>Hasil akurat dalam 1-2 minggu</li>
        <li>Berkontribusi dalam pencegahan kanker</li>
      </ul>
    `,
  },
  {
    id: 11,
    title: "Antenatal Care",
    shortDescription:
      "Pemeriksaan kehamilan berkala untuk memantau kesehatan ibu dan tumbuh kembang janin secara optimal.",
    image: "/images/promo/paket11.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-black mb-4">Antenatal Care</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Program Antenatal Care kami adalah layanan pemeriksaan kehamilan berkala yang komprehensif untuk memantau kesehatan ibu hamil dan 
        perkembangan janin. Dengan pemeriksaan rutin, kami memastikan kehamilan Anda berjalan dengan optimal dan aman.
      </p>

      <h4 class="text-2xl font-semibold text-black mt-6 mb-3">Layanan Antenatal Care:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Pemeriksaan rutin selama kehamilan</li>
        <li>USG 4D berkala</li>
        <li>Tes laboratorium ibu hamil</li>
        <li>Edukasi kesehatan kehamilan</li>
        <li>Monitoring kesehatan janin real-time</li>
      </ul>
    `,
  },
  {
    id: 12,
    title: "Imun Booster",
    shortDescription:
      "Tingkatkan daya tahan dan kebugaran tubuh secara instan dengan injeksi vitamin dan nutrisi esensial.",
    image: "/images/promo/paket12.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-text-black mb-4">Imun Booster</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Layanan Imun Booster kami menyediakan injeksi vitamin dan nutrisi esensial untuk meningkatkan daya tahan tubuh dan kebugaran secara instan. 
        Cocok untuk mereka yang memiliki aktivitas tinggi atau ingin menjaga kesehatan preventif.
      </p>

      <h4 class="text-2xl font-semibold text-text-black mt-6 mb-3">Komposisi Imun Booster:</h4>
      <ul class="list-disc list-inside text-gray-700 space-y-2">
        <li>Vitamin C dan Vitamin D tinggi</li>
        <li>Mineral esensial dan antioxidant</li>
        <li>Amino acid dan protein</li>
        <li>Efek langsung dalam 24-48 jam</li>
        <li>Dapat diulang setiap bulan</li>
      </ul>
    `,
  },
];

// Kelas bersama untuk kolom formulir
const labelClass = "block mb-1.5 text-sm font-semibold text-slate-800";
const fieldClass =
  "w-full h-12 px-4 bg-white border border-slate-400 rounded-sm text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-[#003f88] focus:ring-1 focus:ring-[#003f88]";
const textareaClass =
  "w-full px-4 py-3 bg-white border border-slate-400 rounded-sm text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors resize-none focus:border-[#003f88] focus:ring-1 focus:ring-[#003f88]";

export default function PromoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const numId = Number.parseInt(id, 10);

  const [relatedIndex, setRelatedIndex] = useState(0);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [relatedItemsPerGroup, setRelatedItemsPerGroup] = useState(4);

  const promo = PROMO_DATA.find((item) => item.id === numId);
  const relatedPromos = PROMO_DATA.filter((p) => p.id !== numId);

  // State untuk melacak jumlah langkah indeks maksimal yang bisa digeser
  const [totalRelatedDots, setTotalRelatedDots] = useState(0);

  // State Form WhatsApp & Data Input
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noTelepon: "",
    usia: "",
    keluhan: "",
  });

  // --- INTEGRASI KEEN SLIDER ---
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: relatedItemsPerGroup === 4 ? 4 : 2,
      spacing: 0,
    },
    created(slider) {
      if (slider.track.details) {
        setTotalRelatedDots(slider.track.details.maxIdx + 1);
      }
    },
    updated(slider) {
      if (slider.track.details) {
        setTotalRelatedDots(slider.track.details.maxIdx + 1);
      }
    },
    slideChanged(slider) {
      setRelatedIndex(slider.track.details.rel);
    },
  });

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update({
        slides: {
          perView: relatedItemsPerGroup === 4 ? 4 : 2,
          spacing: 0,
        },
      });
    }
  }, [relatedItemsPerGroup, instanceRef]);

  const [hoveredRelatedPromoId, setHoveredRelatedPromoId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setRelatedItemsPerGroup(4);
      } else {
        setRelatedItemsPerGroup(2);
      }
      setRelatedIndex(0);
      if (instanceRef.current) instanceRef.current.moveToIdx(0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => {
      setIsLoadingRelated(false);
    }, 800);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [instanceRef]);

  const handleRelatedDotClick = (index: number) => {
    setRelatedIndex(index);
    if (instanceRef.current) {
      instanceRef.current.moveToIdx(index);
    }
  };

  // Mengunci scroll latar belakang saat modal form WhatsApp terbuka
  useEffect(() => {
    if (!showWhatsAppForm) return;

    // Kunci scroll latar belakang: bekukan posisi body, lalu pulihkan saat ditutup
    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollY);
    };
  }, [showWhatsAppForm]);

  // Handler Perubahan Form Input
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler Submit Form WhatsApp
  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message =
      `Halo, saya ingin mendaftar paket kesehatan.\n\n` +
      `• Nama: ${formData.nama}\n` +
      `• No. Telepon: ${formData.noTelepon}\n` +
      `• Usia: ${formData.usia} tahun\n` +
      `• Paket: ${promo?.title || ""}\n` +
      `• Catatan/Keluhan: ${formData.keluhan || "-"}`;

    const whatsappUrl =
      "https://wa.me/6285717028133?text=" + encodeURIComponent(message);
    window.open(whatsappUrl, "_blank");
    setShowWhatsAppForm(false);
    setFormData({ nama: "", email: "", noTelepon: "", usia: "", keluhan: "" });
  };

  if (!promo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#003f88] mb-4">
            Promo tidak ditemukan
          </h1>
          <Link href="/" className="text-[#e67e22] hover:text-[#003f88]">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <main className="max-w-[1175px] mx-auto px-4 md:px-8">
        {/* Breadcrumb & Header */}
        <header className="mb-8 md:mb-12 border-b border-slate-100 pb-6 pt-8 md:pt-17">
          <nav
            className="flex items-center gap-1 text-[14px] text-gray-300 mb-4"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight
              size={12}
              className="text-black/60"
              aria-hidden="true"
            />
            <Link
              href="/promo"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Promo
            </Link>
            <ChevronRight
              size={12}
              className="text-black/60"
              aria-hidden="true"
            />
            <span className="font-normal text-gray-300" aria-current="page">
              {promo.title}
            </span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            {promo.title}
          </h1>
          <p className="text-slate-600">{promo.shortDescription}</p>
        </header>

        {/* Content Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <section className="flex flex-col">
            <div className="relative w-full aspect-square overflow-hidden shadow-lg bg-gray-100">
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center italic">
              {promo.shortDescription}
            </p>
          </section>

          <section className="flex flex-col">
            <article
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: promo.fullDescription,
              }}
            />

            {/* CTA Buttons  */}
            <div className="flex flex-row gap-2 sm:flex-row gap-3 w-full mt-6 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowWhatsAppForm(true)}
                className="flex-1 px-5 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 transition-colors duration-700 text-white text-sm font-semibold rounded  flex items-center justify-center gap-2 cursor-pointer"
              >
                <Image
                  src="/images/icons/whatsapp-fill.svg"
                  alt="WhatsApp"
                  width={22}
                  height={22}
                  className="invert"
                />
                <span>Booking</span>
              </button>

              <a
                href="tel:+6285717028133"
                className="flex-1 px-5 py-3 bg-[#003f88] hover:bg-blue-800 active:bg-blue-900 transition-colors duration-700 text-white text-sm font-semibold rounded transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                <span>Hubungi Kami</span>
              </a>
            </div>
          </section>
        </div>

        {/* Carousel Promo Lainnya */}
        <section className="pt-16 pb-16 mt-12 border-t border-slate-100">
          <div className="w-full">
            <header className="mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Promo Lainnya
              </h2>
            </header>

            <div className="w-full overflow-hidden py-1 relative">
              {isLoadingRelated ? (
                <PromoCardSkeleton count={relatedItemsPerGroup} />
              ) : (
                <div className="w-full overflow-hidden -mx-2 lg:-mx-3">
                  <div
                    ref={sliderRef}
                    className="keen-slider flex"
                    style={{ width: "100%" }}
                  >
                    {relatedPromos.map((relatedPromo) => (
                      <div
                        key={`promo-${relatedPromo.id}`}
                        className="keen-slider__slide w-1/2 lg:w-1/4 shrink-0 grow-0 space-y-0 p-2 lg:p-3 box-border"
                      >
                        <article
                          className="bg-white border border-gray-300 flex flex-col h-full rounded-none overflow-hidden transition-all duration-300 origin-center"
                          onMouseEnter={() =>
                            setHoveredRelatedPromoId(relatedPromo.id)
                          }
                          onMouseLeave={() => setHoveredRelatedPromoId(null)}
                        >
                          <div className="relative aspect-square w-full overflow-hidden bg-gray-50 cursor-pointer">
                            <motion.div
                              className="w-full h-full"
                              animate={{
                                scale:
                                  hoveredRelatedPromoId === relatedPromo.id
                                    ? 1.1
                                    : 1,
                              }}
                              transition={{
                                type: "tween",
                                duration: 0.6,
                                ease: "easeInOut",
                              }}
                            >
                              <Image
                                src={relatedPromo.image}
                                alt={`Promo ${relatedPromo.title}`}
                                width={500}
                                height={500}
                                className="object-cover w-full h-full"
                                priority={relatedPromo.id <= 4}
                              />
                            </motion.div>
                          </div>

                          <div className="p-4 md:p-5 flex flex-col grow text-center bg-white">
                            <Link href={`/promo/${relatedPromo.id}`} passHref>
                              <h3 className="text-xl md:text-xl font-bold text-[#003f88] mb-2 min-h-12 flex items-center justify-center leading-normal cursor-pointer hover:text-[#e67e22] transition-colors duration-300">
                                {relatedPromo.title}
                              </h3>
                            </Link>
                            <p className="text-[10px] md:text-xs text-gray-500 leading-normal mb-5 line-clamp-3 md:line-clamp-4 cursor-default mt-10">
                              {relatedPromo.shortDescription}
                            </p>
                            <div className="mt-auto">
                              <Link href={`/promo/${relatedPromo.id}`} passHref>
                                <button
                                  type="button"
                                  className={`w-full py-2.5 border text-white text-xs font-semibold transition-all duration-700 cursor-pointer ${
                                    hoveredRelatedPromoId === relatedPromo.id
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
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dots Carousel */}
            <div className="mt-8 flex items-center justify-center gap-4 mb-12 md:mb-0">
              {Array.from({ length: totalRelatedDots }).map((_, index) => {
                const isActive = index === relatedIndex;
                const dotKey = `promo-carousel-dot-${numId}-${index}`;
                return (
                  <button
                    key={dotKey}
                    type="button"
                    onClick={() => handleRelatedDotClick(index)}
                    className="focus:outline-none flex items-center justify-center h-8 w-8 relative"
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <motion.div
                      animate={{
                        backgroundColor: isActive ? "#ffffff" : "#003f88",
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
                      className="absolute w-9 h-9 rounded-full border-4 border-[#003f88] bg-[#003f88] z-0 origin-center pointer-events-none"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* WhatsApp Form Modal */}
      {showWhatsAppForm && (
        <div
          suppressHydrationWarning
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wa-form-title"
            className="bg-white rounded-sm w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl"
          >
            {/* Modal Header */}
            <div className="shrink-0 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-200">
              <h2
                id="wa-form-title"
                className="text-2xl font-bold text-slate-900 leading-tight"
              >
                Formulir Pemesanan
              </h2>
              <button
                type="button"
                onClick={() => setShowWhatsAppForm(false)}
                aria-label="Tutup"
                className="-mr-1 w-12 h-12 flex items-center justify-center text-slate-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003f88]"
              >
                <X size={40} strokeWidth={1.75} />
              </button>
            </div>

            {/* Modal Content / Form */}
            <form
              onSubmit={handleWhatsAppSubmit}
              className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-6 space-y-5"
            >
              <div>
                <label htmlFor="nama" className={labelClass}>
                  Nama lengkap <span className="text-red-600">*</span>
                </label>
                <input
                  id="nama"
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  required
                  className={fieldClass}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label htmlFor="noTelepon" className={labelClass}>
                  Nomor telepon <span className="text-red-600">*</span>
                </label>
                <input
                  id="noTelepon"
                  type="tel"
                  name="noTelepon"
                  value={formData.noTelepon}
                  onChange={handleFormChange}
                  required
                  className={fieldClass}
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div>
                <label htmlFor="usia" className={labelClass}>
                  Usia <span className="text-red-600">*</span>
                </label>
                <input
                  id="usia"
                  type="number"
                  name="usia"
                  value={formData.usia}
                  onChange={handleFormChange}
                  required
                  className={fieldClass}
                  placeholder="Masukkan usia"
                />
              </div>

              <div>
                <label htmlFor="keluhan" className={labelClass}>
                  Keluhan / catatan
                </label>
                <textarea
                  id="keluhan"
                  name="keluhan"
                  value={formData.keluhan}
                  onChange={handleFormChange}
                  className={textareaClass}
                  placeholder="Masukkan keluhan atau catatan (opsional)"
                  rows={3}
                />
              </div>

              {/* Paket Info */}
              <div className="bg-slate-50 border border-slate-300 border-l-4 border-l-[#003f88] px-4 py-3">
                <p className="text-sm text-slate-800">
                  <span className="font-semibold text-[#003f88]">Paket:</span>{" "}
                  {promo.title}
                </p>
              </div>

              {/* Buttons Action */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppForm(false)}
                  className="flex-1 h-12 border border-slate-400 text-slate-800 font-semibold text-[15px] rounded-sm hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003f88]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-[#003f88] hover:bg-[#00306a] text-white font-semibold text-[15px] rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003f88]"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
