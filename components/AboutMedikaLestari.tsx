"use client";

import React from "react";
import Image from "next/image";

const AboutMedikaLestari = () => {
  const excellencePoints = [
    {
      title: "Women's Health Center",
      desc: "Perawatan kesehatan khusus untuk wanita, termasuk kebidanan, ginekologi, dan kesehatan reproduksi.",
    },
    {
      title: "Stroke Assisted Living Center",
      desc: "Pusat pemulihan pasca-stroke pertama di Indonesia yang terintegrasi langsung dengan rumah sakit.",
    },
    {
      title: "Emergency & Heart Attack Center",
      desc: "Unit gawat darurat kami siap 24/7 untuk menangani kondisi darurat, termasuk serangan jantung, dengan respons cepat.",
    },
    {
      title: "Heart & Vascular Center",
      desc: "Pusat jantung dan vaskular dengan teknologi mutakhir untuk diagnosa dan pengobatan penyakit kardiovaskular.",
    },
    {
      title: "Dental Center",
      desc: "Perawatan gigi lengkap, dari pencegahan hingga prosedur kosmetik dan bedah mulut dengan teknologi canggih.",
    },
  ];

  return (
    <section className="py-16 bg-[#005753]/5 overflow-hidden mt-10">
      <div className="relative z-10 max-w-290 mx-auto px-4 md:px-8">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="mb-8">
            {/* Menggunakan logo medikalestari.png dari folder public */}
            <div className="relative w-20 h-20">
              <Image
                src="/medikalestari.png"
                alt="Logo Medika Lestari"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-black uppercase tracking-widest">
           Layanan Kesehatan Medika Lestari
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Kolom Kiri: Teks & List */}
          <div className="w-full lg:w-1/2">
            {/* Text Justify di sini */}
            <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base text-justify">
              Pusat kesehatan terpadu yang menyediakan berbagai layanan medis
              unggulan untuk memenuhi kebutuhan kesehatan Anda dan keluarga
              dengan standar pelayanan tinggi, didukung oleh tenaga medis ahli
              dan teknologi terkini.
            </p>

            <ul className="space-y-5">
              {excellencePoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-[#005753] rounded-full p-1 shadow-sm">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={4}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    {/* Text Justify pada deskripsi list */}
                    <p className="text-gray-900 text-sm md:text-base text-justify">
                      <span className="font-bold">{point.title}:</span>{" "}
                      <span className="text-gray-600">{point.desc}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Kanan: Video Youtube Utama & Video Lainnya */}
          <div className="w-full lg:w-1/2">
            {/* Iframe Utama */}
            <div className="relative pt-[56.25%] overflow-hidden bg-slate-100">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/52jXBsYay1U"
                title="Medika Lestari Center of Excellence"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>


            {/* Bagian Video Lainnya (2 Video Kecil) */}
            <div className="mt-8">
              <h4 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-[#005753] pl-3">
                Video Lainnya
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Video 1 */}
                <div className="relative pt-[56.25%] overflow-hidden bg-slate-200">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/m8IpHYHFhIY"
                    title="Video Pendukung 1"
                    allowFullScreen
                  ></iframe>
                </div>
                {/* Video 2 */}
                <div className="relative pt-[56.25%] overflow-hidden bg-slate-200">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/Y22T2vcL_Dg"
                    title="Video Pendukung 2"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMedikaLestari;
