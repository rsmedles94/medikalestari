"use client";

import React, { useMemo } from "react";

export default function DoctorDetailSkeleton() {
  // Generate stable IDs
  const socialIds = useMemo(
    () => Array.from({ length: 3 }, (_, i) => `social-${i}`),
    [],
  );
  const biodataIds = useMemo(
    () => Array.from({ length: 4 }, (_, i) => `biodata-line-${i}`),
    [],
  );
  const headerIds = useMemo(
    () => Array.from({ length: 7 }, (_, i) => `header-${i}`),
    [],
  );
  const scheduleRowIds = useMemo(
    () => Array.from({ length: 2 }, (_, i) => `schedule-row-${i}`),
    [],
  );
  const recommendIds = useMemo(
    () => Array.from({ length: 4 }, (_, i) => `recommend-${i}`),
    [],
  );

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Kontainer Grid Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
          {/* KOLOM KIRI: STICKY IMAGE & SOCIALS */}
          <aside className="lg:col-span-4 lg:sticky lg:top-60 flex flex-col items-center">
            {/* Profile Image Skeleton */}
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-slate-300 animate-pulse border-8 border-white shadow-lg"></div>

            {/* Social Share Section Skeleton */}
            <section className="mt-10 flex flex-col items-center gap-4">
              <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
              <div className="flex gap-4">
                {socialIds.map((id) => (
                  <div
                    key={id}
                    className="w-11 h-11 rounded-full bg-slate-200 animate-pulse"
                  ></div>
                ))}
              </div>
            </section>
          </aside>

          {/* KOLOM KANAN: INFO, BIODATA & JADWAL */}
          <div className="lg:col-span-8 space-y-8">
            {/* Doctor Name & Specialty Skeleton */}
            <header>
              <div className="h-12 w-64 bg-slate-300 rounded animate-pulse mb-3"></div>
              <div className="h-5 w-48 bg-slate-200 rounded animate-pulse"></div>
            </header>

            {/* BIODATA */}
            <section>
              <div className="h-5 w-20 bg-slate-300 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                {biodataIds.map((id) => (
                  <div
                    key={id}
                    className="h-4 w-full bg-slate-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </section>

            {/* JADWAL PRAKTEK */}
            <section className="pt-10 border-t border-slate-100">
              <div className="h-5 w-24 bg-slate-300 rounded animate-pulse mb-4"></div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      {headerIds.map((id) => (
                        <th
                          key={id}
                          className="py-3 px-3 border-r border-slate-200 last:border-r-0"
                        >
                          <div className="h-3 w-8 bg-slate-200 rounded animate-pulse mx-auto"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleRowIds.map((id) => (
                      <tr key={id} className="border-b border-slate-200">
                        {Array.from({ length: 7 }).map((_, colIdx) => (
                          <td
                            key={`${id}-col-${colIdx}`}
                            className="py-4 px-3 border-r border-slate-200 last:border-r-0 text-center"
                          >
                            <div className="h-3 w-10 bg-slate-200 rounded animate-pulse mx-auto"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 h-12 w-40 bg-slate-300 rounded-full animate-pulse"></div>
            </section>

            {/* REKOMENDASI DOKTER */}
            <section className="pt-10 border-t border-slate-100">
              <div className="h-5 w-40 bg-slate-300 rounded animate-pulse mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendIds.map((id) => (
                  <div
                    key={id}
                    className="p-4 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
