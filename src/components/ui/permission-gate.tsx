"use client";

import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { FeaturePermission, hasPermission } from "@/lib/permissions";
import { Lock, ShieldAlert } from "lucide-react";
import { Button } from "./button";

interface PermissionGateProps {
  feature: FeaturePermission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ feature, children, fallback }: PermissionGateProps) {
  const { role } = useAuth();
  const allowed = hasPermission(role, feature);

  if (allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0c1424] border border-slate-200 dark:border-slate-800 text-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
        <Lock className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Fitur Terbatas</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Fitur ini hanya dapat diakses oleh peran <strong>Notaris / PPAT</strong> atau <strong>Admin Kantor</strong>.
        </p>
      </div>
    </div>
  );
}
