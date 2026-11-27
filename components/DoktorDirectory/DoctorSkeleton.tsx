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

// Mengikuti kartu dokter asli:
// mobile  -> kartu vertikal (foto, nama 2 baris, spesialis, 2 tombol bertumpuk)
// md ke atas -> kartu horizontal seperti sebelumnya
const DoctorSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-full min-h-88 flex-col items-center gap-4 overflow-hidden rounded-none border border-slate-100 bg-slate-50 p-4 pt-6 shadow-sm md:h-fit md:min-h-60 md:flex-row md:items-start md:gap-8 md:p-8"
    >
      {/* Foto dokter */}
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-slate-200 shadow-sm sm:h-36 sm:w-36 md:h-44 md:w-44">
        <ShimmerOverlay />
      </div>

      {/* Konten dokter */}
      <div className="flex w-full min-w-0 flex-1 flex-col md:mt-6 md:block md:space-y-4 md:pt-2">
        {/* Nama + spesialis */}
        <div className="mb-4 w-full space-y-2 md:mb-0">
          {/* Nama: 2 baris di mobile, 1 baris di md ke atas */}
          <div className="relative mx-auto h-4 w-4/5 overflow-hidden bg-slate-300 shadow-sm md:mx-0 md:h-8 md:w-3/4">
            <ShimmerOverlay />
          </div>
          <div className="relative mx-auto h-4 w-3/5 overflow-hidden bg-slate-300 shadow-sm md:hidden">
            <ShimmerOverlay />
          </div>

          {/* Spesialis */}
          <div className="relative mx-auto mt-3 h-2.5 w-1/2 overflow-hidden bg-slate-300 shadow-sm md:mx-0 md:mt-0 md:h-4 md:w-1/4">
            <ShimmerOverlay />
          </div>
        </div>

        {/* Tombol: bertumpuk di mobile, sejajar di md ke atas */}
        <div className="mt-auto flex w-full flex-col gap-2.5 md:mt-4 md:flex-row md:items-center md:justify-start md:gap-3">
          <div className="relative h-9 w-full shrink-0 overflow-hidden rounded-full bg-linear-to-r from-slate-200 to-slate-300 shadow-sm md:h-11 md:w-36">
            <ShimmerOverlay />
          </div>
          <div className="relative h-9 w-full shrink-0 overflow-hidden rounded-full bg-linear-to-r from-slate-200 to-slate-300 shadow-sm md:h-11 md:w-36">
            <ShimmerOverlay />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorSkeleton;