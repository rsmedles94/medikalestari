"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search as SearchIcon,
  X,
  ChevronRight,
  History,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { fetchDoctors } from "@/lib/api";
import { Doctor } from "@/lib/types";
import Image from "next/image";
import { SPECIALTY_CATEGORIES } from "./DoctorSection";
import { useSearchModal } from "@/context/SearchModalContext";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { closeSearch } = useSearchModal();
  const handleClose = () => {
    closeSearch();
    onClose();
  };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const randomCategories = useMemo(() => {
    if (!isOpen) return [];

    const cats = SPECIALTY_CATEGORIES.filter(
      (item) => item !== "Semua Spesialis",
    );

    return cats;
  }, [isOpen]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [doctorHistory, setDoctorHistory] = useState<Doctor[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (globalThis.window === undefined) return;

    const loadHistory = async () => {
      const saved = localStorage.getItem("doctor_history");
      if (saved) {
        try {
          const parsed: Doctor[] = JSON.parse(saved);
          setDoctorHistory(parsed);
        } catch {
          // ignore parse errors
        }
      }
    };

    loadHistory();
  }, [isOpen]);

  const saveToHistory = (doctor: Doctor) => {
    setDoctorHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== doctor.id);
      const newHistory = [doctor, ...filtered].slice(0, 4);

      if (globalThis.window !== undefined) {
        localStorage.setItem("doctor_history", JSON.stringify(newHistory));
      }

      return newHistory;
    });
  };

  const clearHistory = () => {
    setDoctorHistory([]);

    if (globalThis.window !== undefined) {
      localStorage.removeItem("doctor_history");
    }
  };

  const removeHistoryItem = (id: string | number) => {
    setDoctorHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);

      if (globalThis.window !== undefined) {
        localStorage.setItem("doctor_history", JSON.stringify(updated));
      }

      return updated;
    });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchDoctors();
        setAllDoctors(data || []);
      } catch (error) {
        console.error(error);
        setAllDoctors([]);
      }
    };

    loadDoctors();
  }, []);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    return allDoctors
      .filter((doctor) => {
        const name = doctor.name?.toLowerCase() || "";
        const specialty = doctor.specialty?.toLowerCase() || "";

        return name.includes(query) || specialty.includes(query);
      })
      .slice(0, 8);
  }, [searchQuery, allDoctors]);

  const handleNavigation = (url: string, doctor?: Doctor) => {
    if (doctor) {
      saveToHistory(doctor);
    }

    setIsNavigating(true);
    router.push(url);

    setTimeout(() => {
      handleClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 bg-white z-999 md:hidden flex flex-col overscroll-none"
        >
          {isNavigating && (
            <div className="absolute top-0 left-0 w-full z-1000" />
          )}

          {/* Header */}
          <div className="bg-white p-4 flex items-center gap-3">
            <form
              className="flex-1 flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1 border border-transparent transition-all duration-200 focus-within:border-gray-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-400"
              onSubmit={(e) => {
                e.preventDefault();

                if (!searchQuery.trim()) return;

                handleNavigation(
                  `/search?specialty=${encodeURIComponent(searchQuery.trim())}`,
                );
              }}
            >
              <SearchIcon size={18} className="text-gray-400" />

              <input
                autoFocus
                type="text"
                placeholder="Cari nama dokter atau spesialisasi"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none text-[16px] py-1 text-gray-700"
              />

              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")}>
                  <X size={18} className="text-gray-400" />
                </button>
              )}
            </form>

            <button
              onClick={handleClose}
              className="text-[14px] font-bold text-gray-700 whitespace-nowrap active:opacity-60 cursor-pointer"
            >
              Batal
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-5">
              {searchQuery.trim() ? (
                <div className="space-y-1">
                  {searchResults.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() =>
                        handleNavigation(`/dokter/${doctor.id}`, doctor)
                      }
                      className="w-full flex items-center gap-4 p-3 active:bg-gray-50 text-left border-b border-gray-50"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100">
                        <Image
                          src={doctor.image_url || "/default.png"}
                          alt=""
                          width={40}
                          height={40}
                          className="object-cover h-full w-full"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-bold text-gray-900 truncate">
                          {doctor.name}
                        </h4>

                        <p className="text-[11px] text-[#153d6f] font-semibold">
                          {doctor.specialty}
                        </p>
                      </div>

                      <ChevronRight size={16} className="text-gray-300" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Terakhir Dilihat */}
                  {doctorHistory.length > 0 && (
                    <section>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[13px] font-bold text-gray-black flex items-center gap-2">
                          <History size={16} className="text-gray-400" />
                          Terakhir Dilihat
                        </h3>

                        <button
                          onClick={clearHistory}
                          className="text-[12px] text-gray-700 font-bold cursor-pointer"
                        >
                          Hapus Semua
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {doctorHistory.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                          >
                            <button
                              onClick={() =>
                                handleNavigation(`/dokter/${doc.id}`, doc)
                              }
                              className="flex items-center gap-3 flex-1 text-left"
                            >
                              <Image
                                src={doc.image_url || "/default.png"}
                                alt=""
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                              />

                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-800 truncate">
                                  {doc.name}
                                </p>

                                <p className="text-[10px] text-gray-500">
                                  {doc.specialty}
                                </p>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => removeHistoryItem(doc.id)}
                              className="shrink-0 p-1 cursor-pointer"
                            >
                              <Trash2 size={15} className="text-gray-700" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Spesialisasi */}
                  <section>
                    <h3 className="text-[15px] font-bold text-black">
                      Kategori Spesialisasi
                    </h3>

                    <p className="text-[11px] text-gray-500 mb-4">
                      Untuk penanganan yang lebih tepat
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(isExpanded
                        ? randomCategories
                        : randomCategories.slice(0, 8)
                      ).map((cat) => (
                        <button
                          key={cat}
                          onClick={() =>
                            handleNavigation(
                              `/dokter?specialty=${encodeURIComponent(cat)}`,
                            )
                          }
                          className="px-3 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-600 transition-none"
                        >
                          {cat}
                        </button>
                      ))}

                      {!isExpanded && randomCategories.length > 8 && (
                        <button
                          onClick={() => setIsExpanded(true)}
                          className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-gray-700"
                        >
                          Lainnya <ChevronDown size={14} />
                        </button>
                      )}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchModal;
