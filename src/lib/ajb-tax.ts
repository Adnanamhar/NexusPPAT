/**
 * Modul 4 PKPL - White Box Testing Target Function
 * Menghitung estimasi kewajiban pajak statuter (PPh Final, BPHTB, PNBP BPN)
 * dan memvalidasi kesesuaian fisik objek tanah & bangunan untuk Akta Jual Beli (AJB).
 */

export interface AJBTaxCalculationResult {
  isValid: boolean;
  statusMessage: string;
  pphFinal?: number;
  bphtb?: number;
  pnbpBpn?: number;
  totalTax: number;
}

export function calculateAJBTaxAndValidation(
  landArea: number,
  buildingArea: number,
  transactionPrice: number
): AJBTaxCalculationResult {
  // S1: Inisialisasi status validasi dan pesan
  let isValid = false;
  let statusMessage = "";

  // S2: Inisialisasi nilai pajak
  let pphFinal = 0;
  let bphtb = 0;
  let pnbpBpn = 0;
  let totalTax = 0;

  // S3: Keputusan 1 - Cek validitas batas fisik dan aturan bisnis (LB <= LT dan LT >= 10 dan LB >= 0)
  if (landArea < 10 || buildingArea > landArea || buildingArea < 0) {
    // S4: Penolakan pelanggaran fisik / aturan kavling
    statusMessage = "Ditolak: Pelanggaran spesifikasi luas fisik tanah atau bangunan";
    return { isValid: false, statusMessage, totalTax: 0 };
  } else {
    // S5: Fisik objek valid
    isValid = true;

    // S6: Keputusan 2 - Cek ambang batas minimum transaksi resmi (Rp 10.000.000)
    if (transactionPrice < 10000000) {
      // S7: Penolakan nilai transaksi di bawah ambang statuter
      statusMessage = "Ditolak: Nilai transaksi di bawah batas minimum Rp 10 Juta";
      return { isValid: false, statusMessage, totalTax: 0 };
    } else {
      // S8: Hitung PPh Final 2.5% Penjual dan PNBP BPN (1 per mil + Rp 50.000)
      pphFinal = Math.round(transactionPrice * 0.025);
      pnbpBpn = Math.round(transactionPrice / 1000 + 50000);

      // S9: Keputusan 3 - Cek apakah Nilai Transaksi melebihi NPOPTKP (Rp 80.000.000) untuk BPHTB
      if (transactionPrice > 80000000) {
        // S10: Transaksi kena BPHTB 5% di atas NPOPTKP
        bphtb = Math.round((transactionPrice - 80000000) * 0.05);
        statusMessage = "Valid: Dikenakan PPh Final, PNBP, dan BPHTB Penuh";
      } else {
        // S11: Transaksi bebas BPHTB (Nol)
        bphtb = 0;
        statusMessage = "Valid: Bebas BPHTB (NPOPTKP), hanya PPh Final dan PNBP";
      }

      // S12: Hitung total pungutan statuter
      totalTax = pphFinal + bphtb + pnbpBpn;
    }
  }

  // S13: Kembalikan hasil kalkulasi dan status validasi
  return { isValid, statusMessage, pphFinal, bphtb, pnbpBpn, totalTax };
}

