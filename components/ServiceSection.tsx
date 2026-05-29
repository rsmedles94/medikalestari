"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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
  // Data ulasan asli dengan properti 'images' yang sudah dihapus total
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={index < rating ? "#F4B400" : "#E0E0E0"}
        className="w-4 h-4"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ));
  };

  return (
    <section className="w-full bg-[#3D8ECB] py-16 font-sans">
      <div className="max-w-[1160px] mx-auto px-4 md:px-6">
        {/* Semantic HTML: Header Section */}
        <header className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Ulasan Pasien
          </h2>
          <p className="text-sm md:text-base text-white max-w-xl mx-auto">
            Apa kata mereka yang telah merasakan langsung pelayanan dan
            fasilitas medis di Rumah Sakit Medika Lestari?
          </p>
        </header>

        {/* Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {ulasanData.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() =>
                window.open(item.href, "_blank", "noopener,noreferrer")
              }
              className="w-full h-full flex flex-col justify-between bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer text-left"
            >
              <div>
                {/* Header Reviewer */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                    <Image
                      src={item.avatar}
                      alt={item.author}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-900 truncate">
                      {item.author}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {item.isLocalGuide && (
                        <>
                          <span className="text-xs text-[#e67e22] font-medium">
                            Local Guide
                          </span>
                          <span className="text-xs text-slate-300">·</span>
                        </>
                      )}
                      <span className="text-xs text-slate-400">
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Baris Rating Bintang */}
                <div className="flex items-center gap-0.5 mb-2.5">
                  {renderStars(item.rating)}
                </div>

                {/* Isi Teks Ulasan */}
                <p className="text-sm text-slate-600 leading-relaxed font-normal line-clamp-6 mb-2 break-words">
                  {item.reviewText}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Semantic HTML: Footer Action Section */}
        <footer className="mt-12 text-center">
          <Link
            href="https://www.google.com/maps/place/RS+Medika+Lestari/@-6.2248952,106.708865,866m/data=!3m2!1e3!5s0x2e69fb20f9710f11:0xb1df070900c513d2!4m16!1m9!3m8!1s0x2e69fa1cb5b440a1:0xe21244587f98ac8f!2sRS+Medika+Lestari!8m2!3d-6.2248952!4d106.7114399!9m1!1b1!16s%2Fg%2F11h0hgmvp!3m5!1s0x2e69fa1cb5b440a1:0xe21244587f98ac8f!8m2!3d-6.2248952!4d106.7114399!16s%2Fg%2F11h0hgmvp?hl=id-ID&entry=ttu&g_ep=EgoyMDI2MDUyNi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#003f88] shadow-sm transition-all duration-200"
          >
            <span>Lihat Semua Ulasan Google Maps</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </footer>
      </div>
    </section>
  );
};

export default ServiceSection;
