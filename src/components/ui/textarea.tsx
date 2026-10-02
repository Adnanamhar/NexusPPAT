import React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full bg-white dark:bg-[#0b1426] border border-slate-300 dark:border-[#1b2b4d] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-xl px-4 py-3 transition-all duration-200 resize-y shadow-2xs",
            "focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-[#0e1930]",
            "hover:border-slate-400 dark:hover:border-[#273d6d]",
            error && "border-red-500/80 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
