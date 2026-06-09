"use client";

import React from "react";

export const AdminPageSkeleton = ({
  title = "Loading...",
}: {
  title?: string;
}) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <header className="bg-white border-b border-slate-100 p-4">
          <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-4">
            <div className="h-8 bg-slate-200 rounded w-1/4" />
          </div>
        </header>

        {/* Content Area */}
        <main className="max-w-[1220px] mx-auto px-4 md:px-8 py-8">
          <div className="space-y-6">
            {/* ButtonBar Skeleton */}
            <div className="h-12 bg-slate-200 rounded w-40" />

            {/* Table Skeleton */}
            <section className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 space-y-6">
                {new Array(5).fill(0).map((_, i) => (
                  <div key={`row-${i}`} className="space-y-3">
                    <div className="flex gap-4">
                      <div className="flex-1 h-6 bg-slate-100 rounded" />
                      <div className="flex-1 h-6 bg-slate-100 rounded" />
                      <div className="flex-1 h-6 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export const AdminTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="p-6 space-y-4">
        {new Array(rows).fill(0).map((_, i) => (
          <div key={`skeleton-row-${i}`} className="flex gap-4">
            <div className="flex-1 h-6 bg-slate-100 rounded" />
            <div className="flex-1 h-6 bg-slate-100 rounded" />
            <div className="flex-1 h-6 bg-slate-100 rounded" />
            <div className="w-20 h-6 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
};
