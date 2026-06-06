"use client";

import React, { useMemo } from "react";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function DoctorScheduleSkeleton() {
  const cardIds = useMemo(
    () => Array.from({ length: 3 }, (_, i) => `card-${i}`),
    [],
  );

  const mobileListIds = useMemo(
    () => Array.from({ length: 3 }, (_, i) => `mobile-${i}`),
    [],
  );

  const legendIds = useMemo(() => ["legend-1", "legend-2"], []);

  return (
    <div className="w-full space-y-6">
      {/* SEARCH & FILTER SKELETON */}
      <div className="space-y-4">
        <div className="lg:hidden flex items-center gap-2">
          <div className="flex-1 h-12 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-12 rounded bg-slate-200 animate-pulse" />
          <div className="h-10 w-12 rounded bg-slate-200 animate-pulse" />
          <div className="h-10 w-20 rounded bg-slate-200 animate-pulse" />
        </div>

        <div className="hidden lg:grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-32 bg-slate-200 rounded mb-2 animate-pulse"></div>
            <div className="h-12 bg-white border border-slate-200 rounded animate-pulse" />
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <div className="h-4 w-28 bg-slate-200 rounded mb-2 animate-pulse"></div>
              <div className="h-10 bg-white border border-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-12 rounded bg-slate-200 animate-pulse" />
            <div className="h-10 w-20 rounded bg-slate-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* GRID CARDS SKELETON (DESKTOP) */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardIds.map((id) => (
          <div
            key={id}
            className="bg-white border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-4 bg-slate-50 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-300 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-slate-300 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-300">
                    {DAYS.map((d) => (
                      <th key={d} className="py-2 px-1 text-center text-white">
                        <div className="h-3 w-8 bg-slate-300 rounded mx-auto animate-pulse" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([0, 1] as const).map((r) => (
                    <tr key={`row-${r}`}>
                      {DAYS.map((d) => (
                        <td
                          key={`${d}-${r}`}
                          className="py-2 px-1 text-center h-12 align-middle"
                        >
                          <div className="h-4 w-8 bg-slate-200 rounded mx-auto animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE LIST SKELETON */}
      <div className="lg:hidden flex flex-col gap-6">
        {mobileListIds.map((id) => (
          <div
            key={id}
            className="bg-white border border-slate-200 shadow-sm overflow-hidden animate-pulse"
          >
            <div className="p-4 flex items-center gap-4 bg-slate-50">
              <div className="w-14 h-14 rounded-full bg-slate-300" />
              <div className="flex-1">
                <div className="h-4 bg-slate-300 rounded mb-2" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>

            <div className="border-t border-slate-100 p-3">
              <div className="grid grid-cols-7 gap-2">
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="h-8 bg-slate-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LEGEND */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="h-4 w-28 bg-slate-300 rounded animate-pulse mb-3"></div>
        <div className="space-y-2">
          {legendIds.map((id) => (
            <div
              key={id}
              className="h-3 w-48 bg-slate-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
