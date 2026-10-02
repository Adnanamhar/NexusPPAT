import React from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered" | "gradient";
}

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  const variants = {
    default: "bg-white dark:bg-[#0c152a] border border-slate-200/90 dark:border-[#172748] rounded-2xl shadow-xs dark:shadow-xl dark:shadow-black/20 text-slate-800 dark:text-slate-100 transition-colors",
    glass: "glass-panel rounded-2xl shadow-sm dark:shadow-2xl text-slate-800 dark:text-slate-100",
    bordered: "bg-slate-50/70 dark:bg-[#091122]/90 border border-slate-200 dark:border-slate-700/60 rounded-2xl",
    gradient: "bg-gradient-to-b from-slate-50 to-white dark:from-[#111e38] dark:to-[#0a1224] border border-slate-200 dark:border-[#203661] rounded-2xl",
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 border-b border-slate-100 dark:border-[#182746]/80 flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-500 dark:text-slate-400 mt-1", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-[#182746]/50 mt-4", className)} {...props}>
      {children}
    </div>
  );
}
