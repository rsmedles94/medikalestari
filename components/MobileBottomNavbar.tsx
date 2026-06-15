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
  BedDouble,
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

  const actionMenuRef = useRef<HTMLDivElement>(null);
  // Tambahkan ref untuk tombol plus agar bisa dikecualikan saat klik luar
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Beranda", href: "/", icon: Home },
      { label: "Dokter", href: "/dokter", icon: UserRoundPlus },
      {
        label: "",
        href: "#action-menu",
        icon: Plus,
        isButton: true,
      },
      { label: "Jadwal", href: "/jadwal-dokter", icon: CalendarDays },
      { label: "Paket Kesehatan", href: "/promo", icon: TicketPercent },
    ],
    [],
  );

  // Sinkronisasi activeIndex berdasarkan pathname
  useEffect(() => {
    if (pathname === "/") {
      setActiveIndex(null);
      return;
    }

    if (pathname === "/services/kamar-perawatan") {
      setActiveIndex(0);
      return;
    } else if (pathname === "/services/ketersediaan-kamar") {
      setActiveIndex(1);
      return;
    }

    const idx = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );

    setActiveIndex(idx !== -1 ? idx : null);
  }, [pathname, navItems]);

  // Tutup action menu jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Jika yang diklik adalah tombol plus itu sendiri, biarkan logika onClick tombol yang bekerja
      if (
        plusButtonRef.current &&
        plusButtonRef.current.contains(event.target as Node)
      ) {
        return;
      }

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActionMenuOpen]);

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* WRAPPER NAVBAR + POPUP */}
      <div className="fixed bottom-0 left-0 right-0 z-40 w-full lg:hidden flex flex-col items-center">
        {/* POP UP SUB-MENU */}
        <AnimatePresence>
          {isActionMenuOpen && (
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
                <span>Buat Janji Temu</span>
              </button>

              {/* Garis Pembatas */}
              <div className="h-[1px] w-full bg-gray-100 my-0.5" />

              {/* Pilihan 2: Jadwal Dokter */}
              <button
                type="button"
                onClick={() => {
                  setIsActionMenuOpen(false);
                  router.push("/services/kamar-perawatan");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-sm font-medium text-left outline-none hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <BedDouble size={18} className="text-gray-500" />
                <span>Kamar Perawatan</span>
              </button>

              {/* Garis Pembatas */}
              <div className="h-[1px] w-full bg-gray-100 my-0.5" />

              {/* Pilihan 3: Jadwal Dokter */}
              <button
                type="button"
                onClick={() => {
                  setIsActionMenuOpen(false);
                  router.push("/ketersediaan-kamar");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-sm font-medium text-left outline-none hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <Bed size={18} className="text-gray-500" />
                <span>Ketersediaan Kamar</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BAR NAVBAR UTAMA */}
        <div className="w-full h-18 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
          <ul className="flex items-center justify-between h-full px-2">
            {navItems.map((item, i) => {
              const isActive = i === activeIndex;
              const Icon = item.icon;

              const buttonContent = (
                <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                  <div className="flex items-center justify-center">
                    {item.isButton ? (
                      <motion.div
                        animate={{ rotate: isActionMenuOpen ? 45 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="flex items-center justify-center h-full"
                      >
                        <Icon
                          size={32}
                          strokeWidth={3}
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

                  {!item.isButton && (
                    <span
                      className={`text-[11px] font-medium transition-colors duration-200 ${
                        isActive ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
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
                  key={item.label || i}
                  className="flex flex-1 justify-center h-full items-center"
                >
                  {item.isButton ? (
                    <button
                      ref={plusButtonRef} // Pasang ref di sini
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
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
        </div>
      </div>
    </>
  );
}
