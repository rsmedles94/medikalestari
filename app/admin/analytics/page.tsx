"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { AdminPageSkeleton } from "@/components/AdminSkeleton";
import { BarChart3, Eye, MousePointerClick } from "lucide-react";

interface VisitorStats {
  today: number;
  week: number;
  month: number;
  total: number;
}

interface PageData {
  event_name: string;
  count: number;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size: number; className?: string }>;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-[12px] mb-2">{label}</p>
        <p className="text-3xl font-light">{value.toLocaleString()}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-xl">
        <Icon size={20} className="text-blue-600" />
      </div>
    </div>
  </div>
);

const Analytics = () => {
  const [stats, setStats] = useState<VisitorStats>({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });
  const [topPages, setTopPages] = useState<PageData[]>([]);
  const [topClicks, setTopClicks] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [period, setPeriod] = useState<"today" | "week" | "month" | "all">(
    "all",
  );
  const router = useRouter();
  const { loading: authLoading, isAuthenticated } = useAuth();

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, pagesRes, clicksRes] = await Promise.all([
        fetch("/api/admin/analytics?type=stats").then((r) => {
          if (!r.ok) throw new Error(`Stats API error: ${r.status}`);
          return r.json();
        }),
        fetch(`/api/admin/analytics?type=pages&period=${period}`).then((r) => {
          if (!r.ok) throw new Error(`Pages API error: ${r.status}`);
          return r.json();
        }),
        fetch(`/api/admin/analytics?type=clicks&period=${period}`).then((r) => {
          if (!r.ok) throw new Error(`Clicks API error: ${r.status}`);
          return r.json();
        }),
      ]);

      setStats(statsRes);
      setTopPages(pagesRes.slice(0, 10));
      setTopClicks(clicksRes.slice(0, 10));
      setLastUpdated(new Date());
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error loading analytics:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (authLoading) return;
      if (!isAuthenticated) {
        router.push("/admin/login");
        return;
      }

      await loadAnalytics();
    };

    load();

    // Auto-refresh setiap 30 detik
    const interval = setInterval(() => {
      load();
    }, 30000);

    return () => clearInterval(interval);
  }, [authLoading, isAuthenticated, period, router]);

  if (loading) {
    return <AdminPageSkeleton title="Analitik Web" />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] text-black font-sans">
      <div className="max-w-[1220px] mx-auto px-6 md:px-12 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              ⚠️ Error: {error}
            </p>
            <p className="text-red-600 text-xs mt-2">
              Buka DevTools (F12) → Console untuk lihat detail error
            </p>
          </div>
        )}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-[40px] font-medium">Analitik Web</h1>
            {lastUpdated && (
              <p className="text-[12px] text-slate-500">
                Diperbarui: {lastUpdated.toLocaleTimeString("id-ID")}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {(
              ["today", "week", "month", "all"] as Array<
                "today" | "week" | "month" | "all"
              >
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  period === p
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {p === "today"
                  ? "Hari Ini"
                  : p === "week"
                    ? "Minggu Ini"
                    : p === "month"
                      ? "Bulan Ini"
                      : "Semua"}
              </button>
            ))}
          </div>
        </div>

        {/* Visitor Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Pengunjung Hari Ini"
            value={stats.today}
            icon={Eye}
          />
          <StatCard
            label="Pengunjung Minggu Ini"
            value={stats.week}
            icon={Eye}
          />
          <StatCard
            label="Pengunjung Bulan Ini"
            value={stats.month}
            icon={Eye}
          />
          <StatCard label="Total Pengunjung" value={stats.total} icon={Eye} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={24} className="text-blue-600" />
              <h2 className="text-[20px] font-semibold">
                Halaman Paling Dikunjungi
              </h2>
            </div>
            {topPages.length > 0 ? (
              <div className="space-y-4">
                {topPages.map((page, idx) => {
                  const maxCount = Math.max(...topPages.map((p) => p.count));
                  const percentage = (page.count / maxCount) * 100;
                  return (
                    <div key={`page-${idx}`}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[14px] font-medium text-slate-700 truncate">
                          {page.event_name}
                        </p>
                        <p className="text-[14px] font-semibold text-blue-600">
                          {page.count}
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">Tidak ada data</p>
            )}
          </div>

          {/* Top Button Clicks */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <MousePointerClick size={24} className="text-green-600" />
              <h2 className="text-[20px] font-semibold">
                Button Paling Sering Diklik
              </h2>
            </div>
            {topClicks.length > 0 ? (
              <div className="space-y-4">
                {topClicks.map((click, idx) => {
                  const maxCount = Math.max(...topClicks.map((c) => c.count));
                  const percentage = (click.count / maxCount) * 100;
                  return (
                    <div key={`click-${idx}`}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[14px] font-medium text-slate-700 truncate">
                          {click.event_name}
                        </p>
                        <p className="text-[14px] font-semibold text-green-600">
                          {click.count}
                        </p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">Tidak ada data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
