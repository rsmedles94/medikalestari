import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promo Paket Kesehatan",
  description:
    "Paket pemeriksaan kesehatan komprehensif dengan berbagai pilihan sesuai kebutuhan Anda. Deteksi dini, pencegahan penyakit, dan konsultasi dengan dokter profesional.",
  keywords:
    "promo paket kesehatan",
  openGraph: {
    title: "Promo Paket Kesehatan",
    description:
      "Paket pemeriksaan kesehatan komprehensif sesuai kebutuhan Anda",
    type: "website",
  },
};

export default function MCULayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
