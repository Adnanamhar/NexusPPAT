"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeatureGuide } from "@/components/ui/feature-guide";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonPage } from "@/components/ui/loading-skeleton";
import { MODULE_GUIDES } from "@/lib/guides";
import { useDocuments } from "@/contexts/document-context";
import { formatCurrencyIDR } from "@/lib/cn";
import {
  Plus,
  Search,
  ArrowRight,
  Database,
} from "lucide-react";

export default function FilesPage() {
  const { documents, isLoading, error, loadDemoData } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

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

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.seller.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.buyer.fullName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all"
        ? true
        : selectedStatus === "draft"
        ? doc.status === "draft" || doc.status === "draft_review" || doc.status === "verifying"
        : selectedStatus === "signing"
        ? doc.status === "signature_pending"
        : selectedStatus === "completed"
        ? doc.status === "completed"
        : true;

    const matchesType = selectedType === "all" ? true : doc.docType === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Module Guide */}
        <FeatureGuide guide={MODULE_GUIDES.files} />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manajemen Berkas & Akta Notaris
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Daftar seluruh berkas perkara, akta jual beli, legalitas PT, dan perjanjian fidusia/kredit.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {documents.length === 0 && (
              <Button variant="outline" onClick={loadDemoData} className="border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400">
                <Database className="w-4 h-4 mr-1" />
                <span>Muat Data Contoh</span>
              </Button>
            )}
            <Link href="/files/new">
              <Button variant="glow" className="shadow-blue-500/25">
                <Plus className="w-4 h-4 mr-1" />
                <span>+ Pengajuan Akta Baru</span>
              </Button>
            </Link>
          </div>
        </div>

        {documents.length === 0 ? (
          <Card className="mt-8">
            <EmptyState
              icon="file"
              title="Belum Ada Berkas Tersimpan"
              description="Anda belum memiliki daftar akta atau dokumen apapun di sistem. Mulai dengan membuat pengajuan baru."
              actionLabel="Buat Akta Baru"
              actionHref="/files/new"
            />
          </Card>
        ) : (
          <>
            {/* Filters & Search Row */}
            <Card className="p-4 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Cari nomor ref, nama pihak penjual/pembeli..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>

                {/* Filter Tabs & Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Type Filter */}
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-white dark:bg-[#091122] border border-slate-300 dark:border-[#1b2b4d] text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                  >
                    <option value="all">Semua Jenis Layanan</option>
                    <option value="akta_jual_beli">Akta Jual Beli (AJB)</option>
                    <option value="akta_pendirian_pt">Akta Pendirian PT</option>
                    <option value="perjanjian_kredit">Perjanjian Kredit & APHT</option>
                  </select>

                  {/* Status Filter Buttons */}
                  <div className="flex items-center bg-slate-100 dark:bg-[#080e1c] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    {[
                      { id: "all", label: "Semua" },
                      { id: "draft", label: "Verifikasi / Draft" },
                      { id: "signing", label: "Tanda Tangan" },
                      { id: "completed", label: "Selesai" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setSelectedStatus(st.id)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                          selectedStatus === st.id
                            ? "bg-blue-600 text-white font-bold shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Document List Table */}
            <Card className="overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-[#182746] bg-slate-50/70 dark:bg-[#080f1e] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">NOMOR REF & JUDUL AKTA</th>
                      <th className="py-4 px-6">PARA PIHAK (PENJUAL & PEMBELI)</th>
                      <th className="py-4 px-6">OBJEK & NILAI TRANSAKSI</th>
                      <th className="py-4 px-6">STATUS BERKAS</th>
                      <th className="py-4 px-6">JATUH TEMPO</th>
                      <th className="py-4 px-6 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#152442] text-xs font-medium">
                    {filteredDocs.length > 0 ? (
                      filteredDocs.map((doc) => (
                        <tr
                          key={doc.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-[#0f1e3b]/70 transition-colors group cursor-pointer"
                        >
                          {/* Ref & Title */}
                          <td className="py-4 px-6">
                            <Link href={`/files/${doc.id}`} className="block">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 px-2 py-0.5 rounded">
                                  {doc.refNumber}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                                  {doc.docTypeLabel}
                                </span>
                              </div>
                              <p className="font-bold text-slate-900 dark:text-slate-100 mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {doc.title}
                              </p>
                            </Link>
                          </td>

                          {/* Parties */}
                          <td className="py-4 px-6 text-slate-700 dark:text-slate-300 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-400">P:</span>
                              <span className="font-semibold text-slate-900 dark:text-slate-200">
                                {doc.seller.fullName || "-"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-400">B:</span>
                              <span className="font-semibold text-slate-900 dark:text-slate-200">
                                {doc.buyer.fullName || "-"}
                              </span>
                            </div>
                          </td>

                          {/* Property & Value */}
                          <td className="py-4 px-6">
                            <span className="text-slate-700 dark:text-slate-300 block truncate max-w-xs">
                              {doc.property.certificateType} ({doc.property.landArea} M²)
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                              {formatCurrencyIDR(doc.property.transactionPrice || 0)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6 whitespace-nowrap">
                            {doc.status === "signature_pending" ? (
                              <Badge variant="signature-pending">Signature Pending</Badge>
                            ) : doc.status === "draft_review" ? (
                              <Badge variant="draft-review">Draft Review</Badge>
                            ) : doc.status === "awaiting_docs" ? (
                              <Badge variant="awaiting-docs">Awaiting Docs</Badge>
                            ) : (
                              <Badge variant="success">{doc.statusLabel}</Badge>
                            )}
                          </td>

                          {/* Due Date */}
                          <td className="py-4 px-6 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {doc.dueDate}
                          </td>

                          {/* Action */}
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <Link href={`/files/${doc.id}`}>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="text-blue-600 dark:text-blue-400"
                              >
                                <span>Buka Berkas</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12">
                          <EmptyState 
                            title="Tidak Ditemukan"
                            description="Tidak ada berkas yang cocok dengan filter atau kata kunci pencarian Anda."
                            icon="file"
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
