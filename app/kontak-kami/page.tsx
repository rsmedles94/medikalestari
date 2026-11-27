"use client";

import React, { useState, Suspense, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

const SOCIAL_LINKS = [
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

interface KontakKamiContentProps {
  initialEmail: string;
}

const KontakKamiContent = ({ initialEmail }: KontakKamiContentProps) => {
  const [formData, setFormData] = useState({
    nama: "",
    email: initialEmail,
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
    <main className="min-h-screen bg-[#f8fafc] text-slate-700 pb-20 font-sans">
      <div className="max-w-[1172px] mx-auto px-4 md:px-8">
        {/* header & breadcrumb */}
        <header className="pt-8 md:pt-16 pb-2">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-sm text-slate-400 mb-4"
          >
            <Link
              href="/"
              className="text-slate-600 hover:text-[#003f88] transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span>Kontak Kami</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 border-b border-slate-200/80 pb-4">
            Kontak Kami
          </h1>
        </header>

        {/* grid utama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-6">
          {/* form pesan */}
          <section
            aria-labelledby="form-heading"
            className="lg:col-span-7 order-2 lg:order-1 bg-white border border-slate-200/70 rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_10px_24px_-6px_rgba(15,23,42,0.05)] flex flex-col"
          >
            <h2
              id="form-heading"
              className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100"
            >
              Kirim Pesan
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 flex flex-col flex-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="nama"
                    className="text-xs font-semibold text-slate-600"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="nama"
                    required
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full bg-slate-50/70 border border-slate-200/80 rounded-lg p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white focus:ring-2 focus:ring-[#003f88]/10 outline-none transition-all"
                    placeholder="Nama lengkap"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold text-slate-600"
                  >
                    Alamat Email
                  </label>
                  <input
                    id="email"
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50/70 border border-slate-200/80 rounded-lg p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white focus:ring-2 focus:ring-[#003f88]/10 outline-none transition-all"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="subjek"
                  className="text-xs font-semibold text-slate-600"
                >
                  Subjek Pesan
                </label>
                <input
                  id="subjek"
                  required
                  type="text"
                  name="subjek"
                  value={formData.subjek}
                  onChange={handleChange}
                  className="w-full bg-slate-50/70 border border-slate-200/80 rounded-lg p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white focus:ring-2 focus:ring-[#003f88]/10 outline-none transition-all"
                  placeholder="Perihal keperluan"
                />
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-h-[160px]">
                <label
                  htmlFor="pesan"
                  className="text-xs font-semibold text-slate-600"
                >
                  Isi Pesan
                </label>
                <textarea
                  id="pesan"
                  required
                  name="pesan"
                  value={formData.pesan}
                  onChange={handleChange}
                  className="w-full h-full flex-1 bg-slate-50/70 border border-slate-200/80 rounded-lg p-3 text-sm text-slate-900 focus:border-[#003f88] focus:bg-white focus:ring-2 focus:ring-[#003f88]/10 outline-none resize-none transition-all"
                  placeholder="Tuliskan pesan atau pertanyaan Anda..."
                />
              </div>

              {/* button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#003f88] hover:bg-[#002b5c] active:scale-[0.99] text-white px-8 py-3.5 rounded-lg text-sm font-semibold transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>Kirim Pesan</span>
                </button>
              </div>
            </form>
          </section>

          {/* sosial media */}
          <aside
            aria-labelledby="social-heading"
            className="lg:col-span-5 order-1 lg:order-2 bg-white border border-slate-200/70 rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_10px_24px_-6px_rgba(15,23,42,0.05)] flex flex-col justify-between"
          >
            <div>
              <h2
                id="social-heading"
                className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100"
              >
                Media Sosial Kami
              </h2>
              <ul className="flex flex-col gap-4">
                {SOCIAL_LINKS.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white border border-slate-200/70 hover:shadow-md rounded-full shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors min-h-[72px] group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="shrink-0 w-9 h-9 flex items-center justify-center">
                          <Image
                            src={item.icon}
                            alt={item.title}
                            width={36}
                            height={36}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[15px] font-semibold text-slate-800">
                          {item.title}
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
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* google maps */}
        <section
          aria-labelledby="map-heading"
          className="mt-8 bg-white border border-slate-200/70 rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_10px_24px_-6px_rgba(15,23,42,0.05)]"
        >
          <h2
            id="map-heading"
            className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100"
          >
            Lokasi Rumah Sakit
          </h2>
          <div className="w-full h-[400px] overflow-hidden rounded-lg border border-slate-200/80">
            <iframe
              title="Lokasi RS Medika Lestari"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4880.401141816898!2d106.70870002499038!3d-6.224877593763206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fa1cb5b440a1%3A0xe21244587f98ac8f!2sRS%20Medika%20Lestari!5e1!3m2!1sid!2sid!4v1791648435409!5m2!1sid!2sid"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

// query params
const KontakKamiWithQuery = () => {
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  return (
    <KontakKamiContent key={emailFromQuery} initialEmail={emailFromQuery} />
  );
};

// root component
const KontakKami = () => (
  <Suspense fallback={<KontakKamiContent initialEmail="" />}>
    <KontakKamiWithQuery />
  </Suspense>
);

export default KontakKami;
