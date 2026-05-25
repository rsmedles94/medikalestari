"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { AdminPageSkeleton } from "@/components/AdminSkeleton";
import { Users, Calendar, ChevronRight } from "lucide-react";

// Mengganti warna background ke [#003f88] dan teks ke putih
const ScaleButton = ({
  onClick,
  children,
  className = "",
  icon: Icon,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ size: number; className?: string }>;
}) => (
  <button
    onClick={onClick}
    className={`group px-6 py-4 bg-blue-600 text-white rounded-xl transition-all duration-300 
    hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-3 ${className}`}
  >
    {Icon && (
      <Icon size={18} className="transition-transform group-hover:scale-110" />
    )}
    <span className="font-medium text-[14px]">{children}</span>
  </button>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalSchedules: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        router.push("/admin/login");
        return;
      }

      try {
        const [docRes, schRes] = await Promise.all([
          fetch("/api/admin/stats/doctors")
            .then((r) => r.json())
            .catch(() => ({ count: 0 })),
          fetch("/api/admin/stats/schedules")
            .then((r) => r.json())
            .catch(() => ({ count: 0 })),
        ]);

        if (mounted) {
          setStats({
            totalDoctors: docRes.count || 0,
            totalSchedules: schRes.count || 0,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
        if (mounted) setLoading(false);
      }
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated, router]);

  if (loading) {
    return <AdminPageSkeleton title="Dashboard" />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans">
      <div className="max-w-[1220px] mx-auto px-6 md:px-12 py-12">
        <header className="mb-5 flex items-center gap-4">
          <h1 className="text-[40px] font-medium">Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Card Dokter */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-[12px] mb-2">Total Dokter</p>
                <p className="text-5xl font-light tracking-normal">
                  {stats.totalDoctors < 10
                    ? `0${stats.totalDoctors}`
                    : stats.totalDoctors}
                </p>
              </div>
              <div className="p-4 rounded-xl transition-all duration-500">
                <Users size={24} />
              </div>
            </div>
            <ScaleButton
              onClick={() => router.push("/admin/doctors")}
              className="mt-10 w-full"
              icon={ChevronRight}
            >
              Kelola Data Dokter
            </ScaleButton>
          </div>

          {/* Card Jadwal */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-[12px] mb-2">
                  Total Jadwal Aktif
                </p>
                <p className="text-5xl font-light tracking-normal">
                  {stats.totalSchedules < 10
                    ? `0${stats.totalSchedules}`
                    : stats.totalSchedules}
                </p>
              </div>
              <div className="p-4  transition-all duration-500">
                <Calendar size={24} />
              </div>
            </div>
            <ScaleButton
              onClick={() => router.push("/admin/schedules")}
              className="mt-10 w-full"
              icon={ChevronRight}
            >
              Atur Jadwal Praktik
            </ScaleButton>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-2xl p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-100">
          <div className="flex items-center gap-3 mb-8"></div>
          <p className="text-slate-400 font-semibold text-[30px] mb-10 -mt-10">
            Kelola Konten
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ScaleButton
              onClick={() => router.push("/admin/doctors")}
              className="bg-blue-600"
            >
              Dokter
            </ScaleButton>
            <ScaleButton
              onClick={() => router.push("/admin/schedules")}
              className="bg-blue-600"
            >
              Jadwal
            </ScaleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
