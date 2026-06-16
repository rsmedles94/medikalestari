"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone, MapPin, Check } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";
import { MCU_DATA } from "../data";

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

  // Filter paket lainnya untuk slider
  const relatedPromos = MCU_DATA.filter((item) => item.id !== mcu?.id);

  // Inisialisasi Keen Slider responsif (Mobile swipe, Desktop slider/grid)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 3, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4, spacing: 24 },
      },
    },
    slides: { perView: 2, spacing: 12 }, // Default mobile view (slide ke kanan)
  });

  // Mengambil nilai perView secara aman hanya jika sudah loaded
  const currentOptions = loaded ? instanceRef.current?.options : undefined;
  const currentPerView =
    currentOptions &&
    typeof currentOptions.slides === "object" &&
    currentOptions.slides !== null
      ? ((currentOptions.slides as { perView?: number }).perView ?? 2)
      : 2;

  // Hitung jumlah dot berdasarkan sisa slide yang bisa digeser secara aman
  const totalDots = loaded && instanceRef.current
    ? instanceRef.current.track.details.slides.length - currentPerView + 1
    : 0;

  const safeTotalDots = totalDots > 0 ? totalDots : relatedPromos.length;

  React.useEffect(() => {
    if (showWhatsAppForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showWhatsAppForm]);

  if (!mcu) {
    return (
      <article className="min-h-screen bg-white w-full">
        <div className="w-full max-w-[1139px] mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Paket MCU Tidak Ditemukan
          </h1>
          <Link
            href="/medical-checkup"
            className="text-[#003f88] hover:underline"
          >
            Kembali ke daftar paket
          </Link>
        </div>
      </article>
    );
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Halo, saya ingin mendaftar paket MCU ${mcu.title}
    
Nama: ${formData.nama}
No. Telepon: ${formData.noTelepon}
Usia: ${formData.usia}
Keluhan/Catatan: ${formData.keluhan}`;

    const whatsappUrl =
      "https://wa.me/6285717028133?text=" + encodeURIComponent(message);
    window.open(whatsappUrl, "_blank");
    setShowWhatsAppForm(false);
    setFormData({ nama: "", email: "", noTelepon: "", usia: "", keluhan: "" });
  };

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
          <li className="text-black/60">
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
          <li className="text-black/60">
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
            <div className="mb-8">
              <span className="text-3xl md:text-4xl font-bold text-[#003f88]">
                {mcu.price}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowWhatsAppForm(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Image
                  src="/images/icons/whatsapp-fill.svg"
                  alt="WhatsApp"
                  width={22}
                  height={22}
                  className="invert"
                />
                <span className="text-center">Pesan via WhatsApp</span>
              </button>
              <a
                href="tel:+6285717028133"
                className="flex-1 sm:flex-none px-4 py-2.5 bg-[#003f88] hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                <span className="text-center">Hubungi Kami</span>
              </a>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="mb-12 pb-12 border-b border-gray-200">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: mcu.fullDescription }}
          />
        </section>

        {/* Benefits & Examinations Tabs */}
        <section className="mb-12">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
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
            <div role="tabpanel" className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Manfaat Paket {mcu.title}
              </h3>
              <ul className="space-y-3">
                {mcu.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Check
                      className="text-green-500 shrink-0 mt-0.5"
                      size={20}
                    />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedTab === "exams" && mcu.examinations && (
            <div role="tabpanel" className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Pemeriksaan yang Termasuk
              </h3>
              <ul className="space-y-3">
                {mcu.examinations.map((exam) => (
                  <li
                    key={exam}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Check
                      className="text-green-500 shrink-0 mt-0.5"
                      size={20}
                    />
                    <span className="text-gray-700">{exam}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Other Packages */}
        <section className="pt-16 pb-16 mt-12 border-t border-slate-100">
          <div className="w-full">
            <header className="mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
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
                        <div className="w-full relative bg-gray-50 cursor-pointer overflow-hidden flex items-center justify-center">
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
                        </div>

                        {/* Content Area */}
                        <div className="p-4 md:p-10 flex flex-col grow text-center bg-white">
                          <Link href={`/medical-checkup/${item.id}`} passHref>
                            <h3 className="text-sm md:text-xl font-bold text-[#003f88] mb-2 min-h-12 flex items-center justify-center leading-normal cursor-pointer hover:text-[#e67e22] transition-colors duration-300 line-clamp-2">
                              {item.title}
                            </h3>
                          </Link>

                          <p className="text-[#e67e22] font-bold text-xs md:text-base mb-5 mt-auto">
                            {item.price}
                          </p>

                          {/* Tombol Aksi Selengkapnya */}
                          <div className="mt-auto">
                            <Link href={`/medical-checkup/${item.id}`} passHref>
                              <button
                                type="button"
                                className="w-full py-2 text-white text-[10px] md:text-xs font-semibold transition-all duration-500 cursor-pointer bg-[#003f88] group-hover:bg-[#e67e22] hover:bg-[#e67e22]"
                              >
                                ⭢ Selengkapnya
                              </button>
                            </Link>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* DOTS INDICATOR - Menggunakan pengecekan 'loaded' murni untuk menghindari error ESLint */}
            {loaded && (
              <div className="mt-8 flex items-center justify-center gap-4 mb-12 md:mb-0">
                {Array.from({ length: safeTotalDots }).map((_, index) => {
                  const isActive = index === currentSlide;
                  return (
                    <button
                      key={`mcu-carousel-dot-${index}`}
                      type="button"
                      onClick={() => {
                        if (loaded) {
                          instanceRef.current?.moveToIdx(index);
                        }
                      }}
                      className="focus:outline-none flex items-center justify-center h-8 w-8 relative"
                      aria-label={`Go to slide ${index + 1}`}
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Formulir Pemesanan
              </h2>
              <button
                onClick={() => setShowWhatsAppForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleWhatsAppSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f88]"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="noTelepon"
                  value={formData.noTelepon}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f88]"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usia <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="usia"
                  value={formData.usia}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f88]"
                  placeholder="Masukkan usia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keluhan / Catatan
                </label>
                <textarea
                  name="keluhan"
                  value={formData.keluhan}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003f88] resize-none"
                  placeholder="Masukkan keluhan atau catatan (opsional)"
                  rows={3}
                />
              </div>

              {/* Paket Info */}
              <div className="bg-blue-50 p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Paket:</span> {mcu.title}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#003f88] hover:bg-[#003f88] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
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