"use client";

import React, { useState, useEffect } from "react";
import { AdminPageSkeleton } from "@/components/AdminSkeleton";
import {
  fetchAllPopups,
  createPopup,
  updatePopup,
  deletePopup,
  uploadPopupImage,
  type Popup,
} from "@/lib/popup-api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Plus, Edit2, Trash2, Upload, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const AdminPopupPage = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    title: "", // Digunakan untuk menyimpan Link Href
    description: "", // Dikosongkan / Tetap dikirim string kosong agar logic API tidak rusak
    image_url: "",
    display_order: 1,
    is_active: true,
  });
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();

  const fetchPopupsData = async () => {
    try {
      const data = await fetchAllPopups();
      setPopups(data);
    } catch (error) {
      console.error("Error fetching popups:", error);
      setMessage({ type: "error", text: "Gagal memuat data popup" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!mounted) return;
      if (authLoading) return;
      if (!isAuthenticated) {
        router.push("/admin/login");
        return;
      }
      fetchPopupsData();
    };
    init();
    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingId && popups.length >= 3) {
      setMessage({
        type: "error",
        text: "Maksimal 3 popup yang dapat ditambahkan",
      });
      return;
    }

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadPopupImage(imageFile);
      }

      if (!imageUrl) {
        setMessage({
          type: "error",
          text: "Gambar popup tidak boleh kosong",
        });
        return;
      }

      const popupData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingId) {
        await updatePopup(editingId, popupData);
        setMessage({ type: "success", text: "Popup berhasil diperbarui" });
      } else {
        await createPopup(popupData);
        setMessage({ type: "success", text: "Popup berhasil ditambahkan" });
      }

      resetForm();
      fetchPopupsData();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving popup:", error);
      let errorMessage = "Terjadi kesalahan saat menyimpan data";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      setMessage({ type: "error", text: errorMessage });
    }
  };

  const handleEdit = (popup: Popup) => {
    setEditingId(popup.id);
    setFormData({
      title: popup.title || "",
      description: popup.description || "",
      image_url: popup.image_url,
      display_order: popup.display_order,
      is_active: popup.is_active,
    });
    setImagePreview(popup.image_url);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus popup ini?")) {
      try {
        await deletePopup(id);
        setMessage({ type: "success", text: "Popup berhasil dihapus" });
        fetchPopupsData();
      } catch (error) {
        console.error("Error deleting popup:", error);
        setMessage({ type: "error", text: "Terjadi kesalahan saat menghapus" });
      }
    }
  };

  const handleToggleActive = async (popup: Popup) => {
    try {
      await updatePopup(popup.id, { is_active: !popup.is_active });
      fetchPopupsData();
      setMessage({
        type: "success",
        text: popup.is_active ? "Popup dimatikan" : "Popup diaktifkan",
      });
    } catch (error) {
      console.error("Error toggling popup:", error);
      setMessage({ type: "error", text: "Terjadi kesalahan" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      display_order: 1,
      is_active: true,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
  };

  if (loading) {
    return <AdminPageSkeleton title="Kelola Popup" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Kelola Popup</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Tambah Popup
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-auto text-lg hover:opacity-70"
            >
              ✕
            </button>
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 font-medium">ℹ️ Maksimal 3 gambar.</p>
        </div>

        {/* POPUP LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popups.map((popup) => (
            <div
              key={popup.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                <Image
                  src={popup.image_url}
                  alt={popup.title || "Popup"}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-semibold">
                  #{popup.display_order}
                </div>
              </div>

              {/* CONTENT LIST */}
              <div className="p-4">
                {popup.title ? (
                  <p className="text-sm font-medium text-blue-600 bg-blue-50 p-2 rounded truncate mb-3">
                    🔗 {popup.title}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic mb-3">Tidak ada link navigasi</p>
                )}

                {/* STATUS */}
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      popup.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {popup.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(popup)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition text-sm font-medium ${
                      popup.is_active
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    {popup.is_active ? (
                      <>
                        <EyeOff size={16} />
                        Matikan
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        Aktifkan
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(popup)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(popup.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-medium"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {popups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Belum ada popup yang dibuat</p>
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Popup" : "Tambah Popup Baru"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* IMAGE UPLOAD */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Gambar Popup *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="imageInput"
                    />
                    <label htmlFor="imageInput" className="cursor-pointer block">
                      {imagePreview ? (
                        <div className="space-y-2">
                          <div className="relative w-full h-32 mx-auto">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <p className="text-sm text-blue-600">Klik untuk ubah gambar</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* NAVIGASI  */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Link Navigasi (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: /promo atau https://google.com"
                  />
                </div>

                {/* URUTAN TAMPIL */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Urutan Tampil *
                  </label>
                  <select
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>

                {/* STATUS */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm font-medium">Aktifkan popup</span>
                  </label>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    {editingId ? "Perbarui" : "Tambah"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPopupPage;