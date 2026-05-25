"use client";

import React, { ChangeEvent, FormEvent } from "react";
import { Upload } from "lucide-react";

interface MCUFormData {
  title: string;
  price: string;
  image_url: string;
  href: string;
}

interface MCUFormProps {
  formData: MCUFormData;
  onFormChange: (data: MCUFormData) => void;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
}

export const MCUForm: React.FC<MCUFormProps> = ({
  formData,
  onFormChange,
  onImageUpload,
  onSubmit,
  onCancel,
  isEditing,
  isSubmitting,
  isUploading,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-[#153d6f] mb-6">
        {isEditing ? "Ubah Paket MCU" : "Tambah Paket MCU"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Judul Paket *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              onFormChange({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Paket Active Kartini"
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Harga *
          </label>
          <input
            id="price"
            type="text"
            value={formData.price}
            onChange={(e) =>
              onFormChange({ ...formData, price: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Rp 300.000 – Rp 1.200.000"
          />
        </div>

        {/* Image URL */}
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">
            Gambar *
          </legend>
          <div className="space-y-3">
            {formData.image_url && (
              <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onFormChange({ ...formData, image_url: "" })}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded p-1"
                >
                  ✕
                </button>
              </div>
            )}
            <label
              htmlFor="image-upload-mcu"
              className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              <span className="flex items-center gap-2 text-gray-600">
                <Upload size={18} />
                {isUploading ? "Uploading..." : "Pilih Gambar"}
              </span>
              <input
                id="image-upload-mcu"
                type="file"
                onChange={onImageUpload}
                disabled={isUploading}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </fieldset>

        {/* Href */}
        <div>
          <label
            htmlFor="href"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Link Halaman (Opsional)
          </label>
          <input
            id="href"
            type="text"
            value={formData.href}
            onChange={(e) =>
              onFormChange({ ...formData, href: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: /mcu/active-kartini"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
          >
            {isSubmitting && (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </span>
            )}
            {!isSubmitting && isEditing && "Simpan Perubahan"}
            {!isSubmitting && !isEditing && "Tambah Paket"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || isUploading}
            className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};
