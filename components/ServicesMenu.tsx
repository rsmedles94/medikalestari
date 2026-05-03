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
  Newspaper, // Ganti LayoutTextWindow yang sering error
} from "lucide-react";
import { motion } from "framer-motion";

interface ServiceItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const ServicesMenu: React.FC = () => {
  // Menggunakan semua logic data asli kamu
  const services: ServiceItem[] = [
    {
      label: "Emergency",
      icon: <Ambulance size={40} strokeWidth={1.5} />,
      href: "/services/emergency",
    },
    {
      label: "Farmasi",
      icon: <Pill size={40} strokeWidth={1.5} />,
      href: "/services/farmasi",
    },
    {
      label: "Fisioterapi",
      icon: <Activity size={40} strokeWidth={1.5} />,
      href: "/services/fisioterapi",
    },
    {
      label: "Kamar Perawatan",
      icon: <Hotel size={40} strokeWidth={1.5} />,
      href: "/services/kamar-perawatan",
    },
    {
      label: "Laboratory",
      icon: <Microscope size={40} strokeWidth={1.5} />,
      href: "/services/laboratory-testing",
    },
    {
      label: "Gawat Darurat",
      icon: <Siren size={40} strokeWidth={1.5} />,
      href: "/services/layanan-gawat-darurat",
    },
    {
      label: "Medical Checkup",
      icon: <Heart size={40} strokeWidth={1.5} />,
      href: "/services/medical-checkup",
    },
    {
      label: "Poli Klinik",
      icon: <Stethoscope size={40} strokeWidth={1.5} />,
      href: "/services/poli-klinik",
    },
    {
      label: "Radiologi",
      icon: <Radio size={40} strokeWidth={1.5} />,
      href: "/services/radiologi",
    },
    {
      label: "Rawat Inap",
      icon: <Bed size={40} strokeWidth={1.5} />,
      href: "/services/rawat-inap",
    },
    {
      label: "Rehabilitasi",
      icon: <Dumbbell size={40} strokeWidth={1.5} />,
      href: "/services/rehabilitasi-medik",
    },
    {
      label: "Vaksinasi",
      icon: <Syringe size={40} strokeWidth={1.5} />,
      href: "/services/vaccination-services",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <section className="py-12 px-4 bg-[#005753]/10 md:bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          /* 
             Grid config: 
             - grid-cols-3 (Mobile)
             - lg:grid-cols-6 (Desktop)
          */
          className="grid grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service) => (
            <motion.div
              key={service.label}
              variants={itemVariants}
              whileHover={{ scale: 1.1 }} // Hover scale sesuai permintaan
              whileTap={{ scale: 0.95 }} // Active scale
              className="flex flex-col items-center"
            >
              <Link
                href={service.href}
                className="flex flex-col items-center group w-full"
              >
                <div className="mb-3 text-[#005753] transition-colors">
                  {service.icon}
                </div>
                <span className="text-center text-[10px] md:text-sm font-medium text-gray-600 leading-tight group-hover:text-[#00423E]">
                  {service.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesMenu;
