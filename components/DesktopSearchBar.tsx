"use client";

import React, { RefObject } from "react";
import { User, Stethoscope, CalendarDays, ChevronDown } from "lucide-react";

interface DesktopSearchBarProps {
  search: string;
  setSearch: (val: string) => void;
  specialty: string;
  setSpecialty: (val: string) => void;
  day: string;
  setDay: (val: string) => void;
  isSpecialtyOpen: boolean;
  setIsSpecialtyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDayOpen: boolean;
  setIsDayOpen: React.Dispatch<React.SetStateAction<boolean>>;
  specialtyRef: RefObject<HTMLDivElement | null>;
  dayRef: RefObject<HTMLDivElement | null>;
  SPECIALTY_CATEGORIES: string[];
  DAYS: string[];
  handleSearchSubmit: (e: React.FormEvent) => void;
}

export const DesktopSearchBar: React.FC<DesktopSearchBarProps> = ({
  search,
  setSearch,
  specialty,
  setSpecialty,
  day,
  setDay,
  isSpecialtyOpen,
  setIsSpecialtyOpen,
  isDayOpen,
  setIsDayOpen,
  specialtyRef,
  dayRef,
  SPECIALTY_CATEGORIES,
  DAYS,
  handleSearchSubmit,
}) => {
  return (
    // Desktop Search Bar Container
    <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-full max-w-5xl px-4">
      <section className="bg-white p-6 md:p-8 rounded-md border border-gray-200 w-full">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-[#003f88]">Temukan Dokter</h2>
        </header>

        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-row items-center gap-3"
        >
          {/* Input Nama Dokter */}
          <div className="flex-1 h-[52px] border border-gray-300 rounded-md px-4 flex items-center gap-3 bg-white focus-within:border-[#003f88] focus-within:ring-1 focus-within:ring-[#003f88]/20 transition-all">
            <User size={20} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Nama Dokter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full outline-none text-sm md:text-base text-gray-800 placeholder-gray-400 bg-transparent"
            />
          </div>

          {/* Custom Dropdown Spesialis */}
          <div ref={specialtyRef} className="flex-1 relative">
            {/* button */}
            <button
              type="button"
              onClick={() => {
                setIsSpecialtyOpen(!isSpecialtyOpen);
                setIsDayOpen(false);
              }}
              className={`w-full h-[52px] border rounded-md px-4 flex items-center justify-between bg-white text-left transition-all ${
                isSpecialtyOpen
                  ? "border-[#003f88] ring-1 ring-[#003f88]/20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <Stethoscope size={20} className="text-gray-400 shrink-0" />
                <span className="text-sm md:text-base text-gray-800 truncate">
                  {specialty || "Semua Spesialis"}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-gray-400 shrink-0 ${
                  isSpecialtyOpen ? "rotate-180 text-[#003f88]" : ""
                }`}
              />
            </button>

            {isSpecialtyOpen && (
              <div
                data-lenis-prevent
                className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto py-1"
              >
                {SPECIALTY_CATEGORIES.map((s) => {
                  const isSelected =
                    specialty === s || (!specialty && s === "Semua Spesialis");

                  return (
                    // button
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSpecialty(s === "Semua Spesialis" ? "" : s);
                        setIsSpecialtyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        isSelected
                          ? "bg-[#003f88] text-white font-medium"
                          : "text-gray-700 hover:bg-blue-50 hover:text-[#003f88]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Dropdown Hari */}
          <div ref={dayRef} className="flex-1 relative">
            {/* button */}
            <button
              type="button"
              onClick={() => {
                setIsDayOpen(!isDayOpen);
                setIsSpecialtyOpen(false);
              }}
              className={`w-full h-[52px] border rounded-md px-4 flex items-center justify-between bg-white text-left transition-all ${
                isDayOpen
                  ? "border-[#003f88] ring-1 ring-[#003f88]/20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <CalendarDays size={20} className="text-gray-400 shrink-0" />
                <span className="text-sm md:text-base text-gray-800 truncate">
                  {day || "Semua Hari"}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-gray-400 shrink-0 ${
                  isDayOpen ? "rotate-180 text-[#003f88]" : ""
                }`}
              />
            </button>

            {isDayOpen && (
              <div
                data-lenis-prevent
                className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-xl z-50 max-h-60 overflow-y-auto py-1"
              >
                {DAYS.map((d) => {
                  const isSelected = day === d || (!day && d === "Semua Hari");

                  return (
                    // button
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDay(d === "Semua Hari" ? "" : d);
                        setIsDayOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        isSelected
                          ? "bg-[#003f88] text-white font-medium"
                          : "text-gray-700 hover:bg-blue-50 hover:text-[#003f88]"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Button */}
          {/* button */}
          <button
            type="submit"
            className="h-[52px] px-8 rounded-md bg-[#003f88] hover:bg-[#002f66] ease-in-out duration-700 text-white font-semibold text-base transition-colors cursor-pointer shrink-0 flex items-center justify-center active:scale-95"
          >
            Search
          </button>
        </form>
      </section>
    </div>
  );
};
