"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AsuransiRekanPage() {
  // Array of insurance logos
  const asuransiList = [
    { id: 1, name: "Asuransi 1", image: "/images/asuransi/asuransi1.png" },
    { id: 2, name: "Asuransi 2", image: "/images/asuransi/asuransi2.png" },
    { id: 3, name: "Asuransi 3", image: "/images/asuransi/asuransi3.png" },
    { id: 4, name: "Asuransi 4", image: "/images/asuransi/asuransi4.png" },
    { id: 5, name: "Asuransi 5", image: "/images/asuransi/asuransi5.png" },
    { id: 6, name: "Asuransi 6", image: "/images/asuransi/asuransi6.png" },
    { id: 7, name: "Asuransi 7", image: "/images/asuransi/asuransi7.png" },
    { id: 8, name: "Asuransi 8", image: "/images/asuransi/asuransi8.png" },
    { id: 9, name: "Asuransi 9", image: "/images/asuransi/asuransi9.png" },
    { id: 10, name: "Asuransi 10", image: "/images/asuransi/asuransi10.png" },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section with Background Image */}
      <section
        className="bg-cover bg-center bg-no-repeat text-white py-8 md:py-15 relative"
        style={{
          backgroundImage: "url(/informasi.jpg)",
        }}
      >
        {/* Blue Overlay with 90% opacity */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#003f88]/90 to-[#013a63]/90 z-0" />

        {/* Content */}
        <div className="max-w-[1172px] mx-auto px-4 md:px-8 py-0 md:py-2 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li className="flex items-center">
                <Link
                  href="/"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li className="flex items-center">
                <span className="mx-2 text-blue-200">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                  </svg>
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-white font-medium">Asuransi Rekanan</span>
              </li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Asuransi dan Rekanan
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
            RS Medika Lestari bekerja sama dengan berbagai asuransi kesehatan
            untuk memberikan kemudahan akses layanan kesehatan
            berkualitas.
          </p>
        </div>
      </section>

      {/* Insurance Gallery Section */}
      <section className="w-full py-12 md:py-16 pb-32 md:pb-0">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8">
          {/* Grid Layout - 2 columns, 5 items each side */}
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Items 1-5 */}
            <div className="space-y-4 md:space-y-6">
              {asuransiList.slice(0, 5).map((asuransi) => (
                <div
                  key={asuransi.id}
                  className="relative bg-white  overflow-hidden flex items-center justify-center p-4 h-32 md:h-40"
                >
                  <Image
                    src={asuransi.image}
                    alt={asuransi.name}
                    fill
                    className="object-contain p-3"
                    sizes="(max-width: 768px) 40vw, 25vw"
                    priority={asuransi.id <= 5}
                  />
                </div>
              ))}
            </div>

            {/* Right Column - Items 6-10 */}
            <div className="space-y-4 md:space-y-6">
              {asuransiList.slice(5, 10).map((asuransi) => (
                <div
                  key={asuransi.id}
                  className="relative bg-white overflow-hidden flex items-center justify-center p-4 h-32 md:h-40"
                >
                  <Image
                    src={asuransi.image}
                    alt={asuransi.name}
                    fill
                    className="object-contain p-3"
                    sizes="(max-width: 768px) 40vw, 25vw"
                    priority={asuransi.id <= 10}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
