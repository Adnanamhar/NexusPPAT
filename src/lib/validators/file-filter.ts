/**
 * Modul 4 PKPL - Feature #5: Pelacakan & Filter Berkas (RQ-005 / FS-003)
 * Validasi rentang tanggal filter berkas (1 - 365 hari) dan fungsi penyaringan dokumen notaris.
 */

export interface DateFilterRange {
  startDate: string; // Format ISO: YYYY-MM-DD
  endDate: string;
}

export interface DateFilterValidationResult {
  isValid: boolean;
  errorMessage?: string;
  diffDays?: number;
}

export interface DocumentItemForFilter {
  id: string;
  refNumber: string;
  status: string;
  createdAt: string;
}

export function validateDateFilterRange(
  range: DateFilterRange
): DateFilterValidationResult {
  // S1: Parse tanggal mulai dan tanggal akhir
  const start = new Date(range.startDate);
  const end = new Date(range.endDate);

  // S2: Keputusan 1 - Validasi tanggal valid (bukan NaN)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    // S3: Return penolakan format tanggal
    return { isValid: false, errorMessage: "Format tanggal tidak valid" };
  }

  // S4: Keputusan 2 - Validasi urutan kronologis (start tidak boleh melebihi end)
  if (start > end) {
    // S5: Return penolakan urutan tanggal terbalik
    return { isValid: false, errorMessage: "Tanggal mulai tidak boleh melebihi tanggal akhir" };
  }

  // S6: Hitung selisih hari
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Termasuk hari pertama

  // S7: Keputusan 3 - Validasi batas maksimum rentang filter (maksimal 365 hari / 1 tahun)
  if (diffDays > 365) {
    // S8: Return penolakan rentang melebihi 1 tahun
    return { isValid: false, errorMessage: "Rentang filter maksimal 365 hari", diffDays };
  }

  // S9: Rentang filter valid
  return { isValid: true, diffDays };
}

export function filterDocumentsByStatus(
  documents: DocumentItemForFilter[],
  targetStatus: string
): DocumentItemForFilter[] {
  // S10: Jika targetStatus kosong atau "all", kembalikan seluruh berkas
  if (!targetStatus || targetStatus.toLowerCase() === "all") {
    return [...documents];
  }

  // S11: Filter berkas sesuai status spesifik
  return documents.filter((doc) => doc.status.toLowerCase() === targetStatus.toLowerCase());
}
