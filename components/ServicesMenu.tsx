"use client";

import React from "react";
import Link from "next/link";
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
import { motion } from "framer-motion";

interface ServiceItem {
  label: string;
  icon: LucideIcon; // Menggunakan tipe khusus LucideIcon agar size aman
  href: string;
}

const ServicesMenu: React.FC = () => {
  const services: ServiceItem[] = [
    { label: "Emergency", icon: Ambulance, href: "/services/emergency" },
    { label: "Farmasi", icon: Pill, href: "/services/farmasi" },
    { label: "Fisioterapi", icon: Activity, href: "/services/fisioterapi" },
    {
      label: "Kamar Perawatan",
      icon: Hotel,
      href: "/services/kamar-perawatan",
    },
    {
      label: "Laboratory",
      icon: Microscope,
      href: "/services/laboratory-testing",
    },
    {
      label: "Gawat Darurat",
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
      label: "Rehabilitasi",
      icon: Dumbbell,
      href: "/services/rehabilitasi-medik",
    },
    {
      label: "Vaksinasi",
      icon: Syringe,
      href: "/services/vaccination-services",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Layanan Utama">
          <motion.ul
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-gray-100 border border-gray-100 list-none p-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service) => {
              const Icon = service.icon; // Ambil komponen ikon
              return (
                <motion.li
                  key={service.label}
                  variants={itemVariants}
                  className="bg-white"
                >
                  <Link
                    href={service.href}
                    className="group flex flex-col items-center justify-center p-8 h-full transition-colors duration-300 hover:bg-slate-50"
                  >
                    <div className="mb-4 text-slate-400 group-hover:text-[#014f86] transition-colors duration-300 transform group-hover:-translate-y-1">
                      {/* Perbaikan Size: Langsung render komponen dengan prop size */}
                      <Icon size={38} strokeWidth={1.2} />
                    </div>

                    <span className="text-center text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-[#014f86] transition-colors duration-300">
                      {service.label}
                    </span>
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
