/**
 * Production Middleware Configuration
 * ====================================
 *
 * Middleware untuk:
 * 1. Cache headers optimization
 * 2. Security headers
 * 3. Performance monitoring
 * 4. Error tracking
 */

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ============================================
  // 1. CACHE HEADERS - Optimize caching strategy
  // ============================================

  const pathname = request.nextUrl.pathname;

  // Static assets - very long cache with versioning
  if (pathname.match(/\.(js|css|woff|woff2|ttf|eot)(\?.*)?$/)) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    ); // 1 year
    response.headers.set("Vary", "Accept-Encoding");
  }
  // Images - long cache but allow revalidation
  else if (pathname.match(/\.(gif|ico|jpg|jpeg|png|webp|svg)(\?.*)?$/)) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=2592000, stale-while-revalidate=86400",
    ); // 30 days + stale window
    response.headers.set("Vary", "Accept-Encoding");
  }
  // API routes - short cache untuk dynamic data
  else if (pathname.startsWith("/api/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
    ); // 30s client + 60s CDN + stale window
    response.headers.set("Vary", "Accept, Accept-Encoding");
  }
  // HTML pages - short TTL untuk freshness, long stale window
  else if (
    pathname.endsWith(".html") ||
    pathname === "" ||
    !pathname.includes(".")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
    ); // 1min client + 5min CDN + 1 day stale
    response.headers.set("Vary", "Accept-Encoding, Accept-Language");
  }
  // Default untuk routes lain
  else {
    response.headers.set(
      "Cache-Control",
      "public, max-age=300, s-maxage=600, stale-while-revalidate=3600",
    ); // 5min client + 10min CDN + 1 hour stale
  }

  // ============================================
  // 2. SECURITY HEADERS - Prevent common attacks
  // ============================================

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "img-src 'self' data: https:",
      "font-src 'self' data: https://cdn.jsdelivr.net",
      "connect-src 'self' https: wss:",
      "media-src 'self' https:",
      "frame-ancestors 'self'",
    ].join("; "),
  );

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()",
  );

  // ============================================
  // 3. CORS HEADERS
  // ============================================

  // Allow cross-origin requests (jika needed)
  if (pathname.startsWith("/api/")) {
    response.headers.set(
      "Access-Control-Allow-Origin",
      process.env.NEXT_PUBLIC_DOMAIN || "*",
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }

  // ============================================
  // 4. PERFORMANCE HEADERS
  // ============================================

  // Enable compression
  response.headers.set("Content-Encoding", "gzip, deflate, br");

  // Early hints untuk critical resources
  response.headers.set(
    "Link",
    "</fonts/inter.woff2>; rel=preload; as=font; crossorigin",
  );

  // ============================================
  // 5. CUSTOM HEADERS - Untuk monitoring
  // ============================================

  // Add timestamp untuk cache debugging
  response.headers.set("X-Deployment-Time", new Date().toISOString());

  // Add request ID untuk error tracking
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  response.headers.set("X-Request-ID", requestId);

  return response;
}

// ============================================
// MIDDLEWARE CONFIG - Specify which routes to apply middleware
// ============================================

export const config = {
  matcher: [
    // Apply middleware to all routes except:
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

/**
 * IMPORTANT NOTES FOR PRODUCTION:
 *
 * 1. Cache-Control headers:
 *    - Static assets: 1 year (immutable)
 *    - API routes: 1-2 minutes (s-maxage untuk CDN)
 *    - HTML pages: 5-10 minutes
 *
 * 2. Security Headers:
 *    - CSP: Restrict resource loading
 *    - X-Frame-Options: Prevent clickjacking
 *    - X-Content-Type-Options: Prevent MIME sniffing
 *
 * 3. Performance:
 *    - Early hints untuk critical fonts
 *    - Compression headers
 *    - Request ID tracking untuk debugging
 *
 * 4. Monitoring:
 *    - X-Request-ID di setiap response
 *    - X-Deployment-Time untuk versioning
 */
