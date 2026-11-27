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
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { fetchAllDoctorsWithSchedules } from "@/lib/api";
import { Doctor, Schedule } from "@/lib/types";

interface DoctorWithSchedules extends Doctor {
  schedules?: Schedule[];
}
import DoctorSkeleton from "./DoctorSkeleton";
import BookingForm from "../BookingForm";

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

// hari praktik saja (tanpa "Semua Hari")
const PRACTICE_DAYS = DAYS.slice(1);

const ITEMS_PER_PAGE = 10;

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#003f88]/40";

// gaya input/select filter mobile (sama seperti di jadwal dokter)
const fieldClass =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#003f88] focus:ring-2 focus:ring-[#003f88]/20";

// nomor halaman, loncatan jadi "gap"
const getPageItems = (current: number, total: number): (number | "gap")[] => {
  const pages = [1, total, current - 1, current, current + 1]
    .filter((p) => p >= 1 && p <= total)
    .filter((p, i, arr) => arr.indexOf(p) === i)
    .sort((a, b) => a - b);

  const items: (number | "gap")[] = [];
  pages.forEach((p, i) => {
    if (i > 0) {
      const gap = p - pages[i - 1];
      if (gap === 2) items.push(p - 1);
      else if (gap > 2) items.push("gap");
    }
    items.push(p);
  });
  return items;
};

// jam praktik pada satu hari
const getTimes = (schedules: Schedule[] = [], day: string): string[] =>
  schedules
    .filter((s) => s.day_of_week === day)
    .map((s) => `${s.start_time.slice(0, 5)}–${s.end_time.slice(0, 5)}`);

// jadwal praktik di samping kartu dokter
function DoctorSchedule({ schedules }: Readonly<{ schedules?: Schedule[] }>) {
  const days = PRACTICE_DAYS.map((day) => ({
    day,
    times: getTimes(schedules, day),
  })).filter((d) => d.times.length > 0);

  return (
    <div className="hidden lg:block lg:w-40 xl:w-52 shrink-0 self-stretch border-l border-slate-100 pl-5 pt-8">
      <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-slate-800">
        Jadwal Praktik
      </div>

      {days.length > 0 ? (
        <dl className="space-y-1.5 text-sm">
          {days.map(({ day, times }) => (
            <div key={day} className="flex items-start justify-between gap-3">
              <dt className="text-slate-500">{day}</dt>
              <dd className="text-right tabular-nums text-slate-800">
                {times.map((time, i) => (
                  <span key={`${time}-${i}`} className="block">
                    {time}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-slate-400">Belum ada jadwal praktik</p>
      )}
    </div>
  );
}

// cache dokter agar tidak fetch ulang
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
    return cachedDoctors || [];
  });
  const [loading, setLoading] = useState(!cachedDoctors);
  const [isPaging, setIsPaging] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorWithSchedules | null>(null);

  const searchParams = useSearchParams();
  const urlSpecialty = searchParams.get("specialty") || "";

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

  // --- HELPERS ---
  const jumpToTop = useCallback(() => {
    if (sectionRef.current) {
      const yOffset = -150;
      const elementTop =
        sectionRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementTop + yOffset });
    }
  }, []);

  const getUniqueDoctors = useCallback((doctors: Doctor[]): Doctor[] => {
    const seen = new Set<string | number>();
    return doctors.filter((v) => {
      if (!v.id || seen.has(v.id)) return false;
      seen.add(v.id);
      return true;
    });
  }, []);

  // shuffle array (Fisher-Yates)
  const shuffleArray = useCallback((array: DoctorWithSchedules[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // scroll ke atas saat mount
  useEffect(() => {
    if (globalThis.window) {
      globalThis.window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  // sync filter dari URL specialty
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

  // load data dokter
  useEffect(() => {
    const load = async () => {
      if (cachedDoctors) {
        setDoctors(cachedDoctors);
        setLoading(false);
        return;
      }

      if (isDataLoading) return;

      try {
        isDataLoading = true;
        const data = await fetchAllDoctorsWithSchedules();
        if (data) {
          const uniqueData = getUniqueDoctors(data as DoctorWithSchedules[]);
          const shuffledData = shuffleArray(uniqueData);
          cachedDoctors = shuffledData;
          setDoctors(shuffledData);
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
      } finally {
        isDataLoading = false;
        requestAnimationFrame(() => {
          setLoading(false);
        });
      }
    };
    load();
  }, [getUniqueDoctors, shuffleArray]);

  // reset filter nama saat input dikosongkan
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

  // JSON-LD untuk daftar dokter yang tampil (bantu Google memahami konten)
  const doctorsJsonLd = useMemo(() => {
    if (paginatedDoctors.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: paginatedDoctors.map((doctor, index) => ({
        "@type": "ListItem",
        position: startIndex + index + 1,
        item: {
          "@type": "Physician",
          name: doctor.name,
          medicalSpecialty: doctor.specialty,
          image: doctor.image_url || undefined,
          url: `/dokter/${doctor.id}`,
        },
      })),
    };
  }, [paginatedDoctors, startIndex]);

  const handleApplyFilter = () => {
    setIsPaging(true);
    setActiveFilter(tempFilter);
    setCurrentPage(1);
    jumpToTop();
    setTimeout(() => setIsPaging(false), 400);
  };

  // submit form filter mobile
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApplyFilter();
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
          aria-hidden="true"
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
      const arrow = `flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-[#003f88] transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12 ${focusRing}`;
      const number = `flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-base font-semibold tabular-nums transition-colors sm:h-12 sm:min-w-12 ${focusRing}`;

      return (
        <motion.div
          key="list-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {doctorsJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(doctorsJsonLd),
              }}
            />
          )}

          <ul className="grid grid-cols-1 gap-6 list-none p-0 m-0">
            {paginatedDoctors.map((doctor, index) => (
              <li
                key={`doctor-${doctor.id || index}-${startIndex + index}`}
                itemScope
                itemType="https://schema.org/Physician"
              >
                <article
                  className={`relative group flex flex-row items-start gap-4 md:gap-8 lg:gap-5 xl:gap-8 p-4 md:p-8 lg:p-6 xl:p-8 bg-white border border-slate-100 shadow-sm h-fit rounded-none transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-slate-100 ${
                    doctor.status === "cuti"
                      ? "opacity-60 pointer-events-none"
                      : ""
                  }`}
                >
                  {doctor.status === "cuti" && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"></div>
                  )}
                  {/* foto dokter */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 lg:w-28 lg:h-28 xl:w-36 xl:h-36 shrink-0 rounded-full overflow-hidden shadow-sm bg-slate-100 flex items-center justify-center">
                    {doctor.image_url ? (
                      <Image
                        src={doctor.image_url}
                        alt={`Foto ${doctor.name}, ${doctor.specialty}`}
                        itemProp="image"
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
                        aria-hidden="true"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>

                  {/* detail dokter */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="mb-2 md:mb-4">
                      <h3
                        itemProp="name"
                        className="text-lg md:text-2xl font-bold text-slate-800 mt-0 md:mt-8"
                      >
                        {doctor.name}
                      </h3>
                      <p
                        itemProp="medicalSpecialty"
                        className="text-gray-400 font-semibold text-[10px] md:text-xs mb-1"
                      >
                        {doctor.specialty}
                      </p>
                    </div>

                    <div className="flex flex-row flex-nowrap items-center justify-start gap-2 md:gap-3 w-full">
                      <button
                        onClick={() => setSelectedDoctor(doctor)}
                        aria-label={`Buat janji temu dengan ${doctor.name}`}
                        className="shrink-0 whitespace-nowrap px-4 py-2 md:px-6 md:py-3 lg:px-4 xl:px-6 bg-[#003f88] text-white text-[10px] md:text-[12px] lg:text-[11px] xl:text-[12px] font-bold rounded-full transition-all hover:bg-[#003f88]/90 active:scale-95 cursor-pointer"
                      >
                        Buat Janji Temu
                      </button>

                      <Link
                        href={`/dokter/${doctor.id}`}
                        itemProp="url"
                        aria-label={`Lihat profil ${doctor.name}`}
                        className="shrink-0 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-3 lg:px-4 xl:px-6 bg-white text-slate-600 text-[10px] md:text-[12px] lg:text-[11px] xl:text-[12px] font-bold rounded-full border border-slate-200 transition-all hover:bg-[#e67e22] hover:text-white active:scale-95"
                      >
                        Profil Dokter
                      </Link>
                    </div>
                  </div>

                  {/* jadwal praktik (desktop saja) */}
                  <DoctorSchedule schedules={doctor.schedules} />
                </article>
              </li>
            ))}
          </ul>

          {/* paginasi */}
          {totalPages > 1 && (
            <nav
              aria-label="Navigasi halaman daftar dokter"
              className="mt-2 flex flex-wrap items-center justify-center gap-0.5 pt-4 sm:gap-1 md:mt-12"
            >
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
                className={`${arrow} mr-1 sm:mr-2`}
              >
                <ChevronLeft size={28} strokeWidth={2.25} aria-hidden="true" />
              </button>

              {getPageItems(currentPage, totalPages).map((item, i, items) =>
                item === "gap" ? (
                  <span
                    key={`gap-${items[i - 1]}`}
                    aria-hidden="true"
                    className="w-5 select-none text-center text-slate-400 sm:w-7"
                  >
                    &hellip;
                  </span>
                ) : (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handlePageChange(item)}
                    aria-label={`Halaman ${item}`}
                    aria-current={item === currentPage ? "page" : undefined}
                    className={`${number} ${
                      item === currentPage
                        ? "bg-[#003f88] text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
                className={`${arrow} ml-1 sm:ml-2`}
              >
                <ChevronRight size={28} strokeWidth={2.25} aria-hidden="true" />
              </button>
            </nav>
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
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center h-96 bg-slate-50/50 rounded-none border border-dashed border-slate-200"
      >
        <Search size={40} className="text-slate-300 mb-4" aria-hidden="true" />
        <h3 className="text-slate-500 font-normal">Dokter tidak ditemukan</h3>
      </motion.div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white min-h-screen text-slate-800 relative mb-20"
      id="dokter-spesialis"
      aria-label="Daftar dokter spesialis"
    >
      {/* modal booking */}
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
        {/* breadcrumb & judul */}
        <div className="pt-0 md:pt-9 pb-12">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-4"
          >
            <ol className="flex items-center gap-1 list-none p-0 m-0">
              <li>
                <Link
                  href="/"
                  className="text-black/60 hover:text-gray-300 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={12} className="text-black/60" />
              </li>
              <li aria-current="page" className="font-normal">
                Dokter Kami
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-black border-b border-slate-100 pb-6">
            Dokter Kami
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* filter mobile (sama seperti di jadwal dokter) */}
          <form
            role="search"
            aria-label="Filter pencarian dokter"
            onSubmit={handleSubmit}
            className="lg:hidden grid w-full grid-cols-2 gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 -mt-4"
          >
            {/* input nama */}
            <div className="col-span-2">
              <label
                htmlFor="doctor-name-mobile"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Nama dokter
              </label>
              <div className="relative">
                <Search
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="doctor-name-mobile"
                  type="search"
                  placeholder="Nama dokter"
                  value={tempFilter.name}
                  onChange={(e) =>
                    setTempFilter({ ...tempFilter, name: e.target.value })
                  }
                  enterKeyHint="search"
                  className={`${fieldClass} pl-9`}
                />
              </div>
            </div>

            {/* pilih spesialis */}
            <div>
              <label
                htmlFor="specialty-select-mobile"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Spesialis
              </label>
              <select
                id="specialty-select-mobile"
                value={tempFilter.specialty}
                onChange={(e) =>
                  setTempFilter({ ...tempFilter, specialty: e.target.value })
                }
                className={fieldClass}
              >
                {SPECIALTY_CATEGORIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* pilih hari */}
            <div>
              <label
                htmlFor="day-select-mobile"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Hari praktik
              </label>
              <select
                id="day-select-mobile"
                value={tempFilter.day}
                onChange={(e) =>
                  setTempFilter({ ...tempFilter, day: e.target.value })
                }
                className={fieldClass}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* tombol temukan */}
            <div className="col-span-2">
              <button
                type="submit"
                className={`h-11 w-full rounded-md bg-[#003f88] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#003f88]/90 active:scale-[0.98] cursor-pointer ${focusRing}`}
              >
                Temukan
              </button>
            </div>
          </form>

          {/* sidebar filter desktop */}
          <aside className="hidden lg:block w-1/3 xl:w-1/4 lg:sticky lg:top-45 z-30">
            <search
              className="border border-slate-200 p-8 bg-white rounded-none shadow-sm h-fit block"
              aria-label="Filter pencarian dokter"
            >
              <div className="flex items-center gap-3 mb-8 text-[#003f88] border-b border-slate-50 pb-4">
                <FilterIcon size={18} aria-hidden="true" />
                <h2 className="text-lg font-bold">Filter Pencarian</h2>
              </div>

              {/* input nama */}
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
                    aria-hidden="true"
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

              {/* select spesialis */}
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
                    aria-hidden="true"
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

              {/* pilih hari */}
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
                    aria-hidden="true"
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
            </search>
          </aside>

          {/* konten utama */}
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
