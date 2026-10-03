"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp, UserRound, X } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import NavbarMobile from "./NavbarMobile";

interface NavbarClientProps {
  logoNode: React.ReactNode;
}

/* ========================================================= */
/* DATA                                                       */
/* ========================================================= */

type MenuItem =
  | { label: string; href: string }
  | { label: string; specialty: string };

interface MegaMenu {
  key: string;
  label: string;
  heading: string;
  headingHref: string;
  columns: MenuItem[][];
}

const UTILITY_LINKS = [
  { label: "Portal Pasien", href: "/alur-pendaftaran" },
  { label: "Karir", href: "/careers" },
  { label: "Kontak", href: "/kontak-kami" },
];

// spesialisasi: label sama dengan nilai filter
const specialty = (name: string): MenuItem => ({
  label: name,
  specialty: name,
});

const MEGA_MENUS: MegaMenu[] = [
  {
    key: "Cari Dokter",
    label: "Temukan Dokter",
    heading: "Temukan Semua Dokter",
    headingHref: "/dokter",
    columns: [
      [
        specialty("Spesialis Penyakit Dalam"),
        specialty("Spesialis Bedah Umum"),
        specialty("Spesialis Saraf"),
        specialty("Spesialis Orthopedi"),
      ],
      [
        specialty("Spesialis Paru"),
        specialty("Spesialis Jantung & Pembuluh Darah"),
        specialty("Spesialis THT"),
        specialty("Spesialis Anak"),
      ],
      [
        specialty("Spesialis Mata"),
        specialty("Spesialis Obgyn"),
        specialty("Spesialis Gigi"),
        specialty("Spesialis Fisioterapi"),
      ],
    ],
  },
  {
    key: "Fasilitas & Layanan",
    label: "Fasilitas & Layanan",
    heading: "Lihat Semua Layanan Medis",
    headingHref: "/services/poli-klinik",
    columns: [
      [
        { label: "Medical Checkup", href: "/services/medical-checkup" },
        { label: "Poli Klinik Spesialis", href: "/services/poli-klinik" },
        { label: "Unit Gawat Darurat (24 Jam)", href: "/services/emergency" },
      ],
      [
        { label: "Kamar Perawatan", href: "/services/kamar-perawatan" },
        { label: "Tarif Kamar", href: "/tarif-kamar" },
        { label: "Ketersediaan Kamar", href: "/ketersediaan-kamar" },
      ],
      [
        { label: "Paket Promo Kesehatan", href: "/promo" },
        { label: "Asuransi & Rekanan", href: "/asuransi-rekanan" },
      ],
    ],
  },
  {
    key: "Profil",
    label: "Informasi",
    heading: "Tentang RS Medika Lestari",
    headingHref: "/tentang-kami",
    columns: [
      [
        { label: "Profil Rumah Sakit", href: "/tentang-kami" },
        { label: "Jadwal Dokter", href: "/jadwal-dokter" },
        { label: "Karir & Kesempatan Kerja", href: "/careers" },
      ],
      [
        { label: "Hubungi Kami", href: "/kontak-kami" },
        { label: "Syarat & Ketentuan Layanan", href: "/syarat-ketentuan" },
      ],
    ],
  },
];

const MENU_ITEM_CLASS =
  "cursor-pointer text-left text-[20px] font-normal leading-snug text-gray-900";

/* ---------- search spesialisasi ---------- */

// hapus spasi & simbol agar pencarian lebih longgar
const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

interface SpecialtyOption {
  label: string;
  specialty: string;
  searchText: string;
}

// daftar spesialisasi diambil dari data menu
const SPECIALTY_OPTIONS: SpecialtyOption[] = MEGA_MENUS.flatMap((menu) =>
  menu.columns.flat(),
).flatMap((item) =>
  "specialty" in item
    ? [
        {
          label: item.label,
          specialty: item.specialty,
          searchText: `${normalize(item.label)}|${normalize(item.specialty)}`,
        },
      ]
    : [],
);

const MAX_SUGGESTIONS = 6;

/* ========================================================= */
/* KOMPONEN                                                   */
/* ========================================================= */

const NavbarClient: React.FC<NavbarClientProps> = ({ logoNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [language, setLanguage] = useState<"ID" | "EN">("ID");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // tutup mega menu saat route berubah
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setActiveMenu(null);
  }

  // scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // escape
  useEffect(() => {
    if (!activeMenu) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMenu]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ID" ? "EN" : "ID"));
  };

  const handleMenuClick = (menuKey: string) => {
    // search akan hide, tutup saran supaya tidak muncul lagi saat menu ditutup
    setIsSuggestionOpen(false);
    setActiveSuggestion(-1);
    setActiveMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  const closeMenu = () => setActiveMenu(null);

  // logo: scroll ke atas jika sudah di beranda
  const handleLogoClick = (e: React.MouseEvent) => {
    closeMenu();
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ringkas: logo mengecil & search hide (scroll atau mega menu terbuka)
  const isMenuOpen = activeMenu !== null;
  const isCompact = isScrolled || isMenuOpen;

  // saran spesialisasi
  const normalizedQuery = normalize(searchQuery);
  const suggestions = normalizedQuery
    ? SPECIALTY_OPTIONS.filter((option) =>
        option.searchText.includes(normalizedQuery),
      ).slice(0, MAX_SUGGESTIONS)
    : [];
  const showSuggestions =
    isSuggestionOpen && !isCompact && suggestions.length > 0;

  const resetSearch = () => {
    setSearchQuery("");
    setIsSuggestionOpen(false);
    setActiveSuggestion(-1);
  };

  const handleSpecialtyFilter = (specialty: string) => {
    setActiveMenu(null);
    router.push(`/dokter?specialty=${encodeURIComponent(specialty)}`);
  };

  const handleSuggestionSelect = (option: SpecialtyOption) => {
    handleSpecialtyFilter(option.specialty);
    resetSearch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSuggestionOpen(true);
    setActiveSuggestion(-1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsSuggestionOpen(false);
      setActiveSuggestion(-1);
      return;
    }
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionSelect(suggestions[activeSuggestion]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // satu hasil: langsung filter spesialisasi
    if (suggestions.length === 1) {
      handleSpecialtyFilter(suggestions[0].specialty);
    } else {
      router.push(`/dokter?search=${encodeURIComponent(query)}`);
    }
    resetSearch();
  };

  const handleClearSearch = () => {
    resetSearch();
    searchInputRef.current?.focus();
  };

  const activeMenuData = MEGA_MENUS.find((m) => m.key === activeMenu) ?? null;
  const adminHref = isAuthenticated ? "/admin/dashboard" : "/admin/login";
  const adminLabel = isAuthenticated ? "Dashboard" : "Masuk";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full bg-white font-sans md:border-b md:border-gray-200 md:shadow-xs">
      {/* mobile (< md): menu, search, scroll lock ada di NavbarMobile */}
      <NavbarMobile logoNode={logoNode} />

      {/* desktop (>= md) */}
      <div className="hidden md:block">
        {/* utility bar */}
        <div className="bg-[#5f5f5f] text-[12px] font-normal text-white">
          <div className="mx-auto flex h-7 max-w-[1280px] items-stretch justify-between pl-6">
            {/* quick links */}
            <nav aria-label="Tautan cepat">
              <ul className="flex h-full items-center gap-6">
                {UTILITY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="opacity-90 hover:underline hover:opacity-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center">
              {/* language */}
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={
                  language === "ID"
                    ? "Bahasa saat ini Indonesia. Klik untuk beralih ke English"
                    : "Current language English. Click to switch to Indonesian"
                }
                className="px-4 font-semibold hover:underline inline-flex items-center gap-2"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-1.5"
                >
                  {language === "ID" ? (
                    <>
                      <img
                        src="https://flagcdn.com/w40/id.png"
                        alt="Indonesia Flag"
                        className="w-4 h-4 rounded-full object-cover border border-gray-200"
                      />
                      <span>ID</span>
                    </>
                  ) : (
                    <>
                      <img
                        src="https://flagcdn.com/w40/gb.png"
                        alt="UK Flag"
                        className="w-4 h-4 rounded-full object-cover border border-gray-200"
                      />
                      <span>EN</span>
                    </>
                  )}
                </span>
              </button>

              {/* admin */}
              <Link
                href={adminHref}
                className="flex h-full items-center gap-2 bg-[#003f88] px-4 font-bold text-white transition-colors hover:bg-[#002e66]"
              >
                <UserRound size={14} aria-hidden="true" />
                <span>{adminLabel}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* main bar */}
        <div className="relative bg-white">
          <div className="mx-auto flex min-h-[96px] max-w-[1310px] items-center justify-between gap-6 px-6 py-5">
            {/* logo */}
            <Link
              href="/"
              onClick={handleLogoClick}
              aria-label="Beranda RS Medika Lestari"
              className="my-auto flex shrink-0 items-center"
            >
              <div
                className={`flex origin-left items-center ${
                  isMenuOpen
                    ? ""
                    : "transition-transform duration-300 ease-in-out"
                } ${isCompact ? "scale-100" : "scale-120"}`}
              >
                {logoNode}
              </div>
            </Link>

            {/* menu & search */}
            <div className="relative ml-auto flex flex-1 flex-col items-end justify-center gap-2.5">
              {/* menu */}
              <nav aria-label="Menu utama">
                <ul className="flex items-center justify-end gap-9 text-[18px] font-medium text-gray-900">
                  {MEGA_MENUS.map((menu) => {
                    const isOpen = activeMenu === menu.key;
                    return (
                      <li key={menu.key}>
                        <button
                          type="button"
                          onClick={() => handleMenuClick(menu.key)}
                          aria-expanded={isOpen}
                          aria-controls="mega-menu-panel"
                          className={`flex items-center gap-2 py-1 cursor-pointer transition-colors hover:text-[#003f88] ${
                            isOpen ? "text-[#003f88]" : ""
                          }`}
                        >
                          <span>{menu.label}</span>
                          {isOpen ? (
                            <ChevronUp
                              size={30}
                              className="stroke-[2]"
                              aria-hidden="true"
                            />
                          ) : (
                            <ChevronDown
                              size={30}
                              className="stroke-[2]"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* search (scroll: animasi, mega menu terbuka: invisible, ruang tetap) */}
              <AnimatePresence>
                {!isScrolled && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className={`w-full max-w-xl overflow-hidden ${isMenuOpen ? "invisible" : ""}`}
                  >
                    <form
                      role="search"
                      onSubmit={handleSearchSubmit}
                      className="flex w-full items-center overflow-hidden rounded-md border border-gray-400 bg-white shadow-xs focus-within:border-[#003f88]"
                    >
                      <label htmlFor="navbar-search" className="sr-only">
                        Cari dokter atau spesialisasi
                      </label>
                      <span className="pl-3.5 text-gray-500" aria-hidden="true">
                        <Search size={18} />
                      </span>
                      <input
                        id="navbar-search"
                        ref={searchInputRef}
                        type="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setIsSuggestionOpen(true)}
                        onBlur={() => setIsSuggestionOpen(false)}
                        onKeyDown={handleSearchKeyDown}
                        role="combobox"
                        aria-expanded={showSuggestions}
                        aria-controls="navbar-search-listbox"
                        aria-autocomplete="list"
                        aria-activedescendant={
                          showSuggestions && activeSuggestion >= 0
                            ? `navbar-search-option-${activeSuggestion}`
                            : undefined
                        }
                        placeholder="Search"
                        autoComplete="off"
                        className="w-full px-3 py-2 text-sm font-light text-neutral-700 placeholder-gray-400 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="mr-1 p-1 text-gray-400 hover:text-gray-600"
                          aria-label="Bersihkan pencarian"
                        >
                          <X size={16} aria-hidden="true" />
                        </button>
                      )}
                      <button
                        type="submit"
                        className="shrink-0 cursor-pointer bg-[#003f88] px-5 py-2 text-sm font-bold text-white transition-colors duration-700 hover:bg-[#001c3b]"
                      >
                        Search
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* suggestions */}
              {showSuggestions && (
                <ul
                  id="navbar-search-listbox"
                  role="listbox"
                  aria-label="Saran spesialisasi"
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute right-0 top-full z-50 mt-1 w-full max-w-xl overflow-hidden rounded-md border border-gray-300 bg-white shadow-2xl"
                >
                  {suggestions.map((option, index) => (
                    <li
                      key={option.specialty}
                      id={`navbar-search-option-${index}`}
                      role="option"
                      aria-selected={index === activeSuggestion}
                      onClick={() => handleSuggestionSelect(option)}
                      onMouseEnter={() => setActiveSuggestion(index)}
                      className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-sm font-bold text-gray-900 ${
                        index === activeSuggestion
                          ? "bg-gray-100 text-[#003f88]"
                          : ""
                      }`}
                    >
                      <span>{option.label}</span>
                      <span className="text-xs font-medium text-gray-500">
                        Spesialisasi
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* mega menu (tanpa animasi) */}
          {activeMenuData && (
            <div
              id="mega-menu-panel"
              role="region"
              aria-label={activeMenuData.label}
              className="pointer-events-none absolute inset-x-0 top-full z-50 px-4"
            >
              <div className="pointer-events-auto relative mx-auto max-h-[80vh] max-w-[1600px] overflow-y-auto bg-white px-12 py-12 antialiased shadow-2xl 2xl:px-[100px]">
                {/* close */}
                <button
                  type="button"
                  onClick={closeMenu}
                  className="absolute right-12 top-12 -mr-1 -mt-1 p-1 text-gray-800 hover:text-black 2xl:right-[100px]"
                  aria-label="Tutup Menu"
                >
                  <X size={40} strokeWidth={1} aria-hidden="true" />
                </button>

                {/* heading */}
                <div className="mb-8 border-b border-gray-200 pb-6">
                  <h2>
                    <Link
                      href={activeMenuData.headingHref}
                      onClick={closeMenu}
                      className={MENU_ITEM_CLASS}
                    >
                      {activeMenuData.heading}
                    </Link>
                  </h2>
                </div>

                {/* columns */}
                <div className="grid grid-cols-3 gap-10">
                  {activeMenuData.columns.map((column) => (
                    <ul key={column[0].label} className="space-y-2">
                      {column.map((item) => (
                        <li key={item.label}>
                          {"href" in item ? (
                            <Link
                              href={item.href}
                              onClick={closeMenu}
                              className={MENU_ITEM_CLASS}
                            >
                              {item.label}
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleSpecialtyFilter(item.specialty)
                              }
                              className={MENU_ITEM_CLASS}
                            >
                              {item.label}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarClient;
