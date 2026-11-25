"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useKeenSlider } from "keen-slider/react";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";

// data asuransi rekanan (27 item)
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

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export default function AsuransiRekanPage() {
  const [activeAwardIndex, setActiveAwardIndex] = useState(0);

  // inisialisasi keen slider
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setActiveAwardIndex(slider.track.details.rel);
    },
    loop: true,
  });

  // hitung jumlah halaman dot (27 data / 9 per halaman = 3 halaman)
  const totalPages = Math.ceil(ASURANSI_DATA.length / 9);
  const awardDots = Array.from({ length: totalPages }, (_, i) => i);

  // handler klik dot slider
  const handleAwardDotClick = (index: number) => {
    instanceRef.current?.moveToIdx(index);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* bagian header */}
      <section className="w-full py-8 md:py-15 pb-3 md:pb-4 bg-white">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8 py-0 md:py-2">
          {/* navigasi breadcrumb */}
          <motion.nav
            className="mb-6"
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          >
            <div className="flex items-center gap-1 text-[14px] font-normal">
              <Link
                href="/"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                Beranda
              </Link>
              <ChevronRight
                size={12}
                className="text-slate-400"
                aria-hidden="true"
              />
              <span className="font-normal text-slate-900">Asuransi Rekanan</span>
            </div>
          </motion.nav>

          <motion.h1
            className="text-4xl md:text-4xl font-bold text-slate-900"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.06, ease: EASE_SMOOTH }}
          >
            Asuransi dan Rekanan
          </motion.h1>
        </div>
      </section>

      {/* konten utama */}
      <section className="w-full pt-4 md:pt-5 pb-20 bg-white">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-9 items-start">
            {/* informasi penjaminan */}
            <motion.div
              className="lg:col-span-5 text-slate-900"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.12, ease: EASE_SMOOTH }}
            >
              <h2 className="text-2xl md:text-[26px] font-semibold tracking-[-0.02em] leading-[1.3] text-slate-900">
                Ketentuan Layanan Asuransi dan Penjaminan
              </h2>
              <p className="mt-3 text-[14px] leading-[1.65] text-slate-600 font-normal">
                Pasien peserta asuransi maupun jaminan perusahaan dapat
                memanfaatkan layanan rawat jalan, rawat inap, serta pemeriksaan
                penunjang medis di RS Medika Lestari sesuai cakupan polis yang
                berlaku.
              </p>

              <div className="mt-5 space-y-4 border-t border-slate-200 pt-5">
                <div>
                  <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-slate-900">
                    Pendaftaran dan Verifikasi Kepesertaan
                  </h3>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-slate-600 font-normal">
                    Siapkan kartu kepesertaan asuransi dan kartu identitas resmi
                    (KTP atau KIA) saat mendaftar di loket admisi sebelum
                    pemeriksaan dokter.
                  </p>
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-slate-900">
                    Cakupan Manfaat dan Selisih Biaya
                  </h3>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-slate-600 font-normal">
                    Penjaminan biaya mengikuti ketentuan masing-masing penanggung
                    dan TPA. Apabila terdapat selisih tarif atau tindakan di luar
                    manfaat polis, penyelesaiannya menjadi tanggungan pasien.
                  </p>
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-slate-900">
                    Rawat Inap dan Tindakan Terencana
                  </h3>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-slate-600 font-normal">
                    Untuk rencana rawat inap atau tindakan medis lanjutan,
                    pastikan status jaminan telah terkonfirmasi oleh pihak
                    asuransi melalui bagian administrasi rumah sakit.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* grid logo asuransi */}
            <div className="lg:col-span-7">
              <div ref={sliderRef} className="keen-slider overflow-hidden">
                {/* halaman 1 (logo 1-9) */}
                <div className="keen-slider__slide w-full shrink-0 grid grid-cols-3 gap-2 sm:gap-2.5">
                  {ASURANSI_DATA.slice(0, 9).map((award, idx) => (
                    <motion.div
                      key={award.id}
                      title={award.alt}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.14 + idx * 0.03,
                        ease: EASE_SMOOTH,
                      }}
                      className="bg-white border border-slate-200 p-2.5 sm:p-3.5 aspect-[4/3] flex items-center justify-center transition-colors duration-200 hover:border-slate-300"
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
                    </motion.div>
                  ))}
                </div>

                {/* halaman 2 (logo 10-18) */}
                <div className="keen-slider__slide w-full shrink-0 grid grid-cols-3 gap-2 sm:gap-2.5">
                  {ASURANSI_DATA.slice(9, 18).map((award) => (
                    <div
                      key={award.id}
                      title={award.alt}
                      className="bg-white border border-slate-200 p-2.5 sm:p-3.5 aspect-[4/3] flex items-center justify-center transition-colors duration-200 hover:border-slate-300"
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

                {/* halaman 3 (logo 19-27) */}
                <div className="keen-slider__slide w-full shrink-0 grid grid-cols-3 gap-2 sm:gap-2.5">
                  {ASURANSI_DATA.slice(18, 27).map((award) => (
                    <div
                      key={award.id}
                      title={award.alt}
                      className="bg-white border border-slate-200 p-2.5 sm:p-3.5 aspect-[4/3] flex items-center justify-center transition-colors duration-200 hover:border-slate-300"
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

              {/* indikator dot rekanan */}
              <motion.div
                className="mt-7 flex items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, delay: 0.35, ease: EASE_SMOOTH }}
              >
                {awardDots.map((index) => {
                  const isAwardActive = index === activeAwardIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAwardDotClick(index)}
                      className="focus:outline-none flex items-center justify-center h-8 w-8 relative cursor-pointer mb-5 md:mb-none"
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}