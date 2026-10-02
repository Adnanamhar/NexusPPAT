"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { NOTARY_SERVICES as INITIAL_NOTARY_SERVICES } from "@/lib/service-templates";
import { useAuth } from "@/contexts/auth-context";
import { useClientData } from "@/contexts/client-data-context";
import { NotaryServiceInfo, ServiceCategory } from "@/types";
import {
  Building2,
  Gift,
  RefreshCw,
  Landmark,
  PieChart,
  Briefcase,
  FileEdit,
  FileCheck,
  HeartHandshake,
  Scroll,
  CheckSquare,
  ShieldAlert,
  Search,
  ArrowRight,
  Sparkles,
  Clock,
  Inbox,
  FileCode2,
  Plus,
  HelpCircle,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

const ICON_MAP: Record<string, React.ElementType> = {
  Building2,
  Gift,
  RefreshCw,
  Landmark,
  PieChart,
  Briefcase,
  FileEdit,
  FileCheck,
  HeartHandshake,
  Scroll,
  CheckSquare,
  ShieldAlert,
};

export default function ServiceCatalogPage() {
  const { role } = useAuth();
  const { serviceRequests } = useClientData();
  const [servicesList, setServicesList] = useState<NotaryServiceInfo[]>(INITIAL_NOTARY_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"catalog" | "requests">("catalog");

  // State for Add New Service Modal (Admin & Notaris)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newCategory, setNewCategory] = useState<ServiceCategory>("ppat");
  const [newDescription, setNewDescription] = useState("");
  const [newBadgeText, setNewBadgeText] = useState("Layanan Baru");
  const [newDays, setNewDays] = useState("2 - 4 Hari Kerja");

  const categories = [
    { id: "all", label: "Semua Layanan" },
    { id: "ppat", label: "PPAT & Pertanahan" },
    { id: "badan_usaha", label: "Pendirian Badan Usaha" },
    { id: "perjanjian", label: "Perjanjian & Kontrak" },
    { id: "waris", label: "Keluarga & Waris" },
    { id: "legalisasi", label: "Legalisasi" },
    { id: "kuasa", label: "Surat Kuasa" },
  ];

  const filteredServices = servicesList.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" ? true : service.category === selectedCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Nama layanan wajib diisi.");
      return;
    }

    const codeSlug = (newCode || newTitle)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_") as any;

    const categoryLabels: Record<ServiceCategory, string> = {
      ppat: "PPAT & Pertanahan",
      badan_usaha: "Pendirian Badan Usaha",
      perjanjian: "Perjanjian & Kontrak",
      waris: "Keluarga & Waris",
      legalisasi: "Legalisasi",
      kuasa: "Surat Kuasa",
    };

    const newServiceObj: NotaryServiceInfo = {
      id: `srv-custom-${Date.now()}`,
      code: codeSlug,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || "Layanan Notaris",
      description: newDescription.trim() || "Layanan resmi terdaftar di kantor notaris / PPAT.",
      badgeText: newBadgeText.trim() || "Kustom",
      estimatedDays: newDays.trim() || "3 Hari Kerja",
      iconName: "FileCheck",
      requiredFields: ["applicantName", "applicantNik", "applicantAddress"],
    };

    setServicesList((prev) => [newServiceObj, ...prev]);
    setIsAddModalOpen(false);
    toast.success(`Layanan baru "${newTitle}" berhasil ditambahkan ke katalog!`);

    // Reset form
    setNewTitle("");
    setNewCode("");
    setNewDescription("");
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem Layanan Notaris & PPAT Terpadu</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Katalog Layanan Notariil & Pertanahan
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Pilih layanan hukum yang ingin Anda urus. Data profil Anda yang sudah tersimpan akan diisi otomatis pada formulir pengajuan.
            </p>
          </div>

          {/* Admin / Notaris Action Controls */}
          {role !== "klien" ? (
            <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="flex items-center bg-slate-200/80 dark:bg-[#0c152a] p-1 rounded-2xl border border-slate-300 dark:border-slate-700">
                <button
                  onClick={() => setViewMode("catalog")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "catalog"
                      ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  Katalog Layanan
                </button>
                <button
                  onClick={() => setViewMode("requests")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "requests"
                      ? "bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Pengajuan Masuk</span>
                  {serviceRequests.length > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {serviceRequests.length}
                    </span>
                  )}
                </button>
              </div>
              <Button
                variant="glow"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="shadow-blue-500/25 font-bold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>+ Tambah Layanan Baru</span>
              </Button>
            </div>
          ) : null}
        </div>

        {/* ADMIN REQUESTS INBOX VIEW */}
        {viewMode === "requests" && role !== "klien" ? (
          <div className="space-y-4">
            <Card className="p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#182746] mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Daftar Pengajuan Masuk dari Klien
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Klik pengajuan untuk membuka Admin Document Studio (Preview, Editor Data Kurang, & Export PDF/Word).
                  </p>
                </div>
                <Badge variant="default">{serviceRequests.length} Pengajuan</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-[#182746] bg-slate-50/70 dark:bg-[#080f1e] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-6">NO REF & LAYANAN</th>
                      <th className="py-3.5 px-6">PEMOHON / KLIEN</th>
                      <th className="py-3.5 px-6">TANGGAL MASUK</th>
                      <th className="py-3.5 px-6">STATUS</th>
                      <th className="py-3.5 px-6 text-right">AKSI DOCUMENT STUDIO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#152442] text-xs font-medium">
                    {serviceRequests.map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-[#0f1d38]/60 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block">
                            {req.refNumber}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block mt-0.5">
                            {req.serviceTitle}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-slate-900 dark:text-slate-200 block">
                            {req.clientName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{req.clientPhone}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                          {new Date(req.createdAt).toLocaleDateString("id-ID", {
                            dateStyle: "medium",
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 px-2.5 py-1 rounded-lg">
                            {req.statusLabel}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link href={`/admin/document-studio/${req.id}`}>
                            <Button variant="glow" size="sm">
                              <FileCode2 className="w-3.5 h-3.5 mr-1" />
                              <span>Buka Studio & Export</span>
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>
        ) : (
          /* CATALOG GRID VIEW */
          <>
            {/* REDESIGNED SLEEK FILTER BAR (FIX PHOTO 2) */}
            <div className="p-2.5 rounded-2xl bg-white/90 dark:bg-[#0c152a]/90 backdrop-blur-md border border-slate-200/90 dark:border-[#1a2c4e] shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
              {/* Sleek Integrated Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama layanan, akta jual beli, PT, waris..."
                  className="w-full bg-slate-50 dark:bg-[#070d1a] border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-10 pr-3 py-2.5 transition-all focus:outline-none focus:border-blue-600 dark:focus:border-blue-500"
                />
              </div>

              {/* Seamless Segmented Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Cards Grid (12+ Services) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredServices.map((service) => {
                const IconComponent = ICON_MAP[service.iconName] || FileCheck;

                return (
                  <Card
                    key={service.id}
                    className="p-6 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-lg transition-all group"
                  >
                    <div className="space-y-4">
                      {/* Top Header & Icon */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-500/30">
                          {service.badgeText}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {service.categoryLabel}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-5 mt-5 border-t border-slate-100 dark:border-[#172748] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{service.estimatedDays}</span>
                      </div>

                      <Link href={`/layanan/${service.code}`}>
                        <Button variant="primary" size="sm" className="font-bold">
                          <span>Isi Pengajuan</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* MODAL TAMBAH LAYANAN BARU (ADMIN & NOTARIS) WITH STEP-BY-STEP GUIDANCE */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Jenis Layanan Notaris Baru"
        description="Daftarkan jenis akta atau perjanjian baru ke katalog kantor beserta panduan pengisiannya."
        maxWidth="lg"
      >
        <form onSubmit={handleAddServiceSubmit} className="space-y-6 pt-2">
          {/* GUIDANCE BOX */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Panduan Penambahan Layanan Notaris:</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Pastikan nama layanan sesuai nomenklatur ikatan Notaris / PPAT Indonesia.</li>
              <li>Pilih kategori layanan yang tepat agar klasifikasi laporan omset terakumulasi benar.</li>
              <li>Sistem akan secara otomatis menyertakan kolom data pemohon dasar (Nama, NIK, Alamat).</li>
            </ul>
          </div>

          {/* FORM INPUTS */}
          <div className="space-y-4">
            <Input
              label="NAMA LAYANAN / AKTA NOTARIS"
              placeholder="e.g. Perjanjian Fidusia Kendaraan Bermotor"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  KATEGORI LAYANAN
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full bg-white dark:bg-[#0b1426] border border-slate-300 dark:border-[#1b2b4d] text-slate-900 dark:text-slate-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-600"
                >
                  <option value="ppat">PPAT & Pertanahan</option>
                  <option value="badan_usaha">Pendirian Badan Usaha</option>
                  <option value="perjanjian">Perjanjian & Kontrak</option>
                  <option value="waris">Keluarga & Waris</option>
                  <option value="legalisasi">Legalisasi</option>
                  <option value="kuasa">Surat Kuasa</option>
                </select>
              </div>

              <Input
                label="ESTIMASI DURASI PENGERJAAN"
                placeholder="e.g. 2 - 3 Hari Kerja"
                value={newDays}
                onChange={(e) => setNewDays(e.target.value)}
              />
            </div>

            <Textarea
              label="DESKRIPSI LENGKAP LAYANAN"
              placeholder="Tuliskan syarat dan deskripsi singkat layanan hukum ini..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* BOTTOM ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="glow"
              className="font-bold shadow-blue-500/25"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>Simpan Layanan ke Katalog</span>
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
