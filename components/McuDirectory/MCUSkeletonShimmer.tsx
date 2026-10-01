"use client";

import React from "react";

const MCUSkeletonShimmer = ({ count = 4 }) => {
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
          border-radius: 0.375rem;
        }
      `}</style>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 overflow-hidden flex flex-col h-full"
          >
            {/* Image skeleton */}
            <div className="w-full h-40 skeleton-shimmer" />

            {/* Content Area */}
            <div className="p-4 flex flex-col grow gap-3">
              {/* Title skeleton */}
              <div className="w-3/4 h-5 skeleton-shimmer skeleton-rounded" />

              {/* Price skeleton */}
              <div className="mt-auto w-1/2 h-6 skeleton-shimmer skeleton-rounded" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MCUSkeletonShimmer;
