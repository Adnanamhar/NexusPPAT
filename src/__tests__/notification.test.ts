/**
 * Modul 4 PKPL - Unit Testing Fitur #7: Notifikasi Bel Real-Time (RQ-007)
 * Target: formatNotificationBadge & validateNotificationPayload
 * Pattern: Arrange - Act - Assert (AAA)
 */

import { describe, it, expect } from "vitest";
import {
  formatNotificationBadge,
  validateNotificationPayload,
  CreateNotificationPayload,
} from "@/lib/validators/notification";

describe("Fitur #7: formatNotificationBadge & validateNotificationPayload (Notifikasi Bel)", () => {
  // TC-01: Counter = 0 (BVA Min / Lonceng Bersih)
  it("TC-01 [Boundary/BVA Min]: menyembunyikan badge saat unread count = 0", () => {
    // Arrange
    const unreadCount = 0;

    // Act
    const badge = formatNotificationBadge(unreadCount);

    // Assert
    expect(badge.showBadge).toBe(false);
    expect(badge.displayText).toBe("");
    expect(badge.isOverflow).toBe(false);
  });

  // TC-02: Counter = 1 (BVA Min+)
  it("TC-02 [Boundary/BVA Min+]: menampilkan badge angka 1 saat ada 1 notifikasi baru", () => {
    // Arrange
    const unreadCount = 1;

    // Act
    const badge = formatNotificationBadge(unreadCount);

    // Assert
    expect(badge.showBadge).toBe(true);
    expect(badge.displayText).toBe("1");
    expect(badge.isOverflow).toBe(false);
  });

  // TC-03: Counter = 10 (Nominal)
  it("TC-03 [Positif/Nominal]: menampilkan angka notifikasi nominal (10)", () => {
    // Arrange
    const unreadCount = 10;

    // Act
    const badge = formatNotificationBadge(unreadCount);

    // Assert
    expect(badge.showBadge).toBe(true);
    expect(badge.displayText).toBe("10");
  });

  // TC-04: Counter = 98 (BVA Max-)
  it("TC-04 [Boundary/BVA Max-]: menampilkan angka 98 mendekati ambang batas", () => {
    // Arrange
    const unreadCount = 98;

    // Act
    const badge = formatNotificationBadge(unreadCount);

    // Assert
    expect(badge.showBadge).toBe(true);
    expect(badge.displayText).toBe("98");
    expect(badge.isOverflow).toBe(false);
  });

  // TC-05: Counter = 99 (BVA Max)
  it("TC-05 [Boundary/BVA Max]: menampilkan tepat angka maksimum 99 tanpa overflow", () => {
    // Arrange
    const unreadCount = 99;

    // Act
    const badge = formatNotificationBadge(unreadCount);

    // Assert
    expect(badge.showBadge).toBe(true);
    expect(badge.displayText).toBe("99");
    expect(badge.isOverflow).toBe(false);
  });

  // TC-06: Counter = 100 dan 150 (Overflow)
  it("TC-06 [Boundary/BVA Max+/Overflow]: memformat angka di atas 99 menjadi '99+'", () => {
    // Arrange: 100 dan 150
    const badge100 = formatNotificationBadge(100);
    const badge150 = formatNotificationBadge(150);

    // Assert
    expect(badge100.showBadge).toBe(true);
    expect(badge100.displayText).toBe("99+");
    expect(badge100.isOverflow).toBe(true);

    expect(badge150.displayText).toBe("99+");
    expect(badge150.isOverflow).toBe(true);
  });

  // TC-07: Counter bernilai negatif (Robustness)
  it("TC-07 [Robustness/Negatif]: menormalkan angka negatif menjadi counter 0 (sembunyi)", () => {
    // Arrange: -5
    const badge = formatNotificationBadge(-5);

    // Assert
    expect(badge.showBadge).toBe(false);
    expect(badge.displayText).toBe("");
  });

  // TC-08: Validasi payload notifikasi berhasil
  it("TC-08 [Positif Payload]: memvalidasi payload pembuatan notifikasi yang lengkap", () => {
    // Arrange
    const payload: CreateNotificationPayload = {
      userId: "usr-klien-001",
      type: "document_status",
      title: "Verifikasi AJB Selesai",
      message: "Berkas AJB No. 2026-089 telah disetujui notaris.",
    };

    // Act
    const result = validateNotificationPayload(payload);

    // Assert
    expect(result.isValid).toBe(true);
  });

  // TC-09: Validasi payload notifikasi ditolak jika judul atau pesan kosong
  it("TC-09 [Negatif Payload]: menolak payload notifikasi tanpa pesan atau userId", () => {
    // Arrange
    const payloadTanpaPesan: CreateNotificationPayload = {
      userId: "usr-klien-001",
      type: "payment",
      title: "Tagihan Masuk",
      message: "   ",
    };
    const payloadTanpaUser: CreateNotificationPayload = {
      userId: "",
      type: "payment",
      title: "Tagihan Masuk",
      message: "Pesan ada",
    };

    // Act & Assert
    expect(validateNotificationPayload(payloadTanpaPesan).isValid).toBe(false);
    expect(validateNotificationPayload(payloadTanpaPesan).errorMessage).toBe(
      "Judul dan pesan notifikasi wajib diisi"
    );

    expect(validateNotificationPayload(payloadTanpaUser).isValid).toBe(false);
    expect(validateNotificationPayload(payloadTanpaUser).errorMessage).toBe(
      "User ID tujuan notifikasi wajib diisi"
    );
  });
});
