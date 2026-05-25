import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

const HakKewajiban = () => {
  const breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    {
      label: "Hak & Kewajiban Pasien",
      href: "/syarat-ketentuan/hak-kewajiban",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Breadcrumb items={breadcrumbs} />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#003f88] to-[#003f88] text-white py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">Hak dan Kewajiban Pasien</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Hak Pasien */}
            <div>
              <h2 className="text-3xl font-bold text-[#003f88] mb-6 pb-4 border-b-2 border-[#003f88]">
                Hak-Hak Pasien
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border-l-4 border-[#003f88] rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1. Hak atas Informasi
                  </h3>
                  <p className="text-gray-700">
                    Pasien berhak memperoleh informasi yang lengkap dan jelas
                    mengenai kondisi kesehatan, diagnosis, rencana perawatan,
                    biaya perawatan, dan alternatif tindakan medis yang
                    tersedia.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-[#003f88] rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2. Hak atas Privasi dan Kerahasiaan
                  </h3>
                  <p className="text-gray-700">
                    Semua informasi medis dan pribadi pasien adalah rahasia dan
                    dilindungi. Informasi hanya dapat diungkapkan dengan izin
                    tertulis pasien atau sesuai dengan hukum yang berlaku.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-[#003f88] rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3. Hak atas Keselamatan
                  </h3>
                  <p className="text-gray-700">
                    Pasien berhak atas keselamatan fisik dan psikis selama
                    berada di fasilitas kesehatan kami, termasuk perlindungan
                    dari kekerasan atau pelecehan.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-[#003f88] rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    4. Hak untuk Menolak Perawatan
                  </h3>
                  <p className="text-gray-700">
                    Pasien berhak untuk menolak perawatan atau tindakan medis
                    tertentu setelah menerima informasi lengkap tentang risiko
                    dan konsekuensinya.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-[#003f88] rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    5. Hak atas Pelayanan yang Profesional
                  </h3>
                  <p className="text-gray-700">
                    Pasien berhak mendapatkan pelayanan kesehatan dari tenaga
                    medis profesional yang berpengalaman dan bersertifikat.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-[#003f88] rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    6. Hak atas Keluhan dan Pengaduan
                  </h3>
                  <p className="text-gray-700">
                    Pasien berhak mengajukan keluhan atau pengaduan jika merasa
                    tidak puas dengan pelayanan kami tanpa takut akan tindakan
                    balasan.
                  </p>
                </div>
              </div>
            </div>

            {/* Kewajiban Pasien */}
            <div>
              <h2 className="text-3xl font-bold text-[#003f88] mb-6 pb-4 border-b-2 border-[#003f88]">
                Kewajiban-Kewajiban Pasien
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    1. Memberikan Informasi yang Akurat
                  </h3>
                  <p className="text-gray-700">
                    Pasien wajib memberikan informasi kesehatan yang jujur dan
                    lengkap, termasuk riwayat penyakit, alergi, dan obat yang
                    sedang dikonsumsi.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    2. Mematuhi Petunjuk Medis
                  </h3>
                  <p className="text-gray-700">
                    Pasien wajib mengikuti petunjuk dan instruksi dari tenaga
                    medis kami untuk memastikan keberhasilan perawatan.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    3. Menjaga Kebersihan dan Keamanan
                  </h3>
                  <p className="text-gray-700">
                    Pasien wajib menjaga kebersihan pribadi dan lingkungan,
                    serta menjaga keamanan barang-barang pribadi selama berada
                    di fasilitas kami.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    4. Membayar Biaya Perawatan
                  </h3>
                  <p className="text-gray-700">
                    Pasien wajib membayar biaya perawatan sesuai dengan tarif
                    yang telah disepakati dan dalam waktu yang ditentukan.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    5. Bersikap Sopan dan Hormat
                  </h3>
                  <p className="text-gray-700">
                    Pasien wajib bersikap sopan dan menghormati tenaga medis,
                    perawat, dan pengunjung lain di fasilitas kesehatan kami.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    6. Mematuhi Peraturan Fasilitas
                  </h3>
                  <p className="text-gray-700">
                    Pasien wajib mematuhi semua peraturan dan tata tertib yang
                    berlaku di RS Medika Lestari.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center pt-6 border-t">
            <Link
              href="/syarat-ketentuan/umum"
              className="text-[#003f88] hover:text-[#001e3d] font-semibold flex items-center"
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
              Sebelumnya
            </Link>
            <Link
              href="/syarat-ketentuan/privasi"
              className="text-[#003f88] hover:text-[#001e3d] font-semibold flex items-center"
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

export default HakKewajiban;
