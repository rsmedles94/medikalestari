"use client";

import React, { useMemo } from "react";
import Link from "next/link"; // ini untuk memperbaiki error merah pada (e)
import { usePathname } from "next/navigation";
import { useSearchModal } from "@/context/SearchModalContext";

/**
 * ini untuk komponen navigasi bawah khusus tampilan mobile dengan optimasi performa tinggi tanpa framer-motion
 */
const MobileBottomNavbar = () => {
  const pathname = usePathname();
  const { isSearchOpen } = useSearchModal();

  // Memoize navbar items untuk optimize performa
  const navItems = useMemo(
    () => [
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
    ],
    [],
  );

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 bg-[#003f88] z-50 border-t border-white/10 pb-safe shadow-lg will-change-transform transform-gpu transition-opacity ${
        isSearchOpen ? "hidden" : "block"
      }`}
      aria-label="Mobile Bottom Navigation"
      suppressHydrationWarning
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
                {/** * ini untuk indikator aktif atas murni menggunakan CSS murni agar instan dan bebas jeda/lag
                 */}
                <div
                  className={`absolute top-0 w-12 h-0.75 bg-white rounded-b-full z-10 transition-all duration-200 ease-in-out ${
                    isItemActive
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75 pointer-events-none"
                  }`}
                  suppressHydrationWarning
                />

                {/** * ini untuk pembungkus konten menu utama dengan animasi tap css murni yang sangat enteng
                 */}
                <div
                  className="relative flex flex-col items-center justify-center active:scale-95 transition-transform duration-100 ease-out transform-gpu"
                  suppressHydrationWarning
                >
                  <div
                    className="relative h-6 w-6 flex items-center justify-center"
                    suppressHydrationWarning
                  >
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
                    >
                      {/** * ini untuk transisi perpindahan opacity ikon isi (solid) dan garis (outline) menggunakan CSS murni
                       */}
                      <g className="transition-all duration-150 ease-in-out">
                        {isItemActive ? item.solid : item.outline}
                      </g>
                    </svg>
                  </div>

                  <span
                    className={`text-[10px] mt-1 tracking-wide transition-all duration-200 ${
                      isItemActive
                        ? "text-white font-semibold opacity-100"
                        : "text-white/60 font-medium opacity-90"
                    }`}
                    suppressHydrationWarning
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomNavbar;
