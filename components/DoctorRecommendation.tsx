"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Doctor } from "@/lib/types";

interface DoctorRecommendationProps {
  doctors: Doctor[];
  currentDoctorId: string;
  specialty: string;
}

export default function DoctorRecommendation({
  doctors,
  currentDoctorId,
  specialty,
}: Readonly<DoctorRecommendationProps>) {
  const recommendedDoctors = doctors.filter(
    (doc) => doc.id !== currentDoctorId,
  );

  if (recommendedDoctors.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-100 mb-20 md:mb-0">
      <h2 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">
        Rekomendasi {specialty} lainnya
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {recommendedDoctors.map((doctor) => (
          <motion.div key={doctor.id} variants={itemVariants}>
            {doctor.status === "cuti" ? (
              <article className="relative group flex items-center p-3 bg-white border border-slate-100 rounded-xl transition-all duration-200 -mt-2 opacity-60 pointer-events-none">
                {/* overlay CUTI */}
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <span className="text-5xl text-red-400 italic font-extrabold opacity-90">
                    Sedang Cuti
                  </span>
                </div>
                <div className="relative z-0 w-full flex items-center">
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-slate-50 border border-slate-50">
                    <Image
                      src={doctor.image_url || "/placeholder-doctor.jpg"}
                      alt={doctor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-[11px] font-medium text-gray-500 mb-1">
                      {doctor.specialty}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {doctor.bio || "Lihat profil lengkap dokter."}
                    </p>
                  </div>
                </div>
              </article>
            ) : (
              <Link href={`/dokter/${doctor.id}`} className="block">
                <article className="group flex items-center p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md hover:shadow-[#003f88] transition-all duration-200 -mt-2 ">
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-slate-50 border border-slate-50">
                    <Image
                      src={doctor.image_url || "/placeholder-doctor.jpg"}
                      alt={doctor.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate  transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-[11px] font-medium text-gray-500 mb-1">
                      {doctor.specialty}
                    </p>
                  </div>

                  <div className="ml-2 text-slate-300 group-hover:text-[#003f88] transition-colors ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      aria-hidden="true"
                    >
                      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                    </svg>
                  </div>
                </article>
              </Link>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
