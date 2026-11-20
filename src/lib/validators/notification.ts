/**
 * Modul 4 PKPL - Feature #7: Notifikasi Bel Real-Time (RQ-007 / FS-005)
 * Format badge counter lonceng notifikasi (0 s/d 99+) dan validasi pembuatan item notifikasi notaris.
 */

import { NotificationType } from "@/types";

export interface NotificationBadgeState {
  showBadge: boolean;
  displayText: string;
  isOverflow: boolean;
}

export interface CreateNotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}

export interface NotificationPayloadValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export function formatNotificationBadge(unreadCount: number): NotificationBadgeState {
  // S1: Normalisasi nilai counter (jika negatif atau bukan angka, set ke 0)
  const normalizedCount = isNaN(unreadCount) || unreadCount < 0 ? 0 : Math.floor(unreadCount);

  // S2: Keputusan 1 - Evaluasi counter 0 (tidak ada notifikasi baru / lonceng bersih)
  if (normalizedCount === 0) {
    // S3: Sembunyikan badge
    return { showBadge: false, displayText: "", isOverflow: false };
  }

  // S4: Keputusan 2 - Evaluasi ambang batas tampilan 2 digit (1 s/d 99)
  if (normalizedCount <= 99) {
    // S5: Tampilkan angka asli
    return { showBadge: true, displayText: String(normalizedCount), isOverflow: false };
  }

  // S6: Counter melebihi 99 (kondisi overflow notifikasi)
  return { showBadge: true, displayText: "99+", isOverflow: true };
}

export function validateNotificationPayload(
  payload: CreateNotificationPayload
): NotificationPayloadValidationResult {
  // S7: Keputusan 3 - Validasi keberadaan userId tujuan
  if (!payload.userId || !payload.userId.trim()) {
    return { isValid: false, errorMessage: "User ID tujuan notifikasi wajib diisi" };
  }

  // S8: Keputusan 4 - Validasi kelengkapan judul dan pesan notifikasi
  if (!payload.title || !payload.title.trim() || !payload.message || !payload.message.trim()) {
    // S9: Return penolakan pesan kosong
    return { isValid: false, errorMessage: "Judul dan pesan notifikasi wajib diisi" };
  }

  // S10: Payload notifikasi sah
  return { isValid: true };
}
