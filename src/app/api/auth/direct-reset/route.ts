import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
    }

    const adminAuthClient = createAdminClient();

    // Verify user by email in profiles table first
    let userId = null;
    const { data: profile } = await adminAuthClient
      .from("profiles")
      .select("id")
      .ilike("email", email.trim())
      .maybeSingle();

    if (profile?.id) {
      userId = profile.id;
    } else {
      // Fallback: search in auth.users directly if profile is missing
      const { data: usersData } = await adminAuthClient.auth.admin.listUsers();
      const foundUser = usersData?.users?.find(
        (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
      );
      if (foundUser) {
        userId = foundUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Verifikasi gagal. Alamat Email tidak ditemukan di sistem kami." },
        { status: 404 }
      );
    }

    // Update password using Admin API (bypassing email links)
    const { error: updateError } = await adminAuthClient.auth.admin.updateUserById(
      userId,
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
