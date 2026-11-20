/**
 * Modul 4 PKPL - Unit Testing Fitur #1: Login Klien (RQ-001)
 * Target: validateLoginInput (10 Statements, 4 Decisions, 8 Branches)
 * Pattern: Arrange - Act - Assert (AAA)
 */

import { describe, it, expect } from "vitest";
import { validateLoginInput } from "@/lib/validators/login-validator";

describe("Fitur #1: validateLoginInput (Login Klien)", () => {
  // TC-01: Login dengan kredensial sah
  it("TC-01 [Positif]: memvalidasi email format sah dan password sesuai rentang", () => {
    // Arrange
    const email = "klien.notaris@gmail.com";
    const password = "Password123#";

    // Act
    const result = validateLoginInput(email, password);

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.sanitizedEmail).toBe("klien.notaris@gmail.com");
    expect(result.errorMessage).toBeUndefined();
  });

  // TC-02: Email kosong
  it("TC-02 [Negatif]: menolak saat email kosong atau hanya spasi", () => {
    // Arrange
    const email = "   ";
    const password = "Password123#";

    // Act
    const result = validateLoginInput(email, password);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Email wajib diisi");
  });

  // TC-03: Format email tidak valid
  it("TC-03 [Negatif]: menolak format email yang tidak memiliki domain atau karakter @", () => {
    // Arrange
    const email = "invalid-email-format";
    const password = "Password123#";

    // Act
    const result = validateLoginInput(email, password);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Format email tidak valid");
  });

  // TC-04: Password di bawah batas minimum (< 8 karakter)
  it("TC-04 [Negatif/BVA Min-]: menolak kata sandi dengan panjang kurang dari 8 karakter", () => {
    // Arrange: 7 karakter
    const email = "klien@gmail.com";
    const password = "pass123";

    // Act
    const result = validateLoginInput(email, password);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Password minimal 8 karakter");
  });

  // TC-05: Password di atas batas maksimum (> 32 karakter)
  it("TC-05 [Negatif/BVA Max+]: menolak kata sandi dengan panjang lebih dari 32 karakter", () => {
    // Arrange: 33 karakter
    const email = "klien@gmail.com";
    const password = "A".repeat(33);

    // Act
    const result = validateLoginInput(email, password);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Password maksimal 32 karakter");
  });

  // TC-06: Boundary tepat 8 karakter
  it("TC-06 [Boundary/BVA Min]: menerima kata sandi tepat 8 karakter", () => {
    // Arrange: Tepat 8 karakter
    const email = "klien@gmail.com";
    const password = "12345678";

    // Act
    const result = validateLoginInput(email, password);

    // Assert
    expect(result.isValid).toBe(true);
  });

  // TC-07: Boundary tepat 32 karakter
  it("TC-07 [Boundary/BVA Max]: menerima kata sandi tepat 32 karakter", () => {
    // Arrange: Tepat 32 karakter
    const email = "klien@gmail.com";
    const password = "A".repeat(32);

    // Act
    const result = validateLoginInput(email, password);

    // Assert
    expect(result.isValid).toBe(true);
  });

  // TC-08: Sanitasi email
  it("TC-08 [Sanitasi]: membersihkan spasi awal/akhir dan mengubah email menjadi huruf kecil", () => {
    // Arrange: Huruf kapital dan spasi luar
    const email = "  ADNAN.AMHAR@GMAIL.COM  ";
    const password = "SecurePassword2026!";

    // Act
    const result = validateLoginInput(email, password);

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.sanitizedEmail).toBe("adnan.amhar@gmail.com");
  });
});
