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
    <section className="w-full bg-slate-50 py-20">
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

        {/* Grid System - Landscape (3 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] bg-gray-200 animate-pulse rounded-xl"
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
                  className="group relative aspect-[4/3] flex flex-col overflow-hidden bg-white rounded-xl shadow-md border border-slate-100 cursor-pointer"
                >
                  {/* Background Image - Low Opacity */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-white/80 via-transparent to-white/10" />
                  </div>

                  {/* Content Container */}
                  <div className="relative z-10 p-8 h-full flex flex-col items-center text-center">
                    {/* Logo - Simetris Tengah */}
                    <div className="mb-6 h-12 w-full relative flex justify-center items-center">
                      <Image
                        src="/logo.png"
                        alt="Logo Center"
                        width={140}
                        height={60}
                        className="object-contain"
                      />
                    </div>

                    <h3 className="text-xl font-bold text-[#004684] mb-4 leading-tight transition-colors group-hover:text-[#003159]">
                      {item.title}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceClick(item.href);
                        }}
                        className="bg-[#004684] hover:bg-[#003159] text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-900/10 active:scale-95"
                      >
                        Selengkapnya
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
