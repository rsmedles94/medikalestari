import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/admin/", "/api/", "/analytics-debug/"],
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
