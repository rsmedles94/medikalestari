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
import BookingModalFloating from "../BookingModalFloating";

// Nav item
interface NavItem {
  label: string;
  href: string;
  icon?: IconDefinition;
  isHome?: boolean;
  isButton?: boolean;
}

// Mounted state
const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// Home icon
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

// Nav icon
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

export default function MobileBottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMounted = useIsMounted();

  // State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  const dockRef = useRef<HTMLDivElement>(null);
  const liquidRootRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dockWidth, setDockWidth] = useState(390);

  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const lastScrollY = useRef(0);

  // Precision Drag / Tap Tracking
  const dragStartPos = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );
  const suppressNextClickRef = useRef(false);
  const plusPointerRef = useRef(false);

  const lockedIndexRef = useRef<number | null>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);

  // LiquidGlass
  useEffect(() => {
    const root = liquidRootRef.current;
    const dock = dockRef.current;

    if (!root || !dock) return;

    dock.dataset.config = JSON.stringify({
      cornerRadius: 32,
      refraction: 2.1,
      chromAberration: 0.065,
      edgeHighlight: 0.42,
      blurAmount: 0.025,
    });

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
      })
      .catch((error) => {
        console.error("LiquidGlass initialization failed:", error);
      });

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, []);

  // Scroll
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

  // Motion
  const rawX = useMotionValue(0);
  const overdragVal = useMotionValue(0);

  const springX = useSpring(rawX, {
    stiffness: 450,
    damping: 32,
    mass: 0.6,
  });

  const springOverdrag = useSpring(overdragVal, {
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

  // Nav items
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

  const basePilWidth = shouldShrink ? 68 : 72;
  const basePilHeight = shouldShrink ? 48 : 55;
  const DRAG_SCALE = 1.04;
  const INNER_MARGIN = 4;

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

  const getCenterXForIndex = useCallback(
    (index: number, width: number) => {
      const itemWidth = width / navItems.length;

      return index * itemWidth + itemWidth / 2;
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

      setDockWidth(realWidth);

      rawX.set(targetX);
      overdragVal.set(0);
    },
    [getCenterXForIndex, clampX, rawX, overdragVal],
  );

  const updateTargetPos = useCallback(() => {
    if (!dockRef.current) return;

    const rect = dockRef.current.getBoundingClientRect();
    const realWidth = dockRef.current.offsetWidth || rect.width;

    setDockWidth(realWidth);

    const lockedIndex = lockedIndexRef.current;

    if (lockedIndex !== null) {
      movePillToIndex(lockedIndex, realWidth);
      return;
    }

    movePillToIndex(activeIndex, realWidth);
  }, [activeIndex, movePillToIndex]);

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

  useEffect(() => {
    if (!isMounted || isDragging) return;

    updateTargetPos();
  }, [shouldShrink, updateTargetPos, isMounted, isDragging]);

  // Handle Drag & Pointer Interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest("[data-plus-button]")) {
      return;
    }

    // Tangkap pointer langsung untuk instant drag
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

    // Perbarui posisi pil secara langsung
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

    rawX.set(clampX(mouseX, realWidth, true));
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

    const itemWidth = realWidth / navItems.length;

    const targetIndex = Math.max(
      0,
      Math.min(navItems.length - 1, Math.floor(currentX / itemWidth)),
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

  // Outside click
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
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div ref={liquidRootRef} className="relative min-h-0 w-full">
        <div className="fixed inset-x-0 bottom-0 z-[99] flex flex-col items-center justify-end pb-6 pointer-events-none">
          <nav
            aria-label="Navigasi Bawah Seluler"
            className="flex w-full flex-col items-center px-4 select-none lg:hidden"
          >
            {/* Action menu */}
            <AnimatePresence mode="wait">
              {isActionMenuOpen && (
                <motion.aside
                  ref={actionMenuRef}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    y: 14,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    y: 14,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="pointer-events-auto mb-3.5 flex w-[230px] flex-col rounded-3xl bg-white/70 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
                >
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
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Dock */}
            <motion.div
              ref={dockRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onContextMenu={(e) => e.preventDefault()}
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
              className="pointer-events-auto relative flex w-full max-w-[390px] items-center overflow-hidden rounded-[32px] touch-none cursor-grab active:cursor-grabbing select-none"
              style={{
                scaleX: dockScaleX,
                skewX: dockSkewX,
                backgroundColor: "rgba(255, 255, 255, 0.600)",
                border: "1px solid rgba(255, 255, 255, 0.28)",
                boxShadow:
                  "inset 0 0 0 1px rgba(255, 255, 255, 0.26), inset 0 0 18px rgba(255, 255, 255, 0.035), 0 10px 30px rgba(0, 0, 0, 0.10)",
                WebkitTransform: "translateZ(0)",
                transform: "translateZ(0)",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
              }}
            >
              {/* Active pill */}
              <motion.div
                className="pointer-events-none absolute top-1/2 z-10 rounded-full"
                animate={{
                  width: `${basePilWidth}px`,
                  height: `${basePilHeight}px`,
                  scale: isDragging ? DRAG_SCALE : 1,
                  backgroundColor: "rgba(0, 0, 0, 0.19)",
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
                  WebkitTransform: "translateZ(0)",
                  transform: "translateZ(0)",
                }}
              />

              {/* Navigation */}
              <menu className="relative z-20 m-0 flex h-full w-full list-none items-center justify-between p-0">
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
            </motion.div>
          </nav>
        </div>
      </div>
    </>
  );
}
