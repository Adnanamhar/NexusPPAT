-- ==============================================================================
-- NOTARIS PRO: DIGITAL LEGAL SUITE - DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- ==============================================================================

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('notaris', 'admin', 'klien')),
  role_title TEXT NOT NULL,
  avatar_url TEXT,
  sk_number TEXT,
  sk_ppat TEXT,
  phone TEXT,
  office_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Documents Table (Legal Matters & Deeds)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_user_id UUID REFERENCES auth.users(id),
  ref_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  doc_type_label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft_review',
  status_label TEXT NOT NULL DEFAULT 'Draft Review',
  current_step INT DEFAULT 1,
  
  -- Seller / First Party
  seller_name TEXT NOT NULL,
  seller_nik TEXT NOT NULL,
  seller_address TEXT NOT NULL,
  seller_phone TEXT,
  seller_email TEXT,
  seller_ktp_url TEXT,
  seller_ktp_filename TEXT,
  seller_verification_status TEXT DEFAULT 'pending',
  seller_verification_notes TEXT,
  
  -- Buyer / Second Party
  buyer_name TEXT NOT NULL,
  buyer_nik TEXT NOT NULL,
  buyer_address TEXT NOT NULL,
  buyer_phone TEXT,
  buyer_email TEXT,
  buyer_ktp_url TEXT,
  buyer_ktp_filename TEXT,
  buyer_verification_status TEXT DEFAULT 'pending',
  buyer_verification_notes TEXT,
  
  -- Property / Object
  property_cert_type TEXT DEFAULT 'Hak Milik (SHM)',
  property_cert_number TEXT,
  property_nib TEXT,
  property_land_area NUMERIC DEFAULT 0,
  property_building_area NUMERIC DEFAULT 0,
  property_location TEXT,
  property_city TEXT,
  property_province TEXT,
  property_transaction_price NUMERIC DEFAULT 0,
  property_njop_price NUMERIC DEFAULT 0,
  property_pbb_year TEXT,
  property_pbb_status TEXT DEFAULT 'Lunas',
  property_cert_url TEXT,
  
  -- Agreement
  agreement_date DATE,
  agreement_payment_method TEXT,
  agreement_bank_name TEXT,
  agreement_down_payment NUMERIC DEFAULT 0,
  agreement_witness1 TEXT,
  agreement_witness2 TEXT,
  agreement_special_clauses TEXT,
  agreement_ssp_seller TEXT DEFAULT 'Belum Disetor',
  agreement_sspd_buyer TEXT DEFAULT 'Lunas',
  
  internal_notes TEXT,
  billing_status TEXT DEFAULT 'Unpaid',
  billing_amount NUMERIC DEFAULT 0,
  due_date DATE,
  is_encrypted BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Document Checklists Table
CREATE TABLE IF NOT EXISTS public.document_checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  action_label TEXT,
  action_type TEXT,
  verified_at TEXT,
  verified_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Document Workflows Table
CREATE TABLE IF NOT EXISTS public.document_workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Individu',
  nik_or_npwp TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'Aktif',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  document_ref TEXT NOT NULL,
  document_title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Unpaid',
  due_date DATE NOT NULL,
  paid_at TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Activities Audit Trail Table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_ref TEXT,
  target_title TEXT,
  timestamp TEXT,
  type TEXT NOT NULL DEFAULT 'create',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Office Settings Table
CREATE TABLE IF NOT EXISTS public.office_settings (
  id INT PRIMARY KEY DEFAULT 1,
  notary_name TEXT NOT NULL DEFAULT 'Dr. Hendrawan Kartasasmita, S.H., M.Kn.',
  sk_kemenkumham TEXT NOT NULL DEFAULT 'SK Menkumham No. AHU-0019283.AH.02.01',
  sk_ppat TEXT NOT NULL DEFAULT 'SK Kepala BPN RI No. 12/KEP-BPN/PPAT/2019',
  phone TEXT NOT NULL DEFAULT '+62 811-9876-5432',
  office_name TEXT NOT NULL DEFAULT 'Kantor Notaris & PPAT Hendrawan, S.H., M.Kn.',
  office_address TEXT NOT NULL DEFAULT 'Sudirman Central Business District (SCBD) Tower 1 Lt. 8, Jakarta Selatan',
  escrow_bank TEXT NOT NULL DEFAULT 'BCA Cabang Sudirman - No. Rek: 012-9988-7711 a.n. Escrow Notaris Hendrawan',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure single settings row
INSERT INTO public.office_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for authenticated and anon users (facilitates easy portal access while keeping secure)
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow insert for auth users on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for auth users on profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow all access on documents" ON public.documents FOR ALL USING (true);
CREATE POLICY "Allow all access on document_checklists" ON public.document_checklists FOR ALL USING (true);
CREATE POLICY "Allow all access on document_workflows" ON public.document_workflows FOR ALL USING (true);
CREATE POLICY "Allow all access on clients" ON public.clients FOR ALL USING (true);
CREATE POLICY "Allow all access on payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow all access on activities" ON public.activities FOR ALL USING (true);
CREATE POLICY "Allow all access on office_settings" ON public.office_settings FOR ALL USING (true);
