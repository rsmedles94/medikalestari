"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Send, Phone, Mail, MapPin } from "lucide-react";

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
      icon: <Phone size={28} strokeWidth={1.5} />,
      title: "Telepon",
      details: "(021) 585 4858",
      subtitle: "Layanan Umum",
      action: () => window.open("https://wa.me/6282246232527", "_blank"),
    },
    {
      id: 2,
      icon: <Mail size={28} strokeWidth={1.5} />,
      title: "Email",
      details: "marketing@rsmedikalestari.com",
      subtitle: "Korespondensi",
      action: () => {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=marketing@rsmedikalestari.com`;
        window.open(gmailUrl, "_blank");
      },
    },
    {
      id: 3,
      icon: <MapPin size={28} strokeWidth={1.5} />,
      title: "Lokasi",
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
    <main className="min-h-screen bg-slate-50 text-gray-400 relative overflow-hidden pb-20">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#005cb3 0.5px, transparent 0.5px)`,
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-[1175px] mx-auto px-4 md:px-8">
        {/* BREADCRUMB (ASLI) */}
        <div className="pt-4 md:pt-16 pb-12 md:-mt-8">
          <nav className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-4">
            <Link
              href="/"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="font-normal text-gray-300">Kontak Kami</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-black border-b border-slate-100 pb-4">
            Kontak & Informasi
          </h1>
        </div>

        <p className="text-black leading-relaxed max-w-2xl opacity-80 mb-12 -mt-10">
          Silakan hubungi pusat layanan Rumah Sakit Medika Lestari untuk bantuan
          medis, jadwal dokter, atau informasi fasilitas kesehatan lainnya.
        </p>

        {/* INFO CARDS - CLEAN DESIGN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {contactInfo.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              onClick={item.action}
              className="flex flex-col items-center justify-center p-10 bg-white border border-slate-200 cursor-pointer transition-all duration-300  hover:shadow-lg hover:shadow-blue-900/5 text-center"
            >
              <div className="text-[#005cb3] mb-6">{item.icon}</div>
              <h3 className="text-xs font-bold uppercase mb-2 text-slate-400 tracking-widest">
                {item.title}
              </h3>
              <p className="text-lg font-bold text-black">{item.details}</p>
              <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FORM KIRIM PESAN */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-8 underline underline-offset-8 decoration-2">
              Kirim Pesan
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase text-black">
                    Nama Lengkap
                  </label>
                  <input
                    required
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 p-3 text-sm text-black focus:border-[#014f86] outline-none"
                    placeholder="Nama anda"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase text-black">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 p-3 text-sm text-black focus:border-[#014f86] outline-none"
                    placeholder="email@domain.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase text-black">
                  Subjek
                </label>
                <input
                  required
                  type="text"
                  name="subjek"
                  value={formData.subjek}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 p-3 text-sm text-black focus:border-[#014f86] outline-none"
                  placeholder="Tujuan pesan"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase text-black">
                  Pesan
                </label>
                <textarea
                  required
                  rows={5}
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 p-3 text-sm text-black focus:border-[#014f86] outline-none resize-none"
                  placeholder="Tulis pesan anda..."
                />
              </div>

              <button
                type="submit"
                className="bg-[#014f86] text-white px-8 py-4 text-xs font-bold uppercase hover:bg-[#014f86]/90 transition-all flex items-center gap-3 cursor-pointer hover:scale-95"
              >
                Kirim Sekarang <Send size={14} />
              </button>
            </form>
          </div>

          {/* DAFTAR EKSTENSI */}
          <div className="lg:col-span-5">
            <div className="bg-[#014f86] text-white p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full" />

              <h2 className="text-xl font-bold uppercase mb-8 border-b border-white/20 pb-4">
                Daftar Ekstensi
              </h2>
              <div className="divide-y divide-white/10">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-4 group"
                  >
                    <span className="text-xs font-medium opacity-90 group-hover:opacity-100 transition-all">
                      {dept.name}
                    </span>
                    <a
                      href={`tel:${dept.phone.replace(/\D/g, "")}`}
                      className="text-sm font-bold hover:underline transition-all"
                    >
                      {dept.phone}
                    </a>
                  </div>
                ))}
              </div>
              <div className="mt-10 p-4 bg-black/10 border-l-4 border-white">
                <p className="text-[10px] leading-relaxed font-bold uppercase">
                  * Untuk keadaan darurat, segera hubungi nomor IGD (021) 584
                  4521.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KontakKami;
