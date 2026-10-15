import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { AuthProvider } from "@/context/AuthProvider";
import { SearchModalProvider } from "@/context/SearchModalContext";
import LayoutContent from "./LayoutContentClient";

// Konfigurasi Font Inter (Native Next.js)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Ekspor Metadata
export const metadata: Metadata = {
  title: "Rumah Sakit Medika Lestari",
  description:
    "RS Medika Lestari adalah sebuah Rumah Sakit Umum modern yang memiliki fasilitas lengkap, dan memiliki jaringan yang luas bertempat di Jl. HOS Cokroaminoto Perum Pondok Lestari Blok C1 No.1-2, Ciledug Kota Tangerang 15157.",
  verification: {
    google: "Th6lu-NdN8e4ZAo2P9c-j15Tfnc9oL_2znO4rLe9WJI",
  },
  manifest: "/manifest.json",
  icons: {
    apple: [
      { url: "/icons/icon-180x180.png", sizes: "180x180" },
      { url: "/icons/icon-192x192.png", sizes: "152x152" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RS Medika Lestari",
  },
};

// Ekspor Viewport
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema JSON-LD
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Hospital",
      "@id": "https://www.rsmedikalestari.com/#hospital",
      name: "RS Medika Lestari",
      url: "https://www.rsmedikalestari.com",
      logo: "https://www.rsmedikalestari.com/icons/icon-512x512.png",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Jl. HOS Cokroaminoto Perum Pondok Lestari Blok C1 No.1-2, Ciledug",
        addressLocality: "Kota Tangerang",
        postalCode: "15157",
        addressCountry: "ID",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Dokter Kami",
          url: "https://www.rsmedikalestari.com/dokter",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Jadwal Dokter",
          url: "https://www.rsmedikalestari.com/jadwal-dokter",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Medical Checkup",
          url: "https://www.rsmedikalestari.com/medical-checkup",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "Karir",
          url: "https://www.rsmedikalestari.com/careers",
        },
      ],
    },
  ];

  return (
    <html
      lang="id"
      className={`h-full antialiased ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Inject JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* CDN Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-black`}>
        <Providers>
          <AuthProvider>
            <SearchModalProvider>
              <LayoutContent>{children}</LayoutContent>
            </SearchModalProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
