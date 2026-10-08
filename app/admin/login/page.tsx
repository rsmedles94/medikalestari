"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthProvider";
import { AlertCircle, Eye, EyeOff, Mail, Lock, Loader2, X } from "lucide-react";
import { Session } from "@supabase/supabase-js";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Validasi apakah email dan password sudah terisi
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

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
          const session: Session = data.session;

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
    <main className="min-h-screen w-full flex items-center justify-center bg-white font-sans antialiased overflow-hidden">
      {/* Form Login  */}
      <section className="w-full max-w-lg min-h-screen flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-white">
        {/* Header: Logo & Tombol Close (X) */}
        <header className="flex items-center justify-between w-full h-12">
          <div className="relative w-32 h-10">
            <Image
              src="/logo.png"
              alt="Logo RS Medika Lestari"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
          <Link
            href="/"
            aria-label="Kembali ke beranda"
            className="w-10 h-10 flex items-center justify-center text-gray-700"
          >
            <X size={30} />
          </Link>
        </header>

        {/* Section Utama Form */}
        <article className="w-full max-w-sm mx-auto my-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Masuk / Login
            </h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Selamat datang di RS Medika Lestari.
            </p>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-red-700 text-xs font-medium leading-snug">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Field Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-700"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Field Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-700"
              >
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full h-11 pl-10 pr-11 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  tabIndex={-1}
                  className="absolute right-0 h-11 w-11 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-r-lg"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full h-11 mt-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
                isFormValid && !loading
                  ? "bg-[#003369] text-white hover:bg-[#01274F] active:scale-[0.99] cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (
                "Lanjutkan"
              )}
            </button>
          </form>
        </article>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} RS Medika Lestari. All rights
          reserved.
        </footer>
      </section>
    </main>
  );
};

export default AdminLoginPage;
