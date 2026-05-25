"use client";

import React from "react";

const PromoCardSkeleton = ({ count = 4 }) => {
  // Generate stable keys for each skeleton card
  const skeletonKeys = Array.from({ length: count }).map(
    (_, idx) => `skeleton-card-${idx}`,
  );

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

      <div className="w-full overflow-hidden p-1">
        <div className="flex w-full gap-4 lg:gap-6 justify-start">
          {skeletonKeys.map((skeletonKey) => (
            <div
              key={skeletonKey}
              className="w-[calc(50%-8px)] lg:w-[calc(25%-18px)] shrink-0"
            >
              <article
                className="bg-white border border-slate-100 flex flex-col h-full shadow-md rounded-none overflow-hidden"
                aria-busy="true"
                aria-hidden="true"
              >
                {/* Image skeleton */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                  <div className="w-full h-full skeleton-shimmer" />
                </div>

                {/* Content Area */}
                <div className="p-4 md:p-5 flex flex-col grow text-center bg-white gap-3">
                  {/* Title skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 skeleton-shimmer skeleton-rounded mx-auto w-3/4" />
                    <div className="h-4 skeleton-shimmer skeleton-rounded mx-auto w-2/3" />
                  </div>

                  {/* Description skeleton */}
                  <div className="space-y-2 mt-2">
                    <div className="h-3 skeleton-shimmer skeleton-rounded" />
                    <div className="h-3 skeleton-shimmer skeleton-rounded" />
                    <div className="h-3 skeleton-shimmer skeleton-rounded w-4/5 mx-auto" />
                  </div>

                  {/* Button skeleton */}
                  <div className="mt-auto pt-2">
                    <div className="h-10 skeleton-shimmer skeleton-rounded w-full" />
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PromoCardSkeleton;
