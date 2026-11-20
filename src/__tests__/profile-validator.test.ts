/**
 * Modul 4 PKPL - Unit Testing Fitur #8: Manajemen Profil & Auto-Fill (RQ-008)
 * Target: validateLegalAge & autoFillPartyFromProfile
 * Pattern: Arrange - Act - Assert (AAA)
 */

import { describe, it, expect } from "vitest";
import {
  validateLegalAge,
  autoFillPartyFromProfile,
} from "@/lib/validators/profile-validator";
import { ClientProfileData } from "@/types";

describe("Fitur #8: validateLegalAge & autoFillPartyFromProfile (Profil & Auto-Fill)", () => {
  // Tanggal acuan simulasi: 2026-01-01
  const refDate = new Date("2026-01-01");

  // TC-01: Usia nominal 35 tahun
  it("TC-01 [Positif/Nominal]: memvalidasi pemohon berusia 35 tahun cakap hukum", () => {
    // Arrange: Lahir 1991-01-01 -> usia 35 tahun pada 2026
    const birthDate = "1991-01-01";

    // Act
    const result = validateLegalAge(birthDate, refDate);

    // Assert
    expect(result.isLegallyCapable).toBe(true);
    expect(result.calculatedAge).toBe(35);
    expect(result.statusMessage).toContain("Pemohon cakap hukum");
  });

  // TC-02: Usia 20 tahun (BVA Min-)
  it("TC-02 [Negatif/BVA Min-]: menolak pemohon berusia 20 tahun (di bawah umur)", () => {
    // Arrange: Lahir 2006-01-01 -> usia 20 tahun
    const birthDate = "2006-01-01";

    // Act
    const result = validateLegalAge(birthDate, refDate);

    // Assert
    expect(result.isLegallyCapable).toBe(false);
    expect(result.calculatedAge).toBe(20);
    expect(result.statusMessage).toContain("Pemohon belum cakap hukum");
  });

  // TC-03: Boundary tepat 21 tahun (BVA Min)
  it("TC-03 [Boundary/BVA Min]: menerima pemohon tepat berusia 21 tahun", () => {
    // Arrange: Lahir 2005-01-01 -> tepat 21 tahun
    const birthDate = "2005-01-01";

    // Act
    const result = validateLegalAge(birthDate, refDate);

    // Assert
    expect(result.isLegallyCapable).toBe(true);
    expect(result.calculatedAge).toBe(21);
  });

  // TC-04: Boundary tepat 100 tahun (BVA Max)
  it("TC-04 [Boundary/BVA Max]: menerima pemohon tepat berusia 100 tahun", () => {
    // Arrange: Lahir 1926-01-01 -> tepat 100 tahun
    const birthDate = "1926-01-01";

    // Act
    const result = validateLegalAge(birthDate, refDate);

    // Assert
    expect(result.isLegallyCapable).toBe(true);
    expect(result.calculatedAge).toBe(100);
  });

  // TC-05: Usia 101 tahun (BVA Max+)
  it("TC-05 [Negatif/BVA Max+]: menolak pemohon berusia lebih dari 100 tahun", () => {
    // Arrange: Lahir 1924-01-01 -> usia 102 tahun
    const birthDate = "1924-01-01";

    // Act
    const result = validateLegalAge(birthDate, refDate);

    // Assert
    expect(result.isLegallyCapable).toBe(false);
    expect(result.statusMessage).toContain("melebihi batas maksimal");
  });

  // TC-06: Format tanggal salah
  it("TC-06 [Negatif]: menolak string tanggal lahir yang tidak valid", () => {
    // Arrange
    const birthDate = "not-a-valid-date";

    // Act
    const result = validateLegalAge(birthDate, refDate);

    // Assert
    expect(result.isLegallyCapable).toBe(false);
    expect(result.statusMessage).toBe("Format tanggal lahir tidak valid");
  });

  // TC-07: Auto-fill profil berhasil
  it("TC-07 [Auto-Fill/Positif]: berhasil memetakan profil klien lengkap ke formulir pihak akta", () => {
    // Arrange: Data profil klien lengkap
    const profile: Partial<ClientProfileData> = {
      fullName: "Budi Santoso",
      nik: "3171234567890001",
      registeredAddress: "Jl. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan",
      phone: "081299881122",
      email: "budi.santoso@gmail.com",
      npwp: "01.234.567.8-012.000",
      ktpUrl: "https://example.com/ktp.jpg",
    };

    // Act
    const result = autoFillPartyFromProfile(profile);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.partyData?.fullName).toBe("Budi Santoso");
    expect(result.partyData?.nik).toBe("3171234567890001");
    expect(result.partyData?.registeredAddress).toContain("Sudirman");
    expect(result.partyData?.verificationStatus).toBe("verified_manual");
  });

  // TC-08: Auto-fill ditolak jika data primer (NIK atau alamat) tidak lengkap
  it("TC-08 [Auto-Fill/Negatif]: menolak auto-fill jika NIK bukan 16 digit atau alamat kosong", () => {
    // Arrange: Profil tanpa NIK 16 digit dan nama kosong
    const incompleteProfile: Partial<ClientProfileData> = {
      fullName: "   ",
      nik: "12345", // Cacat
      registeredAddress: "  ",
    };

    // Act
    const result = autoFillPartyFromProfile(incompleteProfile);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.missingFields).toContain("fullName");
    expect(result.missingFields).toContain("nik");
    expect(result.missingFields).toContain("registeredAddress");
  });

  // TC-09: Ulang tahun belum lewat dalam tahun berjalan
  it("TC-09 [Kalkulasi Usia]: mengurangi usia 1 tahun jika tanggal lahir belum tiba di tahun berjalan", () => {
    // Arrange: Lahir 2000-08-20, acuan 2026-01-01 -> usia 25 (bukan 26)
    const birthDate = "2000-08-20";

    // Act
    const result = validateLegalAge(birthDate, refDate);

    // Assert
    expect(result.isLegallyCapable).toBe(true);
    expect(result.calculatedAge).toBe(25);
  });
});
