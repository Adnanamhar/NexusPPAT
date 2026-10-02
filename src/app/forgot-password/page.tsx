"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  ShieldCheck,
  Mail,
  User,
  Lock,
  ArrowLeft,
  Sun,
  Moon,
  AlertCircle,
  Save,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !newPassword) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/direct-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal mereset kata sandi.");
      } else {
        toast.success("Kata sandi berhasil direset! Silakan login.");
        router.push("/login");
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
            Pemulihan Akun
          </h1>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em] mt-1">
            RESET TANPA LINK EMAIL
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Verifikasi identitas Anda untuk membuat kata sandi baru
          </p>
        </div>

        <Card className="shadow-xl p-8 rounded-3xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-400 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-3 mb-2">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <strong>Pemulihan Langsung:</strong> Masukkan Email Anda dan buat kata sandi baru.
              </p>
            </div>

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
              required
              autoComplete="email"
            />



            <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-4" />

            <Input
              label="Kata Sandi Baru"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Minimal 6 karakter"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Konfirmasi Kata Sandi"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Ketik ulang kata sandi baru"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full mt-3"
              isLoading={isLoading}
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              <span>Ganti Kata Sandi</span>
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Kembali ke Halaman Login</span>
            </Link>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-8">
          © 2026 NexusPPAT — Sistem Manajemen Notaris & PPAT Terpadu.
        </p>
      </div>
    </div>
  );
}
