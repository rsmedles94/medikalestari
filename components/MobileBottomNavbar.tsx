"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

// Lucide Icon untuk Home saat aktif
import { Home } from "lucide-react";

// Font Awesome Imports untuk ikon lainnya
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
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
  icon?: IconDefinition;
  isHome?: boolean;
  isButton?: boolean;
}

// Fungsi pendeteksi client render
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// Komponen Ikon Rumah Tanpa Pintu (Khusus saat Tidak Aktif)
function HomeOutlineNoDoor({
  size = 25,
  color = "#9CA3AF",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" opacity="0" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export default function MobileBottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMounted = useIsMounted();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Beranda", href: "/", isHome: true },
      { label: "Dokter", href: "/dokter", icon: faUserDoctor },
      { label: "Tambah", href: "#action-menu", icon: faPlus, isButton: true },
      { label: "Jadwal", href: "/jadwal-dokter", icon: faCalendarDays },
      { label: "Promo", href: "/promo", icon: faTicket },
    ],
    [],
  );

  const activeIndex = useMemo(() => {
    if (!isMounted) return null;
    const idx = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );
    return idx !== -1 ? idx : null;
  }, [pathname, navItems, isMounted]);

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

  if (!isMounted) return null;

  return (
    <>
      {/* Modal Floating */}
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Nav Bawah Utama */}
      <nav
        aria-label="Navigasi Bawah Seluler"
        className="fixed bottom-0 left-0 right-0 z-[99] w-full lg:hidden flex flex-col items-center"
      >
        {/* Menu Pop-up */}
        <AnimatePresence mode="wait">
          {isActionMenuOpen && (
            <aside
              ref={actionMenuRef}
              className="mb-2 w-[220px] bg-white border border-gray-200 shadow-xl rounded-xl p-1 flex flex-col z-[100]"
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

              {/* Tombol Buat Janji */}
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

              {/* Tombol Kamar Perawatan */}
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

              {/* Tombol Ketersediaan Kamar */}
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
            </aside>
          )}
        </AnimatePresence>

        {/* Bar Navigasi */}
        <div className="w-full h-16 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
          <menu className="flex items-center justify-between h-full px-4 m-0 p-0 list-none">
            {navItems.map((item, i) => {
              const isActive = i === activeIndex;

              return (
                <li
                  key={item.href || i}
                  className="flex flex-1 justify-center h-full items-center"
                >
                  {item.isButton ? (
                    /* Tombol Plus */
                    <button
                      ref={plusButtonRef}
                      type="button"
                      aria-label="Menu Aksi Tambahan"
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
                    /* Link Navigasi */
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      onClick={(e) => {
                        if (pathname === item.href) {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-xl active:scale-95 transition-transform select-none focus:outline-none"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      {item.isHome ? (
                        isActive ? (
                          /* Aktif: Home Lucide Solid Full (25px) */
                          <Home
                            className="w-[25px] h-[25px]"
                            style={{ color: "#003f88" }}
                            fill="currentColor"
                            strokeWidth={2.2}
                          />
                        ) : (
                          /* Tidak Aktif: Rumah Rangka Normal Tanpa Pintu (25px) */
                          <HomeOutlineNoDoor size={25} color="#9CA3AF" />
                        )
                      ) : (
                        /* Ikon FontAwesome Lainnya */
                        item.icon && (
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="text-[24px]"
                            style={{
                              color: isActive ? "#003f88" : "#9CA3AF",
                              transition: "all 0.15s ease",
                            }}
                          />
                        )
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </menu>
        </div>
      </nav>
    </>
  );
}
