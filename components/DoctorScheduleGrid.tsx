"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { Doctor, Schedule } from "@/lib/types";
import { Search, Loader2, Stethoscope, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface DoctorWithSchedule extends Doctor {
  schedules: Schedule[];
}

interface DoctorScheduleGridProps {
  doctorsWithSchedules: DoctorWithSchedule[];
  loading?: boolean;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const ITEMS_PER_PAGE = 10;

// Fungsi untuk mendapatkan hari saat ini dalam Indonesian format
const getTodayDayName = (): string => {
  const dayIndex = new Date().getDay();
  // JavaScript getDay: 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  const dayMap = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  return dayMap[dayIndex];
};

// Fungsi untuk mendapatkan hari cuti berdasarkan hari saat ini
// Jika dokter cuti dan hari ini ada jadwal, tampilkan badge di hari ini
const getCutiDay = (doctor: DoctorWithSchedule): string | null => {
  if (
    doctor.status !== "cuti" ||
    !doctor.schedules ||
    doctor.schedules.length === 0
  ) {
    return null;
  }

  const todayDay = getTodayDayName();

  // Cek apakah hari ini memiliki jadwal
  const hasScheduleToday = doctor.schedules.some(
    (s) => s.day_of_week === todayDay,
  );

  // Jika ada jadwal hari ini, tampilkan badge di hari ini
  if (hasScheduleToday) {
    return todayDay;
  }

  // Jika tidak ada jadwal hari ini, tidak tampilkan badge
  return null;
};

export default function DoctorScheduleGrid({
  doctorsWithSchedules = [],
  loading = false,
}: Readonly<DoctorScheduleGridProps>) {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null,
  );
  const [selectedSpecialtyInput, setSelectedSpecialtyInput] = useState<
    string | null
  >(null);
  const [searchDoctor, setSearchDoctor] = useState("");
  const [searchDoctorInput, setSearchDoctorInput] = useState("");
  const [showMobileSpecialtyModal, setShowMobileSpecialtyModal] =
    useState(false);
  const [showMobileDayModal, setShowMobileDayModal] = useState(false);
  const [showDesktopDayModal, setShowDesktopDayModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedDayInput, setSelectedDayInput] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaging, setIsPaging] = useState(false);

  const specialties = useMemo(() => {
    if (!doctorsWithSchedules) return [];
    const specs = new Set(doctorsWithSchedules.map((doc) => doc.specialty));
    return Array.from(specs).sort((a, b) => a.localeCompare(b));
  }, [doctorsWithSchedules]);

  const filteredDoctors = useMemo(() => {
    if (!doctorsWithSchedules) return [];
    return doctorsWithSchedules
      .filter((doc) => {
        const matchesSpecialty =
          !selectedSpecialty || doc.specialty === selectedSpecialty;
        const matchesSearch = doc.name
          .toLowerCase()
          .includes(searchDoctor.toLowerCase());

        // Filter by day if selected
        let matchesDay = true;
        if (selectedDay && selectedDay !== "Semua Hari") {
          matchesDay =
            doc.schedules && doc.schedules.length > 0
              ? doc.schedules.some(
                  (schedule) => schedule.day_of_week === selectedDay,
                )
              : false;
        }

        return matchesSpecialty && matchesSearch && matchesDay;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [doctorsWithSchedules, selectedSpecialty, searchDoctor, selectedDay]);

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const jumpToTop = useCallback(() => {
    if (sectionRef.current) {
      const yOffset = -150;
      const elementTop =
        sectionRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementTop + yOffset });
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setIsPaging(true);
    setCurrentPage(newPage);
    jumpToTop();
    setTimeout(() => setIsPaging(false), 400);
  };

  const skeletonKeys = useMemo(
    () => Array.from({ length: 3 }).map((_, i) => `skeleton-${i}`),
    [],
  );

  const getScheduleForCell = (
    day: string,
    row: number,
    schedules: Schedule[] = [],
  ) => {
    const daySchedules = schedules
      .filter((s) => s.day_of_week === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    if (row === 1) return daySchedules.slice(0, 1);
    if (row === 2) return daySchedules.slice(1, 2);
    return [];
  };

  if (loading) {
    return (
      <div className="w-full min-h-96 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#003f88] mb-4" />
        <p className="text-slate-600">Memuat jadwal dokter...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6" ref={sectionRef}>
      {/* SEARCH & FILTER SECTION */}
      <div className="space-y-4">
        {/* MOBILE FILTER BAR */}
        <div className="lg:hidden w-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Masukkan Nama Dokter"
                value={searchDoctorInput}
                onChange={(e) => {
                  setSearchDoctorInput(e.target.value);
                  // Auto-reset search ketika input kosong
                  if (e.target.value === "") {
                    setSearchDoctor("");
                  }
                }}
                className="w-full border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-[#003f88] text-base bg-white"
              />
            </div>

            {/* Specialty Icon Button */}
            <button
              onClick={() =>
                setShowMobileSpecialtyModal(!showMobileSpecialtyModal)
              }
              className={`p-3 border transition-all ${
                showMobileSpecialtyModal
                  ? "border-[#003f88] bg-slate-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
              title="Filter Spesialis"
            >
              <Stethoscope size={24} className="text-[#003f88]" />
            </button>

            {/* Day Icon Button */}
            <button
              onClick={() => setShowMobileDayModal(!showMobileDayModal)}
              className={`p-3 border transition-all ${
                showMobileDayModal
                  ? "border-[#003f88] bg-slate-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
              title="Filter Hari"
            >
              <CalendarDays size={24} className="text-[#003f88]" />
            </button>

            {/* Search Button */}
            <button
              onClick={() => {
                setSelectedSpecialty(selectedSpecialtyInput);
                setSearchDoctor(searchDoctorInput);
                setSelectedDay(selectedDayInput);
              }}
              className="px-4 py-3 bg-[#003f88] text-white font-semibold hover:bg-[#003f88]/90 transition-all border border-[#003f88] text-sm"
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
                className="bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                <div className="p-2">
                  <div className="px-4 py-2 text-xs font-bold text-[#003f88] sticky top-0 bg-white">
                    Pilih Spesialis
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSpecialtyInput(null);
                      setSelectedSpecialty(null);
                      setShowMobileSpecialtyModal(false);
                      // Reset search ketika memilih "Semua Spesialis"
                      setSearchDoctor("");
                      setSearchDoctorInput("");
                    }}
                    className={`w-full text-left px-4 py-2 text-sm rounded-md transition-all ${
                      selectedSpecialtyInput === null
                        ? "bg-[#003f88]/10 text-[#003f88] font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Semua Spesialis
                  </button>
                  {specialties.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSpecialtyInput(s);
                        setShowMobileSpecialtyModal(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm rounded-md transition-all ${
                        selectedSpecialtyInput === s
                          ? "bg-[#003f88]/10 text-[#003f88] font-semibold"
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
                className="bg-white border border-slate-200 rounded-lg shadow-lg z-50"
              >
                <div className="p-2">
                  <div className="px-4 py-2 text-xs font-bold text-[#003f88] bg-white">
                    Pilih Hari
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDayInput(null);
                      setSelectedDay(null);
                      setShowMobileDayModal(false);
                      // Reset search ketika memilih "Semua Hari"
                      setSearchDoctor("");
                      setSearchDoctorInput("");
                    }}
                    className={`w-full text-left px-4 py-2 text-sm rounded-md transition-all whitespace-nowrap ${
                      selectedDayInput === null
                        ? "bg-[#003f88]/10 text-[#003f88] font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Semua Hari
                  </button>
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setSelectedDayInput(d);
                        setShowMobileDayModal(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm rounded-md transition-all whitespace-nowrap ${
                        selectedDayInput === d
                          ? "bg-[#003f88]/10 text-[#003f88] font-semibold"
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

        {/* DESKTOP SEARCH BAR - TWO COLUMN LAYOUT */}
        <div className="hidden lg:grid grid-cols-2 gap-4">
          {/* LEFT COLUMN - Specialty Dropdown */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Spesialis
            </label>
            <button
              onClick={() =>
                setShowMobileSpecialtyModal(!showMobileSpecialtyModal)
              }
              className="w-full px-4 py-3 border border-slate-200 text-left bg-white hover:bg-slate-50 transition-all focus:border-[#003f88] focus:outline-none text-sm flex items-center justify-between"
            >
              <span>{selectedSpecialtyInput || "Pilih Spesialis"}</span>
              <Stethoscope size={18} className="text-[#003f88] shrink-0" />
            </button>
            <AnimatePresence>
              {showMobileSpecialtyModal && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-lg z-50 mt-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedSpecialtyInput(null);
                        setSelectedSpecialty(null);
                        setShowMobileSpecialtyModal(false);
                        // Reset search ketika memilih "Semua Spesialis"
                        setSearchDoctor("");
                        setSearchDoctorInput("");
                      }}
                      className={`w-full text-left px-4 py-2 text-sm rounded-md transition-all ${
                        selectedSpecialtyInput === null
                          ? "bg-[#003f88]/10 text-[#003f88] font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Semua Spesialis
                    </button>
                    {specialties.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSelectedSpecialtyInput(s);
                          setShowMobileSpecialtyModal(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm rounded-md transition-all ${
                          selectedSpecialtyInput === s
                            ? "bg-[#003f88]/10 text-[#003f88] font-semibold"
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
          </div>

          {/* RIGHT COLUMN - Doctor Name Search + Day Icon + Button */}
          <div className="flex gap-2 items-end relative">
            <div className="flex-1 relative">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Nama Dokter
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Masukkan Nama Dokter"
                  value={searchDoctorInput}
                  onChange={(e) => {
                    setSearchDoctorInput(e.target.value);
                    // Auto-reset search ketika input kosong
                    if (e.target.value === "") {
                      setSearchDoctor("");
                    }
                  }}
                  className="w-full border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-[#003f88] text-sm bg-white"
                />
              </div>
            </div>

            {/* Day Icon Button */}
            <button
              onClick={() => setShowDesktopDayModal(!showDesktopDayModal)}
              className={`p-3 border transition-all ${
                showDesktopDayModal
                  ? "border-[#003f88] bg-slate-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
              title={
                selectedDayInput ? `Filter: ${selectedDayInput}` : "Filter Hari"
              }
            >
              <CalendarDays
                size={20}
                className="text-[#003f88]"
                strokeWidth={1.5}
              />
            </button>

            {/* Day Dropdown Modal */}
            <AnimatePresence>
              {showDesktopDayModal && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 bg-white border border-slate-200 shadow-lg z-50 mt-1 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedDayInput(null);
                        setSelectedDay(null);
                        setShowDesktopDayModal(false);
                        // Reset search ketika memilih "Semua Hari"
                        setSearchDoctor("");
                        setSearchDoctorInput("");
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-all whitespace-nowrap ${
                        selectedDayInput === null
                          ? "bg-[#003f88]/10 text-[#003f88] font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Semua Hari
                    </button>
                    {DAYS.map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setSelectedDayInput(d);
                          setShowDesktopDayModal(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-all whitespace-nowrap ${
                          selectedDayInput === d
                            ? "bg-[#003f88]/10 text-[#003f88] font-semibold"
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

            <button
              onClick={() => {
                setSelectedSpecialty(selectedSpecialtyInput);
                setSearchDoctor(searchDoctorInput);
                setSelectedDay(selectedDayInput);
              }}
              className="px-6 py-2.5 bg-[#003f88] text-white font-semibold hover:bg-[#003f88]/90 transition-all border border-[#003f88]"
            >
              Cari
            </button>
          </div>
        </div>
      </div>

      {/* GRID VIEW - DESKTOP */}
      {filteredDoctors.length > 0 && (
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <button
              key={doctor.id}
              onClick={() =>
                doctor.status !== "cuti" && router.push(`/dokter/${doctor.id}`)
              }
              onKeyDown={(e) => {
                if (
                  (e.key === "Enter" || e.key === " ") &&
                  doctor.status !== "cuti"
                ) {
                  router.push(`/dokter/${doctor.id}`);
                }
              }}
              disabled={doctor.status === "cuti"}
              className={`relative bg-white shadow-lg overflow-hidden border border-slate-200 text-left group ${
                doctor.status === "cuti"
                  ? "opacity-60 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
            >
              {/* Doctor Header */}
              <div className="bg-slate-50 p-4 border-b border-slate-200">
                <div className="flex gap-4 items-center">
                  {doctor.image_url && (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-slate-200">
                      <Image
                        src={doctor.image_url}
                        alt={doctor.name}
                        fill
                        sizes="56px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-normal">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Table */}
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#003f88]">
                      {DAYS.map((day, index) => {
                        const cutiDay = getCutiDay(doctor);
                        const isCutiDay = cutiDay === day;
                        const isFirstDay = index === 0;
                        const isLastDay = index === DAYS.length - 1;
                        return (
                          <th
                            key={day}
                            className={`py-2 px-1 font-semibold text-center text-white ${
                              isFirstDay
                                ? "border-l border-slate-200"
                                : "border-l border-white"
                            } ${isLastDay ? "border-r border-slate-200" : "border-r border-white"} ${
                              isCutiDay ? "bg-red-100 text-red-700" : ""
                            }`}
                          >
                            {day.substring(0, 3)}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {DAYS.map((day, index) => {
                        const cutiDay = getCutiDay(doctor);
                        const isCutiDay = cutiDay === day;
                        const schedule = getScheduleForCell(
                          day,
                          1,
                          doctor.schedules,
                        );
                        const isFirstDay = index === 0;
                        return (
                          <td
                            key={`${doctor.id}-${day}-1`}
                            className={`py-2 px-1 border-b border-r border-slate-200 text-center h-12 align-middle relative ${
                              isFirstDay ? "border-l border-slate-200" : ""
                            } ${
                              isCutiDay && schedule.length > 0
                                ? "bg-red-50"
                                : ""
                            }`}
                          >
                            {isCutiDay && schedule.length > 0 ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-2xl bg-red-500 rounded-full w-8 h-8 flex items-center justify-center">
                                  C
                                </span>
                              </div>
                            ) : (
                              <div className="relative z-10">
                                {schedule.length > 0 ? (
                                  <div className="text-[10px] font-medium text-slate-700 whitespace-normal">
                                    {schedule[0].start_time.substring(0, 5)}
                                  </div>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      {DAYS.map((day, index) => {
                        const cutiDay = getCutiDay(doctor);
                        const isCutiDay = cutiDay === day;
                        const schedule = getScheduleForCell(
                          day,
                          2,
                          doctor.schedules,
                        );
                        const isFirstDay = index === 0;
                        return (
                          <td
                            key={`${doctor.id}-${day}-2`}
                            className={`py-2 px-1 border-b border-r border-slate-200 text-center h-12 align-middle relative ${
                              isFirstDay ? "border-l border-slate-200" : ""
                            } ${
                              isCutiDay && schedule.length > 0
                                ? "bg-red-50"
                                : ""
                            }`}
                          >
                            {isCutiDay && schedule.length > 0 ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-bold text-2xl bg-red-500 rounded-full w-8 h-8 flex items-center justify-center">
                                  C
                                </span>
                              </div>
                            ) : (
                              <div className="relative z-10">
                                {schedule.length > 0 ? (
                                  <div className="text-[10px] font-medium text-slate-700 whitespace-normal">
                                    {schedule[0].start_time.substring(0, 5)}
                                  </div>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* TABLE VIEW - MOBILE/TABLET */}
      {filteredDoctors.length > 0 && (
        <div className="lg:hidden flex flex-col gap-6">
          {isPaging ? (
            // Skeleton loading saat pagination
            <motion.div
              key="skeleton-mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={skeletonKeys[i]}
                  className="bg-white border border-slate-200 shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="p-4 flex items-center gap-4 bg-slate-50/50">
                    <div className="relative w-14 h-14 rounded-full bg-slate-300" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-300 rounded mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="border-t border-slate-100 p-4 h-16 bg-slate-50" />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="mobile-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {paginatedDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() =>
                    doctor.status !== "cuti" &&
                    router.push(`/dokter/${doctor.id}`)
                  }
                  onKeyDown={(e) => {
                    if (
                      (e.key === "Enter" || e.key === " ") &&
                      doctor.status !== "cuti"
                    ) {
                      router.push(`/dokter/${doctor.id}`);
                    }
                  }}
                  disabled={doctor.status === "cuti"}
                  className={`relative bg-white border border-slate-200 shadow-sm overflow-hidden text-left ${
                    doctor.status === "cuti"
                      ? "opacity-60 cursor-not-allowed pointer-events-none"
                      : "cursor-pointer"
                  }`}
                >
                  {/* Bagian Atas: Profil Dokter */}
                  <div className="p-4 flex items-center gap-4 bg-slate-50/50">
                    {doctor.image_url && (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md bg-slate-200">
                        <Image
                          src={doctor.image_url}
                          alt={doctor.name}
                          fill
                          className="object-cover transition-transform duration-500 ease-out hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 leading-tight">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-400 font-normal mt-0.5">
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Bagian Bawah: Tabel Jadwal Ringkas */}
                  <div className="border-t border-slate-100">
                    <table className="w-full table-fixed border-collapse">
                      <thead>
                        <tr className="bg-[#003f88]">
                          {DAYS.map((day) => {
                            const cutiDay = getCutiDay(doctor);
                            const isCutiDay = cutiDay === day;
                            return (
                              <th
                                key={day}
                                className={`py-2 px-0.5 text-center text-[10px] font-bold uppercase border-r border-slate-100 last:border-0 text-white ${
                                  isCutiDay ? "bg-red-100 text-red-700" : ""
                                }`}
                              >
                                {day.substring(0, 3)}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {DAYS.map((day) => {
                            const cutiDay = getCutiDay(doctor);
                            const isCutiDay = cutiDay === day;
                            const s1 = getScheduleForCell(
                              day,
                              1,
                              doctor.schedules,
                            );
                            const s2 = getScheduleForCell(
                              day,
                              2,
                              doctor.schedules,
                            );
                            const isAvailable = s1.length > 0 || s2.length > 0;

                            return (
                              <td
                                key={`${doctor.id}-${day}`}
                                className={`py-3 px-0.5 text-center border-r border-slate-100 last:border-0 relative ${
                                  isCutiDay && isAvailable
                                    ? "bg-red-50"
                                    : isAvailable
                                      ? "bg-white"
                                      : "bg-slate-50/30"
                                }`}
                              >
                                {isCutiDay && isAvailable ? (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg bg-red-500 rounded-full w-6 h-6 flex items-center justify-center">
                                      C
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center gap-1.5 min-h-10 relative z-10">
                                    {/* Sesi 1 */}
                                    {s1.length > 0 && (
                                      <span className="text-[11px] font-bold text-slate-800">
                                        {s1[0].start_time.substring(0, 5)}
                                      </span>
                                    )}
                                    {s1.length === 0 && s2.length === 0 && (
                                      <span className="text-slate-300 text-xs">
                                        —
                                      </span>
                                    )}

                                    {/* Sesi 2 - Menumpuk Langsung di Bawahnya */}
                                    {s2.length > 0 && (
                                      <span className="text-[11px] font-bold text-slate-800 ">
                                        {s2[0].start_time.substring(0, 5)}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* PAGINATION CONTROLS - MOBILE */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pt-8">
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="h-11 px-3 flex items-center justify-center text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-bold text-xs gap-1"
                >
                  ←<span>PREV</span>
                </button>
              )}

              <div className="flex flex-wrap justify-center gap-2">
                {new Array(totalPages).fill(null).map((_, i) => (
                  <button
                    key={`page-${i + 1}`}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-11 h-11 flex items-center justify-center font-bold text-xs transition-all ${
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
                  className="h-11 px-3 flex items-center justify-center text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all font-bold text-xs gap-1"
                >
                  <span>NEXT</span>→
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* EMPTY STATE */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-slate-500 text-lg font-medium">
            {searchDoctor
              ? `Dokter "${searchDoctor}" tidak ditemukan`
              : "Tidak ada jadwal dokter untuk spesialisasi ini"}
          </p>
        </div>
      )}

      {/* LEGEND */}
      {filteredDoctors.length > 0 && (
        <div className="p-4 bg-blue-50  border border-blue-200">
          <p className="text-sm font-semibold text-slate-800 mb-2">
            Keterangan:
          </p>
          <ul className="text-xs text-slate-700 space-y-1">
            <li>• Jam praktek ditampilkan dalam format 24 jam (HH:mm)</li>
            <li>
              • Baris kedua menampilkan sesi praktek kedua jika tersedia pada
              hari yang sama
            </li>
            <li>
              • Huruf C merah menunjukkan bahwa dokter sedang cuti di hari
              tersebut
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
