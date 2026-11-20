/**
 * Modul 4 PKPL - Feature #3: Reset Password Klien (RQ-003 / FS-001)
 * Target Implementasi TEST DOUBLE: MOCK
 * Memvalidasi permintaan reset kata sandi dan mengisolasi pengecekan database via dependency injection.
 */

export interface ResetPasswordResult {
  isSuccess: boolean;
  statusMessage: string;
  resetToken?: string;
}

export type AccountLookupFunction = (email: string) => Promise<boolean> | boolean;

export async function processResetPasswordRequest(
  email: string,
  accountLookup: AccountLookupFunction
): Promise<ResetPasswordResult> {
  // S1: Sanitasi dan normalisasi email
  const sanitizedEmail = (email || "").trim().toLowerCase();

  // S2: Keputusan 1 - Validasi string email kosong
  if (!sanitizedEmail) {
    // S3: Return penolakan input kosong
    return { isSuccess: false, statusMessage: "Email wajib diisi" };
  }

  // S4: Keputusan 2 - Validasi format sintaks email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    // S5: Return penolakan format email tidak valid
    return { isSuccess: false, statusMessage: "Format email tidak valid" };
  }

  // S6: Panggil dependensi eksternal (Account Lookup) untuk memeriksa keberadaan akun
  const accountExists = await accountLookup(sanitizedEmail);

  // S7: Keputusan 3 - Evaluasi status akun dari hasil lookup
  if (!accountExists) {
    // S8: Return akun tidak ditemukan di basis data notaris
    return { isSuccess: false, statusMessage: "Email tidak terdaftar dalam sistem" };
  }

  // S9: Akun valid, buat token simulasi reset dan kirim tautan
  const resetToken = `rst-${Buffer.from(sanitizedEmail).toString("hex").slice(0, 12)}`;

  // S10: Kembalikan respons berhasil
  return {
    isSuccess: true,
    statusMessage: "Tautan reset kata sandi berhasil dikirim ke email",
    resetToken,
  };
}
