"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Send } from "lucide-react";

const FEATURES_DATA = [
  {
    icon: "/images/icons/whatsapp.svg",
    title: "Tanya Kami?",
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
    title: "Telpon Darurat",
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mailtoUrl = `mailto:marketing@rsmedikalestari.com?subject=${encodeURIComponent(
      formData.subjek,
    )}&body=${encodeURIComponent(
      `Nama: ${formData.nama}\nEmail: ${formData.email}\n\nPesan:\n${formData.pesan}`,
    )}`;
    window.location.href = mailtoUrl;
  };

  return (
    <main className="min-h-screen bg-white text-slate-700 pb-20 font-sans">
      <div className="max-w-[1172px] mx-auto px-4 md:px-8">
        {/* BREADCRUMB & TITLE SECTION */}
        <div className="pt-8 md:pt-16 pb-2">
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

        {/* FORM PESAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4">
          {/* FORM KIRIM PESAN */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col">
            <section className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 flex flex-col justify-between h-full">
              <div className="flex flex-col h-full">
                <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
                  Kirim Pesan
                </h2>

                <form
                  className="space-y-4 flex flex-col flex-1"
                  onSubmit={handleSubmit}
                >
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
                        className="w-full bg-slate-50/50 border border-slate-200/60 rounded-lg p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white outline-none transition-colors"
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
                        className="w-full bg-slate-50/50 border border-slate-200/60 rounded-lg p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white outline-none transition-colors"
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
                      className="w-full bg-slate-50/50 border border-slate-200/60 rounded-lg p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white outline-none transition-colors"
                      placeholder="Perihal keperluan"
                    />
                  </div>

                  {/* Isi pesan  */}
                  <div className="flex flex-col gap-1.5 flex-1 min-h-[160px]">
                    <label className="text-xs font-semibold text-slate-600">
                      Isi Pesan
                    </label>
                    <textarea
                      required
                      name="pesan"
                      value={formData.pesan}
                      onChange={handleChange}
                      className="w-full h-full flex-1 bg-slate-50/50 border border-slate-200/60 rounded-lg p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white outline-none resize-none transition-colors"
                      placeholder="Tuliskan pesan atau pertanyaan Anda..."
                    />
                  </div>

                  {/* Tombol kecil dan ringkas */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#003f88] hover:bg-[#002b5c] text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Kirim Pesan <Send size={12} />
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>

          {/* SOSIAL MEDIA */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col">
            <section
              aria-label="Media Sosial dan Kanal Resmi"
              className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 flex flex-col h-full justify-between"
            >
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
                  Media Sosial Kami
                </h2>
                <div className="flex flex-col gap-4">
                  {FEATURES_DATA.map((feat, index) => (
                    <a
                      key={index}
                      href={feat.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white border border-slate-200 hover:shadow-md rounded-full transition-colors min-h-[72px] group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 w-9 h-9 flex items-center justify-center">
                          <Image
                            src={feat.icon}
                            alt={feat.title}
                            width={36}
                            height={36}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[15px] font-semibold text-slate-800">
                          {feat.title}
                        </span>
                      </div>
                      <div className="shrink-0 pl-2 text-slate-400 group-hover:text-[#003f88] transition-colors">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* GOOGLE MAPS  */}
        <div className="mt-8">
          <section className="bg-white border border-slate-200 rounded-lg p-6 md:p-8">
            <h2 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Lokasi Rumah Sakit
            </h2>
            <div className="w-full h-[400px] overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4880.401141816898!2d106.70870002499038!3d-6.224877593763206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fa1cb5b440a1%3A0xe21244587f98ac8f!2sRS%20Medika%20Lestari!5e1!3m2!1sid!2sid!4v1791648435409!5m2!1sid!2sid"
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default KontakKami;
