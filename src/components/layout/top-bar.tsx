"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { useDocuments } from "@/contexts/document-context";
import { formatDistanceToNow, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Bell,
  Moon,
  Sun,
  Search,
  Settings,
  Menu,
  AlertTriangle,
  CreditCard,
  Plus,
} from "lucide-react";

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { documents, payments } = useDocuments();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Contextual greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const formattedDate = useMemo(() => {
    return format(new Date(), "EEEE, d MMMM yyyy", { locale: idLocale });
  }, []);

  const notifications = useMemo(() => {
    const notifs: any[] = [];
    documents.forEach((doc) => {
      if (doc.status === "awaiting_docs") {
        notifs.push({
          id: `doc-${doc.id}`,
          title: "Kelengkapan Berkas",
          message: `Akta ${doc.refNumber} (${doc.title}) menunggu berkas/KTP.`,
          icon: AlertTriangle,
          color: "text-amber-500",
          bg: "bg-amber-50 dark:bg-amber-500/10",
          time: new Date(doc.updatedAt),
          href: `/files/${doc.id}`,
        });
      }
    });

    payments.forEach((payment) => {
      if (payment.status === "Unpaid") {
        notifs.push({
          id: `pay-${payment.id}`,
          title: "Menunggu Pembayaran",
          message: `Invoice ${payment.invoiceNumber} (Rp ${payment.amount.toLocaleString("id-ID")}) belum dibayar.`,
          icon: CreditCard,
          color: "text-red-500",
          bg: "bg-red-50 dark:bg-red-500/10",
          time: new Date(payment.paidAt || payment.dueDate || Date.now() - 3600000),
          href: `/payments`,
        });
      }
    });

    return notifs.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);
  }, [documents, payments]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/files?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Helper to extract 2 words from user name (e.g. Dr. Hendrawan)
  const displayName = useMemo(() => {
    if (!user?.fullName) return "Pengguna";
    const parts = user.fullName.trim().split(/\s+/);
    return parts.slice(0, 2).join(" ");
  }, [user?.fullName]);

  return (
    <header className="h-20 border-b border-slate-200/80 dark:border-[#15243f] bg-white/90 dark:bg-[#070c18]/90 backdrop-blur-lg px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left: Mobile Toggle & Contextual Greeting */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Humanized Contextual Greeting */}
        <div className="hidden sm:block">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
            <span>{getGreeting()}, {displayName}</span>
            <span className="inline-block animate-bounce">👋</span>
          </h2>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Center/Right: Search Bar & Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="relative w-44 sm:w-64 lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari akta, pemohon, NIK..."
            className="w-full bg-slate-100/80 dark:bg-[#0c152a] border border-slate-200 dark:border-[#1a2c4e] text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-9 pr-3 py-2.5 transition-all focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0e1a33]"
          />
        </form>



        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#0e1a33] rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
          title={theme === "light" ? "Beralih ke Dark Mode" : "Beralih ke Light Mode"}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#0e1a33] rounded-xl transition-colors relative cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-3 w-80 max-h-[400px] overflow-y-auto bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-[#1e3256] rounded-2xl shadow-2xl p-4 z-40 animate-fade-in text-slate-800 dark:text-slate-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                    Notifikasi Terbaru
                  </h4>
                  {notifications.length > 0 && (
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                      {notifications.length} Baru
                    </span>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                    Belum ada notifikasi baru.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <Link key={notif.id} href={notif.href} onClick={() => setShowNotifications(false)}>
                          <div className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                            <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${notif.bg} ${notif.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {notif.title}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                {notif.message}
                              </p>
                              <p className="text-[9px] text-slate-400 dark:text-slate-500 pt-1">
                                {formatDistanceToNow(notif.time, { addSuffix: true, locale: idLocale })}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-600 dark:group-hover:border-blue-500 transition-colors shadow-xs bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-[#1e3256] rounded-2xl shadow-2xl p-3 z-40 animate-fade-in text-slate-800 dark:text-slate-100">
                <div className="p-3 bg-slate-50 dark:bg-[#091122] rounded-xl border border-slate-200 dark:border-slate-800 mb-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.fullName || "User"}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user?.email}</p>
                  {user?.skNumber && (
                    <p className="text-[9px] text-blue-600 dark:text-blue-400 mt-1 font-mono font-medium">{user.skNumber}</p>
                  )}
                </div>

                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Pengaturan Profil & Kantor</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
