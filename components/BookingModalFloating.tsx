"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { fetchAllDoctorsWithSchedules } from "@/lib/api";
import { Doctor, Schedule } from "@/lib/types";

interface BookingModalFloatingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModalFloating({
  isOpen,
  onClose,
}: Readonly<BookingModalFloatingProps>) {
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    specialty: "",
    doctor: "",
    dayOfWeek: "",
    timeSlot: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [doctorsData, setDoctorsData] = useState<
    (Doctor & { schedules: Schedule[] })[]
  >([]);

  // Load doctors data saat modal dibuka
  useEffect(() => {
    if (isOpen && doctorsData.length === 0) {
      const loadDoctors = async () => {
        try {
          const data = await fetchAllDoctorsWithSchedules();
          setDoctorsData(data as (Doctor & { schedules: Schedule[] })[]);
        } catch (err) {
          console.error("Error loading doctors:", err);
        }
      };
      loadDoctors();
    }
  }, [isOpen, doctorsData.length]);

  // Scroll Lock / mencegah scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const specialty = e.target.value;
    setFormData((prev) => ({
      ...prev,
      specialty,
      doctor: "",
      timeSlot: "",
    }));
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      doctor: e.target.value,
      dayOfWeek: "",
      timeSlot: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.patientName.trim()) {
      setError("Nama pasien wajib diisi");
      return;
    }
    if (!formData.patientPhone.trim()) {
      setError("Nomor telepon wajib diisi");
      return;
    }
    if (!formData.specialty) {
      setError("Pilih spesialis");
      return;
    }
    if (!formData.doctor) {
      setError("Pilih dokter");
      return;
    }
    if (!formData.timeSlot) {
      setError("Pilih jam");
      return;
    }
    if (!formData.dayOfWeek) {
      setError("Pilih hari");
      return;
    }

    setLoading(true);

    try {
      const message = `Halo, saya ingin membuat janji temu:
- Nama: ${formData.patientName}
- No. Telepon: ${formData.patientPhone}
- Spesialis: ${formData.specialty}
- Dokter: ${formData.doctor}
- Hari: ${formData.dayOfWeek}
- Jam: ${formData.timeSlot}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/6282246232527?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank");

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          patientName: "",
          patientPhone: "",
          specialty: "",
          doctor: "",
          dayOfWeek: "",
          timeSlot: "",
        });
      }, 3000);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Dapatkan spesialisasi unik dari data dokter
  const specialties = Array.from(
    new Set(doctorsData.map((d) => d.specialty)),
  ).sort((a, b) => a.localeCompare(b));

  // Dapatkan dokter berdasarkan spesialisasi yang dipilih
  const availableDoctors = formData.specialty
    ? doctorsData.filter((d) => d.specialty === formData.specialty)
    : [];

  // Dapatkan slot waktu berdasarkan dokter dan hari yang dipilih
  const selectedDoctor = doctorsData.find((d) => d.name === formData.doctor);

  // Dapatkan hari unik dari jadwal dokter yang dipilih
  const availableDays = selectedDoctor
    ? Array.from(
        new Set(
          selectedDoctor.schedules
            .filter((s) => s.is_available)
            .map((s) => s.day_of_week),
        ),
      ).sort((a, b) => {
        const dayOrder = [
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
          "Minggu",
        ];
        return dayOrder.indexOf(a) - dayOrder.indexOf(b);
      })
    : [];

  // Dapatkan slot waktu untuk hari dan dokter yang dipilih
  const timeSlots =
    selectedDoctor && formData.dayOfWeek
      ? selectedDoctor.schedules
          .filter((s) => s.is_available && s.day_of_week === formData.dayOfWeek)
          .map((s) => ({ start: s.start_time, end: s.end_time }))
          .sort((a, b) => a.start.localeCompare(b.start))
      : [];

  const getTimeSlotLabel = () => {
    if (!formData.doctor) {
      return "Jam Praktek";
    }
    if (!formData.dayOfWeek) {
      return "Pilih hari dulu";
    }
    return timeSlots.length === 0 ? "Tidak ada jadwal tersedia" : "Pilih Jam";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="booking-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-60"
          />

          {/* Modal */}
          <motion.div
            key="booking-modal"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none"
          >
            <section className="bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] w-full max-w-sm overflow-hidden pointer-events-auto border border-slate-100">
              {/* Header */}
              <header className="p-7 pb-2 flex items-start justify-between">
                <div className="pr-4">
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">
                    Janji Temu
                  </h2>
                  <p className="text-slate-400 text-xs mt-1 font-medium">
                    Reservasi layanan kesehatan
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </header>

              {/* Main Content */}
              <main className="p-7">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">
                        Data Terkirim
                      </h3>
                      <p className="text-sm text-slate-500 px-4 mt-1 leading-relaxed">
                        Admin akan segera menghubungi Anda melalui WhatsApp.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-[11px] font-bold flex gap-2 items-center border border-red-100">
                          <AlertCircle size={14} /> {error}
                        </div>
                      )}

                      <div className="space-y-3">
                        {/* Nama Pasien */}
                        <input
                          type="text"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleChange}
                          placeholder="Nama Lengkap Pasien"
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none rounded-xl"
                        />

                        {/* No. Telepon & Hari */}
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="tel"
                            name="patientPhone"
                            value={formData.patientPhone}
                            onChange={handleChange}
                            placeholder="No. Telepon"
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none rounded-xl"
                          />
                          <select
                            name="dayOfWeek"
                            value={formData.dayOfWeek}
                            onChange={handleChange}
                            disabled={availableDays.length === 0}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {availableDays.length === 0
                                ? "Pilih dokter dulu"
                                : "Pilih Hari"}
                            </option>
                            {availableDays.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Spesialis */}
                        <select
                          name="specialty"
                          value={formData.specialty}
                          onChange={handleSpecialtyChange}
                          disabled={doctorsData.length === 0}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {doctorsData.length === 0
                              ? "Memuat spesialis..."
                              : "Pilih Spesialis"}
                          </option>
                          {specialties.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>

                        {/* Dokter */}
                        <select
                          name="doctor"
                          value={formData.doctor}
                          onChange={handleDoctorChange}
                          disabled={formData.specialty === ""}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">
                            {formData.specialty
                              ? "Pilih Dokter"
                              : "Pilih spesialis dulu"}
                          </option>
                          {availableDoctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.name}>
                              {doctor.name}
                            </option>
                          ))}
                        </select>

                        {/* Jam */}
                        <select
                          name="timeSlot"
                          value={formData.timeSlot}
                          onChange={handleChange}
                          disabled={
                            formData.doctor === "" ||
                            formData.dayOfWeek === "" ||
                            timeSlots.length === 0
                          }
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">{getTimeSlotLabel()}</option>
                          {timeSlots.map((time) => (
                            <option
                              key={`${time.start}-${time.end}`}
                              value={`${time.start} - ${time.end}`}
                            >
                              {time.start} - {time.end}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6">
                        <button
                          type="submit"
                          disabled={loading || doctorsData.length === 0}
                          className="w-full py-4 bg-[#003f88] text-white font-bold rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm cursor-pointer hover:bg-[#003f88]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            "Kirim"
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </main>
            </section>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
