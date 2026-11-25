"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { fetchHeroBanners } from "@/lib/api";
import { HeroBanner } from "@/lib/types";
import { ChevronRight } from "lucide-react";

// Import komponen terpisah
import { DesktopSearchBar } from "./DesktopSearchBar";

type DeviceType = "desktop" | "mobile";
type SlideId = string | number;

const MOBILE_BREAKPOINT = 768;
const SLIDE_INTERVAL_MS = 5000;
const RESIZE_DEBOUNCE_MS = 300;

const DESKTOP_RING_RADIUS = 26;
const DESKTOP_RING_CIRCUMFERENCE = 2 * Math.PI * DESKTOP_RING_RADIUS;
const MOBILE_RING_RADIUS = 18;
const MOBILE_RING_CIRCUMFERENCE = 113.1;

const SPECIALTY_CATEGORIES = [
  "Semua Spesialis",
  "Spesialis Penyakit Dalam",
  "Spesialis Bedah Umum",
  "Spesialis Saraf",
  "Spesialis Orthopedi",
  "Spesialis Paru",
  "Spesialis Jantung & Pembuluh Darah",
  "Spesialis THT",
  "Spesialis Anak",
  "Spesialis Mata",
  "Spesialis Obgyn",
  "Spesialis Gigi",
  "Spesialis Fisioterapi",
];

const DAYS = [
  "Semua Hari",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

// Shimmer Animation & Circular Loader Keyframes
const customStyles = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  .skeleton-shimmer {
    background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  @keyframes circleProgress {
    0% { stroke-dashoffset: 163.36; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes circleProgressMobile {
    0% { stroke-dashoffset: 113.1; }
    100% { stroke-dashoffset: 0; }
  }

  .animate-circle-progress {
    animation: circleProgress 5s linear infinite;
  }

  .animate-circle-progress-mobile {
    animation: circleProgressMobile 5s linear infinite;
  }
`;

if (
  typeof document !== "undefined" &&
  !document.head.querySelector("style[data-custom-hero]")
) {
  const style = document.createElement("style");
  style.textContent = customStyles;
  style.dataset.customHero = "true";
  document.head.appendChild(style);
}

const getDeviceType = (): DeviceType =>
  window.innerWidth <= MOBILE_BREAKPOINT ? "mobile" : "desktop";

// Mencegah menu klik kanan (Save image as...) pada area banner
const preventContextMenu = (event: React.MouseEvent) => event.preventDefault();

export const HeroSection = () => {
  const [slides, setSlides] = useState<HeroBanner[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentDeviceType, setCurrentDeviceType] =
    useState<DeviceType>("desktop");
  const [loadedSlides, setLoadedSlides] = useState<Record<string, boolean>>({});

  const prevSlidesRef = useRef<string>("");
  const deviceTypeRef = useRef<DeviceType>("desktop");

  // Search state
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [day, setDay] = useState("");
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  const [animKey, setAnimKey] = useState(0);

  const specialtyRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (specialtyRef.current && !specialtyRef.current.contains(target)) {
        setIsSpecialtyOpen(false);
      }
      if (dayRef.current && !dayRef.current.contains(target)) {
        setIsDayOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Banners
  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const loadBanners = async () => {
      try {
        setLoading(true);

        const deviceType = getDeviceType();
        deviceTypeRef.current = deviceType;
        setCurrentDeviceType(deviceType);

        const banners = await fetchHeroBanners(deviceType);
        setSlides(banners && banners.length > 0 ? banners : []);
      } catch (error) {
        console.error("[HeroSection] Error loading hero banners:", error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    const handleResize = () => {
      // Banner hanya perlu dimuat ulang saat tipe perangkat berubah
      if (getDeviceType() === deviceTypeRef.current) return;

      setLoading(true);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(loadBanners, RESIZE_DEBOUNCE_MS);
    };

    loadBanners();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  // Sync loaded states
  useEffect(() => {
    const currentSlidesJson = JSON.stringify(slides.map((s) => s.id));

    if (prevSlidesRef.current !== currentSlidesJson) {
      prevSlidesRef.current = currentSlidesJson;
      const existingIds = new Set(slides.map((s) => String(s.id)));

      setLoadedSlides((prev) => {
        const updated: Record<string, boolean> = {};
        Object.entries(prev).forEach(([id, loaded]) => {
          if (existingIds.has(id)) updated[id] = loaded;
        });
        return updated;
      });
    }
  }, [slides]);

  const activeSlides = slides;
  const hasMultipleSlides = activeSlides.length > 1;
  const validSlideCount = activeSlides.length > 0 ? activeSlides.length : 1;
  const currentSlide = Math.abs(page) % validSlideCount;

  const paginate = useCallback((newDirection: number) => {
    setPage((prevPage) => prevPage + newDirection);
    setAnimKey((prev) => prev + 1);
  }, []);

  // Timer Pindah Slide Otomatis
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [paginate, activeSlides.length]);

  // Dipanggil saat gambar selesai dimuat maupun gagal dimuat
  const handleSlideLoaded = (id: SlideId) => {
    setLoadedSlides((prev) => ({ ...prev, [String(id)]: true }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (specialty && specialty !== "Semua Spesialis")
      params.append("specialty", specialty);
    if (day && day !== "Semua Hari") params.append("day", day);

    window.location.href = `/dokter?${params.toString()}`;
  };

  return (
    <section className="relative isolate w-full bg-transparent mb-12 md:mb-24 z-30">
      {/* Banner desktop */}
      <section
        aria-label="Hero banner carousel"
        className="hidden md:block relative w-full aspect-[1600/620] bg-black overflow-hidden select-none"
        aria-busy={loading}
        onContextMenu={preventContextMenu}
      >
        {loading && (
          <div
            className="absolute inset-0 z-30 skeleton-shimmer"
            aria-hidden="true"
          />
        )}

        {activeSlides.length > 0 ? (
          <>
            {activeSlides.map((slide, index) => {
              const isLoaded = !!loadedSlides[String(slide.id)];
              const isActive = index === currentSlide;

              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  {!isLoaded && (
                    <div className="absolute inset-0 skeleton-shimmer" />
                  )}
                  <Image
                    src={slide.image_url}
                    alt={`Slide ${index + 1}`}
                    fill
                    sizes="100vw"
                    quality={85}
                    priority={index === 0 && currentDeviceType === "desktop"}
                    draggable={false}
                    onLoad={() => handleSlideLoaded(slide.id)}
                    onError={() => handleSlideLoaded(slide.id)}
                    className={`object-cover object-center transition-opacity duration-700 pointer-events-none select-none ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              );
            })}

            {hasMultipleSlides && (
              <div className="absolute left-8 bottom-16 z-40">
                {/* button */}
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  aria-label="Next slide"
                  className="relative flex items-center justify-center w-16 h-16 bg-transparent transition-transform duration-200 active:scale-95 focus:outline-none group cursor-pointer"
                >
                  <svg
                    key={`desktop-ring-${animKey}`}
                    className="absolute inset-0 w-full h-full pointer-events-none -rotate-90"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r={DESKTOP_RING_RADIUS}
                      className="stroke-white/30"
                      strokeWidth="2.5"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r={DESKTOP_RING_RADIUS}
                      className="stroke-white animate-circle-progress"
                      strokeWidth="2.5"
                      strokeDasharray={DESKTOP_RING_CIRCUMFERENCE}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <ChevronRight
                    size={28}
                    className="text-white relative z-10 drop-shadow-md group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
            <p className="text-gray-500">
              {loading ? "" : "No banner available"}
            </p>
          </div>
        )}
      </section>

      {/* Banner mobile */}
      <div
        className="md:hidden relative w-full aspect-2208/2760 bg-black overflow-hidden select-none"
        aria-busy={loading}
        onContextMenu={preventContextMenu}
      >
        {loading && (
          <div
            className="absolute inset-0 z-30 skeleton-shimmer"
            aria-hidden="true"
          />
        )}

        {activeSlides.map((slide, index) => {
          const isLoaded = !!loadedSlides[String(slide.id)];

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {!isLoaded && (
                <div className="absolute inset-0 skeleton-shimmer" />
              )}
              <Image
                src={slide.image_url}
                alt={`Slide ${index + 1}`}
                fill
                sizes="100vw"
                quality={85}
                priority={index === 0 && currentDeviceType === "mobile"}
                draggable={false}
                onLoad={() => handleSlideLoaded(slide.id)}
                onError={() => handleSlideLoaded(slide.id)}
                className={`object-cover object-center transition-opacity duration-700 pointer-events-none select-none ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          );
        })}

        {hasMultipleSlides && (
          <div className="absolute left-4 bottom-4 z-40">
            {/* button */}
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next slide"
              className="relative flex items-center justify-center w-12 h-12 bg-transparent transition-transform duration-200 active:scale-95 focus:outline-none group cursor-pointer"
            >
              <svg
                key={`mobile-ring-${animKey}`}
                className="absolute inset-0 w-full h-full pointer-events-none -rotate-90"
              >
                <circle
                  cx="24"
                  cy="24"
                  r={MOBILE_RING_RADIUS}
                  className="stroke-white/30"
                  strokeWidth="2"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r={MOBILE_RING_RADIUS}
                  className="stroke-white animate-circle-progress-mobile"
                  strokeWidth="2"
                  strokeDasharray={MOBILE_RING_CIRCUMFERENCE}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <ChevronRight
                size={22}
                className="text-white relative z-10 drop-shadow-md group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </div>
        )}
      </div>

      {/* Desktop Searchbar */}
      <DesktopSearchBar
        search={search}
        setSearch={setSearch}
        specialty={specialty}
        setSpecialty={setSpecialty}
        day={day}
        setDay={setDay}
        isSpecialtyOpen={isSpecialtyOpen}
        setIsSpecialtyOpen={setIsSpecialtyOpen}
        isDayOpen={isDayOpen}
        setIsDayOpen={setIsDayOpen}
        specialtyRef={specialtyRef}
        dayRef={dayRef}
        SPECIALTY_CATEGORIES={SPECIALTY_CATEGORIES}
        DAYS={DAYS}
        handleSearchSubmit={handleSearchSubmit}
      />
    </section>
  );
};

export default HeroSection;
