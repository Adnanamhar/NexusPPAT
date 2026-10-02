"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ClientProfileData, ServiceRequestItem, ServiceCode, ServiceCategory } from "@/types";
import { toast } from "sonner";
import { useAuth } from "./auth-context";

interface ClientDataContextType {
  clientData: ClientProfileData | null;
  serviceRequests: ServiceRequestItem[];
  isLoading: boolean;
  saveClientData: (updates: Partial<ClientProfileData>) => void;
  createServiceRequest: (
    serviceCode: ServiceCode,
    serviceTitle: string,
    category: ServiceCategory,
    formData: Record<string, any>
  ) => Promise<ServiceRequestItem>;
  updateServiceRequest: (id: string, updates: Partial<ServiceRequestItem>) => void;
  getServiceRequestById: (id: string) => ServiceRequestItem | undefined;
}

const ClientDataContext = createContext<ClientDataContextType | undefined>(undefined);

const DEFAULT_CLIENT_DATA: ClientProfileData = {
  userId: "demo-client-user",
  fullName: "Budi Santoso",
  nik: "3171234567890001",
  registeredAddress: "Jl. Sudirman No. 45, Kebayoran Baru, Jakarta Selatan",
  phone: "081299881122",
  email: "budi.santoso@gmail.com",
  npwp: "01.234.567.8-012.000",
  placeOfBirth: "Jakarta",
  dateOfBirth: "1985-05-14",
  occupation: "Wiraswasta",
  maritalStatus: "Menikah",
  spouseName: "Siti Aminah",
  spouseNik: "3201987654320002",
  companyName: "PT Nusa Karya Jaya",
  companyNpwp: "02.345.678.9-015.000",
  companyAddress: "Kawasan Industri Pulo Gadung, Jakarta Timur",
  ktpUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
  lastUpdated: new Date().toISOString(),
};

const INITIAL_SERVICE_REQUESTS: ServiceRequestItem[] = [
  {
    id: "req-101",
    refNumber: "REQ-2026-001",
    serviceCode: "akta_jual_beli",
    serviceTitle: "Akta Jual Beli (AJB) Tanah & Bangunan",
    category: "ppat",
    clientUserId: "demo-client-user",
    clientName: "Budi Santoso",
    clientEmail: "budi.santoso@gmail.com",
    clientPhone: "081299881122",
    formData: {
      sellerName: "Budi Santoso",
      sellerNik: "3171234567890001",
      sellerAddress: "Jl. Sudirman No. 45, Jakarta Selatan",
      buyerName: "Ahmad Fauzi",
      buyerNik: "3172098765430009",
      buyerAddress: "Jl. Gatot Subroto No. 88, Jakarta Selatan",
      certificateType: "Hak Milik (SHM)",
      certificateNumber: "SHM No. 12345",
      landArea: "250",
      buildingArea: "180",
      location: "Kebayoran Baru, Jakarta Selatan",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      transactionPrice: "5500000000",
      njopPrice: "4200000000",
      agreementDate: "2026-08-25",
      paymentMethod: "Escrow / Rekening Penampung Notaris",
    },
    missingFields: ["sspSellerTaxStatus", "witness1Name"],
    status: "in_progress",
    statusLabel: "Proses Penelaahan",
    createdAt: "2026-08-18T10:00:00Z",
    updatedAt: "2026-08-19T14:20:00Z",
  },
  {
    id: "req-102",
    refNumber: "REQ-2026-002",
    serviceCode: "pendirian_badan_usaha",
    serviceTitle: "Akta Pendirian PT (Perseroan Terbatas)",
    category: "badan_usaha",
    clientUserId: "demo-client-user",
    clientName: "Budi Santoso",
    clientEmail: "budi.santoso@gmail.com",
    clientPhone: "081299881122",
    formData: {
      companyNameProposed: "PT Prima Solusi Nusantara",
      companyAddress: "Jl. HR Rasuna Said Blok X-5, Kuningan, Jakarta Selatan",
      authorizedCapital: "1000000000",
      paidUpCapital: "250000000",
      founder1Name: "Budi Santoso",
      founder1Nik: "3171234567890001",
      founder1Shares: "60",
      founder2Name: "Siti Aminah",
      founder2Nik: "3201987654320002",
      founder2Shares: "40",
      directorName: "Budi Santoso",
      commissionerName: "Siti Aminah",
      businessSector: "Jasa Teknologi Informasi & Konsultan Manajemen",
    },
    missingFields: ["skKemenkumhamNo"],
    status: "pending_review",
    statusLabel: "Menunggu Penelaahan Notaris",
    createdAt: "2026-08-20T09:15:00Z",
    updatedAt: "2026-08-20T09:15:00Z",
  },
];

export function ClientDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [clientData, setClientData] = useState<ClientProfileData | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUserId = user?.id || "demo-client-user";
    const profileKey = `notarispro_client_profile_${currentUserId}`;
    const requestsKey = `notarispro_service_requests_${currentUserId}`;

    // Load saved client profile data from localStorage
    const savedProfile = localStorage.getItem(profileKey);
    let initialData = DEFAULT_CLIENT_DATA;
    if (savedProfile) {
      try {
        initialData = JSON.parse(savedProfile);
      } catch {}
    } else {
      localStorage.setItem(profileKey, JSON.stringify(DEFAULT_CLIENT_DATA));
    }

    // Load saved service requests
    const savedRequests = localStorage.getItem(requestsKey);
    if (savedRequests) {
      try {
        setServiceRequests(JSON.parse(savedRequests));
      } catch {
        setServiceRequests(INITIAL_SERVICE_REQUESTS);
      }
    } else {
      setServiceRequests(INITIAL_SERVICE_REQUESTS);
      localStorage.setItem(requestsKey, JSON.stringify(INITIAL_SERVICE_REQUESTS));
    }

    setClientData(initialData);
    setIsLoading(false);
  }, [user?.id]);

  // Sync with real Supabase Auth user whenever it changes
  useEffect(() => {
    if (user) {
      setClientData((prev) => {
        const base = prev || DEFAULT_CLIENT_DATA;
        return {
          ...base,
          userId: user.id,
          fullName: user.fullName || base.fullName,
          nik: user.skNumber || base.nik,
          registeredAddress: user.officeName || base.registeredAddress,
          phone: user.phone || base.phone,
          email: user.email || base.email,
        };
      });
    }
  }, [user]);

  const saveClientData = useCallback((updates: Partial<ClientProfileData>) => {
    setClientData((prev) => {
      const base = prev || DEFAULT_CLIENT_DATA;
      const updated: ClientProfileData = {
        ...base,
        ...updates,
        userId: user?.id || base.userId,
        fullName: updates.fullName || user?.fullName || base.fullName,
        email: updates.email || user?.email || base.email,
        lastUpdated: new Date().toISOString(),
      };
      
      const profileKey = `notarispro_client_profile_${user?.id || "demo-client-user"}`;
      localStorage.setItem(profileKey, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const createServiceRequest = useCallback(
    async (
      serviceCode: ServiceCode,
      serviceTitle: string,
      category: ServiceCategory,
      formData: Record<string, any>
    ): Promise<ServiceRequestItem> => {
      const count = serviceRequests.length + 1;
      const refNumber = `REQ-2026-${String(count).padStart(3, "0")}`;
      const newId = `req-${Date.now()}`;

      // Automatically capture & persist core client fields for auto-fill in future
      const profileUpdates: Partial<ClientProfileData> = {};
      if (formData.fullName || formData.sellerName || formData.founder1Name) {
        profileUpdates.fullName = formData.fullName || formData.sellerName || formData.founder1Name;
      }
      if (formData.nik || formData.sellerNik || formData.founder1Nik) {
        profileUpdates.nik = formData.nik || formData.sellerNik || formData.founder1Nik;
      }
      if (formData.registeredAddress || formData.sellerAddress || formData.address) {
        profileUpdates.registeredAddress =
          formData.registeredAddress || formData.sellerAddress || formData.address;
      }
      if (formData.phone) profileUpdates.phone = formData.phone;
      if (formData.email) profileUpdates.email = formData.email;
      if (formData.npwp) profileUpdates.npwp = formData.npwp;
      if (formData.maritalStatus) profileUpdates.maritalStatus = formData.maritalStatus;
      if (formData.spouseName) profileUpdates.spouseName = formData.spouseName;
      if (formData.companyNameProposed) profileUpdates.companyName = formData.companyNameProposed;

      saveClientData(profileUpdates);

      const newRequest: ServiceRequestItem = {
        id: newId,
        refNumber,
        serviceCode,
        serviceTitle,
        category,
        clientUserId: user?.id || clientData?.userId || "demo-client-user",
        clientName: formData.fullName || formData.sellerName || clientData?.fullName || user?.fullName || "Klien Notaris",
        clientEmail: formData.email || clientData?.email || user?.email || "-",
        clientPhone: formData.phone || clientData?.phone || "-",
        formData,
        missingFields: [],
        status: "pending_review",
        statusLabel: "Baru Diajukan",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedRequests = [newRequest, ...serviceRequests];
      setServiceRequests(updatedRequests);
      
      const requestsKey = `notarispro_service_requests_${user?.id || "demo-client-user"}`;
      localStorage.setItem(requestsKey, JSON.stringify(updatedRequests));

      toast.success("Pengajuan layanan notaris berhasil terkirim!", {
        description: "Data diri Anda telah tersimpan otomatis untuk pengajuan berikutnya.",
      });

      return newRequest;
    },
    [serviceRequests, clientData, user, saveClientData]
  );

  const updateServiceRequest = useCallback((id: string, updates: Partial<ServiceRequestItem>) => {
    setServiceRequests((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      );
      
      const requestsKey = `notarispro_service_requests_${user?.id || "demo-client-user"}`;
      localStorage.setItem(requestsKey, JSON.stringify(updated));
      return updated;
    });
  }, [user]);

  const getServiceRequestById = useCallback(
    (id: string) => {
      return serviceRequests.find(
        (r) => r.id === id || r.refNumber.toLowerCase() === id.toLowerCase()
      );
    },
    [serviceRequests]
  );

  return (
    <ClientDataContext.Provider
      value={{
        clientData,
        serviceRequests,
        isLoading,
        saveClientData,
        createServiceRequest,
        updateServiceRequest,
        getServiceRequestById,
      }}
    >
      {children}
    </ClientDataContext.Provider>
  );
}

export function useClientData() {
  const context = useContext(ClientDataContext);
  if (!context) {
    throw new Error("useClientData must be used within a ClientDataProvider");
  }
  return context;
}
