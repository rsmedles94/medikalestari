"use client";

import React from "react";
import { Edit2, Trash2, ImageIcon } from "lucide-react";
import { MCUPackage } from "@/lib/types";

interface MCUPackageCardProps {
  pkg: MCUPackage;
  onEdit: (pkg: MCUPackage) => void;
  onDelete: (id: string) => void;
}

export const MCUPackageCard: React.FC<MCUPackageCardProps> = ({
  pkg,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {pkg.image_url ? (
          <img
            src={pkg.image_url}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon size={48} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">{pkg.title}</h3>
        <p className="text-blue-600 font-semibold mb-2">{pkg.price}</p>
        <p className="text-sm text-gray-500 mb-4">Link: {pkg.href}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(pkg)}
            className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition flex items-center justify-center gap-2 text-sm"
          >
            <Edit2 size={16} />
            Ubah
          </button>
          <button
            onClick={() => onDelete(pkg.id)}
            className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center gap-2 text-sm"
          >
            <Trash2 size={16} />
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
