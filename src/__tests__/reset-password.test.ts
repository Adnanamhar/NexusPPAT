/**
 * Modul 4 PKPL - Unit Testing Fitur #3: Reset Password Klien (RQ-003)
 * Target Implementasi TEST DOUBLE: MOCK (vi.fn())
 * Pattern: Arrange - Act - Assert (AAA)
 */

import { describe, it, expect, vi } from "vitest";
import { processResetPasswordRequest, AccountLookupFunction } from "@/lib/validators/reset-password";

describe("Fitur #3: processResetPasswordRequest (Reset Password Klien & Test Double: MOCK)", () => {
  // TC-01: Email terdaftar (MOCK mengembalikan true)
  it("TC-01 [Positif/MOCK]: memproses reset password saat email terdaftar dan memverifikasi panggilan Mock", async () => {
    // Arrange: Buat Test Double MOCK untuk fungsi lookup database
    const mockAccountLookup: AccountLookupFunction = vi.fn().mockResolvedValue(true);
    const email = "budi.santoso@gmail.com";

    // Act: Jalankan proses reset password dengan menyuntikkan Mock
    const result = await processResetPasswordRequest(email, mockAccountLookup);

    // Assert: Verifikasi output bisnis
    expect(result.isSuccess).toBe(true);
    expect(result.statusMessage).toContain("Tautan reset kata sandi berhasil dikirim");
    expect(result.resetToken).toBeDefined();

    // Assert: Verifikasi perilaku Test Double MOCK (Behavior Verification)
    expect(mockAccountLookup).toHaveBeenCalledTimes(1);
    expect(mockAccountLookup).toHaveBeenCalledWith("budi.santoso@gmail.com");
  });

  // TC-02: Email tidak terdaftar di database (MOCK mengembalikan false)
  it("TC-02 [Negatif/MOCK]: menolak permintaan jika MOCK mengindikasikan email tidak ditemukan", async () => {
    // Arrange: MOCK disetel mengembalikan false (user tidak ditemukan)
    const mockAccountLookup: AccountLookupFunction = vi.fn().mockResolvedValue(false);
    const email = "unknown.client@gmail.com";

    // Act
    const result = await processResetPasswordRequest(email, mockAccountLookup);

    // Assert: Verifikasi penolakan
    expect(result.isSuccess).toBe(false);
    expect(result.statusMessage).toBe("Email tidak terdaftar dalam sistem");
    expect(result.resetToken).toBeUndefined();

    // Assert MOCK
    expect(mockAccountLookup).toHaveBeenCalledTimes(1);
    expect(mockAccountLookup).toHaveBeenCalledWith("unknown.client@gmail.com");
  });

  // TC-03: Format email tidak valid (MOCK tidak boleh terpanggil)
  it("TC-03 [Negatif/Isolasi]: menolak email cacat tanpa memanggil MOCK database (Early Exit)", async () => {
    // Arrange
    const mockAccountLookup: AccountLookupFunction = vi.fn().mockResolvedValue(true);
    const email = "invalid-email-address";

    // Act
    const result = await processResetPasswordRequest(email, mockAccountLookup);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.statusMessage).toBe("Format email tidak valid");

    // Assert: MOCK sama sekali tidak boleh dipanggil untuk menghemat sumber daya sistem
    expect(mockAccountLookup).not.toHaveBeenCalled();
  });

  // TC-04: Email kosong (MOCK tidak boleh terpanggil)
  it("TC-04 [Negatif/Isolasi]: menolak string kosong tanpa menyentuh dependensi MOCK", async () => {
    // Arrange
    const mockAccountLookup: AccountLookupFunction = vi.fn();
    const email = "   ";

    // Act
    const result = await processResetPasswordRequest(email, mockAccountLookup);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.statusMessage).toBe("Email wajib diisi");
    expect(mockAccountLookup).not.toHaveBeenCalled();
  });
});
