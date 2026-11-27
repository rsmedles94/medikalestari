"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ImageSkeleton } from "./ImageSkeleton";

const AboutUs = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageName: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageName));
  };

  const isImageLoaded = (imageName: string) => loadedImages.has(imageName);

  const cardData = [
    {
      title: "VISI",
      content:
        "Menjadikan Rumah Sakit yang terbaik dan terjangkau oleh seluruh lapisan masyarakat.",
    },
    {
      title: "MISI",
      content: (
        <ul className="space-y-2 text-sm">
          <li>1. Mengutamakan Pasien Safety.</li>
          <li>2. Meningkatkan mutu pelayanan secara berkesinambungan.</li>
          <li>3. Memberikan pelayanan yang efektif dan efisien.</li>
        </ul>
      ),
    },
    {
      title: "MOTTO",
      content: (
        <span className="italic">
          &quot;Kesembuhan Anda Kebahagiaan Kami&quot;
        </span>
      ),
    },
  ];

  return (
    <main className="bg-white text-slate-900 scroll md:-mt-12 pb-20">
      {/* breadcrumb tentang kami */}
      <section
        aria-labelledby="about-heading"
        className="max-w-[1160px] mx-auto px-6 pt-8 pb-4 lg:py-20"
      >
        <header className="mb-4 lg:mb-12 border-b border-slate-100 pb-6 md:py-9">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[14px] text-gray-300 mb-4"
          >
            <Link
              href="/"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="font-normal" aria-current="page">
              Tentang Kami
            </span>
          </nav>
          <h1 id="about-heading" className="text-4xl font-bold text-black mb-2">
            Tentang Kami
          </h1>
          <p className="text-slate-600">
            Mengabdi untuk kesehatan masyarakat sejak 1994 dengan pelayanan
            prima dan terakreditasi Paripurna.
          </p>
        </header>

        <div className="hidden lg:grid grid-cols-12 gap-3 md:gap-4">
          <figure className="col-span-8 relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-200 shadow-sm group">
            {!isImageLoaded("hospital-building") && (
              <ImageSkeleton width="w-full" height="h-full" />
            )}
            <Image
              src="/tentangkami/hospital-building.jpg"
              alt="Gedung Utama RS Medika Lestari"
              fill
              className="object-cover transition-transform duration-500"
              priority
              onLoad={() => handleImageLoad("hospital-building")}
            />
          </figure>

          <div className="col-span-4 flex flex-col gap-3 md:gap-4">
            <figure className="relative flex-1 min-h-[120px] overflow-hidden rounded-lg border border-slate-200 shadow-sm">
              {!isImageLoaded("room") && (
                <ImageSkeleton width="w-full" height="h-full" />
              )}
              <Image
                src="/tentangkami/room.jpg"
                alt="Fasilitas Kamar"
                fill
                className="object-cover"
                onLoad={() => handleImageLoad("room")}
              />
            </figure>
            <figure className="relative flex-1 min-h-[120px] overflow-hidden rounded-lg border border-slate-200 shadow-sm">
              {!isImageLoaded("lobby") && (
                <ImageSkeleton width="w-full" height="h-full" />
              )}
              <Image
                src="/tentangkami/lobby.jpg"
                alt="Lobby Rumah Sakit"
                fill
                className="object-cover"
                onLoad={() => handleImageLoad("lobby")}
              />
            </figure>
          </div>
        </div>
      </section>

      {/* sejarah & visi-misi-motto */}
      <section
        aria-label="Sejarah, Visi, Misi, dan Motto"
        className="max-w-[1160px] mx-auto px-6 pb-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-stretch">
          {/* sejarah di sisi kiri */}
          <article
            aria-labelledby="history-heading"
            className="h-full bg-white border border-slate-200 rounded-lg p-6 md:p-10 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h2
                id="history-heading"
                className="text-2xl font-bold tracking-tight text-slate-950 uppercase mb-6"
              >
                Sejarah Berdirinya RS Medika Lestari
              </h2>
              <div className="space-y-6 text-slate-700 leading-relaxed text-justify text-[16px]">
                <p>
                  Berdiri tanggal 15 oktober 1994, berawal dari sebuah klinik
                  yang bertempat di Jl. HOS Cokroaminoto Perum Pondok Lestari
                  Blok C1 No.1-2, Ciledug Kota Tanggerang 15157. Medika Lestari
                  hadir untuk memenuhi permintaan masyarakat akan kesehatan yang
                  baik dan prima. Pada tahun 1997 Klinik Medika Lestari
                  membangun gedung baru dan meningkatkan statusnya dari klinik
                  menjadi Klinik Spesialis dan Rumah Bersalin Medika Lestari.
                </p>
                <p>
                  Pada tahun 2005 Rumah Sakit Medika Lestari menambah fasilitas
                  dan meningkatkan statusnya menjadi Rumah Sakit Ibu dan Anak
                  (RSIA) dan selanjutnya pada tahun 2008 Rumah Sakit Medika
                  Lestari meningkatkan statusnya menjadi Rumah Sakit Umum. Tahun
                  2012 Rumah Sakit Medika Lestari terus berkembang dengan
                  Motivasi yang sangat tinggi serta kebersamaan dan kekompakan
                  seluruh karyawan RS Medika Lestari, kini RS Medika Lestari
                  sampai pada proses pembangunan serta pengembangan dari segi
                  pelayanan serta fasilitas.
                </p>
                <p>
                  Tahun 2017 sampai sekarang RS Medika Lestari sudah melayani
                  Rawat Inap, Rawat Jalan, dan layanan 24 Jam (IGD, Radiologi,
                  Laboratorium, Farmasi). Pada tahun 2023 RS Medika Lestari
                  sudah terakreditasi paripurna.
                </p>
              </div>
            </div>
          </article>

          {/* visi, misi & motto sejajar vertikal di sisi kanan */}
          <div className="h-full flex flex-col justify-between gap-6">
            {cardData.map((item) => (
              <article
                key={item.title}
                className="flex-1 bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-4 h-full">
                  {/* tulisan di sisi kiri */}
                  <div className="flex-1 text-left">
                    <h2 className="text-slate-950 text-2xl font-bold tracking-tight mb-2">
                      {item.title}
                    </h2>
                    <div className="text-slate-600 leading-relaxed pt-2 border-t border-slate-200 font-medium">
                      {item.content}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
