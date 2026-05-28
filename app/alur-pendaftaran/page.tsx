"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function AlurPendaftaran() {
  const steps = [
    {
      number: 1,
      title: "Persiapan Data Pribadi",
      description:
        "Siapkan dokumen identitas diri (KTP/SIM/Paspor) dan data diri Anda dengan lengkap.",
      details: [
        "Nama lengkap sesuai identitas resmi",
        "Nomor identitas (KTP/SIM/Paspor)",
        "Nomor telepon yang aktif",
        "Alamat email yang valid",
        "Alamat tinggal lengkap",
      ],
    },
    {
      number: 2,
      title: "Pilih Layanan & Dokter",
      description:
        "Tentukan jenis layanan kesehatan yang Anda butuhkan dan pilih dokter spesialis yang Anda inginkan.",
      details: [
        "Lihat daftar dokter spesialis tersedia",
        "Periksa jadwal praktek dokter",
        "Pilih layanan yang sesuai dengan kebutuhan",
        "Tentukan waktu kunjungan yang diinginkan",
      ],
    },
    {
      number: 3,
      title: "Isi Formulir Pendaftaran",
      description:
        "Lengkapi formulir pendaftaran online atau langsung di tempat pendaftaran rumah sakit.",
      details: [
        "Isi data pribadi dengan lengkap",
        "Cantumkan riwayat kesehatan",
        "Pilih metode pembayaran",
        "Setujui syarat & ketentuan",
      ],
    },
    {
      number: 4,
      title: "Pembayaran",
      description:
        "Lakukan pembayaran biaya pendaftaran sesuai dengan layanan yang dipilih.",
      details: [
        "Transfer bank untuk pembayaran online",
        "Pembayaran langsung di kasir rumah sakit",
        "Pembayaran melalui asuransi (jika ada)",
        "Dapatkan bukti pembayaran/kwitansi",
      ],
    },
    {
      number: 5,
      title: "Konfirmasi Pendaftaran",
      description:
        "Terima notifikasi/SMS konfirmasi bahwa pendaftaran Anda telah berhasil.",
      details: [
        "Menerima nomor antrian/nomor pasien",
        "Informasi jadwal kunjungan yang dikonfirmasi",
        "Petunjuk lokasi ruang pemeriksaan",
        "Panduan persiapan sebelum kunjungan",
      ],
    },
    {
      number: 6,
      title: "Datang pada Jadwal Terjadwal",
      description:
        "Hadir di rumah sakit sesuai jadwal yang telah ditentukan dengan membawa dokumen yang diperlukan.",
      details: [
        "Tiba 15 menit sebelum jadwal terjadwal",
        "Bawa KTP dan kartu asuransi (jika ada)",
        "Bawa hasil pemeriksaan sebelumnya (jika ada)",
        "Konsultasi dengan dokter spesialis",
      ],
    },
  ];

  const faqs = [
    {
      question: "Berapa lama waktu pendaftaran?",
      answer:
        "Proses pendaftaran umumnya memakan waktu 10-15 menit tergantung kelengkapan data yang Anda siapkan.",
    },
    {
      question: "Apakah bisa mendaftar online?",
      answer:
        "Ya, Anda bisa mendaftar melalui aplikasi mobile kami atau langsung datang ke bagian pendaftaran di rumah sakit.",
    },
    {
      question: "Apa yang harus dibawa saat pendaftaran?",
      answer:
        "Bawa identitas resmi (KTP/SIM/Paspor), kartu asuransi (jika ada), dan hasil pemeriksaan sebelumnya (jika ada).",
    },
    {
      question: "Bisakah saya membatalkan pendaftaran?",
      answer:
        "Anda dapat membatalkan pendaftaran dengan biaya administratif sesuai kebijakan pembatalan kami. Lihat halaman Syarat & Ketentuan untuk detail.",
    },
    {
      question: "Berapa biaya pendaftaran?",
      answer:
        "Biaya pendaftaran bervariasi sesuai dengan layanan yang dipilih. Hubungi kami untuk informasi biaya lebih detail.",
    },
    {
      question: "Bagaimana jika saya terlambat?",
      answer:
        "Hubungi kami secepatnya. Dokter akan mencoba mengakomodasi jika memungkinkan, namun prioritas diberikan kepada pasien yang tepat waktu.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section with Breadcrumb */}
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
                <span className="text-white font-medium">Alur Pendaftaran</span>
              </li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Alur Pendaftaran
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
            Panduan lengkap proses pendaftaran pasien di RS Medika Lestari.
            Ikuti langkah-langkah berikut untuk melakukan pendaftaran dengan
            mudah dan cepat.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Petunjuk Pendaftaran
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Ikuti panduan di bawah untuk melakukan pendaftaran ke RS Medika
            Lestari
          </p>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white  shadow-md hover:shadow-lg transition-shadow p-6 md:p-8"
              >
                <div className="flex gap-6">
                  {/* Step Number */}
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#003f88] text-white font-bold text-xl">
                      {step.number}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>

                    {/* Details List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {step.details.map((detail, i) => (
                        <div
                          key={`${step.number}-detail-${i}`}
                          className="flex items-start gap-3"
                        >
                          <ChevronRight
                            size={20}
                            className="text-[#003f88] shrink-0 mt-0.5"
                          />
                          <span className="text-gray-700 text-sm">
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Hubungi Kami
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Jika Anda memiliki pertanyaan tentang pendaftaran, hubungi kami
            melalui saluran berikut
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white  shadow-md p-8 text-center"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#003f88] text-white mb-4">
                <Phone size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Telepon</h3>
              <p className="text-gray-600 mb-4">(021) 5847473</p>
              <a
                href="tel:021-585-4858"
                className="inline-block bg-[#003f88] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#013a63] transition-colors text-sm"
              >
                Hubungi Sekarang
              </a>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white shadow-md p-8 text-center"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#003f88] text-white mb-4">
                <Mail size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">
                marketing@rsmedikalestari.com
              </p>
              <a
                href="mailto:info@medikalestari.com"
                className="inline-block bg-[#003f88] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#013a63] transition-colors text-sm"
              >
                Kirim Email
              </a>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white shadow-md p-8 text-center"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#003f88] text-white mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Lokasi</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Jl. HOS Cokroaminoto Ciledug, Kota Tanggerang 15157
              </p>
              <a
                href="https://maps.app.goo.gl/r6xrKBK4Jwej9Zjt5"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#003f88] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#013a63] transition-colors text-sm"
              >
                Lihat Lokasi
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Pertanyaan Umum
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Jawaban untuk pertanyaan yang sering ditanyakan tentang proses
            pendaftaran
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={`faq-${index}-${faq.question}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 border border-gray-200 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-3 text-lg">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#003f88] text-white ">
        <div className="max-w-[1172px] mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap untuk Mendaftar?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Jangan ragu untuk menghubungi kami atau datang langsung ke rumah
            sakit untuk melakukan pendaftaran.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:021-585-4858"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#003f88] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              <Phone size={20} />
              Hubungi Kami
            </a>
            <Link
              href="/kontak-kami"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-[#003f88] transition-colors mb-20 md:mb-0"
            >
              Kontak Kami
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
