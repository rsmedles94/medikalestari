import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

const KetentruanUmum = () => {
  const breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    { label: "Ketentuan Umum", href: "/syarat-ketentuan/umum" },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Breadcrumb items={breadcrumbs} />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#173A87] to-[#173A87] text-white py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">Ketentuan Umum</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-blue max-w-none">
            <h2 className="text-2xl font-bold text-[#173A87] mb-6">
              Ketentuan Umum Penggunaan Layanan
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  1.1 Definisi dan Penjelasan
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  RS Medika Lestari adalah fasilitas kesehatan yang menyediakan
                  layanan medis lengkap untuk masyarakat. Layanan kami mencakup
                  konsultasi dokter, pemeriksaan laboratorium, radiologi, kamar
                  perawatan, dan berbagai spesialisasi medis lainnya.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  1.2 Ruang Lingkup Ketentuan
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ketentuan umum ini berlaku untuk semua pasien dan pengunjung
                  yang menggunakan fasilitas dan layanan RS Medika Lestari.
                  Dengan menggunakan layanan kami, Anda telah menyetujui untuk
                  mematuhi semua ketentuan yang tercantum dalam dokumen ini.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  1.3 Batasan Tanggung Jawab
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  RS Medika Lestari berusaha memberikan layanan kesehatan
                  terbaik sesuai dengan standar medis internasional. Namun, kami
                  tidak bertanggung jawab atas:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Komplikasi medis yang bersifat tidak dapat diprediksi</li>
                  <li>Hasil perawatan yang tergantung pada kondisi pasien</li>
                  <li>
                    Kecelakaan atau insiden yang terjadi di luar kontrol kami
                  </li>
                  <li>
                    Kesalahan atau kelalaian pasien dalam mengikuti instruksi
                    medis
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  1.4 Perubahan Ketentuan
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  RS Medika Lestari berhak untuk mengubah ketentuan umum ini
                  kapan saja. Perubahan akan diberlakukan segera setelah
                  pengumuman. Penggunaan layanan kami setelah perubahan berarti
                  Anda menerima ketentuan yang telah diperbarui.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-[#173A87] p-6 rounded">
                <h3 className="text-lg font-bold text-[#173A87] mb-3">
                  Catatan Penting
                </h3>
                <p className="text-gray-700">
                  Jika Anda memiliki pertanyaan tentang ketentuan umum ini,
                  mohon hubungi bagian customer service kami melalui nomor
                  telepon (021) 585 4858 atau email
                  marketing@rsmedikalestari.com
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center pt-6 border-t">
            <Link
              href="/syarat-ketentuan"
              className="text-[#173A87] hover:text-[#001e3d] font-semibold flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali
            </Link>
            <Link
              href="/syarat-ketentuan/hak-kewajiban"
              className="text-[#173A87] hover:text-[#001e3d] font-semibold flex items-center"
            >
              Selanjutnya
              <svg
                className="w-4 h-4 ml-2"
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
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default KetentruanUmum;
