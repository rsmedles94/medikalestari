"use client";

import Link from "next/link";

import React, { useState, useEffect, useCallback, useRef } from "react";

import Image from "next/image";

import {
  Search,
  User,
  Stethoscope,
  CalendarDays,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";

import { fetchHeroBanners } from "@/lib/api";

import { HeroBanner } from "@/lib/types";

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

    0% {

      stroke-dashoffset: 163.36; /* 2 * PI * 26 */

    }

    100% {

      stroke-dashoffset: 0;

    }

  }



  @keyframes circleProgressMobile {

    0% {

      stroke-dashoffset: 113.1; /* 2 * PI * 18 */

    }

    100% {

      stroke-dashoffset: 0;

    }

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

const HeroSection = () => {
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

  // Key untuk mereset animasi CSS setiap kali slide berganti/diklik

  const [animKey, setAnimKey] = useState(0);

  // Refs untuk klik di luar dropdown

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

    setAnimKey((prev) => prev + 1); // Reset animasi melingkar
  }, []);

  // Timer Pindah Slide Otomatis Setiap 5 Detik

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

  const circumference = 2 * Math.PI * radius; // ~163.36

  return (
    <section className="relative isolate w-full bg-transparent mb-12 md:mb-24">
      {/* Pengumuman informasi rumah sakit */}
      {isAnnouncementVisible && (
        <div
          className="hero-announcement hidden sm:flex absolute inset-x-0 top-1/2 z-[9999] h-11 w-full -translate-y-1/2 items-center overflow-hidden bg-[#003f88] text-white  sm:h-8"
          style={{
            position: "absolute",
            top: "11%",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 9999,
          }}
        >
          {/* Container max-w-7xl agar terbatasi dengan rapi di tengah */}
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between relative px-4 sm:px-6 lg:px-8">
            <div
              className="min-w-0 flex-1 overflow-hidden pr-12"
              aria-label="Informasi Rumah Sakit Medika Lestari"
            >
              <div
                className="hero-announcement-track items-center"
                role="marquee"
                aria-label="RS Medika Lestari buka setiap hari 24 jam. Alamat: Jalan HOS Cokroaminoto Nomor 56, Karang Tengah, Kota Tangerang, Banten 15151."
              >
                {[0, 1].map((copy) => (
                  <div
                    key={copy}
                    className="flex shrink-0 items-center whitespace-nowrap py-2 text-[11px] font-medium tracking-wide sm:text-xs md:text-sm"
                    aria-hidden={copy === 1}
                  >
                    <span className="mx-5 inline-flex items-center gap-2 sm:mx-8">
                      {/* Titik hijau sudah dihapus */}
                      <span className="font-semibold">
                        RS Medika Lestari Buka 24 Jam Setiap Hari
                      </span>
                    </span>
                    <span
                      className="mx-5 text-white/50 sm:mx-8"
                      aria-hidden="true"
                    >
                      |
                    </span>
                    <span className="mx-5 inline-flex items-center gap-2 sm:mx-8">
                      <span className="font-semibold">Alamat:</span>
                      <span>
                        Jl. HOS Cokroaminoto No.56, RT.001/RW.012, Karang Timur,
                        Kec. Karang Tengah, Kota Tangerang, Banten 15151
                      </span>
                    </span>
                    <span
                      className="mx-5 text-white/50 sm:mx-8"
                      aria-hidden="true"
                    >
                      |
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAnnouncementVisible(false)}
              aria-label="Tutup informasi rumah sakit"
              title="Tutup"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-full w-11 shrink-0 items-center justify-center bg-[#003f88] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white cursor-pointer"
            >
              {/* x mark button */}
              <X size={22} strokeWidth={2} />
            </button>

            <span
              className="pointer-events-none absolute inset-y-0 right-11 z-[1] w-5 bg-gradient-to-l from-[#003f88] to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      )}

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

            {/* Tombol Transparan Sisi Kiri dengan Pertemuan di Kanan Atas (-45deg) */}

            {activeSlides.length > 1 && (
              <div className="absolute left-8 bottom-16 z-40">
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  aria-label="Next slide"
                  className="relative flex items-center justify-center w-16 h-16 bg-transparent transition-transform duration-200 active:scale-95 focus:outline-none group cursor-pointer"
                >
                  {/* SVG di-rotate -45deg agar titik mulai & temu di kanan atas */}

                  <svg
                    key={`desktop-ring-${animKey}`}
                    className="absolute inset-0 w-full h-full pointer-events-none -rotate-90"
                  >
                    {/* Track lingkaran transparan */}

                    <circle
                      cx="32"
                      cy="32"
                      r={radius}
                      className="stroke-white/30"
                      strokeWidth="2.5"
                      fill="transparent"
                    />

                    {/* Ring progress animasi bergerak mulus */}

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

        {/* Tombol Mobile */}

        {activeSlides.length > 1 && (
          <div className="absolute left-4 bottom-4 z-40">
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

      <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-full max-w-5xl px-4">
        <section className="bg-white p-6 md:p-8 rounded-md border border-gray-200 w-full">
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
                placeholder="Nama Dokter"
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
                  className={`text-gray-400 shrink-0  ${
                    isSpecialtyOpen ? "rotate-180 text-[#003f88]" : ""
                  }`}
                />
              </button>

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
                  className={`text-gray-400 shrink-0  ${
                    isDayOpen ? "rotate-180 text-[#003f88]" : ""
                  }`}
                />
              </button>

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
