"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { FolderOpen, FileText, Users, CreditCard, BarChart3, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: "folder" | "file" | "users" | "payment" | "chart" | "help";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

const iconMap = {
  folder: FolderOpen,
  file: FileText,
  users: Users,
  payment: CreditCard,
  chart: BarChart3,
  help: HelpCircle,
};

export function EmptyState({
  icon = "folder",
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in",
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#0e1932] border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-slate-400 dark:text-slate-500" />
      </div>

      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && (onAction || actionHref) && (
        <div className="mt-5">
          {actionHref ? (
            <a href={actionHref}>
              <Button variant="glow" size="sm">
                {actionLabel}
              </Button>
            </a>
          ) : (
            <Button variant="glow" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
