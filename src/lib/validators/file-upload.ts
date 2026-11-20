/**
 * Modul 4 PKPL - Feature #6: Verifikasi Dokumen Fisik / Upload (RQ-006 / FS-004)
 * Target Implementasi TEST DOUBLE: SPY
 * Validasi kapasitas berkas (0.1 - 5.0 MB), format ekstensi yang diizinkan, dan pencatatan audit trail.
 */

export interface UploadPayload {
  fileName: string;
  sizeMB: number;
  mimeType: string;
}

export interface UploadValidationResult {
  isValid: boolean;
  errorMessage?: string;
  loggedAuditId?: string;
}

export const auditLogger = {
  logUploadEvent(event: { fileName: string; sizeMB: number; isApproved: boolean }): string {
    // Fungsi riil pencatatan audit log
    const eventId = `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return eventId;
  },
};

export function validateAndProcessFileUpload(
  payload: UploadPayload,
  logger = auditLogger
): UploadValidationResult {
  // S1: Ekstraksi dan sanitasi nama file
  const fileName = (payload.fileName || "").trim();

  // S2: Keputusan 1 - Validasi string nama file kosong
  if (!fileName) {
    // S3: Return penolakan nama file tidak ada
    logger.logUploadEvent({ fileName: "UNKNOWN", sizeMB: payload.sizeMB, isApproved: false });
    return { isValid: false, errorMessage: "Nama file tidak boleh kosong" };
  }

  // S4: Keputusan 2 - Validasi tipe format file (hanya JPEG, PNG, dan PDF yang sah di kantor notaris)
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedMimeTypes.includes(payload.mimeType.toLowerCase())) {
    // S5: Catat penolakan format di audit logger dan return error
    logger.logUploadEvent({ fileName, sizeMB: payload.sizeMB, isApproved: false });
    return { isValid: false, errorMessage: "Format berkas dilarang (hanya PDF, JPG, PNG)" };
  }

  // S6: Keputusan 3 - Validasi batas minimum ukuran berkas (min 0.1 MB)
  if (payload.sizeMB < 0.1) {
    // S7: Catat penolakan ukuran terlalu kecil
    logger.logUploadEvent({ fileName, sizeMB: payload.sizeMB, isApproved: false });
    return { isValid: false, errorMessage: "Ukuran berkas terlalu kecil (minimal 0.1 MB)" };
  }

  // S8: Keputusan 4 - Validasi batas maksimum kapasitas berkas (max 5.0 MB)
  if (payload.sizeMB > 5.0) {
    // S9: Catat penolakan kapasitas berlebih
    logger.logUploadEvent({ fileName, sizeMB: payload.sizeMB, isApproved: false });
    return { isValid: false, errorMessage: "Ukuran berkas melebihi batas 5.0 MB" };
  }

  // S10: Seluruh kriteria dokumen sah terpenuhi, catat event sukses ke audit trail
  const loggedAuditId = logger.logUploadEvent({ fileName, sizeMB: payload.sizeMB, isApproved: true });

  // S11: Kembalikan status dokumen valid dan siap diproses verifikasi fisik
  return { isValid: true, loggedAuditId };
}
