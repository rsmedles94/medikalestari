"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Phone } from "lucide-react";
import { MCU_DATA } from "./data";

export default function MedicalCheckup() {
  return (
    <main className="min-h-screen bg-white mb-20">
      {/* Breadcrumb */}
      <div className="max-w-[1175px] mx-auto px-4 md:px-8 pt-4 md:pt-16">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {MCU_DATA.map((item) => (
              <Link
                key={item.id}
                href={`/medical-checkup/${item.id}`}
                className="group"
              >
                <article className="bg-white border border-gray-200 overflow-hidden  transition-all duration-300 flex flex-col h-full">
                  {/* Image Area */}
                  <figure className="w-full relative bg-gray-50 aspect-auto overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={340}
                      height={380}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  </figure>

                  {/* Content Area */}
                  <div className="p-4 flex flex-col grow">
                    <h2 className="text-sm md:text-base font-bold text-gray-800 mb-2 leading-tight group-hover:text-[#003f88] transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-600 mb-4 leading-snug line-clamp-2">
                      {item.shortDescription}
                    </p>
                    <div className="mt-auto">
                      <p className="text-[#003f88] font-bold text-sm md:text-base">
                        {item.price}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#003f88] to-blue-700 rounded-lg p-8 md:p-12 text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Daftarkan Diri Anda Sekarang
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Jangan tunda lagi! Lakukan pemeriksaan kesehatan rutin untuk menjaga
            kesehatan optimal Anda dan keluarga.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6281234567890?text=Saya%20ingin%20mendaftar%20Medical%20Checkup"
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone size={20} />
              Pesan via WhatsApp
            </a>
            <a
              href="tel:+6281234567890"
              className="px-8 py-3 bg-white hover:bg-blue-50 text-[#003f88] font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Hubungi Kami
            </a>
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
              <p className="text-gray-600 text-sm">
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
