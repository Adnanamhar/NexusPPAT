/**
 * Modul 4 PKPL - Unit Testing Fitur #4: Pengajuan Layanan AJB (RQ-004)
 * Target: calculateAJBTaxAndValidation (13 Statements, 3 Decisions, 6 Branches)
 * Pattern: Arrange - Act - Assert (AAA)
 */

import { describe, it, expect } from "vitest";
import { calculateAJBTaxAndValidation } from "@/lib/ajb-tax";

describe("Fitur #4: calculateAJBTaxAndValidation (AJB Tax & Kavling)", () => {
  // TC-01: Transaksi valid, luas berbangunan, kena BPHTB penuh
  it("TC-01 [Positif]: menghitung PPh, PNBP, dan BPHTB penuh saat transaksi > 80 Juta", () => {
    // Arrange: Skenario properti luas 100m2 / 50m2 dengan transaksi Rp 150 Juta
    const landArea = 100;
    const buildingArea = 50;
    const transactionPrice = 150000000;

    // Act: Jalankan fungsi perhitungan kalkulator AJB
    const result = calculateAJBTaxAndValidation(landArea, buildingArea, transactionPrice);

    // Assert: Verifikasi status valid dan nilai pajak statuter
    // PPh Final (2.5%): 3.750.000, PNBP (1‰ + 50rb): 200.000, BPHTB 5% di atas 80jt: 3.500.000
    expect(result.isValid).toBe(true);
    expect(result.pphFinal).toBe(3750000);
    expect(result.pnbpBpn).toBe(200000);
    expect(result.bphtb).toBe(3500000);
    expect(result.totalTax).toBe(7450000);
    expect(result.statusMessage).toContain("Valid: Dikenakan PPh Final, PNBP, dan BPHTB Penuh");
  });

  // TC-02: Transaksi valid, bebas BPHTB (<= 80 Juta)
  it("TC-02 [Positif]: membebaskan BPHTB jika nilai transaksi tidak melebihi NPOPTKP 80 Juta", () => {
    // Arrange: Transaksi Rp 60 Juta di bawah batas NPOPTKP
    const landArea = 50;
    const buildingArea = 36;
    const transactionPrice = 60000000;

    // Act
    const result = calculateAJBTaxAndValidation(landArea, buildingArea, transactionPrice);

    // Assert: BPHTB harus 0
    // PPh Final: 1.500.000, PNBP: 110.000, Total: 1.610.000
    expect(result.isValid).toBe(true);
    expect(result.pphFinal).toBe(1500000);
    expect(result.pnbpBpn).toBe(110000);
    expect(result.bphtb).toBe(0);
    expect(result.totalTax).toBe(1610000);
    expect(result.statusMessage).toContain("Bebas BPHTB (NPOPTKP)");
  });

  // TC-03: Transaksi di bawah ambang batas minimum statuter (< 10 Juta)
  it("TC-03 [Negatif]: menolak transaksi dengan nilai di bawah ambang resmi Rp 10 Juta", () => {
    // Arrange: Nilai transaksi Rp 5 Juta (pelanggaran threshold)
    const landArea = 100;
    const buildingArea = 50;
    const transactionPrice = 5000000;

    // Act
    const result = calculateAJBTaxAndValidation(landArea, buildingArea, transactionPrice);

    // Assert: Ditolak dan total pajak 0
    expect(result.isValid).toBe(false);
    expect(result.totalTax).toBe(0);
    expect(result.statusMessage).toContain("Ditolak: Nilai transaksi di bawah batas minimum Rp 10 Juta");
  });

  // TC-04: Pelanggaran luas fisik kavling (LB > LT atau LT < 10)
  it("TC-04 [Negatif]: menolak pengajuan jika luas tanah di bawah 10m2 atau bangunan melebihi tanah", () => {
    // Arrange: Luas tanah hanya 5m2 (di bawah minimum 10m2) dan LB 20m2
    const landArea = 5;
    const buildingArea = 20;
    const transactionPrice = 100000000;

    // Act
    const result = calculateAJBTaxAndValidation(landArea, buildingArea, transactionPrice);

    // Assert: Ditolak karena pelanggaran spesifikasi fisik
    expect(result.isValid).toBe(false);
    expect(result.totalTax).toBe(0);
    expect(result.statusMessage).toContain("Ditolak: Pelanggaran spesifikasi luas fisik");
  });

  // TC-05: Pelanggaran nilai negatif pada luas bangunan
  it("TC-05 [Negatif]: menolak pengajuan jika luas bangunan bernilai negatif", () => {
    // Arrange: Luas bangunan -10m2
    const landArea = 100;
    const buildingArea = -10;
    const transactionPrice = 100000000;

    // Act
    const result = calculateAJBTaxAndValidation(landArea, buildingArea, transactionPrice);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.totalTax).toBe(0);
    expect(result.statusMessage).toContain("Ditolak: Pelanggaran spesifikasi luas fisik");
  });

  // TC-06: Batas tepat NPOPTKP Rp 80.000.000 (Boundary Test)
  it("TC-06 [Boundary]: tepat di ambang batas NPOPTKP 80 Juta dibebaskan dari BPHTB", () => {
    // Arrange: Tepat Rp 80 Juta
    const landArea = 80;
    const buildingArea = 45;
    const transactionPrice = 80000000;

    // Act
    const result = calculateAJBTaxAndValidation(landArea, buildingArea, transactionPrice);

    // Assert: bphtb harus 0 karena kondisi adalah transactionPrice > 80000000
    expect(result.isValid).toBe(true);
    expect(result.bphtb).toBe(0);
    expect(result.pphFinal).toBe(2000000);
    expect(result.pnbpBpn).toBe(130000);
    expect(result.totalTax).toBe(2130000);
  });
});
