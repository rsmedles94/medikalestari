import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization untuk production
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
      // INI YANG WAJIB ADA UNTUK AVATAR GOOGLE MAPS
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
    unoptimized: false,
    // Cache optimization
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for static images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Quality settings
    qualities: [75, 85, 90, 95],
  },

  // Compression & optimasi production
  compress: true,

  // Routing optimization
  trailingSlash: false,

  // PoweredBy header removal untuk security
  poweredByHeader: false,

  // Production source maps (optional - untuk error tracking)
  productionBrowserSourceMaps: false,

  // React strict mode OFF di production untuk performa
  reactStrictMode: true,

  // Custom headers untuk caching strategy
  async headers() {
    return [
      // Static assets - cache for 1 year
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Public assets - cache for 1 year
      {
        source: "/:path*.{jpg,jpeg,png,gif,webp,svg,ico}",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Fonts - cache for 1 year
      {
        source: "/:path*.{woff,woff2,ttf,eot,otf}",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // API routes - no cache
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      // HTML pages - short cache + revalidate
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Redirect optimization
  async redirects() {
    return [];
  },

  // Rewrite untuk optimization
  async rewrites() {
    return [];
  },
};

export default nextConfig;
