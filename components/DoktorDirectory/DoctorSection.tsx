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
const ITEMS_PER_PAGE = 10;

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#003f88]/40";

// gaya input & select filter mobile (sama dengan jadwal dokter mobile)
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

  // submit form filter mobile (tombol Temukan atau Enter)
  const handleMobileSubmit = (e: React.FormEvent) => {
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
          className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-6"
          aria-hidden="true"
        >
          {/* mobile: 4 kartu (2 baris x 2 kolom), md ke atas: 3 kartu */}
          {new Array(4).fill(null).map((_, i) => (
            <div
              key={`skeleton-${i}-${loading ? "load" : "page"}`}
              className={`h-full min-w-0 ${i === 3 ? "md:hidden" : ""}`}
            >
              <DoctorSkeleton />
            </div>
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
                __html: JSON.stringify(doctorsJsonLd).replace(/</g, "\\u003c"),
              }}
            />
          )}

          <h2 className="sr-only">Daftar dokter</h2>

          {/* mobile: 2 kolom (kartu vertikal), md ke atas: 1 kolom (kartu horizontal) */}
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-1 md:gap-6">
            {paginatedDoctors.map((doctor, index) => (
              <li
                key={`doctor-${doctor.id || index}-${startIndex + index}`}
                itemScope
                itemType="https://schema.org/Physician"
                className="min-w-0"
              >
                <article
                  className={`group relative flex h-full min-h-88 flex-col items-center gap-4 rounded-none border border-slate-100 bg-white p-4 pt-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-slate-100 hover:shadow-xl md:h-fit md:min-h-0 md:flex-row md:items-start md:gap-8 md:p-8 md:text-left ${
                    doctor.status === "cuti"
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  {/* foto dokter */}
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 shadow-sm sm:h-36 sm:w-36 md:h-44 md:w-44">
                    {doctor.image_url ? (
                      <Image
                        src={doctor.image_url}
                        alt={`Foto ${doctor.name}, ${doctor.specialty}`}
                        itemProp="image"
                        fill
                        className="object-cover"
                        priority={index < 3}
                        sizes="(max-width: 768px) 144px, 176px"
                      />
                    ) : (
                      <svg
                        className="h-1/2 w-1/2 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>

                  {/* detail dokter */}
                  <div className="flex w-full min-w-0 flex-1 flex-col">
                    <header className="mb-4">
                      <h3
                        itemProp="name"
                        className="mt-0 line-clamp-2 min-h-10 wrap-break-word text-sm font-bold leading-snug text-slate-800 sm:min-h-11 sm:text-base md:mt-8 md:line-clamp-none md:min-h-0 md:text-2xl"
                      >
                        {doctor.name}
                      </h3>
                      <p
                        itemProp="medicalSpecialty"
                        className="mt-1 line-clamp-2 min-h-8 text-[10px] font-semibold text-gray-400 md:line-clamp-none md:min-h-0 md:text-xs"
                      >
                        {doctor.specialty}
                      </p>
                    </header>

                    {/* tombol: bertumpuk di mobile, sejajar di md ke atas */}
                    <div className="mt-auto flex w-full flex-col gap-2.5 md:flex-row md:items-center md:justify-start md:gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedDoctor(doctor)}
                        aria-label={`Buat janji temu dengan ${doctor.name}`}
                        className={`w-full cursor-pointer whitespace-nowrap rounded-full bg-[#003f88] px-3 py-2.5 text-[11px] font-bold text-white transition-all hover:bg-[#003f88]/90 active:scale-95 md:w-auto md:shrink-0 md:px-8 md:py-3 md:text-[12px] ${focusRing}`}
                      >
                        Buat Janji Temu
                      </button>

                      <Link
                        href={`/dokter/${doctor.id}`}
                        itemProp="url"
                        aria-label={`Lihat profil ${doctor.name}`}
                        className={`inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-2.5 text-[11px] font-bold text-slate-600 transition-all hover:bg-[#e67e22] hover:text-white active:scale-95 md:w-auto md:shrink-0 md:px-8 md:py-3 md:text-[12px] ${focusRing}`}
                      >
                        Profil Dokter
                      </Link>
                    </div>
                  </div>
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
        className="flex h-96 flex-col items-center justify-center rounded-none border border-dashed border-slate-200 bg-slate-50/50"
      >
        <Search size={40} className="mb-4 text-slate-300" aria-hidden="true" />
        <h3 className="font-normal text-slate-500">Dokter tidak ditemukan</h3>
      </motion.div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative mb-20 min-h-screen w-full bg-white text-slate-800"
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

      <div className="mx-auto w-full max-w-[1139px] px-4 py-8 md:py-8">
        {/* breadcrumb & judul */}
        <header className="pb-12 pt-0 md:pt-9">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1 text-[14px] font-normal text-gray-300"
          >
            <ol className="m-0 flex list-none items-center gap-1 p-0">
              <li>
                <Link
                  href="/"
                  className="text-black/60 transition-colors hover:text-gray-300"
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
          <h1 className="border-b border-slate-100 pb-6 text-3xl font-bold text-black md:text-4xl">
            Dokter Kami
          </h1>
        </header>

        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* filter mobile (sama dengan filter jadwal dokter mobile) */}
          <div className="-mt-4 w-full lg:hidden">
            <form
              role="search"
              aria-label="Cari dokter"
              onSubmit={handleMobileSubmit}
              className="grid grid-cols-2 gap-4 rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <h2 className="sr-only">Filter pencarian dokter</h2>

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
                      setTempFilter((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
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
                    setTempFilter((prev) => ({
                      ...prev,
                      specialty: e.target.value,
                    }))
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
                    setTempFilter((prev) => ({ ...prev, day: e.target.value }))
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
                  className={`h-11 w-full cursor-pointer rounded-md bg-[#003f88] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#003f88]/90 active:scale-[0.98] ${focusRing}`}
                >
                  Temukan
                </button>
              </div>
            </form>
          </div>

          {/* sidebar filter desktop */}
          <aside
            aria-label="Filter dokter"
            className="z-30 hidden w-1/3 lg:sticky lg:top-45 lg:block xl:w-1/4"
          >
            <search
              className="block h-fit rounded-none border border-slate-200 bg-white p-8 shadow-sm"
              aria-label="Filter pencarian dokter"
            >
              <div className="mb-8 flex items-center gap-3 border-b border-slate-50 pb-4 text-[#003f88]">
                <FilterIcon size={18} aria-hidden="true" />
                <h2 className="text-lg font-bold">Filter Pencarian</h2>
              </div>

              {/* input nama */}
              <div className="mb-6">
                <label
                  htmlFor="doctor-name"
                  className="mb-2 block text-sm font-bold text-[#003f88]"
                >
                  Nama Dokter
                </label>
                <div className="relative">
                  <User
                    className="absolute bottom-3 left-0 text-slate-400"
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
                    className="w-full rounded-none border-b border-slate-200 bg-transparent py-2 pl-7 text-sm outline-none focus:border-[#003f88]"
                  />
                </div>
              </div>

              {/* select spesialis */}
              <div className="mb-6">
                <label
                  htmlFor="specialty-select"
                  className="mb-2 block text-sm font-bold text-[#003f88]"
                >
                  Spesialis
                </label>
                <div className="relative">
                  <Stethoscope
                    className="absolute bottom-3 left-0 text-slate-400"
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
                    className="w-full cursor-pointer appearance-none rounded-none border-b border-slate-200 bg-transparent py-2 pl-7 text-sm outline-none"
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
                  className="mb-2 block text-sm font-bold text-[#003f88]"
                >
                  Pilih Hari
                </label>
                <div className="relative">
                  <CalendarDays
                    className="absolute bottom-3 left-0 text-slate-400"
                    size={16}
                    aria-hidden="true"
                  />
                  <select
                    id="day-select"
                    value={tempFilter.day}
                    onChange={(e) =>
                      setTempFilter({ ...tempFilter, day: e.target.value })
                    }
                    className="w-full cursor-pointer appearance-none rounded-none border-b border-slate-200 bg-transparent py-2 pl-7 text-sm outline-none"
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
                type="button"
                onClick={handleApplyFilter}
                className="w-full cursor-pointer rounded-full bg-[#003f88] py-4 font-bold text-white transition-all hover:bg-[#003f88]/90 active:scale-[0.98]"
              >
                Temukan Dokter
              </button>
            </search>
          </aside>

          {/* konten utama */}
          <div className="relative z-20 min-h-150 w-full lg:w-2/3 xl:w-3/4">
            {/* jumlah hasil untuk pembaca layar */}
            <p aria-live="polite" className="sr-only">
              {loading ? "" : `${filteredDoctors.length} dokter ditemukan`}
            </p>

            <AnimatePresence mode="wait" initial={false}>
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorSection;
