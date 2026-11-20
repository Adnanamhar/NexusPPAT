/**
 * Modul 4 PKPL - Feature #8: Manajemen Profil & Auto-Fill (RQ-008 / FS-006)
 * Validasi batas usia cakap hukum pemohon akta (21 - 100 tahun) dan pemetaan auto-fill profil ke form akta.
 */

import { ClientProfileData, PartyData } from "@/types";

export interface LegalAgeValidationResult {
  isLegallyCapable: boolean;
  calculatedAge?: number;
  statusMessage: string;
}

export interface AutoFillPartyResult {
  isSuccess: boolean;
  partyData?: PartyData;
  missingFields?: string[];
}

export function validateLegalAge(birthDateString: string, referenceDate = new Date()): LegalAgeValidationResult {
  // S1: Parse tanggal lahir
  const birthDate = new Date(birthDateString);

  // S2: Keputusan 1 - Cek tanggal sah
  if (isNaN(birthDate.getTime())) {
    // S3: Return format tanggal salah
    return { isLegallyCapable: false, statusMessage: "Format tanggal lahir tidak valid" };
  }

  // S4: Hitung selisih usia dalam tahun penuh
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }

  // S5: Keputusan 2 - Cek batas usia minimum cakap hukum notaris (< 21 tahun)
  if (age < 21) {
    // S6: Return penolakan di bawah umur
    return {
      isLegallyCapable: false,
      calculatedAge: age,
      statusMessage: "Pemohon belum cakap hukum untuk menandatangani akta (minimal 21 tahun atau telah menikah)",
    };
  }

  // S7: Keputusan 3 - Cek batas maksimum kewajaran usia manusia (> 100 tahun)
  if (age > 100) {
    // S8: Return penolakan usia melebihi batas
    return {
      isLegallyCapable: false,
      calculatedAge: age,
      statusMessage: "Usia pemohon melebihi batas maksimal administrasi kependudukan (100 tahun)",
    };
  }

  // S9: Usia cakap hukum terpenuhi secara sah
  return {
    isLegallyCapable: true,
    calculatedAge: age,
    statusMessage: "Pemohon cakap hukum secara sah bertindak dalam pembuatan akta",
  };
}

export function autoFillPartyFromProfile(profile: Partial<ClientProfileData>): AutoFillPartyResult {
  // S10: Evaluasi kelengkapan data primer wajib (fullName dan NIK 16 digit)
  const missing: string[] = [];
  if (!profile.fullName || !profile.fullName.trim()) missing.push("fullName");
  if (!profile.nik || profile.nik.trim().length !== 16) missing.push("nik");
  if (!profile.registeredAddress || !profile.registeredAddress.trim()) missing.push("registeredAddress");

  // S11: Keputusan 4 - Jika ada field wajib yang kurang, tolak auto-fill
  if (missing.length > 0) {
    return { isSuccess: false, missingFields: missing };
  }

  // S12: Petakan profil menjadi PartyData
  const party: PartyData = {
    fullName: profile.fullName!.trim(),
    nik: profile.nik!.trim(),
    registeredAddress: profile.registeredAddress!.trim(),
    phone: profile.phone?.trim() || undefined,
    email: profile.email?.trim() || undefined,
    npwp: profile.npwp?.trim() || undefined,
    ktpUrl: profile.ktpUrl || undefined,
    verificationStatus: "verified_manual",
    verificationNotes: "Data disinkronkan otomatis dari profil klien terverifikasi",
  };

  // S13: Return hasil pemetaan
  return { isSuccess: true, partyData: party };
}
