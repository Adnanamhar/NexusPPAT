import { createClient } from "./client";
import { LegalDocument, ClientItem, PaymentItem, ActivityItem, UserProfile } from "@/types";

const supabase = createClient();

// ==============================================================================
// 1. DOCUMENTS CRUD
// ==============================================================================

export async function fetchDocumentsFromDB(): Promise<LegalDocument[] | null> {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select(`
        *,
        checklist:document_checklists(*),
        workflow:document_workflows(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchDocuments note:", error.message);
      return null;
    }

    if (!data) return [];

    // Map snake_case DB columns to camelCase LegalDocument
    return data.map((doc: any) => ({
      id: doc.id,
      clientUserId: doc.client_user_id,
      refNumber: doc.ref_number,
      title: doc.title,
      docType: doc.doc_type,
      docTypeLabel: doc.doc_type_label,
      status: doc.status,
      statusLabel: doc.status_label,
      currentStep: doc.current_step || 1,
      seller: {
        fullName: doc.seller_name,
        nik: doc.seller_nik,
        registeredAddress: doc.seller_address,
        phone: doc.seller_phone,
        email: doc.seller_email,
        ktpUrl: doc.seller_ktp_url,
        ktpFileName: doc.seller_ktp_filename,
        verificationStatus: doc.seller_verification_status || "pending",
        verificationNotes: doc.seller_verification_notes,
      },
      buyer: {
        fullName: doc.buyer_name,
        nik: doc.buyer_nik,
        registeredAddress: doc.buyer_address,
        phone: doc.buyer_phone,
        email: doc.buyer_email,
        ktpUrl: doc.buyer_ktp_url,
        ktpFileName: doc.buyer_ktp_filename,
        verificationStatus: doc.buyer_verification_status || "pending",
        verificationNotes: doc.buyer_verification_notes,
      },
      property: {
        certificateType: doc.property_cert_type || "Hak Milik (SHM)",
        certificateNumber: doc.property_cert_number || "",
        nib: doc.property_nib,
        landArea: Number(doc.property_land_area) || 0,
        buildingArea: Number(doc.property_building_area) || 0,
        location: doc.property_location || "",
        city: doc.property_city || "",
        province: doc.property_province || "",
        transactionPrice: Number(doc.property_transaction_price) || 0,
        njopPrice: Number(doc.property_njop_price) || 0,
        pbbYear: doc.property_pbb_year || "2026",
        pbbStatus: doc.property_pbb_status || "Lunas",
        certificateUrl: doc.property_cert_url,
      },
      agreement: {
        agreementDate: doc.agreement_date || new Date().toISOString().split("T")[0],
        paymentMethod: doc.agreement_payment_method || "Escrow / Rekening Penampung Notaris",
        bankName: doc.agreement_bank_name,
        downPayment: Number(doc.agreement_down_payment) || 0,
        witness1Name: doc.agreement_witness1,
        witness2Name: doc.agreement_witness2,
        specialClauses: doc.agreement_special_clauses,
        sspSellerTaxStatus: doc.agreement_ssp_seller || "Belum Disetor",
        sspdBuyerTaxStatus: doc.agreement_sspd_buyer || "Lunas",
      },
      checklist: Array.isArray(doc.checklist)
        ? doc.checklist.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            status: c.status,
            actionLabel: c.action_label,
            actionType: c.action_type,
            verifiedAt: c.verified_at,
            verifiedBy: c.verified_by,
          }))
        : [],
      workflow: Array.isArray(doc.workflow)
        ? doc.workflow.map((w: any) => ({
            id: w.step_number || w.id,
            title: w.title,
            description: w.description,
            status: w.status,
            completedAt: w.completed_at,
          }))
        : [],
      internalNotes: doc.internal_notes,
      billingStatus: doc.billing_status || "Unpaid",
      billingAmount: Number(doc.billing_amount) || 0,
      dueDate: doc.due_date || new Date().toISOString().split("T")[0],
      isEncrypted: doc.is_encrypted !== false,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
    }));
  } catch (err) {
    console.error("fetchDocumentsFromDB error:", err);
    return null;
  }
}

export async function insertDocumentToDB(doc: LegalDocument): Promise<boolean> {
  try {
    const { data: insertedDoc, error: docError } = await supabase
      .from("documents")
      .insert({
        client_user_id: doc.clientUserId || null,
        ref_number: doc.refNumber,
        title: doc.title,
        doc_type: doc.docType,
        doc_type_label: doc.docTypeLabel,
        status: doc.status,
        status_label: doc.statusLabel,
        current_step: doc.currentStep,
        seller_name: doc.seller.fullName,
        seller_nik: doc.seller.nik,
        seller_address: doc.seller.registeredAddress,
        seller_phone: doc.seller.phone,
        seller_email: doc.seller.email,
        seller_ktp_url: doc.seller.ktpUrl,
        seller_ktp_filename: doc.seller.ktpFileName,
        seller_verification_status: doc.seller.verificationStatus,
        buyer_name: doc.buyer.fullName,
        buyer_nik: doc.buyer.nik,
        buyer_address: doc.buyer.registeredAddress,
        buyer_phone: doc.buyer.phone,
        buyer_email: doc.buyer.email,
        buyer_ktp_url: doc.buyer.ktpUrl,
        buyer_ktp_filename: doc.buyer.ktpFileName,
        buyer_verification_status: doc.buyer.verificationStatus,
        property_cert_type: doc.property.certificateType,
        property_cert_number: doc.property.certificateNumber,
        property_nib: doc.property.nib,
        property_land_area: doc.property.landArea,
        property_building_area: doc.property.buildingArea,
        property_location: doc.property.location,
        property_city: doc.property.city,
        property_province: doc.property.province,
        property_transaction_price: doc.property.transactionPrice,
        property_njop_price: doc.property.njopPrice,
        property_pbb_year: doc.property.pbbYear,
        property_pbb_status: doc.property.pbbStatus,
        property_cert_url: doc.property.certificateUrl,
        agreement_date: doc.agreement.agreementDate,
        agreement_payment_method: doc.agreement.paymentMethod,
        agreement_bank_name: doc.agreement.bankName,
        agreement_down_payment: doc.agreement.downPayment,
        agreement_witness1: doc.agreement.witness1Name,
        agreement_witness2: doc.agreement.witness2Name,
        agreement_special_clauses: doc.agreement.specialClauses,
        agreement_ssp_seller: doc.agreement.sspSellerTaxStatus,
        agreement_sspd_buyer: doc.agreement.sspdBuyerTaxStatus,
        internal_notes: doc.internalNotes,
        billing_status: doc.billingStatus,
        billing_amount: doc.billingAmount,
        due_date: doc.dueDate,
        is_encrypted: doc.isEncrypted,
      })
      .select()
      .single();

    if (docError) {
      console.warn("insertDocumentToDB error:", docError.message);
      return false;
    }

    // Insert Checklists
    if (doc.checklist && doc.checklist.length > 0 && insertedDoc) {
      await supabase.from("document_checklists").insert(
        doc.checklist.map((c) => ({
          document_id: insertedDoc.id,
          title: c.title,
          description: c.description,
          status: c.status,
          action_label: c.actionLabel,
          action_type: c.actionType,
        }))
      );
    }

    return true;
  } catch (err) {
    console.error("insertDocumentToDB exception:", err);
    return false;
  }
}

// ==============================================================================
// 2. CLIENTS CRUD
// ==============================================================================

export async function fetchClientsFromDB(): Promise<ClientItem[] | null> {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("fetchClientsFromDB note:", error.message);
      return null;
    }

    if (!data) return [];

    return data.map((c: any) => ({
      id: c.id,
      fullName: c.full_name,
      type: c.type,
      nikOrNpwp: c.nik_or_npwp,
      email: c.email || "-",
      phone: c.phone || "-",
      address: c.address || "-",
      totalDocuments: 1,
      activeDocuments: 1,
      lastActive: "Hari ini",
      status: c.status || "Aktif",
    }));
  } catch (err) {
    return null;
  }
}

export async function insertClientToDB(client: ClientItem): Promise<boolean> {
  try {
    const { error } = await supabase.from("clients").insert({
      full_name: client.fullName,
      type: client.type,
      nik_or_npwp: client.nikOrNpwp,
      email: client.email,
      phone: client.phone,
      address: client.address,
      status: client.status,
    });

    if (error) {
      console.warn("insertClientToDB error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

// ==============================================================================
// 3. PAYMENTS / INVOICES CRUD
// ==============================================================================

export async function fetchPaymentsFromDB(): Promise<PaymentItem[] | null> {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return null;
    if (!data) return [];

    return data.map((p: any) => ({
      id: p.id,
      invoiceNumber: p.invoice_number,
      documentRef: p.document_ref,
      documentTitle: p.document_title,
      clientName: p.client_name,
      amount: Number(p.amount) || 0,
      status: p.status,
      dueDate: p.due_date,
      paidAt: p.paid_at,
      paymentMethod: p.payment_method,
    }));
  } catch (err) {
    return null;
  }
}

export async function insertPaymentToDB(payment: PaymentItem): Promise<boolean> {
  try {
    const { error } = await supabase.from("payments").insert({
      invoice_number: payment.invoiceNumber,
      document_ref: payment.documentRef,
      document_title: payment.documentTitle,
      client_name: payment.clientName,
      amount: payment.amount,
      status: payment.status,
      due_date: payment.dueDate,
      paid_at: payment.paidAt,
      payment_method: payment.paymentMethod,
    });

    return !error;
  } catch (err) {
    return false;
  }
}

// ==============================================================================
// 4. ACTIVITIES AUDIT TRAIL CRUD
// ==============================================================================

export async function fetchActivitiesFromDB(): Promise<ActivityItem[] | null> {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return null;
    if (!data) return [];

    return data.map((a: any) => ({
      id: a.id,
      actorName: a.actor_name,
      actorRole: a.actor_role,
      action: a.action,
      targetRef: a.target_ref,
      targetTitle: a.target_title,
      timestamp: a.timestamp || "Baru saja",
      type: a.type,
    }));
  } catch (err) {
    return null;
  }
}

export async function insertActivityToDB(act: ActivityItem): Promise<boolean> {
  try {
    const { error } = await supabase.from("activities").insert({
      actor_name: act.actorName,
      actor_role: act.actorRole,
      action: act.action,
      target_ref: act.targetRef,
      target_title: act.targetTitle,
      timestamp: act.timestamp,
      type: act.type,
    });

    return !error;
  } catch (err) {
    return false;
  }
}

// ==============================================================================
// 5. STORAGE FILE UPLOAD
// ==============================================================================

export async function uploadFileToSupabase(file: File, folder: string = "uploads"): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("legal-documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.warn("Storage upload note:", error.message);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from("legal-documents")
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  } catch (err) {
    console.error("uploadFileToSupabase exception:", err);
    return null;
  }
}
