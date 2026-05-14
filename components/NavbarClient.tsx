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
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthProvider";
import { useSearchModal } from "@/context/SearchModalContext";
import SearchDropdown from "./SearchDropdown";
import MobileSearchModal from "./MobileSearchModal";
import DropdownMenuItem from "./DropdownMenuItem";
import { usePathname, useRouter } from "next/navigation";

interface NavbarClientProps {
  logoNode: React.ReactNode;
}

const NavbarClient: React.FC<NavbarClientProps> = ({ logoNode }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isSearchOpen, openSearch, closeSearch } = useSearchModal();

  const [isVisible, setIsVisible] = useState(true);

  const [lastScrollY, setLastScrollY] = useState(0);

  const pathname = usePathname();

  const router = useRouter();

  /* ===============================

     SCROLL CONTROL UNTUK TOP NAVBAR

  =============================== */

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
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

    "Informasi Pasien": [
      "Alur Pendaftaran",
      "Asuransi & Rekanan",
      "Panduan Kunjungan",
      "Tarif Kamar",
    ],

    Profil: [
      "Indikator Mutu",
      "Karir",
      "Kontak",
      "Rekanan Kami",
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

  const languages = [{ label: "Bahasa Indonesia", code: "ID", active: true }];

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
        className={`absolute top-full bg-white text-gray-800 shadow-xl overflow-hidden z-50  ${
          isLargeMenu ? "w-[600px] -left-20" : widthClass
        }`}
        style={{ borderTopColor: "#0084BF" }}
      >
        <div
          className={`py-2 grid ${isLargeMenu ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {items.map((item) => {
            const title = typeof item === "string" ? item : item.label;

            let itemHref = "/";

            if (title === "Dokter Spesialis")
              itemHref = "/dokter#section-dokter";
            else if (title === "Jadwal Dokter") itemHref = "/jadwal-dokter";
            else if (title === "Tentang Kami") itemHref = "/tentang-kami";
            else if (title === "Indikator Mutu") itemHref = "/indikator-mutu";
            else if (title === "Rekanan Kami") itemHref = "/rekanan-kami";
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
        <div className="py-2 relative">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex justify-between items-center">
            <Link href="/" className="flex items-center">
              {logoNode}
            </Link>

            <div className="hidden md:flex gap-2 items-center text-[15px] font-normal text-gray-700">
              {/* Social Media Icons - Kiri */}
              <div className="flex items-center gap-4">
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@rsmedikalestari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-opacity hover:opacity-70 active:scale-95"
                >
                  <svg className="w-4 h-4 fill-[#FF0000]" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>

                  <span className="text-xs text-gray-500">
                    RS Medika Lestari
                  </span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/6215858585858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-opacity hover:opacity-70 active:scale-95"
                >
                  <svg className="w-3 h-3 fill-[#25D366]" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.938 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>

                  <span className="text-xs text-gray-500">+62815858585858</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/rsmedikalestari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-opacity hover:opacity-70 active:scale-95"
                >
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="url(#instagramGradient)"
                  >
                    <defs>
                      <linearGradient
                        id="instagramGradient"
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#F58529" />
                        <stop offset="25%" stopColor="#FEDA77" />
                        <stop offset="50%" stopColor="#DD2A7B" />
                        <stop offset="75%" stopColor="#8134AF" />
                        <stop offset="100%" stopColor="#515BD4" />
                      </linearGradient>
                    </defs>

                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.62 6.77 6.98 6.97 1.28.058 1.688.072 4.948.072 3.26 0 3.668-.014 4.948-.072 4.354-.2 6.77-2.62 6.97-6.97.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.77-6.97-6.97C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>

                  <span className="text-xs text-gray-500">
                    @rsmedikalestari
                  </span>
                </a>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-3 p-2 text-gray-700 relative z-110">
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

      <div className="hidden md:block relative w-full bg-[#014f86] text-white z-30 ">
        <div
          className="absolute right-0 top-0 h-full w-[37%] bg-[#013a63] hidden lg:block"
          style={{ clipPath: "polygon(46px 0, 100% 0, 100% 100%, 0% 100%)" }}
        />

        <div className="max-w-[1220px] mx-auto px-4 md:px-8 flex justify-between items-center h-12 relative z-10">
          <div className="flex h-full text-[15px]">
            <button
              onClick={handleHomeClick}
              className="flex items-center h-full px-6 transition-colors font-medium relative group cursor-pointer"
            >
              Beranda
              <div
                className={`absolute bottom-0 left-6 right-6 h-1 bg-white rounded-t-full transition-transform duration-300 ${
                  pathname === "/"
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>

            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMenu("Profil")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center h-full px-6 transition-colors font-medium relative group gap-2">
                Profil
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    activeMenu === "Profil" ? "rotate-180" : ""
                  }`}
                />
                <div
                  className={`absolute bottom-0 left-6 right-6 h-1 bg-white rounded-t-full transition-transform duration-300 ${
                    activeMenu === "Profil"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeMenu === "Profil" &&
                  renderDropdownContent(menuData["Profil"], "left-0 w-56")}
              </AnimatePresence>
            </div>

            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMenu("Dokter Kami")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center h-full px-6 transition-colors font-medium relative group gap-2">
                Dokter Kami
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    activeMenu === "Dokter Kami" ? "rotate-180" : ""
                  }`}
                />
                <div
                  className={`absolute bottom-0 left-6 right-6 h-1 bg-white rounded-t-full transition-transform duration-300 ${
                    activeMenu === "Dokter Kami"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeMenu === "Dokter Kami" &&
                  renderDropdownContent(
                    ["Dokter Spesialis", "Jadwal Dokter"],

                    "left-0 w-56",
                  )}
              </AnimatePresence>
            </div>

            {Object.keys(menuData)

              .filter((item) => item !== "Profil")

              .map((item) => (
                <div
                  key={item}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveMenu(item)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button className="flex items-center h-full px-6 transition-colors font-medium relative group gap-2">
                    {item}
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        activeMenu === item ? "rotate-180" : ""
                      }`}
                    />

                    <div
                      className={`absolute bottom-0 left-6 right-6 h-1 bg-white rounded-t-full transition-transform duration-300 ${
                        activeMenu === item
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {activeMenu === item &&
                      renderDropdownContent(
                        menuData[item],
                        "left-0 w-72",
                        item,
                      )}
                  </AnimatePresence>
                </div>
              ))}
          </div>

          <div className="flex items-center h-full gap-2 text-[15px]">
            <button
              onClick={() => openSearch()}
              className="flex items-center gap-2 transition-all h-full px-3 relative group"
            >
              <Search size={20} strokeWidth={2.5} />

              <span className="font-medium">Cari Dokter Spesialis</span>

              <div
                className={`absolute bottom-0 left-3 right-3 h-1 bg-white rounded-t-full transition-transform duration-300 ${
                  isSearchOpen
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>

            <div
              className="relative h-full flex items-center px-3 cursor-pointer group"
              onMouseEnter={() => setActiveMenu("Lang")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="flex items-center gap-1 px-1 -py-1 border border-white rounded-full">
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rounded-full"
                >
                  {/* Circular background */}
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    fill="#E5E7EB"
                    stroke="#D1D5DB"
                    strokeWidth="0.5"
                  />

                  {/* Indonesia flag in circle */}
                  {/* Red top half */}
                  <path
                    d="M 2 12 C 2 6.48 6.48 2 12 2 C 17.52 2 22 6.48 22 12 L 12 12 Z"
                    fill="#FF0000"
                  />

                  {/* White bottom half */}
                  <path
                    d="M 2 12 L 12 12 C 17.52 12 22 17.52 22 12 C 22 17.52 17.52 22 12 22 C 6.48 22 2 17.52 2 12 Z"
                    fill="#FFFFFF"
                  />
                </svg>

                <span className="font-medium">ID</span>
              </div>

              <div
                className={`absolute bottom-0 left-3 right-3 h-1 bg-white rounded-t-full transition-transform duration-300 ${
                  activeMenu === "Lang"
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />

              <AnimatePresence>
                {activeMenu === "Lang" &&
                  renderDropdownContent(languages, "right-0 w-48")}
              </AnimatePresence>
            </div>

            <div className="flex items-center px-3 h-full transition-colors">
              <AuthArea />
            </div>
          </div>
        </div>

        <SearchDropdown isOpen={isSearchOpen} onClose={() => closeSearch()} />
      </div>

      {/* --- Mobile Menu --- */}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[99] md:hidden"
            />

            {/* Panel */}

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] bg-white z-[100] md:hidden overflow-y-auto shadow-2xl pt-16"
            >
              <div className="flex flex-col p-4">
                <button
                  onClick={handleHomeClick}
                  className="text-left p-4 font-semibold text-[#014f86] border-b text-lg"
                >
                  Beranda
                </button>

                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === "Profil" ? null : "Profil")
                  }
                  className="w-full text-left p-4 font-semibold text-[#014f86] flex justify-between items-center text-lg border-b"
                >
                  Profil
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${
                      activeMenu === "Profil" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeMenu === "Profil" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-gray-50"
                    >
                      {menuData["Profil"].map((subitem) => {
                        let itemHref = "/";

                        if (subitem === "Tentang Kami")
                          itemHref = "/tentang-kami";
                        else if (subitem === "Indikator Mutu")
                          itemHref = "/indikator-mutu";
                        else if (subitem === "Rekanan Kami")
                          itemHref = "/rekanan-kami";
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
                            className="block p-4 pl-8 text-gray-600 border-b text-sm hover:bg-[#013a63]/10 hover:text-[#013a63] transition-colors"
                          >
                            {subitem}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Link
                  href="/dokter#section-dokter"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left p-4 font-semibold text-[#014f86] border-b text-lg"
                >
                  Dokter Spesialis
                </Link>

                <Link
                  href="/jadwal-dokter"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left p-4 font-semibold text-[#014f86] border-b text-lg"
                >
                  Jadwal Dokter
                </Link>

                {Object.keys(menuData)

                  .filter((item) => item !== "Profil")

                  .map((item) => (
                    <div key={item} className="border-b">
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === item ? null : item)
                        }
                        className="w-full text-left p-4 font-semibold text-[#014f86] flex justify-between items-center text-lg"
                      >
                        {item}

                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-300 ${
                            activeMenu === item ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeMenu === item && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50"
                          >
                            {menuData[item].map((subitem) => {
                              let itemHref = "/";

                              if (subitem === "Dokter Spesialis")
                                itemHref = "/dokter#section-dokter";
                              else if (subitem === "Tentang Kami")
                                itemHref = "/tentang-kami";
                              else if (subitem === "Indikator Mutu")
                                itemHref = "/indikator-mutu";
                              else if (subitem === "Rekanan Kami")
                                itemHref = "/rekanan-kami";
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

                              return (
                                <Link
                                  key={subitem}
                                  href={itemHref}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);

                                    setActiveMenu(null);
                                  }}
                                  className="block p-4 pl-8 text-gray-600 border-b text-sm hover:bg-[#013a63]/10 hover:text-[#013a63] transition-colors"
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

                <div className="mt-6 px-4">
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

      <MobileSearchModal isOpen={isSearchOpen} onClose={() => closeSearch()} />

      {/* Mobile Quick Action Menu */}

      <div className="md:hidden flex h-10 ">
        {/* Left Menu - Medical Checkup */}

        <Link
          href="/services/medical-checkup"
          className="flex-1 bg-[#014f86] text-white font-semibold text-center text-xs flex items-center justify-center gap-2 hover:bg-[#013a63] transition-colors"
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
    </nav>
  );
};

export default NavbarClient;

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
        className={`flex items-center gap-2 font-medium ${
          isMobile ? "text-[#014f86] text-lg" : "text-white text-sm "
        }`}
        title="Panel Admin"
      >
        <LayoutDashboard size={isMobile ? 24 : 20} />

        {isMobile && <span>DASHBOARD ADMIN</span>}
      </Link>
    );
  }

  return (
    <Link
      href="/admin/login"
      onClick={onClick}
      className={`flex items-center gap-2 font-medium ${
        isMobile ? "text-gray-600 text-lg" : "text-white text-sm"
      }`}
      title="Login"
    >
      <UserCircle size={isMobile ? 24 : 20} />

      {isMobile && <span>Login</span>}
    </Link>
  );
}
