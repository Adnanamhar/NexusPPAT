"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Stepper, StepItem } from "@/components/ui/stepper";
import { FileUpload } from "@/components/ui/file-upload";
import { FeatureGuide } from "@/components/ui/feature-guide";
import { MODULE_GUIDES } from "@/lib/guides";
import { useDocuments } from "@/contexts/document-context";
import { formatCurrencyIDR } from "@/lib/cn";
import {
  User,
  Users,
  Building,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function NewDocumentPage() {
  const router = useRouter();
  const { createDocument } = useDocuments();

  const [currentStep, setCurrentStep] = useState(1);
  const [refNumber] = useState("JBT-2026-09A");

  // Step 1: Penjual & Pembeli State
  const [sellerName, setSellerName] = useState("Budi Santoso");
  const [sellerNik, setSellerNik] = useState("3171234567890001");
  const [sellerAddress, setSellerAddress] = useState(
    "Jl. Sudirman No. 45, RT 001/RW 002, Kelurahan Senayan, Kebayoran Baru, Jakarta Selatan."
  );
  const [sellerKtpUrl, setSellerKtpUrl] = useState<string | undefined>(
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80"
  );
  const [sellerKtpName, setSellerKtpName] = useState<string | undefined>("KTP_Budi_Santoso.jpg");

  const [buyerName, setBuyerName] = useState("Siti Aminah");
  const [buyerNik, setBuyerNik] = useState("3201987654320002");
  const [buyerAddress, setBuyerAddress] = useState(
    "Jl. Merdeka Raya Kav. 12, Bandung, Jawa Barat."
  );
  const [buyerKtpUrl, setBuyerKtpUrl] = useState<string | undefined>(
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80"
  );
  const [buyerKtpName, setBuyerKtpName] = useState<string | undefined>("KTP_Siti_Aminah.jpg");

  // Step 2: Objek Properti State
  const [certificateType, setCertificateType] = useState<"Hak Milik (SHM)" | "Hak Guna Bangunan (HGB)">("Hak Milik (SHM)");
  const [certificateNumber, setCertificateNumber] = useState("Hak Milik (SHM) No. 12345");
  const [landArea, setLandArea] = useState("250");
  const [buildingArea, setBuildingArea] = useState("180");
  const [location, setLocation] = useState("Kecamatan Kebayoran Baru, Jakarta Selatan");
  const [city, setCity] = useState("Jakarta Selatan");
  const [province, setProvince] = useState("DKI Jakarta");
  const [transactionPrice, setTransactionPrice] = useState("5500000000");
  const [njopPrice, setNjopPrice] = useState("4200000000");

  // Step 3: Kesepakatan State
  const [agreementDate, setAgreementDate] = useState("2026-08-24");
  const [paymentMethod, setPaymentMethod] = useState("Escrow / Rekening Penampung Notaris");
  const [bankName, setBankName] = useState("BCA Kantor Cabang Sudirman");
  const [downPayment, setDownPayment] = useState("1000000000");
  const [witness1, setWitness1] = useState("Bambang Pamungkas, S.H.");
  const [witness2, setWitness2] = useState("Dedi Setiawan");
  const [specialClauses, setSpecialClauses] = useState(
    "Pengosongan rumah selambat-lambatnya 14 hari kerja setelah penandatanganan Akta Jual Beli resmi di hadapan Notaris/PPAT."
  );

  const steps: StepItem[] = [
    { id: 1, number: "01", label: "Penjual & Pembeli" },
    { id: 2, number: "02", label: "Objek Properti" },
    { id: 3, number: "03", label: "Kesepakatan" },
  ];

  const handleSaveDraft = () => {
    toast.success("Draft pengajuan berhasil disimpan!");
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!sellerName || !sellerNik || !buyerName || !buyerNik) {
        toast.error("Mohon lengkapi nama dan NIK para pihak terlebih dahulu");
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      if (!certificateNumber || !landArea || !transactionPrice) {
        toast.error("Mohon lengkapi nomor sertifikat, luas, dan harga transaksi");
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmitAll = async () => {
    const newDoc = await createDocument({
      refNumber,
      title: `Akta Jual Beli Tanah & Bangunan ${city}`,
      docType: "akta_jual_beli",
      docTypeLabel: "Akta Jual Beli (AJB)",
      status: "draft_review",
      statusLabel: "Draft Review",
      currentStep: 2,
      seller: {
        fullName: sellerName,
        nik: sellerNik,
        registeredAddress: sellerAddress,
        ktpUrl: sellerKtpUrl,
        ktpFileName: sellerKtpName,
        verificationStatus: "verified_ai",
      },
      buyer: {
        fullName: buyerName,
        nik: buyerNik,
        registeredAddress: buyerAddress,
        ktpUrl: buyerKtpUrl,
        ktpFileName: buyerKtpName,
        verificationStatus: "pending",
      },
      property: {
        certificateType,
        certificateNumber,
        landArea: Number(landArea) || 0,
        buildingArea: Number(buildingArea) || 0,
        location,
        city,
        province,
        transactionPrice: Number(transactionPrice) || 0,
        njopPrice: Number(njopPrice) || 0,
      },
      agreement: {
        agreementDate,
        // @ts-ignore
        paymentMethod,
        bankName,
        downPayment: Number(downPayment) || 0,
        witness1Name: witness1,
        witness2Name: witness2,
        specialClauses,
      },
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    toast.success("Pengajuan Akta Jual Beli Berhasil Didaftarkan!", {
      description: "Data dialihkan ke ruang verifikasi dokumen & penerbitan draft akta.",
    });

    router.push(`/files/${newDoc.id}`);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Module Guide */}
        <FeatureGuide guide={MODULE_GUIDES.filesNew} />

        {/* Top Header */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Pengajuan Layanan Jual Beli Tanah
              </h1>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Lengkapi identitas para pihak, spesifikasi yuridis tanah, dan kesepakatan transaksi jual beli secara terstruktur.
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#0c1628] border border-slate-200 dark:border-slate-700/80 px-3 py-1 rounded-lg">
                Ref: {refNumber}
              </span>
              <Badge variant="encrypted">
                <span className="flex items-center gap-1">Terenkripsi</span>
              </Badge>
            </div>
          </div>

          {/* Stepper (01, 02, 03) */}
          <div className="pt-4 pb-2">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={(id) => setCurrentStep(id)}
            />
          </div>
        </div>

        {/* STEP 1: PERSONAL DETAILS */}
        {currentStep === 1 && (
          <Card className="overflow-hidden shadow-xl">
            <div className="p-6 bg-slate-50/80 dark:bg-[#0e192e] border-b border-slate-100 dark:border-[#182744] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Identitas Para Pihak (Penjual & Pembeli)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Langkah 1 dari 3: Masukkan data terverifikasi pihak pertama dan pihak kedua.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* SECTION A: DATA PENJUAL */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest pb-1 border-b border-slate-200 dark:border-slate-800/80">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>DATA PENJUAL (PIHAK PERTAMA)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="NAMA LENGKAP (SESUAI KTP)"
                    placeholder="e.g. Budi Santoso"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    required
                  />
                  <Input
                    label="NOMOR INDUK KEPENDUDUKAN (NIK)"
                    placeholder="16 digit NIK"
                    value={sellerNik}
                    onChange={(e) => setSellerNik(e.target.value)}
                    maxLength={16}
                    required
                  />
                </div>

                <Textarea
                  label="ALAMAT KTP LENGKAP"
                  placeholder="Alamat lengkap termasuk RT/RW, Kelurahan, Kecamatan"
                  value={sellerAddress}
                  onChange={(e) => setSellerAddress(e.target.value)}
                  rows={2}
                  required
                />

                <FileUpload
                  label="UNGGAH FOTO KTP PENJUAL"
                  fileName={sellerKtpName}
                  value={sellerKtpUrl}
                  onChange={(url, name) => {
                    setSellerKtpUrl(url);
                    setSellerKtpName(name);
                  }}
                  onRemove={() => {
                    setSellerKtpUrl(undefined);
                    setSellerKtpName(undefined);
                  }}
                />
              </div>

              {/* SECTION B: DATA PEMBELI */}
              <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest pb-1 border-b border-slate-200 dark:border-slate-800/80">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>DATA PEMBELI (PIHAK KEDUA)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="NAMA LENGKAP (SESUAI KTP)"
                    placeholder="e.g. Siti Aminah"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                  />
                  <Input
                    label="NOMOR INDUK KEPENDUDUKAN (NIK)"
                    placeholder="16 digit NIK"
                    value={buyerNik}
                    onChange={(e) => setBuyerNik(e.target.value)}
                    maxLength={16}
                    required
                  />
                </div>

                <Textarea
                  label="ALAMAT KTP LENGKAP"
                  placeholder="Alamat domisili lengkap pembeli"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  rows={2}
                  required
                />

                <FileUpload
                  label="UNGGAH FOTO KTP PEMBELI"
                  fileName={buyerKtpName}
                  value={buyerKtpUrl}
                  onChange={(url, name) => {
                    setBuyerKtpUrl(url);
                    setBuyerKtpName(name);
                  }}
                  onRemove={() => {
                    setBuyerKtpUrl(undefined);
                    setBuyerKtpName(undefined);
                  }}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 bg-slate-50 dark:bg-[#09101d] border-t border-slate-100 dark:border-[#182744] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                >
                  Simpan Draft
                </Button>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                className="px-6 font-semibold"
              >
                <span>Lanjut: Objek Properti</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: OBJEK PROPERTI */}
        {currentStep === 2 && (
          <Card className="overflow-hidden shadow-xl">
            <div className="p-6 bg-slate-50/80 dark:bg-[#0e192e] border-b border-slate-100 dark:border-[#182744] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Spesifikasi Objek Tanah & Bangunan
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Langkah 2 dari 3: Rincian yuridis sertifikat tanah, lokasi, dan nilai transaksi.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Building className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    JENIS HAK ATAS TANAH
                  </label>
                  <select
                    value={certificateType}
                    onChange={(e: any) => setCertificateType(e.target.value)}
                    className="w-full bg-white dark:bg-[#0b1426] border border-slate-300 dark:border-[#1b2b4d] text-slate-900 dark:text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Hak Milik (SHM)">Hak Milik (SHM)</option>
                    <option value="Hak Guna Bangunan (HGB)">Hak Guna Bangunan (HGB)</option>
                    <option value="Hak Pakai">Hak Pakai</option>
                  </select>
                </div>

                <Input
                  label="NOMOR SERTIFIKAT TANAH"
                  placeholder="e.g. Hak Milik No. 12345"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="LUAS TANAH (M²)"
                  type="number"
                  placeholder="250"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  required
                />
                <Input
                  label="LUAS BANGUNAN (M²)"
                  type="number"
                  placeholder="180"
                  value={buildingArea}
                  onChange={(e) => setBuildingArea(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  label="LETAK TANAH / ALAMAT OBJEK"
                  placeholder="Kecamatan Kebayoran Baru"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Input
                  label="KOTA / KABUPATEN"
                  placeholder="Jakarta Selatan"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  label="PROVINSI"
                  placeholder="DKI Jakarta"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1">
                  <Input
                    label="HARGA TRANSAKSI KESEPAKATAN (RP)"
                    type="number"
                    value={transactionPrice}
                    onChange={(e) => setTransactionPrice(e.target.value)}
                    required
                  />
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">
                    Terformat: {formatCurrencyIDR(Number(transactionPrice) || 0)}
                  </p>
                </div>

                <div className="space-y-1">
                  <Input
                    label="NILAI JUAL OBJEK PAJAK (NJOP RP)"
                    type="number"
                    value={njopPrice}
                    onChange={(e) => setNjopPrice(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Terformat: {formatCurrencyIDR(Number(njopPrice) || 0)}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <FileUpload
                  label="UNGGAH SCAN SERTIFIKAT ASLI (SHM/HGB)"
                  fileName="Sertifikat_SHM_12345_Kebayoran.pdf"
                  value="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-[#09101d] border-t border-slate-100 dark:border-[#182744] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Sebelumnya</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                >
                  Batal
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                >
                  Simpan Draft
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNextStep}
                  className="px-6 font-semibold"
                >
                  <span>Lanjut: Kesepakatan</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* STEP 3: KESEPAKATAN & FINALISASI */}
        {currentStep === 3 && (
          <Card className="overflow-hidden shadow-xl">
            <div className="p-6 bg-slate-50/80 dark:bg-[#0e192e] border-b border-slate-100 dark:border-[#182744] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Ketentuan & Kesepakatan Penandatanganan
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Langkah 3 dari 3: Metode penampungan escrow, saksi-saksi, dan konfirmasi akhir.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="TANGGAL TARGET TANDA TANGAN AKTA"
                  type="date"
                  value={agreementDate}
                  onChange={(e) => setAgreementDate(e.target.value)}
                  leftIcon={<Calendar className="w-4 h-4" />}
                  required
                />

                <div className="space-y-1.5 text-left">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    METODE PENAMPUNGAN / PEMBAYARAN
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-white dark:bg-[#0b1426] border border-slate-300 dark:border-[#1b2b4d] text-slate-900 dark:text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Escrow / Rekening Penampung Notaris">
                      Escrow / Rekening Penampung Notaris
                    </option>
                    <option value="Transfer Bank Langsung">Transfer Bank Langsung</option>
                    <option value="Kredit Pemilikan Rumah (KPR)">Kredit Pemilikan Rumah (KPR)</option>
                    <option value="Tunai Bertahap">Tunai Bertahap</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="NAMA SAKSI 1 (STAF KANTOR NOTARIS)"
                  value={witness1}
                  onChange={(e) => setWitness1(e.target.value)}
                />
                <Input
                  label="NAMA SAKSI 2 (STAF KANTOR NOTARIS)"
                  value={witness2}
                  onChange={(e) => setWitness2(e.target.value)}
                />
              </div>

              <Textarea
                label="KLAUSUL KHUSUS & KETENTUAN PENGOSONGAN OBJEK"
                value={specialClauses}
                onChange={(e) => setSpecialClauses(e.target.value)}
                rows={3}
              />

              {/* Summary Box */}
              <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-[#080f1e] border border-blue-200 dark:border-blue-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Ringkasan Transaksi Pengajuan</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Penjual:</span>
                    <strong className="text-slate-900 dark:text-slate-200">{sellerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Pembeli:</span>
                    <strong className="text-slate-900 dark:text-slate-200">{buyerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Objek:</span>
                    <strong className="text-slate-900 dark:text-slate-200">{certificateType}, {landArea} m²</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Nilai Transaksi:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {formatCurrencyIDR(Number(transactionPrice) || 0)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-[#09101d] border-t border-slate-100 dark:border-[#182744] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Sebelumnya</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                >
                  Batal
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                >
                  Simpan Draft
                </Button>
                <Button
                  type="button"
                  variant="glow"
                  onClick={handleSubmitAll}
                  className="px-6 font-semibold shadow-blue-500/30"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>Submit Pengajuan Akta</span>
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
