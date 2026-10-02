"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FeatureGuide } from "@/components/ui/feature-guide";
import { MODULE_GUIDES } from "@/lib/guides";
import { useAuth } from "@/contexts/auth-context";
import {
  User,
  Building,
  Users,
  Save,
  FileSignature,
  CreditCard,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, role, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || (role === "klien" ? "" : "Dr. Hendrawan Kartasasmita, S.H., M.Kn."));
  const [skNumber, setSkNumber] = useState(user?.skNumber || (role === "klien" ? "" : "SK Menkumham No. AHU-0019283.AH.02.01"));
  const [skPpat, setSkPpat] = useState(role === "klien" ? "" : "SK Kepala BPN RI No. 12/KEP-BPN/PPAT/2019");
  const [phone, setPhone] = useState(user?.phone || (role === "klien" ? "" : "+62 811-9876-5432"));
  const [officeName, setOfficeName] = useState(user?.officeName || (role === "klien" ? "" : "Kantor Notaris & PPAT Hendrawan, S.H., M.Kn."));
  const [officeAddress, setOfficeAddress] = useState(role === "klien" ? "" : "Sudirman Central Business District (SCBD) Tower 1 Lt. 8, Jakarta Selatan");
  const [escrowBank, setEscrowBank] = useState(role === "klien" ? "" : "BCA Cabang Sudirman - No. Rek: 012-9988-7711 a.n. Escrow Notaris Hendrawan");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName,
      skNumber,
      phone,
      officeName,
    });
  };

  if (role === "klien") {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
          <div className="pt-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pengaturan Profil
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Perbarui identitas diri (NIK, alamat) untuk mempercepat pengisian otomatis saat mengajukan layanan akta.
            </p>
          </div>

          <Card className="p-8 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-500/40 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt="Klien Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{fullName}</h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Klien / Pemohon</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="NAMA LENGKAP (SESUAI KTP)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  minLength={3}
                  maxLength={50}
                  required
                />
                <Input
                  label="NOMOR INDUK KEPENDUDUKAN (NIK)"
                  value={skNumber}
                  placeholder="16 Digit NIK"
                  onChange={(e) => setSkNumber(e.target.value)}
                  maxLength={16}
                  minLength={16}
                  pattern="[0-9]*"
                  title="NIK harus berupa 16 digit angka"
                  required
                />
              </div>

              <Textarea
                label="ALAMAT DOMISILI (SESUAI KTP)"
                value={officeName} 
                onChange={(e) => setOfficeName(e.target.value)}
                rows={3}
                minLength={10}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="NOMOR TELEPON / WHATSAPP AKTIF"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={20}
                  minLength={10}
                  pattern="^[0-9\-\+\s]+$"
                  title="Nomor telepon harus berupa angka (dapat mengandung +, -, atau spasi)"
                  required
                />
                <Input
                  label="NOMOR NPWP PRIBADI (OPSIONAL)"
                  value={skPpat}
                  onChange={(e) => setSkPpat(e.target.value)}
                  maxLength={16}
                  minLength={15}
                  pattern="[0-9.-]*"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" variant="glow" className="bg-purple-600 hover:bg-purple-700 shadow-purple-500/30">
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Simpan Profil Klien</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Module Guide */}
        <FeatureGuide guide={MODULE_GUIDES.settings} />

        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pengaturan Sistem & Kantor
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Konfigurasi identitas SK pejabat, kop surat akta, rekening penampung, dan hak akses tim.
          </p>
        </div>

        {/* Setting Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: "profile", label: "Profil & SK Pejabat", icon: User },
            { id: "office", label: "Kantor & Kop Akta", icon: Building },
            { id: "team", label: "Anggota Tim & Staf", icon: Users },
            { id: "escrow", label: "Rekening Escrow", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0c162b]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profil Notaris */}
        {activeTab === "profile" && (
          <Card className="p-8 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500/40 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt="Notaris Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{fullName}</h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{user?.roleTitle || "Pejabat Notaris"}</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2 text-xs py-1" onClick={() => toast.info("Fitur upload foto profil siap dihubungkan ke Supabase Storage")}>
                    Ganti Foto Resmi
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="NAMA LENGKAP & GELAR RESMI NOTARIS"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="NOMOR TELEPON / WHATSAPP KANTOR"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="NOMOR SK PENGANGKATAN NOTARIS (KEMENKUMHAM)"
                  value={skNumber}
                  onChange={(e) => setSkNumber(e.target.value)}
                  required
                  disabled={role !== "notaris"}
                />
                <Input
                  label="NOMOR SK PEJABAT PEMBUAT AKTA TANAH (PPAT BPN)"
                  value={skPpat}
                  onChange={(e) => setSkPpat(e.target.value)}
                  required
                  disabled={role !== "notaris"}
                />
              </div>

              {role !== "notaris" && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Hanya Super Admin Notaris yang berwenang mengubah nomor SK Pejabat resmi.</span>
                </p>
              )}

              <div className="p-4 bg-blue-50/50 dark:bg-[#080e1c] rounded-xl border border-blue-200 dark:border-blue-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSignature className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200">Tanda Tangan & Cap Digital Terdaftar</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Telah tersertifikasi BSrE / Balai Sertifikasi Elektronik BSSN</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/30">
                  Aktif Valid
                </span>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" variant="glow">
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Simpan Perubahan</span>
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Tab 2: Kantor & Kop Akta */}
        {activeTab === "office" && (
          <Card className="p-8 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              <Input
                label="NAMA KANTOR NOTARIS & PPAT"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                required
              />

              <Textarea
                label="ALAMAT RESMI KANTOR (TERTERA PADA KOP AKTA)"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                rows={3}
                required
              />

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" variant="glow">
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Simpan Kop Surat</span>
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Tab 3: Tim & Staf */}
        {activeTab === "team" && (
          <Card className="p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase">Daftar Anggota Staf & Admin</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kelola hak akses penyusunan draft dan verifikasi berkas</p>
              </div>
              <Button size="sm" variant="glow" onClick={() => toast.success("Undangan staf baru telah dibuat!")}>
                + Undang Staf Baru
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { name: "Dr. Hendrawan Kartasasmita, S.H., M.Kn.", role: "Notaris / PPAT (Super Admin)", email: "notaris.hendrawan@notarispro.id" },
                { name: "Amanda Rahmawati, S.E.", role: "Admin & Billing Officer", email: "admin@notarispro.id" },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#080e1c] rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{member.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{member.email}</p>
                  </div>
                  <span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 px-3 py-1 rounded-lg font-semibold">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tab 4: Escrow Account */}
        {activeTab === "escrow" && (
          <Card className="p-8 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase">Rekening Escrow Penampung Notaris</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Rekening terpercaya yang digunakan untuk menampung dana transaksi tanah sebelum Akta Jual Beli ditandatangani.
                </p>
              </div>

              <Textarea
                label="INFORMASI REKENING RESMI NOTARIS"
                value={escrowBank}
                onChange={(e) => setEscrowBank(e.target.value)}
                rows={3}
                required
              />

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" variant="glow">
                  <Save className="w-4 h-4 mr-1.5" />
                  <span>Simpan Rekening</span>
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
