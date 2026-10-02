"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  Lock,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; general?: string }>({});
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  // Verify the recovery session on mount
  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        setIsValidSession(false);
      }
    }

    // Listen for auth events (Supabase sends PASSWORD_RECOVERY event)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsValidSession(true);
        }
      }
    );

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Password baru wajib diisi.";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }

    if (password !== confirmPassword) {
      newErrors.confirm = "Konfirmasi password tidak cocok.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrors({ general: error.message });
      } else {
        setIsSuccess(true);
        toast.success("Password berhasil diubah!");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch {
      setErrors({ general: "Gagal mengubah password. Silakan coba lagi." });
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

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 border border-blue-400/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reset Kata Sandi
          </h1>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em] mt-1">
            BUAT PASSWORD BARU
          </p>
        </div>

        <Card className="shadow-xl p-8 rounded-3xl">
          {isValidSession === false ? (
            /* Invalid/Expired Session */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Link Tidak Valid
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Link reset password sudah kedaluwarsa atau tidak valid. Silakan
                minta link reset baru.
              </p>
              <Button
                variant="glow"
                size="lg"
                className="w-full"
                onClick={() => router.push("/forgot-password")}
              >
                <span>Minta Link Reset Baru</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : isSuccess ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Password Berhasil Diubah!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Kata sandi Anda telah diperbarui. Anda akan diarahkan ke halaman
                login dalam beberapa detik...
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full animate-[progress_3s_linear]" 
                     style={{ animation: "progress 3s linear forwards" }} />
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-400 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                Masukkan kata sandi baru untuk akun Anda. Pastikan minimal 6
                karakter.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                  label="Password Baru"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="Minimal 6 karakter"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.password}
                  required
                  autoComplete="new-password"
                />

                <Input
                  label="Konfirmasi Password Baru"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirm)
                      setErrors((p) => ({ ...p, confirm: undefined }));
                  }}
                  placeholder="Ketik ulang password baru"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.confirm}
                  required
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  className="w-full mt-3"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  <span>Simpan Password Baru</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
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
