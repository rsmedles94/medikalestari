"use client";

import React from "react";
import Link from "next/link";
import {
  BedDouble,
  BedSingle,
  BellDot,
  Book,
  BookAIcon,
  BookAlert,
  ChevronRight,
  CrossIcon,
  HospitalIcon,
  StethoscopeIcon,
  TicketCheck,
} from "lucide-react";
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
      label: "Medical Checkup",
      icon: StethoscopeIcon,
      href: "/services/medical-checkup",
    },
    {
      label: "Kamar Perawatan",
      icon: BedDouble,
      href: "/services/kamar-perawatan",
    },
    {
      label: "Layanan Gawat Darurat",
      icon: CrossIcon,
      href: "/services/emergency",
    },
    { label: "PoliKlinik", icon: HospitalIcon, href: "/services/poli-klinik" },
    { label: "Tarif Kamar", icon: Bed, href: "/tarif-kamar" },
    {
      label: "Asuransi & Rekanan",
      icon: Book,
      href: "/asuransi-rekanan",
    },
    { label: "Paket Kesehatan", icon: TicketCheck, href: "/promo" },
    {
      label: "Ketersediaan Kamar",
      icon: BedSingle,
      href: "/ketersediaan-kamar",
    },
    { label: "Alur Pendaftaran", icon: BookAIcon, href: "/alur-pendaftaran" },
  ];

  // Filter untuk mobile: hide Medical Checkup
  const mobileServices = services.filter(
    (service) => service.label !== "Medical Checkup",
  );

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
    <section className="py-0 md:py-12 px-4">
      <div className="max-w-[1106px] mx-auto my-6">
        <nav aria-label="Layanan Utama">
          {/* Desktop: tampilkan semua services, Mobile: sembunyikan Medical Checkup */}
          <div className="block md:hidden">
            <motion.ul
              className="grid grid-cols-2 gap-3  list-none"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {mobileServices.map((service) => {
                const Icon = service.icon;
                return (
                  <motion.li
                    key={service.label}
                    variants={itemVariants}
                    className="bg-white border border-slate-200 overflow-hidden"
                  >
                    <Link
                      href={service.href}
                      className="group flex items-center justify-between p-4 h-full min-h-[82px] transition-all duration-200 text-[#003f88] hover:bg-[#003f88] hover:text-white"
                    >
                      <div className="flex items-center gap-3 pr-2">
                        <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-200">
                          <Icon
                            size={22}
                            strokeWidth={1.5}
                            className="text-current"
                          />
                          <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-orange-500 rounded-full border border-white" />
                        </div>
                        <span className="text-sm font-bold tracking-normal leading-snug text-current">
                          {service.label}
                        </span>
                      </div>
                      <div className="flex-shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-current">
                        <ChevronRight size={14} strokeWidth={3} />
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <motion.ul
              className="grid grid-cols-3 gap-3 bg-white list-none p-0"
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
                    className="bg-white border border-slate-200 overflow-hidden"
                  >
                    <Link
                      href={service.href}
                      className="group flex items-center justify-between p-6 md:p-8 h-full min-h-[92px] transition-all duration-200 text-[#003f88] hover:bg-[#003f88] hover:text-white"
                    >
                      <div className="flex items-center gap-5 pr-4">
                        <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-200">
                          <Icon
                            size={32}
                            strokeWidth={1.5}
                            className="text-current"
                          />
                          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white" />
                        </div>
                        <span className="text-base md:text-[17px] font-bold tracking-normal leading-snug text-current">
                          {service.label}
                        </span>
                      </div>
                      <div className="flex-shrink-0 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-current">
                        <ChevronRight size={16} strokeWidth={3} />
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </nav>
      </div>
    </section>
  );
};

export default ServicesMenu;
