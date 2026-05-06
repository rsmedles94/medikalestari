"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const MobileBottomNavbar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Beranda",
      href: "/",
      outline: (
        <path d="M3 10.182V20a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1v-9.818a1 1 0 0 0-.316-.727l-8-7.273a1 1 0 0 0-1.368 0l-8 7.273A1 1 0 0 0 3 10.182Z" />
      ),
      solid: (
        <path d="M11.316 2.182a1 1 0 0 1 1.368 0l8 7.273A1 1 0 0 1 21 10.182V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.818a1 1 0 0 1 .316-.727l8-7.273Z" />
      ),
    },
    {
      label: "Temukan Dokter",
      href: "/dokter",
      outline: (
        <g>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </g>
      ),
      solid: (
        <g>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2H16Z" />
          <circle cx="9" cy="7" r="4" />
          <path d="M19 15.13A4 4 0 0 1 22 19V21H18V19C18 17.2 17.1 15.7 15.7 14.8C16.8 14.4 18 14.5 19 15.13Z" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </g>
      ),
    },
    {
      label: "Jadwal",
      href: "/jadwal-dokter",
      outline: (
        <g>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </g>
      ),
      solid: (
        <g>
          <circle cx="12" cy="12" r="10" />
          <path
            d="M12 6v6l4 2"
            stroke="#004684" // Memberikan warna kontras di dalam solid icon
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      ),
    },
    {
      label: "Kamar",
      href: "/services/kamar-perawatan",
      outline: (
        <g>
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
          <path d="M10 6h4" />
          <path d="M10 10h4" />
        </g>
      ),
      solid: (
        <g>
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18H6Z" />
          <path d="M2 14a2 2 0 0 1 2-2h2v10H4a2 2 0 0 1-2-2v-6Z" />
          <path d="M18 9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2V9Z" />
          <path stroke="#004684" strokeWidth="1.5" d="M9 7h6M9 11h6M9 15h6" />
        </g>
      ),
    },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#004684] z-50 border-t border-white/5 pb-safe">
        <div className="flex justify-around items-stretch h-18">
          {navItems.map((item) => {
            const isItemActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch={true}
                onClick={(e) => {
                  if (isItemActive) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="flex flex-col items-center justify-center w-1/4 relative tap-highlight-transparent overflow-hidden"
              >
                {/* Indikator Atas menggunakan GPU Acceleration (Framer Motion) */}
                {isItemActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute top-0 w-12 h-[3px] bg-white rounded-b-full z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <motion.div
                  className="relative flex flex-col items-center"
                  whileTap={{ scale: 0.9 }} // Visual feedback instan
                >
                  <div className="relative h-6 w-6">
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isItemActive ? "text-white" : "text-white/60"
                      }`}
                      // Agar ikon solid tidak menutupi detail garis dalam
                      fill={isItemActive ? "white" : "none"}
                      stroke="currentColor"
                      strokeWidth={isItemActive ? "0.5" : "1.8"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transform: "translateZ(0)" }} // Force GPU rendering
                    >
                      <AnimatePresence mode="wait">
                        <motion.g
                          key={isItemActive ? "solid" : "outline"}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                        >
                          {isItemActive ? item.solid : item.outline}
                        </motion.g>
                      </AnimatePresence>
                    </svg>
                  </div>

                  <span
                    className={`text-[10px] mt-1 transition-all duration-300 ${
                      isItemActive
                        ? "text-white font-bold opacity-100"
                        : "text-white/60 font-medium opacity-90"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="md:hidden h-18" />
    </>
  );
};

export default MobileBottomNavbar;
