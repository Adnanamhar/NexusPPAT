"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Menu, X } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#070c18] text-slate-800 dark:text-slate-100 transition-colors">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar: hidden on mobile, shown on lg+ */}
        <div
          className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-auto transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
