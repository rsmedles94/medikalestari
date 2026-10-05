"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { TargetAndTransition } from "framer-motion";

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

import { Glass } from "@samasante/liquid-glass";
import BookingModalFloating from "../BookingModalFloating";

// Nav item interface
interface NavItem {
  label: string;
  href: string;
  icon?: IconDefinition;
  isHome?: boolean;
  isButton?: boolean;
}

// Layout & Animation Constants
const SHRINK_MS = 360;
const SHRINK_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const DOCK_HEIGHT = 64;
const DOCK_HEIGHT_SHRUNK = 56;
const DOCK_WIDTH_SHRUNK = "88%";

const ICON_PAD = 2;

// Glass & Pill Styling
const GLASS_TINT = "rgba(255, 255, 255, 0.40)";
const GLASS_SHEEN =
  "linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0) 55%)";
const GLASS_SHADOW = "0 10px 26px -8px rgba(0, 0, 0, 0.12)";
const PILL_COLOR = "rgba(0, 0, 0, 0.12)";

// iOS / Safari blur (dock & panel sama)
const WEBKIT_BACKDROP = "blur(0.1px) saturate(1.8) brightness(1.06)";

// Action Menu Glass Styling (rounded-3xl = 24px, tint sama dengan dock)
const MENU_GLASS_TINT = GLASS_TINT;
const MENU_GLASS_RADIUS = 24;

// Genie motion (keluar / masuk dari tombol plus, tanpa opacity di parent glass)
const GENIE_HIDDEN = { scaleX: 0.1, scaleY: 0.05, y: 44 };

// Genie show (X lebih lambat dari Y = bentuk corong, lalu melebar)
const GENIE_SHOW: TargetAndTransition = {
  scaleX: 1,
  scaleY: 1,
  y: 0,
  transition: {
    y: { type: "spring", stiffness: 340, damping: 30, mass: 0.9 },
    scaleY: { type: "spring", stiffness: 300, damping: 24, mass: 0.9 },
    scaleX: { type: "spring", stiffness: 190, damping: 26, mass: 0.9 },
  },
};

// Genie hide (X menyempit lebih dulu, lalu tersedot ke tombol)
const GENIE_HIDE: TargetAndTransition = {
  ...GENIE_HIDDEN,
  transition: {
    scaleX: { duration: 0.24, ease: [0.5, 0, 0.75, 0] },
    scaleY: { duration: 0.32, ease: [0.5, 0, 0.75, 0] },
    y: { duration: 0.32, ease: [0.5, 0, 0.75, 0] },
  },
};

// Genie content (muncul belakangan, hilang duluan)
const GENIE_CONTENT_SHOW: TargetAndTransition = {
  opacity: 1,
  transition: { delay: 0.08, duration: 0.18, ease: "easeOut" },
};

const GENIE_CONTENT_HIDE: TargetAndTransition = {
  opacity: 0,
  transition: { duration: 0.1, ease: "easeIn" },
};

const GLASS_OPTICS = {
  strength: 0.1,
  depth: 0.2,
  curvature: 0.15,
  bend: 0.4,
  bendWidth: 0.06,
  dispersion: 0.08,
  specular: 0.7,
  sheenAngle: 0,
  sheen: 0.35,
  sheenWidth: 2.5,
  sheenFalloff: 1.5,
  glow: 0.09,
  glowSpread: 1,
  glowFalloff: 1.5,
  frost: 0,
  brightness: 0.6,
};

// Mount hook
const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// WebKit check
function detectWebKitOnly(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const isDesktopSafari =
    /^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(ua);

  return isIOS || isDesktopSafari;
}

// Glass layer (dipakai dock & panel agar identik)
function GlassLayer({
  webKit,
  radius,
  tint,
  radiusTransition,
}: {
  webKit: boolean;
  radius: number;
  tint: string;
  radiusTransition?: string;
}) {
  return (
    <>
      {/* Glass background */}
      {webKit ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
          style={{
            borderRadius: radius,
            background: tint,
            WebkitBackdropFilter: WEBKIT_BACKDROP,
            backdropFilter: WEBKIT_BACKDROP,
            boxShadow: "none",
            transition: radiusTransition,
            transform: "translate3d(0, 0, 0)",
          }}
        />
      ) : (
        <Glass
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
          optics={GLASS_OPTICS}
          style={{
            background: tint,
            border: "none",
            borderRadius: radius,
            boxShadow: "none",
          }}
        >
          <span className="pointer-events-none absolute inset-0" />
        </Glass>
      )}

      {/* Glass sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          borderRadius: radius,
          background: GLASS_SHEEN,
          transition: radiusTransition,
        }}
      />
    </>
  );
}

// Home Icon
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

// Nav Icon
function NavIcon({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const iconColor = "#000000";

  if (item.isHome) {
    if (isActive) {
      return (
        <Home
          className="h-[26px] w-[26px]"
          style={{ color: iconColor }}
          fill={iconColor}
          stroke={iconColor}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      );
    }

    return <HomeOutlineNoDoor size={26} color={iconColor} />;
  }

  if (item.icon) {
    return (
      <FontAwesomeIcon
        icon={item.icon}
        className="text-[24px]"
        style={{
          color: iconColor,
          opacity: isActive ? 1 : 0.65,
        }}
      />
    );
  }

  return null;
}

// Component
export default function MobileBottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMounted = useIsMounted();

  const useWebKitGlass = useMemo(
    () => (isMounted ? detectWebKitOnly() : false),
    [isMounted],
  );

  // State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  const dockRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const lastScrollY = useRef(0);

  // Tracking refs
  const dragStartPos = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );
  const suppressNextClickRef = useRef(false);
  const plusPointerRef = useRef(false);

  const lockedIndexRef = useRef<number | null>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);

  // Scroll listener
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMounted]);

  // Motion values & membal / rubberbanding springs
  const rawX = useMotionValue(0);
  const overdragVal = useMotionValue(0);

  // Spring pil membal saat dilepas
  const springX = useSpring(rawX, {
    stiffness: 450,
    damping: 28,
    mass: 0.6,
  });

  // Spring elastisitas dockbar saat ditarik melebihi batas
  const springOverdrag = useSpring(overdragVal, {
    stiffness: 320,
    damping: 20,
    mass: 0.8,
  });

  // Translasi geser elastis dockbar saat pil ditarik melewati batas
  const dockTranslateX = useTransform(
    springOverdrag,
    [-100, 0, 100],
    [-2, 0, 2],
  );

  // Skala peregangan dockbar saat ditarik
  const dockScaleX = useTransform(
    springOverdrag,
    [-100, 0, 100],
    [1.04, 1, 1.04],
  );

  const dockSkewX = useTransform(springOverdrag, [-100, 0, 100], [-2, 0, 2]);

  // Navigation menu items
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
      { label: "Jadwal", href: "/jadwal-dokter", icon: faCalendarDays },
      { label: "Promo", href: "/promo", icon: faTicket },
    ],
    [],
  );

  const activeIndex = useMemo(() => {
    if (!isMounted) return 0;

    const idx = navItems.findIndex(
      (item) => !item.isButton && item.href === pathname,
    );

    return idx !== -1 ? idx : 0;
  }, [pathname, navItems, isMounted]);

  const shouldShrink = isScrolledDown && !isDragging;

  const basePilWidth = shouldShrink ? 58 : 66;
  const basePilHeight = shouldShrink ? 48 : 55;
  const dockHeight = shouldShrink ? DOCK_HEIGHT_SHRUNK : DOCK_HEIGHT;
  const dockRadius = dockHeight / 2;
  const DRAG_SCALE = 1.04;
  const INNER_MARGIN = 4;

  // Klem presisi agar pil tidak menembus batas dockbar
  const clampX = useCallback(
    (x: number, width: number, dragging: boolean) => {
      const currentScale = dragging ? DRAG_SCALE : 1;
      const effectiveHalfPil = (basePilWidth * currentScale) / 2;

      const minX = INNER_MARGIN + effectiveHalfPil;
      const maxX = width - INNER_MARGIN - effectiveHalfPil;

      return Math.max(minX, Math.min(maxX, x));
    },
    [basePilWidth],
  );

  // Perhitungan overdrag untuk menggerakkan elastisitas dockbar
  const getOverdragAmount = useCallback(
    (x: number, width: number, dragging: boolean) => {
      const currentScale = dragging ? DRAG_SCALE : 1;
      const effectiveHalfPil = (basePilWidth * currentScale) / 2;

      const minX = INNER_MARGIN + effectiveHalfPil;
      const maxX = width - INNER_MARGIN - effectiveHalfPil;

      if (x < minX) return x - minX;
      if (x > maxX) return x - maxX;

      return 0;
    },
    [basePilWidth],
  );

  const getCenterXForIndex = useCallback(
    (index: number, width: number) => {
      const itemWidth = (width - ICON_PAD * 2) / navItems.length;

      return ICON_PAD + index * itemWidth + itemWidth / 2;
    },
    [navItems.length],
  );

  const movePillToIndex = useCallback(
    (index: number, width?: number) => {
      if (!dockRef.current) return;

      const rect = dockRef.current.getBoundingClientRect();
      const realWidth = width || dockRef.current.offsetWidth || rect.width;

      if (!realWidth) return;

      const center = getCenterXForIndex(index, realWidth);
      const targetX = clampX(center, realWidth, false);

      rawX.set(targetX);
      overdragVal.set(0);
    },
    [getCenterXForIndex, clampX, rawX, overdragVal],
  );

  const updateTargetPos = useCallback(() => {
    if (!dockRef.current) return;

    const rect = dockRef.current.getBoundingClientRect();
    const realWidth = dockRef.current.offsetWidth || rect.width;

    const lockedIndex = lockedIndexRef.current;

    if (lockedIndex !== null) {
      movePillToIndex(lockedIndex, realWidth);
      return;
    }

    movePillToIndex(activeIndex, realWidth);
  }, [activeIndex, movePillToIndex]);

  // Route sync
  useEffect(() => {
    if (!isMounted) return;

    const lockedIndex = lockedIndexRef.current;

    if (lockedIndex !== null) {
      const targetItem = navItems[lockedIndex];

      if (targetItem && !targetItem.isButton && targetItem.href === pathname) {
        lockedIndexRef.current = null;
        setLockedIndex(null);
      } else {
        movePillToIndex(lockedIndex);
        return;
      }
    }

    movePillToIndex(activeIndex);
  }, [pathname, activeIndex, navItems, isMounted, movePillToIndex]);

  // Resize listener
  useEffect(() => {
    if (!isMounted) return;

    updateTargetPos();

    const handleResize = () => {
      updateTargetPos();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateTargetPos, isMounted]);

  // ResizeObserver for shrink transition
  useEffect(() => {
    if (!isMounted || !dockRef.current) return;
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      if (dragStartPos.current) return;
      updateTargetPos();
    });

    observer.observe(dockRef.current);

    return () => {
      observer.disconnect();
    };
  }, [updateTargetPos, isMounted]);

  // Pointer event handlers dengan elastisitas drag
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest("[data-plus-button]")) {
      return;
    }

    if (dockRef.current) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };

    setIsDragging(true);
    lockedIndexRef.current = null;
    setLockedIndex(null);

    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const realWidth = dockRef.current.offsetWidth || rect.width;
      const scaleFactor = rect.width / realWidth;
      const mouseX = (e.clientX - rect.left) / scaleFactor;

      rawX.set(clampX(mouseX, realWidth, true));
      overdragVal.set(getOverdragAmount(mouseX, realWidth, true));
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (
      plusPointerRef.current ||
      !dragStartPos.current ||
      !isDragging ||
      !dockRef.current
    )
      return;

    const rect = dockRef.current.getBoundingClientRect();
    const realWidth = dockRef.current.offsetWidth || rect.width;
    const scaleFactor = rect.width / realWidth;
    const mouseX = (e.clientX - rect.left) / scaleFactor;

    // Klem posisi pil dalam batas piksel riil
    rawX.set(clampX(mouseX, realWidth, true));
    // Tarik dockbar secara elastis saat melebihi batas
    overdragVal.set(getOverdragAmount(mouseX, realWidth, true));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (plusPointerRef.current) {
      return;
    }

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    setIsDragging(false);

    if (!dockRef.current || !dragStartPos.current) {
      dragStartPos.current = null;
      return;
    }

    const duration = Date.now() - dragStartPos.current.time;
    const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
    const deltaY = Math.abs(e.clientY - dragStartPos.current.y);

    const isQuickTap = duration < 180 && deltaX < 8 && deltaY < 8;

    dragStartPos.current = null;

    const rect = dockRef.current.getBoundingClientRect();
    const realWidth = dockRef.current.offsetWidth || rect.width;
    const scaleFactor = rect.width / realWidth;

    const currentX = clampX(
      (e.clientX - rect.left) / scaleFactor,
      realWidth,
      false,
    );

    const itemWidth = (realWidth - ICON_PAD * 2) / navItems.length;

    const targetIndex = Math.max(
      0,
      Math.min(
        navItems.length - 1,
        Math.floor((currentX - ICON_PAD) / itemWidth),
      ),
    );

    const item = navItems[targetIndex];

    lockedIndexRef.current = targetIndex;
    setLockedIndex(targetIndex);

    movePillToIndex(targetIndex, realWidth);

    if (item.isButton) {
      lockedIndexRef.current = null;
      setLockedIndex(null);
      setIsActionMenuOpen((prev) => !prev);
    } else if (item.href) {
      if (!isQuickTap) {
        suppressNextClickRef.current = true;
      }
      router.push(item.href);
    }

    // Kembalikan efek overdrag elastis dockbar secara membal
    overdragVal.set(0);

    window.setTimeout(() => {
      suppressNextClickRef.current = false;
    }, 50);
  };

  const getItemScale = useCallback(
    (itemIndex: number) => {
      const visualIndex = lockedIndex !== null ? lockedIndex : activeIndex;
      return itemIndex === visualIndex ? 0.92 : 1;
    },
    [lockedIndex, activeIndex],
  );

  // Outside click listener
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (
      plusButtonRef.current &&
      plusButtonRef.current.contains(event.target as Node)
    ) {
      return;
    }

    if (
      actionMenuRef.current &&
      !actionMenuRef.current.contains(event.target as Node)
    ) {
      setIsActionMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isActionMenuOpen) return;

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isActionMenuOpen, handleOutsideClick]);

  if (!isMounted) return null;

  return (
    <>
      {/* Booking Modal */}
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="relative min-h-0 w-full">
        <div className="fixed inset-x-0 bottom-0 z-[99] flex flex-col items-center justify-end pb-6 pointer-events-none">
          <nav
            aria-label="Navigasi Bawah Seluler"
            className="flex w-full flex-col items-center px-4 select-none lg:hidden"
          >
            {/* Action Menu (genie, tanpa opacity di parent glass agar tidak glitch) */}
            <AnimatePresence mode="wait">
              {isActionMenuOpen && (
                <motion.aside
                  key="action-menu"
                  ref={actionMenuRef}
                  initial={GENIE_HIDDEN}
                  animate={GENIE_SHOW}
                  exit={GENIE_HIDE}
                  style={{ originX: 0.5, originY: 1 }}
                  className="pointer-events-auto relative mb-3.5 flex w-[230px] flex-col rounded-3xl p-2"
                >
                  {/* Menu shadow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                      borderRadius: MENU_GLASS_RADIUS,
                      boxShadow: GLASS_SHADOW,
                    }}
                  />

                  {/* Menu glass */}
                  <GlassLayer
                    webKit={useWebKitGlass}
                    radius={MENU_GLASS_RADIUS}
                    tint={MENU_GLASS_TINT}
                  />

                  {/* Menu content (fade di sini saja) */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={GENIE_CONTENT_SHOW}
                    exit={GENIE_CONTENT_HIDE}
                    className="relative z-10 flex w-full flex-col"
                  >
                    {/* Button: Booking */}
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
                        className="h-[20px] w-[20px]"
                      />
                      <span>Buat Janji Temu</span>
                    </button>

                    <div className="my-1 h-px w-full bg-black/10" />

                    {/* Button: Kamar Perawatan */}
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
                        className="h-[20px] w-[20px]"
                      />
                      <span>Kamar Perawatan</span>
                    </button>

                    <div className="my-1 h-px w-full bg-black/10" />

                    {/* Button: Ketersediaan Kamar */}
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
                        className="h-[20px] w-[20px]"
                      />
                      <span>Ketersediaan Kamar</span>
                    </button>
                  </motion.div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Dock Container dengan animasi elastisitas saat overdrag */}
            <motion.div
              ref={dockRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onContextMenu={(e) => e.preventDefault()}
              className="pointer-events-auto relative flex max-w-[390px] items-center touch-none cursor-grab active:cursor-grabbing select-none"
              style={{
                width: shouldShrink ? DOCK_WIDTH_SHRUNK : "100%",
                height: dockHeight,
                borderRadius: dockRadius,
                x: dockTranslateX,
                scaleX: dockScaleX,
                skewX: dockSkewX,
                transition: `width ${SHRINK_MS}ms ${SHRINK_EASE}, height ${SHRINK_MS}ms ${SHRINK_EASE}, border-radius ${SHRINK_MS}ms ${SHRINK_EASE}`,
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
              }}
            >
              {/* Dock shadow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  borderRadius: dockRadius,
                  boxShadow: GLASS_SHADOW,
                  transition: `border-radius ${SHRINK_MS}ms ${SHRINK_EASE}`,
                }}
              />

              {/* Dock glass */}
              <GlassLayer
                webKit={useWebKitGlass}
                radius={dockRadius}
                tint={GLASS_TINT}
                radiusTransition={`border-radius ${SHRINK_MS}ms ${SHRINK_EASE}`}
              />

              {/* Dock content */}
              <div className="absolute inset-0 z-10">
                {/* Active pill */}
                <motion.div
                  className="pointer-events-none absolute top-1/2 z-10 rounded-full"
                  animate={{
                    width: `${basePilWidth}px`,
                    height: `${basePilHeight}px`,
                    scale: isDragging ? DRAG_SCALE : 1,
                    backgroundColor: PILL_COLOR,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  style={{
                    x: springX,
                    y: "-50%",
                    left: 0,
                    translateX: "-50%",
                  }}
                />

                {/* Nav items */}
                <menu
                  className="relative z-20 m-0 box-border flex h-full w-full list-none items-center justify-between p-0"
                  style={{ paddingInline: ICON_PAD }}
                >
                  {navItems.map((item, i) => {
                    const visualActiveIndex =
                      lockedIndex !== null ? lockedIndex : activeIndex;

                    const isActive = i === visualActiveIndex;
                    const localScale = getItemScale(i);

                    return (
                      <li
                        key={item.href || i}
                        className="flex h-full flex-1 items-center justify-center transition-transform duration-100 ease-out"
                        style={{
                          transform: `scale(${localScale})`,
                        }}
                      >
                        {item.isButton ? (
                          /* Plus button */
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
                            data-plus-button
                            onPointerDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              plusPointerRef.current = true;
                              setIsActionMenuOpen((prev) => !prev);
                            }}
                            onPointerMove={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onPointerUp={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              plusPointerRef.current = false;
                            }}
                            onPointerCancel={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              plusPointerRef.current = false;
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="flex h-12 w-12 select-none items-center justify-center rounded-full outline-none"
                            style={{
                              WebkitTapHighlightColor: "transparent",
                              touchAction: "none",
                              WebkitTouchCallout: "none",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="pointer-events-none text-[24px] text-black"
                              style={{
                                transform: isActionMenuOpen
                                  ? "rotate(45deg)"
                                  : "rotate(0deg)",
                                transition: "transform 200ms ease",
                              }}
                            />
                          </button>
                        ) : (
                          /* Nav link */
                          <Link
                            href={item.href || "#"}
                            aria-label={item.label}
                            data-no-drag
                            onContextMenu={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.preventDefault();

                              if (suppressNextClickRef.current) {
                                suppressNextClickRef.current = false;
                                return;
                              }

                              lockedIndexRef.current = i;
                              setLockedIndex(i);

                              movePillToIndex(i);

                              if (pathname === item.href) {
                                lockedIndexRef.current = null;
                                setLockedIndex(null);

                                window.scrollTo({
                                  top: 0,
                                  behavior: "smooth",
                                });
                              } else if (item.href) {
                                router.push(item.href);
                              }

                              e.stopPropagation();
                            }}
                            className="flex h-12 w-12 select-none items-center justify-center rounded-full outline-none"
                            style={{
                              WebkitTapHighlightColor: "transparent",
                              touchAction: "none",
                              WebkitTouchCallout: "none",
                              WebkitUserSelect: "none",
                            }}
                          >
                            <NavIcon item={item} isActive={isActive} />
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </menu>
              </div>
            </motion.div>
          </nav>
        </div>
      </div>
    </>
  );
}
