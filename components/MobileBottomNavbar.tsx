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

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  isButton?: boolean;
}

export default function MobileBottomNavbar() {
  const pathname = usePathname();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        label: "Buat Janji",
        href: "#booking",
        icon: CalendarCheck2,
        isButton: true,
      },
      {
        label: "Dokter",
        href: "/dokter",
        icon: UserRoundPlus,
      },
      {
        label: "Jadwal Dokter",
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

  useEffect(() => {
    const idx = navItems.findIndex((item) => item.href === pathname);

    if (idx >= 0) {
      setActiveIndex(idx);
    }
  }, [pathname, navItems]);

  // posisi notch
  const activeX = 40 + activeIndex * 80;

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="relative h-[78px]">
          {/* SVG DOCK */}
          <svg
            className="absolute inset-0 w-full h-full drop-shadow-[0_-6px_20px_rgba(0,0,0,0.08)]"
            viewBox="0 0 400 78"
            preserveAspectRatio="none"
          >
            <path
              fill="white"
              d={`
                M0 0

                H${activeX - 42}

                C${activeX - 32} 0
                 ${activeX - 28} 30
                 ${activeX - 18} 42

                C${activeX - 8} 55
                 ${activeX + 8} 55
                 ${activeX + 18} 42

                C${activeX + 28} 30
                 ${activeX + 32} 0
                 ${activeX + 42} 0

                H400
                V78
                H0
                Z
              `}
            />
          </svg>

          {/* ACTIVE BUTTON */}
          <div
            className="
              absolute
              -top-6
              h-16
              w-16
              rounded-full
              bg-[#003f88]
              shadow-[0_12px_30px_rgba(0,0,0,0.25)]
              flex
              items-center
              justify-center
              transition-all
              duration-500
              ease-[cubic-bezier(.34,1.56,.64,1)]
              z-20
            "
            style={{
              left: `calc(${activeIndex * 20}% + 10%)`,
              transform: "translateX(-50%)",
            }}
          >
            {React.createElement(navItems[activeIndex].icon, {
              size: 24,
              strokeWidth: 2.5,
              className: "text-white",
            })}
          </div>

          {/* NAVIGATION */}
          <ul className="relative z-10 flex h-full">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const active = activeIndex === i;

              return (
                <li
                  key={item.label}
                  className="flex flex-1 items-center justify-center"
                >
                  {item.isButton ? (
                    <button
                      onClick={() => {
                        setActiveIndex(i);
                        setIsBookingOpen(true);
                      }}
                      className="flex h-full w-full flex-col items-center justify-center"
                    >
                      {!active && (
                        <>
                          <Icon size={22} className="text-zinc-500" />

                          <span className="mt-1 text-[10px] font-medium text-zinc-500">
                            {item.label}
                          </span>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setActiveIndex(i)}
                      className="flex h-full w-full flex-col items-center justify-center"
                    >
                      {!active && (
                        <>
                          <Icon size={22} className="text-zinc-500" />

                          <span className="mt-1 text-[10px] font-medium text-zinc-500">
                            {item.label}
                          </span>
                        </>
                      )}
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
