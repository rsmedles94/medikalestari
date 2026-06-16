"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  User,
  Stethoscope,
  CalendarDays,
  FilterIcon,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { fetchAllDoctorsWithSchedules } from "@/lib/api";
import { Doctor, Schedule } from "@/lib/types";

interface DoctorWithSchedules extends Doctor {
  schedules?: Schedule[];
}
import DoctorSkeleton from "./DoctorSkeleton";
import BookingForm from "./BookingForm";

export const SPECIALTY_CATEGORIES = [
  "Semua Spesialis",
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

const DAYS = [
  "Semua Hari",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
const ITEMS_PER_PAGE = 10;

// Cache untuk menyimpan data dokter yang sudah di-load
let cachedDoctors: DoctorWithSchedules[] | null = null;
let isDataLoading = false;

const DoctorSection = ({
  initialSearch = "",
  initialSpecialty = "",
  initialDay = "",
}: {
  initialSearch?: string;
  initialSpecialty?: string;
  initialDay?: string;
}) => {
  // --- STATES ---
  const [doctors, setDoctors] = useState<DoctorWithSchedules[]>(() => {
    // Gunakan cached data jika tersedia
    return cachedDoctors || [];
  });
  const [loading, setLoading] = useState(!cachedDoctors);
  const [isPaging, setIsPaging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorWithSchedules | null>(null);
  const [showMobileSpecialtyModal, setShowMobileSpecialtyModal] =
    useState(false);
  const [showMobileDayModal, setShowMobileDayModal] = useState(false);

  // Baca parameter dari URL menggunakan useSearchParams
  const searchParams = useSearchParams();
  const urlSpecialty = searchParams.get("specialty") || "";

  // Tentukan specialty awal dari URL atau dari props
  const finalInitialSpecialty =
    urlSpecialty || initialSpecialty || "Semua Spesialis";

  const [tempFilter, setTempFilter] = useState({
    name: initialSearch || "",
    specialty: finalInitialSpecialty,
    day: initialDay || "Semua Hari",
  });

  const [activeFilter, setActiveFilter] = useState({
    name: initialSearch || "",
    specialty: finalInitialSpecialty,
    day: initialDay || "Semua Hari",
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // --- HELPER FUNCTIONS ---
  const jumpToTop = useCallback(() => {
    if (sectionRef.current) {
      const yOffset = -150;
      const elementTop =
        sectionRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementTop + yOffset });
    }
  }, []);

  // --- LOGIC HELPER ---
  const getUniqueDoctors = useCallback((doctors: Doctor[]): Doctor[] => {
    const seen = new Set<string | number>();
    return doctors.filter((v) => {
      if (!v.id || seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
  }, []);

  // Fungsi untuk shuffle array (Fisher-Yates)
  const shuffleArray = useCallback((array: DoctorWithSchedules[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // --- HYDRATION & INITIAL SCROLL ---
  useEffect(() => {
    // Memastikan halaman mulai dari atas sebelum komponen tampil
    if (globalThis.window) {
      globalThis.window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  // --- AUTO APPLY FILTER WHEN URL SPECIALTY CHANGES ---
  useEffect(() => {
    if (urlSpecialty && urlSpecialty !== "Semua Spesialis") {
      Promise.resolve().then(() => {
        setActiveFilter((prev) => ({
          ...prev,
          specialty: urlSpecialty,
        }));
        setCurrentPage(1);
      });
    }
  }, [urlSpecialty]);

  // --- DATA LOADING ---
  useEffect(() => {
    const load = async () => {
      // Jika data sudah di-cache dan tidak sedang loading, skip
      if (cachedDoctors) {
        setDoctors(cachedDoctors);
        setLoading(false);
        return;
      }

      // Jika sedang loading, skip
      if (isDataLoading) return;

      try {
        isDataLoading = true;
        const data = await fetchAllDoctorsWithSchedules();
        if (data) {
          const uniqueData = getUniqueDoctors(data as DoctorWithSchedules[]);
          // Shuffle data untuk mendapatkan urutan random
          const shuffledData = shuffleArray(uniqueData);
          cachedDoctors = shuffledData;
          setDoctors(shuffledData);
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
      } finally {
        isDataLoading = false;
        // logic requestAnimationFrame agar state update tidak bentrok dengan paint browser
        requestAnimationFrame(() => {
          setLoading(false);
        });
      }
    };
    load();
  }, [getUniqueDoctors, shuffleArray]);

  // --- FILTER SYNC ---
  useEffect(() => {
    if (tempFilter.name === "" && activeFilter.name !== "") {
      setTimeout(() => {
        setActiveFilter((prev) => ({ ...prev, name: "" }));
        setCurrentPage(1);
      }, 0);
    }
  }, [tempFilter.name, activeFilter.name]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSpecialty =
        activeFilter.specialty === "Semua Spesialis" ||
        doc.specialty === activeFilter.specialty;
      const matchName =
        activeFilter.name === "" ||
        doc.name.toLowerCase().includes(activeFilter.name.toLowerCase());

      // Filter berdasarkan hari
      let matchDay = true;
      if (activeFilter.day !== "Semua Hari") {
        matchDay =
          doc.schedules && doc.schedules.length > 0
            ? doc.schedules.some(
                (schedule) => schedule.day_of_week === activeFilter.day,
              )
            : false;
      }

      return matchSpecialty && matchName && matchDay;
    });
  }, [doctors, activeFilter]);

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleApplyFilter = () => {
    setIsPaging(true);
    setActiveFilter(tempFilter);
    setCurrentPage(1);
    jumpToTop();
    setTimeout(() => setIsPaging(false), 400);
  };

  const handleSpecialtySelect = (specialty: string) => {
    setTempFilter((prev) => ({ ...prev, specialty }));
    setShowMobileSpecialtyModal(false);
  };

  const handleDaySelect = (day: string) => {
    setTempFilter((prev) => ({ ...prev, day }));
    setShowMobileDayModal(false);
  };

  const handleOpenSpecialtyModal = () => {
    setShowMobileSpecialtyModal(!showMobileSpecialtyModal);
    if (!showMobileSpecialtyModal) {
      setShowMobileDayModal(false);
    }
  };

  const handleOpenDayModal = () => {
    setShowMobileDayModal(!showMobileDayModal);
    if (!showMobileDayModal) {
      setShowMobileSpecialtyModal(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setIsPaging(true);
    setCurrentPage(newPage);
    jumpToTop();
    setTimeout(() => setIsPaging(false), 400);
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (loading || isPaging) {
      return (
        <motion.div
          key="skeleton-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {new Array(3).fill(null).map((_, i) => (
            <React.Fragment key={`skeleton-${i}-${loading ? "load" : "page"}`}>
              <DoctorSkeleton />
            </React.Fragment>
          ))}
        </motion.div>
      );
    }

    if (filteredDoctors.length > 0) {
      return (
        <motion.div
          key="list-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-6"
        >
          {paginatedDoctors.map((doctor, index) => (
            <div
              key={`doctor-${doctor.id || index}-${startIndex + index}`}
              className={`relative group flex flex-row items-start gap-4 md:gap-8 p-4 md:p-8 bg-white border border-slate-100 shadow-sm h-fit rounded-none transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-slate-100 ${
                doctor.status === "cuti" ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {doctor.status === "cuti" && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"></div>
              )}
              {/* Foto Dokter */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 shrink-0 rounded-full overflow-hidden border-4 border-slate-50 group-hover:border-blue-50 transition-colors shadow-sm bg-slate-100 flex items-center justify-center">
                {doctor.image_url ? (
                  <Image
                    src={doctor.image_url}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    priority={index < 3}
                    sizes="(max-width: 768px) 96px, 176px"
                  />
                ) : (
                  <svg
                    className="w-1/2 h-1/2 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>

              {/* Detail Dokter */}
              <div className="flex-1 text-left">
                <div className="mb-2 md:mb-4">
                  <h3 className="text-lg md:text-2xl font-bold text-slate-800 mt-0 md:mt-8">
                    {doctor.name}
                  </h3>
                  <p className="text-gray-400 font-semibold text-[10px] md:text-xs mb-1">
                    {doctor.specialty}
                  </p>
                </div>

                <div className="flex flex-wrap justify-start gap-2 md:gap-3">
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="px-4 py-2 md:px-8 md:py-3 bg-[#003f88] text-white text-[10px] md:text-[12px] font-bold rounded-full transition-all hover:bg-[#003f88]/90 active:scale-95 shadow-md shadow-blue-900/5 cursor-pointer"
                  >
                    Buat Janji Temu
                  </button>
                  <Link
                    href={`/dokter/${doctor.id}`}
                    className="px-4 py-2 md:px-8 md:py-3 bg-white text-slate-600 text-[10px] md:text-[12px] font-bold rounded-full border border-slate-200 transition-all hover:bg-[#e67e22] hover:text-white active:scale-95"
                  >
                    Lihat Profil
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2 md:mt-12 pt-8 mb-20 md:mb-0">
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-16 h-11 flex items-center justify-center text-slate-600 border border-slate-200 rounded-none hover:bg-slate-50 transition-all font-bold text-xs"
                >
                  ← PREV
                </button>
              )}

              <div className="flex flex-wrap justify-start gap-2 md:gap-3">
                {new Array(totalPages).fill(null).map((_, i) => (
                  <button
                    key={`page-${i + 1}`}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-11 h-11 flex items-center justify-center rounded-none font-bold text-xs transition-all ${
                      currentPage === i + 1
                        ? "bg-[#003f88] text-white border border-[#003f88]"
                        : "text-slate-500 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="w-16 h-11 flex items-center justify-center text-slate-600 border border-slate-200 rounded-none hover:bg-slate-50 transition-all font-bold text-xs"
                >
                  NEXT →
                </button>
              )}
            </div>
          )}
        </motion.div>
      );
    }

    return (
      <motion.div
        key="empty-view"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-96 bg-slate-50/50 rounded-none border border-dashed border-slate-200"
      >
        <Search size={40} className="text-slate-300 mb-4" />
        <h3 className="text-slate-500 font-normal">Dokter tidak ditemukan</h3>
      </motion.div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white min-h-screen text-slate-800 relative mb-20"
      id="dokter-spesialis"
    >
      {/* MODAL BOOKING */}
      <AnimatePresence>
        {selectedDoctor && (
          <BookingForm
            doctorName={selectedDoctor.name}
            specialty={selectedDoctor.specialty}
            onClose={() => setSelectedDoctor(null)}
            schedules={selectedDoctor.schedules ?? []}
          />
        )}
      </AnimatePresence>

      <div className="max-w-[1139px] w-full mx-auto px-4 py-8 md:py-8">
        {/* BREADCRUMB & TITLE SECTION */}
        <div className="pt-0 md:pt-9 pb-12">
          <nav className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-4">
            <Link
              href="/"
              className="text-black/60 hover:text-gray-300 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={12} className="text-black/60" />
            <span className="font-normal">Dokter Kami</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-black border-b border-slate-100 pb-6">
            Dokter Kami
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* MOBILE FILTER BAR */}
          <div className="lg:hidden w-full flex flex-col gap-4 ">
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 -mt-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Masukkan Nama Dokter"
                  value={tempFilter.name}
                  onChange={(e) => {
                    setTempFilter({ ...tempFilter, name: e.target.value });
                    // Auto-reset search ketika input kosong
                    if (e.target.value === "") {
                      setActiveFilter((prev) => ({ ...prev, name: "" }));
                      setCurrentPage(1);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleApplyFilter();
                    }
                  }}
                  inputMode="search"
                  enterKeyHint="search"
                  className="w-full border border-slate-200 h-11 pl-10 pr-4 outline-none focus:border-[#003f88] text-sm bg-white"
                />
              </div>
              {/* Specialty Icon Button */}
              <button
                onClick={handleOpenSpecialtyModal}
                className={`w-11 h-11 flex items-center justify-center border transition-all bg-white ${
                  showMobileSpecialtyModal
                    ? "border-[#003f88] bg-white"
                    : "border-slate-200"
                }`}
                title="Filter Spesialis"
              >
                <Stethoscope size={18} className="text-[#003f88]" />
              </button>

              {/* Day Icon Button */}
              <button
                onClick={handleOpenDayModal}
                className={`w-11 h-11 flex items-center justify-center border transition-all bg-white ${
                  showMobileDayModal
                    ? "border-[#003f88] bg-white"
                    : "border-slate-200 "
                }`}
                title="Filter Hari"
              >
                <CalendarDays size={18} className="text-[#003f88]" />
              </button>

              {/* Search Button */}
              <button
                onClick={() => {
                  handleApplyFilter();
                }}
                className="px-4 h-11 bg-[#003f88] text-white font-semibold hover:bg-[#003f88]/90 transition-all border border-[#003f88] text-base flex items-center justify-center rounded-lg"
              >
                Cari
              </button>
            </div>

            {/* Specialty Dropdown Modal */}
            <AnimatePresence>
              {showMobileSpecialtyModal && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full bg-white border border-slate-200 shadow-lg z-50 max-h-64 overflow-y-auto"
                >
                  <div className="p-2">
                    <div className="px-4 py-2 text-xs font-bold text-[#003f88] sticky top-0 bg-white">
                      Pilih Spesialis
                    </div>
                    {SPECIALTY_CATEGORIES.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpecialtySelect(s)}
                        className={`w-full text-left px-4 py-2 text-sm transition-all ${
                          tempFilter.specialty === s
                            ? "bg-[#003f88] text-white font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Day Dropdown Modal */}
            <AnimatePresence>
              {showMobileDayModal && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full bg-white border border-slate-200 shadow-lg z-50 overflow-y-auto"
                >
                  <div className="p-2">
                    <div className="px-4 py-2 text-xs font-bold text-[#003f88] bg-white">
                      Pilih Hari
                    </div>
                    {DAYS.map((d) => (
                      <button
                        key={d}
                        onClick={() => handleDaySelect(d)}
                        className={`w-full text-left px-4 py-2 text-sm transition-all whitespace-nowrap ${
                          tempFilter.day === d
                            ? "bg-[#003f88] text-white font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SIDEBAR FILTER - Desktop Only */}
          <aside className="hidden lg:block w-1/3 xl:w-1/4 lg:sticky lg:top-45 z-30">
            <div className="border border-slate-200 p-8 bg-white rounded-none shadow-sm h-fit">
              <div className="flex items-center gap-3 mb-8 text-[#003f88] border-b border-slate-50 pb-4">
                <FilterIcon size={18} />
                <span className="text-lg font-bold">Filter Pencarian</span>
              </div>

              {/* Input Nama */}
              <div className="mb-6">
                <label
                  htmlFor="doctor-name"
                  className="block text-sm font-bold text-[#003f88] mb-2"
                >
                  Nama Dokter
                </label>
                <div className="relative">
                  <User
                    className="absolute left-0 bottom-3 text-slate-400"
                    size={16}
                  />
                  <input
                    id="doctor-name"
                    type="text"
                    placeholder="Nama Dokter"
                    value={tempFilter.name}
                    onChange={(e) =>
                      setTempFilter({ ...tempFilter, name: e.target.value })
                    }
                    className="w-full border-b border-slate-200 py-2 pl-7 outline-none focus:border-[#003f88] text-sm bg-transparent rounded-none"
                  />
                </div>
              </div>

              {/* Select Spesialis */}
              <div className="mb-6">
                <label
                  htmlFor="specialty-select"
                  className="block text-sm font-bold text-[#003f88] mb-2"
                >
                  Spesialis
                </label>
                <div className="relative">
                  <Stethoscope
                    className="absolute left-0 bottom-3 text-slate-400"
                    size={16}
                  />
                  <select
                    id="specialty-select"
                    value={tempFilter.specialty}
                    onChange={(e) =>
                      setTempFilter({
                        ...tempFilter,
                        specialty: e.target.value,
                      })
                    }
                    className="w-full border-b border-slate-200 bg-transparent py-2 pl-7 outline-none cursor-pointer text-sm rounded-none appearance-none"
                  >
                    {SPECIALTY_CATEGORIES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pilih Hari */}
              <div className="mb-10">
                <label
                  htmlFor="day-select"
                  className="block text-sm font-bold text-[#003f88] mb-2"
                >
                  Pilih Hari
                </label>
                <div className="relative">
                  <CalendarDays
                    className="absolute left-0 bottom-3 text-slate-400"
                    size={16}
                  />
                  <select
                    id="day-select"
                    value={tempFilter.day}
                    onChange={(e) =>
                      setTempFilter({ ...tempFilter, day: e.target.value })
                    }
                    className="w-full border-b border-slate-200 bg-transparent py-2 pl-7 outline-none cursor-pointer text-sm rounded-none appearance-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleApplyFilter}
                className="w-full bg-[#003f88] text-white py-4 font-bold rounded-full cursor-pointer transition-all hover:bg-[#003f88]/90 active:scale-[0.98]"
              >
                Temukan Dokter
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="w-full lg:w-2/3 xl:w-3/4 relative z-20 min-h-150">
            <AnimatePresence mode="wait" initial={false}>
              {renderContent()}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;
