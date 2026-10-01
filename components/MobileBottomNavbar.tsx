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
import { AnimatePresence, motion } from "framer-motion";

// Lucide Icon untuk Home saat aktif
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
  size = 22,
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

// Sub-komponen terpisah untuk merapikan nested ternary (SonarQube rule S3358)
function NavIcon({ item, isActive }: { item: NavItem; isActive: boolean }) {
  if (item.isHome) {
    if (isActive) {
      return (
        <Home
          className="w-[22px] h-[22px] text-black"
          fill="#000000"
          stroke="#000000"
          strokeWidth={2.2}
        />
      );
    }
    return <HomeOutlineNoDoor size={22} color="#000000" />;
  }

  if (item.icon) {
    return (
      <FontAwesomeIcon
        icon={item.icon}
        className="text-[20px] text-black"
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

  // REFS & PHYSICS STATE
  const dockRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [activeX, setActiveX] = useState<number>(0);
  const [dragX, setDragX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dockWidth, setDockWidth] = useState<number>(390); // State ukuran container untuk hindari pembacaan ref saat render

  // Spring Physics Velocity & Position
  const currentPosRef = useRef<number>(0);
  const targetPosRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

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

  // Kalkulasi Titik Posisi Tengah Ikon Presisi & Update Dock Width
  const calculateTargetPosition = useCallback(() => {
    if (!dockRef.current) return;
    const dockRect = dockRef.current.getBoundingClientRect();
    setDockWidth(dockRect.width);

    const targetElement = itemRefs.current[activeIndex];
    if (targetElement) {
      const itemRect = targetElement.getBoundingClientRect();
      const center = itemRect.left + itemRect.width / 2 - dockRect.left;
      targetPosRef.current = center;
    } else {
      const itemWidth = dockRect.width / navItems.length;
      targetPosRef.current = activeIndex * itemWidth + itemWidth / 2;
    }
  }, [activeIndex, navItems.length]);

  useEffect(() => {
    calculateTargetPosition();
    window.addEventListener("resize", calculateTargetPosition);
    return () => window.removeEventListener("resize", calculateTargetPosition);
  }, [calculateTargetPosition, isMounted]);

  // SPRING PHYSICS LOOP & STRICT ELASTIC RUBBER BANDING
  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;

      const stiffness = isDragging ? 550 : 360;
      const damping = isDragging ? 28 : 22;

      let target = dragX !== null ? dragX : targetPosRef.current;

      if (dockRef.current) {
        const containerWidth = dockRef.current.getBoundingClientRect().width;
        const pillWidth = isDragging ? 72 : 58;
        const padding = 8;
        const minX = pillWidth / 2 + padding;
        const maxX = containerWidth - pillWidth / 2 - padding;

        if (dragX !== null) {
          if (dragX < minX) {
            const overflow = minX - dragX;
            target = minX - Math.pow(overflow, 0.4) * 1.2;
          } else if (dragX > maxX) {
            const overflow = dragX - maxX;
            target = maxX + Math.pow(overflow, 0.4) * 1.2;
          }
        }
      }

      const displacement = target - currentPosRef.current;
      const force = displacement * stiffness;

      velocityRef.current += force * dt;
      velocityRef.current *= Math.max(0, 1 - damping * dt);
      currentPosRef.current += velocityRef.current * dt;

      setActiveX(currentPosRef.current);

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [dragX, isDragging]);

  // INTERAKSI POINTER DRAGGING
  const handlePointerUpdate = useCallback(
    (clientX: number) => {
      if (!dockRef.current) return;
      const rect = dockRef.current.getBoundingClientRect();
      const mouseX = clientX - rect.left;

      if (isDragging) {
        setDragX(mouseX);
      }
    },
    [isDragging],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    handlePointerUpdate(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    handlePointerUpdate(e.clientX);
  };

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      setIsDragging(false);

      if (!dockRef.current) return;
      const rect = dockRef.current.getBoundingClientRect();
      const itemWidth = rect.width / navItems.length;

      if (dragX !== null) {
        const targetIndex = Math.max(
          0,
          Math.min(navItems.length - 1, Math.floor(dragX / itemWidth)),
        );
        const item = navItems[targetIndex];

        if (item.isButton) {
          setIsActionMenuOpen((prev) => !prev);
        } else if (item.href) {
          router.push(item.href);
        }
      }

      setDragX(null);
    },
    [dragX, navItems, router],
  );

  const handlePlusClick = useCallback(() => {
    setIsActionMenuOpen((prev) => !prev);
  }, []);

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

  const handleActionClick = useCallback((action: () => void) => {
    setIsActionMenuOpen(false);
    action();
  }, []);

  // DIUBAH: Menghitung skala murni berbasis State (dockWidth) tanpa menyentuh Ref selama render
  const getItemScale = useCallback(
    (itemIndex: number) => {
      if (dockWidth <= 0) return 1;
      const itemWidth = dockWidth / navItems.length;
      const itemCenterX = itemIndex * itemWidth + itemWidth / 2;
      const distance = Math.abs(activeX - itemCenterX);
      const threshold = itemWidth * 0.85;

      if (distance < threshold) {
        const factor = 1 - distance / threshold;
        return 1 - factor * 0.15;
      }
      return 1;
    },
    [activeX, dockWidth, navItems.length],
  );

  if (!isMounted) return null;

  return (
    <>
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="fixed inset-x-0 bottom-0 pointer-events-none z-[99] flex flex-col items-center justify-end pb-5">
        <nav
          aria-label="Navigasi Bawah Seluler"
          className="w-full px-4 lg:hidden flex flex-col items-center select-none"
        >
          {/* Menu Pop-up Melayang */}
          <AnimatePresence mode="wait">
            {isActionMenuOpen && (
              <motion.aside
                ref={actionMenuRef}
                initial={{ opacity: 0, scale: 0.92, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 12 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto mb-3 w-[220px] bg-white/70 shadow-[0_12px_32px_rgba(0,0,0,0.1)] rounded-2xl p-1.5 flex flex-col z-[100]"
                style={{
                  backdropFilter: "saturate(200%) blur(20px)",
                  WebkitBackdropFilter: "saturate(200%) blur(20px)",
                  border: "0.5px solid rgba(255, 255, 255, 0.5)",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    handleActionClick(() => setIsBookingOpen(true))
                  }
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-black text-sm font-semibold text-left outline-none hover:bg-white/60 active:bg-white/80 transition-all rounded-xl"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <FontAwesomeIcon
                    icon={faCalendarCheck}
                    className="text-black w-[18px] h-[18px]"
                  />
                  <span>Buat Janji Temu</span>
                </button>

                <div className="h-[1px] w-full bg-black/10 my-1" />

                <button
                  type="button"
                  onClick={() =>
                    handleActionClick(() =>
                      router.push("/services/kamar-perawatan"),
                    )
                  }
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-black text-sm font-semibold text-left outline-none hover:bg-white/60 active:bg-white/80 transition-all rounded-xl"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <FontAwesomeIcon
                    icon={faProcedures}
                    className="text-black w-[18px] h-[18px]"
                  />
                  <span>Kamar Perawatan</span>
                </button>

                <div className="h-[1px] w-full bg-black/10 my-1" />

                <button
                  type="button"
                  onClick={() =>
                    handleActionClick(() => router.push("/ketersediaan-kamar"))
                  }
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-black text-sm font-semibold text-left outline-none hover:bg-white/60 active:bg-white/80 transition-all rounded-xl"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <FontAwesomeIcon
                    icon={faBed}
                    className="text-black w-[18px] h-[18px]"
                  />
                  <span>Ketersediaan Kamar</span>
                </button>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* MAIN DOCKBAR UTAMA */}
          <div
            ref={dockRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="pointer-events-auto relative w-full max-w-[390px] h-[64px] rounded-[32px] bg-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] overflow-hidden touch-none cursor-grab active:cursor-grabbing"
            style={{
              backdropFilter: "saturate(180%) blur(20px)",
              WebkitBackdropFilter: "saturate(180%) blur(20px)",
              border: "0.5px solid rgba(255, 255, 255, 0.35)",
            }}
          >
            {/* RIM HIGHLIGHT DOCKBAR */}
            <div className="absolute inset-0 rounded-[32px] pointer-events-none z-20 border border-white/20" />

            {/* PIL INDIKATOR AKTIF */}
            <div
              className="absolute top-1/2 rounded-full pointer-events-none z-0 overflow-hidden"
              style={{
                left: `${activeX}px`,
                transform: "translate(-50%, -50%)",
                width: isDragging ? "84px" : "75px",
                height: isDragging ? "54px" : "48px",
                transition:
                  "width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                backdropFilter: "blur(20px) saturate(200%)",
                WebkitBackdropFilter: "blur(20px) saturate(200%)",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 245, 0.75) 100%)",
                border: "0.5px solid rgba(255, 255, 255, 0.8)",
                boxShadow: `
                  0 8px 20px -3px rgba(0, 0, 0, 0.08),
                  inset 0 1px 2px rgba(255, 255, 255, 1)
                `,
              }}
            >
              <div
                className="absolute inset-x-1.5 top-0 h-[45%] rounded-t-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%)",
                }}
              />
            </div>

            {/* IKON DOCKBAR */}
            <menu className="relative z-10 flex items-center justify-between h-full px-2 m-0 p-0 list-none">
              {navItems.map((item, i) => {
                const isActive = i === activeIndex;
                const localScale = getItemScale(i);

                return (
                  <li
                    key={item.href || i}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    className="flex flex-1 justify-center h-full items-center transition-transform duration-75 ease-out"
                    style={{
                      transform: `scale(${localScale})`,
                    }}
                  >
                    {item.isButton ? (
                      <button
                        ref={plusButtonRef}
                        type="button"
                        aria-label="Menu Aksi Tambahan"
                        onClick={handlePlusClick}
                        className="flex items-center justify-center w-11 h-11 rounded-full select-none focus:outline-none"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="text-[22px] text-black transition-transform duration-200"
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
                        className="flex items-center justify-center w-11 h-11 rounded-full select-none focus:outline-none"
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
