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
  if (item.isHome) {
    if (isActive) {
      return (
        <Home
          className="w-[26px] h-[26px] text-black"
          fill="#000000"
          stroke="#000000"
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
        className="text-[24px] text-black"
        style={{
          color: "#000000",
          opacity: isActive ? 1 : 0.85,
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
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const [dockWidth, setDockWidth] = useState(390);

  // Motion Value & Spring Physics
  const rawX = useMotionValue(0);
  const overdragVal = useMotionValue(0); // Nilai seberapa keras kursor ditarik menabrak batas

  const springX = useSpring(rawX, {
    stiffness: 420,
    damping: 28,
    mass: 0.6,
  });

  const springOverdrag = useSpring(overdragVal, {
    stiffness: 400,
    damping: 20, // Membal elastis saat dilepas
  });

  // Transform efek squish/tekanan saat menabrak dinding batas
  const scaleX = useTransform(springOverdrag, [-100, 0, 100], [0.82, 1, 0.82]);
  const scaleY = useTransform(springOverdrag, [-100, 0, 100], [1.12, 1, 1.12]);

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

  // Strict Clamp X (Posisi fisik pil TIDAK PERNAH keluar dari garis tepi)
  const clampX = useCallback(
    (x: number, width: number) => {
      const pilWidth = isDragging ? 82 : 76;
      const padding = 8;
      const minX = padding + pilWidth / 2;
      const maxX = width - padding - pilWidth / 2;
      return Math.max(minX, Math.min(maxX, x));
    },
    [isDragging],
  );

  // Perhitungan seberapa jauh kursor ditarik melebihi batas untuk efek kompresi elastis
  const getOverdragAmount = useCallback(
    (x: number, width: number) => {
      const pilWidth = isDragging ? 82 : 76;
      const padding = 8;
      const minX = padding + pilWidth / 2;
      const maxX = width - padding - pilWidth / 2;

      if (x < minX) return x - minX;
      if (x > maxX) return x - maxX;
      return 0;
    },
    [isDragging],
  );

  // Update Posisi Target Pil Sesuai Item Aktif
  const updateTargetPos = useCallback(() => {
    if (!dockRef.current) return;
    const dockRect = dockRef.current.getBoundingClientRect();
    setDockWidth(dockRect.width);

    const targetEl = itemRefs.current[activeIndex];
    if (targetEl) {
      const itemRect = targetEl.getBoundingClientRect();
      const center = itemRect.left + itemRect.width / 2 - dockRect.left;
      rawX.set(clampX(center, dockRect.width));
    } else {
      const itemWidth = dockRect.width / navItems.length;
      const center = activeIndex * itemWidth + itemWidth / 2;
      rawX.set(clampX(center, dockRect.width));
    }
    overdragVal.set(0);
  }, [activeIndex, navItems.length, rawX, overdragVal, clampX]);

  useEffect(() => {
    if (!isMounted) return;
    updateTargetPos();
    window.addEventListener("resize", updateTargetPos);
    return () => window.removeEventListener("resize", updateTargetPos);
  }, [updateTargetPos, isMounted]);

  // Handler Pointer Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    rawX.set(clampX(mouseX, rect.width));
    overdragVal.set(getOverdragAmount(mouseX, rect.width));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Posisi X tetap terkunci ketat di batas dalam
    rawX.set(clampX(mouseX, rect.width));
    // Efek tekanan dialokasikan ke overdragVal untuk simulasi membal
    overdragVal.set(getOverdragAmount(mouseX, rect.width));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);

    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    const currentX = clampX(e.clientX - rect.left, rect.width);
    const itemWidth = rect.width / navItems.length;

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

    // Reset overdrag agar pil membal kembali ke bentuk semula
    overdragVal.set(0);
    updateTargetPos();
  };

  // Efek Fluid Shrink Ikon saat Dilewati Pil
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
        return 1 - factor * 0.2;
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
      {/* SVG Filter Refraksi Liquid Glass */}
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
          <div
            ref={dockRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="pointer-events-auto relative w-full max-w-[410px] h-[72px] rounded-[36px] bg-white/20 shadow-[0_12px_40px_0_rgba(0,0,0,0.08)] overflow-hidden touch-none cursor-grab active:cursor-grabbing flex items-center"
            style={{
              backdropFilter:
                "url(#glass-refraction) blur(24px) saturate(200%)",
              WebkitBackdropFilter: "blur(24px) saturate(200%)",
              border: "1px solid rgba(255, 255, 255, 0.45)",
              boxShadow:
                "inset 0 1.5px 2px rgba(255, 255, 255, 0.7), inset 0 -1.5px 2px rgba(0, 0, 0, 0.05), 0 16px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Border Highlight Outer Glass */}
            <div className="absolute inset-0 rounded-[36px] pointer-events-none z-20 border border-white/30" />

            {/* PIL INDIKATOR AKTIF  */}
            <motion.div
              className="absolute top-1/2 rounded-full pointer-events-none z-0 overflow-hidden"
              style={{
                x: springX,
                y: "-50%",
                left: 0,
                width: isDragging ? "82px" : "76px",
                height: isDragging ? "56px" : "52px",
                translateX: "-50%",
                scaleX,
                scaleY,
                backdropFilter: "blur(28px) saturate(220%)",
                WebkitBackdropFilter: "blur(28px) saturate(220%)",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.82) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.9)",
                boxShadow: `
                  0 10px 24px -4px rgba(0, 0, 0, 0.12),
                  inset 0 2px 3px rgba(255, 255, 255, 1),
                  inset 0 -1px 2px rgba(0, 0, 0, 0.05)
                `,
              }}
            >
              {/* Highlight Kaca Refraksi Atas Pil */}
              <div
                className="absolute inset-x-2 top-0 h-[50%] rounded-t-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 100%)",
                }}
              />
            </motion.div>

            {/* LIST IKON DOCKBAR */}
            <menu className="relative z-10 flex items-center justify-between w-full h-full px-2 m-0 p-0 list-none">
              {navItems.map((item, i) => {
                const isActive = i === activeIndex;
                const localScale = getItemScale(i);

                return (
                  <li
                    key={item.href || i}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
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
                          className="text-[26px] text-black transition-transform duration-200"
                          style={{
                            transform: isActionMenuOpen
                              ? "rotate(45deg)"
                              : "rotate(0deg)",
                            color: "#000000",
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
          </div>
        </nav>
      </div>
    </>
  );
}
