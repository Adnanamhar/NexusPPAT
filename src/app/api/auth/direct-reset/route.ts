import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, newPassword } = body;

    if (!email || !fullName || !newPassword) {
      return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
    }

    const adminAuthClient = createAdminClient();

    // Verify user by email and full name in profiles table
    const { data: profile, error: profileError } = await adminAuthClient
      .from("profiles")
      .select("id, email, full_name")
      .eq("email", email.trim())
      .eq("full_name", fullName.trim())
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Verifikasi gagal. Pastikan Email dan Nama Lengkap yang Anda masukkan cocok dengan yang terdaftar." },
        { status: 404 }
      );
    }

    // Update password using Admin API (bypassing email links)
    const { error: updateError } = await adminAuthClient.auth.admin.updateUserById(
      profile.id,
      { password: newPassword }
    );

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Kata sandi berhasil direset." });
  } catch (error: any) {
    console.error("Direct reset error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server" }, { status: 500 });
  }
}
