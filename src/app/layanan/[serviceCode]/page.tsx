"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NOTARY_SERVICES, autoFillServiceForm } from "@/lib/service-templates";
import { useClientData } from "@/contexts/client-data-context";
import { ServiceCode } from "@/types";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Building,
  User,
  Users,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export default function ServiceRequestFormPage() {
  const params = useParams();
  const router = useRouter();
  const serviceCode = (params.serviceCode as ServiceCode) || "akta_jual_beli";

  const { clientData, createServiceRequest } = useClientData();

  const serviceInfo = NOTARY_SERVICES.find((s) => s.code === serviceCode) || NOTARY_SERVICES[0];
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Auto-fill from persistent client profile data
    const filled = autoFillServiceForm(serviceCode, clientData);
    setFormData(filled);
    setIsAutoFilled(Object.keys(filled).length > 0);
  }, [serviceCode, clientData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createServiceRequest(
        serviceInfo.code,
        serviceInfo.title,
        serviceInfo.category,
        formData
      );

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      router.push("/layanan");
    } catch (err) {
      toast.error("Gagal mengirim pengajuan layanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Top Navigation Back */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Layanan</span>
          </button>
        </div>

        {/* Header Card */}
        <Card className="p-6 md:p-8 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {serviceInfo.categoryLabel} • Est: {serviceInfo.estimatedDays}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {serviceInfo.title}
            </h1>
            <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
              {serviceInfo.description}
            </p>
          </div>
        </Card>

        {/* Auto-Fill Banner Alert */}
        {isAutoFilled && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                <strong>Data Otomatis Terisi!</strong> Informasi identitas Anda (Nama, NIK, Alamat, NPWP) telah ter-autofill otomatis dari data persisten akun Anda.
              </span>
            </div>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 font-bold px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-200 shrink-0">
              Auto-Fill Active
            </span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6 md:p-8 space-y-8 shadow-xl">
            {/* Section 1: Data Pemohon / Pihak Pertama */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest pb-2 border-b border-slate-200 dark:border-slate-800">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>DATA IDENTITAS UTAMA (PEMOHON / PIHAK PERTAMA)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="NAMA LENGKAP (SESUAI KTP)"
                  value={formData.fullName || formData.sellerName || formData.grantorName || formData.husbandName || formData.founder1Name || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("fullName", val);
                    handleChange("sellerName", val);
                    handleChange("grantorName", val);
                    handleChange("husbandName", val);
                    handleChange("founder1Name", val);
                  }}
                  minLength={3}
                  maxLength={50}
                  required
                />
                <Input
                  label="NOMOR INDUK KEPENDUDUKAN (NIK)"
                  value={formData.nik || formData.sellerNik || formData.grantorNik || formData.husbandNik || formData.founder1Nik || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleChange("nik", val);
                    handleChange("sellerNik", val);
                    handleChange("grantorNik", val);
                    handleChange("husbandNik", val);
                    handleChange("founder1Nik", val);
                  }}
                  maxLength={16}
                  minLength={16}
                  pattern="[0-9]*"
                  title="NIK harus berupa 16 digit angka"
                  required
                />
              </div>

              <Textarea
                label="ALAMAT DOMISILI KTP LENGKAP"
                value={formData.address || formData.sellerAddress || formData.grantorAddress || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange("address", val);
                  handleChange("sellerAddress", val);
                  handleChange("grantorAddress", val);
                }}
                rows={2}
                minLength={10}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="NOMOR WHATSAPP / TELEPON"
                  value={formData.phone || formData.sellerPhone || ""}
                  onChange={(e) => {
                    handleChange("phone", e.target.value);
                    handleChange("sellerPhone", e.target.value);
                  }}
                  maxLength={20}
                  minLength={10}
                  pattern="^[0-9\-\+\s]+$"
                  title="Nomor telepon harus berupa angka (dapat mengandung +, -, atau spasi)"
                  required
                />
                <Input
                  label="NOMOR NPWP PRIBADI"
                  value={formData.npwp || formData.sellerNpwp || ""}
                  onChange={(e) => {
                    handleChange("npwp", e.target.value);
                    handleChange("sellerNpwp", e.target.value);
                  }}
                  maxLength={16}
                  minLength={15}
                  pattern="[0-9.-]*"
                />
              </div>
            </div>

            {/* Section 2: Specific Fields based on Service Type */}
            {serviceCode === "akta_jual_beli" && (
              <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest pb-2 border-b border-slate-200 dark:border-slate-800">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>DATA PIHAK KEDUA (PEMBELI) & SERTIFIKAT OBJEK</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="NAMA LENGKAP PEMBELI"
                    value={formData.buyerName || ""}
                    onChange={(e) => handleChange("buyerName", e.target.value)}
                    minLength={3}
                    maxLength={50}
                    required
                  />
                  <Input
                    label="NIK PEMBELI (16 DIGIT)"
                    value={formData.buyerNik || ""}
                    onChange={(e) => handleChange("buyerNik", e.target.value)}
                    maxLength={16}
                    minLength={16}
                    pattern="[0-9]*"
                    title="NIK harus berupa 16 digit angka"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Input
                    label="JENIS HAK TANAH"
                    value={formData.certificateType || "Hak Milik (SHM)"}
                    onChange={(e) => handleChange("certificateType", e.target.value)}
                  />
                  <Input
                    label="NOMOR SERTIFIKAT TANAH"
                    value={formData.certificateNumber || ""}
                    onChange={(e) => handleChange("certificateNumber", e.target.value)}
                    required
                  />
                  <Input
                    label="LUAS TANAH (M²)"
                    type="number"
                    min="1"
                    value={formData.landArea || ""}
                    onChange={(e) => handleChange("landArea", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="NILAI TRANSAKSI KESEPAKATAN (RP)"
                    type="text"
                    value={
                      formData.transactionPrice 
                        ? formData.transactionPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") 
                        : ""
                    }
                    onChange={(e) => handleChange("transactionPrice", e.target.value.replace(/\D/g, ""))}
                    required
                  />
                  <Input
                    label="METODE PENAMPUNGAN / PEMBAYARAN"
                    value={formData.paymentMethod || "Escrow / Rekening Penampung Notaris"}
                    onChange={(e) => handleChange("paymentMethod", e.target.value)}
                  />
                </div>
              </div>
            )}

            {serviceCode === "pendirian_badan_usaha" && (
              <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest pb-2 border-b border-slate-200 dark:border-slate-800">
                  <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>RINCIAN PENDIRIAN PERSEROAN (PT / CV)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="USULAN NAMA NAMA PT / CV"
                    placeholder="e.g. PT Prima Solusi Nusantara"
                    value={formData.companyNameProposed || ""}
                    onChange={(e) => handleChange("companyNameProposed", e.target.value)}
                    required
                  />
                  <Input
                    label="BIDANG USULAN KBLI / SEKTOR USAHA"
                    placeholder="e.g. Jasa Teknologi Informasi & Perdagangan"
                    value={formData.businessSector || ""}
                    onChange={(e) => handleChange("businessSector", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="MODAL DASAR PERSEROAN (RP)"
                    type="text"
                    placeholder="1.000.000.000"
                    value={
                      formData.authorizedCapital 
                        ? formData.authorizedCapital.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") 
                        : ""
                    }
                    onChange={(e) => handleChange("authorizedCapital", e.target.value.replace(/\D/g, ""))}
                    required
                  />
                  <Input
                    label="MODAL DISETOR / DISETOR AWAL (RP)"
                    type="text"
                    placeholder="250.000.000"
                    value={
                      formData.paidUpCapital 
                        ? formData.paidUpCapital.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") 
                        : ""
                    }
                    onChange={(e) => handleChange("paidUpCapital", e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Batal
              </Button>

              <Button
                type="submit"
                variant="glow"
                isLoading={isSubmitting}
                className="px-8 font-bold shadow-blue-500/30"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                <span>Kirim & Simpan Pengajuan</span>
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
