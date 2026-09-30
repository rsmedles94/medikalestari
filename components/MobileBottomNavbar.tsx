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

// Font Awesome Imports & Types
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faHouse,
  faUserDoctor,
  faPlus,
  faCalendarDays,
  faTicket,
  faCalendarCheck,
  faProcedures,
  faBed,
} from "@fortawesome/free-solid-svg-icons";

import BookingModalFloating from "./BookingModalFloating";

interface NavItem {
  label: string;
  href: string;
  icon: IconDefinition;
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
      { label: "Beranda", href: "/", icon: faHouse },
      { label: "Dokter", href: "/dokter", icon: faUserDoctor },
      {
        label: "Tambah",
        href: "#action-menu",
        icon: faPlus,
        isButton: true,
      },
      { label: "Jadwal", href: "/jadwal-dokter", icon: faCalendarDays },
      { label: "Promo", href: "/promo", icon: faTicket },
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
              className="mb-2 w-[220px] bg-white border border-gray-200 shadow-xl rounded-xl p-1 flex flex-col z-100"
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
                <FontAwesomeIcon
                  icon={faCalendarCheck}
                  className="text-gray-500 w-[18px] h-[18px]"
                />
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
                <FontAwesomeIcon
                  icon={faProcedures}
                  className="text-gray-500 w-[18px] h-[18px]"
                />
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
                <FontAwesomeIcon
                  icon={faBed}
                  className="text-gray-500 w-[18px] h-[18px]"
                />
                <span>Ketersediaan Kamar</span>
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* BAR NAVBAR UTAMA */}
        <div className="w-full h-16 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
          <ul className="flex items-center justify-between h-full px-4">
            {navItems.map((item, i) => {
              const iconDef = item.icon;
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
                      <FontAwesomeIcon
                        icon={faPlus}
                        className="transition-transform duration-200 text-[26px]"
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
                      <FontAwesomeIcon
                        icon={iconDef}
                        className="text-[24px]"
                        style={{
                          color: isActive ? "#003f88" : "#9CA3AF",
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
