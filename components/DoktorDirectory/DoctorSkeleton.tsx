"use client";

import React from "react";
import { motion } from "framer-motion";

const ShimmerOverlay = () => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
    />
  </div>
);

// jumlah baris jadwal pada skeleton (mobile & desktop)
const SCHEDULE_ROWS = 4;

const DoctorSkeleton = ({
  className = "",
}: Readonly<{ className?: string }>) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      // mobile: kolom vertikal (grid 2 kolom), tablet/desktop: sama seperti kartu di DoctorSection
      className={`relative flex h-full flex-col items-center gap-3 p-3 md:h-fit md:flex-row md:items-start md:gap-8 md:p-8 lg:gap-5 lg:p-6 xl:gap-8 xl:p-8 bg-slate-50 border border-slate-100 shadow-sm min-h-4 md:min-h-60 lg:min-h-0 rounded-none overflow-hidden ${className}`}
    >
      {/* Foto Dokter Skeleton shimmer effect */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 lg:w-28 lg:h-28 xl:w-36 xl:h-36 bg-slate-300 shrink-0 rounded-full overflow-hidden shadow-sm">
        <ShimmerOverlay />
      </div>

      {/* Konten Dokter Skeleton */}
      <div className="flex w-full min-w-0 flex-none flex-col items-center space-y-2 pt-0 text-center mt-0 md:mt-6 md:w-auto md:flex-1 md:items-stretch md:space-y-4 md:pt-2 md:text-left lg:mt-8">
        {/* Nama -  shimmer effect */}
        <div className="relative h-4 w-3/4 md:h-8 bg-slate-300 overflow-hidden shadow-sm">
          <ShimmerOverlay />
        </div>

        {/* Spesialisasi -  shimmer effect */}
        <div className="relative h-2 w-1/2 md:h-4 md:w-1/4 bg-slate-300 overflow-hidden shadow-sm md:-mt-2">
          <ShimmerOverlay />
        </div>

        {/* Buttons shimmer (mobile: ditumpuk, tablet/desktop: sebelahan) */}
        <div className="mt-1 flex w-full flex-col items-stretch gap-2 md:mt-0 md:flex-row md:flex-nowrap md:items-center md:justify-start md:gap-3">
          <div className="shrink-0 relative h-8 w-full md:h-11 md:w-36 lg:w-32 xl:w-36 bg-linear-to-r from-slate-200 to-slate-300 rounded-full overflow-hidden shadow-sm">
            <ShimmerOverlay />
          </div>
          <div className="shrink-0 relative h-8 w-full md:h-11 md:w-36 lg:w-28 xl:w-32 bg-linear-to-r from-slate-200 to-slate-300 rounded-full overflow-hidden shadow-sm">
            <ShimmerOverlay />
          </div>
        </div>
      </div>

      {/* Jadwal Praktik Skeleton (mobile di bawah tombol, disembunyikan di tablet, di samping kartu pada desktop) */}
      <div className="block w-full flex-1 border-t border-slate-100 pt-3 md:hidden lg:block lg:w-40 lg:flex-none lg:shrink-0 lg:self-stretch lg:border-t-0 lg:border-l lg:pl-5 lg:pt-8 xl:w-52">
        {/* judul jadwal */}
        <div className="relative mb-2 h-3 w-20 bg-slate-300 overflow-hidden shadow-sm lg:mb-3 lg:w-24">
          <ShimmerOverlay />
        </div>

        {/* baris hari + jam */}
        <div className="space-y-2 lg:space-y-2.5">
          {Array.from({ length: SCHEDULE_ROWS }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 lg:gap-3"
            >
              <div className="relative h-3 w-10 bg-slate-200 overflow-hidden lg:w-12">
                <ShimmerOverlay />
              </div>
              <div className="relative h-3 w-16 bg-slate-300 overflow-hidden lg:w-20">
                <ShimmerOverlay />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorSkeleton;
