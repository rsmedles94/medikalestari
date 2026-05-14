import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "zecqskgvmfyorhxzhoeu.supabase.co",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "rmuojxmwdyxwhpnelolm.supabase.co",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
  /* config options lain bisa ditaruh di sini */
};

export default nextConfig;
