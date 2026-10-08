import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "@/contexts/auth-context";
import { DocumentProvider } from "@/contexts/document-context";
import { ClientDataProvider } from "@/contexts/client-data-context";
import { NotificationProvider } from "@/contexts/notification-context";
import { Toaster } from "sonner";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Nexus PPAT — Digital Legal Suite",
  description: "Platform Manajemen Dokumen, Akta, Verifikasi Klien & Billing Kantor Notaris / PPAT Terpadu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakartaSans.variable} font-sans antialiased min-h-screen selection:bg-blue-600 selection:text-white transition-colors duration-200`}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <DocumentProvider>
                <ClientDataProvider>
                  {children}
                  <Toaster position="top-right" richColors closeButton />
                </ClientDataProvider>
              </DocumentProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
