"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { Doctor, Schedule } from "@/lib/types";
import { Search, Loader2, Stethoscope, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface DoctorWithSchedule extends Doctor {
  schedules: Schedule[];
}

interface DoctorScheduleGridProps {
  doctorsWithSchedules: DoctorWithSchedule[];
  loading?: boolean;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",];
const ITEMS_PER_PAGE = 10;

const getTodayDayName = (): string => {
  const dayIndex = new Date().getDay();
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

const getCutiDay = (doctor: DoctorWithSchedule): string | null => {
  if (
    doctor.status !== "cuti" ||
    !doctor.schedules ||
    doctor.schedules.length === 0
  ) {
    return null;
  }
  const todayDay = getTodayDayName();
  const hasScheduleToday = doctor.schedules.some(
    (s) =>
      s.day_of_week === todayDay ||
      (todayDay === "Minggu" && s.day_of_week === "Minggu"),
  );
  if (hasScheduleToday) {
    return todayDay;
  }
  return null;
};

export default function DoctorScheduleGrid({
  doctorsWithSchedules = [],
  loading = false,
}: Readonly<DoctorScheduleGridProps>) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
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

  const handleOpenMobileSpecialtyModal = () => {
    setShowMobileSpecialtyModal(!showMobileSpecialtyModal);
    if (!showMobileSpecialtyModal) setShowMobileDayModal(false);
  };

  const handleOpenMobileDayModal = () => {
    setShowMobileDayModal(!showMobileDayModal);
    if (!showMobileDayModal) setShowMobileSpecialtyModal(false);
  };

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

        let matchesDay = true;
        if (selectedDay && selectedDay !== "Semua Hari") {
          matchesDay =
            doc.schedules && doc.schedules.length > 0
              ? doc.schedules.some(
                  (s) =>
                    s.day_of_week === selectedDay ||
                    (selectedDay === "Minggu" && s.day_of_week === "Minggu"),
                )
              : false;
        }

        return matchesSpecialty && matchesSearch && matchesDay;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [doctorsWithSchedules, selectedSpecialty, searchDoctor, selectedDay]);

  const groupedDoctors = useMemo(() => {
    const groups: { [key: string]: DoctorWithSchedule[] } = {};
    filteredDoctors.forEach((doc) => {
      if (!groups[doc.specialty]) {
        groups[doc.specialty] = [];
      }
      groups[doc.specialty].push(doc);
    });
    return groups;
  }, [filteredDoctors]);

  const getScheduleText = (day: string, schedules: Schedule[] = []) => {
    const daySchedules = schedules.filter(
      (s) =>
        s.day_of_week === day ||
        (day === "Minggu" && s.day_of_week === "Minggu"),
    );
    if (daySchedules.length === 0) return "-";

    return daySchedules
      .map(
        (s) =>
          `${s.start_time.substring(0, 5)} - ${s.end_time.substring(0, 5)}`,
      )
      .join("\n");
  };

  if (loading) {
    return (
      <div className="w-full min-h-96 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#003f88] mb-4" />
        <p className="text-slate-600 text-base">Memuat jadwal dokter...</p>
      </div>
    );
  }

  return (
    <section
      className="w-full space-y-6"
      ref={sectionRef}
      aria-label="Jadwal Dokter"
    >
      {/* SEARCH & FILTER SECTION (SEMANTIC HTML5 <search>) */}
      <search className="block space-y-4">
        {/* MOBILE FILTER BAR */}
        <div className="lg:hidden w-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#003f88]"
                size={16}
              />
              <input
                type="text"
                placeholder="Masukkan Nama Dokter"
                value={searchDoctorInput}
                onChange={(e) => {
                  setSearchDoctorInput(e.target.value);
                  if (e.target.value === "") setSearchDoctor("");
                }}
                className="w-full border border-slate-200 h-11 pl-10 pr-4 outline-none focus:border-[#003f88] text-sm bg-white"
              />
            </div>

            <button
              onClick={handleOpenMobileSpecialtyModal}
              className={`w-11 h-11 flex items-center justify-center border transition-all ${
                showMobileSpecialtyModal
                  ? "border-[#003f88] bg-slate-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
              title="Filter Spesialis"
            >
              <Stethoscope size={20} className="text-[#003f88]" />
            </button>

            <button
              onClick={handleOpenMobileDayModal}
              className={`w-11 h-11 flex items-center justify-center border transition-all ${
                showMobileDayModal
                  ? "border-[#003f88] bg-slate-50"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
              title="Filter Hari"
            >
              <CalendarDays size={20} className="text-[#003f88]" />
            </button>

            <button
              onClick={() => {
                setSelectedSpecialty(selectedSpecialtyInput);
                setSearchDoctor(searchDoctorInput);
                setSelectedDay(selectedDayInput);
              }}
              className="px-4 h-11 bg-[#003f88] text-white font-semibold hover:bg-[#003f88]/90 transition-all border border-[#003f88] text-base flex items-center justify-center rounded-lg"
            >
              Cari
            </button>
          </div>

          <AnimatePresence>
            {showMobileSpecialtyModal && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                <div className="p-2">
                  <button
                    onClick={() => {
                      setSelectedSpecialtyInput(null);
                      setSelectedSpecialty(null);
                      setShowMobileSpecialtyModal(false);
                      setSearchDoctor("");
                      setSearchDoctorInput("");
                    }}
                    className={`w-full text-left px-4 py-2 text-base transition-all ${
                      selectedSpecialtyInput === null
                        ? "bg-[#003f88] text-white font-semibold"
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
                      className={`w-full text-left px-4 py-2 text-base transition-all ${
                        selectedSpecialtyInput === s
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

          <AnimatePresence>
            {showMobileDayModal && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200 rounded-lg shadow-lg z-50"
              >
                <div className="p-2">
                  <button
                    onClick={() => {
                      setSelectedDayInput(null);
                      setSelectedDay(null);
                      setShowMobileDayModal(false);
                      setSearchDoctor("");
                      setSearchDoctorInput("");
                    }}
                    className={`w-full text-left px-4 py-2 text-base  transition-all whitespace-nowrap ${
                      selectedDayInput === null
                        ? "bg-[#003f88] text-white font-semibold"
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
                      className={`w-full text-left px-4 py-2 text-base  transition-all whitespace-nowrap ${
                        selectedDayInput === d
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

        {/* DESKTOP SEARCH BAR WITH WRAPPER */}
        <div className="hidden lg:block p-4 bg-slate-50 border border-slate-100 ">
          <div className="grid grid-cols-2 gap-4">
            {/* Kolom Kiri: Spesialis */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Spesialis
              </label>
              <button
                onClick={() =>
                  setShowMobileSpecialtyModal(!showMobileSpecialtyModal)
                }
                className="w-full h-11 px-4 border border-slate-200 text-left bg-white hover:bg-slate-50 transition-all focus:border-[#003f88] focus:outline-none text-base flex items-center justify-between"
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
                    className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-lg z-50 mt-1 max-h-96 overflow-y-auto"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setSelectedSpecialtyInput(null);
                          setSelectedSpecialty(null);
                          setShowMobileSpecialtyModal(false);
                          setSearchDoctor("");
                          setSearchDoctorInput("");
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-all ${
                          selectedSpecialtyInput === null
                            ? "bg-[#003f88] text-white font-semibold"
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
                          className={`w-full text-left px-4 py-2 text-sm  transition-all ${
                            selectedSpecialtyInput === s
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
            </div>

            {/* Kolom Kanan: Nama Dokter & Filter & Tombol Cari */}
            <div className="flex gap-2 items-end relative">
              <div className="flex-1 relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nama Dokter
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#003f88]"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Masukkan Nama Dokter"
                    value={searchDoctorInput}
                    onChange={(e) => {
                      setSearchDoctorInput(e.target.value);
                      if (e.target.value === "") setSearchDoctor("");
                    }}
                    className="w-full border border-slate-200 h-11 pl-10 pr-4 outline-none focus:border-[#003f88] text-base bg-white"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowDesktopDayModal(!showDesktopDayModal)}
                className={`w-11 h-11 flex items-center justify-center border transition-all bg-white ${
                  showDesktopDayModal
                    ? "border-[#003f88] bg-white"
                    : "border-slate-200"
                }`}
                title={
                  selectedDayInput
                    ? `Filter: ${selectedDayInput}`
                    : "Filter Hari"
                }
              >
                <CalendarDays
                  size={18}
                  className="text-[#003f88]"
                  strokeWidth={1.5}
                />
              </button>

              <AnimatePresence>
                {showDesktopDayModal && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 bg-white border border-slate-200 shadow-lg z-50 mt-1 max-h-96 overflow-y-auto "
                  >
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setSelectedDayInput(null);
                          setSelectedDay(null);
                          setShowDesktopDayModal(false);
                          setSearchDoctor("");
                          setSearchDoctorInput("");
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-all whitespace-nowrap ${
                          selectedDayInput === null
                            ? "bg-[#003f88] text-white font-semibold"
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
                          className={`w-full text-left px-4 py-2 text-sm transition-all whitespace-nowrap  ${
                            selectedDayInput === d
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

              <button
                onClick={() => {
                  setSelectedSpecialty(selectedSpecialtyInput);
                  setSearchDoctor(searchDoctorInput);
                  setSelectedDay(selectedDayInput);
                }}
                className="px-6 h-11 bg-[#003f88] text-white font-semibold transition-all flex items-center justify-center text-base cursor-pointer rounded-lg active:scale-95"
              >
                Cari
              </button>
            </div>
          </div>
        </div>
      </search>

      {/* LEGEND/LABEL (SEMANTIC SEMANTIC UL/LI) */}
      <ul className="flex flex-wrap gap-4 text-sm font-bold items-center -mt-2 list-none p-0">
        <li className="text-[#003f88] flex items-center gap-1">
          (*) Poliklinik Eksekutif
        </li>
        <li className="text-green-600 flex items-center gap-1">
          (R) Jadwal Ramadhan
        </li>
        <li className="text-red-600 flex items-center gap-1">(C) Cuti</li>
      </ul>

      {/* DESKTOP TABLE VIEW */}
      {filteredDoctors.length > 0 && (
        <div className="hidden lg:block w-full overflow-x-auto border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#003f88] text-white text-sm font-semibold">
                <th className="p-3 border-r border-slate-300 w-1/4">
                  Nama Dokter
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="p-3 text-center border-r border-slate-300 last:border-r-0"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedDoctors).map((specialtyName) => (
                <React.Fragment key={specialtyName}>
                  {/* Sub Header Kategori Spesialis */}
                  <tr className="bg-slate-50">
                    <td
                      colSpan={DAYS.length + 1}
                      className="p-3 font-normal text-2xl text-black border-b border-slate-200"
                    >
                      Dokter {specialtyName}
                    </td>
                  </tr>

                  {/* Baris Data Dokter */}
                  {groupedDoctors[specialtyName].map((doctor) => {
                    const cutiDay = getCutiDay(doctor);
                    const isDoctorCuti = doctor.status === "cuti";

                    return (
                      <tr
                        key={doctor.id}
                        className={`border-b border-slate-200 text-sm transition-colors hover:bg-slate-50/80 ${
                          isDoctorCuti ? "bg-red-50/20" : ""
                        }`}
                      >
                        {/* Kolom Nama Dokter */}
                        <td className="p-3 border-r border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                !isDoctorCuti &&
                                router.push(`/dokter/${doctor.id}`)
                              }
                              disabled={isDoctorCuti}
                              className={`text-left font-bold outline-none focus:underline ${
                                isDoctorCuti
                                  ? "text-red-600 cursor-not-allowed"
                                  : "text-[#003f88] hover:text-[#e67e22] hover:underline"
                              } text-base`}
                            >
                              {doctor.name}
                            </button>
                            {isDoctorCuti && (
                              <span
                                className="text-red-600 font-bold text-base"
                                title="Sedang Cuti"
                              >
                                (C)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Kolom Jadwal Hari (Senin - Minggu) */}
                        {DAYS.map((day) => {
                          const scheduleText = getScheduleText(
                            day,
                            doctor.schedules,
                          );
                          const isCutiToday = cutiDay === day;

                          // If the doctor is on leave, show schedule times in red.
                          // For the specific cuti day we keep the line-through + badge.
                          return (
                            <td
                              key={day}
                              className={`p-3 text-center border-r border-slate-200 last:border-r-0 font-medium ${
                                scheduleText !== "-"
                                  ? "text-slate-800"
                                  : "text-slate-400"
                              } ${isCutiToday ? "bg-red-50 text-red-600 font-bold" : isDoctorCuti ? "text-red-600" : ""}`}
                            >
                              {isCutiToday ? (
                                <div className="flex flex-col items-center justify-center gap-0.5">
                                  <span className="text-red-600 font-medium line-through">
                                    {scheduleText}
                                  </span>
                                  <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                                    (C) Cuti
                                  </span>
                                </div>
                              ) : (
                                <span
                                  className={`${isDoctorCuti ? "text-red-600" : ""} whitespace-pre-line`}
                                >
                                  {scheduleText}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MOBILE VIEW */}
      {filteredDoctors.length > 0 && (
        <div className="lg:hidden flex flex-col gap-4">
          {Object.keys(groupedDoctors).map((specialtyName) => (
            <div key={`mobile-${specialtyName}`} className="space-y-3">
              <div className="text-base font-bold text-white bg-[#003f88] p-2 ">
                {specialtyName}
              </div>

              {groupedDoctors[specialtyName].map((doctor) => {
                const cutiDay = getCutiDay(doctor);
                const isDoctorCuti = doctor.status === "cuti";

                return (
                  <div
                    key={`mobile-doc-${doctor.id}`}
                    className="bg-white border border-slate-200 p-3  space-y-2 text-sm"
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`font-bold text-base ${isDoctorCuti ? "text-red-600" : "text-[#003f88]"}`}
                      >
                        {doctor.name}
                      </div>
                      {isDoctorCuti && (
                        <span className="text-red-600 font-extrabold text-base">
                          (C)
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      {DAYS.map((day) => {
                        const scheduleText = getScheduleText(
                          day,
                          doctor.schedules,
                        );
                        if (scheduleText === "-") return null;
                        const isCutiToday = cutiDay === day;

                        return (
                          <div
                            key={`mobile-day-${day}`}
                            className={`p-2 rounded ${isCutiToday ? "bg-red-50 text-red-700" : "bg-slate-50"}`}
                          >
                            <span
                              className={`font-semibold block ${isCutiToday ? "text-red-700" : "text-slate-600"}`}
                            >
                              {day}
                            </span>
                            <span
                              className={`${isCutiToday ? "line-through text-red-600" : isDoctorCuti ? "text-red-600" : ""}`}
                            >
                              {scheduleText}
                            </span>
                            {isCutiToday && (
                              <span className="block text-xs font-bold text-red-600">
                                (Cuti)
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* TAMPILAN JIKA TIDAK ADA DATA */}
      {filteredDoctors.length === 0 && (
        <div className="w-full text-center py-12 border border-dashed border-slate-200 bg-white">
          <p className="text-slate-500 text-base">
            Tidak ada jadwal dokter yang cocok dengan pencarian Anda.
          </p>
        </div>
      )}
    </section>
  );
}
