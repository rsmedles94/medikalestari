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
      { label: "", href: "/", icon: Home },
      { label: "", href: "/dokter", icon: UserRoundPlus },
      {
        label: "",
        href: "#action-menu",
        icon: Plus,
        isButton: true,
      },
      { label: "", href: "/jadwal-dokter", icon: CalendarDays },
      { label: "", href: "/promo", icon: TicketPercent },
    ],
    [],
  );

  // Hitung active index
  const activeIndex = useMemo(() => {
    if (pathname === "/") {
      return 0;
    }

    const idx = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );

    return idx !== -1 ? idx : null;
  }, [pathname, navItems]);

  // Handler dengan useCallback
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

  // Fungsi untuk menentukan warna ikon
  const getIconColor = (item: NavItem, index: number) => {
    const isActive = index === activeIndex;
    const isHome = item.label === "Beranda";
    const isHomeActive = isHome && pathname === "/";

    // Khusus untuk Beranda: selalu hitam gelap (dull) jika aktif
    if (isHomeActive) {
      return "#000000";
    }

    // Untuk menu lainnya: hitam jika aktif, abu-abu jika tidak
    return isActive ? "#000000" : "#9CA3AF";
  };

  // Fungsi untuk menentukan fill ikon
  const getIconFill = (item: NavItem, index: number) => {
    const isActive = index === activeIndex;
    const isHome = item.label === "Beranda";
    const isHomeActive = isHome && pathname === "/";

    // Khusus untuk Beranda: fill hitam jika aktif
    if (isHomeActive) {
      return "#000000";
    }

    // Untuk menu lainnya: fill hitam hanya jika aktif
    return isActive ? "#000000" : "none";
  };

  // Fungsi untuk menentukan warna teks
  const getTextColor = (item: NavItem, index: number) => {
    const isActive = index === activeIndex;
    const isHome = item.label === "Beranda";
    const isHomeActive = isHome && pathname === "/";

    if (isHomeActive) {
      return "#000000";
    }

    return isActive ? "#000000" : "#9CA3AF";
  };

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
        <div className="w-full h-18 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
          <ul className="flex items-center justify-between h-full px-2">
            {navItems.map((item, i) => {
              const Icon = item.icon;

              return (
                <li
                  key={item.label || i}
                  className="flex flex-1 justify-center h-full items-center"
                >
                  {item.isButton ? (
                    <button
                      ref={plusButtonRef}
                      type="button"
                      onClick={handlePlusClick}
                      className="flex flex-col items-center justify-center w-full h-full select-none focus:outline-none"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                        outline: "none",
                        WebkitTapHighlightColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <Plus
                          size={32}
                          strokeWidth={3}
                          style={{
                            transform: isActionMenuOpen
                              ? "rotate(45deg)"
                              : "rotate(0deg)",
                            transition:
                              "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            color: isActionMenuOpen ? "#000000" : "#9CA3AF",
                          }}
                        />
                      </div>
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
                      className="flex flex-col items-center justify-center w-full h-full select-none focus:outline-none"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                        outline: "none",
                        WebkitTapHighlightColor: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                        <div className="flex items-center justify-center">
                          <Icon
                            size={32}
                            strokeWidth={
                              i === activeIndex ||
                              (item.label === "Beranda" && pathname === "/")
                                ? 2.5
                                : 2
                            }
                            fill={getIconFill(item, i)}
                            style={{
                              color: getIconColor(item, i),
                              transition: "color 0.15s ease",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            color: getTextColor(item, i),
                            transition: "color 0.15s ease",
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
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
