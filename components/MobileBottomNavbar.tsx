"use client";

import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BookingModalFloating from "./BookingModalFloating";
import { Stethoscope } from "lucide-react";

/**
 * Mobile bottom navbar (moved from AppleGlassmorphismNavbar).
 * Note: removed "rounded" styles as requested (no rounded corners).
 */
const MobileBottomNavbar = () => {
  const pathname = usePathname();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);

  // typed nav items: icon can be either a Lucide-like component or an inline svg fragment
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
    // functional components are functions; React.memo/forwardRef may be objects with a `.render` function
    typeof icon === "function" ||
    (typeof icon === "object" && icon !== null && "render" in icon);

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
        // store component reference (not element) for clean rendering
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
        label: "Jadwal Dokter",
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

  // Measure items and container to compute slider positions
  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const pos: { left: number; width: number }[] = [];
    itemsRef.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      pos.push({ left: r.left - containerRect.left, width: r.width });
    });
    // positions measured for potential future use (kept locally)
    if (pos.length) {
      // nothing else needed for click-only nav
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // re-measure when active index changes (width/position depend on selected item)
  useEffect(() => {
    measure();
  }, [activeIndex, measure]);

  // cleanup lingering timeout on unmount
  useEffect(() => {
    return () => {};
  }, []);

  // dock visual constants
  const dockPadding = "8px 16px";
  // plain white background - no blur/backdrop

  // brightness adaptation removed — bar is always plain white

  // click-only interactions (slider removed)
  const handleMouseDown = () => undefined;
  const handleTouchStart = () => undefined;

  // removed drag/slider effects — interactions are click-only now
  const renderIcon = (item: NavItem, isActive: boolean) => {
    const getStrokeWidth = (label: string, active: boolean) => {
      if (label === "Beranda" && active) return "0";
      if (active) return "1.9";
      return "1.6";
    };

    let iconNode: React.ReactNode = null;

    if (isElementType(item.icon)) {
      const IconComp = item.icon;
      iconNode = (
        <IconComp
          size={20}
          strokeWidth={1.5}
          className="w-7 h-7"
          color={item.label === "Beranda" && isActive ? "black" : undefined}
        />
      );
    } else {
      const isBerandaActive = item.label === "Beranda" && isActive;
      const strokeWidth = getStrokeWidth(item.label, isActive);
      iconNode = (
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7"
          fill={isBerandaActive ? "currentColor" : "none"}
          stroke={isBerandaActive ? "none" : "currentColor"}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {item.icon as React.ReactNode}
        </svg>
      );
    }

    return iconNode;
  };

  const renderNavItem = (item: NavItem, i: number) => {
    const isActive = i === activeIndex || pathname === item.href;

    const commonProps: React.AnchorHTMLAttributes<HTMLAnchorElement> &
      React.ButtonHTMLAttributes<HTMLButtonElement> = {
      title: item.label,
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      className: `flex flex-col items-center justify-center w-18 h-14 transition-transform duration-200 border-0 bg-transparent cursor-pointer ${
        isActive
          ? "text-black scale-105"
          : "text-black/70 hover:text-black hover:scale-105"
      }`,
    };

    if (item.isButton) {
      return (
        <button
          ref={(el) => {
            itemsRef.current[i] = el;
          }}
          onClick={() => {
            setIsBookingOpen(true);
            setActiveIndex(i);
          }}
          {...commonProps}
        >
          <span
            className="flex items-center justify-center"
            style={{
              transition: "transform 220ms ease, filter 220ms ease",
              transform: isActive ? "scale(1.1)" : "none",
              filter: isActive
                ? "drop-shadow(0 8px 18px rgba(0,0,0,0.22))"
                : "none",
            }}
          >
            {renderIcon(item, isActive)}
          </span>
          <span className="text-[10px] mt-1 leading-tight select-none">
            {item.label}
          </span>
        </button>
      );
    }

    return (
      <Link
        ref={(el: HTMLAnchorElement | null) => {
          itemsRef.current[i] = el;
        }}
        href={item.href}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          if (pathname === item.href) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          setActiveIndex(i);
        }}
        {...commonProps}
      >
        <span
          className="flex items-center justify-center"
          style={{
            transition: "transform 220ms ease, filter 220ms ease",
            transform: isActive ? "scale(1.1)" : "none",
            filter: isActive
              ? "drop-shadow(0 8px 18px rgba(0,0,0,0.22))"
              : "none",
          }}
        >
          {renderIcon(item, isActive)}
        </span>
        <span className="text-[10px] mt-1 leading-tight select-none">
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        ref={containerRef}
      >
        {/* True Apple Glassmorphism - with subtle glass effect */}
        <div
          className="relative overflow-hidden"
          style={{
            // full-width dock at bottom, plain white background
            background: "#ffffff",
            borderTop: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 -6px 20px rgba(0,0,0,0.04)",
            padding: `8px 12px calc(${dockPadding.split(" ")[0]} + env(safe-area-inset-bottom, 0px))`,
            width: "100%",
            // remove minWidth for full container layout
          }}
        >
          {/* soft sheen overlay */}
          {/* neutralize sheen overlay for solid white background */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "transparent",
              opacity: 0,
              transition: "opacity 220ms ease",
            }}
          />

          {/* adaptive darken/light overlay to make dock respond to bright backgrounds */}
          {/* remove adaptive tint overlay */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "transparent",
              opacity: 0,
              transition: "background 260ms ease, opacity 260ms ease",
            }}
          />

          {/* inner shadow to give depth to the glass dock */}
          {/* remove inner shadow to keep the bar visually flat */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "none",
              mixBlendMode: "normal",
              opacity: 0,
              pointerEvents: "none",
            }}
          />
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
          {/* slider removed — click-only navigation */}

          {/* Navigation Items */}
          <ul className="flex gap-0 list-none p-0 m-0 relative z-10 w-full">
            {navItems.map((item, i) => (
              <li key={item.label} className="flex-1 flex justify-center">
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
