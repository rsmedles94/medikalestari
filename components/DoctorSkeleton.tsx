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

const DoctorSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      // Parent container background shimmer
      className="relative flex flex-row items-start gap-4 md:gap-8 p-4 md:p-8 bg-slate-50 border border-slate-100 shadow-sm h-fit min-h-4 md:min-h-60 rounded-none overflow-hidden"
    >
      {/* Foto Dokter Skeleton shimmer effect */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 shrink-0 rounded-full bg-slate-200 border-4 border-slate-50 overflow-hidden shadow-sm">
        <ShimmerOverlay />
      </div>

      {/* Konten Dokter Skeleton */}
      <div className="flex-1 text-left pt-2 space-y-4 mt-0 md:mt-6">
        {/* Nama -  shimmer effect */}
        <div className="relative h-4 md:h-8 bg-slate-300 w-3/4 overflow-hidden shadow-sm">
          <ShimmerOverlay />
        </div>

        {/* Spesialisasi -  shimmer effect */}
        <div className="relative h-2 md:h-4 bg-slate-300  w-1/4 overflow-hidden shadow-sm -mt-2">
          <ShimmerOverlay />
        </div>


        {/* Buttons shimmer */}
        <div className="flex flex-wrap justify-start gap-2 md:gap-3 -mt-2 md:mt-0 ">
          <div className="relative h-9 md:h-11 w-28 md:w-36 bg-linear-to-r from-slate-200 to-slate-300 rounded-full overflow-hidden shadow-sm">
            <ShimmerOverlay />
          </div>
          <div className="relative h-9 md:h-11 w-28 md:w-36 bg-linear-to-r from-slate-200 to-slate-300 rounded-full overflow-hidden shadow-sm">
            <ShimmerOverlay />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorSkeleton;
