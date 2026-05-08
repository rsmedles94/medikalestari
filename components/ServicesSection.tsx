"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
    <section className="w-full bg-white py-10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-5 border-b border-slate-200">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 uppercase tracking-tight">
            Pusat Pelayanan
          </h2>
          <p className="text-slate-500 max-w-sm text-sm">
            Akses informasi fasilitas, jadwal tenaga medis, dan operasional
            rumah sakit
          </p>
        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[1/1] bg-gray-200 animate-pulse"
                />
              ))
            : serviceData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleServiceClick(item.href)}
                  className="group relative aspect-[1/1] flex flex-col overflow-hidden bg-white shadow-md"
                >
                  {/* Background Layer */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover opacity-30 transition-opacity duration-500 md:group-hover:opacity-40"
                    />

                    {/* Default Overlay: Di mobile lebih gelap/biru, di desktop putih bersih */}
                    <div className="absolute inset-0 bg-white/60 md:bg-white/80 md:group-hover:opacity-0 transition-opacity duration-500" />

                    {/* Hover Gradient Overlay: Muncul otomatis di Mobile, Hover di Desktop */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-[#004684]/80 to-[#004684] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  </div>

                  {/* Content Container */}
                  <div className="relative z-20 p-8 h-full flex flex-col items-start text-left">
                    {/* Logo - Rata Kiri */}
                    <div className="mb-4 h-16 w-full relative flex justify-start items-center transition-all duration-500 invert brightness-0 md:invert-0 md:brightness-100 md:group-hover:brightness-0 md:group-hover:invert">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={140}
                        height={50}
                        className="object-contain"
                      />
                    </div>

                    {/* Judul & Deskripsi - Left Justify */}
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="text-[30px] font-bold text-white md:text-black mb-3 leading-tight transition-colors duration-500 md:group-hover:text-white">
                        {item.title}
                      </h3>
                      <p className="text-white/90 md:text-slate-500 text-sm leading-relaxed text-justify line-clamp-3 transition-colors duration-500 md:group-hover:text-white/90">
                        {item.description}
                      </p>
                    </div>

                    {/* Button Read More: Selalu ada di Mobile, Hover di Desktop */}
                    <div className="mt-6 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(item.href);
                        }}
                        className="group/btn flex items-center gap-2 bg-white text-[#004684] px-8 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all cursor-pointer overflow-hidden"
                      >
                        <span>Selengkapnya</span>

                        {/* Ikon Panah dengan Animasi */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1.5 group-active/btn:translate-x-2"
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
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
