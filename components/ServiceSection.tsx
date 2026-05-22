"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface KisahItem {
  id: number;
  image: string;
  title: string;
  href: string;
  aspectClass: string;
}

const ServiceSection = () => {
  const router = useRouter();

  // Rasio diperkecil drastis agar tampilan fotonya lebih pendek & kompak.
  // Kolom 1 (Kiri): Atas Landscape (16/10), Bawah Portrait Pas (3/3.8) -> Total tinggi seimbang
  const kolomKiri: KisahItem[] = [
    {
      id: 1,
      image: "/mcu.png",
      title: "Menemukan Oase dari Kecanduan",
      href: "/kisah-pasien/menemukan-oase",
      aspectClass: "aspect-[16/10]",
    },
    {
      id: 4,
      image: "/mcu.png",
      title:
        "Di Tempat Penampungan Korban Kekerasan Dalam Rumah Tangga, Keluarga Kini Mendapatkan Dukungan Kesehatan Mental",
      href: "/kisah-pasien/dukungan-kesehatan-mental",
      aspectClass: "aspect-[3/3.8]",
    },
  ];

  // Kolom 2 (Tengah): Atas Portrait Pas (3/3.45), Bawah Landscape Tipis (16/9.2)
  // Diturunkan sedikit rasionya untuk mengompensasi hilangnya margin gap, PASTI rata bawah!
  const kolomTengah: KisahItem[] = [
    {
      id: 2,
      image: "/mcu.png",
      title: "Pemutaran Film yang Mengubah Hidupnya",
      href: "/kisah-pasien/pemutaran-film",
      aspectClass: "aspect-[3/3.45]",
    },
    {
      id: 5,
      image: "/mcu.png",
      title: "Dari Sumber Penderitaan, Kekuatan-Nya Muncul",
      href: "/kisah-pasien/kekuatan-muncul",
      aspectClass: "aspect-[16/11.8]",
    },
  ];

  // Kolom 3 (Kanan): Atas Landscape (16/10.3), Bawah Portrait Pas (3/3.7)
  const kolomKanan: KisahItem[] = [
    {
      id: 3,
      image: "/mcu.png",
      title: "Menghidupkan Kembali Tangan Harry",
      href: "/kisah-pasien/tangan-harry",
      aspectClass: "aspect-[16/14.1]",
    },
    {
      id: 6,
      image: "/mcu.png",
      title:
        'Setelah Kondisi Diabetesnya Membaik, Pria Brooklyn Ini Menjadi "Keajaiban yang Berjalan"',
      href: "/kisah-pasien/keajaiban-berjalan",
      aspectClass: "aspect-[3/3]",
    },
  ];

  const renderCard = (item: KisahItem, index: number) => (
    <motion.article
      key={item.id}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => router.push(item.href)}
      // rounded-none menjamin sudut siku sempurna, w-full menjamin responsif
      className={`group relative flex flex-col justify-end overflow-hidden rounded-none cursor-pointer bg-slate-100 ${item.aspectClass} w-full`}
    >
      {/* Container Gambar */}
      <div className="absolute inset-0 z-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-w-768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={item.id <= 3}
        />

        {/* Gradasi Gelap Default */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300" />

        {/* Gradasi Hover Warna Biru Rumah Sakit */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#173A87]/30 via-[#173A87]/70 to-[#173A87]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      </div>

      {/* Konten Judul - Menggunakan absolute bottom agar tidak merusak kalkulasi tinggi kotak */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-5 w-full pointer-events-none">
        <h3 className="text-xs md:text-sm font-semibold text-white leading-snug transition-colors duration-300 group-hover:text-slate-100 line-clamp-3 md:line-clamp-4">
          {item.title}
        </h3>
      </div>
    </motion.article>
  );

  return (
    <section className="w-full bg-white py-12 font-sans">
      {/* Max-w-[1000px] dikunci agar proporsinya persis seperti screenshot awal */}
      <div className="max-w-[1000px] mx-auto px-4 md:px-6">
        {/* Judul Utama */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#173A87] text-center mb-10">
          Kisah Pasien
        </h2>

        {/* Layout 3 Kolom Grid Vertikal - Dijamin aman dan lurus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-start">
          {/* Kolom Kiri */}
          <div className="flex flex-col gap-4 md:gap-5">
            {kolomKiri.map((item, idx) => renderCard(item, idx))}
          </div>

          {/* Kolom Tengah */}
          <div className="flex flex-col gap-4 md:gap-5">
            {kolomTengah.map((item, idx) => renderCard(item, idx))}
          </div>

          {/* Kolom Kanan */}
          <div className="flex flex-col gap-4 md:gap-5">
            {kolomKanan.map((item, idx) => renderCard(item, idx))}
          </div>
        </div>

        {/* Tombol Bawah */}
        <div className="mt-10 text-center">
          <Link
            href="/kisah-pasien"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors"
          >
            <span>Lihat Cerita Lainnya</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
