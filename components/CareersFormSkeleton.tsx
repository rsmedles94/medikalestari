"use client";

import React from "react";

const CareersFormSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* BREADCRUMB & TITLE SECTION */}
      <div className="max-w-293.75 mx-auto px-4 md:px-8 pt-4 md:pt-16 pb-12 md:-mt-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3.5 w-16 bg-slate-200 rounded animate-shimmer" />
          <div className="h-3 w-3 bg-slate-200 rounded-full animate-shimmer" />
          <div className="h-3.5 w-10 bg-slate-200 rounded animate-shimmer" />
        </div>
      </div>

      {/* Position Photos Grid Skeleton */}
      <div className="max-w-293.75 mx-auto px-4 md:px-8 py-1">
        <div className="h-8 md:h-10 w-64 md:w-96 bg-slate-200 rounded mx-auto mb-8 animate-shimmer" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {new Array(4).fill(0).map((_, i) => (
            <div
              key={`photo-skeleton-${i}`}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-300/30 to-transparent animate-shimmer" />
              </div>
              <div className="px-3 py-3 border-t border-gray-100 flex justify-center">
                <div className="h-4 w-24 bg-slate-200 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button Daftar Skeleton */}
      <div className="max-w-2xl mx-auto px-4 py-12 flex justify-center">
        <div className="h-[52px] w-48 bg-slate-200 animate-shimmer" />
      </div>
    </div>
  );
};

export default CareersFormSkeleton;
