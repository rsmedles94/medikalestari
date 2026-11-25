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
      // Avatar Google Maps
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "googleusercontent.com",
        pathname: "/**",
      },
    ],
    // Format modern: ukuran file lebih kecil
    formats: ["image/avif", "image/webp"],
    // Hasil optimasi gambar di-cache 1 tahun
    minimumCacheTTL: 60 * 60 * 24 * 365,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 95],
  },

  compress: true,
  trailingSlash: false,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,

  async headers() {
    return [
      // Header keamanan untuk semua route.
      // Cache-Control halaman sengaja TIDAK diatur di sini, supaya halaman
      // realtime seperti /jadwal-dokter tidak tertahan di CDN atau browser.
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "0" }, // fitur lama, dinonaktifkan
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // File statis dari folder /public (gambar & font), 30 hari.
      // File di /_next/static sudah otomatis immutable 1 tahun oleh Next.
      {
        source:
          "/:path*.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      // API routes: cache singkat
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },

  experimental: {
    // https://nextjs.org/docs/messages/middleware-to-proxy
    proxyTimeout: 30_000,

    // Router Cache browser untuk halaman dinamis dimatikan (0 detik),
    // jadi setiap pindah halaman lalu kembali, data diambil ulang.
    staleTimes: {
      dynamic: 0,
      static: 300,
    },
  },
};

export default nextConfig;
