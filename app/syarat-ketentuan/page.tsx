import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

const SyaratKetentuan = () => {
  const sections = [
    {
      id: "umum",
      title: "1. Ketentuan Umum",
      href: "/syarat-ketentuan/umum",
      content:
        "Penjelasan tentang ketentuan umum penggunaan layanan RS Medika Lestari.",
    },
    {
      id: "hak-kewajiban",
      title: "2. Hak dan Kewajiban Pasien",
      href: "/syarat-ketentuan/hak-kewajiban",
      content:
        "Hak dan kewajiban yang dimiliki oleh setiap pasien dalam menggunakan layanan kami.",
    },
    {
      id: "privasi",
      title: "3. Kebijakan Privasi",
      href: "/syarat-ketentuan/privasi",
      content: "Kebijakan privasi dan perlindungan data pribadi pasien.",
    },
    {
      id: "pembayaran",
      title: "4. Ketentuan Pembayaran",
      href: "/syarat-ketentuan/pembayaran",
      content:
        "Ketentuan dan tata cara pembayaran untuk layanan kesehatan kami.",
    },
    {
      id: "pembatalan",
      title: "5. Kebijakan Pembatalan",
      href: "/syarat-ketentuan/pembatalan",
      content: "Kebijakan pembatalan untuk janji temu dan layanan medis.",
    },
    {
      id: "pertanggungjawaban",
      title: "6. Pertanggungjawaban",
      href: "/syarat-ketentuan/pertanggungjawaban",
      content:
        "Tanggung jawab RS Medika Lestari dalam memberikan pelayanan kesehatan.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Breadcrumb />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-[#003f88] to-[#003f88] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Syarat & Ketentuan
          </h1>
          <p className="text-lg opacity-90">
            Harap membaca dengan cermat syarat dan ketentuan penggunaan layanan
            RS Medika Lestari
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {sections.map((section) => (
              <Link key={section.id} href={section.href}>
                <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg hover:border-[#003f88] transition-all cursor-pointer group">
                  <h3 className="text-xl font-bold text-[#003f88] group-hover:text-[#003f88] mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-600">{section.content}</p>
                  <div className="flex items-center mt-4 text-[#003f88] font-semibold">
                    Baca Selengkapnya
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-12 p-6 bg-blue-50 border-l-4 border-[#003f88] rounded">
            <h3 className="text-lg font-bold text-[#003f88] mb-4">
              Ringkasan Penting
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-[#003f88] font-bold mr-3">✓</span>
                <span>
                  Pasien berhak mendapatkan informasi lengkap tentang layanan
                  kesehatan
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#003f88] font-bold mr-3">✓</span>
                <span>
                  Data pribadi dan medis pasien dilindungi dengan ketat
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#003f88] font-bold mr-3">✓</span>
                <span>
                  Pembayaran dapat dilakukan melalui berbagai metode yang
                  tersedia
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#003f88] font-bold mr-3">✓</span>
                <span>
                  Pembatalan dapat dilakukan dengan ketentuan dan waktu tertentu
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SyaratKetentuan;
