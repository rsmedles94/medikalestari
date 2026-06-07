import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

const Privasi = () => {
  const breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    { label: "Kebijakan Privasi", href: "/syarat-ketentuan/privasi" },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Breadcrumb items={breadcrumbs} />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#003f88] to-[#003f88] text-white py-8 px-6">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Kebijakan Privasi</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-0">
          <div className="prose prose-blue max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#003f88] mb-4">
                Pendahuluan
              </h2>
              <p className="text-gray-700 leading-relaxed">
                RS Medika Lestari berkomitmen untuk melindungi privasi dan data
                pribadi semua pasien dan pengunjung kami. Kebijakan privasi ini
                menjelaskan bagaimana kami mengumpulkan, menggunakan, dan
                melindungi informasi pribadi Anda.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#003f88] mb-4">
                1. Jenis Data yang Kami Kumpulkan
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Data Pribadi
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Nama lengkap dan tanggal lahir</li>
                    <li>Nomor identitas dan nomor telepon</li>
                    <li>Alamat email dan alamat rumah</li>
                    <li>Informasi pekerjaan dan keluarga</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Data Kesehatan
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Riwayat kesehatan dan diagnosis</li>
                    <li>Riwayat perawatan dan operasi</li>
                    <li>Daftar obat dan alergi</li>
                    <li>Hasil pemeriksaan laboratorium dan radiologi</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Data Finansial
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Informasi pembayaran dan riwayat transaksi</li>
                    <li>Data asuransi kesehatan</li>
                    <li>Informasi kartu kredit atau rekening bank</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#003f88] mb-4">
                2. Penggunaan Data
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kami menggunakan data yang kami kumpulkan untuk:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Memberikan layanan kesehatan yang optimal</li>
                <li>Memproses pembayaran dan penagihan</li>
                <li>Berkomunikasi dengan Anda tentang perawatan</li>
                <li>Meningkatkan kualitas layanan kami</li>
                <li>Mematuhi kewajiban hukum dan peraturan</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#003f88] mb-4">
                3. Perlindungan Data
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kami menerapkan berbagai langkah keamanan untuk melindungi data
                Anda, termasuk:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Enkripsi data dengan standar industri</li>
                <li>Firewall dan sistem keamanan berlapis</li>
                <li>Akses terbatas hanya untuk personel yang berwenang</li>
                <li>Audit keamanan rutin</li>
                <li>Backup data berkala</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#003f88] mb-4">
                4. Berbagi Data dengan Pihak Ketiga
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Kami tidak akan membagikan data pribadi Anda kepada pihak ketiga
                tanpa persetujuan tertulis Anda, kecuali:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Untuk keperluan perawatan medis dengan rujukan dokter</li>
                <li>Untuk klaim asuransi kesehatan</li>
                <li>Ketika diwajibkan oleh undang-undang</li>
                <li>Untuk keperluan penelitian medis (dengan anonimisasi)</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-[#003f88] p-6 rounded">
              <h3 className="text-lg font-bold text-[#003f88] mb-3">
                Hak-Hak Anda
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>✓ Mengakses dan melihat data pribadi Anda</li>
                <li>✓ Meminta koreksi data yang tidak akurat</li>
                <li>✓ Menghapus data tertentu (sesuai peraturan)</li>
                <li>✓ Menolak penggunaan data untuk tujuan tertentu</li>
                <li>✓ Meminta laporan data yang kami miliki</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#003f88] mb-4">
                5. Kontak Kami
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Jika Anda memiliki pertanyaan atau kekhawatiran tentang
                kebijakan privasi kami, silakan hubungi kami di:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@rsmedikalestari.com
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Telepon:</strong> (021) 585 4858
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Alamat:</strong> RS Medika Lestari, Jakarta
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center pt-6 border-t">
            <Link
              href="/syarat-ketentuan/hak-kewajiban"
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
              href="/syarat-ketentuan/pembayaran"
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

export default Privasi;
