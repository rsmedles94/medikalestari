"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { AdminPageSkeleton } from "@/components/AdminSkeleton";
import {
  fetchAllHeroBannersForAdmin,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  uploadContentImage,
} from "@/lib/api";
import { HeroBanner } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";
import Image from "next/image";

type DeviceType = "desktop" | "mobile";

const INITIAL_FORM_DATA = {
  image_url: "",
  order: 0,
  is_active: true,
  device_type: "desktop" as DeviceType,
};

type BannerForm = typeof INITIAL_FORM_DATA;

const TABLE_HEADERS = ["Gambar", "Device", "Urutan", "Status", "Aksi"];

const DEVICE_OPTIONS: { value: DeviceType; label: string; size: string }[] = [
  { value: "desktop", label: "Desktop", size: "1900 x 780 px" },
  { value: "mobile", label: "Mobile", size: "220 x 2760 px" },
];

// Mengembalikan null jika gagal, agar data yang sudah tampil tidak tertimpa
const getBanners = async (): Promise<HeroBanner[] | null> => {
  try {
    return await fetchAllHeroBannersForAdmin();
  } catch (error) {
    console.error("Error fetching hero banners:", error);
    alert("Gagal memuat data banner");
    return null;
  }
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const { message } = error as { message?: string };
    return message || JSON.stringify(error);
  }
  return String(error);
};

// Mengunci scroll di belakang modal, hanya isi modal yang bisa di-scroll
const useScrollLock = (
  isLocked: boolean,
  modalRef: React.RefObject<HTMLDivElement | null>,
) => {
  useEffect(() => {
    const modal = modalRef.current;
    if (!isLocked || !modal) return;

    // Kunci html, body, dan semua container pembungkus yang bisa di-scroll
    const lockedElements = [document.documentElement, document.body];
    let parent = modal.parentElement;
    while (parent) {
      const { overflowY } = getComputedStyle(parent);
      if (overflowY === "auto" || overflowY === "scroll") {
        lockedElements.push(parent);
      }
      parent = parent.parentElement;
    }

    const previousOverflows = lockedElements.map(
      (element) => element.style.overflowY,
    );
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      globalThis.innerWidth - document.documentElement.clientWidth;

    for (const element of lockedElements) {
      element.style.overflowY = "hidden";
    }
    // Mengganti lebar scrollbar yang hilang agar tampilan tidak bergeser
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Blokir scroll mouse dan sentuhan di luar modal
    const handleScroll = (event: Event) => {
      // Mencegah library smooth scroll ikut menggeser halaman
      event.stopPropagation();
      if (!modal.contains(event.target as Node)) {
        event.preventDefault();
      }
    };
    const options = { capture: true, passive: false };
    globalThis.addEventListener("wheel", handleScroll, options);
    globalThis.addEventListener("touchmove", handleScroll, options);

    return () => {
      globalThis.removeEventListener("wheel", handleScroll, options);
      globalThis.removeEventListener("touchmove", handleScroll, options);
      lockedElements.forEach((element, index) => {
        element.style.overflowY = previousOverflows[index];
      });
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isLocked, modalRef]);
};

const AdminHeroBannersPage = () => {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  useScrollLock(showModal, modalRef);

  const applyBanners = useCallback((data: HeroBanner[] | null) => {
    if (data) setBanners(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    let ignore = false;

    void getBanners().then((data) => {
      if (!ignore) applyBanners(data);
    });

    return () => {
      ignore = true;
    };
  }, [authLoading, isAuthenticated, router, applyBanners]);

  const refreshBanners = async () => {
    applyBanners(await getBanners());
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const updateField = <K extends keyof BannerForm>(
    field: K,
    value: BannerForm[K],
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setUploading(false);
    };
    reader.onerror = () => {
      setUploading(false);
      alert("Gagal membaca file gambar");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imageUrl = imageFile
        ? await uploadContentImage(imageFile, "hero-banners")
        : formData.image_url;

      if (!imageUrl) {
        alert("Gambar harus dipilih");
        return;
      }

      const bannerData = { ...formData, image_url: imageUrl };

      if (editingId) {
        await updateHeroBanner(editingId, bannerData);
      } else {
        await createHeroBanner(bannerData);
      }

      // Muat ulang data dulu sebelum form direset
      await refreshBanners();

      closeModal();
      alert("Banner berhasil disimpan!");
    } catch (error) {
      console.error("Error saving banner:", error);
      alert(`Error: ${getErrorMessage(error)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (banner: HeroBanner) => {
    setEditingId(banner.id);
    setFormData({
      image_url: banner.image_url,
      order: banner.order,
      is_active: banner.is_active,
      device_type: banner.device_type,
    });
    setImagePreview(banner.image_url);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;

    try {
      await deleteHeroBanner(id);
      void refreshBanners();
      alert("Banner berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert(`Error: ${getErrorMessage(error)}`);
    }
  };

  const isBusy = submitting || uploading;
  const submitLabel = editingId ? "Perbarui Banner" : "Tambah Banner";

  if (loading) {
    return <AdminPageSkeleton title="Hero Banner" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Kelola Hero Banner
          </h1>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Tambah Banner
          </button>
        </div>

        {/* Banners List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {banner.image_url && (
                        <div className="w-20 h-12 relative rounded-lg overflow-hidden">
                          <Image
                            src={banner.image_url}
                            alt="Banner"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          banner.device_type === "desktop"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {banner.device_type === "desktop"
                          ? "Desktop (1900x720)"
                          : "Mobile (220x2760)"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {banner.order}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          banner.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {banner.is_active ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(banner)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(banner.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain"
          >
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Banner" : "Tambah Banner Baru"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={(e) => void handleSubmit(e)}
              className="p-6 space-y-4"
            >
              {/* Image Upload */}
              <div>
                <label
                  htmlFor="banner-image"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gambar Banner
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {imagePreview ? (
                    <div>
                      <div className="relative w-full h-40 mx-auto">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      {uploading && (
                        <p className="text-center text-blue-600 text-sm mt-2">
                          ⏳ Loading preview...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload
                        className="mx-auto text-gray-400 mb-2"
                        size={32}
                      />
                      <p className="text-gray-600 text-sm">
                        Klik untuk upload gambar banner
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    id="banner-image"
                    disabled={uploading}
                  />
                  <label htmlFor="banner-image" className="cursor-pointer">
                    <div className="mt-2 text-center text-sm text-blue-600 hover:text-blue-700">
                      {uploading ? "Loading..." : "Pilih Gambar"}
                    </div>
                  </label>
                </div>
              </div>

              {/* Order */}
              <div>
                <label
                  htmlFor="order"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Urutan Tampilan
                </label>
                <input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    updateField(
                      "order",
                      Number.parseInt(e.target.value, 10) || 0,
                    )
                  }
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Device Type */}
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Perangkat
                </legend>
                <div className="grid grid-cols-2 gap-4">
                  {DEVICE_OPTIONS.map(({ value, label, size }) => (
                    <label
                      key={value}
                      htmlFor={`device-${value}`}
                      className="flex items-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        id={`device-${value}`}
                        type="radio"
                        name="device_type"
                        value={value}
                        checked={formData.device_type === value}
                        onChange={() => updateField("device_type", value)}
                        className="w-4 h-4 text-blue-600"
                        aria-label={`${label} - ${size}`}
                      />
                      <span className="ml-2">
                        <span className="font-medium">{label}</span>
                        <span className="block text-xs text-gray-500">
                          {size}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => updateField("is_active", e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Aktif (akan ditampilkan di halaman utama)
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isBusy}
                className={`w-full py-3 rounded-lg transition-colors font-semibold mt-6 ${
                  isBusy
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {submitting ? "⏳ Sedang menyimpan..." : submitLabel}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroBannersPage;
