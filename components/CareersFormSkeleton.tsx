"use client";

import React from "react";

const CareersFormSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Banner Skeleton */}
        <header className="relative w-full mb-12">
          <div className="w-full h-64 md:h-80 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm relative">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-300/30 to-transparent animate-shimmer" />
          </div>
        </header>

        {/* Form Skeleton */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          {/* Grid Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {new Array(6).fill(0).map((_, i) => (
              <div key={`skeleton-${i}`} className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded animate-shimmer" />
                <div className="h-10 bg-white border border-slate-100 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-300/30 to-transparent animate-shimmer" />
                </div>
              </div>
            ))}
          </div>

          {/* Resume Upload Skeleton */}
          <div className="mb-6 space-y-2">
            <div className="h-4 w-40 bg-slate-200 rounded animate-shimmer" />
            <div className="border-2 border-dashed border-slate-100 rounded-lg p-6 h-32 bg-slate-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-300/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="h-12 bg-slate-200 rounded-lg animate-shimmer" />
        </section>
      </main>
    </div>
  );
};

export default CareersFormSkeleton;
