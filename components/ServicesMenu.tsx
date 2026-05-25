"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Ambulance,
  Pill,
  Activity,
  Hotel,
  Microscope,
  Siren,
  Heart,
  Stethoscope,
  Radio,
  Bed,
  Dumbbell,
  Syringe,
  LucideIcon,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

interface ServiceItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const ServicesMenu: React.FC = () => {
  const services: ServiceItem[] = [
    {
      label: "Emergency Services",
      icon: Ambulance,
      href: "/services/emergency",
    },
    { label: "Farmasi & Obat", icon: Pill, href: "/services/farmasi" },
    { label: "Fisioterapi", icon: Activity, href: "/services/fisioterapi" },
    {
      label: "Kamar Perawatan",
      icon: Hotel,
      href: "/services/kamar-perawatan",
    },
    {
      label: "Laboratory Testing",
      icon: Microscope,
      href: "/services/laboratory-testing",
    },
    {
      label: "Layanan Gawat Darurat",
      icon: Siren,
      href: "/services/layanan-gawat-darurat",
    },
    {
      label: "Medical Checkup",
      icon: Heart,
      href: "/services/medical-checkup",
    },
    { label: "Poli Klinik", icon: Stethoscope, href: "/services/poli-klinik" },
    { label: "Radiologi", icon: Radio, href: "/services/radiologi" },
    { label: "Rawat Inap", icon: Bed, href: "/services/rawat-inap" },
    {
      label: "Rehabilitasi Medik",
      icon: Dumbbell,
      href: "/services/rehabilitasi-medik",
    },
    {
      label: "Vaksinasi & Imunisasi",
      icon: Syringe,
      href: "/services/vaccination-services",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-[1106px] mx-auto my-6">
        <nav aria-label="Layanan Utama">
          <motion.ul
            // Ditambahkan gap-3 untuk memberi jarak antar menu list
            className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white list-none p-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <motion.li
                  key={service.label}
                  variants={itemVariants}
                  // Border dibuat penuh mengelilingi li karena sudah pakai gap
                  className="bg-white border border-slate-200 overflow-hidden"
                >
                  <Link
                    href={service.href}
                    className="group flex items-center justify-between p-6 md:p-8 h-full min-h-[92px] transition-all duration-200 text-[#003f88] hover:bg-[#003f88] hover:text-white"
                  >
                    {/* Sisi Kiri: Ikon Utama & Judul Menu */}
                    <div className="flex items-center gap-5 pr-4">
                      <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-200">
                        <Icon
                          size={32}
                          strokeWidth={1.5}
                          className="text-current"
                        />

                        {/* Dot oranye kecil di pojok ikon */}
                        <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white" />
                      </div>

                      {/* Text Menu */}
                      <span className="text-base md:text-[17px] font-bold tracking-normal leading-snug text-current">
                        {service.label}
                      </span>
                    </div>

                    {/* Sisi Kanan: Ikon Panah Kecil (Chevron) */}
                    <div className="flex-shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-current">
                      <ChevronRight size={16} strokeWidth={3} />
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>
      </div>
    </section>
  );
};

export default ServicesMenu;
