"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Lock, Mail, User, Phone, Building, CheckCircle2, ArrowRight, Sun, Moon, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [selectedRole, setSelectedRole] = useState<UserRole>("notaris");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skNumber, setSkNumber] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};

    if (!fullName.trim()) newErrors.fullName = "Nama lengkap wajib diisi.";
    
    if (!email.trim()) {
      newErrors.email = "Alamat email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }

    if (!phone.trim()) newErrors.phone = "Nomor telepon wajib diisi.";
    
    if (selectedRole === "notaris" && !skNumber.trim()) {
      newErrors.skNumber = "Nomor SK wajib diisi untuk Notaris.";
    }

    if (!officeName.trim()) {
      newErrors.officeName = selectedRole === "klien" ? "Domisili wajib diisi." : "Nama kantor wajib diisi.";
    }

    if (!password) {
      newErrors.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      newErrors.password = "Password minimal 6 karakter.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await register({
      email,
      password,
      fullName,
      role: selectedRole,
      phone,
      skNumber: selectedRole === "notaris" ? skNumber : undefined,
      officeName,
    });

    if (!success) {
      setErrors((prev) => ({ ...prev, general: "Pendaftaran gagal. Periksa kembali data Anda." }));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070c18] flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors py-12">
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

      {/* Main Register Container */}
      <div className="w-full max-w-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 border border-blue-400/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Daftar Notaris Pro</h1>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em] mt-1">
            PEMBUATAN AKUN BARU
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pilih jenis akun sesuai peran operasional Anda dalam sistem
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

          {/* 3-Role Selection Cards */}
          <div className="mb-6">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              Pilih Jenis Akun & Peran:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Notaris */}
              <button
                type="button"
                onClick={() => { setSelectedRole("notaris"); setErrors({}); }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  selectedRole === "notaris"
                    ? "bg-blue-50 dark:bg-blue-500/20 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/20"
                    : "bg-slate-50 dark:bg-[#0d1628] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-xs">Notaris / PPAT</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  Pejabat resmi, verifikasi akta & tanda tangan digital
                </div>
                {selectedRole === "notaris" && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute top-3 right-3" />
                )}
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => { setSelectedRole("admin"); setErrors({}); }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  selectedRole === "admin"
                    ? "bg-emerald-50 dark:bg-emerald-500/20 border-emerald-600 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/20"
                    : "bg-slate-50 dark:bg-[#0d1628] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-xs">Admin Kantor</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  Pengelolaan klien, jadwal berkas & keuangan/billing
                </div>
                {selectedRole === "admin" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute top-3 right-3" />
                )}
              </button>

              {/* Klien */}
              <button
                type="button"
                onClick={() => { setSelectedRole("klien"); setErrors({}); }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  selectedRole === "klien"
                    ? "bg-purple-50 dark:bg-purple-500/20 border-purple-600 dark:border-purple-500 text-purple-700 dark:text-purple-400 ring-2 ring-purple-500/20"
                    : "bg-slate-50 dark:bg-[#0d1628] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-xs">Portal Klien</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                  Pemohon akta, unggah KTP/pajak & bayar tagihan
                </div>
                {selectedRole === "klien" && (
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 absolute top-3 right-3" />
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            <Input
              label="Nama Lengkap & Gelar"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }));
              }}
              placeholder={selectedRole === "notaris" ? "Dr. Hendrawan, S.H., M.Kn." : "Budi Santoso"}
              leftIcon={<User className="w-4 h-4" />}
              error={errors.fullName}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Alamat Email Resmi"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="nama@domain.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email}
                required
              />

              <Input
                label="Nomor WhatsApp / Telepon"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                }}
                placeholder="0812-3456-7890"
                leftIcon={<Phone className="w-4 h-4" />}
                error={errors.phone}
                required
              />
            </div>

            {selectedRole === "notaris" && (
              <Input
                label="Nomor SK Pengangkatan Notaris (Kemenkumham)"
                value={skNumber}
                onChange={(e) => {
                  setSkNumber(e.target.value);
                  if (errors.skNumber) setErrors((p) => ({ ...p, skNumber: undefined }));
                }}
                placeholder="AHU-0019283.AH.02.01"
                error={errors.skNumber}
                required
              />
            )}

            <Input
              label={selectedRole === "klien" ? "Alamat Domisili Klien" : "Nama Kantor Notaris & PPAT"}
              value={officeName}
              onChange={(e) => {
                setOfficeName(e.target.value);
                if (errors.officeName) setErrors((p) => ({ ...p, officeName: undefined }));
              }}
              placeholder={selectedRole === "klien" ? "Jakarta Selatan" : "Kantor Notaris Hendrawan, S.H., M.Kn."}
              leftIcon={<Building className="w-4 h-4" />}
              error={errors.officeName}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              />

              <Input
                label="Ulangi Kata Sandi"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined }));
                }}
                placeholder="Konfirmasi sandi"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword}
                required
              />
            </div>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full mt-4"
              isLoading={isLoading}
              disabled={isLoading}
            >
              <span>Daftar Akun {selectedRole.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Masuk ke Sistem
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
