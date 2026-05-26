"use client";
import React, { useState, useEffect } from "react";
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

const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    bio: "",
    image_url: "",
    phone: "",
    email: "",
    status: "hadir",
  });
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!mounted) return;
      if (authLoading) return;
      if (!isAuthenticated) {
        router.push("/admin/login");
        return;
      }
      fetchDoctors();
    };
    init();
    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated, router]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase.from("doctors").select("*");
      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

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

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadDoctorImage(imageFile);
      }

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

      resetForm();
      fetchDoctors();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving doctor:", error);
      const message =
        (error && (error as Error).message) ||
        String(error) ||
        "Terjadi kesalahan saat menyimpan data";
      alert(message);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingId(doctor.id);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      bio: doctor.bio,
      image_url: doctor.image_url,
      phone: doctor.phone || "",
      email: doctor.email || "",
      status: doctor.status || "hadir",
    });
    setImagePreview(doctor.image_url);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokter ini?")) {
      try {
        await deleteDoctor(id);
        fetchDoctors();
      } catch (error) {
        console.error("Error deleting doctor:", error);
        alert("Terjadi kesalahan saat menghapus data");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      specialty: "",
      bio: "",
      image_url: "",
      phone: "",
      email: "",
      status: "hadir",
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
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
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Foto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Spesialisasi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
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
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          doctor.status === "cuti"
                            ? "bg-red-100 text-red-700 italic"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {doctor.status === "cuti" ? "Cuti" : "Hadir"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="p-2 text-[#003f88] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Dokter" : "Tambah Dokter Baru"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f88] outline-none"
                  required
                >
                  <option value="">Pilih Spesialisasi</option>
                  <option value="Spesialis Penyakit Dalam">
                    Spesialis Penyakit Dalam
                  </option>
                  <option value="Spesialis Bedah Umum">
                    Spesialis Bedah Umum
                  </option>
                  <option value="Spesialis Saraf">Spesialis Saraf</option>
                  <option value="Spesialis Orthopedi">
                    Spesialis Orthopedi
                  </option>
                  <option value="Spesialis Paru">Spesialis Paru</option>
                  <option value="Spesialis Jantung & Pembuluh Darah">
                    Spesialis Jantung & Pembuluh Darah
                  </option>
                  <option value="Spesialis THT">Spesialis THT</option>
                  <option value="Spesialis Anak">Spesialis Anak</option>
                  <option value="Spesialis Mata">Spesialis Mata</option>
                  <option value="Spesialis Obgyn">Spesialis Obgyn</option>
                  <option value="Spesialis Gigi">Spesialis Gigi</option>
                  <option value="Spesialis Fisioterapi">
                    Spesialis Fisioterapi
                  </option>
                </select>
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Biodata
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Deskripsi singkat dokter"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f88] outline-none"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status Dokter
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003f88] outline-none"
                >
                  <option value="hadir">Hadir</option>
                  <option value="cuti">Cuti</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#003f88] text-white py-3 rounded-lg hover:bg-[#003f88] transition-colors font-semibold mt-6"
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
