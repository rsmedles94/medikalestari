"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  ChevronRight,
  Clock,
  Calendar,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from "lucide-react";
import { fetchMadingContent } from "@/lib/api";
import { MadingContent } from "@/lib/types";

const MadingSection = () => {
  const [activeTab, setActiveTab] = useState("Informasi");
  const [allData, setAllData] = useState<MadingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mouse Drag Scroll Logic (Tetap Utuh)
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const toggleLike = (id: string) => {
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await fetchMadingContent();
        setAllData(content);
      } catch (error) {
        console.error("Error loading content:", error);
        setAllData([]);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const filteredData = allData.filter((item) =>
    activeTab === "Informasi" ? item.type === "edukasi" : item.type === "event",
  );

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8">
      <div className="max-w-[1110px] mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100">
          <h2 className="font-sans text-4xl md:text-4xl font-thin text-slate-800 uppercase tracking-tighter leading-none pb-4">
            Informasi & Event
          </h2>

          <div className="flex gap-6 md:gap-8">
            {["Informasi", "Event"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 text-xs md:text-sm font-normal transition-all relative ${
                  activeTab === tab ? "text-[#005753]" : "text-gray-400"
                }`}
              >
                {tab.toUpperCase()}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#005753]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Container - Mobile 2 Cards */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing pb-6"
        >
          <div className="grid grid-flow-col auto-cols-[calc(50%-10px)] md:auto-cols-[calc(45%)] lg:grid-cols-4 lg:auto-cols-fr gap-3 md:gap-5">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/30 to-transparent animate-shimmer" />
                  </div>
                ))
              : filteredData.map((item) => (
                  <div key={item.id} className="h-full">
                    {activeTab === "Informasi" ? (
                      /* --- Informasi --- */
                      <div className="bg-white border border-gray-200 rounded-sm flex flex-col h-full overflow-hidden shadow-sm">
                        {/* Header Nickname & Tanggal */}
                        <div className="p-2 md:p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[1.5px]">
                              <div className="w-full h-full rounded-full bg-white p-[1px] md:p-[1.5px]">
                                <img
                                  src="/instagram.png"
                                  alt="Profile"
                                  className="w-full h-full rounded-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] md:text-[13px] font-bold text-slate-900 leading-tight">
                                rsmedikalestari
                              </span>
                              <span className="text-[9px] md:text-[10px] text-slate-500 leading-tight">
                                {item.date}
                              </span>
                            </div>
                          </div>
                          <MoreHorizontal size={14} className="text-gray-500" />
                        </div>

                        {/* Image Body */}
                        <a
                          href={item.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aspect-square overflow-hidden bg-gray-100 block"
                        >
                          <img
                            src={item.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </a>

                        {/* Interaction Bar */}
                        <div className="p-2 md:p-3 pb-1 flex items-center justify-between">
                          <div className="flex items-center gap-3 md:gap-4">
                            <Heart
                              size={20}
                              onClick={() => toggleLike(item.id.toString())}
                              className={`cursor-pointer transition-all active:scale-125 ${likedItems[item.id] ? "fill-red-500 text-red-500" : "text-slate-800"}`}
                            />
                            <MessageCircle
                              size={20}
                              className="text-slate-800"
                            />
                            <Send size={20} className="text-slate-800" />
                          </div>
                          <Bookmark size={20} className="text-slate-800" />
                        </div>

                        {/* Caption Section */}
                        <div className="px-2 md:px-3 pb-3 md:pb-4 flex flex-col flex-grow font-sans">
                          <span className="text-[11px] md:text-[13px] font-bold text-slate-900 mb-1">
                            {likedItems[item.id]
                              ? "1,001 likes"
                              : "1,000 likes"}
                          </span>

                          <div className="text-[11px] md:text-[13px] leading-snug mb-2 flex-grow">
                            <span className="font-bold text-slate-900 mr-2">
                              rsmedikalestari
                            </span>
                            <span className="font-bold text-slate-900 block mb-1">
                              {item.title}
                            </span>
                            <span className="text-slate-800 whitespace-pre-line line-clamp-3 md:line-clamp-none">
                              {item.description}
                            </span>
                          </div>

                          <div className="mt-auto">
                            <a
                              href={item.link || "#"}
                              target="_blank"
                              className="text-[11px] md:text-[13px] font-semibold text-[#005753] hover:underline"
                            >
                              Selengkapnya...
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* --- Event --- */
                      <div className="bg-white overflow-hidden border border-gray-100 flex flex-col group transition-all hover:shadow-md h-full">
                        <a
                          href={item.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aspect-[16/10] overflow-hidden block"
                        >
                          <img
                            src={item.image_url}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </a>

                        <div className="p-3 md:p-4 flex flex-col flex-grow">
                          <span className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase mb-1 md:mb-2 tracking-widest">
                            EVENT
                          </span>
                          <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-1 md:mb-2 leading-snug group-hover:text-[#005753] transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-[10px] md:text-[11px] text-slate-500 mb-3 md:mb-4 flex-grow leading-relaxed line-clamp-2 md:line-clamp-none">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-1 md:gap-2 text-gray-500 font-bold text-[8px] md:text-[10px] mb-3 md:mb-4 uppercase">
                            <Calendar size={10} />{" "}
                            {item.start_date || item.date}
                          </div>

                          <a
                            href={item.link || "#"}
                            target="_blank"
                            className="flex items-center gap-1 md:gap-2 text-gray-500 font-bold text-[10px] md:text-[12px] group-hover:text-[#005753]"
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
        </div>
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
};

export default MadingSection;
