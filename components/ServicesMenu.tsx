"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { LazyMotion, MotionConfig, domAnimation, m } from "framer-motion";
import type { Variants } from "framer-motion";

const ICON_BASE = "/assets/service-icons";

interface ServiceItem {
  label: string;
  icon: string;
  href: string;
  hideOnMobile?: boolean;
}

const SERVICES: readonly ServiceItem[] = [
  {
    label: "Medical Checkup",
    icon: "medical-checkup",
    href: "/services/medical-checkup",
    hideOnMobile: true,
  },
  {
    label: "Kamar Perawatan",
    icon: "bed",
    href: "/services/kamar-perawatan",
  },
  {
    label: "Bantuan Darurat",
    icon: "gawat-darurat",
    href: "/services/emergency",
  },
  {
    label: "PoliKlinik",
    icon: "poliklinik",
    href: "/services/poli-klinik",
  },
  { label: "Tarif Kamar", icon: "bed", href: "/tarif-kamar" },
  {
    label: "Asuransi & Rekanan",
    icon: "asuransi",
    href: "/asuransi-rekanan",
  },
  { label: "Paket Kesehatan", icon: "promo-kesehatan", href: "/promo" },
  { label: "Ketersediaan Kamar", icon: "bed", href: "/ketersediaan-kamar" },
  {
    label: "Alur Pendaftaran",
    icon: "alur-pendaftaran",
    href: "/alur-pendaftaran",
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

function iconMask(icon: string): CSSProperties {
  const url = `url(${ICON_BASE}/${icon}.svg)`;
  return {
    maskImage: url,
    WebkitMaskImage: url,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    maskSize: "contain",
    WebkitMaskSize: "contain",
  };
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 md:h-4 md:w-4"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <m.li
      variants={itemVariants}
      className={`overflow-hidden border border-slate-200 bg-white ${
        service.hideOnMobile ? "hidden md:block" : ""
      }`}
    >
      <Link
        href={service.href}
        className="group flex h-full min-h-[82px] items-center justify-between p-4 text-slate-900 transition-all duration-200 hover:bg-[#003f88] hover:text-white md:min-h-[92px] md:p-8"
      >
        <div className="flex items-center gap-3 pr-2 md:gap-5 md:pr-4">
          <div className="relative flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
            <span
              aria-hidden="true"
              className="block h-8 w-8 bg-current md:h-11 md:w-11"
              style={iconMask(service.icon)}
            />
          </div>
          <span className="text-sm font-bold leading-snug tracking-normal text-current md:text-[17px]">
            {service.label}
          </span>
        </div>
        <div className="flex-shrink-0 opacity-80 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
          <ChevronIcon />
        </div>
      </Link>
    </m.li>
  );
}

export default function ServicesMenu() {
  return (
    <section className="px-4 py-0 md:py-12">
      <div className="mx-auto my-6 max-w-[1106px]">
        <nav aria-label="Layanan Utama">
          <MotionConfig reducedMotion="user">
            <LazyMotion features={domAnimation}>
              <m.ul
                className="grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {SERVICES.map((service) => (
                  <ServiceCard key={service.label} service={service} />
                ))}
              </m.ul>
            </LazyMotion>
          </MotionConfig>
        </nav>
      </div>
    </section>
  );
}
