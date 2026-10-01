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
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
const QUERY_KEY = "doctors-schedule";

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

// cache filter
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
  } catch {
    // silent fail
  }
};

// cache data dokter, dipakai supaya pindah halaman lalu balik lagi ga loading ulang
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
  } catch {
    // silent fail
  }
};

// mapping index hari JS Date.getDay() (0 = Minggu) ke nama hari Indonesia
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

export default function DoctorScheduleGrid({
  doctorsWithSchedules = [],
  loading: propsLoading = false,
}: Readonly<DoctorScheduleGridProps>) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const queryClient = useQueryClient();
  const isMounted = useRef(true);
  const filterTimeoutRef = useRef<number | undefined>(undefined);

  // cache data dokter dari kunjungan sebelumnya, dibaca sekali saat mount
  const cachedDoctors = useMemo(() => loadDoctorsCache(), []);

  // react query untuk caching data dokter
  const {
    data: doctors,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      if (doctorsWithSchedules.length > 0) {
        saveDoctorsCache(doctorsWithSchedules);
        return doctorsWithSchedules;
      }

      const cached = queryClient.getQueryData<DoctorWithSchedule[]>([
        QUERY_KEY,
      ]);
      if (cached && cached.length > 0) {
        return cached;
      }

      return cachedDoctors ?? [];
    },
    initialData:
      doctorsWithSchedules.length > 0
        ? doctorsWithSchedules
        : (cachedDoctors ?? []),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: 1000,
    placeholderData: (previousData) => previousData,
  });

  // load filter state dari cache
  const initialFilterState = useMemo(() => loadFilterState(), []);

  // state filter
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

  // nama hari saat ini, dihitung ulang tiap render biar akurat lewat tengah malam
  const todayDayName = getTodayDayName();

  // sinkronkan query cache saat props berubah
  useEffect(() => {
    if (doctorsWithSchedules.length > 0) {
      const currentData = queryClient.getQueryData<DoctorWithSchedule[]>([
        QUERY_KEY,
      ]);

      if (
        JSON.stringify(currentData) !== JSON.stringify(doctorsWithSchedules)
      ) {
        queryClient.setQueryData([QUERY_KEY], doctorsWithSchedules);
      }

      saveDoctorsCache(doctorsWithSchedules);
    }
  }, [doctorsWithSchedules, queryClient]);

  // simpan filter state ke cache dengan debounce
  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = window.setTimeout(() => {
      if (!isMounted.current) return;

      const filterState: FilterState = {
        selectedSpecialty,
        selectedSpecialtyInput,
        searchDoctor,
        searchDoctorInput,
        selectedDay,
        selectedDayInput,
        showMobileSpecialtyModal,
        showMobileDayModal,
        showDesktopDayModal,
      };

      saveFilterState(filterState);
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

  // cleanup saat unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

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
    const data = doctors || doctorsWithSchedules;
    if (!data || data.length === 0) return [];
    const specs = new Set(data.map((doc) => doc.specialty));
    return Array.from(specs).sort((a, b) => a.localeCompare(b));
  }, [doctors, doctorsWithSchedules]);

  const filteredDoctors = useMemo(() => {
    const data = doctors || doctorsWithSchedules;
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
  }, [
    doctors,
    doctorsWithSchedules,
    selectedSpecialty,
    searchDoctor,
    selectedDay,
  ]);

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
        .join("\n");
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
    } catch {
      // silent fail
    }

    refetch();
  }, [refetch]);

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

  // tentukan status loading: kalau data sudah ada (dari props, query cache, atau cache lokal), jangan loading lagi
  const showLoading = useMemo(() => {
    const hasData = doctors && doctors.length > 0;
    if (hasData) return false;

    if (propsLoading) return true;
    if (isLoading || isFetching) return true;

    return false;
  }, [propsLoading, doctors, isLoading, isFetching]);

  // JSON-LD structured data untuk SEO, dibangun dari data yang tampil
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
      ref={sectionRef}
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

        {/* searchbar desktop */}
        <div className="hidden lg:block p-4 bg-slate-50 border border-slate-100 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label
                htmlFor="filter-specialty-desktop"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Spesialis
              </label>
              <button
                id="filter-specialty-desktop"
                type="button"
                onClick={() =>
                  setShowMobileSpecialtyModal(!showMobileSpecialtyModal)
                }
                aria-expanded={showMobileSpecialtyModal}
                className="w-full h-11 px-4 border border-slate-200 text-left bg-white transition-all focus:border-[#003f88] focus:outline-none text-base flex items-center justify-between"
              >
                <span>{selectedSpecialtyInput || "Pilih Spesialis"}</span>
                <Stethoscope
                  size={18}
                  className="text-[#003f88] shrink-0"
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence>
                {showMobileSpecialtyModal && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-lg z-50 mt-1 max-h-96 overflow-y-auto rounded-lg"
                    role="listbox"
                    aria-label="Pilih spesialis"
                  >
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={handleReset}
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
                          type="button"
                          key={s}
                          onClick={() => handleSpecialtySelect(s)}
                          className={`w-full text-left px-4 py-2 text-sm transition-all ${
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

            <div className="flex gap-2 items-end relative">
              <div className="flex-1 relative">
                <label
                  htmlFor="search-doctor-desktop"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Nama Dokter
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#003f88]"
                    size={18}
                    aria-hidden="true"
                  />
                  <input
                    id="search-doctor-desktop"
                    type="search"
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
                type="button"
                onClick={() => setShowDesktopDayModal(!showDesktopDayModal)}
                aria-expanded={showDesktopDayModal}
                aria-label="Filter berdasarkan hari"
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
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {showDesktopDayModal && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 bg-white border border-slate-200 shadow-lg z-50 mt-1 max-h-96 overflow-y-auto"
                    role="listbox"
                    aria-label="Pilih hari"
                  >
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={handleReset}
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
                          type="button"
                          key={d}
                          onClick={() => handleDaySelect(d)}
                          className={`w-full text-left px-4 py-2 text-sm transition-all whitespace-nowrap ${
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

              {/* button cari */}
              <button
                type="submit"
                onClick={handleSearch}
                className="px-6 h-11 bg-[#003f88] text-white font-semibold transition-all flex items-center justify-center text-base cursor-pointer rounded-lg active:scale-95"
              >
                Cari
              </button>
            </div>
          </div>
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

      {/* tampilan desktop */}
      {filteredDoctors.length > 0 && (
        <div className="hidden lg:block w-full overflow-x-auto border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <caption className="sr-only">
              Jadwal praktik dokter berdasarkan spesialis dan hari
            </caption>
            <thead>
              <tr className="bg-[#003f88] text-white text-sm font-semibold">
                <th scope="col" className="p-3 border-r border-slate-300 w-1/4">
                  Nama Dokter
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    scope="col"
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
                  <tr className="bg-slate-50">
                    <th
                      scope="colgroup"
                      colSpan={DAYS.length + 1}
                      className="p-3 text-left font-normal border-b border-slate-200"
                    >
                      <h3 className="text-2xl text-slate-700 font-semibold m-0">
                        Dokter {specialtyName}
                      </h3>
                    </th>
                  </tr>

                  {groupedDoctors[specialtyName].map((doctor) => {
                    const isDoctorCuti = doctor.status === "cuti";

                    return (
                      <tr
                        key={doctor.id}
                        className={`border-b border-slate-200 text-sm transition-colors hover:bg-slate-50/80 ${
                          isDoctorCuti ? "bg-red-50/20" : ""
                        }`}
                      >
                        <th
                          scope="row"
                          className="p-3 text-left font-normal border-r border-slate-200"
                        >
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleDoctorClick(doctor.id, isDoctorCuti)
                              }
                              disabled={isDoctorCuti}
                              aria-label={`Lihat profil dokter ${doctor.name}`}
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
                                title="Sedang cuti"
                              >
                                (C)
                              </span>
                            )}
                          </div>
                        </th>

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

                          // hanya hari realtime yang ditandai cuti
                          if (isCutiOnThisDay) {
                            return (
                              <td
                                key={day}
                                className="p-3 text-center border-r border-slate-200 last:border-r-0 font-medium bg-red-50"
                              >
                                <div className="flex flex-col items-center justify-center gap-0.5">
                                  <span className="text-red-600 font-bold line-through">
                                    {scheduleText !== "-" ? scheduleText : "-"}
                                  </span>
                                  <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                                    (C) Cuti
                                  </span>
                                </div>
                              </td>
                            );
                          }

                          return (
                            <td
                              key={day}
                              className={`p-3 text-center border-r border-slate-200 last:border-r-0 font-medium ${
                                scheduleText !== "-"
                                  ? "text-slate-800"
                                  : "text-slate-400"
                              }`}
                            >
                              <span className="whitespace-pre-line">
                                {scheduleText}
                              </span>
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

      {/* tampilan mobile */}
      {filteredDoctors.length > 0 && (
        <div className="lg:hidden flex flex-col gap-4">
          {Object.keys(groupedDoctors).map((specialtyName) => (
            <div key={`mobile-${specialtyName}`} className="space-y-3">
              <h3 className="text-base font-bold text-white bg-[#003f88] p-2 m-0">
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

                        // hanya tampilkan hari yang ada jadwal atau cuti
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
