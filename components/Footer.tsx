"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  // --- Kumpulan Ikon ---
  const WhatsAppIcon = (
    <path
      fill="#25D366"
      d="M17.472 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.296-.769.966-.942 1.165-.173.199-.347.223-.647.075-.302-.15-1.274-.467-2.426-1.495-.893-.797-1.495-1.782-1.67-2.081-.174-.3-.018-.462.13-.61.137-.133.302-.354.453-.531.151-.177.201-.299.301-.497.102-.199.051-.372-.025-.521-.075-.148-.672-1.622-.921-2.227-.242-.584-.487-.504-.673-.513-.173-.008-.371-.01-.57-.01-.198 0-.523.074-.797.372-.273.299-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.76-.719 2.008-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
    />
  );

  const InstagramIcon = (
    <path
      fill="url(#instaGradientFooter)"
      d="M7.75 2C4.13 2 2 4.13 2 7.75v8.5C2 19.87 4.13 22 7.75 22h8.5C19.87 22 22 19.87 22 16.25v-8.5C22 4.13 19.87 2 16.25 2h-8.5zm0 2h8.5C18.21 4 20 5.79 20 7.75v8.5c0 1.96-1.79 3.75-3.75 3.75h-8.5C5.79 20 4 18.21 4 16.25v-8.5C4 5.79 5.79 4 7.75 4zm8.75 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"
    />
  );

  const YoutubeIcon = (
    <path
      fill="#FF0000"
      d="M21.8 8.001a2.75 2.75 0 00-1.936-1.948C18.15 5.5 12 5.5 12 5.5s-6.15 0-7.864.553A2.75 2.75 0 002.2 8c-.45 1.72-.45 4-.45 4s0 2.28.45 4a2.75 2.75 0 001.936 1.947C5.85 18.5 12 18.5 12 18.5s6.15 0 7.864-.553A2.75 2.75 0 0021.8 16c.45-1.72.45-4 .45-4s0-2.28-.45-3.999zM10 15.5v-7l6 3.5-6 3.5z"
    />
  );
  // --- Data Konfigurasi ---
  const socialMedia = [
    {
      name: "WhatsApp",
      href: "https://wa.me/6282246232527",
      icon: WhatsAppIcon,
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@RSMedikaLestari",
      icon: YoutubeIcon,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/rsmedikalestari",
      icon: InstagramIcon,
    },
  ];

  const footerLinks = [
    {
      title: "Layanan Kami",
      links: [
        { name: "Beranda", href: "/" },
        { name: "Dokter Kami", href: "/dokter" },
        { name: "Jadwal Dokter", href: "/jadwal-dokter" },
        { name: "Kamar Perawatan", href: "/services/kamar-perawatan" },
      ],
    },
    {
      title: "Lainnya",
      links: [
        { name: "Karir", href: "/careers" },
        { name: "Kontak Kami", href: "/kontak-kami" },
        { name: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
        { name: "Tentang Kami", href: "/tentang-kami" },
      ],
    },
  ];

  return (
    <footer className="w-full font-sans">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient
            id="instaGradientFooter"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
      </svg>

      {/* --- CONTACT BAR MOBILE --- */}
      <div className="lg:hidden bg-[#f3f3f3] border-t border-b border-gray-300">
        <div className="grid grid-cols-3 h-[58px]">
          {socialMedia.map((item, index) => (
            <Link
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center border-r border-gray-300 hover:bg-white transition-all ${
                index === socialMedia.length - 1 ? "border-r-0" : ""
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7">
                {item.icon}
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* --- MAIN FOOTER --- */}
      <div className="relative bg-[#006360] text-white overflow-hidden ">
        <div className="relative max-w-[1140px] mx-auto px-5 md:px-6 py-10 md:py-16 z-10 ">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12">
            {footerLinks.map((section) => (
              <div key={section.title} className="md:col-span-3">
                <h3 className="text-sm md:text-lg font-bold mb-4 uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-xs md:text-sm opacity-80 hover:opacity-100 hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="hidden lg:block md:col-span-6 md:pl-12">
              <h3 className="text-lg font-bold mb-6 uppercase">Media Sosial</h3>
              <div className="flex gap-4 flex-wrap">
                {socialMedia.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-sm"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      {item.icon}
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 pt-5 border-t border-white/10 text-center md:text-left mb-15 md:-mb-10">
            <p className="text-[11px] md:text-sm opacity-70">
              © 1994-{new Date().getFullYear()} RS Medika Lestari. Semua Hak
              Cipta Dilindungi
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
