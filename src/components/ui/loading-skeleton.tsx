"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-slate-200/70 dark:bg-slate-800/70 rounded-lg animate-pulse",
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#0c152a] border border-slate-200/90 dark:border-[#172748] rounded-2xl p-6 space-y-4",
        className
      )}
    >
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-[#152442]">
      <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
      <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
      <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
      <td className="py-4 px-6"><Skeleton className="h-4 w-16" /></td>
      <td className="py-4 px-6"><Skeleton className="h-6 w-24 rounded-md" /></td>
      <td className="py-4 px-6 text-right"><Skeleton className="h-7 w-20 rounded-lg ml-auto" /></td>
    </tr>
  );
}

export function SkeletonPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-16">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="bg-white dark:bg-[#0c152a] border border-slate-200/90 dark:border-[#172748] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody>
              <SkeletonTableRow />
              <SkeletonTableRow />
              <SkeletonTableRow />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
