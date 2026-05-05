"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

interface MCUHeaderProps {
  onBackClick: () => void;
}

export const MCUHeader: React.FC<MCUHeaderProps> = ({ onBackClick }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={onBackClick}
        className="p-2 hover:bg-gray-200 rounded-lg transition"
      >
        <ChevronLeft size={24} className="text-gray-700" />
      </button>
      <div>
        <h1 className="text-3xl font-bold text-[#006360]">Kelola Paket MCU</h1>
        <p className="text-gray-600">
          Tambah, ubah, atau hapus paket Medical Checkup
        </p>
      </div>
    </div>
  );
};
