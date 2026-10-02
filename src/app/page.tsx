"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070c18] flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs transition-colors">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p>Memuat Nexus PPAT Legal Suite...</p>
      </div>
    </div>
  );
}
