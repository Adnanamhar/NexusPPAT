import React from "react";
import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  number: string;
  label: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <div className={cn("w-full py-2", className)}>
      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {/* Continuous background track */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-slate-200 dark:bg-slate-800 -z-0" />
        
        {/* Active progress track */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-blue-600 dark:bg-blue-500 transition-all duration-500 -z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              onClick={() => onStepClick?.(step.id)}
              className={cn(
                "relative z-10 flex flex-col items-center group cursor-pointer transition-all",
                !onStepClick && "cursor-default"
              )}
            >
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                  isCurrent &&
                    "bg-white dark:bg-[#0d1728] border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-500/20 ring-4 ring-blue-500/10 scale-105",
                  isCompleted &&
                    "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30",
                  !isCurrent &&
                    !isCompleted &&
                    "bg-white dark:bg-[#0a1120] border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:border-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.number}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold mt-2.5 transition-colors whitespace-nowrap",
                  isCurrent && "text-blue-600 dark:text-blue-400 font-bold",
                  isCompleted && "text-slate-700 dark:text-slate-300",
                  !isCurrent && !isCompleted && "text-slate-400 dark:text-slate-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
