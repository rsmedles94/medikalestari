import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

const Pembatalan = () => {
  const breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    { label: "Kebijakan Pembatalan", href: "/syarat-ketentuan/pembatalan" },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Breadcrumb items={breadcrumbs} />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#006360] to-[#006360] text-white py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">Kebijakan Pembatalan</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Pembatalan Janji Temu */}
            <div>
              <h2 className="text-3xl font-bold text-[#006360] mb-6 pb-4 border-b-2 border-[#006360]">
                Pembatalan Janji Temu
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border-l-4 border-[#006360] rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Pembatalan 48 Jam Sebelumnya
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Jika Anda membatalkan janji temu minimal 48 jam sebelum
                    jadwal yang telah ditentukan, Anda dapat memilih untuk:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                    <li>Mengembalikan biaya pendaftaran 100%</li>
                    <li>
                      Mengalihkan janji ke tanggal lain tanpa biaya tambahan
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Pembatalan 24-48 Jam Sebelumnya
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Jika Anda membatalkan janji temu antara 24-48 jam sebelum
                    jadwal:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                    <li>Biaya pendaftaran dikurangi 50%</li>
                    <li>Sisa dana dapat dikembalikan atau dialihkan</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Pembatalan Kurang dari 24 Jam
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Jika Anda membatalkan janji temu kurang dari 24 jam sebelum
                    jadwal:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                    <li>Tidak ada pengembalian dana</li>
                    <li>Biaya pendaftaran dianggap hilang</li>
                    <li>
                      Janji dapat dialihkan ke tanggal lain dengan biaya
                      administrasi
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Pembatalan pada Hari H
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Jika Anda membatalkan pada hari janji temu atau tidak hadir:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                    <li>Tidak ada pengembalian dana sama sekali</li>
                    <li>Biaya pendaftaran hangus</li>
                    <li>
                      Dokter yang telah siap akan mencatat ketidakhadiran Anda
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pembatalan Rawat Inap */}
            <div>
              <h2 className="text-3xl font-bold text-[#006360] mb-6 pb-4 border-b-2 border-[#006360]">
                Pembatalan Rawat Inap
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border-l-4 border-[#006360] rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Pembatalan Sebelum Perawatan Dimulai
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Jika Anda membatalkan sebelum perawatan dimulai:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>
                      Pembatalan 7 hari sebelumnya: pengembalian 100% - biaya
                      administrasi
                    </li>
                    <li>
                      Pembatalan 3-7 hari: pengembalian 75% - biaya administrasi
                    </li>
                    <li>
                      Pembatalan 1-3 hari: pengembalian 50% - biaya administrasi
                    </li>
                    <li>
                      Pembatalan kurang dari 24 jam: tidak ada pengembalian
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Pembatalan Setelah Perawatan Dimulai
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Jika Anda meminta untuk checkout/pulang lebih awal setelah
                    perawatan dimulai:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-3">
                    <li>
                      Anda tetap bertanggung jawab atas biaya kamar untuk hari
                      pertama
                    </li>
                    <li>
                      Biaya perawatan medis yang telah diberikan tetap dikenakan
                    </li>
                    <li>
                      Tidak ada pengembalian dana untuk kamar yang tidak
                      digunakan
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pengecualian */}
            <div>
              <h2 className="text-3xl font-bold text-[#006360] mb-6 pb-4 border-b-2 border-[#006360]">
                Pengecualian dan Keadaan Khusus
              </h2>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  RS Medika Lestari dapat membuat pengecualian dalam kondisi
                  berikut:
                </p>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Keadaan Darurat
                  </h3>
                  <p className="text-gray-700">
                    Dalam kasus keadaan darurat (bencana alam, kematian
                    keluarga, dll), kami dapat memberikan pengembalian dana
                    penuh.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Kesalahan RS
                  </h3>
                  <p className="text-gray-700">
                    Jika pembatalan disebabkan oleh kesalahan RS Medika Lestari,
                    pengembalian dana penuh akan diberikan.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Masalah Medis
                  </h3>
                  <p className="text-gray-700">
                    Jika dokter merekomendasikan pembatalan karena alasan medis,
                    pengembalian dana dapat diberikan sepenuhnya.
                  </p>
                </div>
              </div>
            </div>

            {/* Cara Membatalkan */}
            <div>
              <h2 className="text-3xl font-bold text-[#006360] mb-6 pb-4 border-b-2 border-[#006360]">
                Cara Membatalkan
              </h2>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Untuk membatalkan janji atau reservasi, silakan hubungi kami
                  melalui:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                    <h3 className="font-bold text-gray-900 mb-2">Telepon</h3>
                    <p className="text-gray-700">(021) 585 4858</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Senin - Minggu, 07:00 - 21:00
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                    <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-700">
                      reservasi@rsmedikalestari.com
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Respon dalam 24 jam kerja
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                    <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
                    <p className="text-gray-700">+62 822-4623-2527</p>
                    <p className="text-sm text-gray-600 mt-2">
                      24 jam setiap hari
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                    <h3 className="font-bold text-gray-900 mb-2">
                      Datang Langsung
                    </h3>
                    <p className="text-gray-700">
                      Bagian Administrasi RS Medika Lestari
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Senin - Minggu, 08:00 - 20:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border-l-4 border-[#006360] p-6 rounded">
              <h3 className="text-lg font-bold text-[#006360] mb-3">
                Catatan Penting
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>
                  ✓ Semua waktu pembatalan dihitung berdasarkan waktu penerimaan
                  pengajuan pembatalan
                </li>
                <li>
                  ✓ Biaya administrasi standar adalah Rp 50.000 per pembatalan
                </li>
                <li>
                  ✓ Pengembalian dana akan diproses dalam 5-7 hari kerja ke
                  rekening asal
                </li>
                <li>
                  ✓ Kebijakan ini dapat berubah sewaktu-waktu dan akan
                  dikomunikasikan kepada pasien
                </li>
              </ul>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center pt-6 border-t">
            <Link
              href="/syarat-ketentuan/pembayaran"
              className="text-[#006360] hover:text-[#009C96] font-semibold flex items-center"
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
              href="/syarat-ketentuan/pertanggungjawaban"
              className="text-[#006360] hover:text-[#009C96] font-semibold flex items-center"
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

export default Pembatalan;
