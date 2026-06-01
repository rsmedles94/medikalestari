import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Checkup - RS Medika Lestari",
  description:
    "Paket pemeriksaan kesehatan komprehensif dengan berbagai pilihan sesuai kebutuhan Anda. Deteksi dini, pencegahan penyakit, dan konsultasi dengan dokter profesional.",
  keywords:
    "medical checkup, mcu, pemeriksaan kesehatan, deteksi dini, paket mcu",
  openGraph: {
    title: "Medical Checkup - RS Medika Lestari",
    description:
      "Paket pemeriksaan kesehatan komprehensif sesuai kebutuhan Anda",
    type: "website",
  },
};

export default function MCULayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
