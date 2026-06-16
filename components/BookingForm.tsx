"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { sendWhatsAppBooking } from "@/lib/whatsapp";
import { Schedule } from "@/lib/types";

interface BookingFormProps {
  readonly doctorName: string;
  readonly specialty: string;
  readonly onClose: () => void;
  readonly schedules?: Schedule[]; // Jadwal opsional: jika tersedia, tampilkan pilihan hari+waktu
}

export default function BookingForm({
  doctorName,
  specialty,
  onClose,
  schedules,
}: Readonly<BookingFormProps>) {
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    preferredDate: "", // fallback / Alternatif jika jadwal tidak tersedia
    keluhan: "",
  });
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Scroll Lock Mencegah pengguliran latar belakang saat modal terbuka
  useEffect(() => {
    // Tambahkan overflow hidden ke body untuk mencegah scroll
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Cleanup / kembalikan style saat modal ditutup
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const DAYS_ORDER = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];

  const availableDays = (propsSchedules?: Schedule[]) => {
    if (!propsSchedules || propsSchedules.length === 0) return [] as string[];
    const unique = Array.from(
      new Set(propsSchedules.map((s) => s.day_of_week)),
    );
    // Urutkan berdasarkan DAYS_ORDER
    return unique.sort((a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b));
  };

  const timeSlotsForDay = (day: string, propsSchedules?: Schedule[]) => {
    if (!propsSchedules || !day) return [] as string[];
    const slots = propsSchedules
      .filter((s) => s.day_of_week === day)
      .map(
        (s) =>
          `${s.start_time.substring(0, 5)} - ${s.end_time.substring(0, 5)}`,
      )
      // dedupe
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort();
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.patientName.trim())
      return setError("Nama pasien wajib diisi");
    if (!formData.patientPhone.trim())
      return setError("Nomor telepon wajib diisi");
    if (!formData.keluhan.trim()) return setError("Keluhan wajib diisi");

    // Jika jadwal tersedia, wajib memilih hari dan waktu.
    if (schedules && schedules.length > 0) {
      if (!selectedDay) return setError("Pilih hari praktik dokter");
      if (!selectedTime) return setError("Pilih jam praktik dokter");
      // Atur tanggal pilihan untuk menggabungkan hari + waktu
      setFormData((prev) => ({
        ...prev,
        preferredDate: `${selectedDay} ${selectedTime}`,
      }));
    }

    setLoading(true);

    try {
      const preferred =
        schedules && schedules.length > 0
          ? `${selectedDay} ${selectedTime}`
          : formData.preferredDate;

      sendWhatsAppBooking({
        patientName: formData.patientName,
        doctorName,
        specialty,
        patientPhone: formData.patientPhone,
        preferredDate: preferred,
        keluhan: formData.keluhan,
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 3000);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="booking-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-60"
      />

      <motion.div
        key="booking-modal"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none"
      >
        {/* Container Booking Form */}
        <section className="bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] w-full max-w-sm overflow-hidden pointer-events-auto border border-slate-100">
          {/* Header */}
          <header className="p-7 pb-2 flex items-start justify-between">
            <div className="pr-4">
              <h2 className="text-xl font-semibold text-slate-900 leading-tight">
                Buat Janji Temu
              </h2>
              <p className="text-slate-400 text-xs mt-1 font-normal">
                {doctorName} • {specialty}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={24} />
            </button>
          </header>

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
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      placeholder="Nama Lengkap Pasien"
                      className="w-full px-5 py-3.5 bg-white border border-slate-100 focus:ring-2 focus:ring-[#003f88] transition-all text-sm outline-none  rounded-xl"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="tel"
                        name="patientPhone"
                        value={formData.patientPhone}
                        onChange={handleChange}
                        placeholder="Masukan No Tlp"
                        className="w-full px-5 py-3.5  border border-slate-100  focus:ring-2 focus:ring-[#003f88] transition-all text-sm outline-none  rounded-xl"
                      />

                      {schedules && schedules.length > 0 ? (
                        <div className="w-full">
                          <select
                            value={selectedDay}
                            onChange={(e) => {
                              setSelectedDay(e.target.value);
                              setSelectedTime("");
                            }}
                            className="w-full px-4 py-3  border border-slate-100 rounded-xl text-sm outline-none"
                          >
                            <option value="">Pilih Hari</option>
                            {availableDays(schedules).map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full mt-2 px-4 py-3  border border-slate-100 rounded-xl text-sm outline-none"
                            disabled={!selectedDay}
                          >
                            <option value="">Pilih Jam</option>
                            {timeSlotsForDay(selectedDay, schedules).map(
                              (t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      ) : (
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100  focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none text-slate-400 rounded-xl"
                        />
                      )}
                    </div>

                    <textarea
                      name="keluhan"
                      value={formData.keluhan}
                      onChange={handleChange}
                      placeholder="Keluhan atau Alasan Kunjungan"
                      rows={2}
                      className="w-full px-5 py-3.5 border border-slate-100  focus:bg-white focus:ring-2 focus:ring-[#003f88] transition-all text-sm outline-none resize-none  rounded-xl"
                    />
                  </div>

                  {/* Button Kirim Pendaftaran */}
                  <div className="flex gap-3 pt-4">
                     <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-[#003f88] hover:bg-[#003f88] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin " />
                      ) : (
                        <>Kirim</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </main>
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
