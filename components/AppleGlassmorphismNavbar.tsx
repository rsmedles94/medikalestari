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

const AppleGlassmorphismNavbar = () => {
  const pathname = usePathname();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBrightBg, setIsBrightBg] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);
  // ...existing code...

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
  const dockMinWidth = "360px";
  const dockBlur = isBrightBg ? "blur(6px)" : "blur(8px)";

  // brightness adaptation: sample body background color
  useEffect(() => {
    const sampleBrightness = () => {
      try {
        const bg = globalThis.getComputedStyle(document.body).backgroundColor;
        const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(bg || "");
        if (m) {
          const r = Number(m[1]);
          const g = Number(m[2]);
          const b = Number(m[3]);
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          requestAnimationFrame(() => setIsBrightBg(lum > 200));
          return;
        }
      } catch {}
      requestAnimationFrame(() => setIsBrightBg(false));
    };

    // initial sample
    sampleBrightness();

    // observe body attribute/class/style changes to re-sample automatically
    const obs = new MutationObserver(() => sampleBrightness());
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    // also resample on resize (layout/theme changes)
    window.addEventListener("resize", sampleBrightness);

    return () => {
      obs.disconnect();
      window.removeEventListener("resize", sampleBrightness);
    };
  }, []);

  // click-only interactions (slider removed)
  const handleMouseDown = () => undefined;
  const handleTouchStart = () => undefined;

  // removed drag/slider effects — interactions are click-only now

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden"
        ref={containerRef}
      >
        {/* True Apple Glassmorphism - with subtle glass effect */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            // stronger blue-transparent Apple-like glass; slightly wider padding for a broader dock
            background: isBrightBg
              ? "linear-gradient(180deg, rgba(180,210,255,0.08), rgba(170,200,255,0.06))"
              : "linear-gradient(180deg, rgba(8,40,120,0.10), rgba(6,30,100,0.06))",
            backdropFilter: `${dockBlur} saturate(150%)`,
            WebkitBackdropFilter: `${dockBlur} saturate(150%)`,
            border: isBrightBg
              ? "1px solid rgba(120,190,255,0.12)"
              : "1px solid rgba(60,140,255,0.12)",
            boxShadow:
              "0 14px 40px rgba(6,30,80,0.08), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
            padding: dockPadding,
            minWidth: dockMinWidth,
          }}
        >
          {/* soft sheen overlay */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              // light sheen with a stronger blue hint
              background:
                "linear-gradient(180deg, rgba(220,240,255,0.08), rgba(210,235,255,0.03))",
              mixBlendMode: isBrightBg ? "normal" : "overlay",
              opacity: isBrightBg ? 0.6 : 0.82,
              transition: "opacity 220ms ease",
            }}
          />

          {/* adaptive darken/light overlay to make dock respond to bright backgrounds */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              // subtle blue tint to emphasize glass color
              background: isBrightBg
                ? "rgba(220,235,255,0.03)"
                : "rgba(8,30,80,0.04)",
              opacity: isBrightBg ? 0.64 : 0.32,
              transition: "background 260ms ease, opacity 260ms ease",
            }}
          />

          {/* inner shadow to give depth to the glass dock */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "inset 0 -8px 24px rgba(0,0,0,0.08)",
              borderRadius: "9999px",
              mixBlendMode: "normal",
              opacity: 1,
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
          <ul className="flex gap-0 list-none p-0 m-0 relative z-10">
            {navItems.map((item, i) => {
              const isActive = i === activeIndex || pathname === item.href;
              return (
                <li key={item.label} className="flex">
                  {item.isButton ? (
                    <button
                      ref={(el) => {
                        itemsRef.current[i] = el;
                      }}
                      onClick={() => {
                        setIsBookingOpen(true);
                        setActiveIndex(i);
                      }}
                      className={`flex items-center justify-center w-18 h-14 rounded-lg cursor-pointer border-0 bg-transparent transition-transform duration-200 ${
                        isActive
                          ? "text-black scale-105"
                          : "text-black/70 hover:text-black hover:scale-105"
                      }`}
                      title={item.label}
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
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
                        {isElementType(item.icon) ? (
                          // component icon (lucide) — render as component with props
                          (() => {
                            const IconComp = item.icon as IconComponentType;
                            return (
                              <IconComp
                                size={20}
                                strokeWidth={1.5}
                                className="w-7 h-7"
                                color={
                                  item.label === "Beranda" && isActive
                                    ? "black"
                                    : undefined
                                }
                              />
                            );
                          })()
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            className="w-7 h-7"
                            fill={
                              item.label === "Beranda" && isActive
                                ? "currentColor"
                                : "none"
                            }
                            stroke={
                              item.label === "Beranda" && isActive
                                ? "none"
                                : "currentColor"
                            }
                            strokeWidth={
                              item.label === "Beranda" && isActive
                                ? "0"
                                : isActive
                                  ? "1.9"
                                  : "1.6"
                            }
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {item.icon as React.ReactNode}
                          </svg>
                        )}
                      </span>
                    </button>
                  ) : (
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
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
                      className={`flex items-center justify-center w-18 h-14 rounded-lg transition-transform duration-200 border-0 bg-transparent cursor-pointer ${
                        isActive
                          ? "text-black scale-105"
                          : "text-black/70 hover:text-black hover:scale-105"
                      }`}
                      title={item.label}
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
                        {isElementType(item.icon) ? (
                          (() => {
                            const IconComp = item.icon as IconComponentType;
                            return (
                              <IconComp
                                size={20}
                                strokeWidth={1.5}
                                className="w-7 h-7"
                                color={
                                  item.label === "Beranda" && isActive
                                    ? "black"
                                    : undefined
                                }
                              />
                            );
                          })()
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            className="w-7 h-7"
                            fill={
                              item.label === "Beranda" && isActive
                                ? "currentColor"
                                : "none"
                            }
                            stroke={
                              item.label === "Beranda" && isActive
                                ? "none"
                                : "currentColor"
                            }
                            strokeWidth={
                              item.label === "Beranda" && isActive
                                ? "0"
                                : isActive
                                  ? "1.9"
                                  : "1.6"
                            }
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {item.icon as React.ReactNode}
                          </svg>
                        )}
                      </span>
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
};

export default AppleGlassmorphismNavbar;
