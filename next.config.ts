import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zecqskgvmfyorhxzhoeu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
    // Disable optimization untuk Supabase URLs untuk menghindari 402 error
    unoptimized: process.env.NODE_ENV === "production",
  },
  /* config options lain bisa ditaruh di sini */
};

export default nextConfig;
