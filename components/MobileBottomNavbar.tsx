"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  UserRoundPlus,
  Plus,
  TicketPercent,
  Bed,
  CalendarCheck2,
  CalendarDays,
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
  const router = useRouter();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPressing, setIsPressing] = useState(false);

  // State untuk melacak visibilitas navbar berdasarkan scroll
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Susunan 5 item simetris dengan tombol Plus (+) tepat berada di tengah (index 2)
  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Beranda", href: "/", icon: Home },
      { label: "Dokter", href: "/dokter", icon: UserRoundPlus },
      {
        label: "Tambah",
        href: "#action-menu",
        icon: Plus,
        isButton: true,
      },
      { label: "Promo", href: "/promo", icon: TicketPercent },
      { label: "Kamar", href: "/services/kamar-perawatan", icon: Bed },
    ],
    [],
  );

  // Sinkronisasi index aktif berdasarkan URL saat ini
  useEffect(() => {
    if (pathname === "/") {
      setActiveIndex(0);
      return;
    }

    // Jika sedang berada di halaman jadwal dokter, set index aktif ke tombol tengah (+)
    if (pathname === "/jadwal-dokter") {
      setActiveIndex(2);
      return;
    }

    const idx = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );

    if (idx !== -1) {
      setActiveIndex(idx);
    }
  }, [pathname, navItems]);

  // Sembunyikan sub-menu jika user mengklik area di luar menu tersebut
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setIsActionMenuOpen(false);
      }
    };
    if (isActionMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActionMenuOpen]);

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
        setIsActionMenuOpen(false); // Tutup juga sub-menu jika terbuka
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true); // Scroll keatas -> Muncul
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Style Dock Utama & Sub-menu: Sangat Glassmorphism & Reflektif Mewah
  const liquidGlassStyle = {
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    boxShadow: `
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 1px rgba(255, 255, 255, 0.4),
      inset 0 -1px 2px rgba(255, 255, 255, 0.1)
    `,
    willChange: "transform, opacity",
  } as React.CSSProperties & { WebkitBackdropFilter: string };

  return (
    <>
      {/* Modal Utama untuk Janji Temu */}
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* POP UP SUB-MENU (JANJI TEMU & JADWAL) */}
      <AnimatePresence>
        {isActionMenuOpen && isVisible && (
          <motion.div
            ref={actionMenuRef}
            initial={{ opacity: 0, y: 15, scale: 0.92, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.92, filter: "blur(4px)" }}
            transition={{
              type: "spring",
              mass: 0.8,
              stiffness: 350,
              damping: 25,
            }}
            className="fixed left-0 right-0 bottom-[95px] z-50 mx-auto w-[220px] rounded-2xl overflow-hidden p-1.5 flex flex-col gap-1"
            style={liquidGlassStyle}
          >
            {/* Kilauan reflektif internal untuk sub-menu pop up */}
            <div className="absolute top-0 inset-x-0 h-[15px] pointer-events-none bg-gradient-to-b from-white/10 to-transparent" />

            {/* Pilihan 1: Janji Temu */}
            <button
              type="button"
              onClick={() => {
                setIsActionMenuOpen(false);
                setIsBookingOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 active:bg-black/10 text-black text-sm font-medium text-left outline-none hover:bg-white/10"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <CalendarCheck2
                size={18}
                strokeWidth={2}
                className="text-black"
              />
              <span>Janji Temu</span>
            </button>

            {/* Garis Pembatas Tipis Glass */}
            <div className="h-[1px] w-full bg-white/20" />

            {/* Pilihan 2: Jadwal Dokter */}
            <button
              type="button"
              onClick={() => {
                setIsActionMenuOpen(false);
                router.push("/jadwal-dokter");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 active:bg-black/10 text-black text-sm font-medium text-left outline-none hover:bg-white/10"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <CalendarDays size={18} strokeWidth={2} className="text-black" />
              <span>Jadwal Dokter</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DOCK UTAMA CONTAINER */}
      <motion.div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 h-[60px] w-[calc(100vw-32px)] max-w-md rounded-full lg:hidden overflow-hidden"
        style={liquidGlassStyle}
        animate={{
          y: isVisible ? 0 : 120,
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
                        width: "90px",
                        height: "51px",
                        zIndex: -1,
                      }}
                      initial={{
                        background: "rgba(0, 0, 0, 0.05)",
                      }}
                      animate={{
                        background: isPressing
                          ? "rgba(0, 0, 0, 0.15)"
                          : "rgba(0, 0, 0, 0.08)",
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
                    scale: isActive ? 1.08 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="flex flex-col items-center justify-center"
                >
                  {item.isButton ? (
                    /* Animasi khusus rotasi untuk tombol Plus (+) saat menu terbuka */
                    <motion.div
                      animate={{ rotate: isActionMenuOpen ? 135 : 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Icon
                        size={22}
                        strokeWidth={2.5}
                        className="text-black transition-all duration-300"
                        style={{ filter: "none" }}
                      />
                    </motion.div>
                  ) : (
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      fill={
                        isActive &&
                        (item.label === "Beranda" || item.label === "Kamar")
                          ? "#000000"
                          : "none"
                      }
                      className="transition-all duration-300 text-black"
                      style={{
                        filter: isActive
                          ? "drop-shadow(0px 1px 4px rgba(0,0,0,0.15))"
                          : "none",
                      }}
                    />
                  )}
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
                      setIsActionMenuOpen((prev) => !prev);
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
                      setIsActionMenuOpen(false);
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
