import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kamar Perawatan",
  description:
    "Kamar Perawatan di RS Medika Lestari.",
  keywords:
    "kamar perawatan",
  openGraph: {
    title: "Kamar Perawatan",
    description:
      "Kamar Perawatan di RS Medika Lestari.",
    type: "website",
  },
};

export default function MCULayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
