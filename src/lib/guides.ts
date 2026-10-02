export interface ModuleGuide {
  title: string;
  summary: string;
  steps: { title: string; desc: string }[];
  tips: string[];
}

export const MODULE_GUIDES: Record<string, ModuleGuide> = {
  dashboard: {
    title: "Petunjuk Penggunaan: Dashboard Utama",
    summary: "Pusat monitoring operasional kantor notaris, status jatuh tempo akta, dan ringkasan keuangan.",
    steps: [
      { title: "1. Tinjau Ringkasan", desc: "Pantau total urusan aktif, berkas selesai, dan pencapaian omset bulan ini pada kartu statistik di bagian atas." },
      { title: "2. Tangani Dokumen Prioritas", desc: "Periksa tabel 'Jatuh Tempo / Perlu Tindakan'. Gunakan tombol 'Reminder' untuk mengirim pesan ke klien atau 'Update' untuk meninjau berkas." },
      { title: "3. Eksekusi Akta Baru", desc: "Klik tombol '+ Buat Akta Baru' di pojok kanan atas untuk memulai input pengajuan layanan baru." },
    ],
    tips: [
      "Notaris dapat melihat seluruh omset kantor, sedangkan Klien akan melihat status berkas permohonannya sendiri.",
      "Gunakan switcher tema (ikon Bulan/Matahari) di bagian atas untuk kenyamanan bekerja di siang atau malam hari.",
    ],
  },
  files: {
    title: "Petunjuk Penggunaan: Manajemen Berkas & Akta",
    summary: "Katalog seluruh berkas perkara, akta jual beli, pendirian PT, dan perjanjian legal.",
    steps: [
      { title: "1. Pencarian Cepat", desc: "Ketik nomor referensi, NIK, atau nama klien pada kolom pencarian untuk menemukan berkas instan." },
      { title: "2. Filter Kategori", desc: "Gunakan tombol filter jenis akta (AJB, Pendirian PT, Kredit) dan status alur kerja (Draft, Verifikasi, Selesai)." },
      { title: "3. Buka Detail Berkas", desc: "Klik pada baris dokumen untuk masuk ke ruang kerja verifikasi berkas dan penerbitan draft akta." },
    ],
    tips: [
      "Berkas yang berstatus 'Signature Pending' memerlukan kehadiran para pihak di hadapan Notaris.",
      "Seluruh berkas tersimpan dengan enkripsi standar perlindungan rahasia jabatan notaris.",
    ],
  },
  filesNew: {
    title: "Petunjuk Penggunaan: Form Pengajuan Akta Baru",
    summary: "Formulir 3 langkah sistematis untuk mencatat pihak penjual/pembeli, objek tanah/bangunan, dan klausul kesepakatan.",
    steps: [
      { title: "Langkah 01 — Para Pihak", desc: "Isi data identitas Penjual & Pembeli (Nama lengkap sesuai KTP, NIK, Alamat) dan unggah foto e-KTP untuk ekstraksi OCR otomatis." },
      { title: "Langkah 02 — Objek Properti", desc: "Pilih jenis hak tanah (SHM/HGB), nomor sertifikat, NIB, luas tanah/bangunan, alamat lokasi, dan nilai transaksi/NJOP." },
      { title: "Langkah 03 — Kesepakatan", desc: "Tentukan metode pembayaran (Escrow / Bank), uang muka (DP), saksi-saksi, serta klausul khusus pengosongan objek." },
    ],
    tips: [
      "Unggah foto KTP yang jelas dan tidak terpotong agar AI OCR dapat memverifikasi NIK secara otomatis.",
      "Data formulir dapat disimpan sebagai draft kapan saja sebelum diajukan.",
    ],
  },
  filesDetail: {
    title: "Petunjuk Penggunaan: Verifikasi & Draft Akta",
    summary: "Ruang kerja notaris untuk memverifikasi dokumen fisik, validasi status pajak (KSWP), dan mencetak draft akta resmi.",
    steps: [
      { title: "1. Cek Data Pihak", desc: "Periksa badge 'Verified AI' atau lakukan review manual pada KTP penjual & pembeli. Klik thumbnail foto untuk zoom resolusi tinggi." },
      { title: "2. Ceklis Kelengkapan", desc: "Centang keaslian sertifikat asli, PBB tahun berjalan, dan klik 'Validasi Sekarang' untuk memeriksa NPWP melalui KSWP Ditjen Pajak." },
      { title: "3. Catatan Internal", desc: "Tambahkan instruksi khusus bagi tim asisten atau catatan perjanjian escrow pada kotak Catatan Internal." },
      { title: "4. Terbitkan Draft Akta", desc: "Klik 'Generate Draft Akta' untuk menyusun naskah komparisi resmi berstempel garuda yang siap dicetak dan dibacakan." },
    ],
    tips: [
      "Hanya akun dengan role Notaris / PPAT yang berwenang menerbitkan dan mengesahkan Draft Akta Resmi.",
    ],
  },
  clients: {
    title: "Petunjuk Penggunaan: Katalog Klien",
    summary: "Pangkalan data klien perorangan, korporasi/badan hukum, serta instansi perbankan rekanan.",
    steps: [
      { title: "1. Tambah Klien", desc: "Klik '+ Tambah Klien Baru' untuk mendaftarkan identitas subjek hukum baru ke dalam database kantor." },
      { title: "2. Kelola Riwayat", desc: "Klik nama klien untuk melihat histori seluruh akta yang pernah dibuat dan riwayat pembayarannya." },
      { title: "3. Hubungi Cepat", desc: "Gunakan tombol WhatsApp/Telepon untuk berkoordinasi langsung dengan pihak klien terkait jadwal tanda tangan." },
    ],
    tips: [
      "Pastikan NIK atau NPWP klien dicatat secara teliti untuk memudahkan integrasi pelaporan ke Majelis Pengawas Notaris.",
    ],
  },
  payments: {
    title: "Petunjuk Penggunaan: Billing & Kuitansi",
    summary: "Sistem pencatatan tagihan jasa notaris, titipan pajak BPHTB/PPh, serta pencetakan tanda terima resmi.",
    steps: [
      { title: "1. Terbitkan Invoice", desc: "Buat tagihan baru dengan rincian biaya honorarium akta, PNBP, dan titipan pajak." },
      { title: "2. Konfirmasi Pembayaran", desc: "Ubah status pembayaran menjadi 'Paid' saat dana telah masuk ke Rekening Escrow Penampung Notaris." },
      { title: "3. Cetak Kuitansi", desc: "Klik 'Cetak Kuitansi' untuk mencetak tanda terima resmi bermaterai bagi klien." },
    ],
    tips: [
      "Dana titipan pajak BPHTB dan PPh wajib dipisahkan dari honorarium kantor melalui rekening penampung escrow.",
    ],
  },
  reports: {
    title: "Petunjuk Penggunaan: Laporan Kinerja & Keuangan",
    summary: "Visualisasi analitik performa akta bulanan, rasio jenis akta terpopuler, dan rekapitulasi omset kantor.",
    steps: [
      { title: "1. Tinjau Grafik Omset", desc: "Analisis tren pertumbuhan pendapatan bulanan kantor melalui diagram batang interaktif." },
      { title: "2. Komposisi Akta", desc: "Lihat persentase jenis akta terbanyak (AJB, Pendirian PT, APHT) pada diagram lingkaran." },
      { title: "3. Ekspor Laporan", desc: "Klik tombol 'Ekspor PDF/Excel' untuk mengunduh rekap laporan bulanan kantor." },
    ],
    tips: [
      "Laporan ini dapat digunakan sebagai bahan rekap laporan bulanan ke Kantor Pertanahan (BPN) dan Kemenkumham.",
    ],
  },
  activities: {
    title: "Petunjuk Penggunaan: Audit Trail Kepatuhan",
    summary: "Catatan log seluruh aktivitas user dalam sistem guna menjamin integritas hukum dan keamanan data.",
    steps: [
      { title: "1. Pelacakan Waktu Nyata", desc: "Lihat siapa yang membuat berkas, memverifikasi KTP, atau menerbitkan draft akta beserta stempel waktu." },
      { title: "2. Filter Kategori Aksi", desc: "Saring log berdasarkan aktivitas 'Verifikasi', 'Pembayaran', 'Pembuatan Berkas', atau 'Sistem AI'." },
    ],
    tips: [
      "Log aktivitas bersifat 'Read-Only' dan tidak dapat dihapus demi memenuhi standar kepatuhan regulasi hukum notariat.",
    ],
  },
  settings: {
    title: "Petunjuk Penggunaan: Pengaturan Kantor & SK",
    summary: "Konfigurasi identitas SK pejabat, kop surat naskah akta, rekening penampung, dan data staf kantor.",
    steps: [
      { title: "1. Profil Pejabat", desc: "Isi nomor SK Pengangkatan Notaris dari Menkumham dan SK PPAT dari Kepala BPN RI." },
      { title: "2. Kop Surat Akta", desc: "Sesuaikan nama kantor dan alamat lengkap yang akan otomatis tercetak pada naskah akta." },
      { title: "3. Rekening Escrow", desc: "Konfigurasi nomor rekening bank resmi untuk penampungan dana transaksi klien." },
    ],
    tips: [
      "Perubahan SK Notaris & PPAT hanya dapat dilakukan oleh Super Admin / Pejabat Notaris Utama.",
    ],
  },
  support: {
    title: "Petunjuk Penggunaan: Pusat Bantuan & Regulasi",
    summary: "Panduan hukum notariat, daftar pertanyaan yang sering diajukan (FAQ), dan layanan bantuan teknis.",
    steps: [
      { title: "1. Telusuri FAQ", desc: "Buka topik pertanyaan seputar syarat AJB tanah, validasi KSWP, dan prosedur balik nama sertifikat." },
      { title: "2. Kirim Tiket", desc: "Isi form di bagian bawah jika Anda memerlukan bantuan teknis aplikasi atau konsultasi implementasi." },
    ],
    tips: [
      "Tim bantuan teknis Nexus PPAT beroperasi Senin – Jumat pukul 08.00 – 17.00 WIB.",
    ],
  },
};
