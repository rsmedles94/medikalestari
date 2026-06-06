"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DokterSpesialisRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to /dokter then scroll to section dokter-spesialis
    // Use replace so history doesn't keep the redirect page
    router.replace("/dokter");

    // small timeout to allow the /dokter page to render and mount
    setTimeout(() => {
      const el = document.getElementById("dokter-spesialis");
      if (el) {
        const yOffset = -120; // same offset as used elsewhere
        const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementTop + yOffset, behavior: "smooth" });
      }
    }, 300);
  }, [router]);

  return null;
}
