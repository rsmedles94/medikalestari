"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArrowRight, Search as SearchIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { fetchDoctors } from "@/lib/api";
import { Doctor } from "@/lib/types";
import Image from "next/image";
import { SPECIALTY_CATEGORIES } from "./DoctorSection";

interface SearchDropdownProps {
  isOpen: boolean;
  onClose?: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctors = await fetchDoctors();
        setAllDoctors(doctors);
      } catch (error) {
        console.error("Error loading doctors:", error);
      }
    };
    loadDoctors();
  }, []);

  const searchResults = useMemo(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return allDoctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query),
      );
    }
    return [];
  }, [searchQuery, allDoctors]);

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dokter?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      if (onClose) onClose();
    }
  };

  const handleDoctorClick = (doctorId: string) => {
    router.push(`/dokter/${doctorId}`);
    setSearchQuery("");
    if (onClose) onClose();
  };

  const handleSpecialtyClick = (specialty: string) => {
    if (specialty === "Semua Spesialis") {
      router.push("/dokter");
    } else {
      router.push(`/dokter?specialty=${encodeURIComponent(specialty)}`);
    }
    setSearchQuery("");
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          /* Menggunakan peran dialog untuk aksesibilitas */
          role="dialog"
          aria-label="Pencarian Dokter"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-full left-0 w-full bg-[#f4f4f4] z-[-1] overflow-hidden hidden md:block border-b border-gray-200 shadow-2xl"
        >
          <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-10">
            {/* Search Input Section */}
            <form
              role="search"
              onSubmit={handleSearch}
              className="relative w-full flex items-center border-b border-gray-300 pb-2 mb-8"
            >
              <label htmlFor="doctor-search" className="sr-only">
                Cari dokter atau spesialis
              </label>
              <input
                id="doctor-search"
                type="text"
                placeholder="Masukkan nama dokter atau spesialisasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-3xl md:text-4xl text-gray-500 font-light outline-none border-none placeholder-gray-400 py-2"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Bersihkan pencarian"
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 mr-4"
                >
                  <X size={24} />
                </button>
              )}
              <button
                type="submit"
                aria-label="Cari"
                className="text-[#153d6f] hover:translate-x-3 transition-transform duration-300"
              >
                <ArrowRight size={48} strokeWidth={1} />
              </button>
            </form>

            {/* Hasil Pencarian */}
            {searchQuery.trim() && (
              <nav className="mb-8" aria-label="Hasil pencarian dokter">
                {searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold text-[#153d6f] mb-4">
                      Hasil Pencarian ({searchResults.length})
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
                      {searchResults.map((doctor) => (
                        <li key={doctor.id}>
                          <button
                            onClick={() => handleDoctorClick(doctor.id)}
                            className="w-full group flex gap-4 p-4 bg-white hover:shadow-md transition-all text-left border border-gray-200"
                          >
                            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-200">
                              <Image
                                src={
                                  doctor.image_url ||
                                  "https://images.unsplash.com/photo-1612349317150-e539c59dc62a?w=100&h=100&fit=crop"
                                }
                                alt={`Foto ${doctor.name}`}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-[#153d6f] transition-colors">
                                {doctor.name}
                              </h4>
                              <p className="text-xs text-gray-500 font-medium">
                                {doctor.specialty}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-6" role="status">
                    <SearchIcon
                      size={24}
                      className="mx-auto text-gray-300 mb-2"
                    />
                    <p className="text-sm text-gray-400">
                      Dokter tidak ditemukan dengan kriteria &quot;{searchQuery}
                      &quot;
                    </p>
                  </div>
                )}
              </nav>
            )}

            {/* Kategori Spesialis */}
            <nav aria-label="Kategori Spesialisasi">
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 list-none p-0">
                {SPECIALTY_CATEGORIES.filter(
                  (s) => s !== "Semua Spesialis",
                ).map((specialty) => (
                  <li key={specialty}>
                    <button
                      onClick={() => handleSpecialtyClick(specialty)}
                      className="w-full group flex justify-between items-center text-[13px] text-[#153d6f] font-medium hover:text-[#153d6f]/70 transition-colors border-b border-transparent hover:border-[#153d6f] pb-1 text-left"
                    >
                      <span>{specialty}</span>
                      <ArrowRight
                        size={14}
                        className="text-[#153d6f] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchDropdown;
