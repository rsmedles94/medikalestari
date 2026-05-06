import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RawatInap() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#015A85] hover:text-[#004684] mb-8"
        >
          <ArrowLeft size={20} />
          Kembali ke Beranda
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-[#004684] mb-4">Rawat Inap</h1>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Layanan Rawat Inap Berkualitas
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kami menyediakan fasilitas rawat inap lengkap dengan dokter dan
              perawat profesional, memastikan kenyamanan dan pemulihan optimal
              bagi setiap pasien selama menjalani perawatan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#004684] mb-2">Fasilitas</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Kamar nyaman</li>
                <li>✓ Monitoring 24/7</li>
                <li>✓ Makanan khusus</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#004684] mb-2">
                Pendampingan
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Keluarga bisa menginap</li>
                <li>✓ Kunjungan fleksibel</li>
                <li>✓ Dukungan psikologis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
