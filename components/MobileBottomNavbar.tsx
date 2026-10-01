"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { Home } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faUserDoctor,
  faPlus,
  faCalendarDays,
  faTicket,
  faCalendarCheck,
  faProcedures,
  faBed,
} from "@fortawesome/free-solid-svg-icons";

import { LiquidGlass } from "@ybouane/liquidglass";
import BookingModalFloating from "./BookingModalFloating";

interface NavItem {
  label: string;
  href: string;
  icon?: IconDefinition;
  isHome?: boolean;
  isButton?: boolean;
}

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// home
function HomeOutlineNoDoor({
  size = 26,
  color = "#000000",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" opacity="0" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

// icon
function NavIcon({ item, isActive }: { item: NavItem; isActive: boolean }) {
  if (item.isHome) {
    return isActive ? (
      <Home
        className="h-[26px] w-[26px]"
        style={{ color: "#000000" }}
        fill="#000000"
        stroke="#000000"
        strokeWidth={2.2}
        aria-hidden="true"
      />
    ) : (
      <HomeOutlineNoDoor size={26} />
    );
  }

  if (!item.icon) return null;

  return (
    <FontAwesomeIcon
      icon={item.icon}
      className="text-[24px]"
      style={{
        color: "#000000",
        opacity: isActive ? 1 : 0.65,
      }}
      aria-hidden="true"
    />
  );
}

const GLASS_CONFIG = {
  cornerRadius: 32,
  refraction: 1.15,
  chromAberration: 0.055,
  edgeHighlight: 0.32,
  specular: 0.18,
  fresnel: 0.9,
  distortion: 0.015,
  blurAmount: 0.16,
  opacity: 0.96,
  saturation: 0.04,
  tintStrength: 0.015,
  brightness: 0.015,
  shadowOpacity: 0.18,
  shadowSpread: 10,
  shadowOffsetY: 6,
  zRadius: 30,
  bevelMode: 0,
  floating: false,
  button: false,
} as const;

const DRAG_SCALE = 1.04;
const INNER_MARGIN = 4;
const DRAG_THRESHOLD = 5;

export default function MobileBottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMounted = useIsMounted();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dockWidth, setDockWidth] = useState(390);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [glassFallback, setGlassFallback] = useState(false);

  const dockRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const actionMenuRef = useRef<HTMLElement>(null);
  const dragStartX = useRef(0);
  const dragMoved = useRef(false);
  const lastScrollY = useRef(0);
  const glassInstanceRef = useRef<Awaited<
    ReturnType<typeof LiquidGlass.init>
  > | null>(null);

  // glass
  useEffect(() => {
    if (!isMounted || !dockRef.current) return;

    const dock = dockRef.current;
    const root = document.body;

    dock.dataset.config = JSON.stringify(GLASS_CONFIG);

    let instance: Awaited<ReturnType<typeof LiquidGlass.init>> | undefined;
    let cancelled = false;

    LiquidGlass.init({
      root,
      glassElements: [dock],
    })
      .then((result) => {
        if (cancelled) {
          result.destroy();
          return;
        }

        instance = result;
        glassInstanceRef.current = result;
        setGlassFallback(false);
      })
      .catch((error) => {
        console.warn("LiquidGlass unavailable, using glass fallback:", error);
        setGlassFallback(true);
      });

    return () => {
      cancelled = true;
      instance?.destroy();
      glassInstanceRef.current = null;
    };
  }, [isMounted]);

  // scroll
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolledDown(currentY > lastScrollY.current && currentY > 50);
      lastScrollY.current = currentY;

      // refresh the glass scene after the page moves
      glassInstanceRef.current?.markChanged();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  // motion
  const rawX = useMotionValue(0);
  const overdrag = useMotionValue(0);

  const springX = useSpring(rawX, {
    stiffness: 420,
    damping: 28,
    mass: 0.6,
  });

  const springOverdrag = useSpring(overdrag, {
    stiffness: 380,
    damping: 22,
  });

  const dockScaleX = useTransform(
    springOverdrag,
    [-100, 0, 100],
    [1.05, 1, 1.05],
  );

  const dockSkewX = useTransform(
    springOverdrag,
    [-100, 0, 100],
    [-2.5, 0, 2.5],
  );

  // navigation
  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Beranda", href: "/", isHome: true },
      { label: "Dokter", href: "/dokter", icon: faUserDoctor },
      {
        label: "Tambah",
        href: "#action-menu",
        icon: faPlus,
        isButton: true,
      },
      {
        label: "Jadwal",
        href: "/jadwal-dokter",
        icon: faCalendarDays,
      },
      { label: "Promo", href: "/promo", icon: faTicket },
    ],
    [],
  );

  const activeIndex = useMemo(() => {
    if (!isMounted) return 0;

    const index = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );

    return index === -1 ? 0 : index;
  }, [isMounted, navItems, pathname]);

  // sizes
  const shouldShrink = isScrolledDown && !isDragging;
  const pillWidth = shouldShrink ? 68 : 72;
  const pillHeight = shouldShrink ? 48 : 55;

  // position
  const clampX = useCallback(
    (x: number, width: number, dragging: boolean) => {
      const scale = dragging ? DRAG_SCALE : 1;
      const halfPill = (pillWidth * scale) / 2;
      const min = INNER_MARGIN + halfPill;
      const max = width - INNER_MARGIN - halfPill;

      return Math.max(min, Math.min(max, x));
    },
    [pillWidth],
  );

  const getOverdrag = useCallback(
    (x: number, width: number, dragging: boolean) => {
      const scale = dragging ? DRAG_SCALE : 1;
      const halfPill = (pillWidth * scale) / 2;
      const min = INNER_MARGIN + halfPill;
      const max = width - INNER_MARGIN - halfPill;

      if (x < min) return x - min;
      if (x > max) return x - max;
      return 0;
    },
    [pillWidth],
  );

  const getCenter = useCallback(
    (index: number, width: number) => {
      const itemWidth = width / navItems.length;
      return index * itemWidth + itemWidth / 2;
    },
    [navItems.length],
  );

  const syncIndicator = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const width = dock.offsetWidth || dock.getBoundingClientRect().width;
    setDockWidth(width);

    rawX.set(clampX(getCenter(activeIndex, width), width, false));
    overdrag.set(0);
  }, [activeIndex, clampX, getCenter, overdrag, rawX]);

  useEffect(() => {
    if (!isMounted) return;

    syncIndicator();

    const observer = new ResizeObserver(syncIndicator);
    if (dockRef.current) observer.observe(dockRef.current);

    window.addEventListener("resize", syncIndicator);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncIndicator);
    };
  }, [isMounted, syncIndicator]);

  useEffect(() => {
    if (!isMounted || isDragging) return;
    syncIndicator();
  }, [isMounted, isDragging, shouldShrink, syncIndicator]);

  // drag
  const getPointerX = useCallback((event: React.PointerEvent) => {
    const dock = dockRef.current;
    if (!dock) return null;

    const rect = dock.getBoundingClientRect();
    const width = dock.offsetWidth || rect.width;
    const scale = rect.width / width || 1;

    return {
      x: (event.clientX - rect.left) / scale,
      width,
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;

      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-no-drag]")
      ) {
        dragMoved.current = false;
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);

      const point = getPointerX(event);
      if (!point) return;

      dragStartX.current = point.x;
      dragMoved.current = false;
      setIsDragging(true);

      rawX.set(clampX(point.x, point.width, true));
      overdrag.set(getOverdrag(point.x, point.width, true));
    },
    [clampX, getOverdrag, getPointerX, overdrag, rawX],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const point = getPointerX(event);
      if (!point) return;

      if (Math.abs(point.x - dragStartX.current) > DRAG_THRESHOLD) {
        dragMoved.current = true;
      }

      rawX.set(clampX(point.x, point.width, true));
      overdrag.set(getOverdrag(point.x, point.width, true));
    },
    [clampX, getOverdrag, getPointerX, isDragging, overdrag, rawX],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      setIsDragging(false);

      const point = getPointerX(event);
      overdrag.set(0);

      if (!point || !dragMoved.current) {
        syncIndicator();
        return;
      }

      const itemWidth = point.width / navItems.length;
      const targetIndex = Math.max(
        0,
        Math.min(navItems.length - 1, Math.floor(point.x / itemWidth)),
      );

      const item = navItems[targetIndex];

      if (item.isButton) {
        setIsActionMenuOpen((open) => !open);
      } else {
        router.push(item.href);
      }

      syncIndicator();
    },
    [getPointerX, isDragging, navItems, overdrag, router, syncIndicator],
  );

  // icon scale
  const getItemScale = useCallback(
    (index: number) => {
      if (dockWidth <= 0) return 1;

      const itemWidth = dockWidth / navItems.length;
      const center = index * itemWidth + itemWidth / 2;
      const distance = Math.abs(springX.get() - center);
      const threshold = itemWidth * 0.75;

      if (distance >= threshold) return 1;

      return 1 - (1 - distance / threshold) * 0.08;
    },
    [dockWidth, navItems.length, springX],
  );

  // outside
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    const target = event.target as Node;

    if (plusButtonRef.current?.contains(target)) return;
    if (actionMenuRef.current?.contains(target)) return;

    setIsActionMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!isActionMenuOpen) return;

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick, isActionMenuOpen]);

  if (!isMounted) return null;

  return createPortal(
    <>
      <style>{`
        @supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .glass-fallback {
            background: rgba(255, 255, 255, 0.52) !important;
            -webkit-backdrop-filter: blur(22px) saturate(1.35);
            backdrop-filter: blur(22px) saturate(1.35);
          }
        }
      `}</style>

      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* popup */}
      <AnimatePresence mode="wait">
        {isActionMenuOpen && (
          <motion.aside
            ref={actionMenuRef}
            initial={{ opacity: 0, scale: 0.9, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 14 }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            aria-label="Menu aksi tambahan"
            className="pointer-events-auto fixed bottom-[102px] left-1/2 z-[100] flex w-[230px] -translate-x-1/2 flex-col rounded-3xl bg-white/70 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl lg:hidden"
          >
            {/* button */}
            <button
              type="button"
              onClick={() => {
                setIsActionMenuOpen(false);
                setIsBookingOpen(true);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-black outline-none transition-colors hover:bg-black/5 active:bg-black/10"
            >
              <FontAwesomeIcon
                icon={faCalendarCheck}
                className="h-5 w-5"
                aria-hidden="true"
              />
              <span>Buat Janji Temu</span>
            </button>

            <div className="my-1 h-px w-full bg-black/10" />

            {/* button */}
            <button
              type="button"
              onClick={() => {
                setIsActionMenuOpen(false);
                router.push("/services/kamar-perawatan");
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-black outline-none transition-colors hover:bg-black/5 active:bg-black/10"
            >
              <FontAwesomeIcon
                icon={faProcedures}
                className="h-5 w-5"
                aria-hidden="true"
              />
              <span>Kamar Perawatan</span>
            </button>

            <div className="my-1 h-px w-full bg-black/10" />

            {/* button */}
            <button
              type="button"
              onClick={() => {
                setIsActionMenuOpen(false);
                router.push("/ketersediaan-kamar");
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-black outline-none transition-colors hover:bg-black/5 active:bg-black/10"
            >
              <FontAwesomeIcon
                icon={faBed}
                className="h-5 w-5"
                aria-hidden="true"
              />
              <span>Ketersediaan Kamar</span>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* dock */}
      <motion.div
        ref={dockRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        animate={{
          scale: shouldShrink ? 0.92 : 1,
          height: shouldShrink ? "56px" : "64px",
          y: shouldShrink ? 4 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 25,
        }}
        data-mobile-dock
        aria-label="Navigasi bawah"
        className={`pointer-events-auto fixed inset-x-4 bottom-6 z-[99] mx-auto flex max-w-[390px] items-center overflow-visible rounded-[32px] touch-none select-none ${glassFallback ? "glass-fallback" : ""}`}
        style={{
          scaleX: dockScaleX,
          skewX: dockSkewX,
          background: glassFallback
            ? "rgba(255,255,255,0.58)"
            : "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.22)",
          boxShadow:
            "0 12px 35px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.28)",
          WebkitBackdropFilter: glassFallback
            ? "blur(22px) saturate(1.35)"
            : undefined,
          backdropFilter: glassFallback
            ? "blur(22px) saturate(1.35)"
            : undefined,
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
        }}
      >
        {/* active */}
        <motion.div
          className="pointer-events-none absolute left-0 top-1/2 z-10 rounded-full"
          animate={{
            width: pillWidth,
            height: pillHeight,
            scale: isDragging ? DRAG_SCALE : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          style={{
            x: springX,
            y: "-50%",
            translateX: "-50%",
            background: "rgba(0,0,0,0.17)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.10), inset 0 -1px 2px rgba(0,0,0,0.08)",
          }}
        />

        {/* navigation */}
        <menu className="relative z-20 m-0 flex h-full w-full list-none items-center justify-between p-0">
          {navItems.map((item, index) => {
            const isActive = index === activeIndex;
            const scale = getItemScale(index);

            return (
              <li
                key={item.href || index}
                className="flex h-full flex-1 items-center justify-center"
                style={{
                  transform: `scale(${scale})`,
                }}
              >
                {item.isButton ? (
                  <button
                    ref={plusButtonRef}
                    type="button"
                    aria-label={
                      isActionMenuOpen
                        ? "Tutup menu aksi tambahan"
                        : "Buka menu aksi tambahan"
                    }
                    aria-expanded={isActionMenuOpen}
                    data-no-drag
                    onPointerDown={(event) => {
                      event.stopPropagation();
                    }}
                    onClick={() => {
                      setIsActionMenuOpen((open) => !open);
                    }}
                    className="flex h-12 w-12 select-none items-center justify-center rounded-full outline-none"
                    style={{
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-[24px] text-black"
                      style={{
                        transform: isActionMenuOpen
                          ? "rotate(45deg)"
                          : "rotate(0deg)",
                        transition:
                          "transform 260ms cubic-bezier(0.16,1,0.3,1)",
                      }}
                      aria-hidden="true"
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    onClick={(event) => {
                      if (pathname === item.href) {
                        event.preventDefault();
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className="flex h-12 w-12 select-none items-center justify-center rounded-full outline-none"
                    style={{
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <NavIcon item={item} isActive={isActive} />
                  </Link>
                )}
              </li>
            );
          })}
        </menu>
      </motion.div>
    </>,
    document.body,
  );
}
