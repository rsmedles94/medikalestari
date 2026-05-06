"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
// Import tipe AuthSession dari supabase-js
import { Session } from "@supabase/supabase-js";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        },
      );

      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        try {
          // Menggunakan data.session secara langsung karena tipenya sudah valid (Session)
          const session: Session = data.session;

          // Convert Supabase user to AdminUser type
          const adminUser = session.user
            ? {
                id: session.user.id,
                email: session.user.email || "",
                role: "admin",
                created_at: session.user.created_at || new Date().toISOString(),
              }
            : null;

          await login(session.access_token, adminUser, session);
        } catch (error) {
          // fallback jika ada error pada fungsi login context
          console.error("Login context error:", error);
        }
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xs shadow-xl p-10 border border-gray-200">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-[#01274F] mb-2">LOGIN</h1>
          <p className="text-gray-400 font-medium text-lg">RS Medika Lestari</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-red-700 text-xs font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#01274F] transition-colors">
              <Mail size={20} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-xs text-sm focus:border-[#01274F] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#003369] transition-colors">
              <Lock size={20} />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-14 pr-14 py-4 bg-white border border-gray-200 rounded-xs text-sm focus:border-[#003369] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#003369] text-white py-4 rounded-xs font-bold text-sm hover:bg-[#01274F] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Login"}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/"
            className="text-sm font-bold text-[#003369] hover:underline"
          >
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
