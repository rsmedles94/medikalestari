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
      // Static JS/CSS - cache for 1 year (immutable)
      {
        source: "/:path*.:ext(js|css)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Vary",
            value: "Accept-Encoding",
          },
        ],
      },
      // Fonts - cache for 1 year (immutable)
      {
        source: "/:path*.{woff,woff2,ttf,eot,otf}",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Vary",
            value: "Accept-Encoding",
          },
        ],
      },
      // Images - 30 days dengan stale-while-revalidate
      {
        source: "/:path*.{jpg,jpeg,png,gif,webp,svg,ico}",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
          {
            key: "Vary",
            value: "Accept-Encoding",
          },
        ],
      },
      // API routes - short cache dengan stale window
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
          },
          {
            key: "Vary",
            value: "Accept, Accept-Encoding, Authorization",
          },
        ],
      },
      // HTML pages - 1 min cache + 5 min CDN + 1 day stale
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
          },
          {
            key: "Vary",
            value: "Accept-Encoding, Accept-Language, Host",
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
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
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

  // Proxy configuration untuk menggantikan middleware (new pattern)
  // https://nextjs.org/docs/messages/middleware-to-proxy
  experimental: {
    proxyTimeout: 30_000,
  },
};

export default nextConfig;
