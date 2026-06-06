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

const AppleGlassmorphismNavbar = () => {
  const pathname = usePathname();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // slider position in px from container left
  const [sliderX, setSliderX] = useState(0);
  const [sliderW, setSliderW] = useState(38);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBrightBg, setIsBrightBg] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);
  const startXRef = useRef(0);
  const startSliderXRef = useRef(0);
  const sliderXRef = useRef(0);
  const velocityRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const pressTimeoutRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const lastClientXRef = useRef<number>(0);
  const releaseVelocityRef = useRef(0);
  const positionsRef = useRef<{ left: number; width: number }[]>([]);
  const springRef = useRef<(target: number) => void>(() => {});

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
    positionsRef.current = pos;

    // adapt slider width to item width (slightly smaller than item)
    if (pos.length) {
      // choose width based on active item (larger fraction for a longer slider)
      const idx = Math.max(0, Math.min(activeIndex, pos.length - 1));
      const itemW = pos[idx].width;
      const desired = Math.max(36, Math.round(itemW * 0.92));
      setSliderW(desired);
      const left = pos[idx].left + (pos[idx].width - desired) / 2;
      setSliderX(left);
      sliderXRef.current = left;
    }
  }, [activeIndex]);

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
    return () => {
      if (pressTimeoutRef.current) {
        window.clearTimeout(pressTimeoutRef.current);
        pressTimeoutRef.current = null;
      }
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

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

  // Drag handlers updated to move sliderX directly and snap
  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    startSliderXRef.current = sliderXRef.current;
    // cancel any lingering hide timeout and show slider immediately
    if (pressTimeoutRef.current) {
      window.clearTimeout(pressTimeoutRef.current);
      pressTimeoutRef.current = null;
    }
    // prepare velocity tracking
    lastMoveTimeRef.current = performance.now();
    lastClientXRef.current = clientX;
    velocityRef.current = 0;
    releaseVelocityRef.current = 0;
    setIsPressed(true);
  };

  const handleMouseDown = (e: React.MouseEvent) => handlePointerDown(e.clientX);
  const handleTouchStart = (e: React.TouchEvent) =>
    handlePointerDown(e.touches[0].clientX);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number) => {
      const delta = clientX - startXRef.current;
      const newX = startSliderXRef.current + delta;
      // velocity tracking (px per ms -> convert to px/frame)
      const now = performance.now();
      const dt = Math.max(8, now - lastMoveTimeRef.current);
      const v = (clientX - lastClientXRef.current) / dt; // px per ms
      // convert to px per frame estimate and amplify for stronger inertial feel
      velocityRef.current = v * 16 * 2.4;
      lastClientXRef.current = clientX;
      lastMoveTimeRef.current = now;
      const last = positionsRef.current.at(-1) ?? { left: 0, width: 0 };
      const max = positionsRef.current.length
        ? last.left + last.width - sliderW
        : 0;
      const clamped = Math.max(0, Math.min(newX, max));
      setSliderX(clamped);
      sliderXRef.current = clamped;
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => {
      // capture release velocity
      releaseVelocityRef.current = velocityRef.current * 1.05;
      setIsDragging(false);
      // keep slider visible briefly to show spring animation, then hide
      if (pressTimeoutRef.current) window.clearTimeout(pressTimeoutRef.current);
      pressTimeoutRef.current = window.setTimeout(() => {
        setIsPressed(false);
        pressTimeoutRef.current = null;
      }, 420) as unknown as number;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, sliderW]);

  useEffect(() => {
    if (!isDragging) return;
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const delta = t.clientX - startXRef.current;
      const newX = startSliderXRef.current + delta;
      const last = positionsRef.current.at(-1) ?? { left: 0, width: 0 };
      const max = positionsRef.current.length
        ? last.left + last.width - sliderW
        : 0;
      const clamped = Math.max(0, Math.min(newX, max));
      setSliderX(clamped);
      sliderXRef.current = clamped;
    };
    const onTouchEnd = () => {
      // capture release velocity
      releaseVelocityRef.current = velocityRef.current * 1.05;
      setIsDragging(false);
      if (pressTimeoutRef.current) window.clearTimeout(pressTimeoutRef.current);
      pressTimeoutRef.current = window.setTimeout(() => {
        setIsPressed(false);
        pressTimeoutRef.current = null;
      }, 420) as unknown as number;
    };

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, sliderW]);

  // Snap to nearest item when drag ends or when item clicked
  useEffect(() => {
    if (isDragging) return;
    const pos = positionsRef.current;
    if (!pos.length) return;
    const center = sliderX + sliderW / 2;
    let best = 0;
    let bestDist = Infinity;
    pos.forEach((p, i) => {
      const itemCenter = p.left + p.width / 2;
      const d = Math.abs(itemCenter - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActiveIndex(best);
    // update width based on selected item for better visual alignment
    const newW = Math.max(30, Math.round(pos[best].width * 0.82));
    setSliderW(newW);
    const targetLeft = pos[best].left + (pos[best].width - newW) / 2;
    // animate to target using spring
    const springTo = (target: number) => {
      // cancel existing
      if (animRef.current) cancelAnimationFrame(animRef.current);
      // tuned for stronger inertial/fling: higher stiffness, lower damping
      const stiffness = 0.42;
      const damping = 0.45;
      // use amplified release velocity to simulate stronger inertia
      const baseVel = (releaseVelocityRef.current || 0) * 1.4;
      // add small distance-proportional push as well
      const currentInit = sliderXRef.current;
      const distInit = target - currentInit;
      velocityRef.current = baseVel + distInit * 0.04;

      const step = () => {
        const current = sliderXRef.current;
        const dist = current - target;
        const accel = -stiffness * dist - damping * velocityRef.current;
        velocityRef.current += accel;
        const next = current + velocityRef.current;
        setSliderX(next);
        sliderXRef.current = next;
        // stop when nearly settled
        if (Math.abs(velocityRef.current) < 0.12 && Math.abs(dist) < 1.0) {
          setSliderX(target);
          sliderXRef.current = target;
          velocityRef.current = 0;
          releaseVelocityRef.current = 0;
          animRef.current = null;
          return;
        }
        animRef.current = requestAnimationFrame(step);
      };
      animRef.current = requestAnimationFrame(step);
    };
    springRef.current = springTo;
    springTo(targetLeft);
  }, [isDragging, sliderW, sliderX]);

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
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
            backdropFilter: isBrightBg
              ? "blur(6px) saturate(150%)"
              : "blur(8px) saturate(160%)",
            WebkitBackdropFilter: isBrightBg
              ? "blur(6px) saturate(150%)"
              : "blur(8px) saturate(160%)",
            border: isBrightBg
              ? "1px solid rgba(120,190,255,0.12)"
              : "1px solid rgba(60,140,255,0.12)",
            boxShadow:
              "0 14px 40px rgba(6,30,80,0.08), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
            padding: "10px 18px",
            minWidth: "320px",
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
          {/* Draggable Slider Indicator - Glass style (fluid & adaptive) */}
          <div
            className="absolute left-0 rounded-full"
            style={{
              top: "20px",
              height: "42px",
              opacity: isPressed || isDragging ? 1 : 0,
              pointerEvents: isPressed || isDragging ? "auto" : "none",
              // stronger bluish translucent slider to match the dock color
              background: isBrightBg
                ? "rgba(10,36,80,0.14)"
                : "rgba(40,140,255,0.18)",
              width: `${sliderW}px`,
              transform: `translateX(${sliderX}px) scale(${isPressed ? 1.04 : 1})`,
              transition: isDragging
                ? "none"
                : "transform 450ms cubic-bezier(0.22,1,0.36,1), width 280ms ease, opacity 220ms, box-shadow 300ms",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: isBrightBg
                ? "1px solid rgba(200,230,255,0.08)"
                : "1px solid rgba(120,200,255,0.18)",
              boxShadow: isDragging
                ? "inset 0 1px 0 rgba(255,255,255,0.5), 0 14px 34px rgba(6,30,80,0.18)"
                : "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.06), 0 10px 20px rgba(6,30,80,0.12)",
            }}
          />

          {/* subtle shadow under the slider to enhance floating illusion */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: `${sliderX + Math.max(30, sliderW / 2) - 28}px`,
              top: `calc(20px + 42px)`,
              width: `${Math.max(52, Math.round(sliderW * 0.7))}px`,
              height: "12px",
              background:
                "radial-gradient(closest-side, rgba(0,0,0,0.26), rgba(0,0,0,0.02))",
              filter: "blur(10px)",
              opacity: isPressed || isDragging ? 0.98 : 0.56,
              transition:
                "left 220ms ease, opacity 220ms ease, width 220ms ease",
              borderRadius: "9999px",
              pointerEvents: "none",
            }}
          />

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
                        // snap to this item using spring
                        const pos = positionsRef.current[i];
                        if (pos) {
                          const target = pos.left + (pos.width - sliderW) / 2;
                          springRef.current(target);
                          setActiveIndex(i);
                        }
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
                        <svg
                          viewBox="0 0 24 24"
                          className="w-7 h-7"
                          fill={isActive ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={isActive ? "0" : "1.5"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {item.icon}
                        </svg>
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
                        // snap first, then allow navigation
                        const pos = positionsRef.current[i];
                        if (pos) {
                          const target = pos.left + (pos.width - sliderW) / 2;
                          springRef.current(target);
                          setActiveIndex(i);
                        }
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
                        <svg
                          viewBox="0 0 24 24"
                          className="w-7 h-7"
                          fill={isActive ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={isActive ? "0" : "1.5"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {item.icon}
                        </svg>
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
