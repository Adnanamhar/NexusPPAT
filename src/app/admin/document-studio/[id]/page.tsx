"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useClientData } from "@/contexts/client-data-context";
import { generateOfficialLegalText } from "@/lib/service-templates";
import {
  ArrowLeft,
  Printer,
  FileText,
  Copy,
  Download,
  Edit3,
  Eye,
  AlertTriangle,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDocumentStudioPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = (params.id as string) || "req-101";

  const { getServiceRequestById, updateServiceRequest } = useClientData();
  const request = getServiceRequestById(requestId);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [previewTab, setPreviewTab] = useState<"document" | "json">("document");

  useEffect(() => {
    if (request) {
      setFormData(request.formData || {});
    }
  }, [request]);

  if (!request) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pengajuan Tidak Ditemukan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ID Pengajuan ({requestId}) tidak terdaftar dalam database studio notaris.
          </p>
          <Button variant="outline" onClick={() => router.push("/layanan")}>
            Kembali ke Daftar Layanan
          </Button>
        </div>
      </AppLayout>
    );
  }

  const generatedLegalText = generateOfficialLegalText(
    request.serviceCode,
    request.refNumber,
    formData
  );

  // Helper to generate smart clean filename: [Urusan]_[NamaKlien].docx
  const generateSmartFilename = (ext: string) => {
    const serviceSlug = (request.serviceTitle || "Akta")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 16);
    const clientSlug = (request.clientName || "Klien")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 16);
    return `${serviceSlug}_${clientSlug}.${ext}`;
  };

  const handleFieldChange = (key: string, value: any) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    updateServiceRequest(request.id, { formData: updated });
  };

  const handlePrintPdf = () => {
    window.print();
    toast.success("Membuka dialog cetak / simpan sebagai PDF.");
  };

  // Universal Microsoft Word .docx Exporter
  const handleDownloadDocx = () => {
    const fileName = generateSmartFilename("docx");
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Naskah Akta Notaris</title></head><body>`;
    const footer = "</body></html>";
    const htmlContent =
      header +
      "<pre style='font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5; white-space: pre-wrap;'>" +
      generatedLegalText +
      "</pre>" +
      footer;

    const blob = new Blob(["\ufeff", htmlContent], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Naskah Word (${fileName}) berhasil diunduh!`);
  };

  const handleDownloadTxt = () => {
    const fileName = generateSmartFilename("txt");
    const blob = new Blob([generatedLegalText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Naskah Teks (${fileName}) berhasil diunduh!`);
  };

  const handleDownloadJson = () => {
    const fileName = generateSmartFilename("json");
    const payload = JSON.stringify(
      {
        refNumber: request.refNumber,
        serviceTitle: request.serviceTitle,
        clientName: request.clientName,
        formData: formData,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Data JSON (${fileName}) berhasil diunduh!`);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedLegalText);
    toast.success("Naskah akta berhasil disalin ke clipboard!");
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Top Header Controls & Single Clean Export Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/layanan")}
              className="p-2.5 rounded-xl bg-white dark:bg-[#0c152a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Kembali ke Layanan"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 px-2 py-0.5 rounded">
                  {request.refNumber}
                </span>
                <Badge variant="primary">{request.serviceTitle}</Badge>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
                Admin Document Studio Notaris
              </h1>
            </div>
          </div>

          {/* SINGLE UNIFIED EXPORT BAR */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyText}
              title="Salin Teks Naskah"
            >
              <Copy className="w-3.5 h-3.5 mr-1" />
              <span>Salin Teks</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadDocx}
              className="text-blue-600 dark:text-blue-400 font-bold"
              title="Download File Word .docx"
            >
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>Export .DOCX (Word)</span>
            </Button>

            <Button
              variant="glow"
              size="sm"
              onClick={handlePrintPdf}
              className="shadow-blue-500/30 font-bold"
              title="Cetak atau Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              <span>Cetak / Export PDF</span>
            </Button>
          </div>
        </div>

        {/* Studio Grid Layout: Left Editor, Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL: Interactive Form Field Editor for Missing Data (no-print) */}
          <Card className="lg:col-span-5 p-6 space-y-6 no-print shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#172748]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Editor Data & Kelengkapan Notaris
                </h3>
              </div>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                Real-Time Sync
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Ubah atau tambahkan informasi yang belum lengkap dari masukan klien di bawah ini. Naskah di sebelah kanan akan diperbarui secara instan.
            </p>

            {/* Dynamic Form Editor Inputs */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {Object.keys(formData).map((key) => {
                const labelText = key
                  .replace(/([A-Z])/g, " $1")
                  .toUpperCase()
                  .trim();

                return (
                  <div key={key} className="space-y-1">
                    <Input
                      label={labelText}
                      value={formData[key] || ""}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                    />
                  </div>
                );
              })}

              {/* Add Custom New Field for Admin */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newKey = prompt("Masukkan nama field baru (contoh: saksi2Name, skNumber, dll):");
                    if (newKey && newKey.trim()) {
                      handleFieldChange(newKey.trim(), "");
                    }
                  }}
                  className="w-full border-dashed border-slate-300 dark:border-slate-700 text-blue-600 dark:text-blue-400"
                >
                  + Tambah Kolom Data Baru
                </Button>
              </div>
            </div>
          </Card>

          {/* RIGHT PANEL: Real-time Official Legal Document Preview */}
          <Card className="lg:col-span-7 p-6 md:p-8 space-y-4 shadow-2xl relative overflow-hidden bg-white dark:bg-[#0c152a]">
            {/* Header Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#172748] no-print">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Preview Naskah Resmi Notaris / PPAT
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 dark:bg-[#070e1c] p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setPreviewTab("document")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      previewTab === "document"
                        ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Naskah Resmi
                  </button>
                  <button
                    onClick={() => setPreviewTab("json")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      previewTab === "json"
                        ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    JSON Data
                  </button>
                </div>
              </div>
            </div>

            {/* Document Preview Sheet (Printable Area) */}
            {previewTab === "document" ? (
              <div className="p-8 border border-slate-200 dark:border-slate-800 rounded-2xl bg-amber-50/20 dark:bg-[#070d1a] font-mono text-xs text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed shadow-inner overflow-x-auto min-h-[500px]">
                {generatedLegalText}
              </div>
            ) : (
              <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto min-h-[500px]">
                {JSON.stringify(
                  {
                    refNumber: request.refNumber,
                    serviceCode: request.serviceCode,
                    serviceTitle: request.serviceTitle,
                    clientName: request.clientName,
                    formData: formData,
                  },
                  null,
                  2
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
