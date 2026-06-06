"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BookingModalFloating from "./BookingModalFloating";

const AppleGlassmorphismNavbar = () => {
  const pathname = usePathname();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);

  const navItems = useMemo(
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
        icon: (
          <g>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2H16Z" />
            <circle cx="9" cy="7" r="4" />
            <path d="M19 15.13A4 4 0 0 1 22 19V21H18V19C18 17.2 17.1 15.7 15.7 14.8C16.8 14.4 18 14.5 19 15.13Z" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </g>
        ),
      },
      {
        label: "Booking",
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
            <path d="M18 9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2V9Z" />
          </g>
        ),
      },
    ],
    [],
  );

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startOffsetRef.current = dragOffset;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    startOffsetRef.current = dragOffset;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startXRef.current;
      const newOffset = startOffsetRef.current + deltaX;
      // 5 items × ~48px per item = ~240px, minus slider width = ~202px max
      const maxOffset = 202;
      setDragOffset(Math.max(0, Math.min(newOffset, maxOffset)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - startXRef.current;
      const newOffset = startOffsetRef.current + deltaX;
      const maxOffset = 202;
      setDragOffset(Math.max(0, Math.min(newOffset, maxOffset)));
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden"
        ref={containerRef}
      >
        {/* True Apple Glassmorphism - with subtle glass effect */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.11)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.1)",
            padding: "8px 12px",
          }}
        >
          {/* Glass edge highlight - top */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
            }}
          />

          {/* Glass edge highlight - left */}
          <div
            className="absolute top-0 left-0 w-px h-full pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.8), transparent, rgba(255, 255, 255, 0.3))",
            }}
          />
          {/* Draggable Slider Indicator - Glass style */}
          <div
            className="absolute top-1 left-0 h-8 rounded-lg transition-all duration-300 ease-out pointer-events-none"
            style={{
              background: "rgba(255, 255, 255, 0.11)",
              width: "38px",
              transform: `translateX(calc(${dragOffset}px + 4px))`,
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow:
                "inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          />

          {/* Navigation Items */}
          <ul className="flex gap-0 list-none p-0 m-0 relative z-10">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              if (item.isButton) {
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="flex items-center justify-center w-14 h-10 rounded-lg cursor-pointer border-0 bg-transparent transition-colors duration-200 text-white/70 hover:text-white"
                      title={item.label}
                      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
                        handleMouseDown(e);
                      }}
                      onTouchStart={(e: React.TouchEvent<HTMLButtonElement>) => {
                        handleTouchStart(e);
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {item.icon}
                      </svg>
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-center w-14 h-10 rounded-lg transition-colors duration-200 border-0 bg-transparent cursor-pointer ${
                      isActive ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                    title={item.label}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      if (isActive) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                      handleMouseDown(e);
                    }}
                    onTouchStart={(e: React.TouchEvent<HTMLAnchorElement>) => {
                      handleTouchStart(e);
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill={isActive ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={isActive ? "0" : "1.5"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon}
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AppleGlassmorphismNavbar;
