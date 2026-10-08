"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { LegalDocument, ClientItem, PaymentItem, ActivityItem } from "@/types";
import {
  fetchDocumentsFromDB,
  insertDocumentToDB,
  fetchClientsFromDB,
  insertClientToDB,
  fetchPaymentsFromDB,
  insertPaymentToDB,
  fetchActivitiesFromDB,
  insertActivityToDB,
} from "@/lib/supabase/queries";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { useNotifications } from "@/contexts/notification-context";

interface DocumentContextType {
  documents: LegalDocument[];
  clients: ClientItem[];
  payments: PaymentItem[];
  activities: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  getDocumentById: (id: string) => LegalDocument | undefined;
  createDocument: (doc: Partial<LegalDocument>) => Promise<LegalDocument>;
  updateDocument: (id: string, updates: Partial<LegalDocument>) => void;
  updateChecklist: (docId: string, checkId: string, status: "verified" | "pending" | "rejected") => void;
  updateInternalNotes: (docId: string, notes: string) => void;
  generateDraftAkta: (docId: string) => void;
  rejectDocument: (docId: string, reason: string) => void;
  createClient: (client: Partial<ClientItem>) => Promise<ClientItem>;
  sendReminder: (clientName: string, docRef: string) => void;
  loadDemoData: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Demo data available on demand (not loaded by default)
function getDemoDocuments(): LegalDocument[] {
  return [
    {
      id: "demo-doc-1",
      refNumber: "AJB-2026-089",
      title: "Akta Jual Beli Tanah & Bangunan Kebayoran",
      docType: "akta_jual_beli",
      docTypeLabel: "Akta Jual Beli (AJB)",
      status: "draft_review",
      statusLabel: "Draft Review",
      currentStep: 2,
      seller: {
        fullName: "Budi Santoso",
        nik: "3171234567890001",
        registeredAddress: "Jl. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan.",
        phone: "081299881122",
        email: "budi.santoso@gmail.com",
        ktpUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
        ktpFileName: "KTP_Budi_Santoso.jpg",
        verificationStatus: "verified_ai",
        verificationNotes: "Terverifikasi AI OCR Dukcapil. NIK dan Nama 100% Cocok.",
      },
      buyer: {
        fullName: "Siti Aminah",
        nik: "3201987654320002",
        registeredAddress: "Jl. Merdeka Raya Kav. 12, Bandung, Jawa Barat.",
        phone: "081377889900",
        email: "siti.aminah@gmail.com",
        ktpUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
        ktpFileName: "KTP_Siti_Aminah.jpg",
        verificationStatus: "pending",
        verificationNotes: "Pending Manual Review.",
      },
      property: {
        certificateType: "Hak Milik (SHM)",
        certificateNumber: "SHM No. 12345",
        nib: "09.01.05.02.04561",
        landArea: 250,
        buildingArea: 180,
        location: "Kecamatan Kebayoran Baru, Jakarta Selatan",
        city: "Jakarta Selatan",
        province: "DKI Jakarta",
        transactionPrice: 5500000000,
        njopPrice: 4200000000,
        pbbYear: "2026",
        pbbStatus: "Lunas",
      },
      agreement: {
        agreementDate: "2026-08-24",
        paymentMethod: "Escrow / Rekening Penampung Notaris",
        bankName: "BCA Kantor Cabang Sudirman",
        downPayment: 1000000000,
        witness1Name: "Bambang Pamungkas, S.H.",
        witness2Name: "Dedi Setiawan",
        specialClauses: "Pengosongan rumah selambat-lambatnya 14 hari kerja setelah penandatanganan AJB.",
      },
      checklist: [
        { id: "chk-1", title: "Sertifikat Asli (SHM)", description: "Diserahkan & diverifikasi", status: "verified", verifiedAt: "12 Okt 2026", verifiedBy: "Dr. Hendrawan, S.H." },
        { id: "chk-2", title: "PBB Tahun Terakhir", description: "Lunas (2026)", status: "verified", verifiedAt: "14 Okt 2026", verifiedBy: "Amanda (Admin)" },
        { id: "chk-3", title: "NPWP Penjual", description: "Menunggu validasi KSWP", status: "action_needed", actionLabel: "Validasi Sekarang", actionType: "kswp" },
        { id: "chk-4", title: "Bukti Pembayaran SSP/SSPD", description: "Belum diunggah", status: "rejected", actionLabel: "Unggah Bukti", actionType: "upload" },
      ],
      workflow: [
        { id: 1, title: "Pengumpulan Data", description: "Selesai", status: "completed", completedAt: "2026-08-12" },
        { id: 2, title: "Verifikasi & Draft", description: "Sedang berlangsung", status: "in_progress" },
        { id: 3, title: "Penandatanganan", description: "Menunggu jadwal", status: "pending" },
        { id: 4, title: "Penyelesaian (BPN)", description: "Proses balik nama", status: "pending" },
      ],
      billingStatus: "Paid",
      billingAmount: 18500000,
      dueDate: "2026-08-24",
      isEncrypted: true,
      createdAt: "2026-08-10T09:00:00Z",
      updatedAt: "2026-08-19T11:30:00Z",
    },
  ];
}

function getDemoClients(): ClientItem[] {
  return [
    { id: "demo-cli-1", fullName: "Bpk. Budi Santoso", type: "Individu", nikOrNpwp: "3171234567890001", email: "budi.santoso@gmail.com", phone: "+62 812-9988-1122", address: "Jl. Sudirman No. 45, Jakarta Selatan", totalDocuments: 1, activeDocuments: 1, lastActive: "Hari ini", status: "Aktif" },
    { id: "demo-cli-2", fullName: "Ibu Siti Aminah", type: "Individu", nikOrNpwp: "3201987654320002", email: "siti.aminah@gmail.com", phone: "+62 813-7788-9900", address: "Jl. Merdeka Raya Kav. 12, Bandung", totalDocuments: 1, activeDocuments: 1, lastActive: "17 Agu 2026", status: "Aktif" },
  ];
}

function getDemoPayments(): PaymentItem[] {
  return [
    { id: "demo-pay-1", invoiceNumber: "INV/2026/08/001", documentRef: "AJB-2026-089", documentTitle: "AJB Tanah Kebayoran", clientName: "Bpk. Budi Santoso", amount: 18500000, status: "Paid", dueDate: "2026-08-24", paidAt: "2026-08-14 10:20 WIB", paymentMethod: "BCA Virtual Account" },
  ];
}

function getDemoActivities(): ActivityItem[] {
  return [
    { id: "demo-act-1", actorName: "Dr. Hendrawan, S.H.", actorRole: "Notaris", action: "Memverifikasi Sertifikat SHM", targetRef: "AJB-2026-089", targetTitle: "AJB Kebayoran", timestamp: "Baru saja", type: "verify" },
  ];
}

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { createNotification } = useNotifications();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync with localStorage & Supabase on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      // 1. First load from localStorage for instant offline/local persistence
      let localDocs: LegalDocument[] = [];
      try {
        const saved = localStorage.getItem("notarispro_local_documents");
        if (saved) {
          localDocs = JSON.parse(saved);
        }
      } catch (e) {
        console.warn("Failed to load local documents", e);
      }

      try {
        const [dbDocs, dbClients, dbPayments, dbActivities] = await Promise.all([
          fetchDocumentsFromDB(),
          fetchClientsFromDB(),
          fetchPaymentsFromDB(),
          fetchActivitiesFromDB(),
        ]);

        // Merge DB docs with local storage docs (avoiding duplicate IDs)
        const combinedDocs = [...(dbDocs || [])];
        for (const ld of localDocs) {
          if (!combinedDocs.some((d) => d.id === ld.id || d.refNumber === ld.refNumber)) {
            combinedDocs.push(ld);
          }
        }

        setDocuments(combinedDocs);
        if (dbClients && dbClients.length > 0) setClients(dbClients);
        if (dbPayments && dbPayments.length > 0) setPayments(dbPayments);
        if (dbActivities && dbActivities.length > 0) setActivities(dbActivities);
      } catch (err: any) {
        console.warn("Data load error:", err);
        // Fallback to local storage docs if server fetch fails
        setDocuments(localDocs);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Helper to persist documents state to localStorage
  const persistDocuments = (updatedDocs: LegalDocument[]) => {
    try {
      localStorage.setItem("notarispro_local_documents", JSON.stringify(updatedDocs));
    } catch (e) {
      console.warn("Failed to save documents to localStorage", e);
    }
  };

  const loadDemoData = useCallback(() => {
    const demoDocs = getDemoDocuments();
    setDocuments((prev) => {
      const existingIds = new Set(prev.map((d) => d.id));
      const newDemos = demoDocs.filter((d) => !existingIds.has(d.id));
      const updated = [...newDemos, ...prev];
      persistDocuments(updated);
      return updated;
    });
    setClients((prev) => [...getDemoClients(), ...prev]);
    setPayments((prev) => [...getDemoPayments(), ...prev]);
    setActivities((prev) => [...getDemoActivities(), ...prev]);
    toast.success("Data contoh berhasil dimuat!");
  }, []);

  const getDocumentById = useCallback(
    (id: string) => {
      return documents.find(
        (d) => d.id === id || d.refNumber.toLowerCase() === id.toLowerCase()
      );
    },
    [documents]
  );

  const createDocument = useCallback(
    async (newDoc: Partial<LegalDocument>): Promise<LegalDocument> => {
      const randomId = `doc-${Date.now()}`;
      const refNumber = newDoc.refNumber || `AJB-2026-${Math.floor(100 + Math.random() * 900)}`;
      const fullDoc: LegalDocument = {
        id: randomId,
        clientUserId: newDoc.clientUserId || user?.id || "demo-client-user",
        refNumber,
        title: newDoc.title || "Akta Jual Beli Baru",
        docType: newDoc.docType || "akta_jual_beli",
        docTypeLabel: newDoc.docTypeLabel || "Akta Jual Beli (AJB)",
        status: "draft_review",
        statusLabel: "Draft Review",
        currentStep: 1,
        seller: newDoc.seller || {
          fullName: "",
          nik: "",
          registeredAddress: "",
          verificationStatus: "pending",
        },
        buyer: newDoc.buyer || {
          fullName: "",
          nik: "",
          registeredAddress: "",
          verificationStatus: "pending",
        },
        property: newDoc.property || {
          certificateType: "Hak Milik (SHM)",
          certificateNumber: "",
          landArea: 0,
          location: "",
          city: "",
          province: "",
          transactionPrice: 0,
        },
        agreement: newDoc.agreement || {
          agreementDate: new Date().toISOString().split("T")[0],
          paymentMethod: "Escrow / Rekening Penampung Notaris",
        },
        checklist: [
          { id: "chk-1", title: "Sertifikat Asli (SHM)", description: "Diserahkan & diverifikasi fisik", status: "pending" },
          { id: "chk-2", title: "PBB Tahun Terakhir", description: "Pemeriksaan lunas pajak PBB", status: "pending" },
          { id: "chk-3", title: "NPWP Penjual", description: "Validasi KSWP", status: "pending", actionLabel: "Validasi", actionType: "kswp" },
          { id: "chk-4", title: "Bukti Pembayaran SSP/SSPD", description: "Pajak penghasilan & BPHTB", status: "pending", actionLabel: "Unggah", actionType: "upload" },
        ],
        workflow: [
          { id: 1, title: "Pengumpulan Data", description: "Input data para pihak", status: "completed", completedAt: "Hari ini" },
          { id: 2, title: "Verifikasi & Draft", description: "Sedang berlangsung", status: "in_progress" },
          { id: 3, title: "Penandatanganan", description: "Menunggu jadwal", status: "pending" },
          { id: 4, title: "Penyelesaian (BPN)", description: "Proses balik nama", status: "pending" },
        ],
        billingStatus: "Unpaid",
        billingAmount: 15000000,
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        isEncrypted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setDocuments((prev) => {
        const updated = [fullDoc, ...prev];
        persistDocuments(updated);
        return updated;
      });

      // Try inserting to DB asynchronously
      try {
        insertDocumentToDB(fullDoc).catch((e) => console.warn("insertDocumentToDB error:", e));
      } catch (e) {
        console.warn("insertDocumentToDB sync error:", e);
      }

      try {
        const newActivity: ActivityItem = {
          id: `act-${Date.now()}`,
          actorName: "Pejabat Notaris",
          actorRole: "Notaris",
          action: `Membuat berkas permohonan baru ${refNumber}`,
          targetRef: refNumber,
          targetTitle: fullDoc.title,
          timestamp: "Baru saja",
          type: "create",
        };
        setActivities((prev) => [newActivity, ...prev]);
        insertActivityToDB(newActivity).catch((e) => console.warn("insertActivityToDB error:", e));
      } catch (e) {
        console.warn("insertActivityToDB sync error:", e);
      }

      // Notify Client that their document has been created
      if (fullDoc.clientUserId && typeof createNotification === "function") {
        try {
          createNotification({
            userId: fullDoc.clientUserId,
            type: "document_status",
            title: "Permohonan Diterima",
            message: `Permohonan untuk ${fullDoc.title || "Akta"} telah diterima dan sedang diproses.`,
            iconName: "file-check-2",
            color: "blue",
            href: `/files/${randomId}`,
          }).catch((err) => console.warn("Notification catch:", err));
        } catch (e) {
          console.warn("createNotification sync error:", e);
        }
      }

      return fullDoc;
    },
    [user, createNotification]
  );

  const updateDocument = useCallback((id: string, updates: Partial<LegalDocument>) => {
    setDocuments((prev) => {
      const updated = prev.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      );
      persistDocuments(updated);
      return updated;
    });
  }, []);

  const updateChecklist = useCallback((docId: string, checkId: string, status: "verified" | "pending" | "rejected") => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          checklist: doc.checklist.map((c) => (c.id === checkId ? { ...c, status, verifiedAt: "Hari ini" } : c)),
        };
      })
    );
    toast.success("Status kelengkapan berkas berhasil diperbarui");
    
    // Notify Client
    const doc = documents.find(d => d.id === docId);
    if (doc?.clientUserId) {
      createNotification({
        userId: doc.clientUserId,
        type: "verification",
        title: "Pembaruan Berkas",
        message: `Status kelengkapan berkas untuk ${doc.refNumber} telah diperbarui menjadi ${status}.`,
        iconName: "shield-check",
        color: status === "verified" ? "emerald" : status === "rejected" ? "red" : "amber",
        href: `/files/${docId}`
      });
    }
  }, [documents, createNotification]);

  const updateInternalNotes = useCallback((docId: string, notes: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, internalNotes: notes } : doc))
    );
    toast.success("Catatan internal kantor berhasil disimpan");
  }, []);

  const generateDraftAkta = useCallback((docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;
    toast.success(`Draft Naskah Resmi (${doc.refNumber}) Berhasil Diterbitkan!`, {
      description: "Dokumen telah siap dicetak dan dibacakan di hadapan para pihak.",
    });

    if (doc.clientUserId) {
      createNotification({
        userId: doc.clientUserId,
        type: "document_status",
        title: "Draft Naskah Resmi Terbit",
        message: `Draft akta ${doc.refNumber} telah diterbitkan dan siap untuk ditelaah.`,
        iconName: "sparkles",
        color: "blue",
        href: `/files/${docId}`
      });
    }
  }, [documents, createNotification]);

  const rejectDocument = useCallback((docId: string, reason: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, status: "rejected", statusLabel: "Ditolak" } : doc))
    );
    toast.error(`Pengajuan ditolak. Catatan: ${reason}`);

    const doc = documents.find(d => d.id === docId);
    if (doc?.clientUserId) {
      createNotification({
        userId: doc.clientUserId,
        type: "document_status",
        title: "Pengajuan Ditolak",
        message: `Pengajuan ${doc.refNumber} ditolak: ${reason}`,
        iconName: "alert-triangle",
        color: "red",
        href: `/files/${docId}`
      });
    }
  }, [documents, createNotification]);

  const createClient = useCallback(async (newClient: Partial<ClientItem>): Promise<ClientItem> => {
    const client: ClientItem = {
      id: `cli-${Date.now()}`,
      fullName: newClient.fullName || "Klien Baru",
      type: newClient.type || "Individu",
      nikOrNpwp: newClient.nikOrNpwp || "-",
      email: newClient.email || "-",
      phone: newClient.phone || "-",
      address: newClient.address || "-",
      totalDocuments: 0,
      activeDocuments: 0,
      lastActive: "Baru saja",
      status: "Aktif",
    };
    setClients((prev) => [client, ...prev]);
    insertClientToDB(client);
    toast.success("Data klien berhasil ditambahkan!");
    return client;
  }, []);

  const sendReminder = useCallback((clientName: string, docRef: string) => {
    toast.success(`Pengingat berhasil dikirim kepada ${clientName} (${docRef})`, {
      description: "Notifikasi via WhatsApp & Email terkirim otomatis.",
    });
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        clients,
        payments,
        activities,
        isLoading,
        error,
        getDocumentById,
        createDocument,
        updateDocument,
        updateChecklist,
        updateInternalNotes,
        generateDraftAkta,
        rejectDocument,
        createClient,
        sendReminder,
        loadDemoData,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
}
