"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Send, ArrowRight, AlertCircle } from "lucide-react";

const FEATURES_DATA = [
  {
    icon: "/images/icons/whatsapp.svg",
    title: "Ask Us",
    link: "https://wa.me/6285717028133",
  },
  {
    icon: "/images/icons/instagram.svg",
    title: "@rsmedikalestari",
    link: "https://www.instagram.com/rsmedikalestari",
  },
  {
    icon: "/images/icons/youtube.svg",
    title: "RS Medika Lestari",
    link: "https://www.youtube.com/@RSMedikaLestari",
  },
  {
    icon: "/images/icons/callcenter.svg",
    title: "Customer Care",
    link: "tel:1500XXX",
  },
  {
    icon: "/images/icons/threads.svg",
    title: "@rsmedikalestari",
    link: "https://www.threads.net/@rsmedikalestari",
  },
  {
    icon: "/images/icons/tiktok.svg",
    title: "RS Medika Lestari",
    link: "https://www.tiktok.com/@rsmedikalestariciledug",
  },
];

const KontakKami = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });

  const contactInfo = [
    {
      id: 2,
      title: "Email",
      details: "marketing@rsmedikalestari.com",
      subtitle: "Hubungan Masyarakat & Kemitraan",
      icon: (
        <Image
          src="/images/icons/gmail.svg"
          alt="Gmail Icon"
          width={40}
          height={40}
          className="object-contain"
        />
      ),
      action: () => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=marketing@rsmedikalestari.com`;
        window.open(gmailUrl, "_blank");
      },
    },
    {
      id: 3,
      title: "Lokasi Kami",
      details:
        "Jl. HOS Cokroaminoto No.56, RT.001/RW.012, Kec. Karang Tengah, Kota Tangerang, Banten 15151",
      icon: (
        <Image
          src="/images/icons/gmaps.svg"
          alt="Map Icon"
          width={40}
          height={40}
          className="object-contain"
        />
      ),
      action: () =>
        window.open("https://maps.app.goo.gl/zgcaBi6iNRcpiNWFA", "_blank"),
    },
  ];

  const departments = [
    { name: "IGD (Gawat Darurat)", phone: "(021) 584 4521", isUrgent: true },
    { name: "Pendaftaran Jalan", phone: "(021) 585 4858", isUrgent: false },
    { name: "Radiologi", phone: "Ext. 112", isUrgent: false },
    { name: "Laboratorium", phone: "Ext. 105", isUrgent: false },
    { name: "Farmasi", phone: "Ext. 201", isUrgent: false },
    { name: "Informasi", phone: "021-585-4858", isUrgent: false },
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mailtoUrl = `mailto:marketing@rsmedikalestari.com?subject=${encodeURIComponent(formData.subjek)}&body=${encodeURIComponent(`Nama: ${formData.nama}\nEmail: ${formData.email}\n\nPesan:\n${formData.pesan}`)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-700 pb-20">
      <div className="max-w-[1172px] mx-auto px-4 md:px-8">
        {/* BREADCRUMB & TITLE SECTION */}
        <div className="pt-8 md:pt-16 pb-12">
          <nav className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-4">
            <Link
              href="/"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={12} className="text-black/60" />
            <span className="font-normal">Kontak Kami</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-black border-b border-slate-100 pb-4">
            Kontak Kami
          </h1>
        </div>

        <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl mb-10">
          Silakan hubungi pusat layanan Rumah Sakit Medika Lestari melalui kanal
          media sosial resmi, layanan pelanggan, atau kunjungi langsung
          fasilitas kesehatan kami di bawah ini.
        </p>

        {/* SECTION 6 MENU SOSIAL MEDIA & LAYANAN */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES_DATA.map((feat, index) => (
              <a
                key={index}
                href={feat.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-white rounded-none border border-transparent hover:shadow-md transition-all duration-200 min-h-[88px] group"
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center">
                    <Image
                      src={feat.icon}
                      alt={feat.title}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[16px] font-bold tracking-wide leading-snug text-slate-800 group-hover:text-[#003f88] transition-colors">
                    {feat.title}
                  </span>
                </div>
                <div className="shrink-0 pl-2 transform group-hover:translate-x-1 transition-transform">
                  <svg
                    className="w-3 h-3 text-[#003f88]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 2 INFO LAYANAN UTAMA (SETELAH PUSAT TELEPON DIHAPUS) */}
        <div className="flex flex-col gap-4 mb-12">
          {contactInfo.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-none border border-transparent hover:shadow-md cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <span className="text-base font-semibold text-[#003f88]  tracking-wider block mb-0.5">
                    {item.title}
                  </span>
                  <p className="text-base font-bold text-slate-900 transition-colors">
                    {item.details}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:text-right">
                <span className="text-xs md:text-sm text-slate-500 font-medium">
                  {item.subtitle}
                </span>
                <ArrowRight
                  size={16}
                  className="text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 hidden sm:block"
                />
              </div>
            </div>
          ))}
        </div>

        {/* LAYOUT DUA KOLOM SIMETRIS (50:50) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* FORM KIRIM PESAN */}
          <div className="bg-white rounded-none border border-transparent p-6 md:p-8 transition-all duration-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
                Kirim Pesan
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      Nama Lengkap
                    </label>
                    <input
                      required
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-none p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white outline-none transition-all"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      Alamat Email
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-none p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white outline-none transition-all"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Subjek Pesan
                  </label>
                  <input
                    required
                    type="text"
                    name="subjek"
                    value={formData.subjek}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-none p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white outline-none transition-all"
                    placeholder="Perihal keperluan"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Isi Pesan
                  </label>
                  <textarea
                    required
                    rows={5}
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-none p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white outline-none resize-none transition-all"
                    placeholder="Tuliskan pesan atau pertanyaan Anda..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#003f88] hover:bg-[#002b5c] text-white px-6 py-3 rounded-none text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  Kirim Pesan <Send size={13} />
                </button>
              </form>
            </div>
          </div>

          {/* DAFTAR EKSTENSI */}
          <div className="bg-white rounded-none border border-transparent p-6 md:p-8 transition-all duration-200 flex flex-col justify-between mb-5 md:mb-0">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
                Silahkan hubungi nomer dibawah
              </h2>

              <div className="divide-y divide-slate-100">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3.5"
                  >
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      {dept.isUrgent && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      )}
                      {dept.name}
                    </span>
                    <a
                      href={`tel:${dept.phone.replace(/\D/g, "")}`}
                      className={`text-sm font-bold transition-colors ${
                        dept.isUrgent
                          ? "text-red-600 hover:text-red-700 underline"
                          : "text-[#003f88] hover:text-[#002b5c] hover:underline"
                      }`}
                    >
                      {dept.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* BOX INFORMASI PENTING */}
            <div className="mt-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-none flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-red-800 font-medium">
                <span className="font-bold">Penting:</span> Untuk penanganan
                darurat segera medis, silakan hubungi pusat penanganan langsung
                IGD pada nomor{" "}
                <a href="tel:0215844521" className="font-bold underline">
                  (021) 584 4521
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KontakKami;
