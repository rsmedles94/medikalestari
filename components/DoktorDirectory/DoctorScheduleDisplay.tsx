"use client";
import React from "react";
import { Schedule } from "@/lib/types";

interface DoctorScheduleDisplayProps {
  schedules: Schedule[];
  onBooking: () => void;
  doctorStatus?: "hadir" | "cuti";
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function DoctorScheduleDisplay({
  schedules,
  onBooking,
  doctorStatus = "hadir",
}: Readonly<DoctorScheduleDisplayProps>) {
  const getScheduleForCell = (day: string, row: number) => {
    const daySchedules = schedules.filter((s) => s.day_of_week === day);
    if (row === 1) return daySchedules.slice(0, 1); // Jam pertama
    if (row === 2) return daySchedules.slice(1, 2); // Jam kedua
    return [];
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-gray-700 mb-4">Jadwal Praktek</h3>

      {/* CONTAINER UTAMA */}
      <div className="relative border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] bg-white">
        {/* Status cuti Badge */}
        {doctorStatus === "cuti" && (
          <div className="absolute -top-2 -right-4 z-10">
            <span className="text-red-500 font-bold text-5xl">c</span>
          </div>
        )}

        {/* 1. TAMPILAN MOBILE (Hanya menampilkan hari yang ada jadwal) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {DAYS.map((day) => {
            const slot1 = getScheduleForCell(day, 1);
            const slot2 = getScheduleForCell(day, 2);

            // LOGIC: Jika kedua slot kosong, sembunyikan hari ini
            if (slot1.length === 0 && slot2.length === 0) {
              return null;
            }

            return (
              <div
                key={day}
                className="p-3 flex items-center justify-between text-xs"
              >
                {/* Nama Hari */}
                <span className="font-semibold text-slate-800 w-24">{day}</span>

                {/* Jam Praktek */}
                <div className="flex flex-col gap-1 text-right">
                  {slot1.length > 0 && (
                    <span className="font-medium text-slate-700">
                      {slot1[0].start_time.substring(0, 5)} -{" "}
                      {slot1[0].end_time.substring(0, 5)}
                    </span>
                  )}

                  {slot2.length > 0 && (
                    <span className="font-medium text-slate-700">
                      {slot2[0].start_time.substring(0, 5)} -{" "}
                      {slot2[0].end_time.substring(0, 5)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* FALLBACK: Jika dokter tidak punya jadwal sama sekali dalam seminggu */}
          {DAYS.every(
            (day) =>
              getScheduleForCell(day, 1).length === 0 &&
              getScheduleForCell(day, 2).length === 0,
          ) && (
            <div className="p-4 text-center text-xs text-slate-400">
              Tidak ada jadwal praktek minggu ini.
            </div>
          )}
        </div>

        {/* 2. TAMPILAN DESKTOP (Tabel Utuh Semua Hari) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-[#003f88]">
                {DAYS.map((day, index) => (
                  <th
                    key={day}
                    className={`py-4 px-2 text-[12px] font-semibold text-white border-b border-r border-slate-200 last:border-r-0 text-center ${
                      index === 0 ? "border-l border-slate-200" : ""
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Slot 1 & Slot 2 */}
              {[1, 2].map((slotNum) => (
                <tr key={slotNum}>
                  {DAYS.map((day, index) => {
                    const rowSchedules = getScheduleForCell(day, slotNum);
                    return (
                      <td
                        key={`${day}-${slotNum}`}
                        className={`border-b border-r border-slate-100 p-3 h-20 text-center ${
                          index === 0 ? "border-l border-slate-100" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          {rowSchedules.length > 0 ? (
                            <span className="text-[11px] font-medium text-slate-700 block whitespace-nowrap">
                              {rowSchedules[0].start_time.substring(0, 5)} -{" "}
                              {rowSchedules[0].end_time.substring(0, 5)}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 flex justify-end md:justify-start mb-20 md:mb-0">
        <button
          onClick={onBooking}
          disabled={doctorStatus === "cuti"}
          className={`px-10 py-4 rounded-full font-bold transition-all duration-300 text-sm tracking-wide cursor-pointer active:scale-95 ${
            doctorStatus === "cuti"
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-[#003f88] hover:bg-[#003f88]/90 text-white"
          }`}
        >
          Buat Janji Temu
        </button>
      </div>
    </div>
  );
}
