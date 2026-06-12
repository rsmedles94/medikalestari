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
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Container Utama */}
      <div className="max-w-[1142px] mx-auto px-4">
        {/* Navigasi Breadcrumb - Posisi Tetap */}
        <div className="pt-8 md:pt-16 pb-2 md:pb-4 md:mt-1">
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

        {/* Card Utama  */}
        <div className="bg-white rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row md:min-h-[450px] items-stretch ">
            {/* Sisi Kiri: Slider Gambar */}
            <div className="md:w-1/2 relative bg-[#f8f9fa] overflow-hidden min-h-[280px] md:min-h-full ">
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

                {/* Section Fasilitas */}
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

              {/* Tambahan: Button Ketersediaan Kamar di luar div atas agar terdorong mentok ke bawah */}
              <div className="mt-auto pt-4">
                <Link
                  href="/ketersediaan-kamar"
                  className="w-full inline-block"
                >
                  <button
                    type="button"
                    className="w-full bg-[#003f88] hover:bg-[#e67e22] text-white font-semibold py-3 px-4 text-sm text-center transition-all duration-500 cursor-pointer"
                  >
                    Lihat Ketersediaan Kamar
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}