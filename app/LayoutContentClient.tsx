// LayoutContentClient.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminSidebar from "@/components/AdminSidebar";
import MobileBottomNavbar from "@/components/MobileBottomNavbar";
import { PageTracker } from "@/components/PageTracker";
import { ServiceWorkerInitializer } from "@/components/ServiceWorkerInitializer";
import PopupDisplay from "@/components/PopupDisplay";

interface LayoutContentProps {
  children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const isAdminPage = pathname?.startsWith(`/admin`);
  const isLoginPage = pathname === `/admin/login`;

  // Logika background bawaan Anda
  const shouldUseLightBackground =
    isLoginPage || authLoading || !isAuthenticated;

  return (
    <>
      <PageTracker pagePath={pathname || "/"} />
      {isAdminPage ? (
        <div
          className={`min-h-screen ${shouldUseLightBackground ? "bg-white" : "bg-gray-100 md:ml-64"}`}
        >
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <MobileBottomNavbar />
          <ServiceWorkerInitializer debug={false} />
          <main className="min-h-screen pt-28 md:pt-26">{children}</main>
          <PopupDisplay />
          <Footer />
        </>
      )}
    </>
  );
}
