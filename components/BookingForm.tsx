"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { sendWhatsAppBooking } from "@/lib/whatsapp";

interface BookingFormProps {
  readonly doctorName: string;
  readonly specialty: string;
  readonly onClose: () => void;
}

export default function BookingForm({
  doctorName,
  specialty,
  onClose,
}: Readonly<BookingFormProps>) {
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    preferredDate: "",
    keluhan: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.patientName.trim())
      return setError("Nama pasien wajib diisi");
    if (!formData.patientPhone.trim())
      return setError("Nomor telepon wajib diisi");
    if (!formData.keluhan.trim()) return setError("Keluhan wajib diisi");

    setLoading(true);

    try {
      sendWhatsAppBooking({
        patientName: formData.patientName,
        doctorName,
        specialty,
        patientPhone: formData.patientPhone,
        preferredDate: formData.preferredDate,
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
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
      />

      <motion.div
        key="booking-modal"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] w-full max-w-sm overflow-hidden pointer-events-auto border border-slate-100">
          {/* Header */}
          <div className="p-7 pb-2 flex items-start justify-between">
            <div className="pr-4">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                Buat Janji Temu
              </h2>
              <p className="text-slate-400 text-xs mt-1 font-medium">
                {doctorName} • {specialty}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-7">
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
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100  focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none  rounded-xl"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="tel"
                        name="patientPhone"
                        value={formData.patientPhone}
                        onChange={handleChange}
                        placeholder="Masukan No Tlp"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100  focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none  rounded-xl"
                      />
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100  focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none text-slate-400 rounded-xl"
                      />
                    </div>

                    <textarea
                      name="keluhan"
                      value={formData.keluhan}
                      onChange={handleChange}
                      placeholder="Keluhan atau Alasan Kunjungan"
                      rows={2}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100  focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none resize-none  rounded-xl"
                    />
                  </div>

                  {/* Button Kirim Pendaftaran */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#014f86] text-white font-bold rounded-full transition-all duration-300
                      active:scale-95 flex items-center justify-center gap-3 text-sm cursor-pointer"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin " />
                      ) : (
                        <>Kirim</>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-3 bg-transparent text-slate-400 font-medium rounded-full transition-all duration-200
                      hover:text-slate-600 active:scale-95 text-xs mt-2"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
