"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Stethoscope, Phone } from "lucide-react";
import { MCUPackage } from "@/lib/types";
import MCUSkeletonShimmer from "@/components/MCUSkeletonShimmer";

export default function MedicalCheckup() {
  const [packages, setPackages] = useState<MCUPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await fetch("/api/admin/mcu");
        const data = await res.json();
        setPackages(data);
      } catch (error) {
        console.error("Error loading packages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  return (
    <div className="min-h-screen bg-white mb-20">
      <div className="max-w-[1175px] mx-auto px-4 md:px-8 pt-4 md:pt-16 pb-12 md:-mt-8">
        <nav className="flex items-center gap-1 text-[14px] font-normal text-gray-300 mb-4">
          <Link
            href="/"
            className="text-black/60 hover:text-gray-300 transition-colors"
          >
            Beranda
          </Link>
          <ChevronRight size={12} className="text-black/60" />
          <span className="font-normal">Medical Checkup</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:-mt-12">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Medical Checkup
        </h1>
        <p className="text-gray-600 mb-8">
          Pilih paket pemeriksaan kesehatan sesuai kebutuhan Anda.
        </p>

        {/* Loading State */}
        {loading && <MCUSkeletonShimmer count={4} />}

        {/* Cards Grid */}
        {!loading && packages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
            {packages.map((item) => (
              <Link key={item.id} href={item.href || "#"} className="group">
                <div className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 flex flex-col h-full">
                  {/* Image Area - Menyesuaikan tinggi gambar asli secara otomatis */}
                  <div className="w-full relative bg-gray-50">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      width={300}
                      height={300}
                      className="w-full h-auto block object-contain"
                    />
                  </div>

                  {/* Content Area */}
                  <div className="p-4 flex flex-col grow">
                    <h3 className="text-[15px] font-bold text-gray-800 mb-2 leading-tight group-hover:text-[#003f88] transition-colors">
                      {item.title}
                    </h3>
                    <div className="mt-auto">
                      <p className="text-[#003f88] font-bold text-base">
                        Rp.
                        {Number(item.price.replace(/\D/g, "")).toLocaleString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && packages.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center text-gray-500">
              Belum ada paket tersedia
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
