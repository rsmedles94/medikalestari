"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import {
  AnimatePresence,
  animate,
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

const DRAG_SCALE = 1.04;

const INNER_MARGIN = 4;

// Jari harus bergeser sejauh ini (px) sebelum gesture dianggap drag.
// Ketukan biasa tidak membuat dock membesar atau pil melompat.
const DRAG_START_DISTANCE = 6;

// Scroll: jarak minimal (px) sebelum arah scroll dianggap berubah.
// Mencegah dock bolak-balik mengecil/membesar karena getaran scroll.
const SCROLL_THRESHOLD = 14;

// Di area atas halaman dock selalu penuh
const SCROLL_TOP_ZONE = 50;

// White dock and action-menu styling
const DOCK_BACKGROUND = "#FFFFFF";
const DOCK_BORDER = "1px solid rgba(0, 0, 0, 0.06)";
const GLASS_SHADOW = "0 10px 26px -8px rgba(0, 0, 0, 0.14)";
const PILL_COLOR = "rgb(0, 63, 136)";
const MENU_GLASS_RADIUS = 24;

// Spring pil saat pindah menu / dilepas setelah drag (sedikit membal)
const PILL_SPRING = {
  type: "spring",
  stiffness: 450,
  damping: 28,
  mass: 0.6,
} as const;

// Di awal drag pil meluncur cepat ke bawah jari (tidak melompat)
const DRAG_CATCHUP_SPRING = {
  type: "spring",
  stiffness: 700,
  damping: 45,
  mass: 0.5,
} as const;

// Menu aksi: naik dari bawah dengan halus (hanya transform + opacity, ringan)
const MENU_EASE = [0.22, 1, 0.36, 1] as const;

// useLayoutEffect aman untuk SSR
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Cocokkan route (mendukung rute turunan, mis. /promo/3 -> Promo)
function isRouteActive(href: string, path: string | null) {
  if (!path) return false;
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

// Mount hook

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,

    () => true,

    () => false,
  );
}

// Solid white background layer shared by dock and action menu
function GlassLayer({
  radius,
  radiusTransition,
}: {
  radius: number;
  radiusTransition?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      style={{
        borderRadius: radius,
        backgroundColor: DOCK_BACKGROUND,
        border: DOCK_BORDER,
        boxShadow: "none",
        transition: radiusTransition,
        transform: "translate3d(0, 0, 0)",
      }}
    />
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
  // Ikon aktif putih di atas pil biru; ikon nonaktif tetap hitam.
  const iconColor = isActive ? "#FFFFFF" : "#000000";

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

  // State

  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const actionMenuRef = useRef<HTMLDivElement>(null);

  const plusButtonRef = useRef<HTMLButtonElement>(null);

  const dockRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [isScrolledDown, setIsScrolledDown] = useState(false);

  // Menu yang baru saja diketuk / dilepas (supaya pil langsung pindah sebelum
  // navigasi selesai). Dibersihkan otomatis saat pathname berubah.
  const [lock, setLock] = useState<{ index: number; path: string } | null>(
    null,
  );

  // Lepas lock begitu navigasi selesai (pathname berubah). Dilakukan saat
  // render (bukan di effect) supaya tidak memicu render berantai.
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);

    setLock(null);
  }

  // Indeks ikon yang sedang dilalui pil ketika drag berlangsung.
  const [dragVisualIndex, setDragVisualIndex] = useState<number | null>(null);

  // Tracking refs

  const dragStartPos = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );

  const suppressNextClickRef = useRef(false);

  const plusPointerRef = useRef(false);

  const pointerXRef = useRef<number | null>(null);

  const lastSyncKeyRef = useRef<string | null>(null);

  const shrunkRef = useRef(false);

  const offsetAnimRef = useRef<{ stop: () => void } | null>(null);

  const shownRef = useRef(false);

  // true setelah jari bergeser melewati DRAG_START_DISTANCE
  const isDraggingRef = useRef(false);

  // true di awal drag: pil menyusul jari dengan spring, baru kemudian menempel
  const catchUpRef = useRef(false);

  // Scroll listener (dengan hysteresis + throttle rAF)

  useEffect(() => {
    if (!isMounted) return;

    let anchorY = window.scrollY;
    let rafId = 0;
    let ticking = false;

    const applyShrink = (value: boolean) => {
      if (shrunkRef.current !== value) {
        shrunkRef.current = value;
        setIsScrolledDown(value);
      }
    };

    const update = () => {
      ticking = false;

      // abaikan overscroll bounce (iOS) di atas / bawah halaman
      const maxY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const y = Math.min(Math.max(window.scrollY, 0), maxY);

      if (y <= SCROLL_TOP_ZONE) {
        anchorY = y;
        applyShrink(false);
        return;
      }

      if (shrunkRef.current) {
        // sedang mengecil: ikuti titik terbawah, baru membesar jika naik cukup jauh
        if (y > anchorY) {
          anchorY = y;
        } else if (anchorY - y > SCROLL_THRESHOLD) {
          anchorY = y;
          applyShrink(false);
        }
      } else if (y < anchorY) {
        // sedang penuh: ikuti titik tertinggi, baru mengecil jika turun cukup jauh
        anchorY = y;
      } else if (y - anchorY > SCROLL_THRESHOLD) {
        anchorY = y;
        applyShrink(true);
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, [isMounted]);

  // Motion values

  // Offset pil (px) dari posisi menu aktifnya. Posisi dasar pil dihitung CSS
  // (persen dari lebar dock) sehingga selalu menempel pada ikon saat dock
  // mengecil / membesar. Offset hanya dipakai untuk drag & animasi pindah menu.
  const pillOffset = useMotionValue(0);

  const overdragVal = useMotionValue(0);

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

  const itemCount = navItems.length;

  const activeIndex = useMemo(() => {
    if (!isMounted) return 0;

    const idx = navItems.findIndex(
      (item) => !item.isButton && isRouteActive(item.href, pathname),
    );

    return idx !== -1 ? idx : 0;
  }, [pathname, navItems, isMounted]);

  // Menu yang sedang ditempati pil
  const committedIndex = lock ? lock.index : activeIndex;

  const shouldShrink = isScrolledDown && !isDragging;

  const basePilWidth = shouldShrink ? 58 : 66;

  const basePilHeight = shouldShrink ? 48 : 55;

  const dockHeight = shouldShrink ? DOCK_HEIGHT_SHRUNK : DOCK_HEIGHT;

  const dockRadius = dockHeight / 2;

  // Posisi pil dihitung CSS: sama persis dengan rumus layout ikon
  // (padding ICON_PAD + itemCount kolom sama lebar), jadi tidak ada lag
  // saat lebar dock bertransisi.
  const pillLeft = `calc(${ICON_PAD}px + (100% - ${ICON_PAD * 2}px) * ${
    (committedIndex + 0.5) / itemCount
  })`;

  // Di layar sempit pil tidak boleh lebih lebar dari kolomnya
  const pillWidth = `min(${basePilWidth}px, calc((100% - ${
    ICON_PAD * 2
  }px) / ${itemCount} - 2px))`;

  // Helper geometri (satuan px, dihitung saat dibutuhkan saja)

  const getCenterX = useCallback(
    (index: number, width: number) => {
      const itemWidth = (width - ICON_PAD * 2) / itemCount;

      return ICON_PAD + index * itemWidth + itemWidth / 2;
    },

    [itemCount],
  );

  const getIndexFromX = useCallback(
    (x: number, width: number) => {
      const itemWidth = (width - ICON_PAD * 2) / itemCount;

      return Math.max(
        0,

        Math.min(itemCount - 1, Math.floor((x - ICON_PAD) / itemWidth)),
      );
    },

    [itemCount],
  );

  const getBounds = useCallback(
    (width: number, dragging: boolean) => {
      const slot = (width - ICON_PAD * 2) / itemCount;

      const pillW = Math.min(basePilWidth, slot - 2);

      const effectiveHalfPil = (pillW * (dragging ? DRAG_SCALE : 1)) / 2;

      return {
        minX: INNER_MARGIN + effectiveHalfPil,

        maxX: width - INNER_MARGIN - effectiveHalfPil,
      };
    },

    [basePilWidth, itemCount],
  );

  // Klem presisi agar pil tidak menembus batas dockbar

  const clampX = useCallback(
    (x: number, width: number, dragging: boolean) => {
      const { minX, maxX } = getBounds(width, dragging);

      return Math.max(minX, Math.min(maxX, x));
    },

    [getBounds],
  );

  // Perhitungan overdrag untuk menggerakkan elastisitas dockbar

  const getOverdragAmount = useCallback(
    (x: number, width: number, dragging: boolean) => {
      const { minX, maxX } = getBounds(width, dragging);

      if (x < minX) return x - minX;

      if (x > maxX) return x - maxX;

      return 0;
    },

    [getBounds],
  );

  // Kembalikan pil (offset -> 0) ke menu yang sedang aktif
  const springPillHome = useCallback(() => {
    offsetAnimRef.current?.stop();

    offsetAnimRef.current = animate(pillOffset, 0, PILL_SPRING);
  }, [pillOffset]);

  // Saat menu aktif berpindah (ketuk, lepas drag, atau route berubah):
  // posisi dasar pil langsung pindah lewat CSS, offset di-rebase supaya pil
  // tetap terlihat di tempat semula lalu meluncur membal ke posisi baru.
  const committedIndexRef = useRef(committedIndex);

  useIsoLayoutEffect(() => {
    const dock = dockRef.current;

    const prev = committedIndexRef.current;

    committedIndexRef.current = committedIndex;

    // belum tampil -> tidak ada animasi awal
    if (!dock) return;

    if (!shownRef.current) {
      shownRef.current = true;

      return;
    }

    if (prev === committedIndex) return;

    const width = dock.offsetWidth;

    if (!width) return;

    offsetAnimRef.current?.stop();

    const visualX = getCenterX(prev, width) + pillOffset.get();

    pillOffset.set(visualX - getCenterX(committedIndex, width));

    offsetAnimRef.current = animate(pillOffset, 0, PILL_SPRING);
  }, [isMounted, committedIndex, getCenterX, pillOffset]);

  // Hentikan animasi saat unmount
  useEffect(() => {
    return () => {
      offsetAnimRef.current?.stop();
    };
  }, []);

  // Sinkronkan pil dengan posisi jari saat drag. Dipanggil dari pointer event
  // dan dari loop rAF selama drag (supaya pil tetap di bawah jari walau dock
  // sedang membesar karena transisi lebar).
  const syncDragPill = useCallback(() => {
    const dock = dockRef.current;

    const pointerX = pointerXRef.current;

    if (!dock || pointerX === null) return;

    const rect = dock.getBoundingClientRect();

    const key = `${pointerX}|${rect.left}|${rect.width}`;

    if (key === lastSyncKeyRef.current) return;

    lastSyncKeyRef.current = key;

    const realWidth = dock.offsetWidth || rect.width;

    if (!realWidth) return;

    const scaleFactor = rect.width / realWidth || 1;

    const mouseX = (pointerX - rect.left) / scaleFactor;

    // Klem posisi pil dalam batas piksel riil

    const target =
      clampX(mouseX, realWidth, true) -
      getCenterX(committedIndexRef.current, realWidth);

    if (catchUpRef.current && Math.abs(target - pillOffset.get()) > 1.5) {
      // awal drag: pil meluncur cepat ke bawah jari (tidak melompat)
      offsetAnimRef.current?.stop();

      offsetAnimRef.current = animate(pillOffset, target, DRAG_CATCHUP_SPRING);
    } else {
      catchUpRef.current = false;

      offsetAnimRef.current?.stop();

      offsetAnimRef.current = null;

      pillOffset.set(target);
    }

    // Tarik dockbar secara elastis saat melebihi batas

    overdragVal.set(getOverdragAmount(mouseX, realWidth, true));

    // Perbarui warna ikon secara realtime mengikuti posisi pil.
    setDragVisualIndex(getIndexFromX(mouseX, realWidth));
  }, [
    clampX,
    getCenterX,
    getIndexFromX,
    getOverdragAmount,
    overdragVal,
    pillOffset,
  ]);

  useEffect(() => {
    if (!isDragging) return;

    let rafId = 0;

    const tick = () => {
      syncDragPill();

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isDragging, syncDragPill]);

  // Drag baru dimulai setelah jari bergeser cukup jauh, bukan saat menyentuh
  const startDrag = () => {
    isDraggingRef.current = true;

    catchUpRef.current = true;

    lastSyncKeyRef.current = null;

    offsetAnimRef.current?.stop();

    offsetAnimRef.current = null;

    setIsDragging(true);
  };

  const endDrag = () => {
    isDraggingRef.current = false;

    catchUpRef.current = false;

    pointerXRef.current = null;

    setIsDragging(false);

    setDragVisualIndex(null);
  };

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

    pointerXRef.current = e.clientX;

    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (plusPointerRef.current || !dragStartPos.current || !dockRef.current)
      return;

    pointerXRef.current = e.clientX;

    if (!isDraggingRef.current) {
      // masih ketukan biasa: abaikan sampai jari bergeser cukup jauh
      if (Math.abs(e.clientX - dragStartPos.current.x) < DRAG_START_DISTANCE) {
        return;
      }

      startDrag();
    }

    syncDragPill();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (plusPointerRef.current) {
      return;
    }

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    endDrag();

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

    const scaleFactor = rect.width / realWidth || 1;

    const currentX = clampX(
      (e.clientX - rect.left) / scaleFactor,

      realWidth,

      false,
    );

    const targetIndex = getIndexFromX(currentX, realWidth);

    const item = navItems[targetIndex];

    if (item.isButton) {
      // Dilepas di atas tombol plus: buka/tutup menu, pil kembali ke menu aktif
      springPillHome();

      setIsActionMenuOpen((prev) => !prev);
    } else if (item.href) {
      setLock({ index: targetIndex, path: pathname });

      // menu tidak berubah -> tidak ada rebase, cukup kembalikan pil ke tempatnya
      if (targetIndex === committedIndex) {
        springPillHome();
      }

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

  // Gesture dibatalkan (mis. diambil alih browser): jangan navigasi
  const handlePointerCancel = (e: React.PointerEvent) => {
    if (plusPointerRef.current) {
      return;
    }

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    dragStartPos.current = null;

    endDrag();

    overdragVal.set(0);

    springPillHome();
  };

  // Indeks yang terlihat aktif (ikon putih + skala kecil)
  const visualIndex =
    isDragging && dragVisualIndex !== null ? dragVisualIndex : committedIndex;

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
            {/* Action Menu: naik dari bawah dengan halus (tanpa efek genie) */}

            <AnimatePresence>
              {isActionMenuOpen && (
                <motion.aside
                  key="action-menu"
                  ref={actionMenuRef}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.26, ease: MENU_EASE },
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    transition: { duration: 0.16, ease: "easeIn" },
                  }}
                  style={{ willChange: "transform, opacity" }}
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

                  <GlassLayer radius={MENU_GLASS_RADIUS} />

                  {/* Menu content */}

                  <div className="relative z-10 flex w-full flex-col">
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
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Dock Container dengan animasi elastisitas saat overdrag */}

            <motion.div
              ref={dockRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
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
                radius={dockRadius}
                radiusTransition={`border-radius ${SHRINK_MS}ms ${SHRINK_EASE}`}
              />

              {/* Dock content */}

              <div className="absolute inset-0 z-10">
                {/* Active pill
                    - luar (CSS murni): posisi persen + ukuran bertransisi dengan
                      durasi & easing yang SAMA dengan dock -> menempel pada ikon
                    - dalam (framer): offset drag / pindah menu + skala saat drag */}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 z-10"
                  style={{
                    left: pillLeft,

                    width: pillWidth,

                    height: basePilHeight,

                    transform: "translate(-50%, -50%)",

                    transition: `width ${SHRINK_MS}ms ${SHRINK_EASE}, height ${SHRINK_MS}ms ${SHRINK_EASE}`,
                  }}
                >
                  <motion.div
                    className="h-full w-full rounded-full"
                    animate={{ scale: isDragging ? DRAG_SCALE : 1 }}
                    transition={{
                      type: "spring",

                      stiffness: 400,

                      damping: 25,
                    }}
                    style={{
                      x: pillOffset,

                      backgroundColor: PILL_COLOR,
                    }}
                  />
                </div>

                {/* Nav items */}

                <menu
                  className="relative z-20 m-0 box-border flex h-full w-full list-none items-center justify-between p-0"
                  style={{ paddingInline: ICON_PAD }}
                >
                  {navItems.map((item, i) => {
                    const isActive = i === visualIndex;

                    const localScale = isActive ? 0.92 : 1;

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
                              className="pointer-events-none text-[24px]"
                              style={{
                                color: isActive ? "#FFFFFF" : "#000000",

                                transform: isActionMenuOpen
                                  ? "rotate(45deg)"
                                  : "rotate(0deg)",

                                transition:
                                  "color 120ms linear, transform 200ms ease",
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

                              if (pathname === item.href) {
                                setLock(null);

                                window.scrollTo({
                                  top: 0,

                                  behavior: "smooth",
                                });
                              } else if (item.href) {
                                setLock({ index: i, path: pathname });

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
