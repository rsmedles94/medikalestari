import React, { Suspense } from "react";
import DoctorScheduleGrid from "@/components/DoctorScheduleGrid";
import DoctorScheduleSkeleton from "@/components/DoctorScheduleSkeleton";
import { fetchAllDoctorsWithSchedules } from "@/lib/api";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PageTracker } from "@/components/PageTracker";

export const metadata = {
  title: "Jadwal Dokter",
  description:
    "Lihat jadwal praktek lengkap semua dokter spesialis yang sedang anda cari.",
};

async function DoctorScheduleContent() {
  const doctorsWithSchedules = await fetchAllDoctorsWithSchedules();
  return (
    <DoctorScheduleGrid
      doctorsWithSchedules={doctorsWithSchedules}
      loading={false}
    />
  );
}

export default function DoctorSchedulePage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <PageTracker pagePath="/jadwal-dokter" />
      {/* MAIN CONTENT AREA */}
      <main className="max-w-[1175px] mx-auto px-4 md:px-8 py-12">
        {/* BREADCRUMB */}
        <div className="mb-8 md:mb-12 border-b border-slate-100 pb-6 -mt-8 md:-mt-4">
          <nav className="flex items-center gap-1 text-[14px] text-gray-300 mb-4">
            <Link
              href="/"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <span className="font-normal">Jadwal Dokter</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            Jadwal Dokter
          </h1>
          <p className="text-slate-600">
            Lihat jadwal praktek lengkap semua dokter spesialis yang sedang anda
            cari.
          </p>
        </div>

        {/* The Grid Component */}
        <div className="mb-20">
          <Suspense fallback={<DoctorScheduleSkeleton />}>
            <DoctorScheduleContent />
          </Suspense>
        </div>

        {/* MINIMALIST FOOTER NOTE */}
        <div className="flex flex-row items-center justify-between py-10 border-t border-slate-100 gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-sm font-bold text-slate-900 leading-tight">
              Butuh Bantuan Pendaftaran?
            </span>
            <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed max-w-[250px] sm:max-w-none">
              Silahkan hubungi bagian pendaftaran atau kunjungi meja informasi
              kami.
            </p>
          </div>
          <a
            href="https://wa.me/6282246232527"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-3 bg-[#173A87] text-white text-[11px] sm:text-sm font-semibold rounded-lg hover:bg-[#173A87]/90 transition-all hover:scale-95 shrink-0"
          >
            <span className="hidden lg:inline">Hubungi Customer Care</span>
            <span className="md:hidden">Hubungi Customer Care</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </a>
        </div>
      </main>
    </div>
  );
}
