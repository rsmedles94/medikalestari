"use client";

import Link from "next/link";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Search,
  User,
  Stethoscope,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { fetchHeroBanners } from "@/lib/api";
import { HeroBanner } from "@/lib/types";

interface DesktopChevronButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  isHovering: boolean;
}

const DesktopChevronButton: React.FC<DesktopChevronButtonProps> = ({
  direction,
  onClick,
  disabled,
  isHovering,
}) => {
  const isLeft = direction === "left";
  const isDisabled = disabled;
  const shouldShow = !isDisabled && isHovering;
  const baseOpacity = isDisabled ? "opacity-0 cursor-not-allowed" : "opacity-0";
  const hoverOpacity = shouldShow
    ? "opacity-70 hover:opacity-100 cursor-pointer"
    : baseOpacity;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${isLeft ? "Previous" : "Next"} slide`}
      className={`absolute ${isLeft ? "left-6" : "right-6"} top-1/2 -translate-y-1/2 z-40 p-2 bg-black/50 backdrop-blur transition-all duration-300 rounded-[45px] ${hoverOpacity}`}
    >
      {isLeft ? (
        <ChevronLeft size={20} className="text-white" />
      ) : (
        <ChevronRight size={20} className="text-white" />
      )}
    </button>
  );
};

// Shimmer Animation Style
const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  .skeleton-shimmer {
    background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = shimmerStyle;
  if (!document.head.querySelector("style[data-shimmer]")) {
    style.dataset.shimmer = "true";
    document.head.appendChild(style);
  }
}

const HeroSection = () => {
  const [slides, setSlides] = useState<HeroBanner[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentDeviceType, setCurrentDeviceType] = useState<
    "desktop" | "mobile"
  >("desktop");
  const [loadedSlides, setLoadedSlides] = useState<Record<string, boolean>>({});
  const prevSlidesRef = useRef<string>("");

  // Search state
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [day, setDay] = useState("");
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  // Refs untuk klik di luar dropdown (Close on click outside)
  const specialtyRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  // Banner hover state
  const [isHoveringBanner, setIsHoveringBanner] = useState(false);

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

  // Click outside listener untuk menutup dropdown
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

    const handleResize = () => loadWithDebounce();
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

  // Filter slides
  const desktopSlides = slides.filter(
    (slide) => slide.device_type === "desktop",
  );
  const mobileSlides = slides.filter((slide) => slide.device_type === "mobile");
  const filteredSlides =
    currentDeviceType === "desktop" ? desktopSlides : mobileSlides;

  const validSlideCount = filteredSlides.length > 0 ? filteredSlides.length : 1;
  const currentSlide = Math.abs(page) % validSlideCount;

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(page + newDirection);
    },
    [page],
  );

  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (filteredSlides.length > 0) {
      slideInterval = setInterval(() => paginate(1), 5000);
    }
    return () => clearInterval(slideInterval);
  }, [paginate, filteredSlides.length]);

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

  return (
    <section className="relative w-full bg-transparent mb-12 md:mb-24">
      {/* Banner desktop */}
      <section
        aria-label="Hero banner carousel"
        className="hidden md:block relative w-full aspect-[1900/720] bg-black"
        onMouseEnter={() => setIsHoveringBanner(true)}
        onMouseLeave={() => setIsHoveringBanner(false)}
      >
        {desktopSlides.length > 0 ? (
          <>
            {desktopSlides.map((slide, index) => {
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

            <DesktopChevronButton
              direction="left"
              onClick={() => paginate(-1)}
              disabled={desktopSlides.length <= 1}
              isHovering={isHoveringBanner}
            />
            <DesktopChevronButton
              direction="right"
              onClick={() => paginate(1)}
              disabled={desktopSlides.length <= 1}
              isHovering={isHoveringBanner}
            />

            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1">
              {desktopSlides.map((slide) => (
                <button
                  type="button"
                  key={`indicator-${slide.id}`}
                  onClick={() => {
                    const index = desktopSlides.findIndex(
                      (s) => s.id === slide.id,
                    );
                    setPage(index);
                  }}
                  className={`h-1 transition-all duration-300 ${
                    desktopSlides.findIndex((s) => s.id === slide.id) ===
                    currentSlide
                      ? "bg-white/40 w-10"
                      : "bg-white bg-opacity-50 w-10"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
            <p className="text-gray-500">No desktop banner available</p>
          </div>
        )}
      </section>

      {/* Banner mobile */}
      <div className="md:hidden relative w-full aspect-2208/2760 bg-black">
        {mobileSlides.map((slide, index) => {
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
      </div>

      {/* Desktop Searchbar - Custom Dropdown Presisi */}
      <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-full max-w-5xl px-4">
        <section className="bg-white p-6 md:p-8 rounded-md border border-gray-100 w-full">
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-[#003f88]">
              Temukan Dokter
            </h2>
          </header>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-row items-center gap-3"
          >
            {/* Input Nama Dokter */}
            <div className="flex-1 h-[52px] border border-gray-300 rounded-md px-4 flex items-center gap-3 bg-white focus-within:border-[#003f88] focus-within:ring-1 focus-within:ring-[#003f88]/20 transition-all">
              <User size={20} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari nama dokter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full outline-none text-sm md:text-base text-gray-800 placeholder-gray-400 bg-transparent"
              />
            </div>

            {/* Custom Dropdown Spesialis */}
            <div ref={specialtyRef} className="flex-1 relative">
              <button
                type="button"
                onClick={() => {
                  setIsSpecialtyOpen(!isSpecialtyOpen);
                  setIsDayOpen(false);
                }}
                className={`w-full h-[52px] border rounded-md px-4 flex items-center justify-between bg-white text-left transition-all ${
                  isSpecialtyOpen
                    ? "border-[#003f88] ring-1 ring-[#003f88]/20"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <Stethoscope size={20} className="text-gray-400 shrink-0" />
                  <span className="text-sm md:text-base text-gray-800 truncate">
                    {specialty || "Semua Spesialis"}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                    isSpecialtyOpen ? "rotate-180 text-[#003f88]" : ""
                  }`}
                />
              </button>

              {/* Menu Opsi Custom Spesialis */}
              {isSpecialtyOpen && (
                <div
                  data-lenis-prevent
                  className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto py-1"
                >
                  {SPECIALTY_CATEGORIES.map((s) => {
                    const isSelected =
                      specialty === s ||
                      (!specialty && s === "Semua Spesialis");
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSpecialty(s === "Semua Spesialis" ? "" : s);
                          setIsSpecialtyOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          isSelected
                            ? "bg-[#003f88] text-white font-medium"
                            : "text-gray-700 hover:bg-blue-50 hover:text-[#003f88]"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom Dropdown Hari */}
            <div ref={dayRef} className="flex-1 relative">
              <button
                type="button"
                onClick={() => {
                  setIsDayOpen(!isDayOpen);
                  setIsSpecialtyOpen(false);
                }}
                className={`w-full h-[52px] border rounded-md px-4 flex items-center justify-between bg-white text-left transition-all ${
                  isDayOpen
                    ? "border-[#003f88] ring-1 ring-[#003f88]/20"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <CalendarDays size={20} className="text-gray-400 shrink-0" />
                  <span className="text-sm md:text-base text-gray-800 truncate">
                    {day || "Semua Hari"}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                    isDayOpen ? "rotate-180 text-[#003f88]" : ""
                  }`}
                />
              </button>

              {/* Menu Opsi Custom Hari */}
              {isDayOpen && (
                <div
                  data-lenis-prevent
                  className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto py-1"
                >
                  {DAYS.map((d) => {
                    const isSelected =
                      day === d || (!day && d === "Semua Hari");
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setDay(d === "Semua Hari" ? "" : d);
                          setIsDayOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          isSelected
                            ? "bg-[#003f88] text-white font-medium"
                            : "text-gray-700 hover:bg-blue-50 hover:text-[#003f88]"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tombol Search */}
            <button
              type="submit"
              className="h-[52px] px-8 rounded-md bg-[#003f88] hover:bg-[#002f66] text-white font-semibold text-base transition-colors cursor-pointer shrink-0 flex items-center justify-center active:scale-95"
            >
              Search
            </button>
          </form>
        </section>
      </div>
    </section>
  );
};

export default HeroSection;
