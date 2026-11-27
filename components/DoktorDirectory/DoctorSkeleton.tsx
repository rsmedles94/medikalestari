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

// jumlah baris jadwal pada skeleton (desktop)
const SCHEDULE_ROWS = 4;

const DoctorSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      // ukuran, jarak, dan padding sama dengan kartu di DoctorSection
      className="relative flex flex-row items-start gap-4 md:gap-8 lg:gap-5 xl:gap-8 p-4 md:p-8 lg:p-6 xl:p-8 bg-slate-50 border border-slate-100 shadow-sm h-fit min-h-4 md:min-h-60 lg:min-h-0 rounded-none overflow-hidden"
    >
      {/* Foto Dokter Skeleton shimmer effect */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 lg:w-28 lg:h-28 xl:w-36 xl:h-36 bg-slate-300 shrink-0 rounded-full overflow-hidden shadow-sm">
        <ShimmerOverlay />
      </div>

      {/* Konten Dokter Skeleton */}
      <div className="flex-1 min-w-0 text-left pt-2 space-y-4 mt-0 md:mt-6 lg:mt-8">
        {/* Nama -  shimmer effect */}
        <div className="relative h-4 md:h-8 bg-slate-300 w-3/4 overflow-hidden shadow-sm">
          <ShimmerOverlay />
        </div>

        {/* Spesialisasi -  shimmer effect */}
        <div className="relative h-2 md:h-4 bg-slate-300  w-1/4 overflow-hidden shadow-sm -mt-2">
          <ShimmerOverlay />
        </div>

        {/* Buttons shimmer (tetap sebelahan) */}
        <div className="flex flex-row flex-nowrap items-center justify-start gap-2 md:gap-3 -mt-2 md:mt-0 w-full">
          <div className="shrink-0 relative h-9 md:h-11 w-28 md:w-36 lg:w-32 xl:w-36 bg-linear-to-r from-slate-200 to-slate-300 rounded-full overflow-hidden shadow-sm">
            <ShimmerOverlay />
          </div>
          <div className="shrink-0 relative h-9 md:h-11 w-28 md:w-36 lg:w-28 xl:w-32 bg-linear-to-r from-slate-200 to-slate-300 rounded-full overflow-hidden shadow-sm">
            <ShimmerOverlay />
          </div>
        </div>
      </div>

      {/* Jadwal Praktik Skeleton (desktop saja) */}
      <div className="hidden lg:block lg:w-40 xl:w-52 shrink-0 self-stretch border-l border-slate-100 pl-5 pt-8">
        {/* judul jadwal */}
        <div className="relative mb-3 h-3 w-24 bg-slate-300 overflow-hidden shadow-sm">
          <ShimmerOverlay />
        </div>

        {/* baris hari + jam */}
        <div className="space-y-2.5">
          {Array.from({ length: SCHEDULE_ROWS }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="relative h-3 w-12 bg-slate-200 overflow-hidden">
                <ShimmerOverlay />
              </div>
              <div className="relative h-3 w-20 bg-slate-300 overflow-hidden">
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
