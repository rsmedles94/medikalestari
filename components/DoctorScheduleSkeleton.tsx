"use client";

import React, { useMemo } from "react";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function DoctorScheduleSkeleton() {
  const groupIds = useMemo(() => ["spec-1", "spec-2"], []);

  const doctorsPerGroup = useMemo(
    () => [
      ["doc-1", "doc-2"],
      ["doc-3", "doc-4"],
    ],
    [],
  );

  const mobileListIds = useMemo(
    () => Array.from({ length: 3 }, (_, i) => `mobile-${i}`),
    [],
  );

  const legendIds = useMemo(() => ["legend-1", "legend-2", "legend-3"], []);

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

      {/* DESKTOP TABLE SKELETON (matches new UI: Nama Dokter + 7 hari) */}
      <div className="hidden lg:block w-full overflow-x-auto bg-white border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#003f88] text-white text-sm font-semibold">
              <th className="p-3 border-r border-slate-300 w-1/4">
                <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
              </th>
              {DAYS.map((d) => (
                <th
                  key={d}
                  className="p-3 text-center border-r border-slate-300 last:border-r-0"
                >
                  <div className="h-3 w-14 bg-slate-300 rounded mx-auto animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupIds.map((g, gi) => (
              <React.Fragment key={g}>
                <tr className="bg-slate-50">
                  <td
                    colSpan={DAYS.length + 1}
                    className="p-3 font-semibold text-lg text-black border-b border-slate-200"
                  >
                    <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
                  </td>
                </tr>

                {doctorsPerGroup[gi].map((doc) => (
                  <tr key={doc} className="border-b border-slate-200 text-sm">
                    <td className="p-3 border-r border-slate-200 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-300 animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 bg-slate-300 rounded w-3/4 mb-2 animate-pulse" />
                          <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                        </div>
                      </div>
                    </td>
                    {DAYS.map((d) => (
                      <td
                        key={`${doc}-${d}`}
                        className="p-3 text-center border-r border-slate-200 last:border-r-0 align-middle"
                      >
                        <div className="h-4 w-12 bg-slate-200 rounded mx-auto animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST SKELETON (compact cards matching new mobile UI) */}
      <div className="lg:hidden flex flex-col gap-6">
        {mobileListIds.map((id) => (
          <div
            key={id}
            className="bg-white border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-4 flex items-center gap-4 bg-slate-50">
              <div className="w-12 h-12 rounded-full bg-slate-300 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-slate-300 rounded mb-2 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>

            <div className="border-t border-slate-100 p-3">
              <div className="grid grid-cols-2 gap-2">
                {DAYS.map((d) => (
                  <div key={d} className="p-2 rounded bg-slate-100">
                    <div className="h-3 bg-slate-200 rounded w-24 mb-2 animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded w-16 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LEGEND */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="h-4 w-36 bg-slate-300 rounded animate-pulse mb-3"></div>
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
