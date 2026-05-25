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

  const partners = ["tomtom", "viatris", "zoetis", "rohto", "davita", "chewy"];

  const cardData = [
    {
      title: "VISI",
      img: "/misi.jpg",
      content:
        "Menjadikan Rumah Sakit yang terbaik dan terjangkau oleh seluruh lapisan masyarakat.",
    },
    {
      title: "MISI",
      img: "/misi.jpg",
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
      img: "/misi.jpg",
      content: (
        <span className="italic">
          &quot;Kesembuhan Anda Kebahagiaan Kami&quot;
        </span>
      ),
    },
  ];

  return (
    <section className="bg-white text-slate-900 scroll md:-mt-12 pb-20">
      {/* 1. SECTION FOTO & JUDUL */}
      <div className="max-w-[1159px] mx-auto px-4 py-8 md:py-20">
        <div className="mb-8 md:mb-12 border-b border-slate-100 pb-6 md:py-9 ">
          <nav className="flex items-center gap-1 text-[14px] text-gray-300 mb-4">
            <Link
              href="/"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="font-normal">Tentang Kami</span>
          </nav>
          <h1 className="text-4xl font-bold text-black mb-2">Tentang Kami</h1>
          <p className="text-slate-600">
            Mengabdi untuk kesehatan masyarakat sejak 1994 dengan pelayanan
            prima dan terakreditasi Paripurna.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-8 relative aspect-[16/10] overflow-hidden border border-slate-200 shadow-sm group">
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
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
            <div className="relative flex-1 aspect-[16/9] lg:aspect-auto overflow-hidden border border-slate-200 shadow-sm">
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
            </div>
            <div className="relative flex-1 aspect-[16/9] lg:aspect-auto overflow-hidden border border-slate-200 shadow-sm">
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
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION SEJARAH */}
      <div className="max-w-[1160px] mx-auto px-6 pb-24">
        <div className="max-w-[1160px]">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 uppercase mb-6">
            Sejarah Berdirinya RS Medika Lestari
          </h2>
          <div className="space-y-6 text-slate-700 leading-relaxed text-justify text-[16px]">
            <p>
              Berdiri tanggal 15 oktober 1994, berawal dari sebuah klinik yang
              bertempat di Jl. HOS Cokroaminoto Perum Pondok Lestari Blok C1
              No.1-2, Ciledug Kota Tanggerang 15157. Medika Lestari hadir untuk
              memenuhi permintaan masyarakat akan kesehatan yang baik dan prima.
              Pada tahun 1997 Klinik Medika Lestari membangun gedung baru dan
              meningkatkan statusnya dari klinik menjadi Klinik Spesialis dan
              Rumah Bersalin Medika Lestari.
            </p>
            <p>
              Pada tahun 2005 Rumah Sakit Medika Lestari menambah fasilitas dan
              meningkatkan statusnya menjadi Rumah Sakit Ibu dan Anak (RSIA) dan
              selanjutnya pada tahun 2008 Rumah Sakit Medika Lestari
              meningkatkan statusnya menjadi Rumah Sakit Umum. Tahun 2012 Rumah
              Sakit Medika Lestari terus berkembang dengan Motivasi yang sangat
              tinggi serta kebersamaan dan kekompakan seluruh karyawan RS Medika
              Lestari, kini RS Medika Lestari sampai pada proses pembangunan
              serta pengembangan dari segi pelayanan serta fasilitas.
            </p>
            <p>
              Tahun 2017 sampai sekarang RS Medika Lestari sudah melayani Rawat
              Inap, Rawat Jalan, dan layanan 24 Jam (IGD, Radiologi,
              Laboratorium, Farmasi). Pada tahun 2023 RS Medika Lestari sudah
              terakreditasi paripurna.
            </p>
          </div>
        </div>
      </div>

      {/* 3. VISI MISI & MOTTO */}
      <div className="bg-slate-50 border-y border-slate-200 py-24">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cardData.map((item) => (
              <div
                key={item.title}
                className="group relative h-[420px] w-full overflow-hidden bg-white shadow-xl border border-slate-100"
              >
                {/* Background Image - Tampil di Mobile & Desktop */}
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[800ms] md:scale-105 md:group-hover:scale-100"
                  style={{ backgroundImage: `url('${item.img}')` }}
                />

                {/* Layer Overlay Biru (Transparansi) */}
                <div
                  className="absolute inset-0 z-10 bg-[#003f88]/75 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] 
                             md:[clip-path:polygon(0_85%,100%_70%,100%_100%,0%_100%)] 
                             md:group-hover:[clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]
                             md:group-hover:bg-[#003f88]/85"
                />

                {/* Konten Teks */}
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  {/* Judul */}
                  <h3 className="text-white text-3xl font-bold transition-all duration-700 md:group-hover:-translate-y-2">
                    {item.title}
                  </h3>

                  {/* Deskripsi - Langsung tampil di mobile, hover di desktop */}
                  <div
                    className="max-h-[300px] opacity-100 mt-4 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] 
                                 md:max-h-0 md:opacity-0 md:mt-0 md:group-hover:max-h-[200px] md:group-hover:opacity-100 md:group-hover:mt-4"
                  >
                    <div className="text-white/95 leading-relaxed pt-3 border-t border-white/20 font-medium">
                      {item.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. SECTION MITRA KAMI */}
      <div className="max-w-[1160px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 uppercase">
            Mitra Kami
          </h3>
          <p className="text-slate-500 text-[15px] max-w-[600px] mx-auto">
            Komitmen kami terhadap kualitas divalidasi oleh organisasi perawatan
            kesehatan bergengsi
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {partners.map((item) => (
            <div
              key={item}
              className="flex items-center justify-center p-4 border border-slate-100 bg-white shadow-sm h-32 relative"
            >
              {!isImageLoaded(`partner-${item}`) && (
                <ImageSkeleton width="w-24" height="h-24" />
              )}
              <Image
                src={`/tentangkami/${item}.webp`}
                alt={item}
                fill
                className="object-contain p-4"
                onLoad={() => handleImageLoad(`partner-${item}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
