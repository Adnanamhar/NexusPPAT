"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProfile, UserRole } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    skNumber?: string;
    officeName?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/auth/callback"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>("klien");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  // Load session from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function loadUserSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Fetch profile from profiles table
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile && isMounted) {
            const mappedUser: UserProfile = {
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              role: profile.role as UserRole,
              roleTitle: profile.role_title,
              avatarUrl: profile.avatar_url || undefined,
              skNumber: profile.sk_number,
              phone: profile.phone,
              officeName: profile.office_name,
            };
            setUser(mappedUser);
            setRole(mappedUser.role);
            setIsAuthenticated(true);
            if (isMounted) setIsLoading(false);
            return;
          }
        }

        // Check localStorage fallback (for when Supabase tables don't exist yet)
        const savedUser = localStorage.getItem("notarispro_user");
        if (savedUser && isMounted) {
          try {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setRole(parsed.role || "klien");
            setIsAuthenticated(true);
          } catch {
            localStorage.removeItem("notarispro_user");
          }
        }
      } catch (err) {
        console.warn("Session check:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadUserSession();

    // Listen to Supabase auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session && isMounted) {
        setUser(null);
        setIsAuthenticated(false);
        setRole("klien");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!email.trim()) {
      toast.error("Alamat email wajib diisi.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Show user-friendly error messages
        if (error.message.includes("Invalid login")) {
          toast.error("Email atau password salah. Silakan coba lagi.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Email belum dikonfirmasi. Periksa inbox Anda.");
        } else {
          toast.error(error.message);
        }
        return false;
      }

      if (data.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const loggedUser: UserProfile = profile
          ? {
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              role: profile.role as UserRole,
              roleTitle: profile.role_title,
              avatarUrl: profile.avatar_url,
              skNumber: profile.sk_number,
              phone: profile.phone,
              officeName: profile.office_name,
            }
          : {
              id: data.user.id,
              email: data.user.email || email,
              fullName: data.user.user_metadata?.full_name || email.split("@")[0],
              role: (data.user.user_metadata?.role as UserRole) || "klien",
              roleTitle: "User",
            };

        setUser(loggedUser);
        setRole(loggedUser.role);
        setIsAuthenticated(true);
        localStorage.setItem("notarispro_user", JSON.stringify(loggedUser));
        toast.success(`Selamat datang, ${loggedUser.fullName}!`);
        router.push("/dashboard");
        return true;
      }

      toast.error("Terjadi kesalahan. Silakan coba lagi.");
      return false;
    } catch (err: any) {
      toast.error("Gagal terhubung ke server. Periksa koneksi internet Anda.");
      return false;
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const register = useCallback(async (formData: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    skNumber?: string;
    officeName?: string;
  }): Promise<boolean> => {
    // Validate
    if (!formData.email.trim() || !formData.fullName.trim()) {
      toast.error("Email dan nama lengkap wajib diisi.");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Format email tidak valid.");
      return false;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Email ini sudah terdaftar. Silakan login.");
        } else {
          toast.error(error.message);
        }
        return false;
      }

      const roleTitleMap: Record<UserRole, string> = {
        notaris: "Notaris & PPAT Utama",
        admin: "Admin Kantor & Finance",
        klien: "Klien / Pemohon",
      };

      const newUserProfile: UserProfile = {
        id: data?.user?.id || `usr-${Date.now()}`,
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        roleTitle: roleTitleMap[formData.role],
        phone: formData.phone,
        skNumber: formData.skNumber,
        officeName: formData.officeName,
      };

      // Insert into profiles table
      if (data?.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: formData.email,
          full_name: formData.fullName,
          role: formData.role,
          role_title: roleTitleMap[formData.role],
          sk_number: formData.skNumber,
          phone: formData.phone,
          office_name: formData.officeName,
        });
      }

      setUser(newUserProfile);
      setRole(formData.role);
      setIsAuthenticated(true);
      localStorage.setItem("notarispro_user", JSON.stringify(newUserProfile));
      toast.success("Pendaftaran berhasil! Akun Anda telah aktif.");
      router.push("/dashboard");
      return true;
    } catch (err: any) {
      toast.error("Gagal melakukan pendaftaran. Periksa koneksi internet.");
      return false;
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore sign-out errors
    }
    setUser(null);
    setRole("klien");
    setIsAuthenticated(false);
    localStorage.removeItem("notarispro_user");
    toast.info("Anda telah keluar dari sistem.");
    router.push("/login");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    if (updates.role) setRole(updates.role);
    localStorage.setItem("notarispro_user", JSON.stringify(updated));

    try {
      await supabase.from("profiles").update({
        full_name: updated.fullName,
        sk_number: updated.skNumber,
        phone: updated.phone,
        office_name: updated.officeName,
      }).eq("id", user.id);
      toast.success("Profil berhasil diperbarui!");
    } catch {
      toast.error("Gagal menyimpan profil ke server.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
