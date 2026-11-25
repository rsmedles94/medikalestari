"use client";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { AdminPageSkeleton } from "@/components/AdminSkeleton";
import {
  uploadDoctorImage,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "@/lib/api";
import { Doctor } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";
import Image from "next/image";

const INITIAL_FORM_DATA = {
  name: "",
  specialty: "",
  image_url: "",
  phone: "",
  email: "",
  // Diubah di halaman jadwal, di sini hanya dipertahankan saat menyimpan
  status: "hadir",
};

const SPECIALTIES = [
  "Spesialis Penyakit Dalam",
  "Spesialis Bedah Umum",
  "Spesialis Saraf",
  "Spesialis Orthopedi",
  "Spesialis Paru",
  "Spesialis Jantung & Pembuluh Darah",
  "Spesialis THT",
  "Spesialis Anak",
  "Spesialis Mata",
  "Spesialis Obgyn",
  "Spesialis Gigi",
  "Spesialis Fisioterapi",
];

const TABLE_HEADERS = ["Foto", "Nama", "Spesialisasi", "Aksi"];

// Mengembalikan null jika gagal, agar data yang sudah tampil tidak tertimpa
const getDoctors = async (): Promise<Doctor[] | null> => {
  try {
    const { data, error } = await supabase.from("doctors").select("*");
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return null;
  }
};

const getErrorMessage = (error: unknown): string =>
  (error as Error | undefined)?.message ||
  String(error) ||
  "Terjadi kesalahan saat menyimpan data";

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

const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();

  const modalRef = useRef<HTMLDivElement>(null);

  useScrollLock(showModal, modalRef);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    let ignore = false;

    void getDoctors().then((data) => {
      if (ignore) return;
      if (data) setDoctors(data);
      setLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [authLoading, isAuthenticated, router]);

  const refreshDoctors = async () => {
    const data = await getDoctors();
    if (data) setDoctors(data);
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

  const updateField = (field: keyof typeof INITIAL_FORM_DATA, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const imageUrl = imageFile
        ? await uploadDoctorImage(imageFile)
        : formData.image_url;

      const doctorData = {
        ...formData,
        image_url: imageUrl,
        // ensure status typed to allowed union
        status: formData.status as "hadir" | "cuti",
      };

      if (editingId) {
        await updateDoctor(editingId, doctorData);
      } else {
        await createDoctor(doctorData);
      }

      closeModal();
      void refreshDoctors();
    } catch (error) {
      console.error("Error saving doctor:", error);
      alert(getErrorMessage(error));
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingId(doctor.id);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      image_url: doctor.image_url,
      phone: doctor.phone || "",
      email: doctor.email || "",
      status: doctor.status || "hadir",
    });
    setImagePreview(doctor.image_url);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dokter ini?")) return;

    try {
      await deleteDoctor(id);
      void refreshDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  if (loading) {
    return <AdminPageSkeleton title="Kelola Dokter" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Kelola Dokter</h1>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:[#003f88] transition-colors cursor-pointer"
          >
            <Plus size={20} />
            Tambah Dokter
          </button>
        </div>

        {/* Doctors List */}
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
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {doctor.image_url && (
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                          <Image
                            src={doctor.image_url}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {doctor.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {doctor.specialty}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(doctor)}
                        className="p-2 text-[#003f88] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(doctor.id)}
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
            className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto overscroll-contain"
          >
            <div className="flex justify-between items-center p-6 border-b sticky top-0 z-10 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Dokter" : "Tambah Dokter Baru"}
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
                  htmlFor="doctor-image"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Foto Dokter
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {imagePreview ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload
                        className="mx-auto text-gray-400 mb-2"
                        size={32}
                      />
                      <p className="text-gray-600 text-sm">
                        Klik untuk upload foto
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    id="doctor-image"
                  />
                  <label htmlFor="doctor-image" className="cursor-pointer">
                    <div className="mt-2 text-center text-sm text-[#003f88] hover:text-[#003f88]">
                      Pilih Foto
                    </div>
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nama Dokter
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="dr. Nama Dokter"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f88] outline-none"
                  required
                />
              </div>

              {/* Specialty */}
              <div>
                <label
                  htmlFor="specialty"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Spesialisasi
                </label>
                <select
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => updateField("specialty", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f88] outline-none"
                  required
                >
                  <option value="">Pilih Spesialisasi</option>
                  {SPECIALTIES.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold mt-6"
              >
                {editingId ? "Perbarui Dokter" : "Tambah Dokter"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctorsPage;