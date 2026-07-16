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
      <main className="max-w-[1139px] w-full mx-auto px-4 py-12 md:py-8">
        {/* BREADCRUMB */}
        <div className="mb-8 md:mb-12 border-b border-slate-100 pb-6 -mt-4 md:pt-13">
          <nav className="flex items-center gap-1 text-[14px] text-gray-300 mb-4 ">
            <Link
              href="/"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={12} className="text-black/60" />
            <span className="font-normal">Jadwal Dokter</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Jadwal Dokter
          </h1>
        </div>

        {/* The Grid Component */}
        <div className="mb-20">
          <Suspense fallback={<DoctorScheduleSkeleton />}>
            <DoctorScheduleContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
