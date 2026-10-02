export type UserRole = "notaris" | "admin" | "klien";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl?: string;
  skNumber?: string;
  phone?: string;
  officeName?: string;
}

export type DocumentType =
  | "akta_jual_beli"
  | "perjanjian_kredit"
  | "akta_pendirian_pt"
  | "surat_kuasa_membebankan_hak_tanggungan"
  | "akta_hibah"
  | "perjanjian_sewa_menyewa"
  | "akta_pembagian_hak_bersama";

export type DocumentStatus =
  | "draft"
  | "awaiting_docs"
  | "verifying"
  | "draft_review"
  | "signature_pending"
  | "bpn_processing"
  | "completed"
  | "rejected";

export interface PartyData {
  fullName: string;
  nik: string;
  registeredAddress: string;
  phone?: string;
  email?: string;
  ktpUrl?: string;
  ktpFileName?: string;
  npwp?: string;
  npwpUrl?: string;
  verificationStatus: "pending" | "verified_ai" | "verified_manual" | "rejected";
  verificationNotes?: string;
}

export interface PropertyData {
  certificateType: "Hak Milik (SHM)" | "Hak Guna Bangunan (HGB)" | "Hak Pakai" | "Hak Milik Satuan Rumah Susun (HMSRS)";
  certificateNumber: string;
  nib?: string;
  landArea: number; // in m2
  buildingArea?: number;
  location: string;
  subdistrict?: string;
  city: string;
  province: string;
  transactionPrice: number;
  njopPrice?: number;
  pbbYear?: string;
  pbbStatus?: "Lunas" | "Belum Lunas";
  certificateUrl?: string;
  pbbUrl?: string;
}

export interface AgreementData {
  agreementDate: string;
  paymentMethod: "Transfer Bank Langsung" | "Escrow / Rekening Penampung Notaris" | "Kredit Pemilikan Rumah (KPR)" | "Tunai Bertahap";
  bankName?: string;
  downPayment?: number;
  witness1Name?: string;
  witness2Name?: string;
  specialClauses?: string;
  sspSellerTaxStatus?: "Lunas" | "Belum Disetor";
  sspdBuyerTaxStatus?: "Lunas" | "Belum Disetor";
}

export interface DocumentChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "verified" | "pending" | "rejected" | "action_needed";
  actionLabel?: string;
  actionType?: "kswp" | "upload" | "verify_physical";
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
  completedAt?: string;
}

export interface LegalDocument {
  id: string;
  clientUserId?: string;
  refNumber: string; // e.g. AJB-2023-089
  title: string;
  docType: DocumentType;
  docTypeLabel: string;
  status: DocumentStatus;
  statusLabel: string;
  currentStep: number;
  seller: PartyData;
  buyer: PartyData;
  property: PropertyData;
  agreement: AgreementData;
  checklist: DocumentChecklistItem[];
  workflow: WorkflowStep[];
  internalNotes?: string;
  billingStatus: "Paid" | "Unpaid" | "Partial";
  billingAmount: number;
  dueDate: string;
  isEncrypted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientItem {
  id: string;
  fullName: string;
  type: "Individu" | "Badan Hukum";
  nikOrNpwp: string;
  email: string;
  phone: string;
  address: string;
  totalDocuments: number;
  activeDocuments: number;
  lastActive: string;
  status: "Aktif" | "Nonaktif";
}

export interface PaymentItem {
  id: string;
  invoiceNumber: string;
  documentRef: string;
  documentTitle: string;
  clientName: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Partial" | "Overdue";
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
}

export interface ActivityItem {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetRef: string;
  targetTitle: string;
  timestamp: string;
  type: "create" | "verify" | "sign" | "payment" | "system";
}

// ----------------------------------------------------
// Service Catalog & Persistence Types
// ----------------------------------------------------

export type ServiceCode =
  | "akta_jual_beli"
  | "akta_hibah"
  | "akta_tukar_menukar"
  | "hak_tanggungan"
  | "pembagian_hak_bersama"
  | "pendirian_badan_usaha"
  | "perubahan_anggaran_dasar"
  | "perjanjian_umum"
  | "perjanjian_kawin"
  | "waris"
  | "legalisasi"
  | "surat_kuasa";

export type ServiceCategory =
  | "ppat"
  | "badan_usaha"
  | "perjanjian"
  | "waris"
  | "legalisasi"
  | "kuasa";

export interface NotaryServiceInfo {
  id: string;
  code: ServiceCode;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  description: string;
  badgeText: string;
  estimatedDays: string;
  iconName: string;
  requiredFields: string[];
}

export interface ClientProfileData {
  userId: string;
  fullName: string;
  nik: string;
  registeredAddress: string;
  phone: string;
  email: string;
  npwp?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  occupation?: string;
  maritalStatus?: "Belum Menikah" | "Menikah" | "Cerai";
  spouseName?: string;
  spouseNik?: string;
  companyName?: string;
  companyNpwp?: string;
  companyAddress?: string;
  ktpUrl?: string;
  npwpUrl?: string;
  lastUpdated: string;
}

export interface ServiceRequestItem {
  id: string;
  refNumber: string;
  serviceCode: ServiceCode;
  serviceTitle: string;
  category: ServiceCategory;
  clientUserId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  formData: Record<string, any>;
  missingFields?: string[];
  status: "pending_review" | "in_progress" | "action_required" | "completed" | "cancelled";
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
}

export type ExportFormat = "pdf" | "docx" | "txt" | "json";

