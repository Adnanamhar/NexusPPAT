import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAuth } from "@/contexts/auth-context";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderClosed,
  Users,
  CreditCard,
  BarChart3,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  ShieldCheck,
  X,
  Compass,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { logout, role } = useAuth();

  const allNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["notaris", "admin", "klien"] },
    { label: "Katalog Layanan", href: "/layanan", icon: Compass, activeRegex: /^\/layanan/, roles: ["notaris", "admin", "klien"] },
    { label: "Berkas & Akta", href: "/files", icon: FolderClosed, activeRegex: /^\/files/, roles: ["notaris", "admin", "klien"] },
    { label: "Katalog Klien", href: "/clients", icon: Users, activeRegex: /^\/clients/, roles: ["notaris", "admin"] },
    { label: "Pembayaran", href: "/payments", icon: CreditCard, activeRegex: /^\/payments/, roles: ["notaris", "admin", "klien"] },
    { label: "Laporan & Omset", href: "/reports", icon: BarChart3, activeRegex: /^\/reports/, roles: ["notaris"] },
    { label: "Audit Log", href: "/activities", icon: History, activeRegex: /^\/activities/, roles: ["notaris", "admin"] },
    { label: "Pengaturan", href: "/settings", icon: Settings, activeRegex: /^\/settings/, roles: ["notaris", "admin"] },
  ];

  const filteredNavItems = allNavItems.filter((item) => item.roles.includes(role));
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  return (
    <>
      <aside className="w-64 bg-[#f8fafc] dark:bg-[#070c18] border-r border-slate-200/80 dark:border-slate-800/60 text-slate-900 dark:text-white flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 select-none transition-colors">
        {/* Top Header & Brand */}
        <div>
          <div className="p-6 pb-6">
            {/* Mobile close button */}
            <div className="flex items-center justify-between lg:hidden mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Menu</span>
              <button
                onClick={onNavigate}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Link href="/dashboard" className="block group" onClick={onNavigate}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Nexus PPAT
                  </h1>
                  <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 tracking-[0.2em] uppercase mt-1 block">
                    LEGAL SUITE
                  </span>
                </div>
              </div>
            </Link>

            {/* Quick Action Button to Service Catalog */}
            <Link href="/layanan" className="block mt-6" onClick={onNavigate}>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
                <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
                <span>Mulai Pengajuan Baru</span>
              </button>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="px-4 space-y-1 mt-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.activeRegex ? item.activeRegex.test(pathname) : pathname === item.href;

              return (
                <Link key={item.href} href={item.href} onClick={onNavigate} className="block">
                  <div
                    className={cn(
                      "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer group",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors shrink-0",
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer Section */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/60 space-y-1">
          <Link href="/support" onClick={onNavigate}>
            <div
              className={cn(
                "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer",
                pathname === "/support" && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              )}
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Pusat Bantuan</span>
            </div>
          </Link>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari sistem Nexus PPAT?"
        maxWidth="sm"
      >
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
            Batal
          </Button>
          <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white border-transparent" onClick={handleLogout}>
            Ya, Keluar
          </Button>
        </div>
      </Modal>
    </>
  );
}
