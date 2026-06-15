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
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const actionMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (pathname === "/") {
      setActiveIndex(0);
      return;
    }

    if (pathname === "/jadwal-dokter") {
      setActiveIndex(2);
      return;
    }

    const idx = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );

    if (idx !== -1) {
      setActiveIndex(idx);
    } else {
      setActiveIndex(null);
    }
  }, [pathname, navItems]);

  // Tutup sub-menu jika klik di luar area
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

  // Handler Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        setIsActionMenuOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* DOCK UTAMA & POPUP WRAPPER */}
      <div className="fixed bottom-0 left-0 right-0 z-40 w-full lg:hidden flex flex-col items-center">
        {/* POP UP SUB-MENU */}
        <AnimatePresence>
          {isActionMenuOpen && isVisible && (
            <motion.div
              ref={actionMenuRef}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="mb-2 w-[220px] bg-white border border-gray-200 shadow-xl rounded-xl p-1 flex flex-col z-50"
            >
              {/* Pilihan 1: Janji Temu */}
              <button
                type="button"
                onClick={() => {
                  setIsActionMenuOpen(false);
                  setIsBookingOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-sm font-medium text-left outline-none hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <CalendarCheck2 size={18} className="text-gray-500" />
                <span>Janji Temu</span>
              </button>

              {/* Garis Pembatas */}
              <div className="h-[1px] w-full bg-gray-100 my-0.5" />

              {/* Pilihan 2: Jadwal Dokter */}
              <button
                type="button"
                onClick={() => {
                  setIsActionMenuOpen(false);
                  router.push("/jadwal-dokter");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-sm font-medium text-left outline-none hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <CalendarDays size={18} className="text-gray-500" />
                <span>Jadwal Dokter</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BAR NAVBAR UTAMA */}
        <motion.div
          className="w-full h-18 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] overflow-hidden"
          animate={{
            y: isVisible ? 0 : 72,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        >
          <ul className="flex items-center justify-between h-full px-2">
            {navItems.map((item, i) => {
              const isActive = i === activeIndex;
              const Icon = item.icon;

              const buttonContent = (
                <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                  <div className="flex items-center justify-center">
                    {item.isButton ? (
                      /* Diperbaiki: Hanya rotasi 45 derajat (membentuk x) atau ke 0 dengan transisi eased */
                      <motion.div
                        animate={{ rotate: isActionMenuOpen ? 45 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <Icon
                          size={24}
                          strokeWidth={2.5}
                          className={
                            isActionMenuOpen ? "text-black" : "text-gray-400"
                          }
                        />
                      </motion.div>
                    ) : (
                      <Icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                        fill={
                          isActive &&
                          (item.label === "Beranda" || item.label === "Kamar")
                            ? "#000000"
                            : "none"
                        }
                        className={`transition-colors duration-200 ${
                          isActive ? "text-black" : "text-gray-400"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium transition-colors duration-200 ${
                      item.isButton && isActionMenuOpen
                        ? "text-black"
                        : isActive
                          ? "text-black"
                          : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
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

              return (
                <li
                  key={item.label}
                  className="flex flex-1 justify-center h-full items-center"
                >
                  {item.isButton ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Mencegah event bubbling yang memicu klik ganda
                        setIsActionMenuOpen((prev) => !prev);
                      }}
                      style={sharedLinkStyle}
                      className="select-none focus:outline-none"
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
                      style={sharedLinkStyle}
                      className="select-none focus:outline-none"
                    >
                      {buttonContent}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </>
  );
}
