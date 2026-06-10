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
  const [activeIndex, setActiveIndex] = useState(-1);

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        label: "Janji",
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

  useEffect(() => {
    if (pathname === "/") {
      setActiveIndex(-1);
      return;
    }

    const idx = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );

    if (idx !== -1) {
      setActiveIndex(idx);
    }
  }, [pathname, navItems]);

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 lg:hidden">
        <div
          className="
            relative
            w-full
            max-w-md
            h-[85px]
            rounded-full
            overflow-hidden
          "
          style={{
            // Membuat background lebih transparan dan efek glass (blur) lebih kuat
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(30px) saturate(210%)",
            WebkitBackdropFilter: "blur(30px) saturate(210%)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: `
              0 12px 40px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.5),
              inset 0 -1px 0 rgba(255, 255, 255, 0.05),
              inset 0 0 12px 6px rgba(255, 255, 255, 0.15)
            `,
          }}
        >
          {/* TOP REFLECTION */}
          <div
            className="absolute top-0 left-8 right-8 h-px"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent)",
            }}
          />

          {/* LEFT REFLECTION */}
          <div
            className="absolute top-0 left-0 w-px h-full"
            style={{
              background:
                "linear-gradient(180deg,rgba(255,255,255,.8),transparent,rgba(255,255,255,.1))",
            }}
          />

          {/* BIG GLOSS */}
          <div
            className="
              absolute
              left-5
              right-5
              top-1
              h-8
              rounded-full
              pointer-events-none
            "
            style={{
              background:
                "linear-gradient(180deg,rgba(255,255,255,.4),rgba(255,255,255,0))",
              filter: "blur(8px)",
            }}
          />

          {/* INNER LIGHT */}
          <div
            className="
              absolute
              inset-0
              rounded-full
              pointer-events-none
            "
            style={{
              boxShadow: "inset 0 0 30px rgba(255,255,255,.15)",
            }}
          />

          <ul className="relative z-10 flex items-center justify-between h-full px-2">
            {navItems.map((item, i) => {
              const isActive = i === activeIndex;
              const Icon = item.icon;

              const buttonContent = (
                <>
                  <div
                    className={`
                      flex items-center justify-center
                      transition-all duration-300 ease-out
                      ${
                        isActive
                          ? `
                          h-14
                          w-14
                          rounded-full
                          scale-105
                        `
                          : `
                          h-11
                          w-11
                        `
                      }
                    `}
                    style={
                      isActive
                        ? {
                            background:
                              "linear-gradient(180deg, #4f8dff, #2563eb)",
                            border: "1px solid rgba(255, 255, 255, 0.8)",
                            boxShadow: `
                              0 4px 20px rgba(37, 99, 235, 0.5),
                              inset 0 1px 0 rgba(255, 255, 255, 0.6)
                            `,
                          }
                        : {}
                    }
                  >
                    <Icon
                      size={isActive ? 24 : 22}
                      strokeWidth={2}
                      color={isActive ? "#ffffff" : "#64748b"}
                    />
                  </div>

                  {!isActive && (
                    <span className="mt-1 text-[11px] font-medium text-slate-500">
                      {item.label}
                    </span>
                  )}
                </>
              );

              return (
                <li key={item.label} className="flex flex-1 justify-center">
                  {item.isButton ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsBookingOpen(true);
                        setActiveIndex(i);
                      }}
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        h-full
                        w-full
                        outline-none
                        focus:outline-none
                        focus-visible:outline-none
                        select-none
                        -tap-highlight-transparent
                      "
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      {buttonContent}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (pathname === item.href) {
                          e.preventDefault();
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                        }
                        setActiveIndex(i);
                      }}
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        h-full
                        w-full
                        outline-none
                        focus:outline-none
                        focus-visible:outline-none
                        select-none
                        -tap-highlight-transparent
                      "
                      style={{ WebkitTapHighlightColor: "transparent" }}
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
