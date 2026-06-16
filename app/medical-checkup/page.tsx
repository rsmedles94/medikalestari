"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { MCU_DATA } from "./data";

export default function MedicalCheckup() {
  return (
    <main className="min-h-screen bg-white mb-20">
      {/* Breadcrumb */}
      <div className="max-w-[1175px] mx-auto px-4 md:px-8 pt-8 md:pt-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 text-sm font-normal text-gray-300 ">
            <li>
              <Link
                href="/"
                className="text-black/60 hover:text-gray-400 transition-colors"
              >
                Beranda
              </Link>
            </li>
            <li className="text-black/60">
              <ChevronRight size={12} />
            </li>
            <li aria-current="page" className="font-normal text-gray-400">
              Medical Checkup
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <header className="py-4">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            Medical Checkup
          </h1>
          <p className="text-gray-600 mb-8">
            Pilih paket pemeriksaan kesehatan sesuai kebutuhan Anda.
          </p>
        </header>

        {/* Packages Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {MCU_DATA.map((item) => (
              <div key={item.id} className="p-0">
                <article className="bg-white border border-gray-300 flex flex-col h-full overflow-hidden transition-all duration-300 group">
                  {/* Image Area */}
                  <div className="w-full relative bg-gray-50 cursor-pointer overflow-hidden flex items-center justify-center">
                    <div className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700 ease-in-out">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={500}
                        height={500}
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="w-full h-auto object-contain"
                        priority
                      />
                    </div>
                  </div>

                  {/* Card Area */}
                  <div className="p-4 md:p-10 flex flex-col grow text-center bg-white">
                    <Link href={`/medical-checkup/${item.id}`} passHref>
                      <h3 className="text-sm md:text-xl font-bold text-[#003f88] mb-2 min-h-12 flex items-center justify-center leading-normal cursor-pointer hover:text-[#e67e22] transition-colors duration-300 line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>


                    {/* Harga*/}
                    <p className="text-[#e67e22] font-bold text-xs md:text-base mb-5 mt-auto">
                      {item.price}
                    </p>

                    {/* Tombol Selengkapnya */}
                    <div className="mt-auto">
                      <Link href={`/medical-checkup/${item.id}`} passHref>
                        <button
                          type="button"
                          className="w-full py-2 text-white text-[10px] md:text-xs font-semibold transition-all duration-700 cursor-pointer bg-[#003f88] group-hover:bg-[#e67e22] hover:bg-[#e67e22]"
                        >
                          ⭢ Selengkapnya
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Pertanyaan Umum
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">
                Apa saja yang termasuk dalam paket MCU?
              </h3>
              <p className="text-gray-600 text-sm">
                Setiap paket mencakup pemeriksaan fisik, tes laboratorium, dan
                konsultasi dengan dokter. Detail lengkap tersedia di halaman
                setiap paket.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">
                Berapa lama pemeriksaan?
              </h3>
              <p className="text-gray-600 text-sm">
                Pemeriksaan biasanya memakan waktu 2-4 jam tergantung jenis
                paket yang Anda pilih. Hasil lab tersedia dalam 24-48 jam.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">
                Apakah ada persiapan khusus?
              </h3>
              <p className="text-gray-600 text-sm">
                Ya, untuk tes darah puasa sebaiknya tidak makan 8-10 jam
                sebelumnya. Tim kami akan memberikan panduan lengkap saat
                pendaftaran.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">
                Apakah bisa membayar dengan asuransi?
              </h3>
              <p className="text-gray-600 text-sm mb-20">
                Kami bekerja sama dengan berbagai provider asuransi. Silakan
                hubungi kami untuk informasi detail mengenai asuransi yang kami
                terima.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
