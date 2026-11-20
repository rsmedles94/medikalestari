"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { fetchAllDoctorsWithSchedules } from "@/lib/api";
import { Doctor, Schedule } from "@/lib/types";

interface BookingModalFloatingProps {
  isOpen: boolean;
  onClose: () => void;
}

// Kelas bersama supaya semua kolom konsisten.
// Mobile dibuat lebih ringkas; mulai breakpoint sm tampilannya sama seperti semula.
// text-base di mobile (16px) mencegah iOS memperbesar layar saat kolom difokuskan.
const labelClass =
  "block mb-1 sm:mb-1.5 text-[13px] sm:text-sm font-semibold text-slate-800";
const fieldBase =
  "w-full h-11 sm:h-12 bg-white border border-slate-400 rounded-sm text-base sm:text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-[#003f88] focus:ring-1 focus:ring-[#003f88] disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-300 disabled:cursor-not-allowed";
const fieldClass = `${fieldBase} px-3 sm:px-4`;
const selectClass = `${fieldBase} appearance-none pl-3 pr-9 sm:pl-4 sm:pr-10 cursor-pointer`;

function Chevron() {
  return (
    <ChevronDown
      size={18}
      className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
    />
  );
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

  // Muat data dokter saat modal dibuka
  useEffect(() => {
    if (isOpen && doctorsData.length === 0) {
      const loadDoctors = async () => {
        try {
          const data = await fetchAllDoctorsWithSchedules();
          setDoctorsData(data as (Doctor & { schedules: Schedule[] })[]);
        } catch (err) {
          console.error("Gagal memuat data dokter:", err);
        }
      };
      loadDoctors();
    }
  }, [isOpen, doctorsData.length]);

  // Pengunci scroll latar belakang
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Kunci posisi body
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Buka kunci scroll saat modal ditutup
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollY);
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
      dayOfWeek: "",
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
    if (!formData.dayOfWeek) {
      setError("Pilih hari");
      return;
    }
    if (!formData.timeSlot) {
      setError("Pilih jam");
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

  // Daftar spesialisasi unik
  const specialties = Array.from(
    new Set(doctorsData.map((d) => d.specialty)),
  ).sort((a, b) => a.localeCompare(b));

  // Daftar dokter berdasarkan spesialisasi yang dipilih
  const availableDoctors = formData.specialty
    ? doctorsData.filter((d) => d.specialty === formData.specialty)
    : [];

  // Data dokter yang sedang dipilih
  const selectedDoctor = doctorsData.find((d) => d.name === formData.doctor);

  // Daftar hari praktik dokter yang dipilih
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

  // Daftar jam praktik berdasarkan hari & dokter yang dipilih
  const timeSlots =
    selectedDoctor && formData.dayOfWeek
      ? selectedDoctor.schedules
          .filter((s) => s.is_available && s.day_of_week === formData.dayOfWeek)
          .map((s) => ({ start: s.start_time, end: s.end_time }))
          .sort((a, b) => a.start.localeCompare(b.start))
      : [];

  const getTimeSlotLabel = () => {
    if (!formData.doctor) {
      return "Pilih dokter";
    }
    if (!formData.dayOfWeek) {
      return "Pilih hari";
    }
    return timeSlots.length === 0 ? "Tidak ada jadwal tersedia" : "Pilih jam";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay latar belakang */}
          <motion.div
            key="booking-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-60"
          />

          {/* Container modal */}
          <motion.div
            key="booking-modal"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 pointer-events-none"
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-title"
              className="relative flex flex-col w-full max-w-xl max-h-[92dvh] sm:max-h-[92vh] bg-white rounded-sm shadow-2xl pointer-events-auto"
            >
              {/* Header modal */}
              <header className="shrink-0 flex items-center justify-between px-4 sm:px-8 py-5 sm:py-5 border-b border-slate-200">
                <h2
                  id="booking-title"
                  className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight"
                >
                  Formulir Janji Temu
                </h2>

                {/* Tombol tutup */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup"
                  className="hidden sm:flex -mr-1 w-12 h-12 items-center justify-center text-slate-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003f88]"
                >
                  <X size={40} strokeWidth={1.75} />
                </button>
              </header>

              {/* Isi form */}
              <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    /* Pesan sukses */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6 sm:py-10"
                    >
                      <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle size={36} strokeWidth={1.75} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Data Terkirim
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                        Admin akan segera menghubungi Anda melalui WhatsApp.
                      </p>
                    </motion.div>
                  ) : (
                    /* Form input */
                    <form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-4 sm:space-y-5"
                    >
                      {error && (
                        <div
                          role="alert"
                          className="flex items-center gap-3 bg-red-50 border border-red-200 border-l-4 border-l-red-600 px-3 sm:px-4 py-2 sm:py-3 text-sm text-red-800"
                        >
                          <AlertCircle size={20} className="shrink-0" />
                          {error}
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:gap-5">
                        {/* Nama pasien */}
                        <div>
                          <label htmlFor="patientName" className={labelClass}>
                            Nama pasien
                          </label>
                          <input
                            id="patientName"
                            type="text"
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="Masukkan nama pasien"
                          />
                        </div>

                        {/* No. Telepon */}
                        <div>
                          <label htmlFor="patientPhone" className={labelClass}>
                            Nomor telepon
                          </label>
                          <input
                            id="patientPhone"
                            type="tel"
                            name="patientPhone"
                            value={formData.patientPhone}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="Masukkan nomor telepon"
                          />
                        </div>

                        {/* Spesialis */}
                        <div>
                          <label htmlFor="specialty" className={labelClass}>
                            Spesialis
                          </label>
                          <div className="relative">
                            <select
                              id="specialty"
                              name="specialty"
                              value={formData.specialty}
                              onChange={handleSpecialtyChange}
                              disabled={doctorsData.length === 0}
                              className={selectClass}
                            >
                              <option value="">
                                {doctorsData.length === 0
                                  ? "Memuat spesialis..."
                                  : "Pilih spesialis"}
                              </option>
                              {specialties.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <Chevron />
                          </div>
                        </div>

                        {/* Dokter */}
                        <div>
                          <label htmlFor="doctor" className={labelClass}>
                            Dokter
                          </label>
                          <div className="relative">
                            <select
                              id="doctor"
                              name="doctor"
                              value={formData.doctor}
                              onChange={handleDoctorChange}
                              disabled={formData.specialty === ""}
                              className={selectClass}
                            >
                              <option value="">
                                {formData.specialty
                                  ? "Pilih dokter"
                                  : "Pilih spesialis"}
                              </option>
                              {availableDoctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.name}>
                                  {doctor.name}
                                </option>
                              ))}
                            </select>
                            <Chevron />
                          </div>
                        </div>

                        {/* Hari */}
                        <div>
                          <label htmlFor="dayOfWeek" className={labelClass}>
                            Hari
                          </label>
                          <div className="relative">
                            <select
                              id="dayOfWeek"
                              name="dayOfWeek"
                              value={formData.dayOfWeek}
                              onChange={handleChange}
                              disabled={availableDays.length === 0}
                              className={selectClass}
                            >
                              <option value="">
                                {availableDays.length === 0
                                  ? "Pilih dokter"
                                  : "Pilih hari"}
                              </option>
                              {availableDays.map((day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              ))}
                            </select>
                            <Chevron />
                          </div>
                        </div>

                        {/* Jam */}
                        <div>
                          <label htmlFor="timeSlot" className={labelClass}>
                            Jam praktik
                          </label>
                          <div className="relative">
                            <select
                              id="timeSlot"
                              name="timeSlot"
                              value={formData.timeSlot}
                              onChange={handleChange}
                              disabled={
                                formData.doctor === "" ||
                                formData.dayOfWeek === "" ||
                                timeSlots.length === 0
                              }
                              className={selectClass}
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
                            <Chevron />
                          </div>
                        </div>
                      </div>

                      {/* Tombol aksi */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="flex-1 h-11 sm:h-12 border border-slate-400 text-slate-800 font-semibold text-[15px] rounded-sm hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003f88]"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={loading || doctorsData.length === 0}
                          className="flex-1 h-11 sm:h-12 bg-[#003f88] text-white font-semibold text-[15px] rounded-sm transition-colors flex items-center justify-center gap-3 cursor-pointer hover:bg-[#00306a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003f88] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
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
