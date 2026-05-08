"use client";

import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/AdminSidebar";
import PopupDisplay from "@/components/PopupDisplay";
import EmergencyWA from "@/components/EmergencyWA";
import MobileBottomNavbar from "@/components/MobileBottomNavbar";
import { usePathname } from "next/navigation";

export default function ClientLayoutContent({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: string;
}>) {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith(`/${locale}/admin`);

  return (
    <>
      {isAdminPage ? (
        <div className="flex min-h-screen bg-gray-100">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </div>
      ) : (
        <>
          <Navbar locale={locale} />
          <MobileBottomNavbar />
          <main className="min-h-screen">{children}</main>
          <EmergencyWA />
          <PopupDisplay />
          <Footer />
        </>
      )}
    </>
  );
}
