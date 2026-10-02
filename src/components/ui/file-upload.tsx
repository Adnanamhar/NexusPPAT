"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { UploadCloud, CheckCircle2, File, X } from "lucide-react";
import { toast } from "sonner";

export interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  value?: string;
  fileName?: string;
  onChange?: (fileUrl: string, fileName: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function FileUpload({
  label,
  accept = "image/jpeg,image/png,application/pdf",
  maxSizeMB = 5,
  value,
  fileName,
  onChange,
  onRemove,
  className,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | undefined>(fileName);

  const handleFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Ukuran file melebihi batas ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    // Simulate upload delay or integrate with Supabase Storage
    setTimeout(() => {
      const simulatedUrl = URL.createObjectURL(file);
      setUploadedFileName(file.name);
      setIsUploading(false);
      onChange?.(simulatedUrl, file.name);
      toast.success(`File "${file.name}" berhasil diunggah!`);
    }, 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFileName(undefined);
    onRemove?.();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("w-full space-y-1.5 text-left", className)}>
      {label && (
        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      {uploadedFileName || value ? (
        <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-[#0d1628] border border-blue-200 dark:border-blue-500/40 rounded-xl shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <File className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs md:max-w-md">
                {uploadedFileName || "Dokumen Terlampir"}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Berhasil diunggah & siap diverifikasi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "w-full border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center",
            "bg-slate-50/70 hover:bg-slate-100/80 dark:bg-[#091122]/60 dark:hover:bg-[#0d1830] border-slate-300 hover:border-blue-500 dark:border-[#1d2f54] dark:hover:border-blue-500/50",
            isDragging && "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01]",
            isUploading && "pointer-events-none opacity-70"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {isUploading ? "Mengunggah Dokumen..." : "Tarik & Lepas Berkas atau Klik untuk Upload"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPEG, PNG, atau PDF hingga {maxSizeMB}MB</p>
        </div>
      )}
    </div>
  );
}
