// app/layout.tsx
import "./globals.css";
import { Providers } from "./providers"; // Pastikan import default/ named sesuai
import { AuthProvider } from "@/context/AuthProvider";
import { SearchModalProvider } from "@/context/SearchModalContext";
import LayoutContent from "./LayoutContentClient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Sitelinks Menu
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Hospital",
      name: "RS Medika Lestari",
      url: "https://www.rsmedikalestari.com",
      logo: "https://www.rsmedikalestari.com/icons/icon-512x512.png",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "RS Medika Lestari",
      url: "https://www.rsmedikalestari.com",
      hasPart: [
        {
          "@type": "WebPage",
          name: "Dokter Kami",
          url: "https://www.rsmedikalestari.com/dokter",
        },
        {
          "@type": "WebPage",
          name: "Jadwal Dokter",
          url: "https://www.rsmedikalestari.com/jadwal-dokter",
        },
        {
          "@type": "WebPage",
          name: "Kamar Perawatan",
          url: "https://www.rsmedikalestari.com/kamar-perawatan",
        },
        {
          "@type": "WebPage",
          name: "Medical Checkup",
          url: "https://www.rsmedikalestari.com/medical-checkup",
        },
        {
          "@type": "WebPage",
          name: "Karir",
          url: "https://www.rsmedikalestari.com/careers",
        },
      ],
    },
  ];

  return (
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* SEO Metadata */}
        <title>RS Medika Lestari</title>
        <meta
          name="description"
          content="RS Medika Lestari bermula dari sebuah klinik pada tahun 1994, kini telah berkembang menjadi fasilitas kesehatan terakreditasi Paripurna (KARS) yang menyediakan layanan medis lengkap dan modern."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* PWA & iOS Settings */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RS Medika Lestari" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-180x180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-192x192.png"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />

        {/* Fonts & Icons */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen bg-white text-black">
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
