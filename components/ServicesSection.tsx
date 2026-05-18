"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ServiceSkeletonShimmer from "./ServiceSkeletonShimmer";

interface ServiceItem {
  id: number;
  image: string;
  title: string;
  description: string;
  targetId: string | null;
  href: string | null;
}

const ServiceSection = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const serviceData: ServiceItem[] = [
    {
      id: 1,
      image: "/kamar-perawatan.jpg",
      title: "Kamar Perawatan",
      description:
        "Fasilitas rawat inap nyaman dengan standar pelayanan medis terbaik.",
      targetId: null,
      href: "/services/kamar-perawatan",
    },
    {
      id: 2,
      image: "/dokter-kami.png",
      title: "Dokter Spesialis",
      description:
        "Tim dokter spesialis berpengalaman yang siap melayani Anda.",
      targetId: null,
      href: "/dokter",
    },
    {
      id: 3,
      image: "/jadwal-dokter.png",
      title: "Jadwal Dokter",
      description:
        "Temukan waktu konsultasi yang sesuai dengan dokter pilihan Anda.",
      targetId: null,
      href: "/jadwal-dokter",
    },
  ];

  const handleServiceClick = (href: string | null) => {
    if (href) router.push(href);
  };

  return (
    <section className="w-full relative overflow-hidden py-10">
      {/* Background Gambar Utama */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/pusatpelayanan/background.jpeg"
          alt="Background Pusat Pelayanan"
          fill
          priority
          className="object-cover"
        />
        {/* 
          Overlay Gradasi:
          - bg-gradient-to-b: membuat arah gradasi dari atas ke bawah
          - from-[#173A87]: warna atas (solid / opacity penuh)
          - via-[#173A87]/60: warna tengah (mulai transparan)
          - to-[#173A87]/10: warna bawah (sangat terang/transparan sehingga gambar asli lebih terlihat)
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#173A87] via-[#173A87]/80 to-[#173A87]/40" />
      </div>

      {/* Wrapper Konten (Z-index dinaikkan agar tulisan/menu di atas tetap jelas dan bisa diklik) */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-5 border-b border-white/20">
          {/* Mengubah warna teks header ke putih/slate-100 agar kontras dengan bagian atas background yang gelap */}
          <h2 className="text-2xl md:text-3xl font-semibold text-white uppercase tracking-tight">
            Pusat Pelayanan
          </h2>
        </header>

        {/* Grid System */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          role="list"
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} role="listitem">
                  <ServiceSkeletonShimmer />
                </div>
              ))
            : serviceData.map((item, index) => (
                <motion.article
                  key={item.id}
                  role="listitem"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleServiceClick(item.href)}
                  className="group relative aspect-[1/1] flex flex-col overflow-hidden bg-white shadow-md cursor-pointer"
                >
                  {/* Background Layer untuk masing-masing Card */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover opacity-30 transition-opacity duration-500 md:group-hover:opacity-40"
                    />

                    {/* Overlays Card */}
                    <div className="absolute inset-0 bg-white/60 md:bg-white/80 md:group-hover:opacity-0 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-[#173A87]/80 to-[#173A87] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  </div>

                  {/* Content Container */}
                  <div className="relative z-20 p-8 h-full flex flex-col items-start text-left">
                    {/* Logo */}
                    <div className="mb-4 h-16 w-full relative flex justify-start items-center transition-all duration-500 invert brightness-0 md:invert-0 md:brightness-100 md:group-hover:brightness-0 md:group-hover:invert">
                      <Image
                        src="/logo.png"
                        alt="Logo RS Medika Lestari"
                        width={140}
                        height={50}
                        className="object-contain"
                      />
                    </div>

                    {/* Judul & Deskripsi */}
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="text-[30px] font-bold text-white md:text-black mb-3 leading-tight transition-colors duration-500 md:group-hover:text-white">
                        {item.title}
                      </h3>
                      <p className="text-white/90 md:text-slate-500 text-sm leading-relaxed text-justify line-clamp-3 transition-colors duration-500 md:group-hover:text-white/90">
                        {item.description}
                      </p>
                    </div>

                    {/* Button Read More */}
                    <div className="mt-6 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(item.href);
                        }}
                        className="group/btn flex items-center gap-2 bg-white text-[#173A87] px-8 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all cursor-pointer overflow-hidden"
                      >
                        <span>Selengkapnya</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
