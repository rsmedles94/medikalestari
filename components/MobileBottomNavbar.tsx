"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck2,
  UserRoundPlus,
  CalendarDays,
  TicketPercent,
  Bed,
} from "lucide-react";
import BookingModalFloating from "./BookingModalFloating";

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface LucideLikeProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}

type IconComponentType = React.ComponentType<LucideLikeProps>;
type NavIcon = IconComponentType;

interface NavItem {
  label: string;
  href: string;
  icon: NavIcon;
  isButton?: boolean;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
const MobileBottomNavbar = () => {
  const pathname = usePathname();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Default awal -1 supaya jika pertama load di Beranda, tidak ada kapsul biru yang menyala
  const [activeIndex, setActiveIndex] = useState(-1);

  // Urutan: Buat Janji, Dokter, Jadwal, Promo, Kamar
  const navItems = useMemo<NavItem[]>(
    () => [
      {
        label: "Buat Janji",
        href: "#booking",
        isButton: true,
        icon: CalendarCheck2,
      },
      {
        label: "Dokter",
        href: "/dokter",
        icon: UserRoundPlus,
      },
      {
        label: "Jadwal",
        href: "/jadwal-dokter",
        icon: CalendarDays,
      },
      {
        label: "Promo",
        href: "/promo",
        icon: TicketPercent,
      },
      {
        label: "Kamar",
        href: "/services/kamar-perawatan",
        icon: Bed,
      },
    ],
    [],
  );

  // SINKRONISASI OTOMATIS: Reset menu jika user ke Beranda via Logo Atas
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (pathname === "/") {
      setActiveIndex(-1); // Matikan semua bg biru
    } else {
      // Jika pindah ke page lain, cari index-nya berdasarkan url yang cocok
      const currentIdx = navItems.findIndex((item) => item.href === pathname);
      if (currentIdx !== -1) {
        setActiveIndex(currentIdx);
      }
    }
  }, [pathname, navItems]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const renderNavItem = (item: NavItem, i: number) => {
    // Aktif hanya jika index state cocok DAN bukan sedang di Beranda (/)
    const isActive = i === activeIndex && pathname !== "/";

    // Flexgrow membesar untuk kapsul aktif memberikan ruang ke samping
    const liStyles = isActive ? "flex-[2.2]" : "flex-1";

    const getCapsuleStyles = () => {
      if (isActive) {
        // Kapsul Biru Terang dengan teks & ikon putih di dalamnya
        return "text-white bg-[#003f88] px-4 py-2.5 rounded-xl shadow-md flex-row justify-center gap-2 w-full max-w-[150px]";
      }
      return "text-slate-400 bg-transparent flex-col justify-center w-auto";
    };

    const commonProps = {
      title: item.label,
      className:
        "flex items-center justify-center w-full h-16 border-0 bg-transparent cursor-pointer select-none active:scale-95 transition-transform duration-150",
    };

    const IconComponent = item.icon;

    const content = (
      <div
        className={`flex items-center mx-auto transition-all duration-300 ease-in-out ${getCapsuleStyles()}`}
      >
        <span className="flex items-center justify-center h-5 w-5 shrink-0 transition-transform duration-300">
          <IconComponent
            size={19}
            strokeWidth={isActive ? 2.4 : 1.8}
            color={isActive ? "#ffffff" : "#94a3b8"}
          />
        </span>

        {/* Teks label hanya dirender jika menu berstatus AKTIF */}
        {isActive && (
          <span className="text-[12px] font-bold tracking-wide leading-none text-center block whitespace-nowrap animate-fadeIn">
            {item.label}
          </span>
        )}
      </div>
    );

    return (
      <li
        key={item.label}
        className={`h-full flex justify-center items-center transition-all duration-300 ease-in-out ${liStyles}`}
      >
        {item.isButton ? (
          <button
            type="button"
            onClick={() => {
              setIsBookingOpen(true);
              setActiveIndex(i);
            }}
            {...commonProps}
          >
            {content}
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
            {...commonProps}
          >
            {content}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        {/* Dock Bar Putih */}
        <div
          className="relative w-full overflow-hidden bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <ul className="relative z-10 flex m-0 list-none p-0 w-full h-20 items-center justify-between">
            {navItems.map((item, i) => renderNavItem(item, i))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileBottomNavbar;
