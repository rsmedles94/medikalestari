import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Radiologi() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#015A85] hover:text-[#006360] mb-8"
        >
          <ArrowLeft size={20} />
          Kembali ke Beranda
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-[#006360] mb-4">Radiologi</h1>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Pemeriksaan Radiologi Modern
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Departemen Radiologi kami dilengkapi dengan peralatan imaging
              terkini termasuk CT Scan, USG, dan Rontgen untuk memberikan
              diagnosis yang akurat dengan protokol keselamatan radiasi
              internasional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#006360] mb-2">
                Alat Tersedia
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ CT Scan</li>
                <li>✓ USG 4D</li>
                <li>✓ Rontgen Digital</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-[#006360] mb-2">Keamanan</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Radiolog bersertifikat</li>
                <li>✓ Standar keselamatan</li>
                <li>✓ Hasil cepat</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
