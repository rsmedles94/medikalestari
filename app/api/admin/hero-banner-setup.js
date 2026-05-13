/**
 * SCRIPT TO ADD SAMPLE HERO BANNERS TO SUPABASE
 * Run this in browser console at production URL to add test data
 *
 * Usage:
 * 1. Buka production site
 * 2. Buka console (F12)
 * 3. Paste kode berikut
 */

async function addSampleHeroBanners() {
  try {
    // Add desktop banner
    const desktopRes = await fetch("/api/admin/hero-banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1900&h=720&fit=crop",
        order: 1,
        is_active: true,
        device_type: "desktop",
      }),
    });

    // Add mobile banner
    const mobileRes = await fetch("/api/admin/hero-banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=2208&h=2760&fit=crop",
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
