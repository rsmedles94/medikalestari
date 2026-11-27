"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

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

export default function AlurPendaftaran() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((current) => (current === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-[#f7f9fb] text-slate-900">
      {/* HEADER HALAMAN + TAHAPAN PENDAFTARAN */}
      <div className="w-full bg-[#f7f9fb] pb-12 pt-8 md:pb-16 md:pt-15">
        <div className="mx-auto max-w-[1172px] px-4 py-0 md:px-8 md:py-2">
          <header className="border-b border-slate-200 pb-6 md:pb-8">
            <motion.nav
              className="mb-6"
              aria-label="Breadcrumb"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_SMOOTH }}
            >
              <ol className="m-0 flex list-none items-center gap-1 p-0 text-[14px] font-normal">
                <li>
                  <Link
                    href="/"
                    className="text-slate-500 transition-colors hover:text-slate-900"
                  >
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true" className="flex items-center">
                  <ChevronRight size={12} className="text-slate-400" />
                </li>
                <li aria-current="page" className="font-normal text-slate-900">
                  Alur Pendaftaran
                </li>
              </ol>
            </motion.nav>

            <motion.h1
              className="text-4xl font-bold tracking-[-0.02em] text-slate-900 md:text-4xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.06, ease: EASE_SMOOTH }}
            >
              Alur Pendaftaran
            </motion.h1>
          </header>

          <section aria-labelledby="tahapan-heading">
            <header className="mb-8 mt-10 max-w-2xl md:mb-10 md:mt-12">
              <p className="mt-3 max-w-xl text-[14px] leading-7 text-slate-600">
                Ikuti tahapan berikut agar proses administrasi dan kunjungan
                berjalan tertib. Siapkan dokumen yang diperlukan sebelum
                melakukan registrasi.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
              {/* daftar tahapan berurutan */}
              <ol className="m-0 list-none space-y-3 p-0" role="list">
                {steps.map((step, index) => (
                  <motion.li
                    key={step.number}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.035,
                      ease: EASE_SMOOTH,
                    }}
                    viewport={{ once: true, margin: "-30px" }}
                    className="grid grid-cols-[42px_minmax(0,1fr)] gap-4 border border-slate-200 bg-white p-5 md:grid-cols-[52px_minmax(0,1fr)] md:gap-5 md:p-6"
                  >
                    {/* nomor tahap (urutan sudah diumumkan oleh <ol>) */}
                    <div
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8e4eb] bg-[#003f88] text-[15px] font-bold tabular-nums text-white md:h-12 md:w-12 md:text-[17px]"
                    >
                      {step.number}
                    </div>

                    <div className="min-w-0 pt-2 md:pt-3">
                      <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.015em] text-slate-900 md:text-[18px]">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-3xl text-[13.5px] leading-[1.75] text-slate-600 md:text-[14px]">
                        {step.description}
                      </p>

                      <ul className="mt-4 grid list-none grid-cols-1 gap-x-7 gap-y-2 p-0 sm:grid-cols-2">
                        {step.details.map((detail) => (
                          <li
                            key={`${step.number}-${detail}`}
                            className="flex items-start gap-2.5 text-[13px] leading-[1.6] text-slate-700"
                          >
                            <Check
                              size={14}
                              strokeWidth={2}
                              aria-hidden="true"
                              className="mt-[2px] shrink-0 text-[#527b91]"
                            />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.li>
                ))}
              </ol>

              {/* informasi kunjungan */}
              <aside
                aria-labelledby="info-kunjungan-heading"
                className="h-fit border border-slate-200 bg-white lg:sticky lg:top-40"
              >
                <header className="border-b border-slate-200 px-5 py-5">
                  <p className="text-[20px] font-semibold  text-[#003f88]">
                    Informasi kunjungan
                  </p>
                  <h3
                    id="info-kunjungan-heading"
                    className="mt-2 text-[17px] font-semibold text-slate-900"
                  >
                    Sebelum datang
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-slate-600">
                    Perhatikan informasi berikut untuk membantu mempersiapkan
                    kunjungan Anda.
                  </p>
                </header>

                <dl className="m-0 divide-y divide-slate-100 px-5">
                  <div className="py-4">
                    <dt className="text-[12px] text-slate-500">
                      Loket pendaftaran
                    </dt>
                    <dd className="m-0 mt-1 text-[14px] font-semibold text-slate-800">
                      Lantai 1 (Admisi)
                    </dd>
                  </div>
                  <div className="py-4">
                    <dt className="text-[12px] text-slate-500">
                      Estimasi proses
                    </dt>
                    <dd className="m-0 mt-1 text-[14px] font-semibold text-slate-800">
                      10–15 menit
                    </dd>
                  </div>
                  <div className="py-4">
                    <dt className="text-[12px] text-slate-500">
                      Waktu kedatangan
                    </dt>
                    <dd className="m-0 mt-1 text-[14px] font-semibold text-slate-800">
                      15 menit sebelum jadwal
                    </dd>
                  </div>
                </dl>

                <footer className="border-t border-slate-200 bg-[#f7f9fb] px-5 py-4">
                  <p className="text-[12px] leading-5 text-slate-600">
                    Pastikan membawa identitas diri dan dokumen penjaminan
                    apabila menggunakan asuransi.
                  </p>
                </footer>
              </aside>
            </div>
          </section>
        </div>
      </div>

      {/* PERTANYAAN UMUM */}
      <section
        aria-labelledby="faq-heading"
        className="w-full border-y border-slate-200 bg-slate-50/70 py-12 md:py-16"
      >
        <div className="mx-auto max-w-[1172px] px-4 md:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <header className="lg:col-span-4">
              <h2
                id="faq-heading"
                className="text-2xl font-semibold leading-[1.25] tracking-[-0.02em] text-slate-900 md:text-[28px]"
              >
                Pertanyaan Umum
              </h2>
              <p className="mt-3 text-[14px] leading-[1.65] text-slate-600">
                Informasi yang sering ditanyakan terkait prosedur registrasi,
                dokumen persyaratan, dan penyesuaian jadwal kunjungan.
              </p>
            </header>

            <div className="divide-y divide-slate-200 border border-slate-200 bg-white lg:col-span-8">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                const buttonId = `faq-button-${index}`;
                const panelId = `faq-panel-${index}`;

                return (
                  <div key={buttonId} className="transition-colors">
                    <h3 className="m-0">
                      <button
                        type="button"
                        id={buttonId}
                        onClick={() => toggleFaq(index)}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-[17px] text-left transition-colors hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#003f88]/40 md:px-6"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                      >
                        <span className="text-[14px] font-semibold leading-6 text-slate-900 md:text-[15px]">
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={17}
                          aria-hidden="true"
                          className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      className="px-5 pb-5 pt-0.5 text-[13.5px] leading-[1.75] text-slate-600 md:px-6 md:text-[14px]"
                    >
                      <p className="m-0">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* INFORMASI KONTAK */}
      <section
        aria-labelledby="kontak-heading"
        className="bg-white py-12 pb-20 md:py-16"
      >
        <div className="mx-auto max-w-[1172px] px-4 md:px-8">
          <div className="border border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="p-6 md:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#003f88]">
                  Bantuan dan informasi
                </p>
                <h2
                  id="kontak-heading"
                  className="mt-2 text-[23px] font-semibold tracking-[-0.02em] text-slate-900 md:text-[26px]"
                >
                  Layanan Informasi Pendaftaran
                </h2>
                <p className="mt-3 max-w-xl text-[14px] leading-7 text-slate-600">
                  Untuk konfirmasi jadwal praktik dokter atau bantuan registrasi
                  pasien, silakan hubungi bagian informasi RS Medika Lestari.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="tel:0215847473"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#003f88] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#e67e22]"
                  >
                    <Phone size={15} aria-hidden="true" />
                    Hubungi Pendaftaran
                  </a>
                  <Link
                    href="/kontak-kami"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-[13px] font-semibold text-slate-700 transition-colors hover:border-slate-500 hover:bg-slate-50"
                  >
                    Kontak Kami
                    <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <aside
                aria-labelledby="jam-layanan-heading"
                className="border-t border-slate-200 bg-[#f7f9fb] p-6 md:p-7 lg:border-l lg:border-t-0"
              >
                <h3
                  id="jam-layanan-heading"
                  className="text-[13px] font-semibold text-slate-900"
                >
                  Jam dan layanan informasi
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-slate-600">
                  Hubungi petugas untuk memperoleh informasi lebih lanjut
                  mengenai pendaftaran dan jadwal layanan.
                </p>
                <div className="mt-5 border-t border-slate-200 pt-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-500">
                    Telepon pendaftaran
                  </p>
                  <a
                    href="tel:0215847473"
                    className="mt-1.5 inline-block text-[17px] font-semibold tracking-tight text-[#24536f] hover:underline"
                  >
                    (021) 5847473
                  </a>
                </div>
              </aside>
            </div>

            {/* email & lokasi */}
            <address className="grid grid-cols-1 divide-y divide-slate-200 border-t border-slate-200 not-italic md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex items-start gap-3.5 p-6 md:px-8">
                <Mail
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#003f88]"
                  strokeWidth={1.8}
                />
                <div className="min-w-0">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Email
                  </h3>
                  <a
                    href="mailto:marketing@rsmedikalestari.com"
                    className="mt-1.5 block break-all text-[14px] font-medium text-slate-800 hover:text-[#24536f]"
                  >
                    marketing@rsmedikalestari.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-6 md:px-8">
                <MapPin
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#003f88]"
                  strokeWidth={1.8}
                />
                <div className="min-w-0">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Lokasi rumah sakit
                  </h3>
                  <a
                    href="https://maps.app.goo.gl/r6xrKBK4Jwej9Zjt5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 block text-[14px] font-medium leading-6 text-slate-800 hover:text-[#24536f]"
                  >
                    Jl. HOS Cokroaminoto Ciledug, Kota Tangerang 15157
                  </a>
                </div>
              </div>
            </address>
          </div>
        </div>
      </section>
    </main>
  );
}
