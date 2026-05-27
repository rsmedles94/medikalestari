"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useAnimationControls } from "framer-motion";
import { ChevronRight } from "lucide-react";
import PromoCardSkeleton from "@/components/PromoCardSkeleton";

// Data promo dengan penjelasan lengkap
const PROMO_DATA = [
  {
    id: 1,
    title: "Vaksin Influenza & Prevenar",
    shortDescription:
      "Lindungi diri dan keluarga dari virus Influenza dan bakteri Pneumonia dengan paket vaksinasi komprehensif.",
    image: "/images/promo/paket1.jpeg",
    fullDescription: `
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Vaksin Influenza & Prevenar</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Vaksin Influenza dan Prevenar adalah solusi perlindungan kesehatan yang komprehensif untuk Anda dan seluruh keluarga. 
        Dengan teknologi vaksin terkini, kami memberikan perlindungan maksimal terhadap virus influenza dan bakteri pneumonia.
      </p>
      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Keuntungan Layanan Kami:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Sirkumsisi Anak (Khitan)</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Layanan khitan kami menggunakan metode modern dengan teknologi terkini untuk memastikan prosedur yang aman, minim nyeri, 
        dan pemulihan yang cepat. Tim dokter kami berpengalaman dalam menangani sirkumsisi anak dengan pendekatan yang profesional dan penuh perhatian.
      </p>
      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Metode & Keunggulan:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Skrining Batu Empedu</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Skrining batu empedu kami menggunakan teknologi ultrasonografi (USG) dan pemeriksaan laboratorium terkini untuk mendeteksi 
        keberadaan batu empedu secara dini. Deteksi dini ini penting untuk mencegah komplikasi serius.
      </p>

      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Jenis Pemeriksaan:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Persalinan Bunda</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Paket persalinan Bunda kami dirancang khusus untuk memberikan pengalaman persalinan yang aman, nyaman, dan berkesan bagi ibu dan bayi. 
        Dengan dukungan tim medis profesional dan fasilitas modern, kami siap mendampingi momen spesial Anda.
      </p>
      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Fasilitas & Layanan:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Persalinan ERACS</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        ERACS (Early Rehabilitation After Cesarean Section) adalah metode persalinan caesar modern yang memungkinkan pemulihan lebih cepat. 
        Dengan teknik ini, ibu dapat bergerak lebih cepat dan kembali ke aktivitas normal dalam waktu singkat.
      </p>

      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Keunggulan ERACS:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Operasi Mata Katarak</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Operasi katarak kami menggunakan teknologi Phacoemulsification, metode modern yang memungkinkan lensa yang keruh dihancurkan dan dihisap 
        melalui sayatan kecil. Teknik ini memberikan hasil penglihatan yang lebih baik dengan pemulihan cepat.
      </p>

      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Teknologi & Keunggulan:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Medical Checkup Jamaah Haji</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Program medical checkup khusus untuk calon jamaah haji kami dirancang untuk memastikan kondisi kesehatan Anda prima sebelum menunaikan ibadah haji. 
        Pemeriksaan komprehensif ini mencakup berbagai tes untuk memastikan Anda siap secara fisik.
      </p>

      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Pemeriksaan Meliputi:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Tes Bebas Narkoba</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Layanan tes narkoba kami menyediakan pemeriksaan yang cepat, akurat, dan terjaga kerahasiaannya. Kami melayani pemeriksaan untuk keperluan 
        edukasi, rekrutmen kerja, atau persyaratan instansi dengan standar internasional.
      </p>

      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Jenis Tes & Layanan:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Medical Checkup ART & Driver</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Program medical checkup khusus untuk asisten rumah tangga (ART) dan pengemudi kami dirancang untuk memastikan mereka dalam kondisi 
        kesehatan yang baik sehingga dapat menjalankan tugas mereka dengan aman dan berkualitas.
      </p>

      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Pemeriksaan Mencakup:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Pap Smear</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Pap smear adalah pemeriksaan sitologi penting untuk deteksi dini kanker serviks (leher rahim) pada wanita. Pemeriksaan ini dilakukan 
        oleh tim medis ahli dengan peralatan modern untuk hasil yang akurat dan aman.
      </p>

      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Pentingnya Pap Smear:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Antenatal Care</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Program Antenatal Care kami adalah layanan pemeriksaan kehamilan berkala yang komprehensif untuk memantau kesehatan ibu hamil dan 
        perkembangan janin. Dengan pemeriksaan rutin, kami memastikan kehamilan Anda berjalan dengan optimal dan aman.
      </p>

      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Layanan Antenatal Care:</h4>
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
      <h3 class="text-2xl font-bold text-[#003f88] mb-4">Imun Booster</h3>
      <p class="text-gray-700 mb-4 leading-relaxed">
        Layanan Imun Booster kami menyediakan injeksi vitamin dan nutrisi esensial untuk meningkatkan daya tahan tubuh dan kebugaran secara instan. 
        Cocok untuk mereka yang memiliki aktivitas tinggi atau ingin menjaga kesehatan preventif.
      </p>

      <h4 class="text-lg font-semibold text-[#003f88] mt-6 mb-3">Komposisi Imun Booster:</h4>
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

export default function PromoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const numId = Number.parseInt(id, 10);

  // State & Controls untuk Carousel Promo Lainnya
  const [relatedIndex, setRelatedIndex] = useState(0);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const relatedControls = useAnimationControls();
  const [relatedItemsPerGroup, setRelatedItemsPerGroup] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setRelatedItemsPerGroup(4);
      } else {
        setRelatedItemsPerGroup(2);
      }
      setRelatedIndex(0);
      relatedControls.start({ x: "0%" });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Simulasi loading time untuk carousel
    const timer = setTimeout(() => {
      setIsLoadingRelated(false);
    }, 800);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [relatedControls]);

  const handleRelatedDotClick = (index: number) => {
    setRelatedIndex(index);
    const targetTranslateX = -(index * 100);
    relatedControls.start({
      x: `${targetTranslateX}%`,
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 24,
        mass: 0.8,
      },
    });
  };

  const promo = PROMO_DATA.find((item) => item.id === numId);
  const relatedPromos = PROMO_DATA.filter((p) => p.id !== numId);
  const totalRelatedDots = Math.ceil(
    relatedPromos.length / relatedItemsPerGroup,
  );

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
      {/* MAIN CONTENT AREA */}
      <main className="max-w-[1175px] mx-auto px-4 md:px-8">
        {/* BREADCRUMB */}
        <div className="mb-8 md:mb-12 border-b border-slate-100 pb-6 pt-8 md:pt-17">
          <nav className="flex items-center gap-1 text-[14px] text-gray-300 mb-4">
            <Link
              href="/"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Beranda
            </Link>

            <ChevronRight size={12} className="text-black/60" />
            <span className="font-normal text-gray-300">{promo.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            {promo.title}
          </h1>
          <p className="text-slate-600">{promo.shortDescription}</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Image */}
          <div className="flex flex-col">
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
          </div>

          {/* Right: Description */}
          <div className="flex flex-col">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: promo.fullDescription,
              }}
            />
          </div>
        </div>

        {/* Related Promos Carousel */}
        <section className="pt-16 pb-16 mt-12 border-t border-slate-100">
          <div className="w-full">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#003f88]">
                Promo Lainnya
              </h2>
            </div>

            {/* Carousel Container */}
            <div className="w-full overflow-hidden p-1">
              {isLoadingRelated ? (
                <PromoCardSkeleton count={relatedItemsPerGroup} />
              ) : (
                <motion.div
                  animate={relatedControls}
                  initial={{ x: "0%" }}
                  className="flex w-full"
                >
                  {Array.from({ length: totalRelatedDots }).map(
                    (_, groupIndex) => {
                      const groupKey = `group-${groupIndex}-${relatedPromos[groupIndex * relatedItemsPerGroup]?.id || 0}`;
                      return (
                        <div
                          key={groupKey}
                          className="w-full shrink-0 flex gap-4 lg:gap-6 justify-start"
                        >
                          {relatedPromos
                            .slice(
                              groupIndex * relatedItemsPerGroup,
                              (groupIndex + 1) * relatedItemsPerGroup,
                            )
                            .map((relatedPromo) => (
                              <div
                                key={`promo-${relatedPromo.id}`}
                                className="w-[calc(50%-8px)] lg:w-[calc(25%-18px)] shrink-0"
                              >
                                <article className="bg-white border border-slate-100 flex flex-col h-full shadow-md rounded-none overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl origin-center">
                                  <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                                    <Image
                                      src={relatedPromo.image}
                                      alt={`Promo ${relatedPromo.title}`}
                                      width={500}
                                      height={500}
                                      className="object-cover w-full h-full"
                                      priority={relatedPromo.id <= 4}
                                    />
                                  </div>

                                  <div className="p-4 md:p-5 flex flex-col grow text-center bg-white">
                                    <h3 className="text-sm md:text-base font-bold text-[#003f88] mb-2 min-h-12 flex items-center justify-center leading-snug line-clamp-2">
                                      {relatedPromo.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-normal mb-5 line-clamp-3 md:line-clamp-4">
                                      {relatedPromo.shortDescription}
                                    </p>
                                    <div className="mt-auto">
                                      <Link
                                        href={`/promo/${relatedPromo.id}`}
                                        passHref
                                      >
                                        <button
                                          type="button"
                                          className="w-full py-2.5 border bg-[#003f88] text-white text-xs font-semibold transition-all duration-300 hover:bg-[#e67e22] hover:text-white cursor-pointer"
                                        >
                                          Selengkapnya →
                                        </button>
                                      </Link>
                                    </div>
                                  </div>
                                </article>
                              </div>
                            ))}
                        </div>
                      );
                    },
                  )}
                </motion.div>
              )}
            </div>

            {/* Dot Indicators */}
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
                      className="absolute w-3 h-3 rounded-full z-10 pointer-events-none"
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
                      className="absolute w-7 h-7 rounded-full border-4 border-[#003f88] bg-white z-0 origin-center pointer-events-none"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
