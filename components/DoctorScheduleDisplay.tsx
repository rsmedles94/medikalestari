"use client";
import React from "react";
import { Schedule } from "@/lib/types";

interface DoctorScheduleDisplayProps {
  schedules: Schedule[];
  onBooking: () => void;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default function DoctorScheduleDisplay({
  schedules,
  onBooking,
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

      <div className="overflow-x-auto border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] bg-white">
        <table className="w-full border-collapse table-fixed min-w-[650px]">
          <thead>
            <tr className="bg-[#00796e]/10">
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="py-4 px-2 text-[12px] font-semibold text-slate-500 border-b border-r border-slate-200 last:border-r-0"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* BARIS 1: Slot Pertama */}
            <tr>
              {DAYS.map((day) => {
                const rowSchedules = getScheduleForCell(day, 1);
                return (
                  <td
                    key={`${day}-1`}
                    className="border-b border-r border-slate-100 last:border-r-0 p-3 h-20 text-center"
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

            {/* BARIS 2: Slot Kedua */}
            <tr>
              {DAYS.map((day) => {
                const rowSchedules = getScheduleForCell(day, 2);
                return (
                  <td
                    key={`${day}-2`}
                    className="border-r border-slate-100 last:border-r-0 p-3 h-20 text-center"
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
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex justify-end md:justify-start">
        <button
          onClick={onBooking}
          className="bg-[#00796e] hover:bg-[#00796e]/90 text-white px-10 py-4 rounded-full font-bold 
               transition-all duration-300 text-sm uppercase tracking-wide cursor-pointer
               active:scale-95"
        >
          Buat Janji Temu
        </button>
      </div>
    </div>
  );
}
