"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { FeatureGuide } from "@/components/ui/feature-guide";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonPage } from "@/components/ui/loading-skeleton";
import { MODULE_GUIDES } from "@/lib/guides";
import { useDocuments } from "@/contexts/document-context";
import {
  Users,
  UserPlus,
  Search,
  Building2,
  User,
  FileText,
  ArrowRight,
  Database,
} from "lucide-react";
import { toast } from "sonner";

export default function ClientsPage() {
  const { clients, createClient, isLoading, error, loadDemoData } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Client Form
  const [fullName, setFullName] = useState("");
  const [clientType, setClientType] = useState<"Individu" | "Badan Hukum">("Individu");
  const [nikOrNpwp, setNikOrNpwp] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

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

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nikOrNpwp.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" ? true : c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !nikOrNpwp) {
      toast.error("Nama lengkap dan NIK/NPWP wajib diisi");
      return;
    }
    createClient({
      fullName,
      type: clientType,
      nikOrNpwp,
      phone,
      email,
      address,
    });
    setAddModalOpen(false);
    setFullName("");
    setNikOrNpwp("");
    setPhone("");
    setEmail("");
    setAddress("");
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Module Guide */}
        <FeatureGuide guide={MODULE_GUIDES.clients} />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Direktori Klien & Rekanan
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Kelola data identitas para pihak (perorangan, perseroan/badan hukum, dan instansi bank).
            </p>
          </div>

          <div className="flex items-center gap-3">
            {clients.length === 0 && (
              <Button variant="outline" onClick={loadDemoData} className="border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400">
                <Database className="w-4 h-4 mr-1" />
                <span>Muat Data Contoh</span>
              </Button>
            )}
            <Button
              variant="glow"
              onClick={() => setAddModalOpen(true)}
              className="shadow-blue-500/25"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              <span>+ Tambah Klien Baru</span>
            </Button>
          </div>
        </div>

        {clients.length === 0 ? (
          <Card className="mt-8">
            <EmptyState
              icon="users"
              title="Katalog Klien Kosong"
              description="Belum ada data klien yang tersimpan di sistem. Tambahkan klien baru untuk memulai."
              actionLabel="Tambah Klien Baru"
              onAction={() => setAddModalOpen(true)}
            />
          </Card>
        ) : (
          <>
            {/* Filter & Search */}
            <Card className="p-4 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex-1 w-full md:max-w-md">
                  <Input
                    placeholder="Cari nama klien, NIK, NPWP atau email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Tipe:</span>
                  <div className="flex items-center bg-slate-100 dark:bg-[#080e1c] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    {["all", "Individu", "Badan Hukum"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedType(t)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                          selectedType === t
                            ? "bg-blue-600 text-white font-bold shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                      >
                        {t === "all" ? "Semua Klien" : t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Clients Cards Grid */}
            {filteredClients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredClients.map((client) => (
                  <Card
                    key={client.id}
                    className="p-6 hover:border-blue-500/50 transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-[#0e1b33] border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                            {client.type === "Badan Hukum" ? (
                              <Building2 className="w-5 h-5" />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {client.fullName}
                            </h3>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                              {client.type}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                          {client.status}
                        </span>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">NIK / NPWP:</span>
                          <span className="font-mono text-slate-900 dark:text-slate-200 font-medium">
                            {client.nikOrNpwp}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Telepon:</span>
                          <span className="text-slate-900 dark:text-slate-200">{client.phone || "-"}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Email:</span>
                          <span className="text-slate-900 dark:text-slate-200 truncate max-w-[170px]">
                            {client.email || "-"}
                          </span>
                        </div>

                        <div className="flex items-start justify-between pt-1">
                          <span className="text-slate-500 dark:text-slate-400 shrink-0">Alamat:</span>
                          <span className="text-slate-700 dark:text-slate-300 text-right text-[11px] leading-tight line-clamp-2 pl-4">
                            {client.address || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>
                          <strong>{client.totalDocuments}</strong> Berkas Terdaftar
                        </span>
                      </div>

                      <Link
                        href={`/clients/${client.id}`}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-12">
                <EmptyState
                  title="Tidak Ditemukan"
                  description="Tidak ada klien yang cocok dengan filter atau kata kunci pencarian Anda."
                  icon="users"
                />
              </Card>
            )}
          </>
        )}
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Daftarkan Klien Baru"
        description="Tambahkan data identitas klien untuk pembuatan akta atau pengajuan baru."
        maxWidth="lg"
      >
        <form onSubmit={handleAddClient} className="space-y-4 pt-2">
          <div className="space-y-1.5 text-left">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              TIPE KLIEN
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setClientType("Individu")}
                className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  clientType === "Individu"
                    ? "bg-blue-50 dark:bg-blue-600/20 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400"
                    : "bg-slate-50 dark:bg-[#080e1c] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                Perorangan (Individu)
              </button>
              <button
                type="button"
                onClick={() => setClientType("Badan Hukum")}
                className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  clientType === "Badan Hukum"
                    ? "bg-blue-50 dark:bg-blue-600/20 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400"
                    : "bg-slate-50 dark:bg-[#080e1c] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                Badan Hukum (PT/CV)
              </button>
            </div>
          </div>

          <Input
            label={clientType === "Individu" ? "NAMA LENGKAP (SESUAI KTP)" : "NAMA PERSEROAN / BADAN HUKUM"}
            placeholder="e.g. Budi Santoso atau PT Maju Bersama"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label={clientType === "Individu" ? "NIK (16 DIGIT)" : "NOMOR NPWP PERSEROAN"}
            placeholder="e.g. 3171234567890001"
            value={nikOrNpwp}
            onChange={(e) => setNikOrNpwp(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="NOMOR WHATSAPP / TELEPON"
              placeholder="+62 812-xxxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="EMAIL KLIEN"
              type="email"
              placeholder="klien@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Input
            label="ALAMAT DOMISILI LENGKAP"
            placeholder="Jl. Sudirman No. 45, Jakarta Selatan"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="glow">
              Simpan Data Klien
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
