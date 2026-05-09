import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Radiologi() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans text-slate-900">
      <div className="max-w-md w-full px-8 text-center">
        {/* Breadcrumb / Navigasi */}
        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
        </div>

        <h1 className="text-2xl font-semibold mb-4">
          Maaf saat ini halaman sedang dalam pengembangan
        </h1>
      </div>
    </div>
  );
}
