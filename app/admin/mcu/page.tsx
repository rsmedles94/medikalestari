"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { AdminPageSkeleton } from "@/components/AdminSkeleton";
import { MCUPackageCard } from "@/components/MCUPackageCard";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ImageIcon,
  Upload,
} from "lucide-react";
import { MCUPackage } from "@/lib/types";

const MCUAdmin = () => {
  const [packages, setPackages] = useState<MCUPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    image_url: "",
    href: "",
  });
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const loadPackages = async () => {
    try {
      // Cache busting dengan timestamp
      const res = await fetch(`/api/admin/mcu?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setPackages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading packages:", error);
      setLoading(false);
    }
  };

  // Load packages on mount
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        if (mounted) {
          router.push("/admin/login");
        }
        return;
      }

      if (mounted) {
        await loadPackages();
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Create local preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          image_url: preview,
        }));
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("path", `mcu/${Date.now()}-${file.name}`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Upload error response:", data);
        throw new Error(data.error || "Upload failed");
      }

      if (data.url) {
        // Replace with actual URL after upload
        setFormData((prev) => ({
          ...prev,
          image_url: data.url,
        }));
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      alert(`Error upload: ${errorMsg}`);
      // Reset to preview if upload fails
      setFormData((prev) => ({
        ...prev,
        image_url: "",
      }));
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.image_url) {
      alert("Title, Harga, dan Gambar harus diisi");
      return;
    }

    // Prevent double submit
    if (submitting) return;

    try {
      setSubmitting(true);
      const url = editingId ? `/api/admin/mcu/${editingId}` : "/api/admin/mcu";
      const method = editingId ? "PATCH" : "POST";

      console.log("Submitting form:", { method, url, formData });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        cache: "no-store",
      });

      console.log(
        "Response status:",
        res.status,
        "Content-Type:",
        res.headers.get("content-type"),
      );

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error("Invalid response from server");
      }

      console.log("Response:", { status: res.status, data });

      if (!res.ok) {
        console.error("Save error response:", data);
        const errorMessage =
          data?.error || data?.message || `HTTP ${res.status}: Save failed`;
        throw new Error(errorMessage);
      }

      // Update local state immediately with returned data for instant UI update
      if (editingId) {
        // Update existing package
        setPackages((prev) =>
          prev.map((pkg) => (pkg.id === editingId ? data : pkg)),
        );
      } else {
        // Add new package
        setPackages((prev) => [...prev, data]);
      }

      // Reset form first
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        price: "",
        image_url: "",
        href: "",
      });

      // Show success message
      alert(`✅ Paket berhasil ${editingId ? "diubah" : "ditambahkan"}`);

      // Refresh data in background untuk consistency
      setTimeout(() => {
        loadPackages();
      }, 500);
    } catch (error) {
      console.error("Error saving package:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      alert(`❌ Error save: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (pkg: MCUPackage) => {
    setFormData({
      title: pkg.title,
      price: pkg.price,
      image_url: pkg.image_url,
      href: pkg.href,
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus paket ini?")) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/admin/mcu/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      console.log("Delete response status:", res.status);

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Failed to parse delete response:", parseError);
        throw new Error("Invalid response from server");
      }

      console.log("Delete response:", { status: res.status, data });

      if (!res.ok) {
        console.error("Delete error response:", data);
        const errorMessage =
          data?.error || data?.message || `HTTP ${res.status}: Delete failed`;
        throw new Error(errorMessage);
      }

      // Update local state immediately for instant UI update
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));

      alert("✅ Paket berhasil dihapus");

      // Refresh data in background untuk consistency
      setTimeout(() => {
        loadPackages();
      }, 500);
    } catch (error) {
      console.error("Error deleting package:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      alert(`❌ Error delete: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: "",
      price: "",
      image_url: "",
      href: "",
    });
  };

  if (authLoading || loading) return <AdminPageSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#005753]">
              Kelola Paket MCU
            </h1>
            <p className="text-gray-600">
              Tambah, ubah, atau hapus paket Medical Checkup
            </p>
          </div>
        </div>

        {showForm ? (
          /* Form */
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-[#005753] mb-6">
              {editingId ? "Ubah Paket MCU" : "Tambah Paket MCU"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Judul Paket *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan Nama Paket"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Harga *
                </label>
                <input
                  id="price"
                  type="text"
                  value={formData.price}
                  onChange={(e) => {
                    // 1. Ambil input dan hapus semua karakter kecuali angka
                    const rawValue = e.target.value.replace(/\D/g, "");

                    // 2. Format angka menjadi ribuan dengan titik (Locale Indonesia)
                    const formattedValue = rawValue
                      ? Number(rawValue).toLocaleString("id-ID")
                      : "";

                    setFormData((prev) => ({
                      ...prev,
                      price: formattedValue,
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 1.000.000"
                />
              </div>

              {/* Image URL */}
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar *
                </legend>
                <div className="space-y-3">
                  {formData.image_url && (
                    <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image_url: "",
                          }))
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded p-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <label
                    htmlFor="image-upload-mcu"
                    className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                  >
                    <span className="flex items-center gap-2 text-gray-600">
                      <Upload size={18} />
                      {uploading ? "Uploading..." : "Pilih Gambar"}
                    </span>
                    <input
                      id="image-upload-mcu"
                      type="file"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </fieldset>

              {/* Href */}
              <div>
                <label
                  htmlFor="href"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Link Halaman (Opsional)
                </label>
                <input
                  id="href"
                  type="text"
                  value={formData.href}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      href: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: /mcu/active-kartini"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                >
                  {submitting && (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Menyimpan...
                    </span>
                  )}
                  {!submitting && editingId && "Simpan Perubahan"}
                  {!submitting && !editingId && "Tambah Paket"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting || uploading}
                  className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Add Button */}
            <button
              onClick={() => setShowForm(true)}
              className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Tambah Paket
            </button>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <MCUPackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {packages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Belum ada paket MCU</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Buat Paket Pertama
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MCUAdmin;
