"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
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
  const [displayActive, setDisplayActive] = useState(-1);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        label: "Janji",
        href: "#booking",
        icon: CalendarCheck2,
        isButton: true,
      },
      { label: "Dokter", href: "/dokter", icon: UserRoundPlus },
      { label: "Jadwal", href: "/jadwal-dokter", icon: CalendarDays },
      { label: "Promo", href: "/promo", icon: TicketPercent },
      { label: "Kamar", href: "/services/kamar-perawatan", icon: Bed },
    ],
    [],
  );

  useEffect(() => {
    if (pathname === "/") {
      setActiveIndex(-1);
      setDisplayActive(-1);
      return;
    }
    const idx = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );
    if (idx !== -1) {
      setActiveIndex(idx);
      setDisplayActive(idx);
    }
  }, [pathname, navItems]);

  /**
   * Two-phase activation:
   * 1. Immediately set displayActive = -1 to wipe ALL active styling (border, bg)
   * 2. On next RAF, commit the new active index so styles re-apply cleanly
   */
  const handleSetActive = (i: number) => {
    if (i === activeIndex) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // Phase 1 — blank slate (removes any lingering border/bg from old item)
    setDisplayActive(-1);
    setActiveIndex(i);

    // Phase 2 — re-apply active styles on the NEW item one frame later
    rafRef.current = requestAnimationFrame(() => {
      setDisplayActive(i);
    });
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 lg:hidden">
        <div
          className="relative w-full max-w-md h-[70px] rounded-full overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.16)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.5),
              inset 0 -1px 0 rgba(255, 255, 255, 0.1),
              inset 0 0 2px 1px rgba(255, 255, 255, 0.1)
            `,
          }}
        >
          {/* TOP REFLECTION */}
          <div
            className="absolute top-0 left-8 right-8 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent)",
            }}
          />

          {/* LEFT REFLECTION */}
          <div
            className="absolute top-0 left-0 w-px h-full pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg,rgba(255,255,255,.8),transparent,rgba(255,255,255,.3))",
            }}
          />

          {/* GLOSS SHIMMER */}
          <div
            className="absolute left-5 right-5 top-1 h-8 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg,rgba(255,255,255,.4),rgba(255,255,255,0))",
              filter: "blur(8px)",
            }}
          />

          {/* INNER GLOW */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: "inset 0 0 30px rgba(255,255,255,.15)" }}
          />

          <ul className="relative z-10 flex items-center justify-between h-full px-2">
            {navItems.map((item, i) => {
              const isActive = i === displayActive;
              const Icon = item.icon;

              const buttonContent = (
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {/* ICON BUBBLE */}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: isActive ? "52px" : "40px",
                      height: isActive ? "52px" : "40px",
                      borderRadius: "9999px",
                      background: isActive
                        ? "linear-gradient(160deg,  #003f88 60%, #002a5c 100%)"
                        : "transparent",
                      /*
                       * CRITICAL: always keep a transparent border so the element
                       * never loses its border-box — prevents a 1-frame "ring" flash
                       * when old active loses its white border before new active gains it.
                       */
                      border: isActive
                        ? "1.5px solid rgba(255,255,255,0.55)"
                        : "1.5px solid transparent",

                        

                      transform: isActive ? "scale(1.08)" : "scale(1)",
                      willChange:
                        "transform, width, height, background, box-shadow",
                      transition: [
                        "width 380ms cubic-bezier(0.34,1.56,0.64,1)",
                        "height 380ms cubic-bezier(0.34,1.56,0.64,1)",
                        "transform 380ms cubic-bezier(0.34,1.56,0.64,1)",
                        "background 300ms ease",
                        "box-shadow 300ms ease",
                        "border-color 300ms ease",
                      ].join(", "),
                    }}
                  >
                    <Icon
                      size={isActive ? 22 : 20}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      style={{
                        color: isActive ? "#ffffff" : "#64748b",
                        transition:
                          "color 300ms ease, width 300ms ease, height 300ms ease",
                        display: "block",
                        flexShrink: 0,
                      }}
                    />
                  </span>

                  {/* LABEL — fades out when active */}
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "#64748b",
                      lineHeight: 1,
                      opacity: isActive ? 0 : 1,
                      transform: isActive
                        ? "translateY(-2px)"
                        : "translateY(0)",
                      maxHeight: isActive ? "0px" : "14px",
                      overflow: "hidden",
                      transition: [
                        "opacity 250ms ease",
                        "transform 300ms ease",
                        "max-height 350ms cubic-bezier(0.4,0,0.2,1)",
                      ].join(", "),
                    }}
                  >
                    {item.label}
                  </span>
                </span>
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
                  style={{ display: "flex", flex: 1, justifyContent: "center" }}
                >
                  {item.isButton ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsBookingOpen(true);
                        handleSetActive(i);
                      }}
                      style={sharedLinkStyle}
                      className="select-none focus:outline-none focus-visible:outline-none"
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
                        handleSetActive(i);
                      }}
                      style={sharedLinkStyle}
                      className="select-none focus:outline-none focus-visible:outline-none"
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
