"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { fetchDoctors } from "@/lib/api";
import { Doctor } from "@/lib/types";
import Image from "next/image";
import { SPECIALTY_CATEGORIES } from "@/components/DoctorSection";
import { motion, AnimatePresence } from "framer-motion";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const specialty = searchParams.get("specialty") || "";

  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [lastSearch, setLastSearch] = useState<string>("");

  // Initialize random categories dengan semua kategori
  const [randomCategories] = useState<string[]>(() => {
    const categories = SPECIALTY_CATEGORIES.filter(
      (s) => s !== "Semua Spesialis",
    );
    const shuffled = [...categories];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctors = await fetchDoctors();
        setAllDoctors(doctors);
      } catch (error) {
        console.error("Error loading doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDoctors();
  }, []);

  // Generate suggestions berdasarkan query menggunakan useMemo
  const suggestions = useMemo(() => {
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      return allDoctors
        .filter(
          (doctor) =>
            doctor.name.toLowerCase().includes(q) ||
            doctor.specialty.toLowerCase().includes(q),
        )
        .slice(0, 5);
    }
    return [];
  }, [query, allDoctors]);

  // Filter hasil pencarian berdasarkan query atau specialty
  const searchResults = useMemo(() => {
    if (query) {
      const q = query.toLowerCase();
      return allDoctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(q) ||
          doctor.specialty.toLowerCase().includes(q),
      );
    }

    if (specialty) {
      return allDoctors.filter((doctor) => doctor.specialty === specialty);
    }

    return [];
  }, [query, specialty, allDoctors]);

  const handleCategoryClick = (category: string) => {
    setLastSearch(category);
    setShowAllCategories(false);
  };

  const displayCategories = showAllCategories
    ? randomCategories
    : randomCategories.slice(0, 10);

  return (
    <div className="fixed inset-0 md:static md:min-h-screen bg-white md:bg-gray-50 z-[120] overflow-hidden md:overflow-visible flex flex-col">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm md:hidden">
        <div className="flex items-center gap-3 p-4">
          <Link
            href="/"
            className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 line-clamp-1">
              {query ? `"${query}"` : specialty || "Pencarian"}
            </h1>
            {(query || specialty) && (
              <p className="text-xs text-gray-500">
                {searchResults.length} dokter
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:sticky md:top-0 md:block md:z-40 md:bg-white md:border-b md:border-gray-200 md:shadow-sm md:w-full">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {query ? `Hasil: "${query}"` : specialty || "Pencarian"}
            </h1>
            {(query || specialty) && (
              <p className="text-sm text-gray-500">
                {searchResults.length} dokter ditemukan
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Full Height pada Mobile */}
      <div className="flex-1 overflow-y-auto md:overflow-visible">
        <div className="w-full md:max-w-6xl md:mx-auto md:px-6 md:py-8">
          {/* Jika ada hasil pencarian atau spesialisasi */}
          {query || specialty ? (
            <div className="p-4 md:p-0 space-y-4">
              {/* Suggestions */}
              {query && suggestions.length > 0 && !searchResults.length && (
                <div>
                  <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 px-2">
                    Saran untuk &quot;{query}&quot;
                  </h3>
                  <div className="space-y-2">
                    {suggestions.map((doctor) => (
                      <Link key={doctor.id} href={`/dokter/${doctor.id}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100 cursor-pointer">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                            <Image
                              src={
                                doctor.image_url ||
                                "https://images.unsplash.com/photo-1612349317150-e539c59dc62a?w=100&h=100&fit=crop"
                              }
                              alt={doctor.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {doctor.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {doctor.specialty}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results atau Empty State */}
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-gray-200 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  {searchResults.map((doctor) => (
                    <motion.div
                      key={doctor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Link href={`/dokter/${doctor.id}`}>
                        <div className="group flex gap-3 p-4 bg-white rounded-lg md:rounded-xl border border-gray-200 hover:border-[#173A87] hover:shadow-md transition-all cursor-pointer md:p-5">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                            <Image
                              src={
                                doctor.image_url ||
                                "https://images.unsplash.com/photo-1612349317150-e539c59dc62a?w=120&h=120&fit=crop"
                              }
                              alt={doctor.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm md:text-lg font-bold text-gray-900 group-hover:text-[#173A87] transition-colors line-clamp-1">
                              {doctor.name}
                            </h3>
                            <p className="text-xs md:text-sm text-[#173A87] font-semibold mb-1 md:mb-2">
                              {doctor.specialty}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600 line-clamp-1 md:line-clamp-2">
                              {doctor.bio}
                            </p>
                          </div>
                          <div className="flex-shrink-0 flex items-center">
                            <div className="px-3 md:px-4 py-2 bg-[#173A87] text-white rounded-lg font-semibold text-xs md:text-sm hover:bg-[#001e3d] transition-colors">
                              Lihat
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                    Tidak ada hasil
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-6 px-4">
                    Coba dengan kata kunci lain atau pilih kategori
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Tampilan awal - Kategori Pills
            <div className="p-4 md:p-0">
              <h2 className="text-sm md:text-base font-bold text-gray-900 mb-4">
                Pilih Spesialis
              </h2>

              <div className="space-y-3">
                {/* Baris 1 */}
                <div className="flex flex-wrap gap-2">
                  {displayCategories.slice(0, 5).map((category) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Link
                        href={`/dokter?specialty=${encodeURIComponent(category)}`}
                      >
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 hover:border-blue-300 rounded-full text-xs md:text-sm font-medium text-gray-700 hover:text-[#173A87] transition-all whitespace-nowrap"
                        >
                          {category}
                        </button>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Baris 2 */}
                <div className="flex flex-wrap gap-2">
                  {displayCategories.slice(5, 10).map((category) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Link
                        href={`/dokter?specialty=${encodeURIComponent(category)}`}
                      >
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 hover:border-blue-300 rounded-full text-xs md:text-sm font-medium text-gray-700 hover:text-[#173A87] transition-all whitespace-nowrap"
                        >
                          {category}
                        </button>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Tombol Expand */}
                {randomCategories.length > 10 && (
                  <motion.button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[#173A87] font-semibold text-sm hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <span>
                      {showAllCategories ? "Sembunyikan" : "Tampilkan Semua"}
                    </span>
                    <motion.div
                      animate={{ rotate: showAllCategories ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </motion.button>
                )}

                {/* Kategori Tambahan */}
                <AnimatePresence>
                  {showAllCategories && randomCategories.length > 10 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2 overflow-hidden"
                    >
                      {randomCategories.slice(10).map((category) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Link
                            href={`/dokter?specialty=${encodeURIComponent(category)}`}
                          >
                            <button
                              onClick={() => handleCategoryClick(category)}
                              className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 hover:border-blue-300 rounded-full text-xs md:text-sm font-medium text-gray-700 hover:text-[#173A87] transition-all whitespace-nowrap"
                            >
                              {category}
                            </button>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pencarian Terakhir */}
              {lastSearch && (
                <div className="mt-8">
                  <div className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                    <span>Pencarian Terakhir</span>
                    <button
                      onClick={() => setLastSearch("")}
                      className="text-xs font-normal text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <Link
                    href={`/dokter?specialty=${encodeURIComponent(lastSearch)}`}
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                      <p className="text-sm font-medium text-gray-800">
                        {lastSearch}
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchContent;
