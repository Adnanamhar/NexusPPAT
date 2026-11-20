/**
 * Modul 4 PKPL - Feature #1: Login Klien (RQ-001 / FS-001)
 * Validasi kredensial input login (format email dan panjang karakter password).
 */

export interface LoginValidationResult {
  isValid: boolean;
  errorMessage?: string;
  sanitizedEmail?: string;
}

export function validateLoginInput(
  email: string,
  password: string
): LoginValidationResult {
  // S1: Inisialisasi email bersih dengan pemangkasan spasi
  const trimmedEmail = email ? email.trim() : "";

  // S2: Keputusan 1 - Validasi keberadaan input email
  if (!trimmedEmail) {
    // S3: Return penolakan email kosong
    return { isValid: false, errorMessage: "Email wajib diisi" };
  }

  // S4: Keputusan 2 - Validasi format sintaks email (harus mengandung '@' dan domain valid)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    // S5: Return penolakan format email tidak valid
    return { isValid: false, errorMessage: "Format email tidak valid" };
  }

  // S6: Keputusan 3 - Validasi batas minimum panjang password (min 8 karakter)
  if (password.length < 8) {
    // S7: Return penolakan password terlalu pendek
    return { isValid: false, errorMessage: "Password minimal 8 karakter" };
  }

  // S8: Keputusan 4 - Validasi batas maksimum panjang password (max 32 karakter)
  if (password.length > 32) {
    // S9: Return penolakan password melebihi batas
    return { isValid: false, errorMessage: "Password maksimal 32 karakter" };
  }

  // S10: Seluruh validasi terpenuhi, kredensial sah untuk diproses autentikasi
  return { isValid: true, sanitizedEmail: trimmedEmail.toLowerCase() };
}
