"use client";

import React from "react";
import { Plus } from "lucide-react";

interface MCUActionButtonProps {
  onClick: () => void;
}

export const MCUActionButton: React.FC<MCUActionButtonProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
    >
      <Plus size={20} />
      Tambah Paket
    </button>
  );
};
