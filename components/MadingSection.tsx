"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import {
  ChevronRight,
  Newspaper,
  Calendar,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from "lucide-react";
import { motion, useAnimationControls } from "framer-motion";
import { fetchMadingContent } from "@/lib/api";
import { useCachedFetch } from "@/lib/hooks/useCachedFetch";
import { useEffect } from "react";

const MadingSection = memo(() => {
  const [activeTab, setActiveTab] = useState("Informasi");
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerGroup, setItemsPerGroup] = useState(4);
  const controls = useAnimationControls();

  // Wrap fetchMadingContent dengan useCallback untuk stable reference
  const fetchMadingCallback = useCallback(() => fetchMadingContent(), []);

  // Use cached fetch dengan deduplication
  const { data: allData = [], loading } = useCachedFetch(
    fetchMadingCallback,
    "mading-content",
    { deduplicate: true },
  );

  const toggleLike = useCallback((id: string) => {
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Handle resize untuk menentukan items per group
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerGroup(4); // Desktop: 4 items
      } else {
        setItemsPerGroup(2); // Mobile: 2 items
      }
      setActiveIndex(0);
      void controls.start({ x: "0%" });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [controls]);

  const filteredData = useMemo(
    () =>
      (allData || []).filter((item) =>
        activeTab === "Informasi"
          ? item.type === "edukasi"
          : item.type === "event",
      ),
    [allData, activeTab],
  );

  const totalDots = useMemo(
    () => Math.ceil(filteredData.length / itemsPerGroup),
    [filteredData.length, itemsPerGroup],
  );

  // Handler ketika tab berubah
  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      setActiveIndex(0);
      void controls.start({ x: "0%" });
    },
    [controls],
  );

  // Handler untuk navigasi dot
  const handleDotClick = useCallback(
    (index: number) => {
      setActiveIndex(index);
      const targetTranslateX = -(index * 100);

      controls.start({
        x: `${targetTranslateX}%`,
        transition: {
          type: "spring",
          stiffness: 180,
          damping: 24,
          mass: 0.8,
        },
      });
    },
    [controls],
  );

  return (
    /* Background menggunakan gradient: setengah ke atas transparan, setengah ke bawah biru */
    <section className="w-full bg-gradient-to-b from-transparent from-50% to-[#003f88] to-50% py-8 md:py-16 px-4 md:px-8">
      <div className="max-w-[1110px] mx-auto">
        {/* Header Navigation - Judul & Tab Berwarna Biru */}
        <div className="flex items-center justify-between mb-8 ">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#003f88] tracking-tight">
            Berita Terbaru
          </h2>

          <div className="flex gap-6 md:gap-8">
            {["Informasi", "Event"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`pb-4 px-1 text-xs md:text-sm font-semibold transition-all relative flex items-center gap-2 ${
                  activeTab === tab ? "text-[#003f88]" : "text-gray-400"
                }`}
              >
                {tab === "Informasi" ? (
                  <Newspaper size={16} />
                ) : (
                  <Calendar size={16} />
                )}
                {tab.toUpperCase()}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#003f88]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="w-full overflow-hidden mb-6">
          <motion.div
            animate={controls}
            initial={{ x: "0%" }}
            className="flex w-full"
          >
            {loading
              ? [...new Array(itemsPerGroup)].map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="shrink-0"
                    style={{
                      width: `calc(${100 / itemsPerGroup}% - ${itemsPerGroup === 4 ? 15 : 12}px)`,
                    }}
                  >
                    <div className="aspect-3/4 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm relative">
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-300/30 to-transparent animate-shimmer" />
                    </div>
                  </div>
                ))
              : // Render halaman/grup items
                Array.from({ length: totalDots }).map((_, pageIndex) => (
                  <div
                    key={`page-${pageIndex}`}
                    className="shrink-0 w-full flex gap-3 md:gap-5"
                    style={{
                      display: "flex",
                      gap: itemsPerGroup === 4 ? "20px" : "12px",
                    }}
                  >
                    {filteredData
                      .slice(
                        pageIndex * itemsPerGroup,
                        (pageIndex + 1) * itemsPerGroup,
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          className="shrink-0"
                          style={{
                            width:
                              itemsPerGroup === 4
                                ? "calc(25% - 15px)"
                                : "calc(50% - 6px)",
                            minWidth: 0,
                          }}
                        >
                          {activeTab === "Informasi" ? (
                            /* --- Informasi --- */
                            <div className="bg-white border border-gray-200 flex flex-col overflow-hidden shadow-sm h-[550px] relative">
                              {/* Header Nickname & Tanggal */}
                              <div className="p-2 md:p-3 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px] shrink-0">
                                    <div className="w-full h-full rounded-full bg-white p-[1px] md:p-[1.5px]">
                                      <img
                                        src="/instagram.png"
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] md:text-[13px] font-bold text-slate-900 leading-tight truncate">
                                      rsmedikalestari
                                    </span>
                                    <span className="text-[9px] md:text-[10px] text-slate-500 leading-tight">
                                      {item.date}
                                    </span>
                                  </div>
                                </div>
                                <MoreHorizontal
                                  size={14}
                                  className="text-gray-500 shrink-0"
                                />
                              </div>

                              {/* Image Body */}
                              <a
                                href={item.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="aspect-square overflow-hidden bg-gray-100 block shrink-0"
                              >
                                <img
                                  src={item.image_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </a>

                              {/* Interaction Bar */}
                              <div className="p-2 md:p-3 pb-1 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3 md:gap-4">
                                  <Heart
                                    size={20}
                                    onClick={() =>
                                      toggleLike(item.id.toString())
                                    }
                                    className={`cursor-pointer transition-all active:scale-125 ${likedItems[item.id] ? "fill-red-500 text-red-500" : "text-slate-800"}`}
                                  />
                                  <MessageCircle
                                    size={20}
                                    className="text-slate-800"
                                  />
                                  <Send size={20} className="text-slate-800" />
                                </div>
                                <Bookmark
                                  size={20}
                                  className="text-slate-800"
                                />
                              </div>

                              {/* Caption Section */}
                              <div className="px-2 md:px-3 pb-14 flex flex-col font-sans overflow-y-auto flex-1">
                                <span className="text-[11px] md:text-[13px] font-bold text-slate-900 mb-1 shrink-0">
                                  {likedItems[item.id]
                                    ? "1,001 likes"
                                    : "1,000 likes"}
                                </span>

                                <div className="text-[11px] md:text-[13px] leading-snug mb-2">
                                  <span className="font-bold text-slate-900 mr-2">
                                    rsmedikalestari
                                  </span>
                                  <span className="font-bold text-slate-900 block mb-1">
                                    {item.title}
                                  </span>
                                  <span className="text-slate-800 line-clamp-2">
                                    {item.description}
                                  </span>
                                </div>
                              </div>

                              {/* Link Fixed di Bottom */}
                              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-white">
                                <a
                                  href={item.link || "#"}
                                  target="_blank"
                                  className="text-[11px] md:text-[13px] font-semibold text-[#003f88] hover:underline block"
                                >
                                  Selengkapnya...
                                </a>
                              </div>
                            </div>
                          ) : (
                            /* --- Event --- */
                            <div className="bg-white overflow-hidden border border-gray-100 flex flex-col group transition-all hover:shadow-md h-[550px] relative">
                              <a
                                href={item.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden bg-gray-100 shrink-0"
                              >
                                <img
                                  src={item.image_url}
                                  alt=""
                                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </a>

                              <div className="p-3 md:p-4 pt-5 pb-14 flex flex-col overflow-y-auto flex-1">
                                <span className="text-slate-500 text-[8px] md:text-[9px] font-bold uppercase mb-1 md:mb-2 tracking-widest shrink-0">
                                  EVENT
                                </span>
                                <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-2 md:mb-3 leading-snug group-hover:text-[#003f88] transition-colors line-clamp-2 shrink-0">
                                  {item.title}
                                </h3>
                                <p className="text-[9px] md:text-[10px] text-slate-500 mb-4 md:mb-5 leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>
                                <div className="flex items-center gap-1 md:gap-2 text-gray-500 font-bold text-[8px] md:text-[9px] mb-3 md:mb-4 uppercase shrink-0">
                                  <Calendar size={10} />{" "}
                                  {item.start_date || item.date}
                                </div>
                              </div>

                              {/* Link Fixed di Bottom */}
                              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-white">
                                <a
                                  href={item.link || "#"}
                                  target="_blank"
                                  className="flex items-center gap-1 md:gap-2 text-gray-500 font-bold text-[9px] md:text-[11px] group-hover:text-[#003f88]"
                                >
                                  <span>Baca Selengkapnya</span>
                                  <ChevronRight
                                    size={16}
                                    className="transition-all group-hover:scale-125"
                                  />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
          </motion.div>
        </div>

        {/* Indikator Dot Bulat Navigasi (seperti Promo Kesehatan) */}
        {filteredData.length > itemsPerGroup && (
          <div className="flex items-center justify-center gap-4 mt-8">
            {Array.from({ length: totalDots }).map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={`dot-${index}`}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  className="focus:outline-none flex items-center justify-center h-8 w-8 relative"
                  aria-label={`Go to mading page ${index + 1}`}
                >
                  <motion.div
                    animate={{
                      backgroundColor: isActive ? "#e67e22" : "#ffffff",
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-5 h-5 rounded-full z-10 pointer-events-none"
                  />

                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{
                      scale: isActive ? 1 : 0.4,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 22,
                    }}
                    className="absolute w-9 h-9 rounded-full border-[5px] border-white bg-white z-0 origin-center pointer-events-none"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
});

MadingSection.displayName = "MadingSection";

export default MadingSection;
