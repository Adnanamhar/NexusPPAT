"use client";

import React, { useState } from "react";
import { ModuleGuide } from "@/lib/guides";
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb, CheckCircle2, Sparkles } from "lucide-react";

interface FeatureGuideProps {
  guide: ModuleGuide;
  defaultOpen?: boolean;
}

export function FeatureGuide({ guide, defaultOpen = false }: FeatureGuideProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full bg-blue-50/70 dark:bg-[#0c1830] border border-blue-200/90 dark:border-blue-500/30 rounded-2xl p-4 md:p-5 transition-all text-slate-800 dark:text-slate-200 shadow-2xs">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-xs">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
              <span>{guide.title}</span>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full">
                Panduan
              </span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
              {guide.summary}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline px-2 py-1 rounded-lg"
        >
          <span>{isOpen ? "Tutup Panduan" : "Lihat Petunjuk"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-blue-200/70 dark:border-blue-500/20 space-y-4 animate-fade-in">
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {guide.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {guide.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/90 dark:bg-[#070e1c] border border-blue-100 dark:border-slate-800 shadow-2xs"
              >
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{step.title}</span>
                </h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {guide.tips && guide.tips.length > 0 && (
            <div className="p-3 bg-amber-50/80 dark:bg-[#1a1608] border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-[11px] text-amber-900 dark:text-amber-200">
                <span className="font-bold">Tips Operasional Notaris:</span>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800 dark:text-amber-300/90">
                  {guide.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
