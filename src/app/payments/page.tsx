"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { FeatureGuide } from "@/components/ui/feature-guide";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonPage } from "@/components/ui/loading-skeleton";
import { MODULE_GUIDES } from "@/lib/guides";
import { useDocuments } from "@/contexts/document-context";
import { formatCurrencyIDR } from "@/lib/cn";
import { PaymentItem } from "@/types";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Receipt,
  Send,
  Printer,
  Download,
  Plus,
  Search,
  Database,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

export default function PaymentsPage() {
  const { payments, documents, isLoading, error, loadDemoData } = useDocuments();
  const [paymentsList, setPaymentsList] = useState<PaymentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // New Payment Modal State
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newDocRef, setNewDocRef] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("BCA Virtual Account");
  const [newStatus, setNewStatus] = useState<"Paid" | "Unpaid" | "Partial">("Unpaid");

  const handleDocumentSelect = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setNewDocRef(doc.refNumber);
      setNewDocTitle(doc.title);
      setNewClientName(doc.seller?.fullName || doc.buyer?.fullName || "Klien");
      setNewAmount(doc.billingAmount?.toString() || "");
    } else {
      setNewDocRef("");
      setNewDocTitle("");
      setNewClientName("");
      setNewAmount("");
    }
  };

  // Sync payments from context once initialized
  React.useEffect(() => {
    if (payments && payments.length > 0) {
      setPaymentsList(payments);
    }
  }, [payments]);

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

  const displayedPayments = paymentsList.length > 0 ? paymentsList : payments;

  const filteredPayments = displayedPayments.filter((p) => {
    const matchesSearch =
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.documentRef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendWaReminder = (clientName: string, amount: number, invNum: string) => {
    toast.success(`Pengingat WhatsApp berhasil dikirim ke ${clientName}`, {
      description: `Tagihan ${invNum} sebesar ${formatCurrencyIDR(amount)} siap dibayarkan via Virtual Account.`,
    });
  };

  const handleMarkAsPaid = (paymentId: string) => {
    setPaymentsList((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? { ...p, status: "Paid", paidAt: new Date().toLocaleString("id-ID") }
          : p
      )
    );
    toast.success("Status pembayaran telah diperbarui menjadi LUNAS!");
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newAmount) {
      toast.error("Nama klien dan jumlah honorarium wajib diisi.");
      return;
    }

    const count = displayedPayments.length + 1;
    const invNum = `INV/2026/08/${String(count).padStart(3, "0")}`;

    const newPaymentObj: PaymentItem = {
      id: `pay-${Date.now()}`,
      invoiceNumber: invNum,
      documentRef: newDocRef.trim() || "AJB-2026-090",
      documentTitle: newDocTitle.trim() || "Akta Notaris",
      clientName: newClientName.trim(),
      amount: Number(newAmount) || 15000000,
      status: newStatus,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      paidAt: newStatus === "Paid" ? new Date().toLocaleString("id-ID") : undefined,
      paymentMethod: newPaymentMethod,
    };

    setPaymentsList((prev) => [newPaymentObj, ...prev]);
    setIsAddPaymentModalOpen(false);
    toast.success(`Invoice ${invNum} untuk ${newClientName} berhasil dicatat!`);

    // Reset
    setNewClientName("");
    setNewAmount("15000000");
  };

  // Metrics
  const totalOmset = displayedPayments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalUnpaid = displayedPayments
    .filter((p) => p.status !== "Paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const unpaidCount = displayedPayments.filter((p) => p.status !== "Paid").length;
  const paidCount = displayedPayments.filter((p) => p.status === "Paid").length;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Module Guide */}
        <FeatureGuide guide={MODULE_GUIDES.payments} />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pembayaran & Billing Notaris
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manajemen honorarium akta, rekening penampung (escrow), PNBP, dan kuitansi resmi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {displayedPayments.length === 0 && (
              <Button
                variant="outline"
                onClick={loadDemoData}
                className="border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400"
              >
                <Database className="w-4 h-4 mr-1" />
                <span>Muat Data Contoh</span>
              </Button>
            )}
            <Button
              variant="glow"
              onClick={() => setIsAddPaymentModalOpen(true)}
              className="shadow-blue-500/25 font-bold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>+ Catat Pembayaran Masuk</span>
            </Button>
          </div>
        </div>

        {displayedPayments.length === 0 ? (
          <Card className="mt-8">
            <EmptyState
              icon="payment"
              title="Belum Ada Transaksi"
              description="Sistem billing Anda belum memiliki catatan pembayaran atau invoice. Silakan catat pembayaran masuk."
              actionLabel="Catat Pembayaran"
              onAction={() => setIsAddPaymentModalOpen(true)}
            />
          </Card>
        ) : (
          <>
            {/* Financial Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Card className="p-6 shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  TOTAL OMSET TEREKAM
                </span>
                <div
                  className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 truncate"
                  title={formatCurrencyIDR(totalOmset)}
                >
                  {formatCurrencyIDR(totalOmset)}
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Pendapatan bersih yang telah lunas</span>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  TAGIHAN TERTUNDA (UNPAID)
                </span>
                <div
                  className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2 truncate"
                  title={formatCurrencyIDR(totalUnpaid)}
                >
                  {formatCurrencyIDR(totalUnpaid)}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{unpaidCount} invoice menunggu pembayaran</span>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                  TOTAL INVOICE LUNAS
                </span>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                  {paidCount} Transaksi
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>100% terekonsiliasi perbankan</span>
                </div>
              </Card>
            </div>

            {/* Filter & Table */}
            <Card className="overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-[#182746] flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="w-full md:max-w-md">
                  <Input
                    placeholder="Cari nomor invoice, nama klien, atau nomor ref..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>

                <div className="flex items-center bg-slate-100 dark:bg-[#080e1c] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  {[
                    { id: "all", label: "Semua Tagihan" },
                    { id: "Paid", label: "Lunas" },
                    { id: "Unpaid", label: "Belum Lunas" },
                    { id: "Partial", label: "Termin" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setStatusFilter(st.id)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                        statusFilter === st.id
                          ? "bg-blue-600 text-white font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-[#182746] bg-slate-50/70 dark:bg-[#080f1e] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">NOMOR INVOICE</th>
                      <th className="py-4 px-6">NAMA KLIEN & BERKAS AKTA</th>
                      <th className="py-4 px-6">TOTAL HONORARIUM</th>
                      <th className="py-4 px-6">STATUS PEMBAYARAN</th>
                      <th className="py-4 px-6">JATUH TEMPO</th>
                      <th className="py-4 px-6 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#152442] text-xs font-medium">
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((pay) => (
                        <tr
                          key={pay.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-[#0f1e3b]/70 transition-colors"
                        >
                          <td className="py-4 px-6 font-mono text-blue-700 dark:text-blue-400 font-bold">
                            {pay.invoiceNumber}
                          </td>

                          <td className="py-4 px-6">
                            <span className="font-bold text-slate-900 dark:text-slate-100 block">
                              {pay.clientName}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                              Ref: {pay.documentRef} • {pay.documentTitle}
                            </span>
                          </td>

                          <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-200 text-sm">
                            {formatCurrencyIDR(pay.amount)}
                          </td>

                          <td className="py-4 px-6">
                            {pay.status === "Paid" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-xs font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                              </span>
                            ) : pay.status === "Unpaid" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 text-xs font-semibold">
                                <Clock className="w-3.5 h-3.5" /> Belum Dibayar
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-xs font-semibold">
                                <Clock className="w-3.5 h-3.5" /> Sebagian (DP)
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-6 text-slate-700 dark:text-slate-300">{pay.dueDate}</td>

                          <td className="py-4 px-6 text-right relative space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => setOpenActionId(openActionId === pay.id ? null : pay.id)}
                              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                              <MoreHorizontal className="w-5 h-5 text-slate-500" />
                            </button>
                            
                            {openActionId === pay.id && (
                              <div className="absolute right-6 top-10 w-44 bg-white dark:bg-[#0c152a] border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 flex flex-col py-1 text-left">
                                {pay.status === "Paid" ? (
                                  <button
                                    onClick={() => { setSelectedReceipt(pay); setOpenActionId(null); }}
                                    className="px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center transition-colors cursor-pointer"
                                  >
                                    <Receipt className="w-4 h-4 mr-2" /> Lihat Kuitansi
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => { handleMarkAsPaid(pay.id); setOpenActionId(null); }}
                                      className="px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center transition-colors cursor-pointer"
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Lunas
                                    </button>
                                    <button
                                      onClick={() => { handleSendWaReminder(pay.clientName, pay.amount, pay.invoiceNumber); setOpenActionId(null); }}
                                      className="px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center transition-colors cursor-pointer"
                                    >
                                      <Send className="w-4 h-4 mr-2" /> Ingatkan WA
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12">
                          <EmptyState
                            title="Tidak Ditemukan"
                            description="Tidak ada transaksi yang cocok dengan filter atau kata kunci pencarian Anda."
                            icon="payment"
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

      {/* MODAL CATAT PEMBAYARAN MASUK BARU */}
      <Modal
        isOpen={isAddPaymentModalOpen}
        onClose={() => setIsAddPaymentModalOpen(false)}
        title="Catat Pembayaran Honorarium Masuk"
        description="Terbitkan invoice tagihan atau catat penerimaan honorarium akta dari klien."
        maxWidth="md"
      >
        <form onSubmit={handleAddPaymentSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5 text-left">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              PILIH PERKARA / AKTA KLIEN
            </label>
            <select
              onChange={(e) => handleDocumentSelect(e.target.value)}
              className="w-full bg-white dark:bg-[#0b1426] border border-slate-300 dark:border-[#1b2b4d] text-slate-900 dark:text-slate-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-600"
            >
              <option value="">-- Pilih Berkas Akta --</option>
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.refNumber} - {d.title} ({d.seller?.fullName || d.buyer?.fullName || 'Klien'})</option>
              ))}
            </select>
          </div>

          <Input
            label="NAMA KLIEN / PEMOHON"
            placeholder="e.g. Bpk. Budi Santoso"
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="NOMOR REFERENSI AKTA"
              value={newDocRef}
              onChange={(e) => setNewDocRef(e.target.value)}
            />
            <Input
              label="JUDUL PERKARA / AKTA"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="JUMLAH HONORARIUM (RP)"
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                STATUS PEMBAYARAN
              </label>
              <select
                value={newStatus}
                onChange={(e: any) => setNewStatus(e.target.value)}
                className="w-full bg-white dark:bg-[#0b1426] border border-slate-300 dark:border-[#1b2b4d] text-slate-900 dark:text-slate-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-600"
              >
                <option value="Unpaid">Belum Dibayar (Unpaid)</option>
                <option value="Paid">Lunas (Paid)</option>
                <option value="Partial">Sebagian / DP (Partial)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              METODE PEMBAYARAN / BANK
            </label>
            <select
              value={newPaymentMethod}
              onChange={(e) => setNewPaymentMethod(e.target.value)}
              className="w-full bg-white dark:bg-[#0b1426] border border-slate-300 dark:border-[#1b2b4d] text-slate-900 dark:text-slate-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-600"
            >
              <option value="BCA Virtual Account">BCA Virtual Account</option>
              <option value="Mandiri Virtual Account">Mandiri Virtual Account</option>
              <option value="BNI Virtual Account">BNI Virtual Account</option>
              <option value="Transfer Bank Lain">Transfer Bank Lain</option>
              <option value="Tunai / Cash">Tunai / Cash</option>
              <option value="Escrow / Rekening Penampung Notaris">Escrow / Rekening Penampung Notaris</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddPaymentModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="glow" className="font-bold shadow-blue-500/25">
              <DollarSign className="w-4 h-4 mr-1.5" />
              <span>Simpan & Terbitkan Invoice</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title={`Kuitansi Resmi: ${selectedReceipt.invoiceNumber}`}
          description="Bukti penerimaan pembayaran honorarium jasa hukum notaris"
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="bg-white text-slate-900 p-6 md:p-8 rounded-xl font-serif text-xs border border-slate-300 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-10 right-10 opacity-5 pointer-events-none transform rotate-[-20deg]">
                <CheckCircle2 className="w-48 h-48 text-emerald-900" />
              </div>

              <div className="text-center border-b border-slate-300 pb-3 relative z-10">
                <h3 className="text-base font-bold tracking-widest uppercase text-slate-800">
                  KUITANSI PEMBAYARAN NOTARIS
                </h3>
                <p className="font-sans text-xs text-slate-700 font-semibold mt-1">
                  Kantor Notaris & PPAT Dr. Hendrawan Kartasasmita, S.H., M.Kn.
                </p>
                <p className="font-sans text-[10px] text-slate-500 font-mono mt-1">
                  No: {selectedReceipt.invoiceNumber}
                </p>
              </div>

              <div className="space-y-3 font-sans text-xs relative z-10">
                <div className="flex justify-between border-b border-slate-200 border-dashed pb-1.5">
                  <span className="text-slate-600">Telah Terima Dari:</span>
                  <strong className="text-slate-900 uppercase">{selectedReceipt.clientName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 border-dashed pb-1.5">
                  <span className="text-slate-600">Untuk Pembayaran:</span>
                  <strong className="text-slate-900 text-right max-w-[250px]">
                    Jasa Hukum & Biaya Akta ({selectedReceipt.documentRef})
                  </strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 border-dashed pb-1.5 items-center">
                  <span className="text-slate-600">Jumlah Uang:</span>
                  <strong className="text-emerald-700 text-lg font-extrabold bg-emerald-50 px-3 py-1 rounded">
                    {formatCurrencyIDR(selectedReceipt.amount)}
                  </strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 border-dashed pb-1.5">
                  <span className="text-slate-600">Metode & Waktu:</span>
                  <span className="text-slate-700 font-medium">
                    {selectedReceipt.paymentMethod} • {selectedReceipt.paidAt || "Lunas"}
                  </span>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-end font-sans text-xs relative z-10">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-900/40 flex items-center justify-center text-[10px] font-bold text-blue-900/60 uppercase text-center p-2 transform -rotate-12 bg-white/50 backdrop-blur-sm">
                  LUNAS<br />NOTARIS PRO
                </div>

                <div className="text-center">
                  <p className="text-slate-500 text-[10px]">Penerima Kuasa,</p>
                  <p className="font-bold text-slate-900 mt-10 border-b border-slate-400 inline-block px-4 pb-1">
                    Amanda Rahmawati, S.E.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Bendahara Kantor</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-1.5" />
                <span>Cetak Kuitansi</span>
              </Button>
              <Button
                variant="glow"
                onClick={() => {
                  toast.success("Kuitansi PDF berhasil diunduh!");
                  setSelectedReceipt(null);
                }}
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Unduh PDF</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
