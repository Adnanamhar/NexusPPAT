"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FeatureGuide } from "@/components/ui/feature-guide";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonPage } from "@/components/ui/loading-skeleton";
import { MODULE_GUIDES } from "@/lib/guides";
import { useDocuments } from "@/contexts/document-context";
import { useAuth } from "@/contexts/auth-context";
import { formatCurrencyIDR } from "@/lib/cn";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  UploadCloud,
  Sparkles,
  FileCheck2,
  ShieldCheck,
  FileText,
  CreditCard,
  Building,
  Database,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { documents, payments, isLoading, error, loadDemoData, sendReminder } = useDocuments();
  const { user, role } = useAuth();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Filter documents based on role to prevent data leakage
  const filteredDocs = role === "klien"
    ? documents.filter(d => 
        !d.clientUserId ||
        d.clientUserId === user?.id || 
        d.clientUserId === "demo-client-user" ||
        (user?.email && d.seller?.email === user.email) || 
        (user?.skNumber && d.seller?.nik === user.skNumber)
      )
    : documents;

  // Real data calculations
  const totalCount = filteredDocs.length;
  const activeCount = filteredDocs.filter((d) => d.status !== "completed").length;
  const completedCount = filteredDocs.filter((d) => d.status === "completed").length;
  
  // Calculate total revenue from paid payments
  const totalRevenue = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  // Mock quota for display
  const maxDocs = role === "klien" ? 10 : 1000;
  const percentageUsed = maxDocs > 0 ? Math.round((totalCount / maxDocs) * 100) : 0;

  if (isLoading) {
    return (
      <AppLayout>
        <SkeletonPage />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto py-12">
          <EmptyState
            title="Terjadi Kesalahan"
            description={error}
            actionLabel="Muat Ulang Halaman"
            onAction={() => window.location.reload()}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
        {/* Module Guide */}
        <FeatureGuide guide={MODULE_GUIDES.dashboard} />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {role === "klien" ? "Portal Permohonan Klien" : "Overview Operasional Kantor"}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Selamat datang kembali, <strong>{user?.fullName || "User"}</strong>. Berikut ringkasan berkas Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {totalCount === 0 && role !== "klien" && (
              <Button variant="outline" onClick={loadDemoData} className="border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <Database className="w-4 h-4" />
                <span>Muat Data Contoh</span>
              </Button>
            )}
            <Link href="/layanan">
              <Button variant="glow" className="shadow-blue-500/20">
                <FileCheck2 className="w-4 h-4" />
                <span>{role === "klien" ? "+ Pilih Layanan Akta" : "+ Katalog Layanan"}</span>
              </Button>
            </Link>
          </div>
        </div>

        {totalCount === 0 ? (
          <Card className="mt-8">
            <EmptyState
              icon="folder"
              title="Belum Ada Berkas Akta"
              description="Anda belum memiliki berkas atau permohonan akta apapun saat ini. Silakan buat pengajuan baru untuk memulai."
              actionLabel={role === "klien" ? "Buat Permohonan Akta" : "Buat Akta Baru"}
              actionHref="/files/new"
            />
          </Card>
        ) : (
          <>
            {/* 4 Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {/* 1. Total Urusan */}
              <Card className="p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  {role === "klien" ? "BERKAS DIAJUKAN" : "TOTAL URUSAN"}
                </span>
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                  {totalCount}
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium mt-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Keseluruhan data</span>
                </div>
              </Card>

              {/* 2. Aktif */}
              <Card className="p-6 relative overflow-hidden group hover:border-amber-500/50 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  DALAM PROSES
                </span>
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                  {activeCount}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium mt-3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Sedang ditindaklanjuti</span>
                </div>
              </Card>

              {/* 3. Selesai */}
              <Card className="p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  SELESAI
                </span>
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                  {completedCount}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selesai & terdaftar</span>
                </div>
              </Card>

              {/* 4. Pendapatan */}
              <Card className="p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  {role === "klien" ? "TOTAL TAGIHAN LUNAS" : "TOTAL PENDAPATAN"}
                </span>
                <div className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight truncate" title={formatCurrencyIDR(totalRevenue)}>
                  {formatCurrencyIDR(totalRevenue)}
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-3">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Telah dibayar penuh</span>
                </div>
              </Card>
            </div>

            {/* Quota Dokumen & Interactive Showcase Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Quota Dokumen */}
              <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {role === "klien" ? "Batas Permohonan" : "Kapasitas Dokumen Kantor"}
                  </h3>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                        {role === "klien" ? "AKUN PERSONAL" : "PAKET AKTIF"}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{percentageUsed}% Terpakai</span>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {role === "klien" ? "Basic" : "Tier Professional"}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {totalCount} / {maxDocs} Akta
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 dark:bg-[#132038] h-2.5 rounded-full overflow-hidden p-0.5">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-1000 shadow-sm shadow-blue-500/50"
                        style={{ width: `${percentageUsed}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={() => setUpgradeModalOpen(true)}
                  className="w-full mt-6 py-2.5 rounded-xl"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Tingkatkan Kuota Akta</span>
                </Button>
              </Card>

              {/* Right: Digital Suite Feature Banner */}
              <div className="lg:col-span-8 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50/80 dark:from-[#0d1a33] dark:via-[#102244] dark:to-[#0a152b] border border-blue-200/80 dark:border-[#1e345e] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2 max-w-md">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>Sistem Otomasi Hukum 2.0</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Verifikasi Berkas KTP & Sertifikat Berbasis AI OCR
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Hemat waktu penelaahan dokumen hingga 70%. Data para pihak di-ekstrak otomatis dan siap divalidasi langsung dengan sistem KSWP & ATR/BPN.
                    </p>
                  </div>

                  <div className="bg-white/90 dark:bg-[#080e1c]/90 border border-blue-200 dark:border-blue-500/30 p-4 rounded-2xl shadow-sm w-full md:w-64 shrink-0">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Integrasi Terhubung</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      <li className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Dukcapil OCR</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Aktif</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Validasi KSWP</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Siap</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Escrow Account</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">Terlindungi</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 relative z-10">
                  <span>Status Operasional: <strong className="text-slate-700 dark:text-slate-200">Aktif & Terenkripsi AES-256</strong></span>
                  {filteredDocs.length > 0 && (
                    <Link href={`/files/${filteredDocs[0].id}`} className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1">
                      <span>Buka Berkas Terakhir</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* "Jatuh Tempo / Perlu Tindakan" Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    Berkas Terakhir & Status
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Daftar berkas akta terbaru yang membutuhkan tindak lanjut atau penjadwalan.
                  </p>
                </div>

                <Link
                  href="/files"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors"
                >
                  <span>Lihat Semua Berkas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-[#182746] bg-slate-50/70 dark:bg-[#070e1c]/60 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <th className="py-3.5 px-6">NAMA PEMOHON / PIHAK</th>
                        <th className="py-3.5 px-6">JENIS DOKUMEN</th>
                        <th className="py-3.5 px-6">JATUH TEMPO</th>
                        <th className="py-3.5 px-6">BILLING</th>
                        <th className="py-3.5 px-6">STATUS ALUR KERJA</th>
                        <th className="py-3.5 px-6 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#152442] text-xs font-medium">
                      {filteredDocs.slice(0, 5).map((doc) => {
                        // Logic for displaying 'Hari Ini' if due date is today. Simple check:
                        const isToday = new Date(doc.dueDate).toDateString() === new Date().toDateString();

                        return (
                          <tr
                            key={doc.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-[#0f1d38]/60 transition-colors group cursor-pointer"
                          >
                            {/* Client Name */}
                            <td className="py-4 px-6">
                              <Link href={`/files/${doc.id}`} className="block">
                                <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block truncate max-w-[200px]">
                                  {doc.seller.fullName || "Draft Tanpa Nama"}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                  Ref: {doc.refNumber}
                                </span>
                              </Link>
                            </td>

                            {/* Document Type */}
                            <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                              {doc.docTypeLabel}
                            </td>

                            {/* Due Date */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              {isToday ? (
                                <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-500/30">
                                  <AlertTriangle className="w-3 h-3" />
                                  Hari Ini
                                </span>
                              ) : (
                                <span className="text-slate-700 dark:text-slate-300">{doc.dueDate}</span>
                              )}
                            </td>

                            {/* Billing */}
                            <td className="py-4 px-6">
                              <span
                                className={
                                  doc.billingStatus === "Paid"
                                    ? "text-emerald-600 dark:text-emerald-400 font-bold"
                                    : doc.billingStatus === "Unpaid"
                                    ? "text-slate-500 dark:text-slate-400 font-semibold"
                                    : "text-amber-600 dark:text-amber-400 font-bold"
                                }
                              >
                                {doc.billingStatus}
                              </span>
                            </td>

                            {/* Status Badge */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              {doc.status === "signature_pending" && (
                                <Badge variant="signature-pending">Signature Pending</Badge>
                              )}
                              {doc.status === "draft_review" && (
                                <Badge variant="draft-review">Draft Review</Badge>
                              )}
                              {doc.status === "awaiting_docs" && (
                                <Badge variant="awaiting-docs">Awaiting Docs</Badge>
                              )}
                              {doc.status !== "signature_pending" &&
                                doc.status !== "draft_review" &&
                                doc.status !== "awaiting_docs" && (
                                  <Badge variant="default">{doc.statusLabel}</Badge>
                                )}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                              {role !== "klien" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sendReminder(doc.seller.fullName, doc.refNumber);
                                  }}
                                  className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                                >
                                  Reminder
                                </button>
                              )}
                              
                              <Link href={`/files/${doc.id}`}>
                                <button
                                  className="px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-slate-200 bg-blue-50 dark:bg-[#122240] hover:bg-blue-100 dark:hover:bg-[#1a315c] border border-blue-200 dark:border-slate-700/80 rounded-lg transition-all cursor-pointer"
                                >
                                  Buka Akta
                                </button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Upgrade Plan Modal */}
      <Modal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Tingkatkan Kuota Dokumen Kantor"
        description="Pilih paket kapasitas dokumen sesuai volume akta bulanan kantor Anda."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-[#091122] border border-blue-200 dark:border-blue-500/40 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Paket Enterprise Notaris</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Kapasitas Unlimited Akta</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unlimited draft akta, 50GB storage brankas, multi-staf</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">Rp 990.000</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block">/ bulan</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setUpgradeModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="glow"
              onClick={() => {
                toast.success("Permintaan upgrade telah dikirim ke tim billing Nexus PPAT!");
                setUpgradeModalOpen(false);
              }}
            >
              Konfirmasi Upgrade
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
