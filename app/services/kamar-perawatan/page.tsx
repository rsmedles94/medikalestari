"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRoomTypes } from "@/lib/api";

interface RoomImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface RoomData {
  id: string;
  name: string;
  price: string;
  image_url: string;
  description: string;
  display_order: number;
  facilities: string[];
  room_images?: RoomImage[];
}

interface RoomResponse {
  id: string;
  name: string;
  price: string;
  image_url: string;
  description: string;
  display_order: number;
  facilities?: string[];
  room_images?: RoomImage[];
}

export default function KamarPerawatan() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRoomTypes();
        const roomsData = (data || []).map((room: RoomResponse) => ({
          id: room.id,
          name: room.name,
          price: room.price,
          image_url: room.image_url,
          description: room.description,
          display_order: room.display_order,
          facilities: room.facilities || [],
          room_images: room.room_images || [],
        }));
        setRooms(roomsData);
        if (roomsData.length > 0) {
          setActiveTab(roomsData[0].name);
          setCurrentImageIndex(0);
        }
      } catch (error) {
        console.error("Error loading rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const currentKamar = rooms.find((r: RoomData) => r.name === activeTab);

  const displayImages = React.useMemo(() => {
    if (!currentKamar) return [];
    if (currentKamar.room_images && currentKamar.room_images.length > 0) {
      return currentKamar.room_images;
    }
    return currentKamar.image_url
      ? [{ id: "default", image_url: currentKamar.image_url, display_order: 0 }]
      : [];
  }, [currentKamar]);

  const paginate = (newDirection: number) => {
    if (displayImages.length <= 1) return;
    setDirection(newDirection);
    setCurrentImageIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = displayImages.length - 1;
      if (nextIndex >= displayImages.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="max-w-5xl mx-auto px-4 pt-4 md:pt-16">
          {/* Skeleton Card dengan Shimmer Effect */}
          <div className="bg-white rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row md:min-h-[450px] items-stretch">
              {/* Skeleton Image Left */}
              <div className="md:w-1/2 relative bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 min-h-[280px] md:min-h-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  style={{
                    animation: "shimmer 2s infinite",
                  }}
                />
              </div>

              {/* Skeleton Content Right */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-white">
                <div>
                  {/* Skeleton Title */}
                  <div className="mb-6">
                    <div className="h-8 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded mb-3 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                        style={{
                          animation: "shimmer 2s infinite",
                        }}
                      />
                    </div>
                    <div className="h-6 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded w-2/3 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                        style={{
                          animation: "shimmer 2s infinite",
                        }}
                      />
                    </div>
                  </div>

                  {/* Skeleton Description */}
                  <div className="mb-6 space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded relative overflow-hidden"
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                          style={{
                            animation: "shimmer 2s infinite",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Skeleton Facilities */}
                  <div className="mb-6">
                    <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded w-1/3 mb-3 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                        style={{
                          animation: "shimmer 2s infinite",
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-4 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded relative overflow-hidden"
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                            style={{
                              animation: "shimmer 2s infinite",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!currentKamar) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Container Utama */}
      <div className="max-w-5xl mx-auto px-4">
        {/* Navigasi Breadcrumb - Posisi Tetap */}
        <div className="pt-4 md:pt-16 pb-2 md:pb-4  md:-mt-8">
          <nav className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-4">
            <Link
              href="/"
              className="text-black/60 hover:text-gray-400 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight size={12} className="text-black/60" />
            <span className="font-normal text-gray-300">Kamar Perawatan</span>
          </nav>
        </div>

        {/* Filter Mobile: Dropdown Tajam (Ganti Tab Slider di Mobile) */}
        <div className="block md:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value);
              setCurrentImageIndex(0);
            }}
            className="w-full p-3 bg-white border border-gray-200 rounded-none text-gray-700 font-medium outline-none appearance-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1em",
            }}
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.name}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Navigasi Desktop */}
        <div className="hidden md:flex flex-wrap border-b border-gray-100 mb-8 justify-center gap-2 md:gap-12">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => {
                setActiveTab(room.name);
                setCurrentImageIndex(0);
              }}
              className={`pb-4 text-sm md:text-base font-medium transition-all relative ${
                activeTab === room.name
                  ? "text-[#001e3d]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {room.name}
              {activeTab === room.name && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#001e3d]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Card Utama - Tanpa Rounded (Tajam) */}
        <div className="bg-white rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row md:min-h-[450px] items-stretch">
            {/* Sisi Kiri: Slider Gambar */}
            <div className="md:w-1/2 relative bg-[#f8f9fa] overflow-hidden min-h-[280px] md:min-h-full">
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="popLayout"
              >
                <motion.div
                  key={currentImageIndex + activeTab}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  {displayImages[currentImageIndex] && (
                    <Image
                      src={displayImages[currentImageIndex].image_url}
                      alt={currentKamar.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Tombol Navigasi Slider */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => paginate(-1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 text-white/70 hover:text-white transition-all"
                  >
                    <ChevronLeft size={50} />
                  </button>
                  <button
                    onClick={() => paginate(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 text-white/70 hover:text-white transition-all"
                  >
                    <ChevronRight size={50} />
                  </button>
                </>
              )}

              {/* Indikator Dots Bulat */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentImageIndex ? 1 : -1);
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Sisi Kanan: Detail Kamar */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#001e3d] mb-1 leading-tight">
                    {currentKamar.name}
                  </h1>
                  <p className="text-lg md:text-xl font-bold text-gray-700">
                    Rp.{currentKamar.price}{" "}
                    <span className="text-sm font-normal text-gray-400">
                      /malam
                    </span>
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 text-[14px] leading-relaxed line-clamp-6 md:line-clamp-none">
                    {currentKamar.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase">
                    Fasilitas Kamar
                  </h2>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {currentKamar.facilities.map((facility, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-[5px] h-[5px] rounded-full bg-[#001e3d] shrink-0" />
                        <span className="text-[13px] text-gray-600 font-medium truncate">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bagian Share */}
              <div className="pt-6 border-t border-gray-100 flex items-center gap-5 mt-auto">
                <button className="text-gray-400 hover:text-[#001e3d] transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35C.595 0 0 .595 0 1.326v21.348C0 23.405.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.595 1.323-1.326V1.326C24 .595 23.405 0 22.675 0z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-[#001e3d] transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-[#001e3d] transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-[#001e3d] transition-colors">
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
