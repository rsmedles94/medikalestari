"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  X,
} from "lucide-react";
import { CareersBannerConfig } from "@/lib/types";
import CareersFormSkeleton from "@/components/CareersFormSkeleton";

const CareersPage = () => {
  const [config, setConfig] = useState<CareersBannerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    position: "",
    education: "",
    experience_years: 0,
    criteria_fields: {} as Record<string, string>,
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string>("");

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/careers/config");
        const data = await res.json();

        // Parse criteria if it's a JSON string
        if (data.criteria && typeof data.criteria === "string") {
          try {
            data.criteria = JSON.parse(data.criteria);
          } catch (e) {
            console.error("Error parsing criteria:", e);
            data.criteria = [];
          }
        } else if (!Array.isArray(data.criteria)) {
          data.criteria = [];
        }

        // Parse position_photos if it's a JSON string
        if (data.position_photos && typeof data.position_photos === "string") {
          try {
            data.position_photos = JSON.parse(data.position_photos);
          } catch (e) {
            console.error("Error parsing position_photos:", e);
            data.position_photos = [];
          }
        } else if (!Array.isArray(data.position_photos)) {
          data.position_photos = [];
        }

        setConfig(data);
      } catch (err) {
        console.error("Error loading config:", err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Kunci scroll background saat modal formulir terbuka
  useEffect(() => {
    if (showModal) {
      const scrollY = window.scrollY;
      const originalBodyPosition = document.body.style.position;
      const originalBodyTop = document.body.style.top;
      const originalBodyLeft = document.body.style.left;
      const originalBodyRight = document.body.style.right;
      const originalBodyWidth = document.body.style.width;
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.position = originalBodyPosition;
        document.body.style.top = originalBodyTop;
        document.body.style.left = originalBodyLeft;
        document.body.style.right = originalBodyRight;
        document.body.style.width = originalBodyWidth;
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.scrollTo(0, scrollY);
      };
    }
  }, [showModal]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience_years" ? Number.parseInt(value) || 0 : value,
    }));
  };

  const handleCriteriaChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      criteria_fields: {
        ...prev.criteria_fields,
        [field]: value,
      },
    }));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Resume harus berformat PDF");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Resume tidak boleh lebih dari 5MB");
        return;
      }
      setResumeFile(file);
      setResumePreview(file.name);
      setError("");
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!resumeFile) {
        setError("Resume harus diunggah");
        setSubmitting(false);
        return;
      }

      // Upload resume
      const formDataUpload = new FormData();
      formDataUpload.append("file", resumeFile);
      formDataUpload.append("path", `careers/${Date.now()}-${resumeFile.name}`);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      let resumeUrl = "";
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        resumeUrl = uploadData.url || "";
      }

      // Prepare message for WhatsApp
      const criteria_text = Object.entries(formData.criteria_fields)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      const message = `
Pendaftaran Careers RS Medika Lestari

Nama: ${formData.full_name}
Email: ${formData.email}
No. HP: ${formData.phone}
Posisi: ${formData.position}
Pendidikan: ${formData.education}
Pengalaman: ${formData.experience_years} tahun

${criteria_text ? "Kriteria Tambahan:\n" + criteria_text : ""}

Silakan hubungi melalui link di bawah untuk melanjutkan proses seleksi.
${resumeUrl ? `\nResume: ${resumeUrl}` : ""}
      `.trim();

      const whatsappNumber = config?.phone_number || "082246232527";
      const whatsappMessage = encodeURIComponent(message);
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

      // Save to database
      const registrationData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        education: formData.education,
        experience_years: formData.experience_years,
        criteria_fields: formData.criteria_fields,
        resume_url: resumeUrl,
        whatsapp_link: whatsappLink,
      };

      const saveRes = await fetch("/api/careers/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      if (!saveRes.ok) {
        const errorData = await saveRes.json().catch(() => ({}));
        const errorMessage = errorData.error || "Gagal menyimpan data";
        const errorDetails = errorData.details ? ` (${errorData.details})` : "";
        throw new Error(errorMessage + errorDetails);
      }

      setSuccess(true);
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        position: "",
        education: "",
        experience_years: 0,
        criteria_fields: {},
      });
      setResumeFile(null);
      setResumePreview("");

      // Redirect ke WhatsApp
      setTimeout(() => {
        window.open(whatsappLink, "_blank");
      }, 1500);
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <CareersFormSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* BREADCRUMB & TITLE SECTION */}
      <div className="max-w-293.75 mx-auto px-4 md:px-8 pt-4 md:pt-16 pb-12 md:-mt-1">
        <nav className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-4">
          <Link
            href="/"
            className="text-black/60 hover:text-gray-300 transition-colors"
          >
            Beranda
          </Link>
          <ChevronRight size={12} className="text-black/60" />
          <span className="font-normal">Karir</span>
        </nav>
      </div>

      {/* Position Photos Grid */}
      {config?.position_photos && config.position_photos.length > 0 && (
        <div className="max-w-293.75 mx-auto px-4 md:px-8 py-1">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Posisi lowongan yang tersedia
            </h2>
            <p className="text-sm md:text-base text-gray-500 italic">
              *Proses rekrutmen tetap aktif selama informasi lowongan masih
              tersedia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {config.position_photos.map((photo, index) => (
              <div
                key={photo.id ?? `photo-${index}`}
                className="border border-gray-200  overflow-hidden"
              >
                <div className="relative w-full aspect-square overflow-hidden">
                  {photo.image_url ? (
                    <img
                      src={photo.image_url}
                      alt={photo.position_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Failed to load image:", photo.image_url);
                        // Check if it's a blob URL (temporary, invalid)
                        if (photo.image_url?.startsWith("blob:")) {
                          console.warn(
                            "Blob URL detected - image is temporary and may have expired",
                          );
                        }
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (
                          parent &&
                          !parent.querySelector("[data-error-message]")
                        ) {
                          const errorDiv = document.createElement("div");
                          errorDiv.setAttribute("data-error-message", "true");
                          errorDiv.className =
                            "flex items-center justify-center h-full text-center text-gray-400 text-xs p-4";
                          errorDiv.innerHTML =
                            "<p>Gambar tidak dapat dimuat</p>";
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Gambar tidak tersedia
                    </div>
                  )}
                </div>
                <div className="px-3 py-3 text-center border-t border-gray-100">
                  <p className="text-sm md:text-base font-semibold text-gray-900 truncate">
                    {photo.position_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cek jika form tidak aktif */}
      {!config?.is_form_active ? (
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">
            Maaf saat ini RS Medika Lestari belum membuka lowongan. Silakan
            kunjungi kembali di lain waktu.
          </p>
        </div>
      ) : (
        <>
          {/* Button Daftar Section */}
          <div className="max-w-2xl mx-auto px-4 py-12 flex justify-center ">
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-[#003f88] text-white font-semibold hover:bg-[#003f88]/90 transition-colors cursor-pointer active:scale-95 mb-20 rounded-md"
            >
              Daftar Lowongan
            </button>
          </div>
        </>
      )}

      {/* Modal Backdrop */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowModal(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowModal(false);
          }}
          role="presentation"
        >
          {/* Modal Container */}
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[95vh] sm:max-h-[90vh] flex flex-col z-50"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Formulir Pendaftaran Karir
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content with Scrollbar */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle size={18} className="text-red-500 shrink-0" />
                    <p className="text-red-700 text-xs sm:text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle
                      size={18}
                      className="text-green-500 shrink-0"
                    />
                    <p className="text-green-700 text-xs sm:text-sm">
                      Data berhasil dikirim! Anda akan dialihkan ke WhatsApp...
                    </p>
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label
                      htmlFor="full_name"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Nama Lengkap *
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003f88] focus:border-transparent outline-none"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003f88] focus:border-transparent outline-none"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      No. HP *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003f88] focus:border-transparent outline-none"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="position"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Posisi Lamaran *
                    </label>
                    {config?.position_photos &&
                    config.position_photos.length > 0 ? (
                      <select
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003f88] focus:border-transparent outline-none bg-white"
                      >
                        <option value="">Pilih Posisi</option>
                        {config.position_photos.map((photo) => (
                          <option key={photo.id} value={photo.position_name}>
                            {photo.position_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="position"
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003f88] focus:border-transparent outline-none"
                        placeholder="Misal: Perawat, Dokter, dll"
                      />
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="education"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Pendidikan Terakhir *
                    </label>
                    <select
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003f88] focus:border-transparent outline-none bg-white"
                    >
                      <option value="">Pilih Pendidikan Terakhir</option>
                      <option value="D3">D3</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                      <option value="Profesi">Profesi</option>
                      <option value="Spesialis">Spesialis</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="experience_years"
                      className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                    >
                      Pengalaman Kerja (Tahun) *
                    </label>
                    <input
                      id="experience_years"
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      min="0"
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003f88] focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Dynamic Criteria Fields */}
                {config?.criteria &&
                  Array.isArray(config.criteria) &&
                  config.criteria.length > 0 && (
                    <div className="pb-3 sm:pb-4 border-b">
                      <div className="space-y-2 sm:space-y-3">
                        {config.criteria.map((criterion) => {
                          // Ubah "not" menjadi "Alasan Ingin Bekerja Disini"
                          const displayCriterion =
                            criterion.toLowerCase() === "not"
                              ? "Alasan Ingin Bekerja Disini"
                              : criterion;

                          return (
                            <div key={`criterion-${criterion}`}>
                              <label
                                htmlFor={`criterion-${criterion}`}
                                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                              >
                                {displayCriterion}
                              </label>
                              <input
                                id={`criterion-${criterion}`}
                                type="text"
                                value={
                                  formData.criteria_fields[criterion] || ""
                                }
                                onChange={(e) =>
                                  handleCriteriaChange(
                                    criterion,
                                    e.target.value,
                                  )
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003f88] focus:border-transparent outline-none"
                                placeholder={
                                  criterion.toLowerCase() === "not"
                                    ? "Jelaskan alasan Anda ingin bekerja di RS Medika Lestari"
                                    : `Masukkan ${criterion.toLowerCase()}`
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Resume Upload */}
                <div>
                  <label
                    htmlFor="resume-input"
                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload Resume (PDF) *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-[#003f88] transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeChange}
                      className="hidden"
                      id="resume-input"
                    />
                    <label
                      htmlFor="resume-input"
                      className="cursor-pointer block"
                    >
                      <Upload
                        size={24}
                        className="mx-auto mb-1 text-gray-400"
                      />
                      <p className="text-xs sm:text-sm font-medium text-gray-600">
                        {resumePreview || "Klik upload resume (Max 5MB)"}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Form Footer Buttons */}
                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !config?.is_form_active}
                    className="flex-1 bg-[#003f88] text-white py-2 text-sm rounded-lg font-semibold hover:bg-[#003f88]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span className="hidden sm:inline">Mengirim...</span>
                        <span className="sm:hidden">Kirim...</span>
                      </>
                    ) : (
                      "Kirim Pendaftaran"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
