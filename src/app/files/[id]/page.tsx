"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { FeatureGuide } from "@/components/ui/feature-guide";
import { MODULE_GUIDES } from "@/lib/guides";
import { useDocuments } from "@/contexts/document-context";
import { useAuth } from "@/contexts/auth-context";
import { formatCurrencyIDR } from "@/lib/cn";
import {
  ArrowLeft,
  XCircle,
  User,
  Users,
  Building,
  CheckCircle2,
  AlertCircle,
  Search,
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getDocumentById, updateChecklist, updateInternalNotes, rejectDocument } = useDocuments();
  const { role } = useAuth();

  const docId = params.id as string;
  const doc = getDocumentById(docId) || getDocumentById("doc-1");

  const [internalNotes, setInternalNotes] = useState(doc?.internalNotes || "");
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [zoomTitle, setZoomTitle] = useState<string>("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [kswpValidating, setKswpValidating] = useState(false);

  if (!doc) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400">Dokumen tidak ditemukan.</p>
          <Link href="/files" className="text-blue-600 dark:text-blue-400 mt-2 inline-block font-semibold">
            Kembali ke Daftar Berkas
          </Link>
        </div>
      </AppLayout>
    );
  }

  const verifiedChecklistCount = doc.checklist.filter((c) => c.status === "verified").length;

  const handleSaveNotes = () => {
    updateInternalNotes(doc.id, internalNotes);
  };

  const handleKswpValidation = () => {
    setKswpValidating(true);
    setTimeout(() => {
      setKswpValidating(false);
      updateChecklist(doc.id, "chk-3", "verified");
      toast.success("Validasi KSWP Ditjen Pajak Berhasil!", {
        description: "Status Wajib Pajak Penjual: VALID & Patuh Pajak.",
      });
    }, 1200);
  };

  const handleGenerateDraft = () => {
    if (role === "klien") {
      toast.info("Pratinjau naskah akta resmi dibuka dalam mode baca.");
    }
    setDraftModalOpen(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
    });
  };

  const handleConfirmReject = () => {
    if (!rejectReason) {
      toast.error("Mohon isi alasan penolakan");
      return;
    }
    rejectDocument(doc.id, rejectReason);
    setRejectModalOpen(false);
    router.push("/files");
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Module Guide */}
        <FeatureGuide guide={MODULE_GUIDES.filesDetail} />

        {/* TOP HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/90 dark:border-slate-800/80 pt-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/files"
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Berkas</span>
              </Link>
              <span className="text-[11px] font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/40 px-2.5 py-0.5 rounded-md font-bold">
                {doc.refNumber}
              </span>
              <span className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md font-medium">
                Verifikasi & Draft
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Verifikasi & Draft Akta Jual Beli
            </h1>
            <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Periksa keabsahan data para pihak, validasi KSWP, dan terbitkan naskah akta otentik resmi.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 self-start lg:self-auto">
            {role !== "klien" && (
              <Button
                variant="outline"
                onClick={() => setRejectModalOpen(true)}
                className="text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 px-4 py-2.5 text-xs font-semibold"
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                <span>Tolak Berkas</span>
              </Button>
            )}

            <Button
              variant="primary"
              onClick={handleGenerateDraft}
              className="px-5 py-2.5 text-xs font-semibold shadow-md shadow-blue-600/25"
            >
              <FileText className="w-4 h-4 mr-1.5" />
              <span>{role === "notaris" ? "Generate Draft Akta Resmi" : "Pratinjau Draft Akta"}</span>
            </Button>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Data Penjual, Data Pembeli, Objek Jual Beli */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. DATA PENJUAL (SELLER) CARD */}
            <Card className="p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>DATA PENJUAL (PIHAK PERTAMA)</span>
                </div>
                <Badge variant="verified-ai">Verified AI</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      NAMA LENGKAP (SESUAI KTP)
                    </label>
                    <div className="bg-slate-50 dark:bg-[#080e1c] border border-slate-200 dark:border-[#162747] px-4 py-3 rounded-xl flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {doc.seller.fullName}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      NIK
                    </label>
                    <div className="bg-slate-50 dark:bg-[#080e1c] border border-slate-200 dark:border-[#162747] px-4 py-3 rounded-xl">
                      <span className="text-sm font-mono text-slate-800 dark:text-slate-200 font-semibold">
                        {doc.seller.nik}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      ALAMAT
                    </label>
                    <div className="bg-slate-50 dark:bg-[#080e1c] border border-slate-200 dark:border-[#162747] px-4 py-3 rounded-xl">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {doc.seller.registeredAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* KTP Document Preview */}
                <div className="md:col-span-5 space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    DOKUMEN KTP
                  </label>
                  <div
                    onClick={() => {
                      setZoomImage(doc.seller.ktpUrl || "");
                      setZoomTitle(`KTP Penjual: ${doc.seller.fullName}`);
                    }}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#1b2f54] bg-slate-100 dark:bg-[#070e1c] aspect-[4/3] flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all shadow-inner"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.seller.ktpUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80"}
                      alt="KTP Penjual"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/80 border border-white/20 flex items-center justify-center text-slate-900 dark:text-white shadow-lg group-hover:scale-110 transition-transform">
                        <Search className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 2. DATA PEMBELI (BUYER) CARD */}
            <Card className="p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>DATA PEMBELI (PIHAK KEDUA)</span>
                </div>
                <Badge variant="pending-review">Review Manual</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      NAMA LENGKAP (SESUAI KTP)
                    </label>
                    <div className="bg-slate-50 dark:bg-[#080e1c] border border-amber-300 dark:border-amber-500/30 px-4 py-3 rounded-xl flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {doc.buyer.fullName}
                      </span>
                      <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      NIK
                    </label>
                    <div className="bg-slate-50 dark:bg-[#080e1c] border border-slate-200 dark:border-[#162747] px-4 py-3 rounded-xl">
                      <span className="text-sm font-mono text-slate-800 dark:text-slate-200 font-semibold">
                        {doc.buyer.nik}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      ALAMAT
                    </label>
                    <div className="bg-slate-50 dark:bg-[#080e1c] border border-slate-200 dark:border-[#162747] px-4 py-3 rounded-xl">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {doc.buyer.registeredAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* KTP Document Preview */}
                <div className="md:col-span-5 space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    DOKUMEN KTP
                  </label>
                  <div
                    onClick={() => {
                      setZoomImage(doc.buyer.ktpUrl || "");
                      setZoomTitle(`KTP Pembeli: ${doc.buyer.fullName}`);
                    }}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#1b2f54] bg-slate-100 dark:bg-[#070e1c] aspect-[4/3] flex items-center justify-center cursor-pointer hover:border-amber-500 transition-all shadow-inner"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.buyer.ktpUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80"}
                      alt="KTP Pembeli"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/80 border border-white/20 flex items-center justify-center text-slate-900 dark:text-white shadow-lg group-hover:scale-110 transition-transform">
                        <Search className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 3. OBJEK JUAL BELI (PROPERTI) CARD */}
            <Card className="p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
                <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>OBJEK JUAL BELI (PROPERTI)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-[#182746] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 pb-3">ATRIBUT</th>
                      <th className="py-2.5 pb-3">NILAI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#152442] text-xs">
                    <tr>
                      <td className="py-3 text-slate-500 dark:text-slate-400 font-medium">Jenis Hak</td>
                      <td className="py-3 text-slate-900 dark:text-slate-200 font-bold">{doc.property.certificateNumber}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500 dark:text-slate-400 font-medium">Luas Tanah</td>
                      <td className="py-3 text-slate-900 dark:text-slate-200 font-semibold">{doc.property.landArea} M²</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500 dark:text-slate-400 font-medium">Letak Tanah</td>
                      <td className="py-3 text-slate-900 dark:text-slate-200 font-semibold">{doc.property.location}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-500 dark:text-slate-400 font-medium">Harga Transaksi</td>
                      <td className="py-3 text-blue-600 dark:text-blue-400 font-bold text-sm">
                        {formatCurrencyIDR(doc.property.transactionPrice)},-
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Status Alur Kerja, Ceklis Dokumen, Catatan Internal */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. STATUS ALUR KERJA */}
            <Card className="p-6 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
                STATUS ALUR KERJA
              </h3>

              <div className="space-y-6 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                {/* Step 1: Pengumpulan Data */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white ring-4 ring-white dark:ring-[#0b1322]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200">Pengumpulan Data</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Selesai via Portal Klien (12 Okt)</p>
                </div>

                {/* Step 2: Verifikasi & Draft */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-[#0b1322] flex items-center justify-center ring-4 ring-white dark:ring-[#0b1322]">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Verifikasi & Draft</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    Sedang berlangsung (Review manual Pembeli)
                  </p>
                </div>

                {/* Step 3: Penandatanganan */}
                <div className="relative opacity-60">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] ring-4 ring-white dark:ring-[#0b1322]" />
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400">Penandatanganan</h4>
                </div>

                {/* Step 4: Penyelesaian (BPN) */}
                <div className="relative opacity-60">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1322] ring-4 ring-white dark:ring-[#0b1322]" />
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400">Penyelesaian (BPN)</h4>
                </div>
              </div>
            </Card>

            {/* 2. CEKLIS DOKUMEN */}
            <Card className="p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  CEKLIS DOKUMEN
                </h3>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  {verifiedChecklistCount}/4 Terverifikasi
                </span>
              </div>

              <div className="space-y-3">
                {/* Item 1: Sertifikat Asli */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080e1c] border border-slate-200 dark:border-blue-500/20 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200">Sertifikat Asli (SHM)</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Diserahkan & diverifikasi fisik
                    </p>
                  </div>
                </div>

                {/* Item 2: PBB Tahun Terakhir */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080e1c] border border-slate-200 dark:border-blue-500/20 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200">PBB Tahun Terakhir</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Lunas (2026)</p>
                  </div>
                </div>

                {/* Item 3: NPWP Penjual */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080e1c] border border-blue-200 dark:border-blue-500/40 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200">NPWP Penjual</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Validasi KSWP Ditjen Pajak</p>
                    <button
                      onClick={handleKswpValidation}
                      disabled={kswpValidating}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1.5 flex items-center gap-1 cursor-pointer"
                    >
                      {kswpValidating ? (
                        <span>Memvalidasi ke Ditjen Pajak...</span>
                      ) : (
                        <span>Validasi Sekarang →</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Item 4: Bukti Pembayaran SSP/SSPD */}
                <div className="p-3 rounded-xl bg-red-50/60 dark:bg-[#080e1c] border border-red-200 dark:border-red-500/30 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200">
                      Bukti Pembayaran SSP/SSPD
                    </h5>
                    <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">Belum diunggah</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 3. CATATAN INTERNAL */}
            <Card className="p-6 rounded-2xl shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                CATATAN INTERNAL KANTOR
              </h3>

              <div className="space-y-3">
                <Textarea
                  placeholder="Tambahkan catatan untuk asisten atau draft..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={4}
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors cursor-pointer"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* 1. Zoom Document Modal */}
      <Modal
        isOpen={!!zoomImage}
        onClose={() => setZoomImage(null)}
        title={zoomTitle}
        description="Pemeriksaan dokumen identitas resolusi tinggi"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 max-h-[70vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {zoomImage && (
              <img
                src={zoomImage}
                alt="Document Zoom"
                className="max-h-[65vh] w-auto object-contain"
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setZoomImage(null)}>
              Tutup Preview
            </Button>
          </div>
        </div>
      </Modal>

      {/* 2. Reject Submission Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Tolak Pengajuan Dokumen"
        description="Berikan keterangan alasan penolakan agar pemohon dapat melengkapi perbaikan."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <Textarea
            label="ALASAN PENOLAKAN"
            placeholder="Contoh: KTP Pembeli buram, mohon upload ulang foto asli tanpa pantulan cahaya."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleConfirmReject}>
              Konfirmasi Tolak
            </Button>
          </div>
        </div>
      </Modal>

      {/* 3. Draft Akta Official Preview Modal */}
      <Modal
        isOpen={draftModalOpen}
        onClose={() => setDraftModalOpen(false)}
        title={`Naskah Draft Resmi: ${doc.title}`}
        description={`Nomor Registrasi: ${doc.refNumber} | PPAT: Dr. Hendrawan Kartasasmita, S.H., M.Kn.`}
        maxWidth="4xl"
      >
        <div className="space-y-6">
          {/* Simulated Official Legal Document View */}
          <div className="bg-white text-slate-900 p-8 md:p-12 rounded-xl shadow-md font-serif text-xs md:text-sm leading-relaxed border border-slate-300 max-h-[60vh] overflow-y-auto space-y-6 select-text">
            {/* Garuda Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <h2 className="text-base md:text-lg font-bold tracking-widest uppercase">
                AKTA JUAL BELI
              </h2>
              <p className="font-sans font-bold text-xs tracking-wider">
                Nomor: {doc.refNumber}/PPAT/2026
              </p>
              <p className="font-sans text-[11px] text-slate-700">
                Lembar Pertama / Salinan Resmi
              </p>
            </div>

            <p className="text-justify indent-8">
              Pada hari ini, <strong>Senin</strong>, tanggal{" "}
              <strong>24 Agustus 2026</strong> (dua puluh empat bulan Agustus tahun dua ribu dua
              puluh enam), hadir di hadapan saya,{" "}
              <strong>Dr. Hendrawan Kartasasmita, Sarjana Hukum, Magister Kenotariatan</strong>,
              Pejabat Pembuat Akta Tanah (PPAT) yang berkantor di Jakarta Selatan, dengan dihadiri
              saksi-saksi yang saya kenal dan akan disebutkan pada akhir akta ini:
            </p>

            <div className="space-y-3 pl-4 border-l-2 border-slate-400">
              <p>
                <strong>I. Pihak Penjual:</strong> <br />
                Nama: <strong>{doc.seller.fullName}</strong>, NIK: {doc.seller.nik}, bertempat
                tinggal di {doc.seller.registeredAddress}. Selanjutnya disebut sebagai{" "}
                <strong>PIHAK PERTAMA (PENJUAL)</strong>.
              </p>

              <p>
                <strong>II. Pihak Pembeli:</strong> <br />
                Nama: <strong>{doc.buyer.fullName}</strong>, NIK: {doc.buyer.nik}, bertempat
                tinggal di {doc.buyer.registeredAddress}. Selanjutnya disebut sebagai{" "}
                <strong>PIHAK KEDUA (PEMBELI)</strong>.
              </p>
            </div>

            <p className="text-justify indent-8">
              Para pihak menerangkan bahwa PIHAK PERTAMA dengan ini menjual kepada PIHAK KEDUA dan
              PIHAK KEDUA dengan ini membeli dari PIHAK PERTAMA hak atas tanah sebagaimana
              diuraikan di bawah ini:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg font-sans text-xs space-y-1 border border-slate-200">
              <p>• Sertifikat: <strong>{doc.property.certificateNumber}</strong></p>
              <p>• Luas Tanah: <strong>{doc.property.landArea} M²</strong></p>
              <p>• Lokasi: <strong>{doc.property.location}</strong></p>
              <p>• Nilai Transaksi: <strong>{formatCurrencyIDR(doc.property.transactionPrice)}</strong></p>
            </div>

            <p className="text-justify indent-8">
              Demikian akta ini dibuat dan ditandatangani di Jakarta Selatan oleh para pihak,
              saksi-saksi, dan saya PPAT.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-8 text-center font-sans text-xs">
              <div>
                <p className="text-slate-600">Pihak Pertama (Penjual)</p>
                <div className="h-16 flex items-center justify-center font-cursive text-slate-700 italic">
                  ( {doc.seller.fullName} )
                </div>
              </div>
              <div>
                <p className="text-slate-600">Pihak Kedua (Pembeli)</p>
                <div className="h-16 flex items-center justify-center font-cursive text-slate-700 italic">
                  ( {doc.buyer.fullName} )
                </div>
              </div>
              <div>
                <p className="text-slate-600">Pejabat PPAT</p>
                <div className="h-16 flex items-center justify-center font-bold text-blue-950">
                  ( Dr. Hendrawan, S.H. )
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Naskah tervalidasi BSrE & siap diekspor ke PDF</span>
            </span>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="w-4 h-4 mr-1.5" />
                <span>Cetak Akta</span>
              </Button>

              <Button
                variant="glow"
                onClick={() => {
                  toast.success("File PDF Akta Jual Beli berhasil diunduh!");
                  setDraftModalOpen(false);
                }}
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Unduh Salinan PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
