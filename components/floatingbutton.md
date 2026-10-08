"use client";

import React from "react";
import Image from "next/image";

export default function FlottingButton() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
        {/* Logo dari folder public/error.png */}
        <Image
          src="/vercel.png"
          alt="vercel"
          width={480}
          height={480}
          className="object-contain"
          priority
        />

      </div>
    </div>
  );
}
