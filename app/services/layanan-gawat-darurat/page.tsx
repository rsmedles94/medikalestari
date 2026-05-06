import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LayananGawatDarurat() {
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
          <h1 className="text-4xl font-bold text-[#004684] mb-4">
            Layanan Gawat Darurat
          </h1>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Penanganan Darurat Profesional
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Unit Gawat Darurat kami siap 24/7 dengan dokter spesialis dan
              perawat terlatih untuk menangani berbagai situasi darurat medis
              dengan cepat dan profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#004684] mb-2">Layanan UGD</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Triase 24 jam</li>
                <li>✓ Kamar stabilisasi</li>
                <li>✓ Ambulans siaga</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#004684] mb-2">
                Kontak Darurat
              </h3>
              <p className="text-sm text-gray-700">Telepon: (XXX) XXXX-XXXX</p>
              <p className="text-sm text-gray-700">Buka 24 jam setiap hari</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
