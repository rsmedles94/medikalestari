"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface KisahItem {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  isLocalGuide?: boolean;
  reviewText: string;
  href: string;
}

const ServiceSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const ulasanData: KisahItem[] = [
    {
      id: 1,
      author: "Diah Delina",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s40-c",
      rating: 5,
      date: "3 bulan lalu",
      reviewText:
        "Pengalaman melahirkan di RS Medika Lestari sangat memuaskan. Dari pendaftaran yang cepat, pelayanan yang ramah, hingga proses pemeriksaan yang tidak perlu menunggu lama. Saya USG dan melahirkan caesar ERACS dengan Dr. Kendrick Liong — dokter yang sangat baik, ramah, dan detail dalam menjelaskan. Perawat dan bidan sigap serta membantu. Kamar SVIP Lely juga bersih, rapi, dan nyaman. Terima kasih Mas Angga dan seluruh tim RS Medika Lestari. Sangat rekomendasi 🙏",
      href: "https://maps.app.goo.gl/z68tfUZiL5jLkBig8",
    },
    {
      id: 2,
      author: "Veren Salsa",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s40-c",
      rating: 5,
      date: "7 bulan lalu",
      reviewText:
        "bessttt deh pelayanan walaupun lama maklumin aja yang penting staff2 nya ramah ramah kalo gue nanya jadi gak sungkan karna staff nya emng baik2 jawaban nya gak ngegas atau gak ngotot2,gk kaya tempat lain sok sok an jutek pengen gua tampol aja rasanya,untuk dokter THT dr.nadhila dan sus nya terimkasih sudah sabar dan penjelasan nya gak ngotot dan menghadapi aku meler parah ini dengan sabar dan ngang ngong ngang ngong🤧😂.",
      href: "https://maps.app.goo.gl/Xwg3pewgjAXwiPgcA",
    },
    {
      id: 3,
      author: "Friska Junita",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s40-c",
      rating: 5,
      date: "7 bulan lalu",
      reviewText:
        "Alhamdullilah beruntung bisa lahiran di RS Medika Lestari. USG dan melahirkan caesar eracs dengan Dr. Kendrick Liong. Masyallah dokternya baik hati, ramah dan detail menjelaskan setiap pertanyaan. Perawat staf bidannya sigap, ramah dan sangat membantu. Pelayanan disini sangat sangat memuaskan, Dan kamar Rawat inap bersih, nyaman. Dapet fasilitas SVIP jugaa masyaallah berasa nginep di hotel hihi. Terimakasih RS Medika Lestari. Sehat selalu Dr. Kendrick liong.",
      href: "https://maps.app.goo.gl/ccmz5QQv8M64ziXNA",
    },
    {
      id: 4,
      author: "ADI ANTO",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s40-c",
      rating: 5,
      date: "4 bulan lalu",
      reviewText:
        "Jam 1 malem harus ke ugd karena anak sakit. Sampai pintu pendaftaran di sambut dengan senyuman ramah petugas pendaftaran dan harus di ranap. Thanks ya RS medika lestari good experience 🙏 cuma parkir nya musti ada petugas khusus dari RS. Thank you.",
      href: "https://maps.app.goo.gl/prEZmJqBC1D13Kwi7",
    },
    {
      id: 5,
      author: "anas tasya",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s40-c",
      rating: 5,
      date: "8 bulan lalu",
      reviewText:
        "semenjak masuk kelas ibu jadi lebih semangat buat kontrol kehamilan. Setiap bulan selalu cek usg dimedika lestari pejelasan dokter Kendrick sangat detail dan mengedukasi Semoga bisa lancar sampai persalinan di medika lestari 😇 terimakasih jg buat tim medika mas angga&mas karis dan bidan² yg selalu memberi afirmasi positif dikelas ibu 🙏",
      href: "https://maps.app.goo.gl/gHLU5YZn9triKhyP9",
    },
    {
      id: 6,
      author: "Dhea Aryanti",
      avatar: "https://lh3.googleusercontent.com/a/default-user=s40-c",
      rating: 5,
      date: "10 bulan lalu",
      reviewText:
        "Melahirkan di RS Medika Lestari merupakan pilihan yang sangat tepat. Selama saya hamil & melahirkan di RS medika lestari memberikan pengalaman yang sangat luar biasa baik, mulai dari Dokternya, staff para perawat and bidan yang membantu proses melahirkan sangat tidak mengecewakan. Pelayanan ny sangat memuaskan. Jangan ragu untuk berobat ataupun melahirkan di RS Medika Lestari.",
      href: "https://maps.app.goo.gl/26njXCsTPG9fnt8F6",
    },
  ];

  // Penentu langkah slide agar pas saat 3 card tampil penuh
  const totalDots = ulasanData.length - 2 > 0 ? ulasanData.length - 2 : 1;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={index < rating ? "#F4B400" : "#E2E8F0"}
        className="w-4 h-4"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ));
  };

  return (
    <section className="w-full bg-[#3D8ECB] py-16 md:py-20 font-sans overflow-hidden">
      <div className="max-w-[1180px] mx-auto">
        {/* 1. CONTAINER HEADER */}
        <div className="px-4 md:px-8 mb-12 flex items-end justify-between w-full gap-4">
          <div className="text-left min-w-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide mb-3">
              Ulasan Pasien
            </h2>
            <p className="text-sm md:text-base text-white leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">
              Apa kata mereka yang telah merasakan langsung pelayanan dan
              fasilitas medis di Rumah Sakit Medika Lestari?
            </p>
          </div>
          <button
            onClick={() =>
              window.open(
                "https://www.google.com/maps/place/RS+Medika+Lestari/@-6.2248952,106.708865,866m/data=!3m2!1e3!5s0x2e69fb20f9710f11:0xb1df070900c513d2!4m16!1m9!3m8!1s0x2e69fa1cb5b440a1:0xe21244587f98ac8f!2sRS+Medika+Lestari!8m2!3d-6.2248952!4d106.7114399!9m1!1b1!16s%2Fg%2F11h0hgmvp!3m5!1s0x2e69fa1cb5b440a1:0xe21244587f98ac8f!8m2!3d-6.2248952!4d106.7114399!16s%2Fg%2F11h0hgmvp?hl=id-ID&entry=ttu&g_ep=EgoyMDI2MDUyNi4wIKXMDSoASAFQAw%3D%3D",
                "_blank",
                "noopener,noreferrer",
              )
            }
            className="text-white font-semibold text-sm hover:opacity-80 flex items-center gap-1 transition-all shrink-0 border-b border-transparent hover:border-white pb-0.5 mb-0.5 whitespace-nowrap"
          >
            Lihat ulasan lainnya <span className="text-base">→</span>
          </button>
        </div>

        {/* 2. AREA WRAPPER SLIDER (Mengintip presisi) */}
        <div className="w-full">
          <div className="px-4 md:px-8">
            <div className="overflow-visible relative">
              <motion.div
                className="flex gap-6"
                style={{ width: "max-content" }}
                animate={{
                  x:
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? -(activeIndex * 304)
                      : -(activeIndex * 384),
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
              >
                {ulasanData.map((item) => (
                  <article
                    key={item.id}
                    onClick={() =>
                      window.open(item.href, "_blank", "noopener,noreferrer")
                    }
                    className="w-[280px] md:w-[360px] h-[380px] flex-shrink-0 flex flex-col justify-between bg-white rounded-none p-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer text-left select-none"
                  >
                    <div>
                      {/* Profil Reviewer */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                          <Image
                            src={item.avatar}
                            alt={item.author}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-slate-800 truncate">
                            {item.author}
                          </span>
                          <div className="flex items-center gap-1 mt-0.5">
                            {item.isLocalGuide && (
                              <span className="text-[10px] bg-orange-50 text-orange-600 px-1 rounded font-medium">
                                LG
                              </span>
                            )}
                            <span className="text-xs text-slate-400">
                              {item.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 mb-3">
                        {renderStars(item.rating)}
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed font-normal line-clamp-6 break-words">
                        &quot;{item.reviewText}&quot;
                      </p>
                    </div>

                    <div className="font-semibold text-xs flex items-center gap-1 mt-2">
                      <span className="text-[#3D8ECB] hover:text-[#e67e22] hover:underline transition-colors">
                        → Selengkapnya
                      </span>
                    </div>
                  </article>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* 3. INDIKATOR DOT NAVIGASI (Menggunakan struktur persis pilihanmu) */}
        <div className="px-4 md:px-8 mt-12">
          <div className="flex items-center justify-start gap-4">
            {Array.from({ length: totalDots }).map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`dot-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="focus:outline-none flex items-center justify-center h-8 w-8 relative"
                  aria-label={`Go to page ${index + 1}`}
                >
                  {/* Bulatan Dot Inti Tengah */}
                  <motion.div
                    animate={{
                      backgroundColor: isActive
                        ? "#3D8ECB"
                        : "rgb(255, 255, 255)",
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-4 h-4 rounded-full z-10 pointer-events-none"
                  />

                  {/* Ring Outer Lingkaran Luar saat Aktif */}
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
                    className="absolute w-8 h-8 rounded-full border-[5px] border-white bg-white z-0 origin-center pointer-events-none"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
