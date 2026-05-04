"use client";

import React, { useState } from "react";
import Image from "next/image";

// Data Demo dengan referensi ke public/promo/
const PROMO_DATA = [
  {
    id: 1,
    title: "Vaksin Influenza & Prevenar",
    description:
      "Lindungi diri dan keluarga dari virus Influenza dan bakteri Pneumonia dengan paket vaksinasi komprehensif untuk menjaga daya tahan tubuh tetap optimal.",
    image: "/promo/paket1.jpeg",
  },
  {
    id: 2,
    title: "Sirkumsisi Anak (Khitan)",
    description:
      "Layanan khitan anak dengan metode modern yang minim nyeri, proses penyembuhan cepat, dan ditangani langsung oleh tim medis profesional berpengalaman.",
    image: "/promo/paket2.jpeg",
  },
  {
    id: 3,
    title: "Skrining Batu Empedu",
    description:
      "Deteksi dini adanya batu empedu melalui pemeriksaan radiologi dan laboratorium untuk mencegah komplikasi dan menentukan langkah penanganan yang tepat.",
    image: "/promo/paket3.jpeg",
  },
  {
    id: 4,
    title: "Persalinan Bunda",
    description:
      "Wujudkan momen kelahiran buah hati yang aman dan nyaman dengan paket persalinan lengkap yang didukung oleh fasilitas medis modern dan tenaga ahli.",
    image: "/promo/paket4.jpeg",
  },
  {
    id: 5,
    title: "Persalinan ERACS",
    description:
      "Metode persalinan caesar ERACS untuk pemulihan yang jauh lebih cepat, memungkinkan Bunda untuk segera beraktivitas dan menggendong si kecil pasca operasi.",
    image: "/promo/paket5.jpeg",
  },
  {
    id: 6,
    title: "Operasi Mata Katarak",
    description:
      "Kembalikan kejernihan penglihatan Anda dengan prosedur operasi katarak menggunakan teknologi Phacoemulsification tanpa jahit dan pemulihan cepat.",
    image: "/promo/paket6.jpeg",
  },
  {
    id: 7,
    title: "Medical Checkup Jamaah Haji",
    description:
      "Pemeriksaan kesehatan menyeluruh bagi calon jamaah haji untuk memastikan kondisi fisik prima dan memenuhi persyaratan medis keberangkatan ke tanah suci.",
    image: "/promo/paket7.jpeg",
  },
];

const PromoKesehatan = () => {
  const [showAll, setShowAll] = useState(false);

  // Menampilkan 4 data awal, atau semua data (7) jika showAll true
  const visibleData = showAll ? PROMO_DATA : PROMO_DATA.slice(0, 4);

  return (
    <section className="bg-[#005753]/5 py-12 px-4 sm:px-6 lg:px-8 min-h-screen mt-10">
      <div className="relative z-10 max-w-290 mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black uppercase tracking-widest">
            PROMO PAKET KESEHATAN
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            Ketahuilah jenis pemeriksaan yang anda butuhkan dengan paket
            Kesehatan & Medical Check Up dari kami
          </p>
        </div>

        {/* Grid System: 2 Kolom Mobile, 4 Kolom Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {visibleData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 flex flex-col h-full shadow-sm overflow-hidden"
            >
              {/* Image Container (1600x1600 aspect ratio via aspect-square) */}
              <div className="relative aspect-square w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1600}
                  height={1600}
                  className="object-cover w-full h-full"
                  priority={item.id <= 4}
                />
              </div>

              {/* Text Content */}
              <div className="p-4 md:p-5 flex flex-col flex-grow text-center">
                <h3 className="text-sm md:text-lg font-bold text-[#005753] mb-3 min-h-[3rem] flex items-center justify-center leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] md:text-sm text-gray-500 leading-relaxed mb-6 line-clamp-4">
                  {item.description}
                </p>
                <div className="mt-auto">
                  <button className="w-full py-2 border border-[#005753] text-[#005753] text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors hover:bg-gray-50">
                    Selengkapnya
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Toggle Text Link */}
        <div className="mt-12 text-center">
          <span
            onClick={() => setShowAll(!showAll)}
            className="cursor-pointer text-[#005753] text-xs md:text-sm font-bold uppercase tracking-widest underline underline-offset-4 decoration-2 transition-opacity hover:opacity-70"
          >
            {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default PromoKesehatan;
