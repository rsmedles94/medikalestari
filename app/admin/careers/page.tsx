"use client";

import React, { useState, useEffect } from "react";
import { AdminPageSkeleton } from "@/components/AdminSkeleton";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import {
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  CareersBannerConfig,
  CareerRegistration,
  PositionPhoto,
} from "@/lib/types";

const AdminCareersPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"config" | "registrations">(
    "config",
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Config state
  const [config, setConfig] = useState<CareersBannerConfig | null>(null);
  const [configForm, setConfigForm] = useState({
    criteria: [] as string[],
    is_form_active: true,
    position_photos: [] as PositionPhoto[],
  });

  // Position photos state
  const [newPositionPhoto, setNewPositionPhoto] = useState<File | null>(null);
  const [newPositionName, setNewPositionName] = useState("");
  const [newPositionPreview, setNewPositionPreview] = useState("");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Registrations state
  const [registrations, setRegistrations] = useState<CareerRegistration[]>([]);
  const [selectedRegistration, setSelectedRegistration] =
    useState<CareerRegistration | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const loadData = async () => {
    try {
      const [configRes, regsRes] = await Promise.all([
        fetch("/api/careers/config"),
        fetch("/api/careers/registrations"),
      ]);

      if (configRes.ok) {
        const configData = await configRes.json();
        setConfig(configData);

        // Parse position_photos if it's a JSON string
        let parsedPhotos = [];
        if (configData.position_photos) {
          if (typeof configData.position_photos === "string") {
            try {
              parsedPhotos = JSON.parse(configData.position_photos);
            } catch (e) {
              console.error("Error parsing position_photos:", e);
              parsedPhotos = [];
            }
          } else if (Array.isArray(configData.position_photos)) {
            parsedPhotos = configData.position_photos;
          }
        }

        setConfigForm({
          criteria:
            typeof configData.criteria === "string"
              ? JSON.parse(configData.criteria)
              : configData.criteria || [],
          is_form_active: configData.is_form_active ?? true,
          position_photos: parsedPhotos,
        });
      }

      if (regsRes.ok) {
        const regsData = await regsRes.json();
        setRegistrations(regsData);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setMessage({
        type: "error",
        text: "Gagal memuat data",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    loadData();
  }, [authLoading, isAuthenticated, router]);

  const handlePositionPhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "File harus berupa gambar" });
        return;
      }
      setNewPositionPhoto(file);
      setNewPositionPreview(URL.createObjectURL(file));
    }
  };

  const handleAddPositionPhoto = () => {
    if (newPositionPhoto && newPositionName.trim()) {
      const newPhoto: PositionPhoto = {
        id: `temp-${Date.now()}`,
        image_url: newPositionPreview,
        position_name: newPositionName.trim(),
        order: configForm.position_photos.length,
      };

      setConfigForm((prev) => ({
        ...prev,
        position_photos: [...prev.position_photos, newPhoto],
      }));

      // Reset form
      setNewPositionPhoto(null);
      setNewPositionName("");
      setNewPositionPreview("");
      const photoInput = document.getElementById(
        "position-photo-input",
      ) as HTMLInputElement;
      if (photoInput) {
        photoInput.value = "";
      }
    }
  };

  const handleRemovePositionPhoto = (index: number) => {
    setConfigForm((prev) => ({
      ...prev,
      position_photos: prev.position_photos.filter((_, i) => i !== index),
    }));
    if (currentPhotoIndex >= configForm.position_photos.length - 1) {
      setCurrentPhotoIndex(Math.max(0, configForm.position_photos.length - 2));
    }
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? configForm.position_photos.length - 1 : prev - 1,
    );
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === configForm.position_photos.length - 1 ? 0 : prev + 1,
    );
  };

  const handleSaveConfig = async () => {
    setSubmitting(true);
    setMessage(null);

    try {
      // Upload position photos
      const processedPhotos: PositionPhoto[] = [];
      let uploadedNewPhoto = false;

      for (const photo of configForm.position_photos) {
        let imageUrl = photo.image_url;

        // Only upload if it's a temp preview (starts with blob) and file exists
        if (
          imageUrl.startsWith("blob:") &&
          newPositionPhoto &&
          !uploadedNewPhoto
        ) {
          const formData = new FormData();
          formData.append("file", newPositionPhoto);
          formData.append(
            "path",
            `careers/positions/${Date.now()}-${newPositionPhoto.name}`,
          );

          try {
            const uploadRes = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });

            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              imageUrl = uploadData.url || imageUrl;
              uploadedNewPhoto = true;
            }
          } catch (err) {
            console.error("Error uploading position photo:", err);
          }
        }

        processedPhotos.push({
          ...photo,
          image_url: imageUrl,
        });
      }

      const updateData = {
        id: config?.id || "default-config",
        criteria: JSON.stringify(configForm.criteria),
        is_form_active: configForm.is_form_active,
        position_photos: JSON.stringify(processedPhotos),
      };

      console.log("Sending config update:", updateData);

      const res = await fetch("/api/careers/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const responseData = await res.json();

      if (res.ok) {
        setConfig(responseData);
        setNewPositionPhoto(null);
        setNewPositionName("");
        setNewPositionPreview("");
        // Reset file inputs
        const photoInput = document.getElementById(
          "position-photo-input",
        ) as HTMLInputElement;
        if (photoInput) {
          photoInput.value = "";
        }
        setMessage({
          type: "success",
          text: "Konfigurasi berhasil disimpan",
        });
      } else {
        const errorText =
          responseData.details || responseData.error || "Gagal menyimpan";
        throw new Error(errorText);
      }
    } catch (err) {
      console.error("Error saving config:", err);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Terjadi kesalahan",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const downloadResume = (registration: CareerRegistration) => {
    if (registration.resume_url) {
      window.open(registration.resume_url, "_blank");
    }
  };

  const deleteRegistration = async (registrationId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pendaftar ini?")) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/careers/registrations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: registrationId }),
      });

      const responseData = await res.json();

      if (res.ok) {
        // Remove from local state immediately
        setRegistrations(
          registrations.filter((reg) => reg.id !== registrationId),
        );
        setMessage({
          type: "success",
          text: "Pendaftar berhasil dihapus",
        });
        // Reload data dari server untuk memastikan sync dengan database
        setTimeout(() => {
          loadData();
        }, 500);
      } else {
        throw new Error(responseData.error || "Gagal menghapus pendaftar");
      }
    } catch (err) {
      console.error("Error deleting registration:", err);
      // Reload data jika ada error
      await loadData();
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Gagal menghapus pendaftar",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openDetailModal = (registration: CareerRegistration) => {
    setSelectedRegistration(registration);
    setShowDetail(true);
  };

  if (loading) {
    return <AdminPageSkeleton title="Kelola Careers" />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <div className="max-w-[1220px] mx-auto px-6 md:px-12 py-12">
        <h1 className="text-[40px] font-medium mb-8">Kelola Careers</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle size={20} className="text-red-500 shrink-0" />
            ) : (
              <CheckCircle size={20} className="text-green-500 shrink-0" />
            )}
            <p
              className={`text-sm ${
                message.type === "error" ? "text-red-700" : "text-green-700"
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("config")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "config"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            Konfigurasi
          </button>
          <button
            onClick={() => setActiveTab("registrations")}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "registrations"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            Daftar Pendaftar ({registrations.length})
          </button>
        </div>

        {/* Configuration Tab */}
        {activeTab === "config" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="space-y-6">
              {/* Form Active Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status Form Pendaftaran
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setConfigForm((prev) => ({
                        ...prev,
                        is_form_active: !prev.is_form_active,
                      }))
                    }
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                      configForm.is_form_active ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        configForm.is_form_active
                          ? "translate-x-8"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-600">
                    {configForm.is_form_active
                      ? "Form pendaftaran aktif"
                      : "Form pendaftaran nonaktif"}
                  </span>
                </div>
              </div>

              {/* Position Photos */}
              {configForm.is_form_active && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Foto Posisi Lowongan
                  </label>

                  {/* Upload Position Photo */}
                  <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePositionPhotoChange}
                      className="hidden"
                      id="position-photo-input"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                      <div>
                        <label
                          htmlFor="position-photo-input"
                          className="cursor-pointer block mb-3"
                        >
                          {newPositionPreview ? (
                            <div className="space-y-2">
                              <img
                                src={newPositionPreview}
                                alt="Preview"
                                className="max-h-40 mx-auto rounded-lg"
                              />
                              <p className="text-xs text-gray-500">
                                Klik untuk ganti foto
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                Klik untuk upload foto
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                (JPG, PNG, WebP)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={newPositionName}
                          onChange={(e) => setNewPositionName(e.target.value)}
                          placeholder="Nama Posisi (mis: Dokter, Perawat, dll)"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-2"
                        />
                        <button
                          type="button"
                          onClick={handleAddPositionPhoto}
                          disabled={
                            !newPositionPhoto || !newPositionName.trim()
                          }
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Plus size={18} />
                          Tambah Foto Posisi
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Display Position Photos */}
                  {configForm.position_photos.length > 0 && (
                    <div className="space-y-4">
                      {/* Carousel Preview */}
                      {configForm.position_photos.length > 0 && (
                        <div>
                          <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200 mb-4">
                            <div
                              className="relative w-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center"
                              style={{ aspectRatio: "4/3" }}
                            >
                              <img
                                src={
                                  configForm.position_photos[currentPhotoIndex]
                                    ?.image_url
                                }
                                alt={
                                  configForm.position_photos[currentPhotoIndex]
                                    ?.position_name
                                }
                                className="max-h-full max-w-full object-contain p-4"
                              />
                            </div>

                            {/* Navigation Buttons */}
                            {configForm.position_photos.length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={handlePrevPhoto}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors border border-gray-200"
                                >
                                  <ChevronLeft size={20} />
                                </button>
                                <button
                                  type="button"
                                  onClick={handleNextPhoto}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors border border-gray-200"
                                >
                                  <ChevronRight size={20} />
                                </button>
                              </>
                            )}
                          </div>

                          {/* Position Name */}
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-lg font-semibold text-gray-900">
                              {
                                configForm.position_photos[currentPhotoIndex]
                                  ?.position_name
                              }
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {currentPhotoIndex + 1} dari{" "}
                              {configForm.position_photos.length}
                            </p>
                          </div>

                          {/* Indicator Dots */}
                          {configForm.position_photos.length > 1 && (
                            <div className="flex justify-center gap-2">
                              {configForm.position_photos.map((_, index) => (
                                <button
                                  key={`dot-${index}`}
                                  type="button"
                                  onClick={() => setCurrentPhotoIndex(index)}
                                  className={`rounded-full transition-all ${
                                    index === currentPhotoIndex
                                      ? "bg-gray-800 w-2.5 h-2.5"
                                      : "bg-gray-300 w-2 h-2 hover:bg-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                          )}

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() =>
                              handleRemovePositionPhoto(currentPhotoIndex)
                            }
                            className="w-full mt-4 px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
                          >
                            Hapus Foto Ini
                          </button>
                        </div>
                      )}

                      {/* Thumbnail Grid */}
                      {configForm.position_photos.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            Semua Foto ({configForm.position_photos.length})
                          </p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {configForm.position_photos.map((photo, index) => (
                              <button
                                key={`thumb-${photo.id}`}
                                type="button"
                                onClick={() => setCurrentPhotoIndex(index)}
                                className={`relative rounded-lg overflow-hidden transition-all border-2 group ${
                                  index === currentPhotoIndex
                                    ? "border-gray-800 ring-2 ring-gray-800 ring-offset-2"
                                    : "border-gray-200 hover:border-gray-400"
                                }`}
                              >
                                <div className="w-full aspect-square bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={photo.image_url}
                                    alt={photo.position_name}
                                    className="w-full h-full object-contain p-1"
                                  />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSaveConfig}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Konfigurasi"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <div>
            {registrations.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-gray-500">
                  Belum ada pendaftar untuk Careers
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                          Nama
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                          Posisi
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                          Pengalaman
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                          Tanggal Daftar
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg) => (
                        <tr
                          key={reg.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {reg.full_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {reg.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {reg.position}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {reg.experience_years} tahun
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(reg.created_at).toLocaleDateString(
                              "id-ID",
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm space-x-2 flex">
                            <button
                              onClick={() => openDetailModal(reg)}
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              title="Lihat Detail"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => downloadResume(reg)}
                              className="text-green-600 hover:text-green-700 flex items-center gap-1"
                              title="Download Resume"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => deleteRegistration(reg.id)}
                              disabled={submitting}
                              className="text-red-600 hover:text-red-700 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Hapus Pendaftar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Detail Pendaftar
              </h2>
              <button
                onClick={() => {
                  setShowDetail(false);
                  setSelectedRegistration(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-medium text-gray-800">
                    {selectedRegistration.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">
                    {selectedRegistration.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">No. HP</p>
                  <p className="font-medium text-gray-800">
                    {selectedRegistration.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Posisi</p>
                  <p className="font-medium text-gray-800">
                    {selectedRegistration.position}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pendidikan</p>
                  <p className="font-medium text-gray-800">
                    {selectedRegistration.education}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pengalaman</p>
                  <p className="font-medium text-gray-800">
                    {selectedRegistration.experience_years} tahun
                  </p>
                </div>
              </div>

              {selectedRegistration.criteria_fields &&
                Object.keys(selectedRegistration.criteria_fields).length >
                  0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Kriteria Tambahan
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(selectedRegistration.criteria_fields).map(
                        ([key, value]) => (
                          <div key={key} className="text-sm">
                            <p className="text-gray-500">{key}</p>
                            <p className="font-medium text-gray-800">
                              {value as string}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {selectedRegistration.resume_url && (
                <div className="border-t pt-4">
                  <button
                    onClick={() => downloadResume(selectedRegistration)}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download Resume
                  </button>
                </div>
              )}

              {selectedRegistration.whatsapp_link && (
                <div className="border-t pt-4">
                  <a
                    href={selectedRegistration.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
                  >
                    Hubungi via WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareersPage;
