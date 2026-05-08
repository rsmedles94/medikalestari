import "@/app/globals.css";
import ClientLayoutContent from "./ClientLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RS Medika Lestari",
  description:
    "Rumah Sakit Medika Lestari - Layanan Kesehatan Terpercaya di Jakarta",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  return <ClientLayoutContent locale={locale}>{children}</ClientLayoutContent>;
}
