/**
 * Modul 4 PKPL - Feature #2: Register Klien Baru (RQ-002 / FS-001)
 * Validasi pendaftaran akun baru: Nama Lengkap, NIK (16 digit numerik), Email, dan Password.
 */

export interface RegistrationPayload {
  fullName: string;
  email: string;
  nik: string;
  password: string;
}

export interface RegistrationValidationResult {
  isValid: boolean;
  errorMessage?: string;
  sanitizedData?: {
    fullName: string;
    email: string;
    nik: string;
  };
}

export function validateRegistrationInput(
  data: RegistrationPayload
): RegistrationValidationResult {
  // S1: Inisialisasi dan pembersihan data input
  const fullNameTrimmed = (data.fullName || "").trim();
  const emailTrimmed = (data.email || "").trim().toLowerCase();
  const nikTrimmed = (data.nik || "").trim();
  const password = data.password || "";

  // S2: Keputusan 1 - Validasi Nama Lengkap minimal 3 karakter
  if (fullNameTrimmed.length < 3) {
    // S3: Return penolakan nama tidak memadai
    return { isValid: false, errorMessage: "Nama lengkap minimal 3 karakter" };
  }

  // S4: Keputusan 2 - Validasi NIK tepat 16 digit numerik standar Dukcapil
  const nikRegex = /^[0-9]{16}$/;
  if (!nikRegex.test(nikTrimmed)) {
    // S5: Return penolakan NIK tidak valid
    return { isValid: false, errorMessage: "NIK wajib 16 digit angka numerik" };
  }

  // S6: Keputusan 3 - Validasi format sintaks email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailTrimmed)) {
    // S7: Return penolakan format email
    return { isValid: false, errorMessage: "Format email tidak valid" };
  }

  // S8: Keputusan 4 - Validasi batas keamanan panjang kata sandi (8 - 32 karakter)
  if (password.length < 8 || password.length > 32) {
    // S9: Return penolakan panjang password di luar rentang
    return { isValid: false, errorMessage: "Password harus berukuran 8-32 karakter" };
  }

  // S10: Seluruh aturan validasi terpenuhi, data siap didaftarkan
  return {
    isValid: true,
    sanitizedData: {
      fullName: fullNameTrimmed,
      email: emailTrimmed,
      nik: nikTrimmed,
    },
  };
}
