import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

const Pembayaran = () => {
  const breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    { label: "Ketentuan Pembayaran", href: "/syarat-ketentuan/pembayaran" },
  ];

  const paymentMethods = [
    {
      name: "Transfer Bank",
      description: "Transfer langsung ke rekening RS Medika Lestari",
      icon: "🏦",
    },
    {
      name: "Kartu Kredit",
      description: "Visa, Mastercard, dan American Express",
      icon: "💳",
    },
    {
      name: "Debit Card",
      description: "Kartu debit dari semua bank di Indonesia",
      icon: "🎫",
    },
    {
      name: "E-Wallet",
      description: "GCash, OVO, Dana, dan LinkAja",
      icon: "📱",
    },
    {
      name: "Cicilan",
      description: "Program cicilan tanpa bunga tersedia",
      icon: "📊",
    },
    {
      name: "Asuransi Kesehatan",
      description: "Klaim langsung dengan asuransi yang bekerja sama",
      icon: "🛡️",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Breadcrumb items={breadcrumbs} />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#014f86] to-[#014f86] text-white py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">Ketentuan Pembayaran</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Metode Pembayaran */}
            <div>
              <h2 className="text-3xl font-bold text-[#014f86] mb-6 pb-4 border-b-2 border-[#014f86]">
                Metode Pembayaran yang Tersedia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paymentMethods.map((method, idx) => (
                  <div
                    key={idx}
                    className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="text-4xl mb-3">{method.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {method.name}
                    </h3>
                    <p className="text-gray-600">{method.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Jadwal dan Tenggat Waktu */}
            <div>
              <h2 className="text-3xl font-bold text-[#014f86] mb-6 pb-4 border-b-2 border-[#014f86]">
                Jadwal dan Tenggat Waktu Pembayaran
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-[#014f86] rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Pembayaran di Tempat (Walk-in)
                  </h3>
                  <p className="text-gray-700">
                    Pembayaran dapat dilakukan langsung di kasir atau bagian
                    administrasi sebelum Anda meninggalkan fasilitas kami.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-[#014f86] rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Pembayaran Asuransi
                  </h3>
                  <p className="text-gray-700">
                    Untuk pasien dengan asuransi, pembayaran dapat diklaim
                    langsung ke penyedia asuransi. Pasien hanya perlu membayar
                    biaya yang tidak ditanggung asuransi.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-[#014f86] rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Pembayaran Cicilan
                  </h3>
                  <p className="text-gray-700">
                    Kami menawarkan program cicilan tanpa bunga hingga 12 bulan
                    untuk biaya perawatan di atas Rp 5.000.000. Hubungi bagian
                    administrasi untuk informasi lebih lanjut.
                  </p>
                </div>
              </div>
            </div>

            {/* Biaya dan Tarif */}
            <div>
              <h2 className="text-3xl font-bold text-[#014f86] mb-6 pb-4 border-b-2 border-[#014f86]">
                Informasi Biaya
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Semua biaya layanan akan dijelaskan sebelum Anda menjalani
                  perawatan. Anda berhak mengetahui:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Biaya konsultasi dan pemeriksaan</li>
                  <li>Biaya tindakan medis</li>
                  <li>Biaya obat-obatan dan peralatan medis</li>
                  <li>Biaya kamar rawat inap (jika diperlukan)</li>
                  <li>Biaya tambahan atau biaya khusus</li>
                </ul>
              </div>
            </div>

            {/* Kebijakan Pembatalan dan Pengembalian Dana */}
            <div>
              <h2 className="text-3xl font-bold text-[#014f86] mb-6 pb-4 border-b-2 border-[#014f86]">
                Kebijakan Pembatalan dan Pengembalian Dana
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Pembatalan Sebelum Perawatan
                  </h3>
                  <p className="text-gray-700">
                    Jika Anda membatalkan janji sebelum perawatan, dana yang
                    telah dibayarkan dapat dikembalikan 100% dikurangi biaya
                    administrasi Rp 50.000.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Pembatalan Setelah Perawatan
                  </h3>
                  <p className="text-gray-700">
                    Pembatalan setelah perawatan dimulai tidak dapat dilakukan,
                    kecuali ada kesalahan medis yang dapat dibuktikan.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Pengembalian Dana Karena Kesalahan
                  </h3>
                  <p className="text-gray-700">
                    Jika terjadi kesalahan dalam penghitungan biaya atau
                    pembayaran, kami akan mengembalikan kelebihan dana dalam
                    waktu 5-7 hari kerja.
                  </p>
                </div>
              </div>
            </div>

            {/* Pajak */}
            <div>
              <h2 className="text-3xl font-bold text-[#014f86] mb-6 pb-4 border-b-2 border-[#014f86]">
                Pajak dan Biaya Tambahan
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Semua harga yang ditampilkan sudah termasuk Pajak Pertambahan
                Nilai (PPN) 10%. Tidak ada biaya tersembunyi atau biaya tambahan
                yang tidak dijelaskan.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-blue-50 border-l-4 border-[#014f86] p-6 rounded">
              <h3 className="text-lg font-bold text-[#014f86] mb-3">
                Pertanyaan Tentang Pembayaran?
              </h3>
              <p className="text-gray-700 mb-3">
                Hubungi bagian keuangan kami untuk pertanyaan lebih lanjut
                tentang pembayaran:
              </p>
              <p className="text-gray-700">
                <strong>Telepon:</strong> (021) 585 4858 ext. 200
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Email:</strong> billing@rsmedikalestari.com
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center pt-6 border-t">
            <Link
              href="/syarat-ketentuan/privasi"
              className="text-[#014f86] hover:text-[#001e3d] font-semibold flex items-center"
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
              href="/syarat-ketentuan/pembatalan"
              className="text-[#014f86] hover:text-[#001e3d] font-semibold flex items-center"
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

export default Pembayaran;
