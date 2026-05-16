"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { ChevronRight, Send } from "lucide-react";

const KontakKami = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });

  const contactInfo = [
    {
      id: 1,
      title: "Pusat Telepon",
      details: "(021) 585 4858",
      subtitle: "Layanan Umum & Informasi",
      action: () => window.open("https://wa.me/6282246232527", "_blank"),
    },
    {
      id: 2,
      title: "Korespondensi Email",
      details: "marketing@rsmedikalestari.com",
      subtitle: "Hubungan Masyarakat & Kemitraan",
      action: () => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=marketing@rsmedikalestari.com`;
        window.open(gmailUrl, "_blank");
      },
    },
    {
      id: 3,
      title: "Lokasi Fisik",
      details: "Jl. HOS Cokroaminoto No.1",
      subtitle: "Ciledug, Tangerang",
      action: () => window.open("https://maps.google.com", "_blank"),
    },
  ];

  const departments = [
    { name: "IGD (Gawat Darurat)", phone: "(021) 584 4521" },
    { name: "Pendaftaran Jalan", phone: "(021) 585 4858" },
    { name: "Radiologi", phone: "Ext. 112" },
    { name: "Laboratorium", phone: "Ext. 105" },
    { name: "Farmasi", phone: "Ext. 201" },
    { name: "Informasi", phone: "021-585-4858" },
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
      <div className="max-w-[1175px] mx-auto  md:py-5 px-4 md:px-8">
        {/* BREADCRUMB & HEADER */}
        <div className="pt-8 md:pt-12 pb-6">
          <nav className="flex items-center gap-2 text-sm text-black/60 mb-3">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Beranda
            </Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-300 font-normal">Kontak Kami</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 border-b border-slate-200 pb-4">
            Kontak & Informasi
          </h1>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mb-10">
          Silakan hubungi pusat layanan Rumah Sakit Medika Lestari untuk bantuan
          medis, jadwal dokter, atau informasi fasilitas kesehatan lainnya.
        </p>

        {/* 3 BAR BERTUMPU PERSEGI PANJANG (INFO LAYANAN) */}
        <div className="flex flex-col gap-4 mb-8">
          {contactInfo.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-200 cursor-pointer hover:border-[#005cb3] transition-colors"
            >
              <div className="mb-2 md:mb-0">
                <span className="text-xs font-semibold text-[#005cb3] block mb-1">
                  {item.title}
                </span>
                <p className="text-base font-bold text-slate-900">
                  {item.details}
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className="text-xs text-slate-500">{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* LAYOUT DUA KOLOM SIMETRIS (50:50) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* FORM KIRIM PESAN */}
          <div className="bg-white p-6 md:p-8 border border-slate-200 h-full">
            <h2 className="text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">
              Kirim Pesan
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Nama Lengkap
                  </label>
                  <input
                    required
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm text-slate-900 focus:border-[#005cb3] focus:bg-white outline-none"
                    placeholder="Nama lengkap"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Alamat Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm text-slate-900 focus:border-[#005cb3] focus:bg-white outline-none"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Subjek Pesan
                </label>
                <input
                  required
                  type="text"
                  name="subjek"
                  value={formData.subjek}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm text-slate-900 focus:border-[#005cb3] focus:bg-white outline-none"
                  placeholder="Perihal keperluan"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Isi Pesan
                </label>
                <textarea
                  required
                  rows={5}
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-sm text-slate-900 focus:border-[#005cb3] focus:bg-white outline-none resize-none"
                  placeholder="Tuliskan pesan atau pertanyaan Anda..."
                />
              </div>

              <button
                type="submit"
                className="bg-[#005cb3] hover:bg-[#004b93] text-white px-6 py-3 text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
              >
                Kirim Pesan <Send size={12} />
              </button>
            </form>
          </div>

          {/* DAFTAR EKSTENSI */}
          <div className="bg-white border border-slate-200 p-6 md:p-8 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">
                Daftar Hubungan Internal (Extension)
              </h2>

              <div className="divide-y divide-slate-100">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3.5"
                  >
                    <span className="text-sm font-normal text-slate-700">
                      {dept.name}
                    </span>
                    <a
                      href={`tel:${dept.phone.replace(/\D/g, "")}`}
                      className="text-sm font-semibold text-[#005cb3] hover:underline"
                    >
                      {dept.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-red-50/50 border-l-2 border-red-500">
              <p className="text-xs leading-relaxed text-red-800">
                Penting: Untuk penanganan darurat segera medis, silakan hubungi
                pusat penanganan langsung IGD pada nomor (021) 584 4521.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KontakKami;
