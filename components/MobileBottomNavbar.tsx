"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Stethoscope } from "lucide-react";
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
type NavIcon = IconComponentType | React.ReactNode;

interface NavItem {
  label: string;
  href: string;
  icon: NavIcon;
  isButton?: boolean;
}

const isElementType = (icon: NavIcon): icon is IconComponentType =>
  typeof icon === "function" ||
  (typeof icon === "object" && icon !== null && "render" in icon);

// ==========================================
// MAIN COMPONENT
// ==========================================
const MobileBottomNavbar = () => {
  const pathname = usePathname();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        label: "Beranda",
        href: "/",
        icon: (
          <path d="M11.316 2.182a1 1 0 0 1 1.368 0l8 7.273A1 1 0 0 1 21 10.182V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.818a1 1 0 0 1 .316-.727l8-7.273Z" />
        ),
      },
      {
        label: "Dokter",
        href: "/dokter",
        icon: Stethoscope,
      },
      {
        label: "Janji Temu",
        href: "#booking",
        isButton: true,
        icon: (
          <g>
            <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </g>
        ),
      },
      {
        label: "Jadwal",
        href: "/jadwal-dokter",
        icon: (
          <g>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </g>
        ),
      },
      {
        label: "Kamar",
        href: "/services/kamar-perawatan",
        icon: (
          <g>
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18H6Z" />
            <path d="M2 14a2 2 0 0 1 2-2h2v10H4a2 2 0 0 1-2-2v-6Z" />
            <path d="M18 9a2 2 0 0 1 2 2v9a2 2 0 0 1-18 2h-2V9Z" />
          </g>
        ),
      },
    ],
    [],
  );

  const renderIcon = (item: NavItem, isActive: boolean) => {
    if (isElementType(item.icon)) {
      const IconComp = item.icon;
      return (
        <IconComp
          size={22}
          strokeWidth={isActive ? 2.2 : 1.8}
          className="w-[22px] h-[22px]"
          color={item.label === "Beranda" && isActive ? "#ffffff" : undefined}
        />
      );
    }

    const isBerandaActive = item.label === "Beranda" && isActive;
    const strokeWidth =
      item.label === "Beranda" && isActive ? "0" : isActive ? "2.2" : "1.8";

    return (
      <svg
        viewBox="0 0 24 24"
        className="w-[22px] h-[22px]"
        fill={isBerandaActive ? "currentColor" : "none"}
        stroke={isBerandaActive ? "none" : "currentColor"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {item.icon}
      </svg>
    );
  };

  const renderNavItem = (item: NavItem, i: number) => {
    const isActive = i === activeIndex || pathname === item.href;

    const commonProps = {
      title: item.label,
      className: `flex flex-col items-center justify-center w-full h-16 border-0 bg-transparent cursor-pointer transition-all duration-150 select-none active:scale-95 ${
        isActive ? "text-white font-bold" : "text-slate-300 hover:text-white"
      }`,
    };

    const content = (
      <div className="flex flex-col items-center justify-center gap-1 w-full">
        <span className="flex items-center justify-center h-6 w-6">
          {renderIcon(item, isActive)}
        </span>
        <span className="text-[10px] font-medium tracking-wide leading-none text-center block">
          {item.label}
        </span>
      </div>
    );

    if (item.isButton) {
      return (
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
      );
    }

    return (
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
    );
  };

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div
          className="relative w-full overflow-hidden bg-[#003f88] border-t border-white/10 shadow-[0_-4px_16px_rgba(0,0,0,0.15)]"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {/* Garis highlight atas yang simetris & tipis */}
          <div className="absolute top-0 left-0 right-0 h-px bg-white/10 pointer-events-none" />

          {/* Navigation Grid (Sempurna di Tengah) */}
          <ul className="relative z-10 flex m-0 list-none p-0 w-full h-16 items-center">
            {navItems.map((item, i) => (
              <li
                key={item.label}
                className="flex-1 h-full flex justify-center items-center"
              >
                {renderNavItem(item, i)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileBottomNavbar;
