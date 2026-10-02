"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FeatureGuide } from "@/components/ui/feature-guide";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonPage } from "@/components/ui/loading-skeleton";
import { MODULE_GUIDES } from "@/lib/guides";
import { useDocuments } from "@/contexts/document-context";
import {
  ShieldCheck,
  Search,
  FileText,
  CreditCard,
  Sparkles,
  Lock,
  Download,
  Database,
} from "lucide-react";
import { toast } from "sonner";

export default function ActivitiesPage() {
  const { activities, isLoading, error, loadDemoData } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredActivities = activities.filter(
    (a) =>
      a.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.targetRef.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Module Guide */}
        <FeatureGuide guide={MODULE_GUIDES.activities} />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Audit Log & Jejak Aktivitas
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Catatan lengkap riwayat verifikasi, perubahan berkas, dan transaksi kantor notaris untuk kepatuhan regulasi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activities.length === 0 && (
              <Button variant="outline" onClick={loadDemoData} className="border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400">
                <Database className="w-4 h-4 mr-1" />
                <span>Muat Data Contoh</span>
              </Button>
            )}
            <Button
              variant="glow"
              onClick={() => {
                if (activities.length === 0) {
                  toast.error("Tidak ada log aktivitas untuk diekspor");
                  return;
                }
                const csvContent = "data:text/csv;charset=utf-8," 
                  + "Tanggal,Waktu,Aktor,Role,Aktivitas,Target Ref\n"
                  + activities.map(a => `"${a.timestamp.split(' - ')[0]}","${a.timestamp.split(' - ')[1]}","${a.actorName}","${a.actorRole}","${a.action}","${a.targetRef}"`).join("\n");
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `Audit_Log_Notaris_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();

                toast.success("Log audit hukum berhasil diunduh (Format .CSV)");
              }}
            >
              <Download className="w-4 h-4 mr-1.5" />
              <span>Ekspor Audit Trail</span>
            </Button>
          </div>
        </div>

        {activities.length === 0 ? (
          <Card className="mt-8">
            <EmptyState
              icon="help"
              title="Audit Log Kosong"
              description="Belum ada aktivitas apapun yang terekam dalam sistem. Aktivitas seperti pembuatan akta, pembayaran, atau verifikasi akan dicatat otomatis di sini."
            />
          </Card>
        ) : (
          <>
            {/* Search Bar */}
            <Card className="p-4 shadow-sm">
              <Input
                placeholder="Cari jejak aktivitas berdasarkan nama petugas, nomor akta, atau aksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </Card>

            {/* Timeline Log List */}
            {filteredActivities.length > 0 ? (
              <Card className="p-6 shadow-sm">
                <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                  {filteredActivities.map((act) => (
                    <div key={act.id} className="relative group">
                      {/* Bullet */}
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white dark:bg-[#0d1728] border-2 border-blue-600 dark:border-blue-500 flex items-center justify-center ring-4 ring-slate-50 dark:ring-[#0b1322] text-blue-600 dark:text-blue-400">
                        {act.type === "verify" ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : act.type === "payment" ? (
                          <CreditCard className="w-3 h-3" />
                        ) : act.type === "system" ? (
                          <Sparkles className="w-3 h-3" />
                        ) : (
                          <FileText className="w-3 h-3" />
                        )}
                      </div>

                      <div className="bg-slate-50 dark:bg-[#080e1c] p-4 rounded-xl border border-slate-200/90 dark:border-slate-800/80 hover:border-blue-500/40 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs text-slate-900 dark:text-slate-100">{act.actorName}</strong>
                            <span className="text-[10px] bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-mono">
                              {act.actorRole}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-500 dark:text-slate-500 font-mono">{act.timestamp}</span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">{act.action}</p>

                        <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 dark:text-slate-400 font-mono">
                            Ref Dokumen: <strong className="text-blue-600 dark:text-blue-400">{act.targetRef}</strong> ({act.targetTitle})
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Integritas Terverifikasi
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="py-12">
                <EmptyState
                  title="Tidak Ditemukan"
                  description="Tidak ada log aktivitas yang cocok dengan pencarian Anda."
                  icon="help"
                />
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
