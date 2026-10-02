import React from "react";
import { cn } from "@/lib/cn";
import { CheckCircle2, AlertCircle, Clock, Lock, Sparkles, FileText } from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "verified-ai"
    | "pending-review"
    | "signature-pending"
    | "draft-review"
    | "awaiting-docs"
    | "encrypted"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "default", size = "md", children, ...props }: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const variants = {
    default:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
    "verified-ai":
      "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40 font-medium",
    "pending-review":
      "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40 font-medium",
    "signature-pending":
      "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/40 font-medium",
    "draft-review":
      "bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium",
    "awaiting-docs":
      "bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50 font-medium",
    encrypted:
      "bg-slate-100 dark:bg-[#0d1728] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 text-[11px] font-medium",
    success:
      "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-medium",
    warning:
      "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 font-medium",
    danger:
      "bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 font-medium",
    info:
      "bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 font-medium",
    outline:
      "bg-transparent text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-medium",
  };

  const renderIcon = () => {
    switch (variant) {
      case "verified-ai":
        return <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />;
      case "pending-review":
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />;
      case "signature-pending":
        return <Clock className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />;
      case "draft-review":
        return <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />;
      case "encrypted":
        return <Lock className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />;
      case "success":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg font-semibold tracking-wide select-none transition-all shadow-2xs",
        sizeStyles[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {renderIcon()}
      <span>{children}</span>
    </div>
  );
}
