"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
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

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const FILTER_CACHE_KEY = "doctor-schedule-filters";
const DOCTORS_CACHE_KEY = "doctor-schedule-data";
const DOCTORS_CACHE_TTL = 5 * 60 * 1000; // 5 menit

interface FilterState {
  selectedSpecialty: string | null;
  selectedSpecialtyInput: string | null;
  searchDoctor: string;
  searchDoctorInput: string;
  selectedDay: string | null;
  selectedDayInput: string | null;
  showMobileSpecialtyModal: boolean;
  showMobileDayModal: boolean;
  showDesktopDayModal: boolean;
}

const loadFilterState = (): FilterState | null => {
  try {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem(FILTER_CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
};

const saveFilterState = (state: FilterState) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(FILTER_CACHE_KEY, JSON.stringify(state));
  } catch {}
};

const loadDoctorsCache = (): DoctorWithSchedule[] | null => {
  try {
    if (typeof window === "undefined") return null;
    const cached = sessionStorage.getItem(DOCTORS_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached) as {
      data: DoctorWithSchedule[];
      timestamp: number;
    };
    if (Date.now() - parsed.timestamp > DOCTORS_CACHE_TTL) return null;
    if (!parsed.data || parsed.data.length === 0) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const saveDoctorsCache = (data: DoctorWithSchedule[]) => {
  try {
    if (typeof window === "undefined") return;
    if (!data || data.length === 0) return;
    sessionStorage.setItem(
      DOCTORS_CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {}
};

const DAY_NAME_BY_INDEX = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const getTodayDayName = (): string => {
  return DAY_NAME_BY_INDEX[new Date().getDay()];
};

const isDoctorCutiOnDay = (
  doctor: DoctorWithSchedule,
  day: string,
  todayDayName: string,
): boolean => {
  if (doctor.status !== "cuti") return false;
  if (day !== todayDayName) return false;
  if (!doctor.schedules || doctor.schedules.length === 0) return false;

  return doctor.schedules.some((s) => s.day_of_week === day);
};

export default function DoctorScheduleGridMobile({
  doctorsWithSchedules = [],
  loading: propsLoading = false,
}: Readonly<DoctorScheduleGridProps>) {
  const router = useRouter();
  const filterTimeoutRef = useRef<number | undefined>(undefined);

  // Cache dibaca sekali saat mount.
  const cachedDoctors = useMemo(() => loadDoctorsCache(), []);

  // Props menjadi sumber utama; cache sebagai fallback.
  const doctors = useMemo(
    () =>
      doctorsWithSchedules.length > 0
        ? doctorsWithSchedules
        : (cachedDoctors ?? []),
    [doctorsWithSchedules, cachedDoctors],
  );

  const initialFilterState = useMemo(() => loadFilterState(), []);

  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    initialFilterState?.selectedSpecialty ?? null,
  );
  const [selectedSpecialtyInput, setSelectedSpecialtyInput] = useState<
    string | null
  >(initialFilterState?.selectedSpecialtyInput ?? null);
  const [searchDoctor, setSearchDoctor] = useState(
    initialFilterState?.searchDoctor ?? "",
  );
  const [searchDoctorInput, setSearchDoctorInput] = useState(
    initialFilterState?.searchDoctorInput ?? "",
  );
  const [showMobileSpecialtyModal, setShowMobileSpecialtyModal] = useState(
    initialFilterState?.showMobileSpecialtyModal ?? false,
  );
  const [showMobileDayModal, setShowMobileDayModal] = useState(
    initialFilterState?.showMobileDayModal ?? false,
  );
  const [showDesktopDayModal, setShowDesktopDayModal] = useState(
    initialFilterState?.showDesktopDayModal ?? false,
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(
    initialFilterState?.selectedDay ?? null,
  );
  const [selectedDayInput, setSelectedDayInput] = useState<string | null>(
    initialFilterState?.selectedDayInput ?? null,
  );

  const todayDayName = getTodayDayName();

  // Simpan data terbaru ke cache.
  useEffect(() => {
    if (doctorsWithSchedules.length > 0) {
      saveDoctorsCache(doctorsWithSchedules);
    }
  }, [doctorsWithSchedules]);

  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = window.setTimeout(() => {
      saveFilterState({
        selectedSpecialty,
        selectedSpecialtyInput,
        searchDoctor,
        searchDoctorInput,
        selectedDay,
        selectedDayInput,
        showMobileSpecialtyModal,
        showMobileDayModal,
        showDesktopDayModal,
      });
    }, 300);

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [
    selectedSpecialty,
    selectedSpecialtyInput,
    searchDoctor,
    searchDoctorInput,
    selectedDay,
    selectedDayInput,
    showMobileSpecialtyModal,
    showMobileDayModal,
    showDesktopDayModal,
  ]);

  const handleOpenMobileSpecialtyModal = useCallback(() => {
    setShowMobileSpecialtyModal((prev) => {
      if (!prev) setShowMobileDayModal(false);
      return !prev;
    });
  }, []);

  const handleOpenMobileDayModal = useCallback(() => {
    setShowMobileDayModal((prev) => {
      if (!prev) setShowMobileSpecialtyModal(false);
      return !prev;
    });
  }, []);

  const specialties = useMemo(() => {
    const data = doctors;
    if (!data || data.length === 0) return [];
    const specs = new Set(data.map((doc) => doc.specialty));
    return Array.from(specs).sort((a, b) => a.localeCompare(b));
  }, [doctors, doctorsWithSchedules]);

  const filteredDoctors = useMemo(() => {
    const data = doctors;
    if (!data || data.length === 0) return [];

    return data
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
  }, [doctors, selectedSpecialty, searchDoctor, selectedDay]);

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

  const getScheduleText = useCallback(
    (day: string, schedules: Schedule[] = []) => {
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
        .join();
    },
    [],
  );

  const handleReset = useCallback(() => {
    setSelectedSpecialtyInput(null);
    setSelectedSpecialty(null);
    setShowMobileSpecialtyModal(false);
    setSearchDoctor("");
    setSearchDoctorInput("");
    setSelectedDayInput(null);
    setSelectedDay(null);
    setShowMobileDayModal(false);
    setShowDesktopDayModal(false);

    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(FILTER_CACHE_KEY);
      }
    } catch {}
  }, []);

  const handleSearch = useCallback(() => {
    setSelectedSpecialty(selectedSpecialtyInput);
    setSearchDoctor(searchDoctorInput);
    setSelectedDay(selectedDayInput);
  }, [selectedSpecialtyInput, searchDoctorInput, selectedDayInput]);

  const handleSpecialtySelect = useCallback((specialty: string | null) => {
    setSelectedSpecialtyInput(specialty);
    setShowMobileSpecialtyModal(false);
  }, []);

  const handleDaySelect = useCallback((day: string | null) => {
    setSelectedDayInput(day);
    setShowMobileDayModal(false);
    setShowDesktopDayModal(false);
  }, []);

  const handleDoctorClick = useCallback(
    (doctorId: string, isCuti: boolean) => {
      if (!isCuti) {
        router.push(`/dokter/${doctorId}`);
      }
    },
    [router],
  );

  // Jangan tampilkan loading jika cache sudah tersedia.
  const showLoading = propsLoading && doctors.length === 0;

  const structuredData = useMemo(() => {
    if (!filteredDoctors || filteredDoctors.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: filteredDoctors.map((doctor, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Physician",
          name: doctor.name,
          medicalSpecialty: doctor.specialty,
          availableService:
            doctor.schedules?.map((s) => ({
              "@type": "MedicalTherapy",
              name: `Jadwal praktik ${s.day_of_week}`,
              availableService: `${s.start_time?.substring(0, 5)} - ${s.end_time?.substring(0, 5)}`,
            })) ?? [],
        },
      })),
    };
  }, [filteredDoctors]);

  if (showLoading) {
    return (
      <div className="w-full min-h-96 flex flex-col items-center justify-center">
        <Loader2
          className="h-12 w-12 animate-spin text-[#003f88] mb-4"
          aria-hidden="true"
        />
        <p className="text-slate-600 text-base">Memuat jadwal dokter...</p>
      </div>
    );
  }

  return (
    <section
      className="w-full space-y-6"
      aria-label="Jadwal Dokter"
      itemScope
      itemType="https://schema.org/MedicalOrganization"
    >
      {structuredData && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* search dan filter */}
      <search
        className="block space-y-4"
        aria-label="Pencarian dan filter jadwal dokter"
      >
        {/* filterbar mobile */}
        <div className="lg:hidden w-full flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#003f88]"
                size={16}
                aria-hidden="true"
              />
              <label htmlFor="search-doctor-mobile" className="sr-only">
                Cari nama dokter
              </label>
              <input
                id="search-doctor-mobile"
                type="search"
                placeholder="Cari Dokter"
                value={searchDoctorInput}
                onChange={(e) => {
                  setSearchDoctorInput(e.target.value);
                  if (e.target.value === "") setSearchDoctor("");
                }}
                className="w-full border border-slate-200 h-11 pl-10 pr-4 outline-none focus:border-[#003f88] text-[14px] bg-white"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenMobileSpecialtyModal}
              aria-expanded={showMobileSpecialtyModal}
              aria-label="Filter berdasarkan spesialis"
              className={`w-11 h-11 flex items-center justify-center border transition-all bg-white ${
                showMobileSpecialtyModal
                  ? "border-[#003f88]"
                  : "border-slate-200 "
              }`}
              title="Filter Spesialis"
            >
              <Stethoscope
                size={20}
                className="text-[#003f88]"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={handleOpenMobileDayModal}
              aria-expanded={showMobileDayModal}
              aria-label="Filter berdasarkan hari"
              className={`w-11 h-11 flex items-center justify-center border transition-all bg-white ${
                showMobileDayModal ? "border-[#003f88] " : "border-slate-200 "
              }`}
              title="Filter Hari"
            >
              <CalendarDays
                size={20}
                className="text-[#003f88]"
                aria-hidden="true"
              />
            </button>

            {/* button cari */}
            <button
              type="submit"
              onClick={handleSearch}
              className="px-4 h-11 bg-[#003f88] text-white font-semibold hover:bg-[#003f88]/90 transition-all border border-[#003f88] text-base flex items-center justify-center rounded-lg cursor-pointer"
            >
              Search
            </button>
          </div>

          <AnimatePresence>
            {showMobileSpecialtyModal && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                role="listbox"
                aria-label="Pilih spesialis"
              >
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleReset}
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
                      type="button"
                      key={s}
                      onClick={() => handleSpecialtySelect(s)}
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
                role="listbox"
                aria-label="Pilih hari"
              >
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className={`w-full text-left px-4 py-2 text-base transition-all whitespace-nowrap ${
                      selectedDayInput === null
                        ? "bg-[#003f88] text-white font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Semua Hari
                  </button>
                  {DAYS.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => handleDaySelect(d)}
                      className={`w-full text-left px-4 py-2 text-base transition-all whitespace-nowrap ${
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
      </search>

      {/* penanda legenda */}
      <ul className="flex flex-wrap gap-4 text-sm font-bold items-center -mt-2 list-none p-0">
        <li className="text-[#003f88] flex items-center gap-1">
          (*) Poliklinik Eksekutif
        </li>
        <li className="text-green-600 flex items-center gap-1">
          (R) Jadwal Ramadhan
        </li>
        <li className="text-red-600 flex items-center gap-1">(C) Cuti</li>
      </ul>

      {/* tampilan mobile */}
      {filteredDoctors.length > 0 && (
        <div className="lg:hidden flex flex-col gap-4">
          {Object.keys(groupedDoctors).map((specialtyName) => (
            <div key={`mobile-${specialtyName}`} className="space-y-3">
              <h3 className="text-base font-bold text-white bg-[#003f88] px-2 p-2 m-0">
                {specialtyName}
              </h3>

              {groupedDoctors[specialtyName].map((doctor) => {
                const isDoctorCuti = doctor.status === "cuti";

                return (
                  <article
                    key={`mobile-doc-${doctor.id}`}
                    className="bg-white border border-slate-200 p-3 space-y-2 text-sm"
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
                        const isCutiOnThisDay = isDoctorCutiOnDay(
                          doctor,
                          day,
                          todayDayName,
                        );

                        if (scheduleText === "-" && !isCutiOnThisDay) {
                          return null;
                        }

                        if (isCutiOnThisDay) {
                          return (
                            <div
                              key={`mobile-day-${day}`}
                              className="p-2 rounded bg-red-50 text-red-700"
                            >
                              <span className="font-semibold block text-red-700">
                                {day}
                              </span>
                              <span className="line-through text-red-600">
                                {scheduleText !== "-" ? scheduleText : "-"}
                              </span>
                              <span className="block text-xs font-bold text-red-600">
                                (Cuti)
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={`mobile-day-${day}`}
                            className="p-2 rounded bg-slate-50"
                          >
                            <span className="font-semibold block text-slate-600">
                              {day}
                            </span>
                            <span>{scheduleText}</span>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* empty state */}
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
