"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";

import {
  Search,
  Menu,
  X,
  UserCircle,
  UserRound,
  LayoutDashboard,
  Stethoscope,
  Phone,
  Ambulance,
  Pill,
  Activity,
  Hotel,
  Microscope,
  Siren,
  Heart,
  Radio,
  Bed,
  Dumbbell,
  Syringe,
  Plus,
  Minus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthProvider";
import { useSearchModal } from "@/context/SearchModalContext";
import SearchDropdown from "../SearchDropdown";
import { MobileSearchModalWrapper } from "../MobileSearchModalWrapper";
import DropdownMenuItem from "../DropdownMenuItem";
import BookingForm from "../BookingForm";
import { usePathname, useRouter } from "next/navigation";

interface NavbarClientProps {
  logoNode: React.ReactNode;
}

const NavbarClient: React.FC<NavbarClientProps> = ({ logoNode }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showBookingForm, setShowBookingForm] = useState(false);

  const { isSearchOpen, openSearch, closeSearch } = useSearchModal();

  const [isVisible, setIsVisible] = useState(true);

  const [lastScrollY, setLastScrollY] = useState(0);

  const [language, setLanguage] = useState<"ID" | "EN">("ID");

  const [isInPromoSection, setIsInPromoSection] = useState(false);

  const [isPromoOrBelowStarted, setIsPromoOrBelowStarted] = useState(false);

  const pathname = usePathname();

  const router = useRouter();

  const toggleLanguage = () => {
    setLanguage(language === "ID" ? "EN" : "ID");
  };

  /* SCROLL CONTROL UNTUK TOP NAVBAR*/
  useEffect(() => {
    const controlNavbar = () => {
      // Deteksi PromoKesehatan, ServiceSection, dan MadingSection
      const allSections = document.querySelectorAll("section");
      let isInHideZone = false; // Sedang di dalam section PromoKesehatan, ServiceSection, atau MadingSection
      let hasStartedHideZone = false; // Sudah melewati hide zone sepenuhnya

      for (const section of allSections) {
        const rect = section.getBoundingClientRect();

        // Check apakah section ini adalah PromoKesehatan, ServiceSection, atau MadingSection
        const isPromoSection = section.innerHTML.includes(
          "Selamat Datang di Rumah Sakit Medika Lestari",
        );
        const isServiceSection = section.innerHTML.includes("Kisah Pasien"); // ServiceSection punya judul "Kisah Pasien"
        const isMadingSection =
          section.className.includes("bg-gradient") &&
          section.innerHTML.includes("Mading"); // Rough detection untuk MadingSection

        if (isPromoSection || isServiceSection || isMadingSection) {
          // top section sudah masuk ke atas viewport
          // rect.top <= 0 berarti section sudah masuk dari atas
          // rect.bottom > 0 berarti masih ada bagian yang terlihat
          isInHideZone = isInHideZone || (rect.top <= 0 && rect.bottom > 0);

          // bottom section keluar dari bawah viewport
          // rect.bottom <= 0 berarti section sudah keluar sepenuhnya ke atas
          hasStartedHideZone = hasStartedHideZone || rect.bottom <= 0;
        }
      }

      // Jika sedang di hide zone atau sudah melewatinya, hide navbars
      const shouldHideNavbars = isInHideZone || hasStartedHideZone;

      // Bottom navbar hide sama seperti top navbar
      setIsInPromoSection(shouldHideNavbars);

      // Top navbar hide saat di hide zone atau sudah melewatinya
      setIsPromoOrBelowStarted(shouldHideNavbars);

      // Top navbar behavior:
      if (shouldHideNavbars) {
        // Di hide zone, navbar selalu hide
        setIsVisible(false);
      } else {
        // Di luar hide zone, kontrol berdasarkan scroll direction
        if (window.scrollY > lastScrollY && window.scrollY > 50) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }

      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  // Tutup menu dropdown pencarian saat nama jalur berubah
  useEffect(() => {
    closeSearch();
  }, [pathname, closeSearch]);

  // pengunci scrollbar
  useEffect(() => {
    if (typeof document === "undefined") return;

    const isMobileDevice = window.innerWidth < 768;
    if (!isMobileDevice) return;

    const body = document.body;
    const html = document.documentElement;

    if (isMobileMenuOpen) {
      if (!body.dataset.scrollY) {
        const scrollY = window.scrollY;
        body.dataset.scrollY = scrollY.toString();
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        html.style.overflow = "hidden";
      }
    } else {
      const scrollY = body.dataset.scrollY;

      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.width = "";
      body.style.overflow = "";
      html.style.overflow = "";

      delete body.dataset.scrollY;

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10));
      }
    }

    return () => {
      const scrollY = body.dataset.scrollY;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.width = "";
      body.style.overflow = "";
      html.style.overflow = "";
      delete body.dataset.scrollY;
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10));
      }
    };
  }, [isMobileMenuOpen]);

  const menuData: Record<string, string[]> = {
    "Fasilitas & Layanan": [
      "Kamar Perawatan",
      "Medical Checkup",
      "Paket Kesehatan",
      "Poli Klinik",
    ],

    "Portal Pasien": [
      "Alur Pendaftaran",
      "Asuransi & Rekanan",
      "Emergency",
      "Ketersediaan Kamar",
      "Tarif Kamar",
    ],

    Profil: ["Karir", "Kontak", "Syarat & Ketentuan", "Tentang Kami"],
  };

  const serviceIcons: Record<string, React.ReactNode> = {
    "Kamar Perawatan": <Hotel size={20} strokeWidth={1.5} />,
    "Medical Checkup": <Heart size={20} strokeWidth={1.5} />,
    "Poli Klinik": <Stethoscope size={20} strokeWidth={1.5} />,
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();

      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }

    setIsMobileMenuOpen(false);
  };

  const renderDropdownContent = (
    items: Array<string | { label: string; code?: string; active?: boolean }>,

    widthClass: string = "w-72",
    category?: string,
  ) => {
    const isLargeMenu = items.length > 6;
    const isFasilitasLayanan = category === "Fasilitas & Layanan";

    return (
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.3, ease: "circOut" }}
        className={`absolute top-full bg-white text-gray-900 shadow-lg overflow-visible z-50 border-t border-white mt-2 left-1/2 transform -translate-x-1/2 ${
          isLargeMenu ? "w-[600px]" : widthClass
        }`}
        style={{
          boxShadow:
            "0 10px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Arrow/Triangle */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
        <div
          className={`py-1 px-1 grid ${isLargeMenu ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {items.map((item) => {
            const title = typeof item === "string" ? item : item.label;

            let itemHref = "/";

            if (title === "Dokter Spesialis")
              itemHref = "/dokter/dokter-spesialis";
            else if (title === "Jadwal Dokter") itemHref = "/jadwal-dokter";
            else if (title === "Tentang Kami") itemHref = "/tentang-kami";
            else if (title === "Karir") itemHref = "/careers";
            else if (title === "Kontak") itemHref = "/kontak-kami";
            else if (title === "Syarat & Ketentuan")
              itemHref = "/syarat-ketentuan";
            else if (
              title === "Profil RS Medika Lestari" ||
              title === "Visi & Misi"
            )
              itemHref = "/tentang-kami";
            else if (title === "Emergency") itemHref = "/services/emergency";
            else if (title === "Kamar Perawatan")
              itemHref = "/services/kamar-perawatan";
            else if (title === "Medical Checkup")
              itemHref = "/services/medical-checkup";
            else if (title === "Paket Kesehatan") itemHref = "/promo";
            else if (title === "Poli Klinik")
              itemHref = "/services/poli-klinik";
            else if (title === "Tarif Kamar") itemHref = "/tarif-kamar";
            else if (title === "Ketersediaan Kamar")
              itemHref = "/ketersediaan-kamar";
            else if (title === "Alur Pendaftaran")
              itemHref = "/alur-pendaftaran";
            else if (title === "Asuransi & Rekanan")
              itemHref = "/asuransi-rekanan";

            return (
              <div
                key={title}
                onClick={() => {
                  setActiveMenu(null);

                  setIsMobileMenuOpen(false);
                }}
              >
                <DropdownMenuItem
                  title={title}
                  href={itemHref}
                  icon={
                    isFasilitasLayanan
                      ? undefined
                      : serviceIcons[title as keyof typeof serviceIcons]
                  }
                />
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <nav className="w-full font-sans fixed top-0 left-0 right-0 z-50 bg-white">
      {/* --- Top Navbar (Animated Hide/Show) --- */}

      <motion.div
        initial={{ height: "auto", opacity: 1 }}
        animate={{
          height: isVisible ? "auto" : 0,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-white overflow-hidden will-change-[height,opacity]"
      >
        <div className="py-4 relative">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center scale-80 md:scale-100">
              {logoNode}
            </Link>

            <div className="md:hidden flex items-center gap-3 p-2 text-gray-700 relative z-[110]">
              <button
                onClick={() => openSearch()}
                className="p-2 "
                title="Cari dokter"
              >
                <Search size={28} />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 "
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Bottom Navbar --- */}

      <motion.div
        initial={{ height: "auto", opacity: 1 }}
        animate={{
          height: isInPromoSection ? 0 : "auto",
          opacity: isInPromoSection ? 0 : 1,
        }}
        transition={{ duration: 0 }}
        className={`hidden md:block relative w-full bg-white border-t border-gray-200 z-30 shadow-md ${
          isInPromoSection
            ? "invisible pointer-events-none"
            : "visible pointer-events-auto"
        }`}
      >
        <div className="max-w-[1220px] mx-auto px-4 md:px-8 flex justify-between items-center h-16 relative z-10">
          <div className="flex h-full text-[15px] text-gray-700">
            <button
              onClick={handleHomeClick}
              className="flex items-center h-full px-6 transition-colors font-semibold relative group cursor-pointer"
            >
              Beranda
              <div
                className={`absolute bottom-0 left-6 right-6 h-1 bg-gray-400 rounded-t-full transition-transform duration-300 ${
                  pathname === "/"
                    ? "scale-x-0"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>

            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => {
                setActiveMenu("Dokter Kami");
                closeSearch();
              }}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center h-full px-6 transition-colors font-semibold relative group gap-2 text-gray-700">
                Cari Dokter
                <span
                  aria-hidden
                  className={`transition-transform duration-300 text-gray-700 ${
                    activeMenu === "Dokter Kami" ? "scale-y-[-1]" : ""
                  }`}
                  style={{ fontSize: 18 }}
                >
                  ⏷
                </span>
                <div
                  className={`absolute bottom-0 left-6 right-6 h-1 bg-gray-400 rounded-t-full transition-transform duration-300 ${
                    activeMenu === "Dokter Kami"
                      ? "scale-x-0"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeMenu === "Dokter Kami" &&
                  renderDropdownContent(
                    ["Dokter Spesialis", "Jadwal Dokter"],

                    "w-56",
                  )}
              </AnimatePresence>
            </div>

            {Object.keys(menuData)

              .filter((item) => item !== "Profil")

              .map((item) => (
                <div
                  key={item}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => {
                    setActiveMenu(item);
                    closeSearch();
                  }}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button className="flex items-center h-full px-6 transition-colors font-semibold relative group gap-2 text-gray-700">
                    {item}
                    <span
                      aria-hidden
                      className={`transition-transform duration-300 text-gray-700 ${
                        activeMenu === item ? "scale-y-[-1]" : ""
                      }`}
                      style={{ fontSize: 18 }}
                    >
                      ⏷
                    </span>

                    <div
                      className={`absolute bottom-0 left-6 right-6 h-1 bg-gray-400 rounded-t-full transition-transform duration-300 ${
                        activeMenu === item
                          ? "scale-x-0"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {activeMenu === item &&
                      renderDropdownContent(menuData[item], "w-72", item)}
                  </AnimatePresence>
                </div>
              ))}

            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => {
                setActiveMenu("Profil");
                closeSearch();
              }}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center h-full px-6 transition-colors font-semibold relative group gap-2 text-gray-700">
                Informasi
                <span
                  aria-hidden
                  className={`transition-transform duration-300 text-gray-700 ${
                    activeMenu === "Profil" ? "scale-y-[-1]" : ""
                  }`}
                  style={{ fontSize: 18 }}
                >
                  ⏷
                </span>
                <div
                  className={`absolute bottom-0 left-6 right-6 h-1 bg-gray-400 rounded-t-full transition-transform duration-300 ${
                    activeMenu === "Profil"
                      ? "scale-x-0"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeMenu === "Profil" &&
                  renderDropdownContent(menuData["Profil"], "w-56")}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center h-full gap-2 text-[15px]">
            <button
              onClick={() => {
                if (isSearchOpen) {
                  closeSearch();
                } else {
                  openSearch();
                }
              }}
              className="flex items-center gap-1 transition-all h-full px-3 relative group text-gray-500"
              title="Cari Dokter Spesialis"
            >
              <Search size={25} strokeWidth={3} />

              <div
                className={`absolute bottom-0 left-3 right-3 h-1 bg-gray-400 rounded-t-full transition-transform duration-300  ${
                  isSearchOpen
                    ? "scale-x-0"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>

            <button
              onClick={toggleLanguage}
              className="relative h-full flex items-center px-3 cursor-pointer hover:opacity-80 transition-opacity"
              title="Switch language"
            >
              <div className="flex items-center gap-1 px-1  border border-gray-400 rounded-full">
                {language === "ID" ? (
                  <>
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="rounded-full"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="12"
                        fill="#E5E7EB"
                        stroke="#D1D5DB"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M 2 12 C 2 6.48 6.48 2 12 2 C 17.52 2 22 6.48 22 12 L 12 12 Z"
                        fill="#FF0000"
                      />
                      <path
                        d="M 2 12 L 12 12 C 17.52 12 22 17.52 22 12 C 22 17.52 17.52 22 12 22 C 6.48 22 2 17.52 2 12 Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                    <span className="font-medium text-gray-700">ID</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-700">EN</span>
                    <svg
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <clipPath id="uk-flag-clip">
                          <circle cx="12" cy="12" r="12" />
                        </clipPath>
                      </defs>
                      <g clipPath="url(#uk-flag-clip)">
                        <rect width="24" height="24" fill="#012169" />
                        <path
                          d="M0 0L24 24M24 0L0 24"
                          stroke="#FFFFFF"
                          strokeWidth="3"
                        />
                        <path
                          d="M0 0L24 24"
                          stroke="#C8102E"
                          strokeWidth="1"
                          strokeDasharray="12"
                          strokeDashoffset="0"
                        />
                        <path
                          d="M24 0L0 24"
                          stroke="#C8102E"
                          strokeWidth="1"
                          strokeDasharray="12"
                          strokeDashoffset="12"
                        />
                        <rect
                          x="9"
                          y="0"
                          width="6"
                          height="24"
                          fill="#FFFFFF"
                        />
                        <rect
                          x="0"
                          y="9"
                          width="24"
                          height="6"
                          fill="#FFFFFF"
                        />
                        <rect
                          x="10"
                          y="0"
                          width="4"
                          height="24"
                          fill="#C8102E"
                        />
                        <rect
                          x="0"
                          y="10"
                          width="24"
                          height="4"
                          fill="#C8102E"
                        />
                      </g>
                      <circle
                        cx="12"
                        cy="12"
                        r="11.75"
                        stroke="#D1D5DB"
                        strokeWidth="0.5"
                        fill="none"
                      />
                    </svg>
                  </>
                )}
              </div>
            </button>

            <AuthDropdown
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
          </div>
        </div>

        <SearchDropdown isOpen={isSearchOpen} onClose={() => closeSearch()} />
      </motion.div>

      {/* --- Mobile Navbar Menu --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-x-0 bottom-0 top-[80px] bg-black/30 z-[90] md:hidden"
            />

            {/* Panel Dropdown (Fullscreen ke Bawah) */}
            <div className="fixed top-[80px] bottom-0 inset-x-0 w-full h-[calc(100vh-80px)] bg-white z-[100] md:hidden flex flex-col border-b border-gray-200 shadow-xl overflow-hidden">
              {/* Area Menu yang Bisa Di-scroll */}
              <div className="overflow-y-auto flex-1 px-6 py-4 custom-scrollbar">
                {/* Beranda */}
                <button
                  onClick={handleHomeClick}
                  className="w-full text-left py-4 font-medium text-gray-700 border-b border-gray-100 text-base"
                >
                  Beranda
                </button>

                {/* Profil */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === "Profil" ? null : "Profil")
                    }
                    className="w-full text-left py-4 font-medium text-gray-700 flex justify-between items-center text-base"
                  >
                    <span
                      className={
                        activeMenu === "Profil" ? "text-[#013a63]" : ""
                      }
                    >
                      Profil
                    </span>
                    {activeMenu === "Profil" ? (
                      <Minus size={18} className="text-[#013a63]" />
                    ) : (
                      <Plus size={18} className="text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {activeMenu === "Profil" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50/50"
                      >
                        {menuData["Profil"].map((subitem) => {
                          let itemHref = "/";

                          if (subitem === "Tentang Kami")
                            itemHref = "/tentang-kami";
                          else if (subitem === "Karir") itemHref = "/careers";
                          else if (subitem === "Kontak")
                            itemHref = "/kontak-kami";
                          else if (subitem === "Syarat & Ketentuan")
                            itemHref = "/syarat-ketentuan";

                          return (
                            <Link
                              key={subitem}
                              href={itemHref}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setActiveMenu(null);
                              }}
                              className="block py-3.5 pl-4 text-gray-600 border-b border-gray-100 text-sm hover:bg-[#013a63]/5 hover:text-[#013a63] transition-colors"
                            >
                              {subitem}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dokter Spesialis */}
                <Link
                  href="/dokter/dokter-spesialis"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-left py-4 font-medium text-gray-700 border-b border-gray-100 text-base"
                >
                  Dokter Spesialis
                </Link>

                {/* Jadwal Dokter */}
                <Link
                  href="/jadwal-dokter"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-left py-4 font-medium text-gray-700 border-b border-gray-100 text-base"
                >
                  Jadwal Dokter
                </Link>

                {/* Menu Dinamis Lainnya */}
                {Object.keys(menuData)
                  .filter((item) => item !== "Profil")
                  .map((item) => (
                    <div key={item} className="border-b border-gray-100">
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === item ? null : item)
                        }
                        className="w-full text-left py-4 font-medium text-gray-700 flex justify-between items-center text-base"
                      >
                        <span
                          className={
                            activeMenu === item ? "text-[#013a63]" : ""
                          }
                        >
                          {item}
                        </span>
                        {activeMenu === item ? (
                          <Minus size={18} className="text-[#013a63]" />
                        ) : (
                          <Plus size={18} className="text-gray-400" />
                        )}
                      </button>

                      <AnimatePresence>
                        {activeMenu === item && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50/50"
                          >
                            {menuData[item].map((subitem) => {
                              let itemHref = "/";

                              if (subitem === "Dokter Spesialis")
                                itemHref = "/dokter/dokter-spesialis";
                              else if (subitem === "Tentang Kami")
                                itemHref = "/tentang-kami";
                              else if (subitem === "Karir")
                                itemHref = "/careers";
                              else if (
                                subitem === "Profil RS Medika Lestari" ||
                                subitem === "Visi & Misi"
                              )
                                itemHref = "/tentang-kami";
                              else if (subitem === "Emergency")
                                itemHref = "/services/emergency";
                              else if (subitem === "Fisioterapi")
                                itemHref = "/services/fisioterapi";
                              else if (subitem === "Kamar Perawatan")
                                itemHref = "/services/kamar-perawatan";
                              else if (subitem === "Medical Checkup")
                                itemHref = "/services/medical-checkup";
                              else if (subitem === "Poli Klinik")
                                itemHref = "/services/poli-klinik";
                              else if (subitem === "Paket Kesehatan")
                                itemHref = "/promo";
                              else if (subitem === "Radiologi")
                                itemHref = "/services/radiologi";
                              else if (subitem === "Rawat Inap")
                                itemHref = "/services/rawat-inap";
                              else if (subitem === "Tarif Kamar")
                                itemHref = "/tarif-kamar";
                              else if (subitem === "Ketersediaan Kamar")
                                itemHref = "/ketersediaan-kamar";
                              else if (subitem === "Alur Pendaftaran")
                                itemHref = "/alur-pendaftaran";
                              else if (subitem === "Asuransi & Rekanan")
                                itemHref = "/asuransi-rekanan";
                              else if (subitem === "Kontak")
                                itemHref = "/kontak-kami";
                              else if (subitem === "Syarat & Ketentuan")
                                itemHref = "/syarat-ketentuan";

                              return (
                                <Link
                                  key={subitem}
                                  href={itemHref}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setActiveMenu(null);
                                  }}
                                  className="block py-3.5 pl-4 text-gray-600 border-b border-gray-100 text-sm hover:bg-[#013a63]/5 hover:text-[#013a63] transition-colors"
                                >
                                  {subitem}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                {/* Area Auth */}
                <div className="pt-6 pb-12">
                  <AuthArea
                    isMobile
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Search */}

      <MobileSearchModalWrapper
        isOpen={isSearchOpen}
        onClose={() => closeSearch()}
      />

      {/* Mobile Quick Action Menu */}
      <div className="md:hidden flex h-10">
        {/* Left Menu - Medical Checkup */}
        <Link
          href="/services/medical-checkup"
          className="flex-1 bg-[#003f88] text-white font-semibold text-center text-xs flex items-center justify-center gap-2 hover:bg-[#013a63] transition-colors"
        >
          <Stethoscope size={16} />
          Medical Checkup
        </Link>

        {/* Right Menu - WhatsApp */}
        <a
          href="https://wa.me/6285717028133"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#009135] text-white font-semibold text-center text-xs flex items-center justify-center gap-2 hover:bg-[#17a34d] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          Butuh Bantuan?
        </a>
      </div>
      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          doctorName="RS Medika Lestari"
          specialty="Konsultasi Umum"
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </nav>
  );
};

export default NavbarClient;

interface AuthDropdownProps {
  readonly activeMenu: string | null;
  readonly setActiveMenu: (menu: string | null) => void;
}

function AuthDropdown({ activeMenu, setActiveMenu }: AuthDropdownProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div
      className="relative h-full flex items-center px-3 cursor-pointer group"
      onMouseEnter={() => setActiveMenu("Auth")}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <button className="flex items-center h-full gap-1 font-medium relative group text-gray-700">
        <Menu size={25} strokeWidth={2} />
        <div
          className={`absolute bottom-0 left-3 right-3 h-1 bg-gray-400 rounded-t-full transition-transform duration-300 ${
            activeMenu === "Auth"
              ? "scale-x-0"
              : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </button>

      <AnimatePresence>
        {activeMenu === "Auth" && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="absolute top-full right-0 bg-white text-white shadow-xl overflow-visible z-50 border-t border-white w-48 mt-2 active:scale-98"
          >
            {/* Arrow/Triangle */}
            <div className=" text-white absolute -top-2 right-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
            <div className="py-2 px-2 grid grid-cols-1">
              {isAuthenticated ? (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setActiveMenu(null)}
                  className="px-2 py-2 text-gray-700  font-mediumtransition-colors flex items-center gap-2 m-1"
                >
                  Dashboard Admin
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={() => setActiveMenu(null)}
                  className="px-2 py-2 text-gray-700 font-medium transition-colors flex items-center gap-2 m-1"
                >
                  <UserRound size={20} />
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AuthArea({
  isMobile,

  onClick,
}: {
  isMobile?: boolean;

  onClick?: () => void;
}) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Link
        href="/admin/dashboard"
        onClick={onClick}
        className={`flex items-center gap-2 font-semibold ${
          isMobile ? "text-gray-700 text-lg" : "text-gray-700 text-sm"
        }`}
        title="Panel Admin"
      >
        <LayoutDashboard size={20} className="text-gray-700" />

        {isMobile && <span>Panel Admin</span>}
      </Link>
    );
  }

  return (
    <Link
      href="/admin/login"
      onClick={onClick}
      className={`flex items-center gap-2 font-semibold ${
        isMobile ? "text-gray-700 text-base" : "text-gray-700 text-sm"
      }`}
      title="Login"
    >
      <UserCircle size={20} className="text-gray-700" />

      {isMobile && <span>Log In</span>}
    </Link>
  );
}
