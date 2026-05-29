/**
 * SCRIPT TO ADD SAMPLE HERO BANNERS TO SUPABASE
 * Run this in browser console at production URL to add test data
 *
 * Usage:
 * 1. Buka production site
 * 2. Buka console (F12)
 * 3. Paste kode berikut
 *
 * NOTE: Please upload actual images instead of using external URLs
 */

async function addSampleHeroBanners() {
  try {
    // Add desktop banner - PLEASE UPDATE WITH YOUR OWN IMAGE
    const desktopRes = await fetch("/api/admin/hero-banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: "/images/hero-banner-default-desktop.webp", // Update with your actual image path
        order: 1,
        is_active: true,
        device_type: "desktop",
      }),
    });

    // Add mobile banner - PLEASE UPDATE WITH YOUR OWN IMAGE
    const mobileRes = await fetch("/api/admin/hero-banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: "/images/hero-banner-default-mobile.webp", // Update with your actual image path
        order: 1,
        is_active: true,
        device_type: "mobile",
      }),
    });

    const desktop = await desktopRes.json();
    const mobile = await mobileRes.json();

    console.log("✅ Desktop banner added:", desktop);
    console.log("✅ Mobile banner added:", mobile);
    console.log("\n🎉 Sample banners added! Refresh page to see changes.");
  } catch (error) {
    console.error("❌ Error adding sample banners:", error);
  }
}

// Check current status
async function checkHeroBannerStatus() {
  try {
    const res = await fetch("/api/admin/debug-banners");
    const data = await res.json();
    console.log("📊 Hero Banner Status:", data);
    return data;
  } catch (error) {
    console.error("❌ Error checking status:", error);
  }
}

// Usage:
// checkHeroBannerStatus(); // Cek status
// addSampleHeroBanners();  // Tambah sample data
