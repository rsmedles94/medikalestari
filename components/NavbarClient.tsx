"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Globe,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthProvider";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  /* ===============================
     LOCK BODY SCROLL SAAT MENU MOBILE AKTIF
  =============================== */
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
      "Tarif Kamar",
      "Alur Pendaftaran",
      "Asuransi & Rekanan",
      "Panduan Kunjungan",
    ],
    Profil: ["Tentang Kami", "Indikator Mutu", "Rekanan Kami", "Karir"],
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

  const languages = [
    { label: "Bahasa Indonesia", code: "ID", active: true },
    { label: "English", code: "EN", active: false },
  ];

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
  ) => {
    // --- LOGIKA BARU: Cek jika item banyak, kita buat 2 kolom ---
    const isLargeMenu = items.length > 6;

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

            if (title === "Dokter Kami") itemHref = "/dokter#section-dokter";
            else if (title === "Jadwal Dokter") itemHref = "/jadwal-dokter";
            else if (title === "Tentang Kami") itemHref = "/tentang-kami";
            else if (title === "Indikator Mutu") itemHref = "/indikator-mutu";
            else if (title === "Rekanan Kami") itemHref = "/rekanan-kami";
            else if (title === "Karir") itemHref = "/careers";
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
                  icon={serviceIcons[title as keyof typeof serviceIcons]}
                />
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <nav className="w-full font-sans sticky top-0 z-[100] bg-white shadow-sm">
      {/* --- Top Navbar --- */}
      <div className="bg-white py-2 relative z-[101]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            {logoNode}
          </Link>

          <div className="hidden md:flex gap-4 items-center text-[15px] font-normal text-gray-700">
            <Link
              href="/kontak-kami"
              className="hover:text-[#009C96] hover:underline"
            >
              Kontak
            </Link>

            <span className="text-gray-300">|</span>

            <Link
              href="/syarat-ketentuan"
              className="hover:text-[#009C96] hover:underline"
            >
              Syarat & Ketentuan
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3 p-2 text-gray-700 relative z-[110]">
            <button
              onClick={() => setIsMobileSearchOpen(true)}
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

      {/* --- Bottom Navbar --- */}
      <div className="hidden md:block relative w-full bg-[#006360] text-white z-30">
        <div
          className="absolute right-0 top-0 h-full w-[38%] bg-[#009C96] hidden lg:block"
          style={{ clipPath: "polygon(40px 0, 100% 0, 100% 100%, 0% 100%)" }}
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
              <button className="flex items-center h-full px-6 transition-colors font-medium relative group">
                Profil
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
              onMouseEnter={() => setActiveMenu("Dokter")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center h-full px-6 transition-colors font-medium relative group">
                Dokter
                <div
                  className={`absolute bottom-0 left-6 right-6 h-1 bg-white rounded-t-full transition-transform duration-300 ${
                    activeMenu === "Dokter"
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeMenu === "Dokter" &&
                  renderDropdownContent(
                    ["Dokter Kami", "Jadwal Dokter"],
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
                  <button className="flex items-center h-full px-6 transition-colors font-medium relative group">
                    {item}

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
                      renderDropdownContent(menuData[item], "left-0 w-72")}
                  </AnimatePresence>
                </div>
              ))}
          </div>

          <div className="flex items-center h-full gap-2 text-[15px]">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center gap-2 transition-all h-full px-3 relative group"
            >
              <Search size={20} strokeWidth={2.5} />
              <span className="font-medium">Cari Dokter Kami</span>

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
              <div className="flex items-center gap-1 px-1 py-1">
                <Globe size={18} />
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

        <SearchDropdown
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
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
                  className="text-left p-4 font-semibold text-[#006360] border-b text-lg"
                >
                  Beranda
                </button>

                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === "Profil" ? null : "Profil")
                  }
                  className="w-full text-left p-4 font-semibold text-[#006360] flex justify-between items-center text-lg border-b"
                >
                  Profil
                  <motion.span
                    animate={{ rotate: activeMenu === "Profil" ? 180 : 0 }}
                  >
                    ▼
                  </motion.span>
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

                        return (
                          <Link
                            key={subitem}
                            href={itemHref}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setActiveMenu(null);
                            }}
                            className="block p-4 pl-8 text-gray-600 border-b text-sm hover:bg-[#009C96]/10 hover:text-[#009C96] transition-colors"
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
                  className="text-left p-4 font-semibold text-[#006360] border-b text-lg"
                >
                  Dokter Kami
                </Link>

                <Link
                  href="/jadwal-dokter"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left p-4 font-semibold text-[#006360] border-b text-lg"
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
                        className="w-full text-left p-4 font-semibold text-[#006360] flex justify-between items-center text-lg"
                      >
                        {item}

                        <motion.span
                          animate={{ rotate: activeMenu === item ? 180 : 0 }}
                        >
                          ▼
                        </motion.span>
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

                              if (subitem === "Tentang Kami")
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
                                  className="block p-4 pl-8 text-gray-600 border-b text-sm hover:bg-[#009C96]/10 hover:text-[#009C96] transition-colors"
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
      <MobileSearchModal
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />

      {/* Mobile Quick Action Menu */}
      <div className="md:hidden flex h-10">
        {/* Left Menu - Medical Checkup */}
        <Link
          href="/services/medical-checkup"
          className="flex-1 bg-[#006360] text-white font-semibold text-center text-xs flex items-center justify-center gap-2 hover:bg-[#003d39] transition-colors"
        >
          <Stethoscope size={16} />
          Medical Checkup
        </Link>

        {/* Right Menu - Phone */}
        <a
          href="tel:021-585-4858"
          className="flex-1 bg-red-500 text-white font-semibold text-center text-xs flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
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
          isMobile ? "text-[#006360] text-lg" : "text-white text-sm "
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
