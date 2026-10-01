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

// Lucide Icon untuk Home
import { Home } from "lucide-react";

// Font Awesome Imports
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
    >
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" opacity="0" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function NavIcon({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const iconColor = "#000000";

  if (item.isHome) {
    if (isActive) {
      return (
        <Home
          className="w-[26px] h-[26px] transition-colors duration-200"
          style={{ color: iconColor }}
          fill={iconColor}
          stroke={iconColor}
          strokeWidth={2.2}
        />
      );
    }
    return <HomeOutlineNoDoor size={26} color="#000000" />;
  }

  if (item.icon) {
    return (
      <FontAwesomeIcon
        icon={item.icon}
        className="text-[24px] transition-colors duration-200"
        style={{
          color: iconColor,
          opacity: isActive ? 1 : 0.65,
        }}
      />
    );
  }

  return null;
}

export default function MobileBottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMounted = useIsMounted();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  const dockRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dockWidth, setDockWidth] = useState(390);

  // Auto-Shrink saat scroll
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const lastScrollY = useRef(0);

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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  // Motion Values & Physics
  const rawX = useMotionValue(0);
  const overdragVal = useMotionValue(0);

  const springX = useSpring(rawX, {
    stiffness: 420,
    damping: 28,
    mass: 0.6,
  });

  const springOverdrag = useSpring(overdragVal, {
    stiffness: 380,
    damping: 22,
  });

  // Dockbar elastis saat overdrag
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

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: "Beranda", href: "/", isHome: true },
      { label: "Dokter", href: "/dokter", icon: faUserDoctor },
      { label: "Tambah", href: "#action-menu", icon: faPlus, isButton: true },
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

  // Ukuran Pil
  const basePilWidth = shouldShrink ? 68 : 74;
  const basePilHeight = shouldShrink ? 48 : 53;
  const DRAG_SCALE = 1.04;
  const INNER_MARGIN = 4; // Margin pil

  // Penguncian Batas 
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

  // Menghitung Titik Tengah Ikon Matematis
  const getCenterXForIndex = useCallback(
    (index: number, width: number) => {
      const itemWidth = width / navItems.length;
      return index * itemWidth + itemWidth / 2;
    },
    [navItems.length],
  );

  // Sync posisi pil activeIndex 
  const updateTargetPos = useCallback(() => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const realWidth = dockRef.current.offsetWidth || rect.width;
    setDockWidth(realWidth);

    const center = getCenterXForIndex(activeIndex, realWidth);
    rawX.set(clampX(center, realWidth, false));
    overdragVal.set(0);
  }, [activeIndex, getCenterXForIndex, rawX, overdragVal, clampX]);

  useEffect(() => {
    if (!isMounted) return;
    updateTargetPos();

    const handleResize = () => updateTargetPos();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateTargetPos, isMounted]);

  // Efek Penting: Tetap pertahankan simetri presisi walau dockbar berubah ukuran (Normal/Shrink)
  useEffect(() => {
    if (!isMounted || isDragging) return;
    updateTargetPos();
  }, [shouldShrink, updateTargetPos, isMounted, isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    if (!dockRef.current) return;

    const rect = dockRef.current.getBoundingClientRect();
    const realWidth = dockRef.current.offsetWidth || rect.width;
    // Normalisasi posisi klik X terhadap skala CSS
    const scaleFactor = rect.width / realWidth;
    const mouseX = (e.clientX - rect.left) / scaleFactor;

    rawX.set(clampX(mouseX, realWidth, true));
    overdragVal.set(getOverdragAmount(mouseX, realWidth, true));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const realWidth = dockRef.current.offsetWidth || rect.width;
    const scaleFactor = rect.width / realWidth;
    const mouseX = (e.clientX - rect.left) / scaleFactor;

    rawX.set(clampX(mouseX, realWidth, true));
    overdragVal.set(getOverdragAmount(mouseX, realWidth, true));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);

    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const realWidth = dockRef.current.offsetWidth || rect.width;
    const scaleFactor = rect.width / realWidth;
    const currentX = clampX(
      (e.clientX - rect.left) / scaleFactor,
      realWidth,
      false,
    );

    const itemWidth = realWidth / navItems.length;
    const targetIndex = Math.max(
      0,
      Math.min(navItems.length - 1, Math.floor(currentX / itemWidth)),
    );
    const item = navItems[targetIndex];

    if (item.isButton) {
      setIsActionMenuOpen((prev) => !prev);
    } else if (item.href) {
      router.push(item.href);
    }

    overdragVal.set(0);
    updateTargetPos();
  };

  const getItemScale = useCallback(
    (itemIndex: number) => {
      if (dockWidth <= 0) return 1;
      const itemWidth = dockWidth / navItems.length;
      const itemCenterX = itemIndex * itemWidth + itemWidth / 2;
      const currentPilX = springX.get();
      const distance = Math.abs(currentPilX - itemCenterX);
      const threshold = itemWidth * 0.75;

      if (distance < threshold) {
        const factor = 1 - distance / threshold;
        return 1 - factor * 0.08;
      }
      return 1;
    },
    [dockWidth, navItems.length, springX],
  );

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
    if (isActionMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [isActionMenuOpen, handleOutsideClick]);

  if (!isMounted) return null;

  return (
    <>
      <svg className="hidden absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter
            id="glass-refraction"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.05"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="fixed inset-x-0 bottom-0 pointer-events-none z-[99] flex flex-col items-center justify-end pb-6">
        <nav
          aria-label="Navigasi Bawah Seluler"
          className="w-full px-4 lg:hidden flex flex-col items-center select-none"
        >
          {/* Action Pop-up Menu */}
          <AnimatePresence mode="wait">
            {isActionMenuOpen && (
              <motion.aside
                ref={actionMenuRef}
                initial={{ opacity: 0, scale: 0.9, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 14 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto mb-3.5 w-[230px] bg-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.12)] rounded-3xl p-2 flex flex-col z-[100]"
                style={{
                  backdropFilter:
                    "url(#glass-refraction) blur(24px) saturate(210%)",
                  WebkitBackdropFilter: "blur(24px) saturate(210%)",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                  boxShadow:
                    "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 12px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    setIsBookingOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-black text-sm font-semibold text-left outline-none hover:bg-white/50 active:bg-white/70 transition-all rounded-2xl"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    className="text-black w-[20px] h-[20px]"
                  />
                  <span>Buat Janji Temu</span>
                </button>

                <div className="h-[1px] w-full bg-black/10 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    router.push("/services/kamar-perawatan");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-black text-sm font-semibold text-left outline-none hover:bg-white/50 active:bg-white/70 transition-all rounded-2xl"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <FontAwesomeIcon
                    icon={faProcedures}
                    className="text-black w-[20px] h-[20px]"
                  />
                  <span>Kamar Perawatan</span>
                </button>

                <div className="h-[1px] w-full bg-black/10 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    router.push("/ketersediaan-kamar");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-black text-sm font-semibold text-left outline-none hover:bg-white/50 active:bg-white/70 transition-all rounded-2xl"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <FontAwesomeIcon
                    icon={faBed}
                    className="text-black w-[20px] h-[20px]"
                  />
                  <span>Ketersediaan Kamar</span>
                </button>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* DOCKBAR UTAMA */}
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
              // Saat mengecil jadi putih solid ala Instagram, saat normal ultra transparan
              backgroundColor: shouldShrink
                ? "rgba(255, 255, 255, 0.85)"
                : "rgba(255, 255, 255, 0.03)",
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="pointer-events-auto relative w-full max-w-[390px] rounded-[32px] overflow-hidden touch-none cursor-grab active:cursor-grabbing flex items-center"
            style={{
              scaleX: dockScaleX,
              skewX: dockSkewX,
              backdropFilter:
                "url(#glass-refraction) blur(16px) saturate(180%) contrast(120%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%) contrast(120%)",
              border: "none",
              // Multi-layer inset shadow buat bikin efek lekukan kaca 3D & refraksi liquid iOS
              boxShadow: shouldShrink
                ? "0 10px 25px rgba(0, 0, 0, 0.15)"
                : "inset 0 2px 4px 0 rgba(255, 255, 255, 0.6), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2), inset 0 0 12px 2px rgba(255, 255, 255, 0.35), 0 20px 40px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* PIL INDIKATOR */}
            <motion.div
              className="absolute top-1/2 pointer-events-none z-0 rounded-full"
              animate={{
                width: `${basePilWidth}px`,
                height: `${basePilHeight}px`,
                scale: isDragging ? DRAG_SCALE : 1,
                // Hitam super transparan (muka kaca gelap halus ala iOS)
                backgroundColor: shouldShrink
                  ? "rgba(0, 0, 0, 0.15)"
                  : "rgba(0, 0, 0, 0.18)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{
                x: springX,
                y: "-50%",
                left: 0,
                translateX: "-50%",
                backdropFilter: "blur(8px) brightness(0.85) contrast(110%)",
                WebkitBackdropFilter:
                  "blur(8px) brightness(0.85) contrast(110%)",
                border: "none",

              }}
            />

            {/* LIST NAVITEM */}
            <menu className="relative z-10 flex items-center justify-between w-full h-full m-0 p-0 list-none">
              {navItems.map((item, i) => {
                const isActive = i === activeIndex;
                const localScale = getItemScale(i);

                return (
                  <li
                    key={item.href || i}
                    className="flex flex-1 justify-center h-full items-center transition-transform duration-100 ease-out"
                    style={{
                      transform: `scale(${localScale})`,
                    }}
                  >
                    {item.isButton ? (
                      <button
                        ref={plusButtonRef}
                        type="button"
                        aria-label="Menu Aksi Tambahan"
                        onClick={() => setIsActionMenuOpen((prev) => !prev)}
                        className="flex items-center justify-center w-12 h-12 rounded-full select-none focus:outline-none"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-[24px] text-black transition-transform duration-200"
                          style={{
                            transform: isActionMenuOpen
                              ? "rotate(45deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        aria-label={item.label}
                        onClick={(e) => {
                          if (pathname === item.href) {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                        className="flex items-center justify-center w-12 h-12 rounded-full select-none focus:outline-none"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        <NavIcon item={item} isActive={isActive} />
                      </Link>
                    )}
                  </li>
                );
              })}
            </menu>
          </motion.div>
        </nav>
      </div>
    </>
  );
}
