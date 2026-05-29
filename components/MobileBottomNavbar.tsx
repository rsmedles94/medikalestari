"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchModal } from "@/context/SearchModalContext";

/**
 * ini untuk komponen navigasi bawah khusus tampilan mobile
 */
const MobileBottomNavbar = () => {
  const pathname = usePathname();
  const { isSearchOpen } = useSearchModal();

  /**
   * ini untuk daftar menu navigasi beserta ikon SVG (outline & solid)
   */
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
      label: "Jadwal Dokter",
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
            stroke="#003f88"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      ),
    },
    {
      label: "Kamar Perawatan",
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
          <path stroke="#003f88" strokeWidth="1.5" d="M9 7h6M9 11h6M9 15h6" />
        </g>
      ),
    },
  ];

  /**
   * ini untuk menyembunyikan navbar jika modal pencarian sedang terbuka
   */
  if (isSearchOpen) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-[#003f88] z-50 border-t border-white/10 pb-safe shadow-lg backface-hidden"
      aria-label="Mobile Bottom Navigation"
    >
      <ul className="flex justify-around items-stretch h-20 list-none p-0 m-0">
        {navItems.map((item) => {
          const isItemActive = pathname === item.href;

          return (
            <li key={item.label} className="w-1/4 flex">
              <Link
                href={item.href}
                prefetch={true}
                aria-current={isItemActive ? "page" : undefined}
                onClick={(e) => {
                  if (isItemActive) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="flex flex-col items-center justify-center w-full relative tap-highlight-transparent overflow-hidden select-none"
              >
                {/** * ini untuk indikator aktif bagian atas dengan AnimatePresence agar tidak bug saat pindah halaman 
                 */}
                <AnimatePresence mode="wait" presenceAffectsLayout={false}>
                  {isItemActive && (
                    <motion.div
                      layoutId="mobileNavIndicator"
                      className="absolute top-0 w-12 h-[3px] bg-white rounded-b-full z-10"
                      transition={{
                        type: "tween",
                        ease: "easeInOut",
                        duration: 0.23,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/** * ini untuk pembungkus konten ikon dan teks menu navigasi 
                 */}
                <motion.div
                  layout
                  className="relative flex flex-col items-center justify-center"
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                >
                  <div className="relative h-6 w-6 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-6 h-6 transition-colors duration-200 ${
                        isItemActive ? "text-white" : "text-white/60"
                      }`}
                      fill={isItemActive ? "white" : "none"}
                      stroke="currentColor"
                      strokeWidth={isItemActive ? "0.5" : "1.8"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transform: "translateZ(0)" }}
                    >
                      {/** * ini untuk animasi transisi perpindahan ikon outline ke solid 
                       */}
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.g
                          key={isItemActive ? "solid" : "outline"}
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.88 }}
                          transition={{ duration: 0.12, ease: "easeOut" }}
                        >
                          {isItemActive ? item.solid : item.outline}
                        </motion.g>
                      </AnimatePresence>
                    </svg>
                  </div>

                  <span
                    className={`text-[10px] mt-1 tracking-wide transition-all duration-200 ${
                      isItemActive
                        ? "text-white font-semibold opacity-100"
                        : "text-white/60 font-medium opacity-90"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomNavbar;