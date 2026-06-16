"use client";

import React, { useMemo } from "react";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function DoctorScheduleSkeleton() {
  const groupIds = useMemo(() => ["spec-1", "spec-2"], []);

  const doctorsPerGroup = useMemo(
    () => [
      ["doc-1", "doc-2", "doc-3"],
      ["doc-4", "doc-5", "doc-6"],
    ],
    [],
  );

  const mobileListIds = useMemo(
    () => Array.from({ length: 3 }, (_, i) => `mobile-${i}`),
    [],
  );

  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* SEARCH & FILTER SKELETON */}
      <div className="space-y-4">
        <div className="lg:hidden flex items-center gap-2">
          <div className="flex-1 h-11 bg-slate-200 rounded-lg" />
          <div className="h-11 w-12 bg-slate-200 rounded-lg" />
          <div className="h-11 w-12 bg-slate-200 rounded-lg" />
          <div className="h-11 w-16 rounded-lg bg-slate-200" />
        </div>

        <div className="hidden lg:grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
            <div className="h-11 bg-white border border-slate-200 rounded" />
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <div className="h-4 w-28 bg-slate-200 rounded mb-2"></div>
              <div className="h-11 bg-white border border-slate-200 rounded" />
            </div>
            <div className="h-11 w-12 rounded bg-slate-200" />
            <div className="h-11 w-20 rounded bg-slate-200" />
          </div>
        </div>
      </div>

      {/* DESKTOP TABLE SKELETON */}
      <div className="hidden lg:block w-full overflow-x-auto bg-white border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#003f88] text-white text-sm font-semibold">
              <th className="p-3 border-r border-slate-300 w-1/4">
                <div className="h-4 w-36 bg-white/20 rounded" />
              </th>
              {DAYS.map((d) => (
                <th
                  key={d}
                  className="p-3 text-center border-r border-slate-300 last:border-r-0"
                >
                  <div className="h-3 w-14 bg-white/20 rounded mx-auto" />
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
                    <div className="h-6 w-48 bg-slate-200 rounded" />
                  </td>
                </tr>

                {doctorsPerGroup[gi]?.map((doc) => (
                  <tr key={doc} className="border-b border-slate-200 text-sm">
                    <td className="p-3 border-r border-slate-200 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-slate-200 rounded w-1/2" />
                        </div>
                      </div>
                    </td>
                    {DAYS.map((d) => (
                      <td
                        key={`${doc}-${d}`}
                        className="p-3 text-center border-r border-slate-200 last:border-r-0 align-middle"
                      >
                        <div className="h-4 w-16 bg-slate-200 rounded mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST SKELETON */}
      <div className="lg:hidden flex flex-col gap-6">
        {mobileListIds.map((id) => (
          <div
            key={id}
            className="bg-white border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-4 flex items-center gap-4 bg-slate-50">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="flex-1">
                <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>

            <div className="border-t border-slate-100 p-3">
              <div className="grid grid-cols-2 gap-2">
                {DAYS.map((d) => (
                  <div key={d} className="p-2 rounded bg-slate-50">
                    <div className="h-3 bg-slate-200 rounded w-16 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LEGEND SKELETON */}
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-32 bg-slate-200 rounded" />
        ))}
      </div>
    </div>
  );
}
