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
  const [isPressing, setIsPressing] = useState(false);

  // State untuk melacak visibilitas navbar berdasarkan scroll
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // Logika Scroll: Kebawah = HIDE, Keatas = SHOW
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scroll kebawah -> Sembunyi
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true); // Scroll keatas -> Muncul
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Style Dock Utama: Sangat Glassmorphism & Reflektif Mewah
  const liquidGlassStyle = {
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: `
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 1px rgba(255, 255, 255, 0.4),
      inset 0 -1px 2px rgba(0, 0, 0, 0.1)
    `,
    willChange: "transform, opacity", // Mengunci performa GPU agar blur tidak patah/berubah saat scroll
  } as React.CSSProperties & { WebkitBackdropFilter: string };

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Wrapper animasi hide/show smooth */}
      <motion.div
        className="fixed inset-x-4 bottom-5 z-50 mx-auto w-full max-w-md h-[60px] rounded-full lg:hidden overflow-hidden"
        style={liquidGlassStyle}
        animate={{
          y: isVisible ? 0 : 120, // Diturunkan melewati batas layar saat sembunyi
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 28,
        }}
      >
        {/* EFEK KILAUAN CAHAYA UTAMA DOCK (REFLEKTIF) */}
        <div
          className="absolute top-0 left-6 right-6 h-[1px] pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
          }}
        />
        <div
          className="absolute top-[1px] inset-x-0 h-[30px] pointer-events-none z-20"
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
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="liquidActiveGlow"
                      className="absolute pointer-events-none rounded-full"
                      style={{
                        width: "100px", // Lebar dikembalikan sesuai kode asli Anda
                        height: "51px", // Tinggi dikembalikan sesuai kode asli Anda
                        zIndex: -1,
                      }}
                      initial={{
                        background: "rgba(0, 0, 0, 0.05)",
                      }}
                      animate={{
                        // Background Flat Gelap Tipis (Tanpa bayangan emboss internal/eksternal)
                        background: isPressing
                          ? "rgba(0, 0, 0, 0.15)"
                          : "rgba(0, 0, 0, 0.06)",
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  animate={{
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="flex flex-col items-center justify-center"
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.3 : 1.8}
                    className="transition-colors duration-300"
                    style={{
                      color: "#000000",
                      filter: "none", // Menjamin icon flat bersih tanpa drop-shadow/emboss putih
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
      </motion.div>
    </>
  );
}
