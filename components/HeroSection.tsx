"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchHeroBanners } from "@/lib/api";
import { HeroBanner } from "@/lib/types";
import { ChevronRight } from "lucide-react";

// Import komponen terpisah
import { Announcement } from "./Announcement";
import { DesktopSearchBar } from "./DesktopSearchBar";

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

  @keyframes heroAnnouncementMarquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .hero-announcement-track {
    display: flex;
    width: max-content;
    animation: heroAnnouncementMarquee 32s linear infinite;
    will-change: transform;
  }

  .hero-announcement:hover .hero-announcement-track,
  .hero-announcement:focus-within .hero-announcement-track {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-announcement-track { animation: none; transform: none; }
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = customStyles;
  if (!document.head.querySelector("style[data-custom-hero]")) {
    style.dataset.customHero = "true";
    document.head.appendChild(style);
  }
}

export const HeroSection = () => {
  const [slides, setSlides] = useState<HeroBanner[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [currentDeviceType, setCurrentDeviceType] = useState<
    "desktop" | "mobile"
  >("desktop");
  const [loadedSlides, setLoadedSlides] = useState<Record<string, boolean>>({});

  const prevSlidesRef = useRef<string>("");
  const deviceTypeRef = useRef<"desktop" | "mobile">("desktop");

  // Search state
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [day, setDay] = useState("");
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  const [animKey, setAnimKey] = useState(0);

  const specialtyRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

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

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        specialtyRef.current &&
        !specialtyRef.current.contains(event.target as Node)
      ) {
        setIsSpecialtyOpen(false);
      }
      if (dayRef.current && !dayRef.current.contains(event.target as Node)) {
        setIsDayOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Banners
  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true);
        const isMobileDevice =
          typeof globalThis !== "undefined" &&
          globalThis.window?.innerWidth !== undefined &&
          globalThis.window.innerWidth <= 768;

        const deviceType = isMobileDevice ? "mobile" : "desktop";
        setCurrentDeviceType(deviceType);

        const banners = await fetchHeroBanners(deviceType);
        if (banners && banners.length > 0) {
          setSlides(banners);
        } else {
          setSlides([]);
        }
      } catch (error) {
        console.error("[HeroSection] Error loading hero banners:", error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    let resizeTimeout: NodeJS.Timeout | null = null;
    let isFirstLoad = true;

    const loadWithDebounce = () => {
      if (isFirstLoad) {
        loadBanners();
        isFirstLoad = false;
      } else {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          loadBanners();
        }, 300);
      }
    };

    loadWithDebounce();

    const handleResize = () => {
      const nextDeviceType =
        globalThis.window?.innerWidth !== undefined &&
        globalThis.window.innerWidth <= 768
          ? "mobile"
          : "desktop";

      if (nextDeviceType !== deviceTypeRef.current) {
        setLoading(true);
      }
      loadWithDebounce();
    };

    globalThis.window?.addEventListener("resize", handleResize);

    return () => {
      globalThis.window?.removeEventListener("resize", handleResize);
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
    }, 5000);

    return () => clearInterval(timer);
  }, [paginate, activeSlides.length]);

  const handleImageLoaded = (id?: string | number) => {
    if (id === undefined || id === null) return;
    setLoadedSlides((prev) => ({ ...prev, [String(id)]: true }));
  };

  const handleImageError = (id?: string | number) => {
    if (id === undefined || id === null) return;
    setLoadedSlides((prev) => ({ ...prev, [String(id)]: true }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (specialty && specialty !== "Semua Spesialis")
      params.append("specialty", specialty);
    if (day && day !== "Semua Hari") params.append("day", day);

    if (globalThis.window?.location) {
      globalThis.window.location.href = `/dokter?${params.toString()}`;
    }
  };

  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="relative isolate w-full bg-transparent mb-12 md:mb-24 z-30">
      {/* Pengumuman informasi rumah sakit */}
      <Announcement
        isVisible={isAnnouncementVisible}
        onClose={() => setIsAnnouncementVisible(false)}
      />

      {/* Banner desktop */}
      <section
        aria-label="Hero banner carousel"
        className="hidden md:block relative w-full aspect-[1600/620] bg-black overflow-hidden"
        aria-busy={loading}
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
              const key = String(slide.id);
              const isLoaded = !!loadedSlides[key];
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
                  <img
                    src={slide.image_url}
                    alt={`Slide ${index}`}
                    onLoad={() => handleImageLoaded(slide.id)}
                    onError={() => handleImageError(slide.id)}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              );
            })}

            {activeSlides.length > 1 && (
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
                      r={radius}
                      className="stroke-white/30"
                      strokeWidth="2.5"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r={radius}
                      className="stroke-white animate-circle-progress"
                      strokeWidth="2.5"
                      strokeDasharray={circumference}
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
        className="md:hidden relative w-full aspect-2208/2760 bg-black overflow-hidden"
        aria-busy={loading}
      >
        {loading && (
          <div
            className="absolute inset-0 z-30 skeleton-shimmer"
            aria-hidden="true"
          />
        )}

        {activeSlides.map((slide, index) => {
          const key = String(slide.id);
          const isLoaded = !!loadedSlides[key];

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
              <img
                src={slide.image_url}
                alt={`Slide ${index}`}
                onLoad={() => handleImageLoaded(slide.id)}
                onError={() => handleImageError(slide.id)}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          );
        })}

        {activeSlides.length > 1 && (
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
                  r={18}
                  className="stroke-white/30"
                  strokeWidth="2"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r={18}
                  className="stroke-white animate-circle-progress-mobile"
                  strokeWidth="2"
                  strokeDasharray={113.1}
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
