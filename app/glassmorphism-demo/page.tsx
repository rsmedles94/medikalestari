"use client";

import React, { useState } from "react";
import GlassmorphismFloatingPanel from "@/components/GlassmorphismFloatingPanel";

export default function GlassmorphismPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          Glassmorphism Floating Panel
        </h1>
        <p className="text-white/80 text-lg mb-8">
          Drag untuk menggeser panel ke bawah. Panel akan otomatis collapse saat
          di-drag melebihi 50px. Klik tombol Buka/Tutup untuk toggle panel.
        </p>

        {/* Demo Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-white font-semibold mb-2">Feature {item}</h3>
              <p className="text-white/70">
                Ini adalah konten demo. Panel glassmorphism akan muncul di bawah
                layar dan bisa di-drag!
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Glassmorphism Floating Panel */}
      <GlassmorphismFloatingPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        maxHeight="60vh"
        minHeight="180px"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Panel Floating</h2>
          <p className="text-white/80">
            Ini adalah glassmorphism floating panel dengan efek bening seperti
            gelas Apple. Anda bisa:
          </p>
          <ul className="space-y-2 text-white/80 list-disc list-inside">
            <li>Drag panel ke bawah untuk collapse</li>
            <li>Drag panel ke atas untuk expand</li>
            <li>Klik handle bar untuk drag</li>
            <li>Gunakan tombol Buka/Tutup</li>
            <li>Klik X untuk close panel</li>
          </ul>

          <div className="mt-6 pt-4 border-t border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Features:</h3>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white/40 rounded-full" />
                Fully responsive (mobile & desktop)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white/40 rounded-full" />
                Smooth drag & snap animation
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white/40 rounded-full" />
                Apple-style glassmorphism effect
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white/40 rounded-full" />
                Touch & mouse support
              </div>
            </div>
          </div>
        </div>
      </GlassmorphismFloatingPanel>
    </div>
  );
}
