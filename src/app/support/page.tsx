"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FeatureGuide } from "@/components/ui/feature-guide";
import { MODULE_GUIDES } from "@/lib/guides";
import {
  MessageSquare,
  ShieldCheck,
  Send,
  ExternalLink,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const faqs = [
    {
      q: "Bagaimana cara kerja verifikasi otomatis KTP AI OCR?",
      a: "Sistem secara otomatis membaca foto KTP yang diunggah oleh pihak penjual/pembeli, mengekstrak NIK, Nama, dan Alamat, lalu mencocokkannya secara akurat dengan format baku Dukcapil tanpa perlu input manual.",
    },
    {
      q: "Apakah data akta dan sertifikat tersimpan secara aman?",
      a: "Ya. Seluruh berkas dienkripsi menggunakan standar perbankan AES-256 dan dilindungi Row Level Security (RLS) di level database PostgreSQL, sehingga data hanya dapat diakses oleh pihak yang berwenang.",
    },
    {
      q: "Bagaimana alur validasi KSWP Ditjen Pajak sebelum pembuatan AJB?",
      a: "Pada tab Verifikasi Berkas, klik tombol 'Validasi Sekarang' pada baris NPWP Penjual. Sistem akan langsung mengirim kueri status ke server KSWP Ditjen Pajak untuk memastikan kewajiban perpajakan telah terpenuhi.",
    },
    {
      q: "Bagaimana cara klien mengunggah berkas secara mandiri?",
      a: "Klien dapat masuk melalui tautan Portal Klien khusus atau login dengan nomor telepon/email yang telah didaftarkan untuk mengunggah dokumen KTP dan bukti pembayaran secara langsung.",
    },
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      toast.error("Mohon lengkapi subjek dan pesan bantuan");
      return;
    }
    toast.success("Tiket bantuan teknis berhasil dikirim!", {
      description: "Tim teknis Nexus PPAT akan menghubungi Anda dalam waktu 15 menit.",
    });
    setTicketSubject("");
    setTicketMessage("");
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
        {/* Module Guide */}
        <FeatureGuide guide={MODULE_GUIDES.support} />

        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pusat Bantuan & Panduan Hukum
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Panduan operasional sistem Nexus PPAT, regulasi PPAT, dan layanan dukungan teknis 24/7.
          </p>
        </div>

        {/* 3 Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Buku Panduan Notaris</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Panduan lengkap pembuatan AJB, APHT, dan integrasi validasi KSWP.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Membuka dokumentasi panduan hukum...")}
              className="mt-4"
            >
              <span>Baca Panduan</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Card>

          <Card className="p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">WhatsApp Helpdesk</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Konsultasi langsung dengan tim teknis & customer support melalui WhatsApp resmi.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Membuka chat WhatsApp Support Nexus PPAT (+62 811-9988-7766)")}
              className="mt-4 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/40"
            >
              <span>Chat WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Card>

          <Card className="p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Status Server & SLA</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Semua layanan cloud enkripsi dan database berjalan normal (99.98% Uptime).
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Semua Sistem Normal</span>
            </div>
          </Card>
        </div>

        {/* FAQ Accordion */}
        <Card className="p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight pb-3 border-b border-slate-100 dark:border-slate-800">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#080e1c] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/80 dark:border-slate-800/50 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Contact Form */}
        <Card className="p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight pb-3 border-b border-slate-100 dark:border-slate-800 mb-5">
            Kirim Tiket Bantuan Teknis
          </h2>

          <form onSubmit={handleSendTicket} className="space-y-4">
            <Input
              label="SUBJEK KENDALA / PERTANYAAN"
              placeholder="Contoh: Bantuan integrasi validasi KSWP atau migrasi data lama"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              required
            />

            <Textarea
              label="DETAIL PESAN BANTUAN"
              placeholder="Jelaskan secara detail kendala yang dialami..."
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              rows={4}
              required
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="glow">
                <Send className="w-4 h-4 mr-1.5" />
                <span>Kirim Pesan Bantuan</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
