"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/theme-context";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  Mail,
  ArrowLeft,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  Send,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Alamat email wajib diisi.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
        }
      );

      if (resetError) {
        setError(resetError.message);
      } else {
        setIsSent(true);
      }
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
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

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 border border-blue-400/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Lupa Kata Sandi
          </h1>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em] mt-1">
            RESET PASSWORD
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Masukkan email Anda, kami akan kirimkan link reset password
          </p>
        </div>

        <Card className="shadow-xl p-8 rounded-3xl">
          {isSent ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Email Terkirim!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Kami telah mengirimkan link reset password ke:
              </p>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4">
                {email}
              </p>
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-3 mb-6">
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <strong>Tips:</strong> Periksa juga folder <strong>Spam</strong> atau{" "}
                  <strong>Promosi</strong> di email Anda. Link akan kedaluwarsa
                  dalam 1 jam.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  variant="glow"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setIsSent(false);
                    setEmail("");
                  }}
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Ulang ke Email Lain</span>
                </Button>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full mt-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Login</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-400 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                  label="Alamat Email Terdaftar"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="nama@kantor-notaris.id"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={error && !email ? error : undefined}
                  required
                  autoComplete="email"
                />

                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  className="w-full mt-3"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Link Reset Password</span>
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Sudah ingat password?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    Kembali ke Login
                  </Link>
                </p>
              </div>
            </>
          )}
        </Card>

        <p className="text-center text-xs text-slate-400 mt-8">
          © 2026 NexusPPAT — Sistem Manajemen Notaris & PPAT Terpadu.
        </p>
      </div>
    </div>
  );
}
