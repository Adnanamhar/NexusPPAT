/**
 * Modul 4 PKPL - Unit Testing Fitur #6: Verifikasi Dokumen Fisik / Upload (RQ-006)
 * Target Implementasi TEST DOUBLE: SPY (vi.spyOn())
 * Pattern: Arrange - Act - Assert (AAA)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  validateAndProcessFileUpload,
  auditLogger,
  UploadPayload,
} from "@/lib/validators/file-upload";

describe("Fitur #6: validateAndProcessFileUpload (Upload Dokumen & Test Double: SPY)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // TC-01: Berkas sah (2.5 MB, PDF) dengan verifikasi SPY
  it("TC-01 [Positif/SPY]: menerima dokumen valid dan SPY memverifikasi pencatatan audit log sukses", () => {
    // Arrange: Pasang Test Double SPY pada fungsi auditLogger.logUploadEvent
    const spyAudit = vi.spyOn(auditLogger, "logUploadEvent");
    const payload: UploadPayload = {
      fileName: "KTP_Penjual_BudiSantoso.pdf",
      sizeMB: 2.5, // Nominal
      mimeType: "application/pdf",
    };

    // Act
    const result = validateAndProcessFileUpload(payload);

    // Assert: Verifikasi hasil validasi
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
    expect(result.loggedAuditId).toMatch(/^AUDIT-/);

    // Assert SPY: Verifikasi bahwa spy mencatat pemanggilan fungsi riil dengan parameter yang benar
    expect(spyAudit).toHaveBeenCalledTimes(1);
    expect(spyAudit).toHaveBeenCalledWith({
      fileName: "KTP_Penjual_BudiSantoso.pdf",
      sizeMB: 2.5,
      isApproved: true,
    });
  });

  // TC-02: Ukuran melebihi batas 5.0 MB (6.0 MB)
  it("TC-02 [Negatif/BVA Max+/SPY]: menolak berkas > 5.0 MB dan SPY memverifikasi pencatatan penolakan", () => {
    // Arrange: Pasang SPY
    const spyAudit = vi.spyOn(auditLogger, "logUploadEvent");
    const payload: UploadPayload = {
      fileName: "Sertifikat_Besar.pdf",
      sizeMB: 6.0,
      mimeType: "application/pdf",
    };

    // Act
    const result = validateAndProcessFileUpload(payload);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Ukuran berkas melebihi batas 5.0 MB");

    // Assert SPY: Verifikasi audit mencatat status isApproved: false
    expect(spyAudit).toHaveBeenCalledTimes(1);
    expect(spyAudit).toHaveBeenCalledWith({
      fileName: "Sertifikat_Besar.pdf",
      sizeMB: 6.0,
      isApproved: false,
    });
  });

  // TC-03: Ukuran di bawah batas 0.1 MB (0.05 MB)
  it("TC-03 [Negatif/BVA Min-]: menolak berkas dengan ukuran di bawah 0.1 MB", () => {
    // Arrange
    const spyAudit = vi.spyOn(auditLogger, "logUploadEvent");
    const payload: UploadPayload = {
      fileName: "Corrupted_Tiny.jpg",
      sizeMB: 0.05,
      mimeType: "image/jpeg",
    };

    // Act
    const result = validateAndProcessFileUpload(payload);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Ukuran berkas terlalu kecil (minimal 0.1 MB)");
    expect(spyAudit).toHaveBeenCalledWith({
      fileName: "Corrupted_Tiny.jpg",
      sizeMB: 0.05,
      isApproved: false,
    });
  });

  // TC-04: Format terlarang (.zip)
  it("TC-04 [Negatif/EP]: menolak format MIME yang dilarang (misal application/zip)", () => {
    // Arrange
    const spyAudit = vi.spyOn(auditLogger, "logUploadEvent");
    const payload: UploadPayload = {
      fileName: "Arsip_Keluarga.zip",
      sizeMB: 3.0,
      mimeType: "application/zip",
    };

    // Act
    const result = validateAndProcessFileUpload(payload);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Format berkas dilarang (hanya PDF, JPG, PNG)");
    expect(spyAudit).toHaveBeenCalledWith({
      fileName: "Arsip_Keluarga.zip",
      sizeMB: 3.0,
      isApproved: false,
    });
  });

  // TC-05: Boundary tepat 0.1 MB (BVA Min)
  it("TC-05 [Boundary/BVA Min]: menerima berkas tepat pada ambang minimum 0.1 MB", () => {
    // Arrange
    const spyAudit = vi.spyOn(auditLogger, "logUploadEvent");
    const payload: UploadPayload = {
      fileName: "Pas_Foto.jpg",
      sizeMB: 0.1,
      mimeType: "image/jpeg",
    };

    // Act
    const result = validateAndProcessFileUpload(payload);

    // Assert
    expect(result.isValid).toBe(true);
    expect(spyAudit).toHaveBeenCalledWith({
      fileName: "Pas_Foto.jpg",
      sizeMB: 0.1,
      isApproved: true,
    });
  });

  // TC-06: Boundary tepat 5.0 MB (BVA Max)
  it("TC-06 [Boundary/BVA Max]: menerima berkas tepat pada ambang maksimum 5.0 MB", () => {
    // Arrange
    const spyAudit = vi.spyOn(auditLogger, "logUploadEvent");
    const payload: UploadPayload = {
      fileName: "Scan_Warkah_Lengkap.pdf",
      sizeMB: 5.0,
      mimeType: "application/pdf",
    };

    // Act
    const result = validateAndProcessFileUpload(payload);

    // Assert
    expect(result.isValid).toBe(true);
    expect(spyAudit).toHaveBeenCalledWith({
      fileName: "Scan_Warkah_Lengkap.pdf",
      sizeMB: 5.0,
      isApproved: true,
    });
  });

  // TC-07: Nama file kosong
  it("TC-07 [Negatif]: menolak dokumen yang tidak memiliki nama file", () => {
    // Arrange
    const spyAudit = vi.spyOn(auditLogger, "logUploadEvent");
    const payload: UploadPayload = {
      fileName: "   ",
      sizeMB: 1.0,
      mimeType: "image/png",
    };

    // Act
    const result = validateAndProcessFileUpload(payload);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Nama file tidak boleh kosong");
  });
});
