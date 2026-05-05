import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

const Pertanggungjawaban = () => {
  const breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    {
      label: "Pertanggungjawaban",
      href: "/syarat-ketentuan/pertanggungjawaban",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Breadcrumb items={breadcrumbs} />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#003369] to-[#003369] text-white py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">Pertanggungjawaban</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Tanggung Jawab RS */}
            <div>
              <h2 className="text-3xl font-bold text-[#003369] mb-6 pb-4 border-b-2 border-[#003369]">
                Tanggung Jawab RS Medika Lestari
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    1. Kualitas Layanan Kesehatan
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    RS Medika Lestari berkomitmen untuk memberikan layanan
                    kesehatan berkualitas tinggi sesuai dengan standar medis
                    internasional dan peraturan pemerintah yang berlaku.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    2. Tenaga Medis Profesional
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Semua tenaga medis kami telah terlatih, bersertifikat, dan
                    memiliki pengalaman yang cukup di bidangnya masing-masing.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    3. Fasilitas dan Peralatan
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    RS Medika Lestari memastikan bahwa semua fasilitas dan
                    peralatan medis selalu dalam kondisi baik, steril, dan siap
                    digunakan.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    4. Keamanan dan Kebersihan
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Kami menjamin standar kebersihan dan keselamatan yang tinggi
                    untuk melindungi pasien dan pengunjung dari penyakit
                    menular.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    5. Transparansi Biaya
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    RS Medika Lestari akan memberikan informasi lengkap mengenai
                    biaya perawatan sebelum tindakan medis dilakukan.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    6. Privasi dan Kerahasiaan
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Kami berkomitmen untuk menjaga kerahasiaan dan privasi semua
                    data pribadi dan medis pasien sesuai dengan peraturan
                    perlindungan data.
                  </p>
                </div>
              </div>
            </div>

            {/* Keterbatasan Tanggung Jawab */}
            <div>
              <h2 className="text-3xl font-bold text-[#003369] mb-6 pb-4 border-b-2 border-[#003369]">
                Keterbatasan Tanggung Jawab
              </h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Meskipun RS Medika Lestari memberikan pelayanan terbaik, kami
                tidak dapat bertanggung jawab penuh untuk hal-hal berikut:
              </p>

              <div className="space-y-6">
                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    1. Komplikasi Medis yang Tidak Dapat Diprediksi
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Beberapa komplikasi medis bersifat alami dan tidak dapat
                    diperkirakan sebelumnya, meskipun prosedur medis telah
                    dilakukan dengan benar.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    2. Hasil Perawatan yang Tergantung Kondisi Pasien
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Hasil perawatan sangat tergantung pada kondisi kesehatan
                    awal pasien, faktor genetik, dan kepatuhan pasien terhadap
                    instruksi medis.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    3. Reaksi Alergi yang Tidak Terduga
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Meskipun sudah dilakukan tes alergi, reaksi alergi yang
                    tidak terduga dapat terjadi pada beberapa pasien.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    4. Infeksi Nosokomial (Infeksi di Rumah Sakit)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Meskipun standar kebersihan diterapkan ketat, infeksi
                    nosokomial masih dapat terjadi dalam jumlah sangat kecil.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    5. Keadaan Darurat Luar Biasa
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    RS Medika Lestari tidak dapat bertanggung jawab atas
                    kecelakaan, bencana alam, atau keadaan darurat luar biasa
                    yang berada di luar kontrol kami.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    6. Kesalahan atau Kelalaian Pasien
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    RS Medika Lestari tidak bertanggung jawab atas konsekuensi
                    yang timbul dari kesalahan atau kelalaian pasien dalam
                    mengikuti instruksi medis.
                  </p>
                </div>
              </div>
            </div>

            {/* Prosedur Keluhan dan Pengaduan */}
            <div>
              <h2 className="text-3xl font-bold text-[#003369] mb-6 pb-4 border-b-2 border-[#003369]">
                Prosedur Keluhan dan Pengaduan
              </h2>

              <p className="text-gray-700 leading-relaxed mb-6">
                Jika Anda merasa tidak puas dengan pelayanan kami, silakan
                mengajukan keluhan melalui prosedur berikut:
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#003369] text-white font-bold">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Hubungi Bagian Customer Service
                    </h3>
                    <p className="text-gray-700 mt-2">
                      Segera hubungi bagian customer service kami di (021) 585
                      4858 atau datang langsung ke front desk untuk melaporkan
                      keluhan Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#003369] text-white font-bold">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Laporkan Secara Tertulis
                    </h3>
                    <p className="text-gray-700 mt-2">
                      Anda dapat mengajukan laporan tertulis kepada bagian
                      Complaints & Quality Assurance melalui email atau datang
                      langsung.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#003369] text-white font-bold">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Investigasi dan Evaluasi
                    </h3>
                    <p className="text-gray-700 mt-2">
                      Tim kami akan melakukan investigasi menyeluruh dan
                      memberikan respons dalam waktu 7 hari kerja.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#003369] text-white font-bold">
                      4
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Penyelesaian dan Tindak Lanjut
                    </h3>
                    <p className="text-gray-700 mt-2">
                      Kami akan mengambil tindakan korektif yang diperlukan dan
                      mengkomunikasikan hasilnya kepada Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kontak */}
            <div className="bg-blue-50 border-l-4 border-[#003369] p-6 rounded">
              <h3 className="text-lg font-bold text-[#003369] mb-3">
                Hubungi Tim Kami
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-gray-900 font-semibold">
                    Customer Service
                  </p>
                  <p className="text-gray-700">(021) 585 4858</p>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Email Keluhan</p>
                  <p className="text-gray-700">
                    complaints@rsmedikalestari.com
                  </p>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">WhatsApp</p>
                  <p className="text-gray-700">+62 822-4623-2527</p>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Jam Operasional</p>
                  <p className="text-gray-700">Senin - Minggu, 24 Jam</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center pt-6 border-t">
            <Link
              href="/syarat-ketentuan/pembatalan"
              className="text-[#003369] hover:text-[#01274F] font-semibold flex items-center"
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
              href="/syarat-ketentuan"
              className="text-[#003369] hover:text-[#01274F] font-semibold flex items-center"
            >
              Kembali ke Utama
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

export default Pertanggungjawaban;
