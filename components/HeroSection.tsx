"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
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
    style.setAttribute("data-shimmer", "true");
    document.head.appendChild(style);
  }
}

const HeroSection = () => {
  const [slides, setSlides] = useState<HeroBanner[]>([]);
  const [page, setPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
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
        // Determine if we're on mobile based on window width
        const isMobileDevice =
          typeof globalThis !== "undefined" &&
          globalThis.window?.innerWidth !== undefined &&
          globalThis.window.innerWidth <= 768;

        // Set device type and fetch appropriate banners
        const deviceType = isMobileDevice ? "mobile" : "desktop";
        setCurrentDeviceType(deviceType);

        console.log(`Loading ${deviceType} banners...`);
        const banners = await fetchHeroBanners(deviceType);

        // Only set slides if banners exist, otherwise keep empty
        if (banners && banners.length > 0) {
          console.log(`Loaded ${banners.length} ${deviceType} banners`);
          setSlides(banners);
        } else {
          console.log(`No ${deviceType} banners found`);
          setSlides([]);
        }
      } catch (error) {
        console.error("Error loading hero banners:", error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadBanners();

    // Handle window resize to switch between desktop and mobile banners
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      // Debounce the resize event
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        loadBanners();
      }, 300);
    };

    globalThis.window?.addEventListener("resize", handleResize);
    return () => {
      globalThis.window?.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
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
  const currentSlide = Math.abs(page % (filteredSlides.length || 1));

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(page + newDirection);
    },
    [page],
  );

  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (isPlaying && filteredSlides.length > 0) {
      slideInterval = setInterval(() => {
        paginate(1);
      }, 5000);
    }
    return () => clearInterval(slideInterval);
  }, [paginate, isPlaying, filteredSlides.length]);

  const handleImageLoaded = (id?: string | number) => {
    if (id === undefined || id === null) return;
    const key = String(id);
    setLoadedSlides((prev) => ({ ...prev, [key]: true }));
  };

  if (loading || filteredSlides.length === 0) {
    return (
      <section className="relative w-full bg-transparent overflow-hidden">
        {/* Empty state untuk desktop */}
        <div className="hidden md:block relative w-full aspect-[1900/720] bg-gray-200" />

        {/* Empty state untuk mobile */}
        <div className="md:hidden relative w-full aspect-[2208/2760] bg-gray-200" />
        {/* SEARCH BAR  */}
        <div className="relative w-full px-4 py-8 md:py-0 md:-mt-14 md:z-50 bg-transparent">
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
                <p className="text-xs text-[#005753] font-semibold mb-1">
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
                <p className="text-xs text-[#005753] font-semibold mb-1">
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
                <p className="text-xs text-[#005753] font-semibold mb-1">
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
                  className="w-full md:w-14 h-12 md:h-14 rounded-full md:rounded-full bg-[#005753] flex items-center justify-center gap-2 text-white active:scale-95 transition cursor-pointer"
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
    <section className="relative w-full bg-transparent overflow-hidden">
      {/* BANNER AREA - Desktop */}
      <div className="hidden md:block relative w-full aspect-[1900/780] bg-black">
        {desktopSlides.map((slide, index) => {
          const key = String(slide.id);
          const isLoaded = !!loadedSlides[key];
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Skeleton shimmer shown until image loads */}
              {!isLoaded && (
                <div className="absolute inset-0 skeleton-shimmer" />
              )}

              <Image
                src={slide.image_url}
                alt={`Slide ${index}`}
                fill
                priority={index === 0}
                onLoadingComplete={() => handleImageLoaded(slide.id)}
                className={`object-cover object-center transition-opacity duration-700 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          );
        })}

        {/* CONTROLS - Bottom Left */}
        <div className="absolute bottom-8 left-10 z-40 flex items-center gap-4">
          <div className="flex items-center gap-1">
            {" "}
            <button
              onClick={() => paginate(-1)}
              disabled={desktopSlides.length <= 1}
              className={`p-1 rounded-full transition-all duration-300 ${
                desktopSlides.length <= 1
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-60 hover:opacity-100 cursor-pointer"
              }`}
            >
              <ChevronLeft size={70} className="text-white" />
            </button>
            {/* Right Chevron */}
            <button
              onClick={() => paginate(1)}
              disabled={desktopSlides.length <= 1}
              className={`p-1 rounded-full transition-all duration-300 ${
                desktopSlides.length <= 1
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-60 hover:opacity-100 cursor-pointer"
              }`}
            >
              <ChevronRight size={70} className="text-white" />
            </button>
          </div>
        </div>

        {/* IMAGE INDICATORS - Desktop */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1">
          {desktopSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`h-1 transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white/20 w-10"
                  : "bg-white bg-opacity-50 w-10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* BANNER AREA - Mobile */}
      <div className="md:hidden relative w-full aspect-[2208/2760] bg-black">
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

              <Image
                src={slide.image_url}
                alt={`Slide ${index}`}
                fill
                priority={index === 0}
                onLoadingComplete={() => handleImageLoaded(slide.id)}
                className={`object-cover object-center transition-opacity duration-700 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          );
        })}

        {/* IMAGE INDICATORS - Mobile */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-1">
          {mobileSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`h-1 transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white w-6"
                  : "bg-white bg-opacity-50 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full px-4 py-8 md:absolute md:inset-0 md:px-4 md:py-0 md:flex md:items-end md:justify-center md:z-50 md:pb-6 md:pointer-events-none">
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
              <p className="text-xs text-[#005753] font-semibold mb-1">
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
              <p className="text-xs text-[#005753] font-semibold mb-1">
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
              <p className="text-xs text-[#005753] font-semibold mb-1">
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
                className="w-full md:w-14 h-12 md:h-14 rounded-full md:rounded-full bg-[#005753] flex items-center justify-center gap-2 text-white active:scale-95 transition cursor-pointer"
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
