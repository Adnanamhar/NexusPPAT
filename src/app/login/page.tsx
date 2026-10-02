"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Lock, Mail, ArrowRight, Sun, Moon, Sparkles, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Alamat email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await login(email.trim(), password);
    if (!success) {
      setErrors((prev) => ({ ...prev, general: "Login gagal. Periksa email dan password Anda." }));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070c18] flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-[#1e3256] text-slate-700 dark:text-slate-300 shadow-sm hover:scale-105 transition-all cursor-pointer"
          title="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 border border-blue-400/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Notaris Pro</h1>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em] mt-1">
            DIGITAL LEGAL SUITE
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Sistem Manajemen Kantor Notaris & PPAT Terpadu
          </p>
        </div>

        <Card className="shadow-xl p-8 rounded-3xl">
          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Alamat Email Akun"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="nama@kantor-notaris.id"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Kata Sandi"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
              }}
              placeholder="Minimal 6 karakter"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span>Ingat akun ini</span>
              </label>
              <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Lupa sandi?
              </Link>
            </div>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full mt-3"
              isLoading={isLoading}
              disabled={isLoading}
            >
              <span>Masuk ke Sistem</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Belum memiliki akun?{" "}
              <Link href="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Daftar Akun Baru
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-8">
          © 2026 Notaris Pro Indonesia. Kepatuhan Regulasi Notaris & PPAT RI.
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
