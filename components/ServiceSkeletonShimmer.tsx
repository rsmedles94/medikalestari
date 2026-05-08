"use client";

import React from "react";

const ServiceSkeletonShimmer = () => {
  return (
    <>
      <style>{`
        @keyframes shimmer-animation {
          0% {
            background-position: -1200px 0;
          }
          100% {
            background-position: 1200px 0;
          }
        }

        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #f1f5f9 0%,
            #e2e8f0 50%,
            #f1f5f9 100%
          );
          background-size: 1200px 100%;
          animation: shimmer-animation 2s infinite;
        }

        .skeleton-rounded {
          border-radius: 0.5rem;
        }
      `}</style>

      {/* Service Card Skeleton */}
      <div className="group relative aspect-square flex flex-col overflow-hidden bg-white shadow-md rounded-sm">
        {/* Background Shimmer Layer */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full skeleton-shimmer" />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-slate-300/80 to-slate-400 opacity-80 z-10" />

        {/* Content Container */}
        <div className="relative z-20 p-8 h-full flex flex-col items-start text-left">
          {/* Logo Skeleton - Rata Kiri */}
          <div className="mb-4 h-16 w-28 flex justify-start items-center">
            <div className="h-12 w-24 skeleton-shimmer skeleton-rounded" />
          </div>

          {/* Judul & Deskripsi Container */}
          <div className="flex-grow flex flex-col justify-center w-full">
            {/* Title Skeleton */}
            <div className="mb-3 space-y-2">
              <div className="h-8 w-3/4 skeleton-shimmer skeleton-rounded" />
              <div className="h-7 w-2/3 skeleton-shimmer skeleton-rounded" />
            </div>

            {/* Description Skeleton - 3 Lines */}
            <div className="space-y-2 mt-4">
              <div className="h-3 w-full skeleton-shimmer skeleton-rounded" />
              <div className="h-3 w-full skeleton-shimmer skeleton-rounded" />
              <div className="h-3 w-4/5 skeleton-shimmer skeleton-rounded" />
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="mt-6 w-32">
            <div className="h-9 w-32 skeleton-shimmer skeleton-rounded" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceSkeletonShimmer;
