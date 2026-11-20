/**
 * Modul 4 PKPL - Unit Testing Fitur #5: Pelacakan & Filter Berkas (RQ-005)
 * Target: validateDateFilterRange & filterDocumentsByStatus
 * Pattern: Arrange - Act - Assert (AAA)
 */

import { describe, it, expect } from "vitest";
import {
  validateDateFilterRange,
  filterDocumentsByStatus,
  DocumentItemForFilter,
} from "@/lib/validators/file-filter";

describe("Fitur #5: validateDateFilterRange & filterDocumentsByStatus (Filter Berkas)", () => {
  // TC-01: Rentang normal 30 hari
  it("TC-01 [Positif/Nominal]: memvalidasi rentang filter tanggal nominal (30 hari)", () => {
    // Arrange
    const range = { startDate: "2026-01-01", endDate: "2026-01-30" };

    // Act
    const result = validateDateFilterRange(range);

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.diffDays).toBe(30);
    expect(result.errorMessage).toBeUndefined();
  });

  // TC-02: Urutan tanggal terbalik
  it("TC-02 [Negatif]: menolak jika tanggal mulai lebih besar dari tanggal akhir", () => {
    // Arrange: start > end
    const range = { startDate: "2026-05-10", endDate: "2026-05-01" };

    // Act
    const result = validateDateFilterRange(range);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Tanggal mulai tidak boleh melebihi tanggal akhir");
  });

  // TC-03: Rentang melebihi 365 hari (> 1 tahun)
  it("TC-03 [Negatif/BVA Max+]: menolak rentang filter yang melebihi batas 365 hari", () => {
    // Arrange: 400 hari
    const range = { startDate: "2025-01-01", endDate: "2026-02-05" };

    // Act
    const result = validateDateFilterRange(range);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Rentang filter maksimal 365 hari");
  });

  // TC-04: Format tanggal cacat
  it("TC-04 [Negatif]: menolak string tanggal yang bukan format tanggal sah", () => {
    // Arrange
    const range = { startDate: "not-a-date", endDate: "2026-01-30" };

    // Act
    const result = validateDateFilterRange(range);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Format tanggal tidak valid");
  });

  // TC-05: Boundary tepat 1 hari (BVA Min)
  it("TC-05 [Boundary/BVA Min]: menerima rentang filter tepat 1 hari (hari yang sama)", () => {
    // Arrange: start = end
    const range = { startDate: "2026-03-15", endDate: "2026-03-15" };

    // Act
    const result = validateDateFilterRange(range);

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.diffDays).toBe(1);
  });

  // TC-06: Boundary tepat 365 hari (BVA Max)
  it("TC-06 [Boundary/BVA Max]: menerima rentang filter tepat batas maksimum 365 hari", () => {
    // Arrange: 365 hari (1 Jan 2025 - 31 Des 2025)
    const range = { startDate: "2025-01-01", endDate: "2025-12-31" };

    // Act
    const result = validateDateFilterRange(range);

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.diffDays).toBe(365);
  });

  // TC-07: Filter dokumen status tertentu
  it("TC-07 [Fungsi Filter]: menyaring daftar berkas berdasarkan status verifikasi", () => {
    // Arrange
    const sampleDocs: DocumentItemForFilter[] = [
      { id: "1", refNumber: "AJB-001", status: "draft", createdAt: "2026-01-01" },
      { id: "2", refNumber: "AJB-002", status: "verifying", createdAt: "2026-01-02" },
      { id: "3", refNumber: "AJB-003", status: "verifying", createdAt: "2026-01-03" },
      { id: "4", refNumber: "AJB-004", status: "completed", createdAt: "2026-01-04" },
    ];

    // Act
    const filtered = filterDocumentsByStatus(sampleDocs, "verifying");

    // Assert
    expect(filtered).toHaveLength(2);
    expect(filtered.every((d) => d.status === "verifying")).toBe(true);
  });

  // TC-08: Filter dokumen status 'all'
  it("TC-08 [Fungsi Filter]: mengembalikan seluruh berkas jika status 'all' atau kosong", () => {
    // Arrange
    const sampleDocs: DocumentItemForFilter[] = [
      { id: "1", refNumber: "AJB-001", status: "draft", createdAt: "2026-01-01" },
      { id: "2", refNumber: "AJB-002", status: "completed", createdAt: "2026-01-02" },
    ];

    // Act
    const resultAll = filterDocumentsByStatus(sampleDocs, "all");
    const resultEmpty = filterDocumentsByStatus(sampleDocs, "");

    // Assert
    expect(resultAll).toHaveLength(2);
    expect(resultEmpty).toHaveLength(2);
  });
});
