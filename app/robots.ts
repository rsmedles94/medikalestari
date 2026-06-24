import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Admin & halaman teknis
        disallow: ["/admin/", "/api/", "/analytics-debug/"],
        // Publik
        allow: [
          "/",
          "/alur-pendaftaran/",
          "/careers/",
          "/dokter/",
          "/jadwal-dokter/",
          "/ketersediaan-kamar/",
          "/kontak-kami/",
          "/medical-checkup/",
          "/promo/",
          "/services/",
          "/syarat-ketentuan/",
          "/tarif-kamar/",
          "/tentang-kami/",
        ],
      },
    ],
  };
}
