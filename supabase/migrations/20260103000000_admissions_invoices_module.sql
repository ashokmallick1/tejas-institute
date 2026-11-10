-- ============================================================
-- TEJAS INSTITUTE: CRM ADMISSIONS & INVOICING MODULE
-- Migration: 20260103000000_admissions_invoices_module.sql
-- Architected on Frappe Education (ERPNext) & Invoice Ninja Open-Source Standards
-- ============================================================

-- 1. Fee Structures (Frappe Education Standard)
CREATE TABLE IF NOT EXISTS crm_fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2026-2027',
  hsn_sac_code TEXT NOT NULL DEFAULT '999293', -- Technical education and vocational training services
  base_tuition_inr NUMERIC(12, 2) NOT NULL DEFAULT 150000.00,
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  gst_percentage NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
  allowed_plans TEXT[] NOT NULL DEFAULT ARRAY['LUMP_SUM', 'INSTALLMENT_2_PARTS', 'INSTALLMENT_3_PARTS'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Admissions Management (ERPNext Student Admission Standard)
CREATE TABLE IF NOT EXISTS crm_admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id TEXT NOT NULL,
  admission_number TEXT NOT NULL UNIQUE, -- e.g. ADM-2026-FDE-014
  roll_number TEXT NOT NULL UNIQUE,      -- e.g. TEJAS-2026-FDE-014
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT NOT NULL,
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  batch_id TEXT NOT NULL DEFAULT 'batch-alpha-2026',
  batch_name TEXT NOT NULL DEFAULT 'Batch Alpha 2026 (Bhubaneswar Hub)',
  counselor_name TEXT NOT NULL DEFAULT 'Er. Arpita Senapati',
  status TEXT NOT NULL DEFAULT 'PROVISIONAL_OFFER',
  offer_date DATE NOT NULL DEFAULT CURRENT_DATE,
  acceptance_deadline DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
  scholarship_title TEXT,
  scholarship_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  documents_verified BOOLEAN NOT NULL DEFAULT false,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Student Invoices (Invoice Ninja / GST Tax Invoice Standard)
CREATE TABLE IF NOT EXISTS crm_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE, -- e.g. INV-2026-0042
  admission_id UUID REFERENCES crm_admissions(id) ON DELETE SET NULL,
  application_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT NOT NULL,
  billing_address TEXT NOT NULL DEFAULT 'Plot 42, Infocity Avenue, Patia',
  billing_city TEXT NOT NULL DEFAULT 'Bhubaneswar',
  billing_state TEXT NOT NULL DEFAULT 'Odisha',
  gstin TEXT, -- For corporate sponsored candidates
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '10 days'),
  payment_plan TEXT NOT NULL DEFAULT 'LUMP_SUM',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  discount_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  discount_label TEXT,
  taxable_amount_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  is_interstate BOOLEAN NOT NULL DEFAULT false,
  cgst_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 9%
  sgst_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 9%
  igst_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 18%
  total_amount_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  amount_paid_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  balance_due_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'ISSUED',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Payment Receipts & Transactions (Invoice Ninja Payment Entry Standard)
CREATE TABLE IF NOT EXISTS crm_invoice_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES crm_invoices(id) ON DELETE CASCADE,
  receipt_number TEXT NOT NULL UNIQUE, -- e.g. RCPT-2026-0089
  payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  amount_inr NUMERIC(12, 2) NOT NULL,
  payment_mode TEXT NOT NULL DEFAULT 'UPI',
  transaction_reference TEXT NOT NULL, -- UTR / Razorpay ID
  status TEXT NOT NULL DEFAULT 'SUCCESS',
  notes TEXT,
  recorded_by TEXT DEFAULT 'Finance Desk',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes for High-Concurrency Queries
CREATE INDEX IF NOT EXISTS idx_crm_admissions_app_id ON crm_admissions(application_id);
CREATE INDEX IF NOT EXISTS idx_crm_admissions_status ON crm_admissions(status);
CREATE INDEX IF NOT EXISTS idx_crm_admissions_program ON crm_admissions(program_id);
CREATE INDEX IF NOT EXISTS idx_crm_invoices_app_id ON crm_invoices(application_id);
CREATE INDEX IF NOT EXISTS idx_crm_invoices_status ON crm_invoices(status);
CREATE INDEX IF NOT EXISTS idx_crm_invoices_due_date ON crm_invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_payments_invoice ON crm_invoice_payments(invoice_id);

-- 6. Row Level Security (RLS)
ALTER TABLE crm_fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_invoice_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read fee structures"
  ON crm_fee_structures FOR SELECT USING (true);

CREATE POLICY "Public read admissions"
  ON crm_admissions FOR SELECT USING (true);

CREATE POLICY "Staff insert update admissions"
  ON crm_admissions FOR ALL USING (true);

CREATE POLICY "Public read invoices"
  ON crm_invoices FOR SELECT USING (true);

CREATE POLICY "Staff insert update invoices"
  ON crm_invoices FOR ALL USING (true);

CREATE POLICY "Public read payments"
  ON crm_invoice_payments FOR SELECT USING (true);

CREATE POLICY "Staff insert payments"
  ON crm_invoice_payments FOR ALL USING (true);

-- 7. Seed Initial Fee Structures
INSERT INTO crm_fee_structures (program_id, program_name, base_tuition_inr, components)
VALUES
(
  'prog-fde-01',
  'Forward Deployment Engineer (FDE) Fellowship',
  250000.00,
  '[
    {"id": "comp-1", "name": "Seat Reservation & Onboarding Kit", "amount_inr": 25000, "description": "Welcome package, security clearance, deep-tech tool access"},
    {"id": "comp-2", "name": "Core FDE Architecture & Systems Curriculum", "amount_inr": 150000, "description": "Distributed systems, vLLM inference, and autonomous agent clusters"},
    {"id": "comp-3", "name": "Dedicated A100 GPU Cloud Compute Lab", "amount_inr": 50000, "description": "Dedicated H100/A100 cluster hours for autonomous agent training"},
    {"id": "comp-4", "name": "Industrial Defense & Placement Retainer", "amount_inr": 25000, "description": "Defense panel, verifiable certificate ledger, and career handshake"}
  ]'::jsonb
),
(
  'prog-agentic-ai-02',
  'Agentic AI Systems & Multi-Agent Swarms',
  180000.00,
  '[
    {"id": "comp-1", "name": "Registration & Environment Setup", "amount_inr": 20000, "description": "Cloud orchestration credentials and lab access"},
    {"id": "comp-2", "name": "Multi-Agent Architectures & Protocols", "amount_inr": 110000, "description": "LangGraph, CrewAI, AutoGen, and custom swarm engines"},
    {"id": "comp-3", "name": "High-Density Inference Cluster Lab", "amount_inr": 35000, "description": "Vector database instances, embeddings infrastructure"},
    {"id": "comp-4", "name": "Verifiable Certification & Capstone", "amount_inr": 15000, "description": "Tamper-proof cryptographic certificate issuance"}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- 8. Seed Initial Admissions & Invoices
INSERT INTO crm_admissions (
  id, application_id, admission_number, roll_number, student_name, student_email, student_phone,
  program_id, program_name, batch_id, batch_name, status, scholarship_title, scholarship_percentage, documents_verified, terms_accepted
)
VALUES
(
  '8d92cb64-2195-46aa-b2b9-e48352b61901',
  'app-01',
  'ADM-2026-FDE-001',
  'TEJAS-2026-FDE-001',
  'Rohan Patnaik',
  'rohan.patnaik@example.com',
  '+91 98610 12345',
  'prog-fde-01',
  'Forward Deployment Engineer (FDE) Fellowship',
  'batch-alpha-2026',
  'Batch Alpha 2026 (Bhubaneswar Hub)',
  'ADMITTED',
  'Odisha AI Merit Fellowship (40%)',
  40.00,
  true,
  true
),
(
  '8d92cb64-2195-46aa-b2b9-e48352b61902',
  'app-02',
  'ADM-2026-FDE-002',
  'TEJAS-2026-FDE-002',
  'Priyanka Mohapatra',
  'priyanka.m@example.com',
  '+91 94370 23456',
  'prog-fde-01',
  'Forward Deployment Engineer (FDE) Fellowship',
  'batch-alpha-2026',
  'Batch Alpha 2026 (Bhubaneswar Hub)',
  'FEES_PENDING',
  'Women in Deep-Tech Grant (50%)',
  50.00,
  true,
  true
),
(
  '8d92cb64-2195-46aa-b2b9-e48352b61903',
  'app-03',
  'ADM-2026-AG-003',
  'TEJAS-2026-AG-003',
  'Siddharth Mishra',
  'siddharth.m@example.com',
  '+91 97760 34567',
  'prog-agentic-ai-02',
  'Agentic AI Systems & Multi-Agent Swarms',
  'batch-alpha-2026',
  'Batch Alpha 2026 (Bhubaneswar Hub)',
  'PROVISIONAL_OFFER',
  'Early Bird Engineering Waiver (20%)',
  20.00,
  false,
  false
)
ON CONFLICT (admission_number) DO NOTHING;

-- Seed Invoices for Admitted / Shortlisted Fellows
INSERT INTO crm_invoices (
  id, invoice_number, admission_id, application_id, student_name, student_email, student_phone,
  billing_address, billing_city, billing_state, program_id, program_name, payment_plan,
  items, subtotal_inr, discount_inr, discount_label, taxable_amount_inr, is_interstate,
  cgst_inr, sgst_inr, igst_inr, total_amount_inr, amount_paid_inr, balance_due_inr, status
)
VALUES
(
  '4f8b2d11-54b9-4786-b489-cf29b19e0001',
  'INV-2026-0001',
  '8d92cb64-2195-46aa-b2b9-e48352b61901',
  'app-01',
  'Rohan Patnaik',
  'rohan.patnaik@example.com',
  '+91 98610 12345',
  'Plot 18, HIG Duplex, Sailashree Vihar',
  'Bhubaneswar',
  'Odisha',
  'prog-fde-01',
  'Forward Deployment Engineer (FDE) Fellowship',
  'LUMP_SUM',
  '[
    {"id": "item-1", "description": "FDE Fellowship Tuition & Mentor Supervision (SAC 999293)", "sac_code": "999293", "quantity": 1, "unit_price_inr": 200000, "amount_inr": 200000},
    {"id": "item-2", "description": "Dedicated H100 GPU Cluster Compute Access", "sac_code": "999293", "quantity": 1, "unit_price_inr": 50000, "amount_inr": 50000}
  ]'::jsonb,
  250000.00,
  100000.00,
  'Odisha AI Merit Fellowship (40% Waiver)',
  150000.00,
  false,
  13500.00, -- CGST 9%
  13500.00, -- SGST 9%
  0.00,
  177000.00,
  177000.00,
  0.00,
  'PAID'
),
(
  '4f8b2d11-54b9-4786-b489-cf29b19e0002',
  'INV-2026-0002',
  '8d92cb64-2195-46aa-b2b9-e48352b61902',
  'app-02',
  'Priyanka Mohapatra',
  'priyanka.m@example.com',
  '+91 94370 23456',
  'B-404, Falcon Residency, Chandrasekharpur',
  'Bhubaneswar',
  'Odisha',
  'prog-fde-01',
  'Forward Deployment Engineer (FDE) Fellowship',
  'INSTALLMENT_2_PARTS',
  '[
    {"id": "item-1", "description": "FDE Fellowship Tranche 1 (Admission & Lab Infrastructure)", "sac_code": "999293", "quantity": 1, "unit_price_inr": 125000, "amount_inr": 125000}
  ]'::jsonb,
  125000.00,
  62500.00,
  'Women in Deep-Tech Grant (50% Waiver)',
  62500.00,
  false,
  5625.00,
  5625.00,
  0.00,
  73750.00,
  25000.00,
  48750.00,
  'PARTIALLY_PAID'
),
(
  '4f8b2d11-54b9-4786-b489-cf29b19e0003',
  'INV-2026-0003',
  '8d92cb64-2195-46aa-b2b9-e48352b61903',
  'app-03',
  'Siddharth Mishra',
  'siddharth.m@example.com',
  '+91 97760 34567',
  'Flat 302, Cyber Tower Heights, HSR Layout',
  'Bengaluru',
  'Karnataka',
  'prog-agentic-ai-02',
  'Agentic AI Systems & Multi-Agent Swarms',
  'LUMP_SUM',
  '[
    {"id": "item-1", "description": "Agentic AI Systems Master Fellowship (SAC 999293)", "sac_code": "999293", "quantity": 1, "unit_price_inr": 180000, "amount_inr": 180000}
  ]'::jsonb,
  180000.00,
  36000.00,
  'Early Bird Engineering Waiver (20%)',
  144000.00,
  true, -- Interstate IGST
  0.00,
  0.00,
  25920.00, -- IGST 18%
  169920.00,
  0.00,
  169920.00,
  'ISSUED'
)
ON CONFLICT (invoice_number) DO NOTHING;

-- Seed Receipts for Paid Invoices
INSERT INTO crm_invoice_payments (
  invoice_id, receipt_number, amount_inr, payment_mode, transaction_reference, status, notes
)
VALUES
(
  '4f8b2d11-54b9-4786-b489-cf29b19e0001',
  'RCPT-2026-0001',
  177000.00,
  'NET_BANKING',
  'HDFCN261001928410',
  'SUCCESS',
  'Full tuition fee cleared via HDFC NetBanking. LMS enrollment auto-unlocked.'
),
(
  '4f8b2d11-54b9-4786-b489-cf29b19e0002',
  'RCPT-2026-0002',
  25000.00,
  'UPI',
  'UPI/2610028912/priyanka@okaxis',
  'SUCCESS',
  'Seat reservation deposit received. Second tranche due before cohort launch.'
)
ON CONFLICT (receipt_number) DO NOTHING;
