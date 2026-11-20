"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import BookingModalFloating from "./BookingModalFloating";

// --- Kontak ---
const PHONE_DISPLAY = "+62 857-1702-8133";

// --- Sosial Media ---
const socialMedia = [
  {
    name: "Google Maps",
    href: "https://maps.app.goo.gl/1fZG92uPavXcaaaE8",
    icon: (
      <path d="M12 0C7.582 0 4 3.582 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.418-3.582-8-8-8zm0 11.5A3.5 3.5 0 1112 4.5a3.5 3.5 0 010 7z" />
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@rsmedikalestariciledug",
    icon: (
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25h-3.13v12.98a2.8 2.8 0 1 1-2.8-2.8c.31 0 .61.05.89.15V9.59a6.03 6.03 0 0 0-.89-.07A5.94 5.94 0 1 0 15.82 15V8.39a8.03 8.03 0 0 0 4.69 1.5V6.69h-.92z" />
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

// Daftar spesialis (sama persis dengan menu "Temukan Dokter" di Navbar)
const specialtyItems = [
  "Spesialis Anak",
  "Spesialis Bedah Umum",
  "Spesialis Saraf",
  "Spesialis Orthopedi",
  "Spesialis Paru",
  "Spesialis Jantung & Pembuluh Darah",
  "Spesialis THT",
  "Spesialis Penyakit Dalam",
  "Spesialis Mata",
  "Spesialis Obgyn",
  "Spesialis Gigi",
  "Spesialis Fisioterapi",
];

const LINK_CLASS =
  "text-base font-normal hover:text-[#e67e22] hover:underline transition-colors duration-700";

// Form newsletter: saat Subscribe ditekan, pengunjung diarahkan ke halaman
// Kontak Kami dan kolom email di formulir terisi otomatis (?email=...)
const NewsletterForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subscriberEmail = email.trim();
    if (!subscriberEmail) return;

    router.push(`/kontak-kami?email=${encodeURIComponent(subscriberEmail)}`);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[460px]">
      <label htmlFor="footer-newsletter" className="block text-base mb-2">
        Kritik & saran :
      </label>
      <div className="flex w-full overflow-hidden rounded-md">
        <input
          id="footer-newsletter"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Alamat Email"
          autoComplete="email"
          className="w-full min-w-0 bg-white px-4 py-3 text-sm font-normal text-neutral-700 placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 cursor-pointer bg-[#e67e22] px-6 py-3 text-sm font-bold text-white transition-colors duration-700 hover:bg-[#3D8ECB]"
        >
          Kirim
        </button>
      </div>
    </form>
  );
};

interface FooterContentProps {
  // membuka modal form janji temu
  onOpenBooking: () => void;
}

const FooterContent = ({ onOpenBooking }: FooterContentProps) => (
  <div className="bg-[#003f88] text-white">
    {/*  Kontainer Utama  */}
    <div className="max-w-[1310px] mx-auto px-8 md:px-16 py-16 md:py-24">
      {/* Menu: Logo, Tautan Cepat, Spesialis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 pb-12">
        {/* Logo & Deskripsi */}
        <div className="lg:col-span-4 flex flex-col items-start gap-6">
          <Image
            src="/logofooter.webp"
            alt="Logo RS Medika Lestari"
            width={400}
            height={400}
            className="brightness-0 invert object-contain w-[280px] h-auto"
          />
          <p className="text-sm font-light leading-relaxed opacity-90 max-w-[360px]">
            RS Medika Lestari bermula dari sebuah klinik pada tahun 1994, kini
            telah berkembang menjadi fasilitas kesehatan terakreditasi Paripurna
            (KARS) yang menyediakan layanan medis lengkap dan modern.
          </p>
        </div>

        {/* Tautan Cepat */}
        <div className="lg:col-span-3">
          <h3 className="text-xl font-bold mb-4">Tautan Cepat</h3>
          <ul className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className={LINK_CLASS}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Spesialis (diambil dari Navbar) */}
        <div className="lg:col-span-5">
          <h3 className="text-xl font-bold mb-4">Dokter Spesialis</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {specialtyItems.map((name) => (
              <li key={name}>
                <Link
                  href={`/dokter?specialty=${encodeURIComponent(name)}`}
                  className={LINK_CLASS}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Janji Temu, Sosial Media, Newsletter */}
      <div className="border-t border-white/60 py-10 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 items-center">
        {/* Nomor Telepon */}
        <div className="lg:col-span-3">
          <p className="text-xl font-semibold">Janji Temu:</p>
          <button
            type="button"
            onClick={onOpenBooking}
            aria-label="Buat janji temu"
            className="text-xl font-light hover:text-[#e67e22] transition-colors duration-700 cursor-pointer text-left hover:underline"
          >
            {PHONE_DISPLAY}
          </button>
        </div>

        {/* Social Media */}
        <div className="lg:col-span-5 flex items-center gap-5 flex-wrap">
          {socialMedia.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#003f88] focus:outline-none"
            >
              {/* ring yang membesar saat hover / fokus */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-white opacity-0 scale-100 transition-all duration-500 ease-out group-hover:scale-[1.35] group-hover:opacity-100 group-focus-visible:scale-[1.35] group-focus-visible:opacity-100"
              />
              <svg
                viewBox="0 0 24 24"
                className="relative w-5 h-5 fill-current"
                aria-hidden="true"
              >
                {item.icon}
              </svg>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-4 lg:flex lg:justify-end">
          <NewsletterForm />
        </div>
      </div>

      {/* Alamat */}
      <div className="border-t border-white/60 pt-10 text-center">
        <p className="text-xl font-bold">RS Medika Lestari Ciledug</p>
        <p className="text-base font-normal mt-1">
          Jl. HOS Cokroaminoto No.56, RT.001/RW.012, Kec. Karang Tengah, Kota
          Tangerang, Banten 15151
        </p>
      </div>

      {/* Link Privacy dan Term */}
      <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-base font-normal">
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms of Use
        </Link>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm font-normal opacity-90 mb-20 md:mb-0">
        ©1994-{new Date().getFullYear()} RS Medika Lestari. All rights reserved.
      </div>
    </div>
  </div>
);

const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // modal diletakkan di luar <footer> agar tetap tampil walau footer disembunyikan
  const bookingModal = (
    <BookingModalFloating
      isOpen={isBookingOpen}
      onClose={() => setIsBookingOpen(false)}
    />
  );

  if (!isHomePage) {
    return (
      <>
        <footer className="hidden lg:block w-full font-sans">
          <FooterContent onOpenBooking={() => setIsBookingOpen(true)} />
        </footer>
        {bookingModal}
      </>
    );
  }

  return (
    <>
      <footer className="w-full font-sans">
        <FooterContent onOpenBooking={() => setIsBookingOpen(true)} />
      </footer>
      {bookingModal}
    </>
  );
};

export default Footer;
