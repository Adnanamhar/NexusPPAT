/**
 * Modul 4 PKPL - Unit Testing Fitur #2: Register Klien Baru (RQ-002)
 * Target: validateRegistrationInput (10 Statements, 4 Decisions, 8 Branches)
 * Pattern: Arrange - Act - Assert (AAA)
 */

import { describe, it, expect } from "vitest";
import { validateRegistrationInput } from "@/lib/validators/register-validator";

describe("Fitur #2: validateRegistrationInput (Register Klien Baru)", () => {
  // TC-01: Registrasi berhasil dengan data lengkap dan valid
  it("TC-01 [Positif]: memvalidasi pendaftaran dengan NIK 16 digit dan kredensial valid", () => {
    // Arrange: Data lengkap standar WNI cakap hukum
    const payload = {
      fullName: "Adnan Amhar",
      email: "adnan.amhar@gmail.com",
      nik: "3171234567890001", // Tepat 16 digit numerik
      password: "StrongPassword2026#",
    };

    // Act
    const result = validateRegistrationInput(payload);

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.sanitizedData?.nik).toBe("3171234567890001");
    expect(result.sanitizedData?.fullName).toBe("Adnan Amhar");
    expect(result.errorMessage).toBeUndefined();
  });

  // TC-02: NIK kurang dari 16 digit (15 digit)
  it("TC-02 [Negatif/BVA Min-]: menolak NIK yang kurang dari 16 digit", () => {
    // Arrange: 15 digit
    const payload = {
      fullName: "Adnan Amhar",
      email: "adnan@gmail.com",
      nik: "317123456789000",
      password: "StrongPassword2026#",
    };

    // Act
    const result = validateRegistrationInput(payload);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("NIK wajib 16 digit angka numerik");
  });

  // TC-03: NIK lebih dari 16 digit (17 digit)
  it("TC-03 [Negatif/BVA Max+]: menolak NIK yang melebihi 16 digit", () => {
    // Arrange: 17 digit
    const payload = {
      fullName: "Adnan Amhar",
      email: "adnan@gmail.com",
      nik: "31712345678900012",
      password: "StrongPassword2026#",
    };

    // Act
    const result = validateRegistrationInput(payload);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("NIK wajib 16 digit angka numerik");
  });

  // TC-04: NIK mengandung karakter alfabet (non-numerik)
  it("TC-04 [Negatif/EP]: menolak NIK yang mengandung huruf atau simbol", () => {
    // Arrange: 16 karakter namun ada huruf
    const payload = {
      fullName: "Adnan Amhar",
      email: "adnan@gmail.com",
      nik: "31712345ABCD0001",
      password: "StrongPassword2026#",
    };

    // Act
    const result = validateRegistrationInput(payload);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("NIK wajib 16 digit angka numerik");
  });

  // TC-05: Nama lengkap terlalu pendek (< 3 karakter)
  it("TC-05 [Negatif]: menolak nama pemohon yang kurang dari 3 karakter", () => {
    // Arrange: Nama hanya 2 karakter
    const payload = {
      fullName: "Ad",
      email: "adnan@gmail.com",
      nik: "3171234567890001",
      password: "StrongPassword2026#",
    };

    // Act
    const result = validateRegistrationInput(payload);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Nama lengkap minimal 3 karakter");
  });

  // TC-06: Format email tidak valid
  it("TC-06 [Negatif]: menolak pendaftaran jika email tidak memiliki format baku", () => {
    // Arrange: Format email cacat
    const payload = {
      fullName: "Adnan Amhar",
      email: "adnan.amhar.gmail",
      nik: "3171234567890001",
      password: "StrongPassword2026#",
    };

    // Act
    const result = validateRegistrationInput(payload);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Format email tidak valid");
  });

  // TC-07: Kata sandi terlalu pendek (< 8 karakter)
  it("TC-07 [Negatif]: menolak kata sandi di luar jangkauan 8-32 karakter", () => {
    // Arrange: Password 5 karakter
    const payload = {
      fullName: "Adnan Amhar",
      email: "adnan@gmail.com",
      nik: "3171234567890001",
      password: "12345",
    };

    // Act
    const result = validateRegistrationInput(payload);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Password harus berukuran 8-32 karakter");
  });
});
