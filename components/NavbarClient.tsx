"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";

import {
  Search,
  Menu,
  X,
  UserCircle,
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
import SearchDropdown from "./SearchDropdown";
import { MobileSearchModalWrapper } from "./MobileSearchModalWrapper";
import DropdownMenuItem from "./DropdownMenuItem";
import BookingForm from "./BookingForm";
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

  /* ===============================

     SCROLL CONTROL UNTUK TOP NAVBAR

  =============================== */

  useEffect(() => {
    const controlNavbar = () => {
      // Deteksi PromoKesehatan, ServiceSection, dan MadingSection
      const allSections = document.querySelectorAll("section");
      let isInHideZone = false; // Sedang di dalam PromoKesehatan, ServiceSection, atau MadingSection
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
          // Cek apakah sedang DI dalam section ini (top section sudah masuk ke atas viewport)
          // rect.top <= 0 berarti section sudah masuk dari atas
          // rect.bottom > 0 berarti masih ada bagian yang terlihat
          isInHideZone = isInHideZone || (rect.top <= 0 && rect.bottom > 0);

          // Cek apakah sudah sepenuhnya melewati section (bottom section keluar dari bawah viewport)
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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
    };
  }, [isMobileMenuOpen]);

  // Tutup menu dropdown pencarian saat nama jalur berubah
  useEffect(() => {
    closeSearch();
  }, [pathname, closeSearch]);

  const menuData: Record<string, string[]> = {
    "Fasilitas & Layanan": [
      "Emergency",
      "Farmasi",
      "Fisioterapi",
      "Kamar Perawatan",
      "Laboratory Testing",
      "Layanan gawat darurat",
      "Medical Checkup",
      "Poli Klinik",
      "Radiologi",
      "Rawat Inap",
      "Rehabilitasi Medik",
      "Vaccination Services",
    ],

    "Portal Pasien": [
      "Alur Pendaftaran",
      "Asuransi & Rekanan",
      "Tarif Kamar",
      "Ketersediaan Kamar",
    ],

    Profil: [
      "Karir",
      "Kontak",
      "Syarat & Ketentuan",
      "Tentang Kami",
    ],
  };

  const serviceIcons: Record<string, React.ReactNode> = {
    Emergency: <Ambulance size={20} strokeWidth={1.5} />,
    Farmasi: <Pill size={20} strokeWidth={1.5} />,
    Fisioterapi: <Activity size={20} strokeWidth={1.5} />,
    "Kamar Perawatan": <Hotel size={20} strokeWidth={1.5} />,
    "Laboratory Testing": <Microscope size={20} strokeWidth={1.5} />,
    "Layanan gawat darurat": <Siren size={20} strokeWidth={1.5} />,
    "Medical Checkup": <Heart size={20} strokeWidth={1.5} />,
    "Poli Klinik": <Stethoscope size={20} strokeWidth={1.5} />,
    Radiologi: <Radio size={20} strokeWidth={1.5} />,
    "Rawat Inap": <Bed size={20} strokeWidth={1.5} />,
    "Rehabilitasi Medik": <Dumbbell size={20} strokeWidth={1.5} />,
    "Vaccination Services": <Syringe size={20} strokeWidth={1.5} />,
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
    // --- LOGIKA BARU: Cek jika item banyak, kita buat 2 kolom ---

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
          className={`py-4 px-2 grid ${isLargeMenu ? "grid-cols-2" : "grid-cols-1"}`}
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
            else if (title === "Farmasi") itemHref = "/services/farmasi";
            else if (title === "Fisioterapi")
              itemHref = "/services/fisioterapi";
            else if (title === "Kamar Perawatan")
              itemHref = "/services/kamar-perawatan";
            else if (title === "Laboratory Testing")
              itemHref = "/services/laboratory-testing";
            else if (title === "Layanan gawat darurat")
              itemHref = "/services/layanan-gawat-darurat";
            else if (title === "Medical Checkup")
              itemHref = "/services/medical-checkup";
            else if (title === "Poli Klinik")
              itemHref = "/services/poli-klinik";
            else if (title === "Radiologi") itemHref = "/services/radiologi";
            else if (title === "Rawat Inap") itemHref = "/services/rawat-inap";
            else if (title === "Rehabilitasi Medik")
              itemHref = "/services/rehabilitasi-medik";
            else if (title === "Vaccination Services")
              itemHref = "/services/vaccination-services";
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Cari dokter"
              >
                <Search size={24} />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
              <Search size={20} strokeWidth={3} />

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-[4px] z-99 md:hidden"
            />

            {/* Panel: Dropdown dari Atas, Full Screen Scrollable */}
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
              className="fixed top-0 inset-x-0 w-full max-h-screen bg-white z-100 md:hidden flex flex-col shadow-xl border-b border-gray-200/40 rounded-b-2xl"
            >
              {/* Header di dalam panel untuk tombol close agar posisinya stabil */}
              <div className="flex justify-end p-4 border-b border-gray-100/50 min-h-[64px] items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Tutup menu"
                >
                  <X size={22} className="text-gray-500" />
                </button>
              </div>

              {/* Area Menu yang Bisa Di-scroll */}
              <div className="overflow-y-auto flex-1 px-6 pb-8 custom-scrollbar">
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
                              else if (subitem === "Farmasi")
                                itemHref = "/services/farmasi";
                              else if (subitem === "Fisioterapi")
                                itemHref = "/services/fisioterapi";
                              else if (subitem === "Kamar Perawatan")
                                itemHref = "/services/kamar-perawatan";
                              else if (subitem === "Laboratory Testing")
                                itemHref = "/services/laboratory-testing";
                              else if (subitem === "Layanan gawat darurat")
                                itemHref = "/services/layanan-gawat-darurat";
                              else if (subitem === "Medical Checkup")
                                itemHref = "/services/medical-checkup";
                              else if (subitem === "Poli Klinik")
                                itemHref = "/services/poli-klinik";
                              else if (subitem === "Radiologi")
                                itemHref = "/services/radiologi";
                              else if (subitem === "Rawat Inap")
                                itemHref = "/services/rawat-inap";
                              else if (subitem === "Rehabilitasi Medik")
                                itemHref = "/services/rehabilitasi-medik";
                              else if (subitem === "Vaccination Services")
                                itemHref = "/services/vaccination-services";
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
                <div className="pt-6">
                  <AuthArea
                    isMobile
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Search */}

      <MobileSearchModalWrapper
        isOpen={isSearchOpen}
        onClose={() => closeSearch()}
      />

      {/* Mobile Quick Action Menu */}

      <div className="md:hidden flex h-10 ">
        {/* Left Menu - Medical Checkup */}

        <Link
          href="/services/medical-checkup"
          className="flex-1 bg-[#003f88] text-white font-semibold text-center text-xs flex items-center justify-center gap-2 hover:bg-[#013a63] transition-colors"
        >
          <Stethoscope size={16} />
          Medical Checkup
        </Link>

        {/* Right Menu - Phone */}

        <a
          href="tel:021-585-4858"
          className="flex-1 bg-red-600 text-white font-semibold text-center text-xs flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
        >
          <Phone size={16} />
          (021) 585 4858
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
        <Menu size={20} strokeWidth={2} />
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
            className="absolute top-full right-0 bg-[#003f88] text-white shadow-xl overflow-visible z-50 border-t border-[#003f88] w-48 mt-2"
          >
            {/* Arrow/Triangle */}
            <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#003f88]"></div>
            <div className="py-2 px-2 grid grid-cols-1">
              {isAuthenticated ? (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setActiveMenu(null)}
                  className="px-4 py-4 text-white font-medium hover:bg-white hover:text-[#003f88] transition-colors flex items-center gap-2 m-1"
                >
                  Dashboard Admin
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={() => setActiveMenu(null)}
                  className="px-4 py-4 text-white font-medium transition-colors flex items-center gap-2 m-1"
                >
                  <UserCircle size={18} />
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
          isMobile
            ? "p-4 text-gray-700 text-lg border-b"
            : "text-gray-700 text-sm"
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
        isMobile
          ? "p-4 text-gray-700 text-base border-b"
          : "text-gray-700 text-sm"
      }`}
      title="Login"
    >
      <UserCircle size={20} className="text-gray-700" />

      {isMobile && <span>Login</span>}
    </Link>
  );
}
