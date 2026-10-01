"use client";

import React from "react";

interface MCUEmptyStateProps {
  onCreateClick: () => void;
}

export const MCUEmptyState: React.FC<MCUEmptyStateProps> = ({
  onCreateClick,
}) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">Belum ada paket MCU</p>
      <button
        onClick={onCreateClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Buat Paket Pertama
      </button>
    </div>
  );
};
