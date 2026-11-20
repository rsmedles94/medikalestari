"use client";

import React from "react";

interface PromoCardSkeletonProps {
  count?: number;
}

// Struktur & ukuran sengaja SAMA dengan slide card promo asli di PromoKesehatan:
// - pembungkus  : w-1/2 lg:w-1/4 + p-2 md:p-3
// - card        : border-gray-300, p-4 md:p-10, judul min-h-12, deskripsi mt-10
// Dengan begitu saat skeleton diganti card asli, tidak ada layout shift.
const PromoCardSkeleton = ({ count = 4 }: PromoCardSkeletonProps) => {
  const skeletonKeys = Array.from(
    { length: count },
    (_, idx) => `skeleton-card-${idx}`,
  );

  return (
    <>
      <style>{`
        @keyframes promo-skeleton-shimmer {
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
          animation: promo-skeleton-shimmer 2s infinite;
        }

        .skeleton-rounded {
          border-radius: 0.375rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .skeleton-shimmer {
            animation: none;
          }
        }
      `}</style>

      {/* di mobile hanya 2 card terlihat (sisanya terpotong overflow-hidden) */}
      <div className="flex w-full overflow-hidden" aria-busy="true">
        <span className="sr-only">Memuat promo...</span>

        {skeletonKeys.map((skeletonKey) => (
          <div
            key={skeletonKey}
            className="w-1/2 lg:w-1/4 shrink-0 p-2 md:p-3"
            aria-hidden="true"
          >
            <article className="bg-white border border-gray-300 flex flex-col h-full overflow-hidden">
              {/* Image skeleton */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                <div className="w-full h-full skeleton-shimmer" />
              </div>

              {/* Content area */}
              <div className="p-4 md:p-10 flex flex-col grow text-center bg-white">
                {/* Title skeleton (min-h-12 seperti judul asli) */}
                <div className="min-h-12 mb-2 flex flex-col items-center justify-center gap-2">
                  <div className="h-4 w-3/4 skeleton-shimmer skeleton-rounded" />
                  <div className="h-4 w-1/2 skeleton-shimmer skeleton-rounded" />
                </div>

                {/* Description skeleton (mt-10 seperti deskripsi asli) */}
                <div className="mt-10 mb-5 space-y-2">
                  <div className="h-3 w-full skeleton-shimmer skeleton-rounded" />
                  <div className="h-3 w-full skeleton-shimmer skeleton-rounded" />
                  <div className="h-3 w-4/5 mx-auto skeleton-shimmer skeleton-rounded" />
                </div>

                {/* Button skeleton */}
                <div className="mt-auto">
                  <div className="h-8 w-full skeleton-shimmer skeleton-rounded" />
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </>
  );
};

export default PromoCardSkeleton;
