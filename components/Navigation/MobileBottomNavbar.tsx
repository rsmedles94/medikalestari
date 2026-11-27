"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus } from "@fortawesome/free-solid-svg-icons";

import BookingModalFloating from "../BookingModalFloating";

// ---------------------------------------------------------------------------
// Data menu (statis, di luar komponen)
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  /** nama file di public/assets/dockbar (tanpa .svg) */
  icon?: string;
  isButton?: boolean;
}

const ICON_DIR = "/assets/dockbar";

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Beranda", href: "/", icon: "home" },
  { label: "Dokter", href: "/dokter", icon: "dokter" },
  { label: "Tambah", href: "#action-menu", isButton: true },
  { label: "Jadwal", href: "/jadwal-dokter", icon: "jadwal-dokter" },
  { label: "Promo", href: "/promo", icon: "promo-kesehatan" },
];

const ITEM_COUNT = NAV_ITEMS.length;

// ---------------------------------------------------------------------------
// Konstanta layout & animasi
// ---------------------------------------------------------------------------

// Animasi hide / show dock saat scroll
const HIDE_MS = 320;
const HIDE_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const DOCK_HEIGHT = 64;
const PILL_WIDTH = 66;
const PILL_HEIGHT = 55;

const ICON_PAD = 2;
const DRAG_SCALE = 1.04;
const INNER_MARGIN = 4;

// Jari harus bergeser sejauh ini (px) sebelum gesture dianggap drag.
const DRAG_START_DISTANCE = 6;

// Scroll ke bawah: jarak (px) sebelum dock disembunyikan
const HIDE_THRESHOLD = 14;

// Scroll ke atas: cukup sedikit (px) dan dock langsung muncul lagi
const SHOW_THRESHOLD = 4;

// Di area atas halaman dock selalu tampil
const SCROLL_TOP_ZONE = 50;

// Ikon berubah putih saat pil berada < ICON_NEAR slot darinya,
// dan kembali hitam saat pil lebih jauh dari ICON_FAR slot.
const ICON_NEAR = 0.2;
const ICON_FAR = 0.75;

// Selisih (satuan slot) sebelum pil di awal drag dianggap sudah "menempel" jari
const CATCHUP_EPS = 0.02;

const DOCK_BACKGROUND = "#FFFFFF";
const DOCK_BORDER = "1px solid rgba(0, 0, 0, 0.06)";
const GLASS_SHADOW = "0 10px 26px -8px rgba(0, 0, 0, 0.14)";
const PILL_COLOR = "rgb(0, 63, 136)";
const MENU_GLASS_RADIUS = 24;

// Posisi pil dalam satuan "slot" (0 = menu pertama, 4 = menu terakhir).
const PILL_LEFT = `calc(${ICON_PAD}px + (100% - ${
  ICON_PAD * 2
}px) * ((var(--pill-pos, 0) + 0.5) / ${ITEM_COUNT}))`;

// Ikon SVG dipaksa hitam, lalu diputihkan sesuai --a (0 = hitam, 1 = putih)
const ICON_FILTER = "brightness(0) invert(var(--a, 0))";

// Spring pil saat pindah menu / dilepas setelah drag
const PILL_SPRING = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.6,
  restDelta: 0.0005,
  restSpeed: 0.01,
} as const;

// Di awal drag pil meluncur cepat ke bawah jari (tidak melompat)
const DRAG_CATCHUP_SPRING = {
  type: "spring",
  stiffness: 700,
  damping: 45,
  mass: 0.5,
  restDelta: 0.0005,
  restSpeed: 0.01,
} as const;

const MENU_EASE = [0.22, 1, 0.36, 1] as const;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ---------------------------------------------------------------------------
// Helper murni
// ---------------------------------------------------------------------------

function isRouteActive(href: string, path: string | null) {
  if (!path) return false;
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getSlot(width: number) {
  return (width - ICON_PAD * 2) / ITEM_COUNT;
}

function getIndexFromX(x: number, width: number) {
  return clamp(Math.floor((x - ICON_PAD) / getSlot(width)), 0, ITEM_COUNT - 1);
}

// Batas gerak pusat pil (px) agar tidak menembus tepi dock
function getBounds(width: number, dragging: boolean) {
  const pillW = Math.min(PILL_WIDTH, getSlot(width) - 2);
  const half = (pillW * (dragging ? DRAG_SCALE : 1)) / 2;

  return {
    minX: INNER_MARGIN + half,
    maxX: width - INNER_MARGIN - half,
  };
}

function clampX(x: number, width: number, dragging: boolean) {
  const { minX, maxX } = getBounds(width, dragging);
  return clamp(x, minX, maxX);
}

function getOverdragAmount(x: number, width: number, dragging: boolean) {
  const { minX, maxX } = getBounds(width, dragging);
  if (x < minX) return x - minX;
  if (x > maxX) return x - maxX;
  return 0;
}

// px (pusat pil) -> satuan slot
function xToPos(x: number, width: number) {
  return (x - ICON_PAD) / getSlot(width) - 0.5;
}

// ---------------------------------------------------------------------------
// Mount hook
// ---------------------------------------------------------------------------

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// ---------------------------------------------------------------------------
// Sub-komponen
// ---------------------------------------------------------------------------

// Lapisan background dock / menu
function GlassLayer({ radius }: { radius: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      style={{
        borderRadius: radius,
        backgroundColor: DOCK_BACKGROUND,
        border: DOCK_BORDER,
        boxShadow: "none",
        transform: "translate3d(0, 0, 0)",
      }}
    />
  );
}

// Gambar ikon dock
function DockImage({
  name,
  style,
}: {
  name: string;
  style?: React.CSSProperties;
}) {
  return (
    <Image
      src={`${ICON_DIR}/${name}.svg`}
      alt=""
      width={28}
      height={28}
      unoptimized
      loading="eager"
      draggable={false}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
      style={{ filter: ICON_FILTER, ...style }}
    />
  );
}

// Warna ikon dikendalikan variabel CSS --a (0..1) pada <li> induknya,
// yang diperbarui langsung dari posisi pil (lihat applyPos).
function NavIcon({ item }: { item: NavItem }) {
  if (!item.icon) return null;

  return (
    <span className="relative block h-7 w-7">
      <DockImage name={item.icon} />
    </span>
  );
}

// Ikon di menu aksi (hitam, mengikuti teks tombol)
function MenuIcon({ name }: { name: string }) {
  return (
    <Image
      src={`${ICON_DIR}/${name}.svg`}
      alt=""
      width={20}
      height={20}
      unoptimized
      loading="eager"
      draggable={false}
      aria-hidden="true"
      className="h-[20px] w-[20px] shrink-0 select-none object-contain"
      style={{ filter: "brightness(0)" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Komponen utama
// ---------------------------------------------------------------------------

export default function MobileBottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMounted = useIsMounted();
  const reduceMotion = useReducedMotion();

  // State

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // true = dock tersembunyi (scroll ke bawah)
  const [isHidden, setIsHidden] = useState(false);

  // Menu yang baru diketuk / dilepas (supaya menu langsung "aktif" sebelum
  // navigasi selesai). Dilepas otomatis saat pathname berubah.
  const [lock, setLock] = useState<number | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setLock(null);
    setIsActionMenuOpen(false);
  }

  // Refs

  const actionMenuRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const dragStartPos = useRef<{ x: number; y: number; time: number } | null>(
    null,
  );
  const plusPointerRef = useRef(false);
  const pointerXRef = useRef<number | null>(null);
  const lastSyncKeyRef = useRef<string | null>(null);
  const hiddenRef = useRef(false);
  const isDraggingRef = useRef(false);
  const catchUpRef = useRef(false);

  const animRef = useRef<{ stop: () => void } | null>(null);
  const targetRef = useRef(0);
  const initializedRef = useRef(false);

  // Scroll listener: turun = hide, naik sedikit = show (throttle rAF)

  useEffect(() => {
    if (!isMounted) return;

    let anchorY = window.scrollY;
    let rafId = 0;
    let ticking = false;

    const applyHidden = (value: boolean) => {
      if (hiddenRef.current !== value) {
        hiddenRef.current = value;
        setIsHidden(value);

        // Menu aksi ikut ditutup saat dock disembunyikan
        if (value) setIsActionMenuOpen(false);
      }
    };

    const update = () => {
      ticking = false;

      const maxY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const y = Math.min(Math.max(window.scrollY, 0), maxY);

      // Area atas halaman: selalu tampil
      if (y <= SCROLL_TOP_ZONE) {
        anchorY = y;
        applyHidden(false);
        return;
      }

      if (hiddenRef.current) {
        // Sedang hidden: scroll ke atas sedikit saja -> tampil
        if (y > anchorY) {
          anchorY = y;
        } else if (anchorY - y > SHOW_THRESHOLD) {
          anchorY = y;
          applyHidden(false);
        }
      } else if (y < anchorY) {
        anchorY = y;
      } else if (y - anchorY > HIDE_THRESHOLD) {
        // Sedang tampil: scroll ke bawah -> hide
        anchorY = y;
        applyHidden(true);
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

  // Satu-satunya sumber posisi pil (satuan slot, bisa pecahan saat drag).
  const pos = useMotionValue(0);

  const overdragVal = useMotionValue(0);

  const springOverdrag = useSpring(overdragVal, {
    stiffness: 320,
    damping: 20,
    mass: 0.8,
  });

  const dockTranslateX = useTransform(
    springOverdrag,
    [-100, 0, 100],
    [-2, 0, 2],
  );
  const dockScaleX = useTransform(
    springOverdrag,
    [-100, 0, 100],
    [1.04, 1, 1.04],
  );
  const dockSkewX = useTransform(springOverdrag, [-100, 0, 100], [-2, 0, 2]);

  // Menu aktif

  const activeIndex = (() => {
    const idx = NAV_ITEMS.findIndex(
      (item) => !item.isButton && isRouteActive(item.href, pathname),
    );
    return idx !== -1 ? idx : 0;
  })();

  const committedIndex = lock ?? activeIndex;

  const dockRadius = DOCK_HEIGHT / 2;

  // Di layar sempit pil tidak boleh lebih lebar dari kolomnya
  const pillWidth = `min(${PILL_WIDTH}px, calc((100% - ${
    ICON_PAD * 2
  }px) / ${ITEM_COUNT} - 2px))`;

  // Terapkan posisi pil ke DOM: posisi pil + warna/skala tiap ikon.
  // Dipanggil setiap nilai `pos` berubah (tanpa re-render React).
  const applyPos = useCallback((raw: number) => {
    const root = contentRef.current;
    if (!root) return;

    // Klem agar overshoot spring tidak pernah keluar dari dock
    const p = clamp(raw, 0, ITEM_COUNT - 1);

    root.style.setProperty("--pill-pos", p.toFixed(4));

    const items = itemRefs.current;

    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      if (!el) continue;

      const a = clamp(
        (ICON_FAR - Math.abs(p - i)) / (ICON_FAR - ICON_NEAR),
        0,
        1,
      );

      el.style.setProperty("--a", a.toFixed(3));
      el.style.transform = `scale(${(1 - 0.08 * a).toFixed(3)})`;
    }
  }, []);

  useIsoLayoutEffect(() => {
    if (!isMounted) return;

    applyPos(pos.get());

    return pos.on("change", applyPos);
  }, [isMounted, pos, applyPos]);

  // Animasikan pil ke menu tertentu dari posisinya saat ini
  const moveTo = useCallback(
    (index: number) => {
      targetRef.current = index;

      animRef.current?.stop();

      if (reduceMotion) {
        animRef.current = null;
        pos.set(index);
        return;
      }

      animRef.current = animate(pos, index, PILL_SPRING);
    },
    [pos, reduceMotion],
  );

  // Menu aktif berubah karena alasan lain (tombol back, link lain, dll.)
  useIsoLayoutEffect(() => {
    if (!isMounted) return;

    // Tampil pertama kali: langsung di posisi aktif, tanpa animasi
    if (!initializedRef.current) {
      initializedRef.current = true;
      targetRef.current = committedIndex;
      pos.set(committedIndex);
      return;
    }

    if (isDraggingRef.current) return;

    if (targetRef.current !== committedIndex) {
      moveTo(committedIndex);
    }
  }, [isMounted, committedIndex, moveTo, pos]);

  useEffect(() => {
    return () => {
      animRef.current?.stop();
    };
  }, []);

  // Sinkronkan pil dengan posisi jari saat drag.
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

    const target = xToPos(clampX(mouseX, realWidth, true), realWidth);

    if (catchUpRef.current && Math.abs(target - pos.get()) > CATCHUP_EPS) {
      // awal drag: pil meluncur cepat ke bawah jari (tidak melompat)
      animRef.current?.stop();
      animRef.current = animate(pos, target, DRAG_CATCHUP_SPRING);
    } else {
      catchUpRef.current = false;
      animRef.current?.stop();
      animRef.current = null;
      pos.set(target);
    }

    // Tarik dockbar secara elastis saat melebihi batas
    overdragVal.set(getOverdragAmount(mouseX, realWidth, true));
  }, [overdragVal, pos]);

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

  const startDrag = () => {
    isDraggingRef.current = true;
    catchUpRef.current = true;
    lastSyncKeyRef.current = null;

    animRef.current?.stop();
    animRef.current = null;

    setIsDragging(true);
  };

  const endDrag = () => {
    isDraggingRef.current = false;
    catchUpRef.current = false;
    pointerXRef.current = null;

    setIsDragging(false);
  };

  // Navigasi ke menu (satu pintu untuk ketuk, lepas drag, dan keyboard)
  const goTo = (index: number, scrollIfSame: boolean) => {
    const item = NAV_ITEMS[index];

    if (item.isButton) return;

    if (item.href === pathname) {
      // Halaman yang sama: pil kembali ke menu aktif, ketuk cepat -> ke atas
      setLock(null);
      moveTo(index);

      if (scrollIfSame) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      return;
    }

    setLock(index);
    moveTo(index);
    router.push(item.href);
  };

  // Pointer handlers

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.closest("[data-plus-button]")) return;

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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (plusPointerRef.current || !dragStartPos.current || !dockRef.current) {
      return;
    }

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

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (plusPointerRef.current) return;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const start = dragStartPos.current;
    const dock = dockRef.current;

    dragStartPos.current = null;

    endDrag();
    overdragVal.set(0);

    if (!dock || !start) {
      moveTo(committedIndex);
      return;
    }

    const rect = dock.getBoundingClientRect();
    const realWidth = dock.offsetWidth || rect.width;
    const scaleFactor = rect.width / realWidth || 1;

    const x = clampX((e.clientX - rect.left) / scaleFactor, realWidth, false);
    const targetIndex = getIndexFromX(x, realWidth);

    const isQuickTap =
      Date.now() - start.time < 180 &&
      Math.abs(e.clientX - start.x) < 8 &&
      Math.abs(e.clientY - start.y) < 8;

    if (NAV_ITEMS[targetIndex].isButton) {
      // Dilepas di atas tombol plus: buka/tutup menu, pil kembali ke menu aktif
      moveTo(committedIndex);
      setIsActionMenuOpen((prev) => !prev);
      return;
    }

    goTo(targetIndex, isQuickTap);
  };

  // Gesture dibatalkan (mis. diambil alih browser): jangan navigasi
  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (plusPointerRef.current) return;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    dragStartPos.current = null;

    endDrag();
    overdragVal.set(0);
    moveTo(committedIndex);
  };

  // Tutup menu aksi saat klik di luar

  const handleOutsideClick = useCallback((event: PointerEvent) => {
    const target = event.target as Node;

    if (plusButtonRef.current?.contains(target)) return;

    if (actionMenuRef.current && !actionMenuRef.current.contains(target)) {
      setIsActionMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isActionMenuOpen) return;

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isActionMenuOpen, handleOutsideClick]);

  if (!isMounted) return null;

  const menuButtonClass =
    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-black outline-none transition-colors hover:bg-black/5 active:bg-black/10";

  return (
    <>
      {/* Modal booking */}
      <BookingModalFloating
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <div className="relative min-h-0 w-full">
        {/* Wrapper fixed: geser ke bawah saat hidden, kembali ke 0 saat show */}
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[99] flex flex-col items-center justify-end pb-6"
          style={{
            transform: isHidden ? "translateY(130%)" : "translateY(0)",
            transition: reduceMotion
              ? "none"
              : `transform ${HIDE_MS}ms ${HIDE_EASE}`,
            willChange: "transform",
          }}
        >
          <nav
            aria-label="Navigasi Bawah Seluler"
            className="flex w-full select-none flex-col items-center px-4 lg:hidden"
          >
            {/* Action menu: naik dari bawah dengan halus */}
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
                  {/* Shadow menu */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                      borderRadius: MENU_GLASS_RADIUS,
                      boxShadow: GLASS_SHADOW,
                    }}
                  />

                  <GlassLayer radius={MENU_GLASS_RADIUS} />

                  <div className="relative z-10 flex w-full flex-col">
                    {/* Button: buat janji temu */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsActionMenuOpen(false);
                        setIsBookingOpen(true);
                      }}
                      className={menuButtonClass}
                    >
                      <MenuIcon name="note" />
                      <span>Buat Janji Temu</span>
                    </button>

                    <div className="my-1 h-px w-full bg-black/10" />

                    {/* Button: kamar perawatan */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsActionMenuOpen(false);
                        router.push("/services/kamar-perawatan");
                      }}
                      className={menuButtonClass}
                    >
                      <MenuIcon name="bed" />
                      <span>Kamar Perawatan</span>
                    </button>

                    <div className="my-1 h-px w-full bg-black/10" />

                    {/* Button: ketersediaan kamar */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsActionMenuOpen(false);
                        router.push("/ketersediaan-kamar");
                      }}
                      className={menuButtonClass}
                    >
                      <MenuIcon name="bed" />
                      <span>Ketersediaan Kamar</span>
                    </button>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Dock dengan elastisitas saat overdrag */}
            <motion.div
              ref={dockRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onContextMenu={(e) => e.preventDefault()}
              className="pointer-events-auto relative flex w-full max-w-[390px] cursor-grab touch-none select-none items-center active:cursor-grabbing"
              style={{
                height: DOCK_HEIGHT,
                borderRadius: dockRadius,
                x: dockTranslateX,
                scaleX: dockScaleX,
                skewX: dockSkewX,
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
              }}
            >
              {/* Shadow dock */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  borderRadius: dockRadius,
                  boxShadow: GLASS_SHADOW,
                }}
              />

              <GlassLayer radius={dockRadius} />

              {/* Konten dock. Variabel --pill-pos diisi dari `pos` (applyPos). */}
              <div ref={contentRef} className="absolute inset-0 z-10">
                {/* Pil aktif: left = persen lebar dock (CSS) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 z-10"
                  style={{
                    left: PILL_LEFT,
                    width: pillWidth,
                    height: PILL_HEIGHT,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    className="h-full w-full rounded-full"
                    animate={{ scale: isDragging ? DRAG_SCALE : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{ backgroundColor: PILL_COLOR }}
                  />
                </div>

                {/* Daftar menu */}
                <menu
                  className="relative z-20 m-0 box-border flex h-full w-full list-none items-center justify-between p-0"
                  style={{ paddingInline: ICON_PAD }}
                >
                  {NAV_ITEMS.map((item, i) => (
                    <li
                      key={item.href}
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      className="flex h-full flex-1 items-center justify-center"
                    >
                      {item.isButton ? (
                        // Button: tambah (plus)
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
                              filter: ICON_FILTER,
                              transform: isActionMenuOpen
                                ? "rotate(45deg)"
                                : "rotate(0deg)",
                              transition: "transform 200ms ease",
                            }}
                          />
                        </button>
                      ) : (
                        // Link menu
                        <Link
                          href={item.href}
                          aria-label={item.label}
                          aria-current={
                            i === committedIndex ? "page" : undefined
                          }
                          data-no-drag
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          onClick={(e) => {
                            // Navigasi pointer sudah ditangani handlePointerUp.
                            // Klik dari keyboard (Enter/Spasi) punya detail === 0.
                            e.preventDefault();

                            if (e.detail === 0) {
                              goTo(i, true);
                            }
                          }}
                          className="flex h-12 w-12 select-none items-center justify-center rounded-full outline-none"
                          style={{
                            WebkitTapHighlightColor: "transparent",
                            touchAction: "none",
                            WebkitTouchCallout: "none",
                            WebkitUserSelect: "none",
                          }}
                        >
                          <NavIcon item={item} />
                        </Link>
                      )}
                    </li>
                  ))}
                </menu>
              </div>
            </motion.div>
          </nav>
        </div>
      </div>
    </>
  );
}
