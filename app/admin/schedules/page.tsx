"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { AdminPageSkeleton } from "@/components/AdminSkeleton";
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  fetchDoctors,
  updateDoctor,
} from "@/lib/api";
import { Doctor, Schedule } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Plus, Edit2, Trash2, X } from "lucide-react";

const DAYS_OF_WEEK = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const TABLE_HEADERS = [
  "Nama Dokter",
  "Hari",
  "Jam Mulai",
  "Jam Selesai",
  "Status",
  "Status Dokter",
  "Aksi",
];

const INITIAL_FORM_DATA = {
  doctor_id: "",
  day_of_week: "",
  start_time: "",
  end_time: "",
  is_available: true,
};

type ScheduleForm = typeof INITIAL_FORM_DATA;

// Bernilai null jika gagal diambil, agar data yang sudah tampil tidak tertimpa
type PageData = {
  doctors: Doctor[] | null;
  schedules: Schedule[] | null;
};

const getPageData = async (): Promise<PageData> => {
  const result: PageData = { doctors: null, schedules: null };

  try {
    result.doctors = await fetchDoctors();

    const { data, error } = await supabase.from("schedules").select("*");
    if (error) throw error;
    result.schedules = data || [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return result;
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

const AdminSchedulesPage = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  // Dipisah dari formData karena disimpan ke tabel doctors, bukan schedules
  const [doctorStatus, setDoctorStatus] = useState<string>("hadir");
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  useScrollLock(showModal, modalRef);

  const applyPageData = useCallback((data: PageData) => {
    if (data.doctors) setDoctors(data.doctors);
    if (data.schedules) setSchedules(data.schedules);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    let ignore = false;

    void getPageData().then((data) => {
      if (!ignore) applyPageData(data);
    });

    return () => {
      ignore = true;
    };
  }, [authLoading, isAuthenticated, router, applyPageData]);

  const refreshData = async () => {
    applyPageData(await getPageData());
  };

  const getDoctorStatus = (doctorId: string) => {
    return doctors.find((d) => d.id === doctorId)?.status || "hadir";
  };

  const handleDoctorChange = (doctorId: string) => {
    updateField("doctor_id", doctorId);
    setDoctorStatus(getDoctorStatus(doctorId));
  };

  const saveDoctorStatus = async () => {
    const doctor = doctors.find((d) => d.id === formData.doctor_id);
    if (!doctor || doctorStatus === getDoctorStatus(doctor.id)) return;

    const { id, ...doctorData } = doctor;
    const status = doctorStatus as "hadir" | "cuti";
    await updateDoctor(id, { ...doctorData, status });
    setDoctors((previous) =>
      previous.map((d) => (d.id === id ? { ...d, status } : d)),
    );
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setDoctorStatus("hadir");
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

  const updateField = <K extends keyof ScheduleForm>(
    field: K,
    value: ScheduleForm[K],
  ) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Status disimpan lebih dulu agar jadwal tidak dobel jika langkah ini gagal
      await saveDoctorStatus();

      if (editingId) {
        await updateSchedule(editingId, formData);
      } else {
        await createSchedule(formData);
      }

      closeModal();
      void refreshData();
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Terjadi kesalahan saat menyimpan jadwal");
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setFormData({
      doctor_id: schedule.doctor_id,
      day_of_week: schedule.day_of_week,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      is_available: schedule.is_available,
    });
    setDoctorStatus(getDoctorStatus(schedule.doctor_id));
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) return;

    try {
      await deleteSchedule(id);
      void refreshData();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("Terjadi kesalahan saat menghapus jadwal");
    }
  };

  const getDoctorName = (doctorId: string) => {
    return doctors.find((d) => d.id === doctorId)?.name || "Unknown";
  };

  if (loading) {
    return <AdminPageSkeleton title="Kelola Jadwal Dokter" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Kelola Jadwal Dokter
          </h1>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={20} />
            Tambah Jadwal
          </button>
        </div>

        {/* Schedules List */}
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
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {getDoctorName(schedule.doctor_id)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {schedule.day_of_week}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {schedule.start_time}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {schedule.end_time}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          schedule.is_available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {schedule.is_available ? "Tersedia" : "Tidak Tersedia"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getDoctorStatus(schedule.doctor_id) === "cuti"
                            ? "bg-red-100 text-red-700 italic"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {getDoctorStatus(schedule.doctor_id) === "cuti"
                          ? "cuti"
                          : "Hadir"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(schedule)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(schedule.id)}
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
            className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain"
          >
            <div className="flex justify-between items-center p-6 border-b sticky top-0 z-10 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Jadwal" : "Tambah Jadwal Baru"}
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
              {/* Doctor Select */}
              <div>
                <label
                  htmlFor="doctor"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Pilih Dokter
                </label>
                <select
                  id="doctor"
                  value={formData.doctor_id}
                  onChange={(e) => handleDoctorChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">-- Pilih Dokter --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status Dokter
                </label>
                <select
                  id="status"
                  value={doctorStatus}
                  onChange={(e) => setDoctorStatus(e.target.value)}
                  disabled={!formData.doctor_id}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="hadir">Hadir</option>
                  <option value="cuti">cuti</option>
                </select>
              </div>

              {/* Day Select */}
              <div>
                <label
                  htmlFor="day"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hari
                </label>
                <select
                  id="day"
                  value={formData.day_of_week}
                  onChange={(e) => updateField("day_of_week", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">-- Pilih Hari --</option>
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Jam Mulai
                </label>
                <input
                  id="startTime"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => updateField("start_time", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Jam Selesai
                </label>
                <input
                  id="endTime"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => updateField("end_time", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3">
                <input
                  id="available"
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) =>
                    updateField("is_available", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                />
                <label
                  htmlFor="available"
                  className="text-sm font-medium text-gray-700"
                >
                  Tersedia
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold mt-6"
              >
                {editingId ? "Perbarui Jadwal" : "Tambah Jadwal"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchedulesPage;
