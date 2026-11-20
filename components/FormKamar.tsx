"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface FormKamarProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
}

// Nomor WhatsApp tujuan (format internasional tanpa tanda +)
const WHATSAPP_NUMBER = "6285717028133";

// Kelas bersama untuk kolom formulir
const labelClass = "block mb-1.5 text-sm font-semibold text-slate-800";
const fieldClass =
  "w-full h-12 px-4 bg-white border border-slate-400 rounded-sm text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-[#003f88] focus:ring-1 focus:ring-[#003f88]";
const textareaClass =
  "w-full px-4 py-3 bg-white border border-slate-400 rounded-sm text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-colors resize-none focus:border-[#003f88] focus:ring-1 focus:ring-[#003f88]";

const initialFormData = {
  nama: "",
  noTelepon: "",
  tanggalMasuk: "",
  catatan: "",
};

// Tanggal hari ini (waktu lokal) dalam format YYYY-MM-DD untuk batas minimal input tanggal
function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function FormKamar({
  isOpen,
  onClose,
  roomName,
}: Readonly<FormKamarProps>) {
  const [formData, setFormData] = useState(initialFormData);

  // Pengunci scroll latar belakang
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const tanggalMasuk = new Date(
      `${formData.tanggalMasuk}T00:00:00`,
    ).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const message =
      `Halo, saya ingin menanyakan ketersediaan kamar.\n\n` +
      `• Nama: ${formData.nama}\n` +
      `• No. Telepon: ${formData.noTelepon}\n` +
      `• Tipe Kamar: ${roomName}\n` +
      `• Rencana Tanggal Masuk: ${tanggalMasuk}\n` +
      `• Catatan: ${formData.catatan || "-"}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    setFormData(initialFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      suppressHydrationWarning
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-kamar-title"
        className="bg-white rounded-sm w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl"
      >
        {/* Header modal */}
        <div className="shrink-0 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-200">
          <h2
            id="form-kamar-title"
            className="text-2xl font-bold text-slate-900 leading-tight"
          >
            Tanya Ketersediaan Kamar
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="-mr-1 w-12 h-12 flex items-center justify-center text-slate-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003f88]"
          >
            <X size={40} strokeWidth={1.75} />
          </button>
        </div>

        {/* Isi form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-6 space-y-5"
        >
          <div>
            <label htmlFor="kamar-nama" className={labelClass}>
              Nama lengkap <span className="text-red-600">*</span>
            </label>
            <input
              id="kamar-nama"
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className={fieldClass}
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label htmlFor="kamar-telepon" className={labelClass}>
              Nomor telepon <span className="text-red-600">*</span>
            </label>
            <input
              id="kamar-telepon"
              type="tel"
              name="noTelepon"
              value={formData.noTelepon}
              onChange={handleChange}
              required
              className={fieldClass}
              placeholder="Masukkan nomor telepon"
            />
          </div>

          <div>
            <label htmlFor="kamar-tanggal" className={labelClass}>
              Rencana tanggal masuk <span className="text-red-600">*</span>
            </label>
            <input
              id="kamar-tanggal"
              type="date"
              name="tanggalMasuk"
              value={formData.tanggalMasuk}
              onChange={handleChange}
              min={getTodayString()}
              required
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="kamar-catatan" className={labelClass}>
              Catatan
            </label>
            <textarea
              id="kamar-catatan"
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              className={textareaClass}
              placeholder="Masukkan catatan, misalnya jumlah malam (opsional)"
              rows={3}
            />
          </div>

          {/* Info kamar */}
          <div className="bg-slate-50 border border-slate-300 border-l-4 border-l-[#003f88] px-4 py-3">
            <p className="text-sm text-slate-800">
              <span className="font-semibold text-[#003f88]">Kamar:</span>{" "}
              {roomName}
            </p>
          </div>

          {/* Tombol aksi */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 border border-slate-400 text-slate-800 font-semibold text-[15px] rounded-sm hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003f88]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 h-12 bg-[#003f88] hover:bg-[#00306a] text-white font-semibold text-[15px] rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003f88]"
            >
              Kirim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
