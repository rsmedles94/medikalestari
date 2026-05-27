"use client";
import React, { useState, useEffect } from "react";
import { AdminPageSkeleton } from "@/components/AdminSkeleton";
import {
  uploadRoomImage,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  fetchRoomTypes,
} from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const ROOM_OPTIONS = [
  "Kamar VIP Gold",
  "Kamar VIP Silver",
  "Kamar Kelas 1",
  "Kamar Kelas 2",
  "Kamar Kelas 3",
  "Kamar ICU",
  "Kamar NICU",
  "Kamar HCU",
];

interface RoomImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface RoomWithFacilities {
  id: string;
  name: string;
  price: string;
  image_url: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  facilities: string[];
  room_images?: RoomImage[];
}

const AdminRoomsPage = () => {
  const [rooms, setRooms] = useState<RoomWithFacilities[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [facilityInput, setFacilityInput] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image_url: "",
    description: "",
    display_order: 0,
    facilities: [] as string[],
    room_images: [] as RoomImage[],
  });
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();

  // Fetch rooms helper (hoisted so it can be used in effects)
  const fetchRooms = async () => {
    try {
      const data = await fetchRoomTypes();
      setRooms((data as RoomWithFacilities[]) || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
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
      await fetchRooms();
    };
    init();
    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated, router]);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentCount = formData.room_images.length;
    if (currentCount >= 5) {
      alert("Maksimal 5 gambar per kamar");
      return;
    }

    Array.from(files).forEach((file, index) => {
      if (currentCount + index >= 5) return;

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const imageUrl = await uploadRoomImage(file);
          setFormData((prev) => ({
            ...prev,
            room_images: [
              ...prev.room_images,
              {
                id: `temp-${Date.now()}-${index}`,
                image_url: imageUrl,
                display_order: prev.room_images.length + index,
              },
            ],
          }));
        } catch (error) {
          console.error("Error uploading image:", error);
          let errorMessage = "Unknown error occurred";

          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (error && typeof error === "object") {
            const err = error as Record<string, unknown>;
            errorMessage =
              (err.message as string) ||
              (err.error_description as string) ||
              JSON.stringify(error);
          } else {
            errorMessage = String(error);
          }

          alert(`Gagal upload gambar: ${errorMessage}`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      room_images: prev.room_images
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, display_order: i })),
    }));
  };

  const handleMoveImage = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= formData.room_images.length) return;

    const newImages = [...formData.room_images];
    [newImages[fromIndex], newImages[toIndex]] = [
      newImages[toIndex],
      newImages[fromIndex],
    ];

    newImages.forEach((img, i) => {
      img.display_order = i;
    });

    setFormData((prev) => ({
      ...prev,
      room_images: newImages,
    }));
  };

  const handleAddFacility = () => {
    if (facilityInput.trim()) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityInput.trim()],
      });
      setFacilityInput("");
    }
  };

  const handleRemoveFacility = (index: number) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      alert("Nama kamar harus dipilih");
      return;
    }
    if (!formData.price.trim()) {
      alert("Harga harus diisi");
      return;
    }
    if (formData.room_images.length === 0 && !formData.image_url.trim()) {
      alert(
        "Gambar harus diisi (upload minimal 1 gambar atau isi gambar utama)",
      );
      return;
    }
    if (!formData.description.trim()) {
      alert("Deskripsi harus diisi");
      return;
    }
    if (
      formData.display_order === null ||
      formData.display_order === undefined ||
      formData.display_order < 0
    ) {
      alert("Urutan tampilan harus diisi dengan angka positif");
      return;
    }

    try {
      // Use first room_images as primary image_url if available
      const primaryImageUrl =
        formData.room_images[0]?.image_url || formData.image_url;

      const roomData = {
        name: formData.name,
        price: formData.price,
        image_url: primaryImageUrl,
        description: formData.description,
        display_order: formData.display_order,
        facilities: formData.facilities,
        room_images: formData.room_images,
      };

      if (editingId) {
        await updateRoomType(editingId, roomData);
      } else {
        await createRoomType(roomData);
      }

      resetForm();
      fetchRooms();
      setShowModal(false);
    } catch (error) {
      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === "object") {
        // Handle Supabase error objects
        const err = error as Record<string, unknown>;
        errorMessage =
          (err.message as string) ||
          (err.error_description as string) ||
          JSON.stringify(error);
      } else {
        errorMessage = String(error);
      }

      alert(`Error: ${errorMessage}`);
    }
  };

  const handleEdit = (room: RoomWithFacilities) => {
    setEditingId(room.id);
    setFormData({
      name: room.name,
      price: room.price,
      image_url: room.image_url,
      description: room.description,
      display_order: room.display_order,
      facilities: room.facilities || [],
      room_images: room.room_images || [],
    });
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kamar ini?")) {
      try {
        await deleteRoomType(id);
        await fetchRooms();
      } catch (error) {
        let errorMessage = "Unknown error occurred";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === "object") {
          const err = error as Record<string, unknown>;
          errorMessage =
            (err.message as string) ||
            (err.error_description as string) ||
            JSON.stringify(error);
        } else {
          errorMessage = String(error);
        }

        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      image_url: "",
      description: "",
      display_order: 0,
      facilities: [],
      room_images: [],
    });
    setCurrentImageIndex(0);
    setFacilityInput("");
  };

  if (loading) {
    return <AdminPageSkeleton title="Kelola Kamar Perawatan" />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans">
      <div className="max-w-[1220px] mx-auto px-6 md:px-12 py-12">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-[40px] font-medium">Kelola Kamar Perawatan</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} /> Tambah Kamar
          </button>
        </header>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative w-full h-48 bg-gray-200">
                <Image
                  src={room.image_url}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-[#015A85] mb-2">
                  {room.name}
                </h3>
                <p className="text-[#4CAF50] font-semibold mb-1">
                  {room.price}
                </p>
                <p className="text-sm text-gray-600 mb-3">{room.description}</p>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Fasilitas:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {room.facilities.map((facility, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#015A85] rounded-full"></span>
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">
                  {editingId ? "Edit Kamar" : "Tambah Kamar Baru"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Nama Kamar - Dropdown */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nama Kamar
                  </label>
                  <select
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Nama Kamar</option>
                    {ROOM_OPTIONS.map((room) => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Harga */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Harga
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Contoh: Rp4.200.000"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Deskripsi kamar..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Urutan */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Gambar - Carousel */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Gambar Kamar (Max 5 Gambar)
                  </label>
                  <div className="mb-4">
                    {formData.room_images.length > 0 ? (
                      <div>
                        {/* Carousel Display */}
                        <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden bg-gray-200">
                          <Image
                            src={
                              formData.room_images[currentImageIndex].image_url
                            }
                            alt={`Room image ${currentImageIndex + 1}`}
                            fill
                            className="object-cover"
                          />
                          {formData.room_images.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setCurrentImageIndex(
                                    (prev) =>
                                      (prev - 1 + formData.room_images.length) %
                                      formData.room_images.length,
                                  )
                                }
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded"
                              >
                                <ChevronLeft size={20} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setCurrentImageIndex(
                                    (prev) =>
                                      (prev + 1) % formData.room_images.length,
                                  )
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded"
                              >
                                <ChevronRight size={20} />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Indicators */}
                        {formData.room_images.length > 1 && (
                          <div className="flex justify-center gap-2 mb-3">
                            {formData.room_images.map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition ${
                                  index === currentImageIndex
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Image List */}
                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                          {formData.room_images.map((img, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-100 rounded"
                            >
                              <span className="text-sm text-gray-600">
                                Gambar {index + 1}
                              </span>
                              <div className="flex gap-1">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveImage(index, "up")}
                                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                  >
                                    ↑
                                  </button>
                                )}
                                {index < formData.room_images.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleMoveImage(index, "down")
                                    }
                                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                  >
                                    ↓
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-3">
                        Belum ada gambar, mulai dengan upload gambar
                      </p>
                    )}

                    {formData.room_images.length < 5 && (
                      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-200 transition">
                        <Upload size={20} />
                        Tambah Gambar ({formData.room_images.length}/5)
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAddImages}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Fasilitas */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Fasilitas
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={facilityInput}
                      onChange={(e) => setFacilityInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddFacility();
                        }
                      }}
                      placeholder="Tambah fasilitas..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddFacility}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Tambah
                    </button>
                  </div>

                  {/* Daftar Fasilitas */}
                  <div className="space-y-2">
                    {formData.facilities.map((facility, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-lg"
                      >
                        <span>{facility}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFacility(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    {editingId ? "Update Kamar" : "Tambah Kamar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Batal
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

export default AdminRoomsPage;
