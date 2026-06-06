"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  fetchDoctorById,
  fetchSchedulesByDoctor,
  fetchDoctorsBySpecialty,
} from "@/lib/api";
import { Doctor, Schedule } from "@/lib/types";
import DoctorScheduleDisplay from "@/components/DoctorScheduleDisplay";
import DoctorRecommendation from "@/components/DoctorRecommendation";
import DoctorDetailSkeleton from "@/components/DoctorDetailSkeleton";
import BookingForm from "@/components/BookingForm";

const DoctorDetailPage = () => {
  const params = useParams();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Efek untuk memastikan scroll ke paling atas saat halaman diakses
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const doctorData = await fetchDoctorById(doctorId);
        if (doctorData) {
          setDoctor(doctorData);
          const schedulesData = await fetchSchedulesByDoctor(doctorId);
          setSchedules(schedulesData);

          // Fetch recommended doctors with same specialty
          const recommendedData = await fetchDoctorsBySpecialty(
            doctorData.specialty,
          );
          setRecommendedDoctors(recommendedData);
        }
      } catch (error) {
        console.error("Error loading doctor data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) loadData();
  }, [doctorId]);

  if (loading) return <DoctorDetailSkeleton />;

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* BREADCRUMB & TITLE SECTION */}
        <div className=" md:pt-16 pb-12 -mt-3  md:-mt-11">
          <nav className="flex items-center gap-2 text-[12px] md:text-[14px] font-normal text-gray-600 mb-6">
            <Link
              href="/"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={16} className="text-black/40" />
            <Link
              href="/dokter"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Dokter Kami
            </Link>
            <ChevronRight size={16} className="text-black/40" />
            <span className="text-gray-300 font-medium">{doctor.name}</span>
          </nav>
        </div>

        {/* Kontainer Grid Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
          {/* KOLOM KIRI: STICKY IMAGE & SOCIALS */}
          <div className="lg:col-span-4 lg:sticky lg:top-60 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.3 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-white shadow-[0_10px_50px_rgba(0,0,0,0.1)] bg-slate-50 cursor-crosshair"
            >
              <Image
                src={doctor.image_url || "/placeholder-doctor.jpg"}
                alt={doctor.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {doctor && doctor.status === "cuti" && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                <span className="text-7xl md:text-9xl text-red-400 italic font-extrabold opacity-90">
                  CUTI
                </span>
              </div>
            )}

            {/* Social Share Section */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-[12px] font-bold text-slate-600 uppercase">
                Profil Dokter
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-[#25D366] text-white transition-all border border-slate-100 shadow-sm hover:shadow-md "
                >
                  <i className="fa-brands fa-whatsapp text-3xl"></i>
                </a>
                <a
                  href="#"
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-linear-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white transition-all"
                >
                  <i className="fa-brands fa-instagram text-3xl"></i>
                </a>
                <a
                  href="#"
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-[#0088cc] text-white transition-all border border-slate-100 shadow-sm hover:shadow-md"
                >
                  <i className="fa-brands fa-linkedin text-2xl"></i>
                </a>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: INFO, BIODATA & JADWAL */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Identitas Dokter */}
              <div className="mb-10">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-700 mb-2 tracking-tight">
                  {doctor.name}
                </h1>
                <p className="text-xl text-slate-400 font-medium">
                  {doctor.specialty}
                </p>
              </div>

              {/* SECTION 2: JADWAL PRAKTEK */}
              <div className="pt-5 border-t border-slate-100 ">
                <DoctorScheduleDisplay
                  schedules={schedules}
                  onBooking={() => setShowBookingForm(true)}
                  doctorStatus={doctor?.status}
                />
              </div>

              {/* SECTION 3: REKOMENDASI DOKTER */}
              {recommendedDoctors.length > 0 && (
                <DoctorRecommendation
                  doctors={recommendedDoctors}
                  currentDoctorId={doctorId}
                  specialty={doctor.specialty}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* MODAL BOOKING */}
      {showBookingForm && (
        <BookingForm
          doctorName={doctor.name}
          specialty={doctor.specialty}
          onClose={() => setShowBookingForm(false)}
          schedules={schedules}
        />
      )}
    </div>
  );
};

export default DoctorDetailPage;
