"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDocuments } from "@/contexts/document-context";
import { formatCurrencyIDR } from "@/lib/cn";
import {
  ArrowLeft,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Plus,
} from "lucide-react";

export default function ClientDetailPage() {
  const params = useParams();
  const { clients, documents } = useDocuments();
  const clientId = params.id as string;

  const client = clients.find((c) => c.id === clientId) || clients[0];
  const clientDocs = documents.filter(
    (d) =>
      d.seller.fullName.toLowerCase().includes(client.fullName.toLowerCase()) ||
      d.buyer.fullName.toLowerCase().includes(client.fullName.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Header Back */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/clients"
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Direktori Klien</span>
          </Link>

          <Link href="/files/new">
            <Button variant="glow" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>+ Buat Akta untuk Klien Ini</span>
            </Button>
          </Link>
        </div>

        {/* Client Profile Header Card */}
        <Card className="p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-blue-500/25">
                {client.type === "Badan Hukum" ? (
                  <Building2 className="w-8 h-8" />
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {client.fullName}
                  </h1>
                  <Badge variant="verified-ai">Verified Dukcapil</Badge>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1 uppercase tracking-wider">
                  {client.type} • NIK/NPWP: {client.nikOrNpwp}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold">
                Status: {client.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#080e1c] rounded-xl border border-slate-200 dark:border-slate-800">
              <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Telepon</span>
                <span className="text-slate-900 dark:text-slate-200 font-medium">{client.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#080e1c] rounded-xl border border-slate-200 dark:border-slate-800">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="text-slate-900 dark:text-slate-200 font-medium">{client.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#080e1c] rounded-xl border border-slate-200 dark:border-slate-800">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Alamat</span>
                <span className="text-slate-900 dark:text-slate-200 font-medium truncate block">{client.address}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Client Documents History */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Riwayat Berkas & Akta Terdaftar ({clientDocs.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientDocs.map((doc) => (
              <Card
                key={doc.id}
                className="p-5 hover:border-blue-500/50 transition-all group shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-blue-700 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 px-2 py-0.5 rounded">
                    {doc.refNumber}
                  </span>
                  <Badge variant={doc.status === "draft_review" ? "draft-review" : "signature-pending"}>
                    {doc.statusLabel}
                  </Badge>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {doc.title}
                </h4>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {formatCurrencyIDR(doc.property.transactionPrice)}
                  </span>
                  <Link
                    href={`/files/${doc.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                  >
                    Buka Berkas →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
