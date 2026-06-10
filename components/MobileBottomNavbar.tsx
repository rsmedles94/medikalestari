"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck2,
  UserRoundPlus,
  CalendarDays,
  TicketPercent,
  Bed,
} from "lucide-react";

import BookingModalFloating from "./BookingModalFloating";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  isButton?: boolean;
}

export default function MobileBottomNavbar() {
  const pathname = usePathname();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // State untuk mendeteksi apakah user sedang menekan/menggeser tombol (untuk opasitas liquid glass)
  const [isPressing, setIsPressing] = useState(false);

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        label: "Janji",
        href: "#booking",
        icon: CalendarCheck2,
        isButton: true,
      },
      { label: "Dokter", href: "/dokter", icon: UserRoundPlus },
      { label: "Jadwal", href: "/jadwal-dokter", icon: CalendarDays },
      { label: "Promo", href: "/promo", icon: TicketPercent },
      { label: "Kamar", href: "/services/kamar-perawatan", icon: Bed },
    ],
    [],
  );

  useEffect(() => {
    if (pathname === "/") {
      setActiveIndex(-1);
      return;
    }
    const idx = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );
    if (idx !== -1) {
      setActiveIndex(idx);
    }
  }, [pathname, navItems]);

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 lg:hidden">
        {/* DOCK CONTAINER (Liquid Glass Base) */}
        <div
          className="relative w-full max-w-md h-[70px] rounded-full overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.15),
              inset 0 1px 1px rgba(255, 255, 255, 0.4),
              inset 0 -1px 2px rgba(0, 0, 0, 0.1)
            `,
          }}
        >
          {/* EFEK KILAUAN CAHAYA UTAMA DOCK */}
          <div
            className="absolute top-0 left-6 right-6 h-[1px] pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
            }}
          />
          <div
            className="absolute top-[1px] inset-x-0 h-[30px] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0))",
            }}
          />

          {/* NAV ITEMS LIST */}
          <ul className="relative z-10 flex items-center justify-between h-full px-3">
            {navItems.map((item, i) => {
              const isActive = i === activeIndex;
              const Icon = item.icon;

              const buttonContent = (
                <div className="relative flex flex-col items-center justify-center w-full h-full">
                  {/* LIQUID GLASS ACTIVE SLIDER INDICATOR */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="liquidActiveGlow"
                        className="absolute pointer-events-none rounded-full"
                        style={{
                          width: "100px",
                          height: "60px",
                          zIndex: -1,
                        }}
                        initial={{
                          background: "rgba(255, 255, 255, 0.4)",
                          boxShadow: `
                            0 4px 16px rgba(255, 255, 255, 0.2),
                            inset 0 1px 2px rgba(255, 255, 255, 0.6),
                            inset 0 -1px 2px rgba(0, 0, 0, 0.05)
                          `,
                          border: "1px solid rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(4px)",
                          WebkitBackdropFilter: "blur(4px)",
                        }}
                        animate={{
                          // Otomatis berubah 80% saat ditekan/di-slide, 40% saat dilepas
                          background: isPressing
                            ? "rgba(255, 255, 255, 0.8)"
                            : "rgba(255, 255, 255, 0.4)",
                          boxShadow: isPressing
                            ? `
                              0 6px 24px rgba(255, 255, 255, 0.4),
                              inset 0 1px 2px rgba(255, 255, 255, 0.8),
                              inset 0 -1px 2px rgba(0, 0, 0, 0.05)
                            `
                            : `
                              0 4px 16px rgba(255, 255, 255, 0.2),
                              inset 0 1px 2px rgba(255, 255, 255, 0.6),
                              inset 0 -1px 2px rgba(0, 0, 0, 0.05)
                            `,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30, // Efek lentur/snappy mirip iOS original
                        }}
                      >
                        {/* Efek Refleksi Internal Tambahan di dalam Kaca Aktif */}
                        <div
                          className="absolute inset-x-2 top-0.5 h-[1px]"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ICON & LABEL WRAPPER */}
                  <motion.div
                    animate={{
                      y: isActive ? -2 : 0,
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="flex flex-col items-center justify-center gap-0.5"
                  >
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.3 : 1.8}
                      className="transition-colors duration-300"
                      style={{
                        color: isActive ? "#000000" : "#000000",
                        filter: isActive
                          ? "drop-shadow(0 1px 2px rgba(255,255,255,0.6))"
                          : "none",
                      }}
                    />

                  </motion.div>
                </div>
              );

              const sharedLinkStyle: React.CSSProperties = {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                outline: "none",
                WebkitTapHighlightColor: "transparent",
                cursor: "pointer",
              };

              // Listener interaksi sentuhan/klik untuk pemicu perubahan opasitas
              const touchHandlers = {
                onMouseDown: () => setIsPressing(true),
                onMouseUp: () => setIsPressing(false),
                onTouchStart: () => setIsPressing(true),
                onTouchEnd: () => setIsPressing(false),
              };

              return (
                <li
                  key={item.label}
                  className="flex flex-1 justify-center h-full items-center"
                >
                  {item.isButton ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsBookingOpen(true);
                        setActiveIndex(i);
                      }}
                      {...touchHandlers}
                      style={sharedLinkStyle}
                      className="select-none focus:outline-none focus-visible:outline-none"
                    >
                      {buttonContent}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (pathname === item.href) {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                        setActiveIndex(i);
                      }}
                      {...touchHandlers}
                      style={sharedLinkStyle}
                      className="select-none focus:outline-none focus-visible:outline-none"
                    >
                      {buttonContent}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
