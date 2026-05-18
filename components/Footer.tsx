"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// --- Sosial Media ---
const socialMedia = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    ),
  },
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/rsmedikalestari",
    icon: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@RSMedikaLestari",
    icon: (
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  },
];

// Menu Utama
const menuItems = [
  { name: "Pasien & Pengunjung", href: "/pasien" },
  { name: "Cari Dokter", href: "/dokter" },
  { name: "Tentang Kami", href: "/tentang-kami" },
  { name: "Donasi", href: "/donasi" },
  { name: "Portal Pasien", href: "/portal" },
  { name: "Lokasi", href: "/lokasi" },
  { name: "Karir", href: "/careers" },
  { name: "Layanan Khusus", href: "/layanan" },
  { name: "Transparansi Biaya", href: "/biaya" },
  { name: "Jadwal Dokter", href: "/jadwal-dokter" },
  { name: "Berita", href: "/news" },
  { name: "Komunitas", href: "/komunitas" },
  { name: "Kamar Perawatan", href: "/services/kamar-perawatan" },
  { name: "Layanan Medis", href: "/services" },
  { name: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
  { name: "Kontak Kami", href: "/kontak-kami" },
];

const FooterContent = () => (
  <div className="bg-[#173A87] text-white">
    {/* --- MAIN SECTION --- */}
    <div className="max-w-[1200px] mx-auto px-8 md:px-16 py-16 md:py-24">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
        {/* Logo */}
        <div className="shrink-0">
          <Image
            src="/logofooter.webp"
            alt="Logo RS Medika Lestari"
            width={400}
            height={400}
            className="brightness-0 invert object-contain"
          />
        </div>
        {/* Deskripsi Atas */}
        <div className="max-w-2xl text-lg md:text-xl leading-relaxed font-light opacity-90">
          <p className="mb-4">
            RS Medika Lestari adalah sistem layanan kesehatan terintegrasi yang
            berdedikasi untuk memberikan perawatan terbaik.
          </p>
          <p>
            Kami menyediakan layanan rawat inap, rawat jalan, dan gawat darurat
            berkualitas tinggi untuk menjamin kesehatan masyarakat.
          </p>
        </div>
      </div>

      {/* --- MENU GRID  --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-12">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-lg md:text-xl font-semibold hover:text-gray-300 transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>

    {/* --- BOTTOM BAR  --- */}
    <div className="bg-white text-[#173A87] py-10 border-t">
      <div className="max-w-[1200px] mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Copyright */}
        <div className="text-sm font-medium opacity-80">
          © {new Date().getFullYear()} RS Medika Lestari. All rights reserved.
        </div>

        {/* Links Kecil di Tengah */}
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Use
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-8 mb-20 md:mb-0">
          {socialMedia.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                {item.icon}
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (!isHomePage) {
    return (
      <footer className="hidden lg:block w-full font-sans">
        <FooterContent />
      </footer>
    );
  }

  return (
    <footer className="w-full font-sans">
      <FooterContent />
    </footer>
  );
};

export default Footer;
