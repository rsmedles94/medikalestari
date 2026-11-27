"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Printer,
  Search,
} from "lucide-react";
import { Doctor, Schedule } from "@/lib/types";
import { printSchedule } from "./PrintSchedule";

export interface DoctorWithSchedule extends Doctor {
  schedules: Schedule[];
}

interface DoctorScheduleGridProps {
  doctorsWithSchedules: DoctorWithSchedule[];
  loading?: boolean;
}

export interface Filters {
  name: string;
  specialty: string;
  day: string;
}

// satu kunjungan, dipakai untuk mengacak urutan
interface Visit {
  seed: number;
  previousTop: string;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const PER_PAGE = 24;

const EMPTY_FILTERS: Filters = { name: "", specialty: "", day: "" };
const NO_DOCTORS: DoctorWithSchedule[] = [];

const CACHE_KEY = "doctor-schedule-data";
const CACHE_TTL = 5 * 60 * 1000;
const LAST_TOP_KEY = "doctor-schedule-last-top";

// seberapa sering status "sedang praktik" dicek ulang
const CLOCK_INTERVAL = 30 * 1000;

const fieldClass =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#003f88] focus:ring-2 focus:ring-[#003f88]/20";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#003f88]/40";

/* ---------- store: hari ini ---------- */

const subscribeNothing = () => () => {};
const getToday = (): string | null => DAY_NAMES[new Date().getDay()];
const getServerToday = (): string | null => null;

/* ---------- store: jam sekarang ---------- */

// menit sejak tengah malam; angka sama selama menit berjalan, jadi snapshot stabil
const subscribeClock = (onChange: () => void) => {
  const id = setInterval(onChange, CLOCK_INTERVAL);
  return () => clearInterval(id);
};
const getNowMinutes = (): number | null => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};
const getServerNowMinutes = (): number | null => null;

/* ---------- store: cache ---------- */

// simpan hasil parse supaya referensi snapshot tetap sama
let cacheRaw: string | null = null;
let cacheData: DoctorWithSchedule[] = NO_DOCTORS;
let cacheTime = 0;

const readCache = (): DoctorWithSchedule[] => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return NO_DOCTORS;

    if (raw !== cacheRaw) {
      const { data, timestamp } = JSON.parse(raw);
      cacheData = Array.isArray(data) ? data : NO_DOCTORS;
      cacheTime = timestamp;
      cacheRaw = raw;
    }

    return Date.now() - cacheTime > CACHE_TTL ? NO_DOCTORS : cacheData;
  } catch {
    return NO_DOCTORS;
  }
};

const getServerCache = () => NO_DOCTORS;

const writeCache = (data: DoctorWithSchedule[]) => {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() }),
    );
  } catch {}
};

/* ---------- store: kunjungan ---------- */

let currentVisit: Visit | null = null;

const createVisit = (): Visit => {
  let previousTop = "";
  try {
    previousTop = sessionStorage.getItem(LAST_TOP_KEY) ?? "";
  } catch {}

  return { seed: Math.floor(Math.random() * 0x7fffffff), previousTop };
};

// dipanggil React setiap komponen tampil, jadi acakan selalu baru
const subscribeVisit = (onChange: () => void) => {
  const startVisit = () => {
    currentVisit = createVisit();
    onChange();
  };

  // tombol back browser (bfcache)
  const handlePageShow = (e: PageTransitionEvent) => {
    if (e.persisted) startVisit();
  };

  startVisit();
  window.addEventListener("pageshow", handlePageShow);

  return () => {
    window.removeEventListener("pageshow", handlePageShow);
    currentVisit = null;
  };
};

const getVisit = () => currentVisit;
const getServerVisit = (): Visit | null => null;

// angka acak konsisten untuk pasangan teks + seed
const randomRank = (text: string, seed: number): number => {
  let hash = seed ^ 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash = Math.imul(hash ^ text.charCodeAt(i), 0x01000193);
  }
  hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
  return (hash ^ (hash >>> 16)) >>> 0;
};

/* ---------- helper ---------- */

// jam praktik pada satu hari
const getTimes = (
  schedules: Schedule[] = [],
  day: string,
  separator = " - ",
): string[] =>
  schedules
    .filter((s) => s.day_of_week === day)
    .map(
      (s) => `${s.start_time.slice(0, 5)}${separator}${s.end_time.slice(0, 5)}`,
    );

// "09:30" -> menit sejak tengah malam
const toMinutes = (time: string): number => {
  const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
  return hours * 60 + minutes;
};

// cuti hanya tampil jika dokter praktik hari ini
const isOnLeave = (doctor: DoctorWithSchedule, today: string | null): boolean =>
  doctor.status === "cuti" &&
  !!today &&
  getTimes(doctor.schedules, today).length > 0;

// sedang praktik: jam sekarang ada di dalam salah satu jam praktik hari ini
const isPracticingNow = (
  doctor: DoctorWithSchedule,
  today: string | null,
  nowMinutes: number | null,
): boolean => {
  if (!today || nowMinutes === null) return false;

  return (doctor.schedules ?? []).some(
    (s) =>
      s.day_of_week === today &&
      nowMinutes >= toMinutes(s.start_time) &&
      nowMinutes < toMinutes(s.end_time),
  );
};

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

/* ---------- komponen ---------- */

// nama dokter (tetap bisa diklik walau cuti, tampil merah + penanda (C))
function DoctorName({
  doctor,
  onLeave,
  live,
}: Readonly<{
  doctor: DoctorWithSchedule;
  onLeave: boolean;
  live: boolean;
}>) {
  const colorClass = onLeave
    ? "text-red-600 hover:text-red-800"
    : "text-[#003f88] hover:text-[#e67e22]";

  return (
    <>
      <Link
        href={`/dokter/${doctor.id}`}
        title={`Lihat profil ${doctor.name}`}
        className={`rounded-sm underline decoration-1 decoration-transparent underline-offset-4 transition-colors duration-700 ease-in-out hover:decoration-current ${colorClass} ${focusRing}`}
      >
        {doctor.name}
      </Link>
      {onLeave && (
        <span title="Cuti" className="ml-1.5 font-bold text-red-600">
          <span aria-hidden="true">(C)</span>
          <span className="sr-only">Sedang cuti</span>
        </span>
      )}
      {live && <span className="sr-only"> (sedang praktik)</span>}
    </>
  );
}

// jam praktik satu hari
function TimeCell({
  doctor,
  day,
  isToday,
  onLeave,
  live,
}: Readonly<{
  doctor: DoctorWithSchedule;
  day: string;
  isToday: boolean;
  onLeave: boolean;
  live: boolean;
}>) {
  const times = getTimes(doctor.schedules, day, "–");

  if (times.length === 0) {
    return (
      <span className="text-slate-300">
        <span aria-hidden="true">&ndash;</span>
        <span className="sr-only">Tidak praktik</span>
      </span>
    );
  }

  let timeClass = "text-slate-800";
  if (isToday) {
    if (onLeave) timeClass = "text-red-600 line-through";
    else if (live) timeClass = "font-semibold text-green-700";
    else timeClass = "font-semibold text-[#003f88]";
  }

  return (
    <>
      {times.map((time, i) => (
        <span key={`${time}-${i}`} className={`block ${timeClass}`}>
          {time}
        </span>
      ))}
    </>
  );
}

// tabel jadwal per spesialis
function ScheduleTable({
  specialty,
  doctors,
  today,
  nowMinutes,
}: Readonly<{
  specialty: string;
  doctors: DoctorWithSchedule[];
  today: string | null;
  nowMinutes: number | null;
}>) {
  return (
    <>
      {/* desktop: tabel */}
      <div className="hidden overflow-hidden rounded-lg border border-t-4 border-slate-200 border-t-[#003f88] bg-white lg:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <caption className="sr-only">Jadwal dokter {specialty}</caption>
          <colgroup>
            <col className="w-[24%]" />
            {DAYS.map((day) => (
              <col key={day} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-slate-50 font-semibold text-slate-600">
              <th scope="col" className="px-4 py-3">
                Nama dokter
              </th>
              {DAYS.map((day) => {
                const isToday = day === today;
                return (
                  <th
                    key={day}
                    scope="col"
                    className={`px-2 py-3 text-center ${
                      isToday ? "bg-[#003f88] text-white" : ""
                    }`}
                  >
                    {day}
                    {isToday && <span className="sr-only"> (hari ini)</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => {
              const onLeave = isOnLeave(doctor, today);
              // cuti lebih diutamakan daripada hijau
              const live =
                !onLeave && isPracticingNow(doctor, today, nowMinutes);

              let rowClass = "hover:bg-slate-50";
              if (onLeave) rowClass = "bg-red-500/10 hover:bg-red-500/15";
              else if (live) rowClass = "bg-green-500/10 hover:bg-green-500/15";

              return (
                <tr
                  key={doctor.id}
                  className={`border-t border-slate-200 align-top transition-colors ${rowClass}`}
                >
                  <th scope="row" className="px-4 py-3 text-left font-semibold">
                    <DoctorName doctor={doctor} onLeave={onLeave} live={live} />
                  </th>
                  {DAYS.map((day) => {
                    const isToday = day === today;

                    // hari ini: merah jika cuti, hijau jika sedang praktik, biru muda jika normal
                    let cellBg = "";
                    if (isToday) {
                      if (onLeave) cellBg = "bg-red-500/10";
                      else if (live) cellBg = "bg-green-500/10";
                      else cellBg = "bg-[#003f88]/5";
                    }

                    return (
                      <td
                        key={day}
                        className={`px-2 py-3 text-center tabular-nums ${cellBg}`}
                      >
                        <TimeCell
                          doctor={doctor}
                          day={day}
                          isToday={isToday}
                          onLeave={onLeave}
                          live={live}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* layar kecil: daftar, hanya hari praktik */}
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-t-4 border-slate-200 border-t-[#003f88] bg-white px-4 lg:hidden">
        {doctors.map((doctor) => {
          const onLeave = isOnLeave(doctor, today);
          const live = !onLeave && isPracticingNow(doctor, today, nowMinutes);
          const practiceDays = DAYS.filter(
            (day) => getTimes(doctor.schedules, day).length > 0,
          );

          let itemClass = "";
          if (onLeave) itemClass = "-mx-4 bg-red-500/10 px-4";
          else if (live) itemClass = "-mx-4 bg-green-500/10 px-4";

          let todayBadge = "";
          if (onLeave) todayBadge = "rounded bg-red-500/15 px-2";
          else if (live) todayBadge = "rounded bg-green-500/15 px-2";

          return (
            <li key={doctor.id} className={`py-3 ${itemClass}`}>
              <p className="font-semibold">
                <DoctorName doctor={doctor} onLeave={onLeave} live={live} />
              </p>

              {practiceDays.length > 0 ? (
                <dl className="mt-2 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
                  {practiceDays.map((day) => {
                    const isToday = day === today;
                    return (
                      <div
                        key={day}
                        className="flex items-start justify-between gap-3"
                      >
                        <dt
                          className={
                            isToday
                              ? "font-semibold text-[#003f88]"
                              : "text-slate-500"
                          }
                        >
                          {day}
                          {isToday && (
                            <span className="sr-only"> (hari ini)</span>
                          )}
                        </dt>
                        <dd
                          className={`text-right tabular-nums ${
                            isToday ? todayBadge : ""
                          }`}
                        >
                          <TimeCell
                            doctor={doctor}
                            day={day}
                            isToday={isToday}
                            onLeave={onLeave}
                            live={live}
                          />
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              ) : (
                <p className="mt-2 text-sm text-slate-400">
                  Belum ada jadwal praktik
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

// navigasi halaman
function Pagination({
  current,
  total,
  onChange,
}: Readonly<{
  current: number;
  total: number;
  onChange: (page: number) => void;
}>) {
  const arrow = `flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-[#003f88] transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-30 sm:h-12 sm:w-12 ${focusRing}`;
  const number = `flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-base font-semibold tabular-nums transition-colors sm:h-12 sm:min-w-12 ${focusRing}`;

  return (
    <nav
      aria-label="Navigasi halaman jadwal dokter"
      className="flex flex-wrap items-center justify-center gap-0.5 pt-4 sm:gap-1"
    >
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="Halaman sebelumnya"
        className={`${arrow} mr-1 sm:mr-2`}
      >
        <ChevronLeft size={28} strokeWidth={2.25} aria-hidden="true" />
      </button>

      {getPageItems(current, total).map((item, i, items) =>
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
            onClick={() => onChange(item)}
            aria-label={`Halaman ${item}`}
            aria-current={item === current ? "page" : undefined}
            className={`${number} ${
              item === current
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
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="Halaman berikutnya"
        className={`${arrow} ml-1 sm:ml-2`}
      >
        <ChevronRight size={28} strokeWidth={2.25} aria-hidden="true" />
      </button>
    </nav>
  );
}

export default function DoctorScheduleGrid({
  doctorsWithSchedules = NO_DOCTORS,
  loading = false,
}: Readonly<DoctorScheduleGridProps>) {
  // useSyncExternalStore: aman untuk SSR, tanpa setState di effect
  const cached = useSyncExternalStore(
    subscribeNothing,
    readCache,
    getServerCache,
  );
  const today = useSyncExternalStore(
    subscribeNothing,
    getToday,
    getServerToday,
  );
  const nowMinutes = useSyncExternalStore(
    subscribeClock,
    getNowMinutes,
    getServerNowMinutes,
  );
  const visit = useSyncExternalStore(subscribeVisit, getVisit, getServerVisit);

  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (doctorsWithSchedules.length > 0) writeCache(doctorsWithSchedules);
  }, [doctorsWithSchedules]);

  // props jadi sumber utama, cache cadangan
  const doctors =
    doctorsWithSchedules.length > 0 ? doctorsWithSchedules : cached;

  // pilihan dropdown, urut abjad
  const specialties = useMemo(
    () =>
      Array.from(new Set(doctors.map((doc) => doc.specialty))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [doctors],
  );

  // urutan spesialis diacak tiap kunjungan
  const specialtyOrder = useMemo(() => {
    const order = [...specialties];
    if (!visit) return order;

    order.sort((a, b) => randomRank(a, visit.seed) - randomRank(b, visit.seed));

    // spesialis teratas harus beda dari kunjungan sebelumnya
    if (order.length > 1 && order[0] === visit.previousTop) {
      order.push(...order.splice(0, 1));
    }
    return order;
  }, [specialties, visit]);

  // dokter tetap per spesialis, urutan di dalamnya diacak
  const orderedDoctors = useMemo(() => {
    const position = new Map(specialtyOrder.map((s, i) => [s, i]));

    return [...doctors].sort((a, b) => {
      const bySpecialty =
        (position.get(a.specialty) ?? 0) - (position.get(b.specialty) ?? 0);
      if (bySpecialty !== 0) return bySpecialty;

      return visit
        ? randomRank(String(a.id), visit.seed) -
            randomRank(String(b.id), visit.seed)
        : a.name.localeCompare(b.name);
    });
  }, [doctors, specialtyOrder, visit]);

  // simpan spesialis teratas untuk kunjungan berikutnya
  const topSpecialty = specialtyOrder[0];
  useEffect(() => {
    if (!visit || !topSpecialty) return;
    try {
      sessionStorage.setItem(LAST_TOP_KEY, topSpecialty);
    } catch {}
  }, [visit, topSpecialty]);

  const filteredDoctors = useMemo(() => {
    const query = applied.name.trim().toLowerCase();

    return orderedDoctors.filter((doc) => {
      if (applied.specialty && doc.specialty !== applied.specialty)
        return false;
      if (query && !doc.name.toLowerCase().includes(query)) return false;
      if (
        applied.day &&
        !doc.schedules?.some((s) => s.day_of_week === applied.day)
      )
        return false;
      return true;
    });
  }, [orderedDoctors, applied]);

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const pageDoctors = useMemo(
    () =>
      filteredDoctors.slice(
        (currentPage - 1) * PER_PAGE,
        currentPage * PER_PAGE,
      ),
    [filteredDoctors, currentPage],
  );

  // dokter di halaman ini per spesialis
  const groups = useMemo(() => {
    const result: { specialty: string; doctors: DoctorWithSchedule[] }[] = [];
    for (const doc of pageDoctors) {
      const last = result[result.length - 1];
      if (last?.specialty === doc.specialty) last.doctors.push(doc);
      else result.push({ specialty: doc.specialty, doctors: [doc] });
    }
    return result;
  }, [pageDoctors]);

  const structuredData = useMemo(() => {
    if (filteredDoctors.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: filteredDoctors.map((doc, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Physician",
          name: doc.name,
          medicalSpecialty: doc.specialty,
          image: doc.image_url || undefined,
        },
      })),
    };
  }, [filteredDoctors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(draft);
    setPage(1);
  };

  const handleNameChange = (value: string) => {
    setDraft((prev) => ({ ...prev, name: value }));
    if (value === "") {
      setApplied((prev) => ({ ...prev, name: "" }));
      setPage(1);
    }
  };

  const handlePageChange = (next: number) => {
    setPage(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // cetak semua hasil filter, bukan hanya halaman yang tampil
  const handlePrint = () => printSchedule(filteredDoctors, applied, today);

  if (loading && doctors.length === 0) {
    return (
      <div className="flex min-h-80 w-full flex-col items-center justify-center gap-3">
        <Loader2
          className="h-8 w-8 animate-spin text-[#003f88]"
          aria-hidden="true"
        />
        <p className="text-sm text-slate-500">Memuat jadwal dokter...</p>
      </div>
    );
  }

  return (
    <section className="w-full space-y-6" aria-label="Jadwal dokter">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      )}

      {/* pencarian dan filter */}
      <form
        role="search"
        aria-label="Cari jadwal dokter"
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end"
      >
        <div>
          <label
            htmlFor="filter-name"
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
              id="filter-name"
              type="search"
              placeholder="Nama dokter"
              value={draft.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`${fieldClass} pl-9`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="filter-specialty"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Spesialis
          </label>
          <select
            id="filter-specialty"
            value={draft.specialty}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, specialty: e.target.value }))
            }
            className={fieldClass}
          >
            <option value="">Semua spesialis</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-day"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Hari praktik
          </label>
          <select
            id="filter-day"
            value={draft.day}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, day: e.target.value }))
            }
            className={fieldClass}
          >
            <option value="">Semua hari</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className={`h-11 flex-1 rounded-md bg-[#003f88] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#003f88]/90 active:scale-[0.98] lg:flex-none ${focusRing}`}
          >
            Temukan
          </button>
        </div>
      </form>

      {/* legenda dan tombol cetak */}
      <div
        ref={topRef}
        className="flex scroll-mt-32 flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-slate-500"
      >
        {/* penanda legenda */}
        <ul className="flex flex-wrap gap-4 text-sm font-bold items-center -mt-2 list-none p-0">
          <li className="text-[#003f88] flex items-center gap-1">
            (*) Poliklinik Eksekutif
          </li>
          <li className="text-green-600 flex items-center gap-1">
            (P) Sedang Praktik
          </li>
          <li className="text-red-600 flex items-center gap-1">(C) Cuti</li>
        </ul>

        <button
          type="button"
          onClick={handlePrint}
          disabled={filteredDoctors.length === 0}
          className={`inline-flex items-center gap-2 rounded-sm font-semibold text-[#003f88] underline decoration-1 decoration-transparent underline-offset-4 transition-colors duration-700 ease-in-out hover:text-[#e67e22] hover:decoration-current ${focusRing}`}
        >
          <Printer size={16} aria-hidden="true" />
          Print Jadwal
        </button>

        {/* jumlah hasil untuk pembaca layar */}
        <p aria-live="polite" className="sr-only">
          {filteredDoctors.length} dokter ditemukan
        </p>
      </div>

      {/* daftar dokter per spesialis */}
      {groups.length > 0 ? (
        // disembunyikan sesaat sampai urutan acak siap
        <div className={`space-y-6 ${visit ? "" : "invisible"}`}>
          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.specialty}>
                <div className="flex items-baseline justify-between gap-4 pb-2">
                  <h3 className="text-xl font-bold tracking-tight text-[#003f88]">
                    Dokter {group.specialty}
                  </h3>
                </div>

                <ScheduleTable
                  specialty={group.specialty}
                  doctors={group.doctors}
                  today={today}
                  nowMinutes={nowMinutes}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              current={currentPage}
              total={totalPages}
              onChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-[#003f88]/30 bg-[#003f88]/5 py-12 text-center">
          <p className="text-sm font-medium text-[#003f88]">
            Tidak ada jadwal dokter yang cocok dengan pencarian Anda.
          </p>
        </div>
      )}
    </section>
  );
}
