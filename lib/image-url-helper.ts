/**
 * Helper functions untuk construct dan validate Supabase image URLs
 */

/**
 * Construct full Supabase storage URL dari path atau object
 */
export function constructSupabaseImageUrl(
  imagePathOrObject: string | { bucket: string; path: string },
  supabaseUrl?: string,
): string | null {
  const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    console.error(
      "[constructSupabaseImageUrl] NEXT_PUBLIC_SUPABASE_URL not set",
    );
    return null;
  }

  if (typeof imagePathOrObject === "string") {
    const path = imagePathOrObject;

    // Jika sudah full URL, return as-is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Jika sudah full path Supabase storage, return as-is
    if (
      path.includes("/storage/v1/object/public/") ||
      path.includes("/storage/v1/object/authenticated/")
    ) {
      return url + path.split(url)[1]; // Extract path and reconstruct
    }

    // Jika path diawali dengan /, anggap itu path ke bucket
    if (path.startsWith("/")) {
      return `${url}/storage/v1/object/public${path}`;
    }

    // Jika path tidak ada prefix, anggap relative path ke content bucket
    return `${url}/storage/v1/object/public/${path}`;
  }

  // Jika object dengan bucket dan path
  const { bucket, path } = imagePathOrObject;
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Validate Supabase image URL
 */
export function isValidSupabaseImageUrl(url: string): boolean {
  if (!url) return false;

  // Must be full HTTP/HTTPS URL
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return false;
  }

  // Check if it's from Supabase or other allowed domain
  const allowedHosts = [
    "supabase.co",
    "zecqskgvmfyorhxzhoeu.supabase.co",
    "flagcdn.com",
  ];

  try {
    const urlObj = new URL(url);
    return allowedHosts.some((host) => urlObj.hostname.includes(host));
  } catch {
    return false;
  }
}

/**
 * Extract bucket and path from Supabase storage URL
 */
export function parseSupabaseStorageUrl(url: string): {
  bucket?: string;
  path?: string;
} | null {
  if (!url) return null;

  // Parse full Supabase URL
  // Format: https://zecqskgvmfyorhxzhoeu.supabase.co/storage/v1/object/public/BUCKET/PATH
  const match = url.match(
    /\/storage\/v1\/object\/(?:public|authenticated)\/([^\/]+)\/(.*)/,
  );

  if (match) {
    return {
      bucket: match[1],
      path: match[2],
    };
  }

  return null;
}

/**
 * Debug Supabase image URLs
 */
export function debugSupabaseImageUrl(url: string): void {
  console.log("[debugSupabaseImageUrl] Analyzing URL:", url);

  if (!url) {
    console.warn("[debugSupabaseImageUrl] URL is empty");
    return;
  }

  const isValid = isValidSupabaseImageUrl(url);
  console.log("[debugSupabaseImageUrl] Is valid:", isValid);

  if (url.startsWith("http")) {
    try {
      const urlObj = new URL(url);
      console.log("[debugSupabaseImageUrl] URL details:", {
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
        protocol: urlObj.protocol,
      });

      const parsed = parseSupabaseStorageUrl(url);
      if (parsed) {
        console.log("[debugSupabaseImageUrl] Parsed storage:", parsed);
      }
    } catch (error) {
      console.error("[debugSupabaseImageUrl] Failed to parse URL:", error);
    }
  } else {
    console.warn(
      "[debugSupabaseImageUrl] URL is not HTTP/HTTPS, relative path detected:",
      url,
    );
  }
}
