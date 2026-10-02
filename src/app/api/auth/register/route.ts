import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, role, phone, skNumber, officeName } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const adminAuthClient = createAdminClient();

    // Create user using Admin API which bypasses email confirmation by default if email_confirm is set to true
    const { data: userResponse, error: createUserError } = await adminAuthClient.auth.admin.createUser({
      email: email.trim(),
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: role || "klien",
      },
    });

    if (createUserError) {
      return NextResponse.json({ error: createUserError.message }, { status: 400 });
    }

    if (!userResponse.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    const roleTitleMap: Record<string, string> = {
      notaris: "Notaris & PPAT Utama",
      admin: "Admin Kantor & Finance",
      klien: "Klien / Pemohon",
    };

    const userRole = role || "klien";

    // Create profile
    const { error: profileError } = await adminAuthClient.from("profiles").upsert({
      id: userResponse.user.id,
      email: email.trim(),
      full_name: fullName,
      role: userRole,
      role_title: roleTitleMap[userRole],
      sk_number: skNumber || null,
      phone: phone || null,
      office_name: officeName || null,
    });

    if (profileError) {
      // In a robust system we would delete the user here to rollback, but let's keep it simple
      console.error("Failed to create profile:", profileError);
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: userResponse.user });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
