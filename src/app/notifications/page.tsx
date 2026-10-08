"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useNotifications } from "@/contexts/notification-context";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import {
  Bell,
  Search,
  AlertTriangle,
  CreditCard,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  Clock,
  Trash2,
  Check
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useRouter } from "next/navigation";

const iconMap: Record<string, any> = {
  "bell": Bell,
  "alert-triangle": AlertTriangle,
  "credit-card": CreditCard,
  "file-check-2": FileCheck2,
  "sparkles": Sparkles,
  "shield-check": ShieldCheck,
  "clock": Clock
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const tabs = [
    { id: "all", label: "Semua" },
    { id: "unread", label: "Belum Dibaca" },
    { id: "document_status", label: "Dokumen" },
    { id: "payment", label: "Pembayaran" },
    { id: "new_service_request", label: "Layanan" },
    { id: "verification", label: "Verifikasi" },
    { id: "deadline_reminder", label: "Reminder" },
    { id: "admin_activity", label: "Admin" },
  ];

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "unread" && n.isRead) return false;
    if (filter !== "all" && filter !== "unread" && n.type !== filter) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Bell className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              Pusat Notifikasi
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Kelola semua pemberitahuan, perubahan status, dan pengingat.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-sm rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Check className="w-4 h-4" />
              Tandai Semua Dibaca
            </button>
          )}
        </div>

        <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/50 dark:bg-slate-900/50">
          <div className="flex overflow-x-auto w-full gap-2 pb-2 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                  filter === tab.id
                    ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari notifikasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
        </Card>

        <div className="space-y-3">
          {filteredNotifs.length === 0 ? (
            <Card className="py-12">
              <EmptyState
                title="Tidak Ada Notifikasi"
                description={search ? "Tidak ada notifikasi yang sesuai dengan pencarian." : "Anda belum memiliki notifikasi pada kategori ini."}
              />
            </Card>
          ) : (
            filteredNotifs.map((notif) => {
              const Icon = iconMap[notif.iconName] || Bell;
              const colorName = notif.color || "blue";
              return (
                <Card
                  key={notif.id}
                  className={`p-4 transition-all border ${
                    notif.isRead
                      ? "border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50"
                      : "border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex shrink-0 items-center justify-center bg-${colorName}-100 dark:bg-${colorName}-900/30 text-${colorName}-600 dark:text-${colorName}-400 mt-1`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h3 className={`text-sm truncate pr-4 ${notif.isRead ? "font-semibold text-slate-700 dark:text-slate-300" : "font-extrabold text-slate-900 dark:text-white"}`}>
                          {notif.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap font-medium">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: idLocale })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                        {notif.message}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        {notif.href && (
                          <button
                            onClick={() => {
                              if (!notif.isRead) markAsRead(notif.id);
                              router.push(notif.href!);
                            }}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Buka Tautan
                          </button>
                        )}
                        
                        {!notif.isRead && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                          >
                            Tandai Dibaca
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors ml-auto flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
