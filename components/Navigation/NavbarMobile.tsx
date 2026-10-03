"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Menu,
  Minus,
  Plus,
  Search,
  Stethoscope,
  UserCircle,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useSearchModal } from "@/context/SearchModalContext";
import { MobileSearchModalWrapper } from "../MobileSearchModalWrapper";

export interface NavbarMobileProps {
  logoNode: React.ReactNode;
}

/* ========================================================= */
/* DATA                                                       */
/* ========================================================= */

const DESKTOP_QUERY = "(min-width: 768px)";

const MENU_DATA: Record<string, string[]> = {
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

// menu selain Profil (Profil dirender lebih dulu)
const OTHER_MENUS = Object.keys(MENU_DATA).filter((key) => key !== "Profil");

//href
const HREF_MAP: Record<string, string> = {
  "Dokter Spesialis": "/dokter/dokter-spesialis",
  "Jadwal Dokter": "/jadwal-dokter",
  "Tentang Kami": "/tentang-kami",
  Karir: "/careers",
  Kontak: "/kontak-kami",
  "Syarat & Ketentuan": "/syarat-ketentuan",
  "Profil RS Medika Lestari": "/tentang-kami",
  "Visi & Misi": "/tentang-kami",
  Emergency: "/services/emergency",
  Fisioterapi: "/services/fisioterapi",
  "Kamar Perawatan": "/services/kamar-perawatan",
  "Medical Checkup": "/services/medical-checkup",
  "Poli Klinik": "/services/poli-klinik",
  "Paket Kesehatan": "/promo",
  Radiologi: "/services/radiologi",
  "Rawat Inap": "/services/rawat-inap",
  "Tarif Kamar": "/tarif-kamar",
  "Ketersediaan Kamar": "/ketersediaan-kamar",
  "Alur Pendaftaran": "/alur-pendaftaran",
  "Asuransi & Rekanan": "/asuransi-rekanan",
};

const getMobileHref = (item: string) => HREF_MAP[item] ?? "/";

/* ========================================================= */
/* AUTH                                                       */
/* ========================================================= */

export function AuthArea({ onClick }: { onClick?: () => void }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Link
        href="/admin/dashboard"
        onClick={onClick}
        className="flex items-center gap-2 text-lg font-semibold text-gray-700"
        title="Panel Admin"
      >
        <LayoutDashboard size={20} aria-hidden="true" />
        <span>Panel Admin</span>
      </Link>
    );
  }

  return (
    <Link
      href="/admin/login"
      onClick={onClick}
      className="flex items-center gap-2 text-base font-semibold text-gray-700"
      title="Login"
    >
      <UserCircle size={20} aria-hidden="true" />
      <span>Log In</span>
    </Link>
  );
}

/* ========================================================= */
/* HELPER                                                     */
/* ========================================================= */

// section yang membuat header tersembunyi
const isHideSection = (section: Element) => {
  const html = section.innerHTML;
  return (
    html.includes("Selamat Datang di Rumah Sakit Medika Lestari") ||
    html.includes("Kisah Pasien") ||
    (section.className.includes("bg-gradient") && html.includes("Mading"))
  );
};

// true jika sedang di dalam / sudah melewati hide section
const isInHideZone = () =>
  Array.from(document.querySelectorAll("section")).some(
    (section) =>
      section.getBoundingClientRect().top <= 0 && isHideSection(section),
  );

// kunci scroll body saat menu terbuka
const useScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;

    const { body, documentElement: html } = document;
    const scrollY = window.scrollY;

    Object.assign(body.style, {
      position: "fixed",
      top: `-${scrollY}px`,
      left: "0",
      width: "100%",
      overflow: "hidden",
    });
    html.style.overflow = "hidden";

    return () => {
      Object.assign(body.style, {
        position: "",
        top: "",
        left: "",
        width: "",
        overflow: "",
      });
      html.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
};

/* ========================================================= */
/* KOMPONEN                                                   */
/* ========================================================= */

export default function NavbarMobile({ logoNode }: NavbarMobileProps) {
  const pathname = usePathname();
  const { isSearchOpen, openSearch, closeSearch } = useSearchModal();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const lastScrollY = useRef(0);

  // tutup menu saat route berubah
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
    setActiveMenu(null);
  }

  // tutup search saat route berubah
  useEffect(() => {
    closeSearch();
  }, [pathname, closeSearch]);

  useScrollLock(isMenuOpen);

  // hide / show header saat scroll (mobile saja)
  useEffect(() => {
    if (isMenuOpen) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;

      if (window.matchMedia(DESKTOP_QUERY).matches) {
        setIsVisible(true);
      } else if (isInHideZone()) {
        setIsVisible(false);
      } else {
        setIsVisible(!(y > lastScrollY.current && y > 50));
      }

      lastScrollY.current = y;
    };

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [isMenuOpen]);

  // reset saat layar berubah ke desktop
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (e: MediaQueryListEvent) => {
      if (!e.matches) return;
      setIsMenuOpen(false);
      setActiveMenu(null);
      closeSearch();
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [closeSearch]);

  const showHeader = isVisible || isMenuOpen;

  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveMenu(null);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      // tunggu scroll lock dilepas
      requestAnimationFrame(() =>
        window.scrollTo({ top: 0, behavior: "smooth" }),
      );
    }
    closeMenu();
  };

  //accordion
  const renderAccordion = (key: string) => {
    const isOpen = activeMenu === key;

    return (
      <li key={key} className="border-b border-gray-100">
        {/* button */}
        <button
          type="button"
          onClick={() => setActiveMenu(isOpen ? null : key)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-gray-700"
        >
          <span className={isOpen ? "text-[#013a63]" : ""}>{key}</span>
          {isOpen ? (
            <Minus size={18} className="text-[#013a63]" aria-hidden="true" />
          ) : (
            <Plus size={18} className="text-gray-400" aria-hidden="true" />
          )}
        </button>

        {/* submenu */}
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-gray-50/50"
            >
              {MENU_DATA[key].map((item) => (
                <li key={item}>
                  <Link
                    href={getMobileHref(item)}
                    onClick={closeMenu}
                    className="block border-b border-gray-100 py-3.5 pl-4 text-sm text-gray-600 transition-colors hover:bg-[#013a63]/5 hover:text-[#013a63]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  };

  return (
    <div className="md:hidden">
      {/* top bar */}
      <motion.div
        initial={{ height: "auto", opacity: 1 }}
        animate={{
          height: showHeader ? "auto" : 0,
          opacity: showHeader ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden bg-white will-change-[height,opacity]"
      >
        <div className="relative py-4">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4">
            {/* logo */}
            <Link
              href="/"
              aria-label="Beranda RS Medika Lestari"
              className="flex scale-80 items-center"
            >
              {logoNode}
            </Link>

            {/* actions */}
            <div className="relative z-[110] flex items-center gap-3 p-2 text-gray-700">
              {/* search */}
              <button
                type="button"
                onClick={() => openSearch()}
                className="p-2"
                aria-label="Cari dokter"
                title="Cari dokter"
              >
                <Search size={28} aria-hidden="true" />
              </button>

              {/* menu */}
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="p-2"
                aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu-panel"
              >
                {isMenuOpen ? (
                  <X size={28} aria-hidden="true" />
                ) : (
                  <Menu size={28} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* menu panel */}
      {isMenuOpen && (
        <>
          {/* backdrop */}
          <div
            onClick={closeMenu}
            aria-hidden="true"
            className="fixed inset-x-0 bottom-0 top-[80px] z-[90] bg-black/30"
          />

          {/* panel */}
          <div
            id="mobile-menu-panel"
            className="fixed inset-x-0 bottom-0 top-[80px] z-[100] flex h-[calc(100vh-80px)] w-full flex-col overflow-hidden border-b border-gray-200 bg-white shadow-xl"
          >
            <nav
              aria-label="Menu mobile"
              className="custom-scrollbar flex-1 overflow-y-auto px-6 py-4"
            >
              <ul>
                {/* home */}
                <li className="border-b border-gray-100">
                  <Link
                    href="/"
                    onClick={handleHomeClick}
                    className="block w-full py-4 text-left text-base font-medium text-gray-700"
                  >
                    Beranda
                  </Link>
                </li>

                {/* profil */}
                {renderAccordion("Profil")}

                {/* dokter */}
                <li className="border-b border-gray-100">
                  <Link
                    href="/dokter/dokter-spesialis"
                    onClick={closeMenu}
                    className="block py-4 text-left text-base font-medium text-gray-700"
                  >
                    Dokter Spesialis
                  </Link>
                </li>

                {/* jadwal */}
                <li className="border-b border-gray-100">
                  <Link
                    href="/jadwal-dokter"
                    onClick={closeMenu}
                    className="block py-4 text-left text-base font-medium text-gray-700"
                  >
                    Jadwal Dokter
                  </Link>
                </li>

                {/* menu lain */}
                {OTHER_MENUS.map(renderAccordion)}

                {/* auth */}
                <li className="pb-12 pt-6">
                  <AuthArea onClick={closeMenu} />
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* search modal */}
      <MobileSearchModalWrapper
        isOpen={isSearchOpen}
        onClose={() => closeSearch()}
      />

      {/* quick actions */}
      <nav aria-label="Aksi cepat" className="flex h-10">
        {/* checkup */}
        <Link
          href="/services/medical-checkup"
          className="flex flex-1 items-center justify-center gap-2 bg-[#003f88] text-center text-xs font-semibold text-white transition-colors hover:bg-[#013a63]"
        >
          <Stethoscope size={16} aria-hidden="true" />
          Medical Checkup
        </Link>

        {/* whatsapp */}
        <a
          href="https://wa.me/6285717028133"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 bg-[#009135] text-center text-xs font-semibold text-white transition-colors hover:bg-[#17a34d]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          Butuh Bantuan?
        </a>
      </nav>
    </div>
  );
}
