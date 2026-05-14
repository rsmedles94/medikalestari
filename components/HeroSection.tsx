"use client";
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

// Desktop Chevron Button Component
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
      onClick={onClick}
      disabled={disabled}
      aria-label={`${isLeft ? "Previous" : "Next"} slide`}
      className={`absolute ${isLeft ? "-left-2" : "-right-2"} top-1/2 -translate-y-1/2 z-40 p-2 bg-black/40 backdrop-blur transition-all duration-300 ${hoverOpacity}`}
    >
      {isLeft ? (
        <ChevronLeft size={30} className="text-white" />
      ) : (
        <ChevronRight size={30} className="text-white" />
      )}
    </button>
  );
};

// Shimmer gradient animation untuk skeleton loading
const shimmerStyle = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      #f3f4f6 0%,
      #e5e7eb 50%,
      #f3f4f6 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
`;

// Inject style ke dalam dokumen
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
  // track which slide images have finished loading (by id)
  const [loadedSlides, setLoadedSlides] = useState<Record<string, boolean>>({});
  // Keep reference to current slides to check for actual changes
  const prevSlidesRef = useRef<string>("");

  // SEARCH STATE
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [day, setDay] = useState("");
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  // BANNER HOVER STATE
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

  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true);

        // Determine if we're on mobile based on window width
        const isMobileDevice =
          typeof globalThis !== "undefined" &&
          globalThis.window?.innerWidth !== undefined &&
          globalThis.window.innerWidth <= 768;

        // Set device type and fetch appropriate banners
        const deviceType = isMobileDevice ? "mobile" : "desktop";
        setCurrentDeviceType(deviceType);

        console.log(`[HeroSection] 🔄 Loading ${deviceType} banners...`);
        console.log("[HeroSection] Environment check:", {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? "SET"
            : "MISSING",
        });

        const banners = await fetchHeroBanners(deviceType);

        // Only set slides if banners exist, otherwise keep empty
        if (banners && banners.length > 0) {
          console.log(
            `[HeroSection] ✅ Loaded ${banners.length} ${deviceType} banners`,
            banners.map((b) => ({ id: b.id, url: b.image_url })),
          );
          setSlides(banners);
        } else {
          console.warn(
            `[HeroSection] ⚠️ No ${deviceType} banners found. Checklist:
            1. ✓ hero_banners table exists in Supabase
            2. ✓ is_active = true for ${deviceType} banners
            3. ✓ At least one ${deviceType} banner exists
            4. ✓ NEXT_PUBLIC_SUPABASE_URL is set
            5. ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY is set`,
          );
          setSlides([]);
        }
      } catch (error) {
        console.error("[HeroSection] ❌ Error loading hero banners:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial load with debounce
    let resizeTimeout: NodeJS.Timeout | null = null;
    let isFirstLoad = true;

    const loadWithDebounce = () => {
      if (isFirstLoad) {
        loadBanners();
        isFirstLoad = false;
      } else {
        // Debounce subsequent loads (resize events)
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
          loadBanners();
        }, 300);
      }
    };

    // Initial load
    loadWithDebounce();

    // Handle window resize to switch between desktop and mobile banners
    const handleResize = () => {
      loadWithDebounce();
    };

    globalThis.window?.addEventListener("resize", handleResize);
    return () => {
      globalThis.window?.removeEventListener("resize", handleResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  // Sync loaded slides when slides actually change (not just component re-renders)
  useEffect(() => {
    const currentSlidesJson = JSON.stringify(slides.map((s) => s.id));

    // Only update if slides actually changed
    if (prevSlidesRef.current !== currentSlidesJson) {
      prevSlidesRef.current = currentSlidesJson;

      // Keep loaded states only for slides that still exist
      const existingIds = new Set(slides.map((s) => String(s.id)));

      setLoadedSlides((prev) => {
        const updated: Record<string, boolean> = {};
        Object.entries(prev).forEach(([id, loaded]) => {
          if (existingIds.has(id)) {
            updated[id] = loaded;
          }
        });
        return updated;
      });
    }
  }, [slides]);

  // Filter slides based on device type - IMPORTANT: Use filtered length for currentSlide calculation
  const desktopSlides = slides.filter(
    (slide) => slide.device_type === "desktop",
  );
  const mobileSlides = slides.filter((slide) => slide.device_type === "mobile");
  const filteredSlides =
    currentDeviceType === "desktop" ? desktopSlides : mobileSlides;

  // Debug log untuk melihat filtering
  useEffect(() => {
    console.log("🔍 Slide filtering debug:", {
      totalSlides: slides.length,
      currentDeviceType,
      desktopSlidesCount: desktopSlides.length,
      mobileSlidesCount: mobileSlides.length,
      filteredSlidesCount: filteredSlides.length,
      allSlides: slides.map((s) => ({ id: s.id, device_type: s.device_type })),
    });
  }, [
    slides,
    currentDeviceType,
    desktopSlides.length,
    mobileSlides.length,
    filteredSlides.length,
  ]);

  // Calculate current slide - ensure it's always valid
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
      slideInterval = setInterval(() => {
        paginate(1);
      }, 5000);
    }
    return () => clearInterval(slideInterval);
  }, [paginate, filteredSlides.length]);

  const handleImageLoaded = (id?: string | number) => {
    if (id === undefined || id === null) return;
    const key = String(id);
    setLoadedSlides((prev) => ({ ...prev, [key]: true }));
  };

  const handleImageError = (id?: string | number) => {
    if (id === undefined || id === null) return;
    const key = String(id);
    console.error(`[HeroSection] ❌ Image failed to load for banner ${key}`);
    // Mark as loaded anyway to remove skeleton
    setLoadedSlides((prev) => ({ ...prev, [key]: true }));
  };

  if (loading || filteredSlides.length === 0) {
    return (
      <section className="relative w-full bg-transparent overflow-hidden pt-8 md:pt-12">
        {/* Empty state untuk desktop */}
        <div className="hidden md:block relative w-full aspect-1900/720 bg-gray-200" />

        {/* Empty state untuk mobile */}
        <div className="md:hidden relative w-full aspect-2208/2760 bg-gray-200" />
        {/* SEARCH BAR  */}
        <div className="relative w-full px-4 py-8 md:py-0 md:-mt-4 md:z-50 bg-transparent">
          <div className="max-w-5xl mx-auto">
            <div
              className="
                max-w-5xl mx-auto 
                bg-white
                md:rounded-full rounded-3xl 
                flex flex-col md:flex-row 
                overflow-hidden 
                
              "
            >
              {/* NAMA DOKTER */}
              <div className="flex-1 px-5 py-4 border-b md:px-8 md:border-b-0 md:border-r border-gray-100">
                <p className="text-xs text-[#014f86] font-semibold mb-1">
                  Nama Dokter
                </p>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama dokter..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full outline-none text-sm bg-transparent"
                  />
                </div>
              </div>

              {/* SPESIALIS */}
              <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100">
                <p className="text-xs text-[#014f86] font-semibold mb-1">
                  Spesialis
                </p>
                <div className="flex items-center gap-2">
                  <Stethoscope size={16} className="text-gray-400" />
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full outline-none text-sm bg-transparent cursor-pointer"
                  >
                    {SPECIALTY_CATEGORIES.map((s) => (
                      <option key={s} value={s === "Semua Spesialis" ? "" : s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* HARI */}
              <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100">
                <p className="text-xs text-[#014f86] font-semibold mb-1">
                  Pilih Hari
                </p>
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-gray-400" />
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full outline-none text-sm bg-transparent cursor-pointer"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d === "Semua Hari" ? "" : d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BUTTON SEARCH */}
              <div className="flex items-center justify-center p-3">
                <button
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (search) params.append("search", search);
                    if (specialty) params.append("specialty", specialty);
                    if (day) params.append("day", day);
                    globalThis.window?.location.replace(
                      `/dokter?${params.toString()}`,
                    );
                  }}
                  className="w-full md:w-14 h-12 md:h-14 rounded-full md:rounded-full bg-[#014f86] flex items-center justify-center gap-2 text-white active:scale-95 transition cursor-pointer"
                >
                  <Search className="w-5 h-5 md:w-10 md:h-8" />
                  <span className="font-semibold md:hidden">Cari Dokter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-transparent overflow-hidden pt-8 md:pt-12">
      {/* BANNER AREA - Desktop */}
      <section
        aria-label="Hero banner carousel"
        className="hidden md:block relative w-full aspect-1900/780 bg-black"
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
                  {/* Skeleton shimmer shown until image loads */}
                  {!isLoaded && (
                    <div className="absolute inset-0 skeleton-shimmer" />
                  )}

                  {/* Gunakan img tag langsung untuk Supabase URLs (bypass Next.js Image optimization) */}
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

            {/* Chevron Left */}
            <DesktopChevronButton
              direction="left"
              onClick={() => paginate(-1)}
              disabled={desktopSlides.length <= 1}
              isHovering={isHoveringBanner}
            />

            {/* Chevron Right */}
            <DesktopChevronButton
              direction="right"
              onClick={() => paginate(1)}
              disabled={desktopSlides.length <= 1}
              isHovering={isHoveringBanner}
            />

            {/* IMAGE INDICATORS - Desktop */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1">
              {desktopSlides.map((slide) => (
                <button
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
                      ? "bg-white/20 w-10"
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

      {/* BANNER AREA - Mobile */}
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

              {/* Gunakan img tag langsung untuk Supabase URLs (bypass Next.js Image optimization) */}
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

        {/* IMAGE INDICATORS - Mobile */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-1">
          {mobileSlides.map((slide) => (
            <button
              key={`mobile-indicator-${slide.id}`}
              onClick={() => {
                const index = mobileSlides.findIndex((s) => s.id === slide.id);
                setPage(index);
              }}
              className={`h-1 transition-all duration-300 ${
                mobileSlides.findIndex((s) => s.id === slide.id) ===
                currentSlide
                  ? "bg-white w-6"
                  : "bg-white bg-opacity-50 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full px-4 py-8 md:absolute md:inset-0 md:px-4 md:py-0 md:flex md:items-end md:justify-center md:z-20 md:pb-12 md:pointer-events-none">
        <div className="max-w-5xl mx-auto w-full md:pointer-events-auto">
          <div
            className="
              max-w-5xl mx-auto 
              bg-white 
              md:rounded-full rounded-none
              flex flex-col md:flex-row 
              overflow-hidden 
              border border-gray-300
            "
          >
            {/* NAMA DOKTER */}
            <div className="flex-1 px-5 py-4 border-b md:px-8 md:border-b-0 md:border-r border-gray-100">
              <p className="text-xs text-[#014f86] font-semibold mb-1">
                Nama Dokter
              </p>
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Masukkan Nama Dokter"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full outline-none text-sm bg-transparent"
                />
              </div>
            </div>

            {/* SPESIALIS */}
            <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100">
              <p className="text-xs text-[#014f86] font-semibold mb-1">
                Spesialis
              </p>
              <div className="flex items-center gap-2 relative">
                <Stethoscope size={16} className="text-gray-400" />
                <select
                  value={specialty}
                  onChange={(e) => {
                    setSpecialty(e.target.value);
                    setIsSpecialtyOpen(false);
                  }}
                  onFocus={() => setIsSpecialtyOpen(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSpecialtyOpen(false), 100)
                  }
                  className="w-full outline-none text-sm bg-transparent cursor-pointer appearance-none pr-6"
                >
                  {SPECIALTY_CATEGORIES.map((s) => (
                    <option key={s} value={s === "Semua Spesialis" ? "" : s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 absolute right-0 pointer-events-none transition-transform duration-300 ${
                    isSpecialtyOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* HARI */}
            <div className="flex-1 px-5 py-4 border-b md:border-b-0 md:border-r border-gray-100">
              <p className="text-xs text-[#014f86] font-semibold mb-1">
                Pilih Hari
              </p>
              <div className="flex items-center gap-2 relative">
                <CalendarDays size={16} className="text-gray-400" />
                <select
                  value={day}
                  onChange={(e) => {
                    setDay(e.target.value);
                    setIsDayOpen(false);
                  }}
                  onFocus={() => setIsDayOpen(true)}
                  onBlur={() => setTimeout(() => setIsDayOpen(false), 100)}
                  className="w-full outline-none text-sm bg-transparent cursor-pointer appearance-none pr-6"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d === "Semua Hari" ? "" : d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 absolute right-0 pointer-events-none transition-transform duration-300 ${
                    isDayOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* BUTTON SEARCH */}
            <div className="flex items-center justify-center p-3">
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (search) params.append("search", search);
                  if (specialty) params.append("specialty", specialty);
                  if (day) params.append("day", day);
                  if (globalThis.window?.location) {
                    globalThis.window.location.href = `/dokter?${params.toString()}`;
                  }
                }}
                className="w-full md:w-14 h-12 md:h-14 rounded-full md:rounded-full bg-[#014f86] flex items-center justify-center gap-2 text-white active:scale-95 transition cursor-pointer"
              >
                <Search className="w-5 h-5 md:w-10 md:h-8" />
                <span className="font-semibold md:hidden">Cari Dokter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
