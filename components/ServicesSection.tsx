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

  const scrollToSection = (id: string | null) => {
    if (!id) return;
    const element = document.getElementById(id);
    if (!element) return;

    const headerOffset = 150;
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: elementPosition, behavior: "smooth" });
  };

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
      title: "Dokter Kami",
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
    {
      id: 4,
      image: "/mcu.png",
      title: "Medical Checkup",
      description: "Informasi lengkap layanan Medical Check-Up (MCU).",
      targetId: null,
      href: "/services/medical-checkup",
    },
  ];

  const handleServiceClick = (item: ServiceItem) => {
    if (item.href) {
      router.push(item.href);
      return;
    }
    if (!item.targetId) return;

    const el = document.getElementById(item.targetId);
    if (el) {
      scrollToSection(item.targetId);
    } else {
      router.push(`/dokter#${item.targetId}`);
    }
  };

  return (
    <section className="w-full bg-white font-sans text-slate-800 relative py-20 overflow-hidden">
      <div className="relative z-10 max-w-290 mx-auto px-4 md:px-8 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 pb-5 border-b border-slate-100"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-slate-900 mt-10 md:mt-1 uppercase tracking-tight text-center md:text-left">
              Pusat Pelayanan
            </h2>
          </div>

          <p className="text-slate-500 max-w-sm text-sm text-center mx-auto md:text-left md:mx-0 md:max-w-none">
            Akses informasi fasilitas, jadwal tenaga medis, dan operasional
            rumah sakit
          </p>
        </motion.div>

        <div className="relative">
          <div className="relative z-10 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <ServiceSkeletonShimmer
                    key={`service-skeleton-${index + 1}`}
                  />
                ))
              : serviceData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleServiceClick(item)}
                    className="group relative aspect-3/4.5 flex flex-col overflow-hidden bg-white border border-slate-200 shadow-sm cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 transform-gpu"
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-[65%] bg-linear-to-t from-[#004684] via-[#004684]/85 to-transparent z-10" />

                    <div
                      className="relative z-20 mt-auto p-7 flex flex-col items-start"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-blue-50/90 text-sm leading-relaxed pr-6">
                        {item.description}
                      </p>
                    </div>

                    <div className="absolute bottom-0 right-0 z-30 w-0 h-0 border-solid border-t-[70px] border-r-[70px] border-t-transparent border-r-[#00403d] transition-all duration-300 opacity-0 group-hover:opacity-100" />

                    <div className="absolute bottom-0 right-0 z-40 w-0 h-0 border-solid border-b-[65px] border-l-[65px] border-b-white border-l-transparent translate-x-20 translate-y-20 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0 shadow-[-4px_-4px_10px_rgba(0,0,0,0.2)]" />

                    <div className="absolute bottom-3 right-2 z-50 opacity-0 scale-50 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:scale-100">
                      <svg
                        className="w-7 h-7 text-[#004684]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
