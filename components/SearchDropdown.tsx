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

  // Load semua dokter saat komponen mount
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

  // Filter dokter berdasarkan search query menggunakan useMemo
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
    }
  };

  const handleDoctorClick = (doctorId: string) => {
    router.push(`/dokter/${doctorId}`);
    setSearchQuery("");
  };

  const handleSpecialtyClick = (specialty: string) => {
    if (specialty === "Semua Spesialis") {
      router.push("/dokter");
    } else {
      router.push(`/dokter?specialty=${encodeURIComponent(specialty)}`);
    }
    setSearchQuery("");
    if (onClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute top-full left-0 w-full bg-[#f4f4f4] z-[-1] overflow-hidden hidden md:block border-b border-gray-200 shadow-2xl"
        >
          <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-10">
            {/* Input Section */}
            <form
              onSubmit={handleSearch}
              className="relative w-full flex items-center border-b border-gray-300 pb-2 mb-8"
            >
              <input
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
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 mr-4"
                >
                  <X size={24} />
                </button>
              )}
              <button
                type="submit"
                className="text-[#003369] hover:translate-x-3 transition-transform duration-300"
              >
                <ArrowRight size={48} strokeWidth={1} />
              </button>
            </form>

            {/* Hasil Pencarian */}
            {searchQuery.trim() && (
              <div className="mb-8">
                {searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-bold text-[#003369] uppercase tracking-widest mb-4">
                      Hasil Pencarian ({searchResults.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((doctor) => (
                        <motion.button
                          key={doctor.id}
                          onClick={() => handleDoctorClick(doctor.id)}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group flex gap-4 p-4 bg-white hover:shadow-md transition-all rounded-lg text-left border border-gray-200 hover:border"
                        >
                          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-gray-200">
                            <Image
                              src={
                                doctor.image_url ||
                                "https://images.unsplash.com/photo-1612349317150-e539c59dc62a?w=100&h=100&fit=crop"
                              }
                              alt={doctor.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-[#003369] group-hover:text-[#015A85] transition-colors">
                              {doctor.name}
                            </h4>
                            <p className="text-xs text-gray-500 font-medium">
                              {doctor.specialty}
                            </p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
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
              </div>
            )}

            {/* Tautan Khusus */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
              {SPECIALTY_CATEGORIES.filter((s) => s !== "Semua Spesialis").map(
                (specialty) => (
                  <button
                    key={specialty}
                    onClick={() => handleSpecialtyClick(specialty)}
                    className="group flex justify-between items-center text-[13px] text-[#003369] font-medium hover:text-[#01274F] transition-colors border-b border-transparent hover:border-[#003369] pb-1 text-left"
                  >
                    <span>{specialty}</span>
                    <ArrowRight
                      size={14}
                      className="text-[#003369] opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0"
                    />
                  </button>
                ),
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchDropdown;
