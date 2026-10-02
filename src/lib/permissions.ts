import { UserRole } from "@/types";

export type FeaturePermission =
  | "create_deed"
  | "verify_deed"
  | "generate_official_akta"
  | "digital_signature"
  | "validate_kswp"
  | "manage_clients"
  | "manage_billing"
  | "view_financial_reports"
  | "view_audit_trail"
  | "manage_sk_settings"
  | "upload_client_docs"
  | "pay_invoice";

export const ROLE_PERMISSIONS: Record<UserRole, FeaturePermission[]> = {
  notaris: [
    "create_deed",
    "verify_deed",
    "generate_official_akta",
    "digital_signature",
    "validate_kswp",
    "manage_clients",
    "manage_billing",
    "view_financial_reports",
    "view_audit_trail",
    "manage_sk_settings",
    "upload_client_docs",
    "pay_invoice",
  ],
  admin: [
    "create_deed",
    "validate_kswp",
    "manage_clients",
    "manage_billing",
    "view_financial_reports",
    "view_audit_trail",
    "upload_client_docs",
    "pay_invoice",
  ],
  klien: [
    "create_deed",
    "upload_client_docs",
    "pay_invoice",
  ],
};

export function hasPermission(role: UserRole, feature: FeaturePermission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(feature) ?? false;
}

export const ROLE_EXCLUSIVE_HIGHLIGHTS: Record<UserRole, { title: string; desc: string; icon: string }[]> = {
  notaris: [
    { title: "Pengesahan & Draft Akta Resmi", desc: "Kewenangan penuh penerbitan naskah akta otentik siap tanda tangan.", icon: "FileSignature" },
    { title: "Tanda Tangan Elektronik Bersertifikasi", desc: "Otorisasi stempel BSrE & segel digital pejabat notaris.", icon: "ShieldCheck" },
    { title: "Konfigurasi SK Pejabat & Kop Surat", desc: "Pengaturan identitas SK Kemenkumham & SK Kepala BPN RI.", icon: "Settings" },
  ],
  admin: [
    { title: "Manajemen Invoicing & Kuitansi", desc: "Penerbitan tagihan honorarium, BPHTB, PPh & cetak kuitansi resmi.", icon: "CreditCard" },
    { title: "Katalog Klien & Rekanan Bank", desc: "Database kontak para pihak, korporasi, dan developer rekanan.", icon: "Users" },
    { title: "Pengingat Otomatis Jatuh Tempo", desc: "Kirim notifikasi berkas tertunda via WhatsApp & Email.", icon: "Bell" },
  ],
  klien: [
    { title: "Pelacakan Progres Akta Transparan", desc: "Pantau alur verifikasi berkas dari pengumpulan hingga balik nama BPN.", icon: "Clock" },
    { title: "Unggah Mandiri KTP & Bukti Bayar", desc: "Kirim foto dokumen pendukung langsung dari gadget Anda.", icon: "UploadCloud" },
    { title: "Pembayaran Online Rekening Escrow", desc: "Transaksi aman terlindungi rekening penampung resmi kantor notaris.", icon: "ShieldCheck" },
  ],
};
