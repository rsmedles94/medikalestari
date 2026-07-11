"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
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

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

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
      { label: "Jadwal", href: "/jadwal-dokter", icon: CalendarDays },
      { label: "Promo", href: "/promo", icon: TicketPercent },
    ],
    [],
  );

  // Menentukan index menu aktif berdasarkan pathname saat ini
  const activeIndex = useMemo(() => {
    const idx = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );
    return idx !== -1 ? idx : null;
  }, [pathname, navItems]);

  const handlePlusClick = useCallback(() => {
    setIsActionMenuOpen((prev) => !prev);
  }, []);

  const handleOutsideClick = useCallback((event: MouseEvent) => {
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
  }, []);

  useEffect(() => {
    if (isActionMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [isActionMenuOpen, handleOutsideClick]);

  const handleActionClick = useCallback((action: () => void) => {
    setIsActionMenuOpen(false);
    action();
  }, []);

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="fixed bottom-0 left-0 right-0 z-40 w-full lg:hidden flex flex-col items-center">
        {/* POP UP SUB-MENU */}
        <AnimatePresence mode="wait">
          {isActionMenuOpen && (
            <div
              ref={actionMenuRef}
              className="mb-2 w-[220px] bg-white border border-gray-200 shadow-xl rounded-xl p-1 flex flex-col z-50"
              style={{
                opacity: 1,
                transform: "scale(1)",
                animation: "menuFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <style jsx>{`
                @keyframes menuFadeIn {
                  from {
                    opacity: 0;
                    transform: scale(0.95) translateY(15px);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                  }
                }
              `}</style>

              <button
                type="button"
                onClick={() => handleActionClick(() => setIsBookingOpen(true))}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-sm font-medium text-left outline-none hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <CalendarCheck2 size={18} className="text-gray-500" />
                <span>Buat Janji Temu</span>
              </button>

              <div className="h-[1px] w-full bg-gray-100 my-0.5" />

              <button
                type="button"
                onClick={() =>
                  handleActionClick(() =>
                    router.push("/services/kamar-perawatan"),
                  )
                }
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-sm font-medium text-left outline-none hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <BedDouble size={18} className="text-gray-500" />
                <span>Kamar Perawatan</span>
              </button>

              <div className="h-[1px] w-full bg-gray-100 my-0.5" />

              <button
                type="button"
                onClick={() =>
                  handleActionClick(() => router.push("/ketersediaan-kamar"))
                }
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 text-sm font-medium text-left outline-none hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-lg"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <Bed size={18} className="text-gray-500" />
                <span>Ketersediaan Kamar</span>
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* BAR NAVBAR UTAMA */}
        <div className="w-full h-16 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
          <ul className="flex items-center justify-between h-full px-4">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = i === activeIndex;

              return (
                <li
                  key={item.href || i}
                  className="flex flex-1 justify-center h-full items-center"
                >
                  {item.isButton ? (
                    <button
                      ref={plusButtonRef}
                      type="button"
                      onClick={handlePlusClick}
                      className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-gray-50 active:scale-95 transition-all select-none focus:outline-none"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <Plus
                        size={26}
                        strokeWidth={2.5}
                        className="transition-transform duration-200"
                        style={{
                          transform: isActionMenuOpen
                            ? "rotate(45deg)"
                            : "rotate(0deg)",
                          color: isActionMenuOpen ? "#000000" : "#6B7280",
                        }}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (pathname === item.href) {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-xl active:scale-95 transition-transform select-none focus:outline-none"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <Icon
                        size={24}
                        // Menggunakan ketebalan stroke tebal saat aktif ala Instagram
                        strokeWidth={isActive ? 2.8 : 2}
                        // Khusus Home menggunakan fill solid, sisanya mempertahankan lubang aslinya
                        fill={
                          isActive && item.href === "/" ? "#000000" : "none"
                        }
                        style={{
                          color: isActive ? "#000000" : "#9CA3AF",
                          transition: "all 0.15s ease",
                        }}
                      />
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
