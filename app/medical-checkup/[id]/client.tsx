"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone, Check, X } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";
import { MCU_DATA } from "../data";
import type { KeenSliderOptions } from "keen-slider";

// Type untuk slides configuration
type SlidesConfig = {
  perView?: number;
  spacing?: number;
  origin?: "auto" | "center" | number;
};

// Type untuk breakpoints
type Breakpoints = {
  [key: string]: {
    slides: SlidesConfig;
  };
};

// Kelas bersama untuk kolom formulir
const labelClass = "block mb-1.5 text-sm font-semibold text-slate-800";
const fieldClass =
  "w-full h-12 px-4 bg-white border border-slate-400 rounded-sm text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-[#003f88] focus:ring-1 focus:ring-[#003f88]";
const textareaClass =
  "w-full px-4 py-3 bg-white border border-slate-400 rounded-sm text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors resize-none focus:border-[#003f88] focus:ring-1 focus:ring-[#003f88]";

function WhatsAppIcon({
  className = "w-5 h-5 md:w-6 md:h-6",
}: {
  readonly className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

export default function MCUDetailClient({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const mcu = MCU_DATA.find((item) => item.id === id);
  const [selectedTab, setSelectedTab] = useState<"benefits" | "exams">(
    "benefits",
  );
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noTelepon: "",
    usia: "",
    keluhan: "",
  });

  // State untuk melacak dot active slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);
  const [currentPerView, setCurrentPerView] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  // Filter paket lainnya untuk slider
  const relatedPromos = useMemo(() => {
    return MCU_DATA.filter((item) => item.id !== mcu?.id);
  }, [mcu]);

  // Deteksi mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Helper function untuk mendapatkan nilai perView dari options dengan tipe yang proper
  const getPerViewValue = useCallback(
    (options: KeenSliderOptions | undefined): number => {
      if (!options) return 2;

      const slidesConfig = options.slides;
      if (
        slidesConfig &&
        typeof slidesConfig === "object" &&
        "perView" in slidesConfig
      ) {
        const perView = (slidesConfig as SlidesConfig).perView;
        return perView ?? 2;
      }
      return 2;
    },
    [],
  );

  // Inisialisasi Keen Slider responsif
  const sliderOptions: KeenSliderOptions = useMemo(
    () => ({
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created(slider) {
        setLoaded(true);
        const slidesLength = slider.track.details.slides.length;
        const perView = getPerViewValue(slider.options);
        setTotalSlides(slidesLength);
        setCurrentPerView(perView);
      },
      breakpoints: {
        "(min-width: 768px)": {
          slides: { perView: 3, spacing: 16 } as SlidesConfig,
        },
        "(min-width: 1024px)": {
          slides: { perView: 4, spacing: 24 } as SlidesConfig,
        },
      },
      slides: { perView: 2, spacing: 12 } as SlidesConfig,
    }),
    [getPerViewValue],
  );

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(sliderOptions);

  // FIX: Gunakan useEffect untuk update nilai tanpa akses ref selama render
  useEffect(() => {
    if (loaded && instanceRef.current) {
      const slidesLength = instanceRef.current.track.details.slides.length;
      const perView = getPerViewValue(instanceRef.current.options);
      setTotalSlides(slidesLength);
      setCurrentPerView(perView);
    }
  }, [loaded, instanceRef, getPerViewValue]);

  // Hitung jumlah dot berdasarkan device
  const totalDots = useMemo(() => {
    if (!loaded || totalSlides === 0) {
      return relatedPromos.length;
    }

    // Untuk mobile, selalu tampilkan 4 dot
    if (isMobile) {
      return Math.min(4, totalSlides);
    }

    // Untuk desktop, hitung berdasarkan perView
    const dots = Math.max(0, totalSlides - currentPerView + 1);
    return dots > 0 ? dots : relatedPromos.length;
  }, [loaded, totalSlides, currentPerView, isMobile, relatedPromos.length]);

  // Handler untuk navigasi dot yang aman
  const handleDotClick = useCallback(
    (index: number) => {
      if (loaded && instanceRef.current) {
        instanceRef.current.moveToIdx(index);
      }
    },
    [loaded, instanceRef],
  );

  // Handler untuk form
  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [],
  );

  const handleWhatsAppSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!mcu) return;

      const message = `Halo, saya ingin mendaftar paket MCU ${mcu.title}
      
Nama: ${formData.nama}
No. Telepon: ${formData.noTelepon}
Usia: ${formData.usia}
Keluhan/Catatan: ${formData.keluhan}`;

      const whatsappUrl =
        "https://wa.me/6285717028133?text=" + encodeURIComponent(message);
      window.open(whatsappUrl, "_blank");
      setShowWhatsAppForm(false);
      setFormData({
        nama: "",
        email: "",
        noTelepon: "",
        usia: "",
        keluhan: "",
      });
    },
    [mcu, formData],
  );

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

  // Jika mcu tidak ditemukan, render komponen error
  if (!mcu) {
    return (
      <article className="min-h-screen bg-white w-full">
        <section className="w-full max-w-[1139px] mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Paket MCU Tidak Ditemukan
          </h1>
          <Link
            href="/medical-checkup"
            className="text-[#003f88] hover:underline"
          >
            Kembali ke daftar paket
          </Link>
        </section>
      </article>
    );
  }

  return (
    <article className="min-h-screen bg-white mb-20 w-full">
      {/* Breadcrumb */}
      <nav
        className="w-full max-w-[1139px] mx-auto px-4 pt-8 md:pt-16 md:mt-1"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-1 text-sm font-normal text-gray-600">
          <li>
            <Link
              href="/"
              className="text-black/60 hover:text-gray-800 transition-colors"
            >
              Beranda
            </Link>
          </li>
          <li className="text-black/60" aria-hidden="true">
            <ChevronRight size={14} className="inline" />
          </li>
          <li>
            <Link
              href="/medical-checkup"
              className="text-black/60 hover:text-gray-800 transition-colors"
            >
              Medical Checkup
            </Link>
          </li>
          <li className="text-black/60" aria-hidden="true">
            <ChevronRight size={14} className="inline" />
          </li>
          <li aria-current="page" className="font-normal text-gray-400">
            {mcu.title}
          </li>
        </ol>
      </nav>

      <div className="w-full max-w-[1139px] mx-auto px-4 py-4 md:py-4">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <figure className="flex items-center justify-center bg-gray-50 overflow-hidden">
            <Image
              src={mcu.image}
              alt={mcu.title}
              width={500}
              height={500}
              className="w-full h-auto object-cover"
              priority
            />
          </figure>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <header>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {mcu.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {mcu.shortDescription}
              </p>
            </header>

            {/* Price */}
            <p className="mb-8 text-3xl md:text-4xl font-bold text-[#003f88]">
              {mcu.price}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowWhatsAppForm(true)}
                className="flex-1 px-4 md:px-5 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 transition-colors duration-700 text-white text-sm md:text-xl font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 md:w-7 md:h-7 shrink-0" />
                <span className="text-center">Konsultasi Paket</span>
              </button>
              <a
                href="tel:+6285717028133"
                className="flex-1 px-4 md:px-5 py-3 bg-[#003f88] hover:bg-blue-800 active:bg-blue-900 transition-colors duration-700 text-white text-sm md:text-xl font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <Phone
                  className="w-5 h-5 md:w-6 md:h-6 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-center">Hubungi Kami</span>
              </a>
            </div>
          </div>
        </section>

        {/* Description */}
        <section
          aria-label="Deskripsi Paket"
          className="mb-12 pb-12 border-b border-gray-200"
        >
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: mcu.fullDescription }}
          />
        </section>

        {/* Benefits & Examinations Tabs */}
        <section aria-label="Detail Paket" className="mb-12">
          {/* Tab Navigation */}
          <div role="tablist" className="flex border-b border-gray-200 mb-8">
            <button
              type="button"
              role="tab"
              aria-selected={selectedTab === "benefits"}
              onClick={() => setSelectedTab("benefits")}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                selectedTab === "benefits"
                  ? "text-[#003f88] border-[#003f88]"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Manfaat Paket
            </button>
            {mcu.examinations && (
              <button
                type="button"
                role="tab"
                aria-selected={selectedTab === "exams"}
                onClick={() => setSelectedTab("exams")}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                  selectedTab === "exams"
                    ? "text-[#003f88] border-[#003f88]"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                Pemeriksaan Termasuk
              </button>
            )}
          </div>

          {/* Tab Content */}
          {selectedTab === "benefits" && (
            <section role="tabpanel" className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Manfaat Paket {mcu.title}
              </h2>
              <ul className="space-y-3">
                {mcu.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Check
                      className="text-green-500 shrink-0 mt-0.5"
                      size={20}
                      aria-hidden="true"
                    />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {selectedTab === "exams" && mcu.examinations && (
            <section role="tabpanel" className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Pemeriksaan yang Termasuk
              </h2>
              <ul className="space-y-3">
                {mcu.examinations.map((exam) => (
                  <li
                    key={exam}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Check
                      className="text-green-500 shrink-0 mt-0.5"
                      size={20}
                      aria-hidden="true"
                    />
                    <span className="text-gray-700">{exam}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>

        {/* Other Packages */}
        <section
          aria-labelledby="related-mcu-heading"
          className="pt-16 pb-16 mt-12 border-t border-slate-100"
        >
          <div className="w-full">
            <header className="mb-4">
              <h2
                id="related-mcu-heading"
                className="text-2xl md:text-3xl font-bold text-black"
              >
                Paket MCU Lainnya
              </h2>
            </header>

            <div className="w-full overflow-hidden py-1 relative">
              <div className="w-full overflow-hidden">
                <div
                  ref={sliderRef}
                  className="keen-slider flex"
                  style={{ width: "100%" }}
                >
                  {relatedPromos.map((item) => (
                    <div
                      key={`mcu-related-${item.id}`}
                      className="keen-slider__slide shrink-0 grow-0 space-y-0 box-border"
                    >
                      <article className="bg-white border border-gray-300 flex flex-col h-full overflow-hidden transition-all duration-300 group">
                        {/* Image Area */}
                        <figure className="w-full relative bg-gray-50 cursor-pointer overflow-hidden flex items-center justify-center m-0">
                          <div className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700 ease-in-out">
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={500}
                              height={500}
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="w-full h-auto object-contain"
                              priority
                            />
                          </div>
                        </figure>

                        {/* Content Area */}
                        <div className="p-4 md:p-10 flex flex-col grow text-center bg-white">
                          <h3 className="text-sm md:text-xl font-bold text-[#003f88] mb-2 min-h-12 flex items-center justify-center leading-normal hover:text-[#e67e22] transition-colors duration-300 line-clamp-2">
                            <Link
                              href={`/medical-checkup/${item.id}`}
                              className="w-full h-full flex items-center justify-center"
                            >
                              {item.title}
                            </Link>
                          </h3>

                          <p className="text-[#e67e22] font-bold text-xs md:text-base mb-5 mt-auto">
                            {item.price}
                          </p>

                          {/* Tombol Aksi Selengkapnya */}
                          <div className="mt-auto">
                            <Link
                              href={`/medical-checkup/${item.id}`}
                              className="w-full py-2 text-white text-[10px] md:text-xs font-semibold transition-all duration-700 cursor-pointer bg-[#003f88] group-hover:bg-[#e67e22] hover:bg-[#e67e22] block"
                            >
                              ⭢ Selengkapnya
                            </Link>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DOTS INDICATOR - Mobile: 4 dots, Desktop: berdasarkan perView */}
            {loaded && (
              <div
                role="group"
                aria-label="Navigasi slide paket MCU lainnya"
                className="mt-8 flex items-center justify-center gap-4 mb-12 md:mb-0"
              >
                {Array.from({ length: totalDots }).map((_, index) => {
                  const isActive = index === currentSlide;
                  return (
                    <button
                      key={`mcu-carousel-dot-${index}`}
                      type="button"
                      onClick={() => handleDotClick(index)}
                      className="focus:outline-none flex items-center justify-center h-8 w-8 relative"
                      aria-label={`Go to slide ${index + 1}`}
                      aria-pressed={isActive}
                    >
                      {/* Titik Tengah Bulat */}
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
            )}
          </div>
        </section>
      </div>

      {/* WhatsApp Form Modal */}
      {showWhatsAppForm && (
        <div
          suppressHydrationWarning
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wa-form-title"
            className="bg-white rounded-sm w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl"
          >
            {/* Modal Header */}
            <header className="shrink-0 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-200">
              <h2
                id="wa-form-title"
                className="text-2xl font-bold text-slate-900 leading-tight"
              >
                Formulir Konsultasi
              </h2>
              <button
                type="button"
                onClick={() => setShowWhatsAppForm(false)}
                aria-label="Tutup"
                className="-mr-1 w-12 h-12 flex items-center justify-center text-slate-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003f88]"
              >
                <X className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.75} />
              </button>
            </header>

            {/* Modal Content */}
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
              <aside className="bg-slate-50 border border-slate-300 border-l-4 border-l-[#003f88] px-4 py-3">
                <p className="text-sm text-slate-800">
                  <span className="font-semibold text-[#003f88]">Paket:</span>{" "}
                  {mcu.title}
                </p>
              </aside>

              {/* Buttons */}
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
    </article>
  );
}
