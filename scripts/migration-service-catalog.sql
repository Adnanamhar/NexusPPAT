-- SQL Migration: Client Profiles Data & Service Requests for Notaris Pro
-- Execute this script in your Supabase SQL Editor.

-- 1. Create client_profiles_data table for persistent auto-fill info
CREATE TABLE IF NOT EXISTS client_profiles_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    nik VARCHAR(16),
    registered_address TEXT,
    phone VARCHAR(30),
    email TEXT,
    npwp VARCHAR(30),
    place_of_birth TEXT,
    date_of_birth DATE,
    occupation TEXT,
    marital_status VARCHAR(20),
    spouse_name TEXT,
    spouse_nik VARCHAR(16),
    company_name TEXT,
    company_npwp VARCHAR(30),
    company_address TEXT,
    ktp_url TEXT,
    npwp_url TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast user_id lookup
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON client_profiles_data(user_id);

-- 2. Create service_requests table for storing client requests
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ref_number VARCHAR(50) UNIQUE NOT NULL,
    service_code VARCHAR(100) NOT NULL,
    service_title TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    client_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    missing_fields JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'pending_review',
    status_label TEXT DEFAULT 'Menunggu Penelaahan',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for status and service_code
CREATE INDEX IF NOT EXISTS idx_service_requests_code ON service_requests(service_code);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);

-- Enable RLS (Row Level Security)
ALTER TABLE client_profiles_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to read/update their own data
CREATE POLICY "Users can manage their own client profile" ON client_profiles_data
    FOR ALL USING (auth.uid() = user_id);

-- Allow authenticated users to insert & view their service requests
CREATE POLICY "Users can view their service requests" ON service_requests
    FOR SELECT USING (auth.uid() = client_user_id OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert service requests" ON service_requests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin & Notaris can update service requests" ON service_requests
    FOR UPDATE USING (auth.role() = 'authenticated');
