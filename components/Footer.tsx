"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// --- Sosial Media ---
const socialMedia = [
  {
    name: "TikTok",
    href: "https://www.tiktok.com",
    icon: (
      <path d="M12.525.229a.114.114 0 0 0-.114.115v3.197a.114.114 0 0 0 .114.115 5.253 5.253 0 0 0 3.193 1.082.114.114 0 0 0 .115-.114V1.43a.114.114 0 0 0-.115-.114 8.614 8.614 0 0 1-3.393-1.087ZM8.6 1.43v12.221a3.522 3.522 0 1 1-3.522-3.522c.162 0 .324.011.484.033a.114.114 0 0 0 .129-.113v-3.2a.114.114 0 0 0-.1-.114 6.915 6.915 0 1 0 6.531 6.916V4.629A8.614 8.614 0 0 0 15.515 8.1a.114.114 0 0 0 .115-.114V4.79a.114.114 0 0 0-.115-.114 5.176 5.176 0 0 1-3.393-2.133.114.114 0 0 0-.115-.114H8.714A.114.114 0 0 0 8.6 1.43Z" />
    ),
  },
  {
    name: "Google Maps",
    href: "https://maps.app.goo.gl/1fZG92uPavXcaaaE8",
    icon: (
      <path d="M12 0C7.582 0 4 3.582 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.418-3.582-8-8-8zm0 11.5A3.5 3.5 0 1112 4.5a3.5 3.5 0 010 7z" />
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
    name: "YouTube",
    href: "https://www.youtube.com/@RSMedikaLestari",
    icon: (
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  },
];

// Menu Utama
const menuItems = [
  { name: "Dokter Spesialis", href: "/dokter" },
  { name: "Tentang Kami", href: "/tentang-kami" },
  { name: "Portal Pasien", href: "/portal" },
  { name: "Karir", href: "/careers" },
  { name: "Jadwal Dokter", href: "/jadwal-dokter" },
  { name: "Kamar Perawatan", href: "/services/kamar-perawatan" },
  { name: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
  { name: "Kontak Kami", href: "/kontak-kami" },
];

const FooterContent = () => (
  <div className="bg-[#003f88] text-white">
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
    <div className="bg-white text-[#003f88] py-6 border-t">
      <div className="max-w-[1200px] mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Copyright */}
        <div className="text-sm font-normal opacity-80 text-black">
          © {new Date().getFullYear()} RS Medika Lestari. All rights reserved.
        </div>

        {/* Links Kecil di Tengah */}
        <div className="flex gap-6 text-sm font-normal opacity-80 text-black">
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
