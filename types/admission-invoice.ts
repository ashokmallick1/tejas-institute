export type AdmissionStatus =
  | 'PROVISIONAL_OFFER'
  | 'OFFER_ACCEPTED'
  | 'DOCUMENTS_VERIFIED'
  | 'FEES_PENDING'
  | 'ADMITTED'
  | 'DEFERRED'
  | 'REVOKED';

export type InvoiceStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export type PaymentPlanType =
  | 'LUMP_SUM'
  | 'INSTALLMENT_2_PARTS'
  | 'INSTALLMENT_3_PARTS'
  | 'CUSTOM_SCHEDULE';

export type PaymentMode =
  | 'UPI'
  | 'NET_BANKING'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'NEFT_RTGS'
  | 'RAZORPAY_GATEWAY';

export interface FeeComponent {
  id: string;
  name: string;
  description: string;
  amount_inr: number;
  is_optional?: boolean;
}

export interface FeeStructure {
  id: string;
  program_id: string;
  program_name: string;
  academic_year: string;
  hsn_sac_code: string; // SAC 999293 for technical education training
  base_tuition_inr: number;
  components: FeeComponent[];
  gst_percentage: number; // 18% standard
  allowed_plans: PaymentPlanType[];
  created_at: string;
}

export interface StudentAdmission {
  id: string;
  application_id: string;
  admission_number: string; // e.g. ADM-2026-FDE-014
  roll_number: string;      // e.g. TEJAS-2026-FDE-014
  student_name: string;
  student_email: string;
  student_phone: string;
  program_id: string;
  program_name: string;
  batch_id: string;
  batch_name: string;
  counselor_name: string;
  status: AdmissionStatus;
  offer_date: string;
  acceptance_deadline: string;
  scholarship_title?: string;
  scholarship_percentage: number; // 0 to 100
  documents_verified: boolean;
  terms_accepted: boolean;
  created_at: string;
  updated_at: string;
  remarks?: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  sac_code: string;
  quantity: number;
  unit_price_inr: number;
  amount_inr: number;
}

export interface InvoicePayment {
  id: string;
  invoice_id: string;
  receipt_number: string; // e.g. RCPT-2026-0042
  payment_date: string;
  amount_inr: number;
  payment_mode: PaymentMode;
  transaction_reference: string; // UTR or Gateway Transaction ID
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  notes?: string;
  recorded_by?: string;
}

export interface StudentInvoice {
  id: string;
  invoice_number: string; // e.g. INV-2026-0038
  admission_id?: string;
  application_id: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  billing_address: string;
  billing_city: string;
  billing_state: string; // Used for CGST+SGST (Odisha) vs IGST
  gstin?: string;        // Optional corporate sponsorship GSTIN
  program_id: string;
  program_name: string;
  issue_date: string;
  due_date: string;
  payment_plan: PaymentPlanType;
  items: InvoiceLineItem[];
  subtotal_inr: number;
  discount_inr: number;
  discount_label?: string;
  taxable_amount_inr: number;
  is_interstate: boolean;
  cgst_inr: number; // 9% for intra-state
  sgst_inr: number; // 9% for intra-state
  igst_inr: number; // 18% for inter-state
  total_amount_inr: number;
  amount_paid_inr: number;
  balance_due_inr: number;
  status: InvoiceStatus;
  payments: InvoicePayment[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdmissionsMetrics {
  total_applications: number;
  offers_issued: number;
  offers_accepted: number;
  fees_pending: number;
  fully_admitted: number;
  conversion_rate: number;
}

export interface InvoicesMetrics {
  total_invoiced_inr: number;
  collected_revenue_inr: number;
  outstanding_balance_inr: number;
  overdue_inr: number;
  total_invoices_count: number;
  paid_invoices_count: number;
  pending_invoices_count: number;
}
