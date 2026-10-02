import { NotaryServiceInfo, ServiceCode, ClientProfileData } from "@/types";

export const NOTARY_SERVICES: NotaryServiceInfo[] = [
  {
    id: "srv-1",
    code: "akta_jual_beli",
    title: "Akta Jual Beli (AJB) Tanah & Bangunan",
    category: "ppat",
    categoryLabel: "PPAT & Pertanahan",
    description: "Pembuatan akta peralihan hak atas tanah dan bangunan resmi PPAT untuk dasar balik nama di BPN.",
    badgeText: "Layanan Favorit",
    estimatedDays: "3 - 5 Hari Kerja",
    iconName: "Building2",
    requiredFields: [
      "sellerName",
      "sellerNik",
      "sellerAddress",
      "buyerName",
      "buyerNik",
      "buyerAddress",
      "certificateType",
      "certificateNumber",
      "landArea",
      "location",
      "city",
      "province",
      "transactionPrice",
      "agreementDate",
      "paymentMethod",
    ],
  },
  {
    id: "srv-2",
    code: "akta_hibah",
    title: "Akta Hibah Properti & Tanah",
    category: "ppat",
    categoryLabel: "PPAT & Pertanahan",
    description: "Peralihan hak atas tanah/bangunan secara sukarela antar anggota keluarga atau pihak terkait.",
    badgeText: "Keluarga & Waris",
    estimatedDays: "3 - 5 Hari Kerja",
    iconName: "Gift",
    requiredFields: [
      "grantorName",
      "grantorNik",
      "grantorAddress",
      "recipientName",
      "recipientNik",
      "recipientAddress",
      "relationship",
      "certificateNumber",
      "landArea",
      "location",
      "city",
    ],
  },
  {
    id: "srv-3",
    code: "akta_tukar_menukar",
    title: "Akta Tukar Menukar Hak atas Tanah",
    category: "ppat",
    categoryLabel: "PPAT & Pertanahan",
    description: "Perjanjian pertukaran sertifikat tanah atau hak properti antara dua pihak seimbang.",
    badgeText: "Properti",
    estimatedDays: "5 - 7 Hari Kerja",
    iconName: "RefreshCw",
    requiredFields: [
      "party1Name",
      "party1Nik",
      "party1CertNumber",
      "party2Name",
      "party2Nik",
      "party2CertNumber",
      "compensationAmount",
    ],
  },
  {
    id: "srv-4",
    code: "hak_tanggungan",
    title: "Akta Pemberian Hak Tanggungan (APHT) & SKMHT",
    category: "ppat",
    categoryLabel: "PPAT & Pertanahan",
    description: "Pembebanan hak tanggungan atas sertifikat tanah sebagai jaminan pelunasan hutang perbankan.",
    badgeText: "Perbankan",
    estimatedDays: "3 - 5 Hari Kerja",
    iconName: "Landmark",
    requiredFields: [
      "debtorName",
      "debtorNik",
      "creditorBank",
      "loanAmount",
      "certificateNumber",
      "landArea",
      "location",
    ],
  },
  {
    id: "srv-5",
    code: "pembagian_hak_bersama",
    title: "Akta Pembagian Hak Bersama (APHB)",
    category: "ppat",
    categoryLabel: "PPAT & Pertanahan",
    description: "Pemisahan dan pembagian sertifikat tanah milik bersama hasil warisan atau kesepakatan.",
    badgeText: "Waris & Bersama",
    estimatedDays: "5 - 7 Hari Kerja",
    iconName: "PieChart",
    requiredFields: [
      "heirNames",
      "certificateNumber",
      "landArea",
      "location",
      "portionDistribution",
    ],
  },
  {
    id: "srv-6",
    code: "pendirian_badan_usaha",
    title: "Akta Pendirian PT / CV / Yayasan",
    category: "badan_usaha",
    categoryLabel: "Pendirian Badan Usaha",
    description: "Pembuatan akta pendirian perseroan terbatas, CV, atau yayasan lengkap hingga pengesahan AHU Kemenkumham.",
    badgeText: "Bisnis & PT",
    estimatedDays: "2 - 4 Hari Kerja",
    iconName: "Briefcase",
    requiredFields: [
      "companyNameProposed",
      "companyAddress",
      "authorizedCapital",
      "paidUpCapital",
      "founder1Name",
      "founder1Nik",
      "founder1Shares",
      "founder2Name",
      "founder2Nik",
      "founder2Shares",
      "directorName",
      "commissionerName",
      "businessSector",
    ],
  },
  {
    id: "srv-7",
    code: "perubahan_anggaran_dasar",
    title: "Akta Perubahan Anggaran Dasar PT / RUPS",
    category: "badan_usaha",
    categoryLabel: "Pendirian Badan Usaha",
    description: "Perubahan susunan direksi, saham, penambahan modal, atau alamat domisili perseroan.",
    badgeText: "Korporasi",
    estimatedDays: "2 - 3 Hari Kerja",
    iconName: "FileEdit",
    requiredFields: [
      "companyName",
      "companyNpwp",
      "skKemenkumhamOld",
      "changeType",
      "newDirectorName",
      "newCapitalAmount",
    ],
  },
  {
    id: "srv-8",
    code: "perjanjian_umum",
    title: "Perjanjian Kredit / Sewa / Kerjasama Bisnis",
    category: "perjanjian",
    categoryLabel: "Perjanjian & Kontrak",
    description: "Naskah otentik perjanjian kerjasama investasi, sewa-menyewa gedung, atau hutang-piutang.",
    badgeText: "Kontrak Hukum",
    estimatedDays: "2 - 3 Hari Kerja",
    iconName: "FileCheck",
    requiredFields: [
      "party1Name",
      "party1Nik",
      "party2Name",
      "party2Nik",
      "contractSubject",
      "contractValue",
      "durationMonths",
      "agreementDate",
    ],
  },
  {
    id: "srv-9",
    code: "perjanjian_kawin",
    title: "Perjanjian Kawin (Pra-Nikah / Pisah Harta)",
    category: "perjanjian",
    categoryLabel: "Perjanjian & Kontrak",
    description: "Perjanjian pemisahan harta kekayaan sebelum atau selama perkawinan tercatat resmi.",
    badgeText: "Perkawinan",
    estimatedDays: "2 Hari Kerja",
    iconName: "HeartHandshake",
    requiredFields: [
      "husbandName",
      "husbandNik",
      "wifeName",
      "wifeNik",
      "marriageDateTarget",
      "separatedAssetDetails",
    ],
  },
  {
    id: "srv-10",
    code: "waris",
    title: "Akta Wasiat & Surat Keterangan Hak Waris",
    category: "waris",
    categoryLabel: "Keluarga & Waris",
    description: "Pernyataan wasiat resmi atau penetapan ahli waris sah sesuai hukum perdata Indonesia.",
    badgeText: "Hak Waris",
    estimatedDays: "3 - 5 Hari Kerja",
    iconName: "Scroll",
    requiredFields: [
      "testatorName",
      "testatorNik",
      "heirDetails",
      "bequeathedAssets",
    ],
  },
  {
    id: "srv-11",
    code: "legalisasi",
    title: "Legalisasi & Waarmerking Dokumen",
    category: "legalisasi",
    categoryLabel: "Legalisasi",
    description: "Pengesahan tanda tangan di hadapan notaris atau pendaftaran surat di bawah tangan.",
    badgeText: "Cepat / 1 Hari",
    estimatedDays: "1 Hari Kerja",
    iconName: "CheckSquare",
    requiredFields: [
      "applicantName",
      "applicantNik",
      "documentTitle",
      "documentPurpose",
    ],
  },
  {
    id: "srv-12",
    code: "surat_kuasa",
    title: "Surat Kuasa Notariil (Menjual / Membeli / Umum)",
    category: "kuasa",
    categoryLabel: "Surat Kuasa",
    description: "Pemberian kuasa otentik berkekuatan hukum tetap untuk bertindak atas nama orang lain.",
    badgeText: "Kuasa Sah",
    estimatedDays: "1 - 2 Hari Kerja",
    iconName: "ShieldAlert",
    requiredFields: [
      "principalName",
      "principalNik",
      "attorneyName",
      "attorneyNik",
      "authorizedAction",
    ],
  },
];

// Pre-fill helper mapping client profile data into service form inputs automatically
export function autoFillServiceForm(
  serviceCode: ServiceCode,
  client: ClientProfileData | null
): Record<string, any> {
  if (!client) return {};

  const baseData = {
    fullName: client.fullName || "",
    nik: client.nik || "",
    address: client.registeredAddress || "",
    phone: client.phone || "",
    email: client.email || "",
    npwp: client.npwp || "",
    placeOfBirth: client.placeOfBirth || "",
    dateOfBirth: client.dateOfBirth || "",
    occupation: client.occupation || "",
    maritalStatus: client.maritalStatus || "Belum Menikah",
  };

  switch (serviceCode) {
    case "akta_jual_beli":
      return {
        sellerName: baseData.fullName,
        sellerNik: baseData.nik,
        sellerAddress: baseData.address,
        sellerPhone: baseData.phone,
        sellerEmail: baseData.email,
        sellerNpwp: baseData.npwp,
        buyerName: client.spouseName || "",
        buyerNik: client.spouseNik || "",
        buyerAddress: "",
        certificateType: "Hak Milik (SHM)", // This can stay as a sensible default dropdown value
        certificateNumber: "",
        landArea: "",
        buildingArea: "",
        location: "",
        city: "",
        province: "",
        transactionPrice: "",
        njopPrice: "",
        agreementDate: new Date().toISOString().split("T")[0], // Sensible default
        paymentMethod: "",
      };

    case "pendirian_badan_usaha":
      return {
        companyNameProposed: client.companyName || "",
        companyAddress: client.companyAddress || baseData.address,
        authorizedCapital: "",
        paidUpCapital: "",
        founder1Name: baseData.fullName,
        founder1Nik: baseData.nik,
        founder1Shares: "",
        founder2Name: client.spouseName || "",
        founder2Nik: client.spouseNik || "",
        founder2Shares: "",
        directorName: baseData.fullName,
        commissionerName: client.spouseName || "",
        businessSector: "",
      };

    case "perjanjian_kawin":
      return {
        husbandName: baseData.fullName,
        husbandNik: baseData.nik,
        wifeName: client.spouseName || "",
        wifeNik: client.spouseNik || "",
        marriageDateTarget: new Date().toISOString().split("T")[0],
        separatedAssetDetails: "",
      };

    case "akta_hibah":
      return {
        grantorName: baseData.fullName,
        grantorNik: baseData.nik,
        grantorAddress: baseData.address,
        recipientName: client.spouseName || "",
        recipientNik: client.spouseNik || "",
        recipientAddress: baseData.address, // Usually child/family, decent fallback
        relationship: "",
        certificateNumber: "",
        landArea: "",
        location: "",
        city: "",
      };

    case "surat_kuasa":
      return {
        principalName: baseData.fullName,
        principalNik: baseData.nik,
        principalAddress: baseData.address,
        attorneyName: "",
        attorneyNik: "",
        authorizedAction: "",
      };

    default:
      return {
        applicantName: baseData.fullName,
        applicantNik: baseData.nik,
        applicantAddress: baseData.address,
        applicantPhone: baseData.phone,
        applicantEmail: baseData.email,
        party1Name: baseData.fullName,
        party1Nik: baseData.nik,
      };
  }
}

// Generate official formatted Indonesian legal text for preview & admin studio
export function generateOfficialLegalText(
  serviceCode: ServiceCode,
  refNumber: string,
  data: Record<string, any>
): string {
  const dateStr = data.agreementDate || new Date().toLocaleDateString("id-ID", { dateStyle: "full" });

  switch (serviceCode) {
    case "akta_jual_beli":
      return `
================================================================================
                              REPUBLIK INDONESIA
                  AKTA JUAL BELI (PPAT)
                  Nomor Berkas: ${refNumber}
================================================================================

Pada hari ini, ${dateStr}, berhadapan dengan saya, Notaris / PPAT Kota Jakarta Selatan:

PIHAK PERTAMA (PENJUAL):
Nama           : ${data.sellerName || "...................................."}
NIK            : ${data.sellerNik || "...................................."}
Alamat         : ${data.sellerAddress || "...................................."}

PIHAK KEDUA (PEMBELI):
Nama           : ${data.buyerName || "...................................."}
NIK            : ${data.buyerNik || "...................................."}
Alamat         : ${data.buyerAddress || "...................................."}

--------------------------------------------------------------------------------
OBJEK HAK ATAS TANAH DAN BANGUNAN:
Sertifikat     : ${data.certificateType || "Hak Milik (SHM)"} ${data.certificateNumber || "No. ....."}
Luas Tanah     : ${data.landArea || "0"} M²
Luas Bangunan  : ${data.buildingArea || "0"} M²
Lokasi         : ${data.location || "-"}, ${data.city || "Jakarta"}, ${data.province || "DKI Jakarta"}

HARGA TRANSAKSI KESEPAKATAN:
Sebesar        : Rp ${Number(data.transactionPrice || 0).toLocaleString("id-ID")}
Metode Bayar   : ${data.paymentMethod || "Transfer / Escrow Notaris"}

KLAUSUL PERJANJIAN:
Pihak Pertama menjamin bahwa objek jual beli tersebut bebas dari sitaan, tidak sedang digadaikan, dan merupakan hak sah milik Pihak Pertama. Pembayaran telah diterima penuh oleh Pihak Pertama.

Demikian Akta ini dibuat dan dibacakan di hadapan para pihak dan saksi-saksi sah.
      `.trim();

    case "pendirian_badan_usaha":
      return `
================================================================================
                           AKTA PENDIRIAN PERSEROAN TERBATAS
                             "${data.companyNameProposed || "PT PERUSAHAAN BARU"}"
                  Nomor Berkas: ${refNumber}
================================================================================

Pada hari ini, ${dateStr}, menghadap Notaris resmi:

PENDIRI / PEMEGANG SAHAM:
1. ${data.founder1Name || "Pendiri 1"} (NIK: ${data.founder1Nik || "-"}), Kepemilikan: ${data.founder1Shares || "50"}% Saham.
2. ${data.founder2Name || "Pendiri 2"} (NIK: ${data.founder2Nik || "-"}), Kepemilikan: ${data.founder2Shares || "50"}% Saham.

KEDUDUKAN & KEUANGAN PERSEROAN:
Nama PT        : ${data.companyNameProposed || "PT PERUSAHAAN BARU"}
Alamat Kantor  : ${data.companyAddress || "-"}
Modal Dasar    : Rp ${Number(data.authorizedCapital || 0).toLocaleString("id-ID")}
Modal Disetor  : Rp ${Number(data.paidUpCapital || 0).toLocaleString("id-ID")}
Sektor Usaha   : ${data.businessSector || "Perdagangan Umum & Jasa"}

SUSUNAN PENGURUS:
Direktur Utama : ${data.directorName || data.founder1Name || "-"}
Komisaris      : ${data.commissionerName || data.founder2Name || "-"}

Para pendiri sepakat mendirikan perseroan terbatas sesuai UU No. 40 Tahun 2007.
      `.trim();

    case "perjanjian_kawin":
      return `
================================================================================
                        AKTA PERJANJIAN PERKAWINAN
                     (PEMISAHAN HARTA KEKAYAAN)
                  Nomor Berkas: ${refNumber}
================================================================================

Menghadap Notaris pada hari ini, ${dateStr}:

PIHAK SUAMI: ${data.husbandName || "-"} (NIK: ${data.husbandNik || "-"})
PIHAK ISTRI: ${data.wifeName || "-"} (NIK: ${data.wifeNik || "-"})

KESEPAKATAN PEMISAHAN HARTA:
Antara Suami dan Istri tidak akan ada persatuan harta kekayaan. Semua harta yang diperoleh sebelum maupun selama pernikahan tetap menjadi hak pribadi masing-masing pihak.

Rincian Harta Pisah:
${data.separatedAssetDetails || "Harta dan aset tercatat atas nama masing-masing pihak."}
      `.trim();

    default:
      return `
================================================================================
                        NASKAH RESMI NOTARIS & PPAT
                        Layanan: ${data.serviceTitle || serviceCode.toUpperCase()}
                        Nomor Berkas: ${refNumber}
================================================================================

Tanggal        : ${dateStr}
Pemohon Utama  : ${data.applicantName || data.fullName || data.sellerName || "-"}
NIK / Identitas: ${data.applicantNik || data.nik || data.sellerNik || "-"}
Alamat         : ${data.applicantAddress || data.address || data.sellerAddress || "-"}

RINGKASAN PERMOHONAN:
Naskah dokumen otentik dibuat berdasarkan keterangan sah yang disampaikan oleh para pihak yang berkepentingan di hadapan Pejabat Notaris/PPAT.
      `.trim();
  }
}
