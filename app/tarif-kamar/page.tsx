"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
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

export default function TarifKamar() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

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
      } catch (error) {
        console.error("Error loading rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans pb-28 md:pb-0">
        <div className="max-w-[1190px] w-full mx-auto px-4 pt-4 md:pt-16 ">
          {/* Cards Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between h-full"
              >
                <div>
                  {/* Image Skeleton */}
                  <div className="relative w-full h-48 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                      style={{
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  </div>

                  {/* Content Skeleton */}
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded w-3/4 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                        style={{
                          animation: "shimmer 2s infinite",
                        }}
                      />
                    </div>
                    <div className="h-5 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded w-1/2 relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                        style={{
                          animation: "shimmer 2s infinite",
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
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
            ))}
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

  return (
    <main className="min-h-screen bg-white pb-28 md:pb-0">
      {/* Ditambahkan w-full agar max-w bekerja dengan benar */}
      <div className="max-w-[1139px] w-full mx-auto px-4">
        {/* Breadcrumb */}
        <div className="pt-8 md:pt-16 pb-2 md:pb-4">
          <nav
            className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-8"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-black/60 hover:text-gray-400 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight
              size={12}
              className="text-black/60"
              aria-hidden="true"
            />
            <span className="font-normal text-gray-300">Tarif Kamar</span>
          </nav>
        </div>

        {/* Page Title */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#001e3d] mb-4">
            Tarif Kamar Perawatan
          </h1>
          <p className="text-gray-600 text-base">
            Pilih kamar yang sesuai dengan kebutuhan Anda
          </p>
        </header>

        {/* Cards Grid - Ditambahkan items-stretch agar tinggi card seimbang */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12 items-stretch">
          {rooms.length > 0 ? (
            rooms.map((room, index) => {
              const displayImage =
                room.room_images && room.room_images.length > 0
                  ? room.room_images[0].image_url
                  : room.image_url;

              return (
                <motion.article
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white border border-gray-300  transition-shadow duration-300 overflow-hidden flex flex-col justify-between h-full"
                  onMouseEnter={() => setHoveredRoomId(room.id)}
                  onMouseLeave={() => setHoveredRoomId(null)}
                >
                  {/* Bagian Atas Card (Gambar + Informasi Utama) */}
                  <div className="flex flex-col grow">
                    {/* Image Container - Hover effect untuk scale gambar */}
                    <div className="relative w-full h-48 bg-[#f8f9fa] overflow-hidden cursor-pointer">
                      <motion.div
                        className="w-full h-full"
                        animate={{
                          scale: hoveredRoomId === room.id ? 1.1 : 1,
                        }}
                        transition={{
                          type: "tween",
                          duration: 0.6,
                          ease: "easeInOut",
                        }}
                      >
                        {displayImage && (
                          <Image
                            src={displayImage}
                            alt={room.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </motion.div>
                    </div>

                    {/* Content Detail */}
                    <div className="p-6 grow flex flex-col justify-between">
                      <div>
                        {/* Room Name - Bisa diklik untuk navigate */}
                        <Link
                          href={`/services/kamar-perawatan?room=${room.name}`}
                        >
                          <h2 className="text-xl font-bold text-[#001e3d] mb-2 cursor-pointer hover:text-[#e67e22] transition-colors duration-300">
                            {room.name}
                          </h2>
                        </Link>

                        {/* Price */}
                        <p className="text-lg font-bold text-gray-700 mb-4 cursor-default">
                          Rp.{room.price}{" "}
                          <span className="text-sm font-normal text-gray-400">
                            /malam
                          </span>
                        </p>

                        {/* Description - Tidak bisa diklik */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 cursor-default">
                          {room.description}
                        </p>
                      </div>

                      {/* Facilities */}
                      {room.facilities.length > 0 && (
                        <div className="mt-auto pt-2 cursor-default">
                          <p className="text-xs font-bold text-gray-700 uppercase mb-2">
                            Fasilitas:
                          </p>
                          <div className="space-y-1">
                            {room.facilities
                              .slice(0, 3)
                              .map((facility, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 cursor-default"
                                >
                                  <div className="w-1 h-1 rounded-full bg-[#001e3d]" />
                                  <span className="text-xs text-gray-600">
                                    {facility}
                                  </span>
                                </div>
                              ))}
                            {room.facilities.length > 3 && (
                              <p className="text-xs text-gray-500 mt-1">
                                +{room.facilities.length - 3} fasilitas lainnya
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bagian Bawah Card (Tombol Selengkapnya) */}
                  <div className="px-6 pb-6">
                    <Link
                      href={`/services/kamar-perawatan?room=${room.name}`}
                      className={`inline-block w-full py-2 px-4 text-white text-center text-sm font-medium transition-colors duration-300 cursor-pointer ${
                        hoveredRoomId === room.id
                          ? "bg-[#e67e22]"
                          : "bg-[#003f88] hover:bg-[#e67e22]"
                      }`}
                    >
                      Selengkapnya →
                    </Link>
                  </div>
                </motion.article>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                Tidak ada data kamar perawatan
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
