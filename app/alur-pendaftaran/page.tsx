"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export default function AlurPendaftaran() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const steps = [
    {
      number: "01",
      title: "Persiapan Data Pribadi",
      description:
        "Siapkan dokumen identitas diri resmi (KTP/SIM/Paspor/KIA) serta data kontak aktif sebelum memulai pendaftaran.",
      details: [
        "Nama lengkap sesuai identitas resmi",
        "Nomor identitas (KTP/SIM/Paspor/KIA)",
        "Nomor telepon dan alamat email aktif",
        "Alamat domisili lengkap",
      ],
    },
    {
      number: "02",
      title: "Pemilihan Layanan dan Dokter",
      description:
        "Tentukan poliklinik atau layanan medis yang dibutuhkan serta jadwal praktik dokter spesialis tujuan.",
      details: [
        "Periksa daftar dokter spesialis yang tersedia",
        "Sesuaikan dengan jadwal praktik harian",
        "Tentukan jenis layanan (rawat jalan atau penunjang)",
        "Pilih hari dan sesi kunjungan yang diinginkan",
      ],
    },
    {
      number: "03",
      title: "Pengisian Formulir Pendaftaran",
      description:
        "Lengkapi formulir pendaftaran secara daring maupun langsung melalui loket admisi rumah sakit.",
      details: [
        "Pengisian data pasien baru atau nomor rekam medis",
        "Pencantuman keluhan atau riwayat kesehatan singkat",
        "Pemilihan metode penjaminan (pribadi, asuransi, atau perusahaan)",
        "Persetujuan ketentuan layanan pasien",
      ],
    },
    {
      number: "04",
      title: "Verifikasi Administrasi dan Penjaminan",
      description:
        "Proses verifikasi dokumen kepesertaan asuransi atau penyelesaian biaya administrasi sesuai ketentuan.",
      details: [
        "Verifikasi kartu kepesertaan asuransi atau surat jaminan",
        "Pembayaran melalui kasir rumah sakit untuk pasien umum",
        "Penerbitan bukti registrasi dan rincian administrasi",
      ],
    },
    {
      number: "05",
      title: "Konfirmasi Jadwal dan Nomor Antrean",
      description:
        "Pasien menerima konfirmasi registrasi beserta nomor antrean poliklinik yang dituju.",
      details: [
        "Nomor antrean dan kode pendaftaran pasien",
        "Konfirmasi jam estimasi pemeriksaan dokter",
        "Informasi lokasi poliklinik atau ruang pemeriksaan",
      ],
    },
    {
      number: "06",
      title: "Kehadiran dan Pemeriksaan Dokter",
      description:
        "Hadir di rumah sakit sesuai jadwal yang telah dikonfirmasi dengan membawa dokumen kelengkapan.",
      details: [
        "Hadir minimal 15 menit sebelum jadwal pemeriksaan",
        "Membawa kartu identitas dan kartu asuransi (jika ada)",
        "Membawa hasil pemeriksaan penunjang sebelumnya (jika ada)",
        "Menuju ruang poliklinik sesuai panggilan antrean",
      ],
    },
  ];

  const faqs = [
    {
      question: "Berapa lama estimasi waktu proses pendaftaran?",
      answer:
        "Proses registrasi di loket admisi umumnya memerlukan waktu 10 hingga 15 menit, bergantung pada kelengkapan dokumen identitas maupun verifikasi asuransi.",
    },
    {
      question: "Apakah pendaftaran dapat dilakukan secara daring?",
      answer:
        "Ya, pasien dapat melakukan reservasi jadwal konsultasi terlebih dahulu melalui layanan pendaftaran daring atau datang langsung ke bagian admisi RS Medika Lestari.",
    },
    {
      question: "Dokumen apa saja yang perlu dibawa saat kunjungan?",
      answer:
        "Harap membawa kartu identitas resmi (KTP/SIM/Paspor/KIA), kartu kepesertaan asuransi atau surat rujukan (jika menggunakan penjaminan), serta hasil pemeriksaan medis sebelumnya bila tersedia.",
    },
    {
      question: "Bagaimana ketentuan pembatalan atau perubahan jadwal?",
      answer:
        "Perubahan atau pembatalan jadwal kunjungan dapat dilakukan dengan menginformasikan kepada bagian pendaftaran sebelum waktu praktik dimulai.",
    },
    {
      question: "Bagaimana informasi rincian biaya layanan dan pendaftaran?",
      answer:
        "Tarif konsultasi dan administrasi menyesuaikan jenis poliklinik serta dokter spesialis yang dituju. Informasi rincian biaya dapat dikonfirmasi langsung melalui bagian informasi rumah sakit.",
    },
    {
      question: "Bagaimana jika pasien datang melewati jadwal antrean?",
      answer:
        "Silakan melapor ke petugas pendaftaran poliklinik setibanya di rumah sakit. Petugas akan menyesuaikan urutan antrean sesuai ketersediaan jadwal dokter yang sedang bertugas.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* bagian header */}
      <section className="w-full py-8 md:py-15 pb-4 md:pb-6 bg-white border-b border-slate-200">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8 py-0 md:py-2">
          {/* navigasi breadcrumb */}
          <motion.nav
            className="mb-6"
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          >
            <div className="flex items-center gap-1 text-[14px] font-normal">
              <Link
                href="/"
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                Beranda
              </Link>
              <ChevronRight
                size={12}
                className="text-slate-400"
                aria-hidden="true"
              />
              <span className="font-normal text-slate-900">
                Alur Pendaftaran
              </span>
            </div>
          </motion.nav>

          <motion.h1
            className="text-4xl md:text-4xl font-bold tracking-[-0.02em] text-slate-900"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.06, ease: EASE_SMOOTH }}
          >
            Alur Pendaftaran
          </motion.h1>
          <motion.p
            className="mt-3 text-[15px] md:text-base text-slate-600 max-w-2xl leading-relaxed font-normal"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.1, ease: EASE_SMOOTH }}
          >
            Panduan tahapan registrasi dan verifikasi administrasi pasien di RS
            Medika Lestari untuk kelancaran layanan rawat jalan maupun
            pemeriksaan penunjang.
          </motion.p>
        </div>
      </section>

      {/* tahapan pendaftaran */}
      <section className="w-full py-12 md:py-16 bg-white">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* judul bagian tahapan */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <h2 className="text-2xl md:text-[28px] font-semibold tracking-[-0.02em] leading-[1.25] text-slate-900">
                Tahapan Pendaftaran Pasien
              </h2>
              <p className="mt-3 text-[14px] leading-[1.65] text-slate-600">
                Pastikan seluruh dokumen identitas dan kelengkapan penjaminan
                telah disiapkan sebelum menuju loket pendaftaran.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3 text-[13.5px] text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Loket Pendaftaran</span>
                  <span className="font-medium text-slate-900">
                    Lantai 1 (Admisi)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimasi Proses</span>
                  <span className="font-medium text-slate-900">
                    10 – 15 Menit
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kedatangan Disarankan</span>
                  <span className="font-medium text-slate-900">
                    15 Menit Sebelum Jadwal
                  </span>
                </div>
              </div>
            </div>

            {/* daftar langkah berurutan */}
            <div className="lg:col-span-8 border-t border-slate-200 divide-y divide-slate-200">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.04,
                    ease: EASE_SMOOTH,
                  }}
                  viewport={{ once: true, margin: "-40px" }}
                  className="py-6 md:py-7 first:pt-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                    <span className="text-sm font-semibold tracking-wider text-[#003f88] tabular-nums shrink-0">
                      LANGKAH {step.number}
                    </span>

                    <div className="flex-1">
                      <h3 className="text-lg md:text-[19px] font-semibold tracking-[-0.01em] text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-[1.65] text-slate-600">
                        {step.description}
                      </p>

                      <ul className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {step.details.map((detail, i) => (
                          <li
                            key={`${step.number}-detail-${i}`}
                            className="flex items-start gap-2.5 text-[13.5px] text-slate-700 leading-snug"
                          >
                            <span className="w-1 h-1 rounded-full bg-slate-400 mt-2 shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* pertanyaan umum (accordion bersih) */}
      <section className="w-full py-12 md:py-16 bg-slate-50/70 border-y border-slate-200">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4">
              <h2 className="text-2xl md:text-[28px] font-semibold tracking-[-0.02em] leading-[1.25] text-slate-900">
                Pertanyaan Umum
              </h2>
              <p className="mt-3 text-[14px] leading-[1.65] text-slate-600">
                Informasi yang sering ditanyakan terkait prosedur registrasi,
                dokumen persyaratan, dan penyesuaian jadwal kunjungan.
              </p>
            </div>

            <div className="lg:col-span-8 bg-white border border-slate-200 divide-y divide-slate-200">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={`faq-${index}`} className="transition-colors">
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full px-5 md:px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[15px] font-semibold text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={17}
                        className={`text-slate-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 md:px-6 pb-5 pt-0.5 text-[14px] leading-[1.65] text-slate-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* informasi layanan pendaftaran & kontak */}
      <section className="w-full py-12 md:py-16 pb-24 md:pb-20 bg-white">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8">
          <div className="border border-slate-200 p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
              <div>
                <h2 className="text-2xl md:text-[26px] font-semibold tracking-[-0.02em] text-slate-900">
                  Layanan Informasi Pendaftaran
                </h2>
                <p className="mt-2 text-[14px] text-slate-600 max-w-xl leading-relaxed">
                  Untuk konfirmasi jadwal praktik dokter atau bantuan registrasi
                  pasien, hubungi bagian informasi RS Medika Lestari.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="tel:0215847473"
                  className="inline-flex items-center justify-center gap-2 bg-[#003f88] text-white px-5 py-2.5 text-[14px] font-medium hover:bg-[#013a63] transition-colors"
                >
                  <Phone size={15} />
                  Hubungi Pendaftaran
                </a>
                <Link
                  href="/kontak-kami"
                  className="inline-flex items-center justify-center gap-1.5 border border-slate-300 text-slate-800 px-5 py-2.5 text-[14px] font-medium hover:border-slate-900 transition-colors"
                >
                  Kontak Kami
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-8">
              <div className="flex items-start gap-3.5">
                <Phone size={18} className="text-[#003f88] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                    Telepon
                  </h3>
                  <a
                    href="tel:0215847473"
                    className="mt-1 block text-[15px] font-medium text-slate-900 hover:text-[#003f88] transition-colors"
                  >
                    (021) 5847473
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail size={18} className="text-[#003f88] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </h3>
                  <a
                    href="mailto:marketing@rsmedikalestari.com"
                    className="mt-1 block text-[15px] font-medium text-slate-900 hover:text-[#003f88] transition-colors break-all"
                  >
                    marketing@rsmedikalestari.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MapPin size={18} className="text-[#003f88] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                    Lokasi
                  </h3>
                  <a
                    href="https://maps.app.goo.gl/r6xrKBK4Jwej9Zjt5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-[14.5px] font-medium text-slate-900 hover:text-[#003f88] transition-colors leading-snug"
                  >
                    Jl. HOS Cokroaminoto Ciledug, Kota Tangerang 15157
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
