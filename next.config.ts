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
    // Image optimization diaktifkan
    unoptimized: false,
  },
  /* config options lain bisa ditaruh di sini */
};

export default nextConfig;
