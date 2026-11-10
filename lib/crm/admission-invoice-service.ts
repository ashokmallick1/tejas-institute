import {
  StudentAdmission,
  StudentInvoice,
  InvoicePayment,
  FeeStructure,
  AdmissionsMetrics,
  InvoicesMetrics,
  AdmissionStatus,
  InvoiceStatus,
  PaymentPlanType,
  PaymentMode,
} from '@/types/admission-invoice';
import { StudentApplication } from '@/types';

// ============================================================
// Initial Mock Data (Grounded in Frappe Education & Invoice Ninja)
// ============================================================

export const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  {
    id: 'fs-fde-01',
    program_id: 'prog-fde-01',
    program_name: 'Forward Deployment Engineer (FDE) Fellowship',
    academic_year: '2026-2027',
    hsn_sac_code: '999293',
    base_tuition_inr: 250000,
    gst_percentage: 18,
    allowed_plans: ['LUMP_SUM', 'INSTALLMENT_2_PARTS', 'INSTALLMENT_3_PARTS'],
    created_at: new Date().toISOString(),
    components: [
      {
        id: 'comp-1',
        name: 'Seat Reservation & Onboarding Kit',
        description: 'Security clearance, deep-tech developer tool access & workstation config',
        amount_inr: 25000,
      },
      {
        id: 'comp-2',
        name: 'Core FDE Architecture & Systems Curriculum',
        description: 'Distributed systems, vLLM inference, and autonomous agent clusters',
        amount_inr: 150000,
      },
      {
        id: 'comp-3',
        name: 'Dedicated A100 GPU Cloud Compute Lab',
        description: 'Dedicated H100/A100 cluster compute hours for autonomous agent training',
        amount_inr: 50000,
      },
      {
        id: 'comp-4',
        name: 'Industrial Defense & Placement Retainer',
        description: 'Defense jury panel, cryptographic certificate ledger, and career handshake',
        amount_inr: 25000,
      },
    ],
  },
  {
    id: 'fs-agentic-ai-02',
    program_id: 'prog-agentic-ai-02',
    program_name: 'Agentic AI Systems & Multi-Agent Swarms',
    academic_year: '2026-2027',
    hsn_sac_code: '999293',
    base_tuition_inr: 180000,
    gst_percentage: 18,
    allowed_plans: ['LUMP_SUM', 'INSTALLMENT_2_PARTS', 'INSTALLMENT_3_PARTS'],
    created_at: new Date().toISOString(),
    components: [
      {
        id: 'comp-1',
        name: 'Registration & Environment Setup',
        description: 'Cloud orchestration credentials and lab access',
        amount_inr: 20000,
      },
      {
        id: 'comp-2',
        name: 'Multi-Agent Architectures & Protocols',
        description: 'LangGraph, CrewAI, AutoGen, and custom swarm engines',
        amount_inr: 110000,
      },
      {
        id: 'comp-3',
        name: 'High-Density Inference Cluster Lab',
        description: 'Vector database instances, embeddings infrastructure',
        amount_inr: 35000,
      },
      {
        id: 'comp-4',
        name: 'Verifiable Certification & Capstone',
        description: 'Tamper-proof cryptographic certificate issuance',
        amount_inr: 15000,
      },
    ],
  },
  {
    id: 'fs-quantum-03',
    program_id: 'prog-quantum-03',
    program_name: 'Quantum Computing & Algorithms Fellowship',
    academic_year: '2026-2027',
    hsn_sac_code: '999293',
    base_tuition_inr: 220000,
    gst_percentage: 18,
    allowed_plans: ['LUMP_SUM', 'INSTALLMENT_2_PARTS'],
    created_at: new Date().toISOString(),
    components: [
      {
        id: 'comp-1',
        name: 'Quantum Lab Simulator Access',
        description: 'Qiskit runtime & cloud simulator access allocation',
        amount_inr: 40000,
      },
      {
        id: 'comp-2',
        name: 'Quantum Circuit Synthesis & Algorithms',
        description: 'Shor, Grover, and VQE hybrid classical-quantum models',
        amount_inr: 140000,
      },
      {
        id: 'comp-3',
        name: 'Research Paper Defense & Ledger Certification',
        description: 'Peer review and formal ledger verification',
        amount_inr: 40000,
      },
    ],
  },
];

export const INITIAL_ADMISSIONS: StudentAdmission[] = [
  {
    id: 'adm-01',
    application_id: 'app-01',
    admission_number: 'ADM-2026-FDE-001',
    roll_number: 'TEJAS-2026-FDE-001',
    student_name: 'Rohan Patnaik',
    student_email: 'rohan.patnaik@example.com',
    student_phone: '+91 98610 12345',
    program_id: 'prog-fde-01',
    program_name: 'Forward Deployment Engineer (FDE) Fellowship',
    batch_id: 'batch-alpha-2026',
    batch_name: 'Batch Alpha 2026 (Bhubaneswar Hub)',
    counselor_name: 'Er. Arpita Senapati',
    status: 'ADMITTED',
    offer_date: '2026-10-01',
    acceptance_deadline: '2026-10-15',
    scholarship_title: 'Odisha AI Merit Fellowship (40%)',
    scholarship_percentage: 40,
    documents_verified: true,
    terms_accepted: true,
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-10-04T12:00:00Z',
    remarks: 'Clearance verified. Top 5% ranking in autonomous agents test.',
  },
  {
    id: 'adm-02',
    application_id: 'app-02',
    admission_number: 'ADM-2026-FDE-002',
    roll_number: 'TEJAS-2026-FDE-002',
    student_name: 'Priyanka Mohapatra',
    student_email: 'priyanka.m@example.com',
    student_phone: '+91 94370 23456',
    program_id: 'prog-fde-01',
    program_name: 'Forward Deployment Engineer (FDE) Fellowship',
    batch_id: 'batch-alpha-2026',
    batch_name: 'Batch Alpha 2026 (Bhubaneswar Hub)',
    counselor_name: 'Er. Arpita Senapati',
    status: 'FEES_PENDING',
    offer_date: '2026-10-02',
    acceptance_deadline: '2026-10-16',
    scholarship_title: 'Women in Deep-Tech Grant (50%)',
    scholarship_percentage: 50,
    documents_verified: true,
    terms_accepted: true,
    created_at: '2026-10-02T11:00:00Z',
    updated_at: '2026-10-03T15:30:00Z',
    remarks: 'Seat reservation paid. Second tranche balance due before cohort kickoff.',
  },
  {
    id: 'adm-03',
    application_id: 'app-03',
    admission_number: 'ADM-2026-AG-003',
    roll_number: 'TEJAS-2026-AG-003',
    student_name: 'Siddharth Mishra',
    student_email: 'siddharth.m@example.com',
    student_phone: '+91 97760 34567',
    program_id: 'prog-agentic-ai-02',
    program_name: 'Agentic AI Systems & Multi-Agent Swarms',
    batch_id: 'batch-alpha-2026',
    batch_name: 'Batch Alpha 2026 (Bhubaneswar Hub)',
    counselor_name: 'Er. Arpita Senapati',
    status: 'PROVISIONAL_OFFER',
    offer_date: '2026-10-03',
    acceptance_deadline: '2026-10-17',
    scholarship_title: 'Early Bird Engineering Waiver (20%)',
    scholarship_percentage: 20,
    documents_verified: false,
    terms_accepted: false,
    created_at: '2026-10-03T14:00:00Z',
    updated_at: '2026-10-03T14:00:00Z',
    remarks: 'Offer letter dispatched. Awaiting student acceptance & KYC upload.',
  },
];

export const INITIAL_INVOICES: StudentInvoice[] = [
  {
    id: 'inv-01',
    invoice_number: 'INV-2026-0001',
    admission_id: 'adm-01',
    application_id: 'app-01',
    student_name: 'Rohan Patnaik',
    student_email: 'rohan.patnaik@example.com',
    student_phone: '+91 98610 12345',
    billing_address: 'Plot 18, HIG Duplex, Sailashree Vihar',
    billing_city: 'Bhubaneswar',
    billing_state: 'Odisha',
    program_id: 'prog-fde-01',
    program_name: 'Forward Deployment Engineer (FDE) Fellowship',
    issue_date: '2026-10-01',
    due_date: '2026-10-10',
    payment_plan: 'LUMP_SUM',
    items: [
      {
        id: 'item-1',
        description: 'FDE Fellowship Tuition & Systems Curriculum (SAC 999293)',
        sac_code: '999293',
        quantity: 1,
        unit_price_inr: 200000,
        amount_inr: 200000,
      },
      {
        id: 'item-2',
        description: 'Dedicated H100 GPU Cluster Compute Access (SAC 999293)',
        sac_code: '999293',
        quantity: 1,
        unit_price_inr: 50000,
        amount_inr: 50000,
      },
    ],
    subtotal_inr: 250000,
    discount_inr: 100000,
    discount_label: 'Odisha AI Merit Fellowship (40% Waiver)',
    taxable_amount_inr: 150000,
    is_interstate: false,
    cgst_inr: 13500, // 9%
    sgst_inr: 13500, // 9%
    igst_inr: 0,
    total_amount_inr: 177000,
    amount_paid_inr: 177000,
    balance_due_inr: 0,
    status: 'PAID',
    notes: 'Cleared via HDFC Net Banking. LMS enrollment active.',
    created_at: '2026-10-01T10:15:00Z',
    updated_at: '2026-10-02T12:00:00Z',
    payments: [
      {
        id: 'pay-01',
        invoice_id: 'inv-01',
        receipt_number: 'RCPT-2026-0001',
        payment_date: '2026-10-02T12:00:00Z',
        amount_inr: 177000,
        payment_mode: 'NET_BANKING',
        transaction_reference: 'HDFCN261001928410',
        status: 'SUCCESS',
        notes: 'Full tuition fee cleared via HDFC NetBanking.',
        recorded_by: 'Finance Desk',
      },
    ],
  },
  {
    id: 'inv-02',
    invoice_number: 'INV-2026-0002',
    admission_id: 'adm-02',
    application_id: 'app-02',
    student_name: 'Priyanka Mohapatra',
    student_email: 'priyanka.m@example.com',
    student_phone: '+91 94370 23456',
    billing_address: 'B-404, Falcon Residency, Chandrasekharpur',
    billing_city: 'Bhubaneswar',
    billing_state: 'Odisha',
    program_id: 'prog-fde-01',
    program_name: 'Forward Deployment Engineer (FDE) Fellowship',
    issue_date: '2026-10-02',
    due_date: '2026-10-15',
    payment_plan: 'INSTALLMENT_2_PARTS',
    items: [
      {
        id: 'item-1',
        description: 'FDE Fellowship Tranche 1 (Admission & Lab Infrastructure)',
        sac_code: '999293',
        quantity: 1,
        unit_price_inr: 125000,
        amount_inr: 125000,
      },
    ],
    subtotal_inr: 125000,
    discount_inr: 62500,
    discount_label: 'Women in Deep-Tech Grant (50% Waiver)',
    taxable_amount_inr: 62500,
    is_interstate: false,
    cgst_inr: 5625,
    sgst_inr: 5625,
    igst_inr: 0,
    total_amount_inr: 73750,
    amount_paid_inr: 25000,
    balance_due_inr: 48750,
    status: 'PARTIALLY_PAID',
    notes: 'Seat reservation deposit received. Balance due prior to launch.',
    created_at: '2026-10-02T11:20:00Z',
    updated_at: '2026-10-02T16:00:00Z',
    payments: [
      {
        id: 'pay-02',
        invoice_id: 'inv-02',
        receipt_number: 'RCPT-2026-0002',
        payment_date: '2026-10-02T16:00:00Z',
        amount_inr: 25000,
        payment_mode: 'UPI',
        transaction_reference: 'UPI/2610028912/priyanka@okaxis',
        status: 'SUCCESS',
        notes: 'Initial seat booking fee.',
        recorded_by: 'Finance Desk',
      },
    ],
  },
  {
    id: 'inv-03',
    invoice_number: 'INV-2026-0003',
    admission_id: 'adm-03',
    application_id: 'app-03',
    student_name: 'Siddharth Mishra',
    student_email: 'siddharth.m@example.com',
    student_phone: '+91 97760 34567',
    billing_address: 'Flat 302, Cyber Tower Heights, HSR Layout',
    billing_city: 'Bengaluru',
    billing_state: 'Karnataka',
    program_id: 'prog-agentic-ai-02',
    program_name: 'Agentic AI Systems & Multi-Agent Swarms',
    issue_date: '2026-10-03',
    due_date: '2026-10-18',
    payment_plan: 'LUMP_SUM',
    items: [
      {
        id: 'item-1',
        description: 'Agentic AI Systems Master Fellowship (SAC 999293)',
        sac_code: '999293',
        quantity: 1,
        unit_price_inr: 180000,
        amount_inr: 180000,
      },
    ],
    subtotal_inr: 180000,
    discount_inr: 36000,
    discount_label: 'Early Bird Engineering Waiver (20%)',
    taxable_amount_inr: 144000,
    is_interstate: true, // Karnataka to Odisha -> IGST
    cgst_inr: 0,
    sgst_inr: 0,
    igst_inr: 25920, // 18%
    total_amount_inr: 169920,
    amount_paid_inr: 0,
    balance_due_inr: 169920,
    status: 'ISSUED',
    notes: 'Provisional invoice issued. Awaiting online gateway payment.',
    created_at: '2026-10-03T14:10:00Z',
    updated_at: '2026-10-03T14:10:00Z',
    payments: [],
  },
];

// ============================================================
// Service Layer Implementation
// ============================================================

export class AdmissionInvoiceService {
  private static STORAGE_ADMISSIONS = 'tejas_crm_admissions';
  private static STORAGE_INVOICES = 'tejas_crm_invoices';
  private static STORAGE_FEE_STRUCTURES = 'tejas_crm_fee_structures';

  // ── Admissions Methods ──

  static getAdmissions(): StudentAdmission[] {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.STORAGE_ADMISSIONS);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed reading admissions from localStorage', e);
      }
    }
    return INITIAL_ADMISSIONS;
  }

  static saveAdmissions(admissions: StudentAdmission[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_ADMISSIONS, JSON.stringify(admissions));
      } catch (e) {
        console.error('Failed saving admissions to localStorage', e);
      }
    }
  }

  static getAdmissionByApplicationId(applicationId: string): StudentAdmission | undefined {
    return this.getAdmissions().find((a) => a.application_id === applicationId);
  }

  static issueAdmissionOffer(params: {
    application: StudentApplication;
    batchId: string;
    batchName: string;
    scholarshipTitle?: string;
    scholarshipPercentage?: number;
    acceptanceDays?: number;
    remarks?: string;
  }): StudentAdmission {
    const admissions = this.getAdmissions();
    const existing = admissions.find((a) => a.application_id === params.application.id);

    const now = new Date();
    const deadline = new Date();
    deadline.setDate(now.getDate() + (params.acceptanceDays || 14));

    const programPrefix = params.application.program_id.includes('fde')
      ? 'FDE'
      : params.application.program_id.includes('agentic')
      ? 'AG'
      : 'TECH';
    const serial = String(admissions.length + 1).padStart(3, '0');

    const newAdmission: StudentAdmission = {
      id: existing?.id || `adm_${Date.now()}`,
      application_id: params.application.id,
      admission_number: existing?.admission_number || `ADM-2026-${programPrefix}-${serial}`,
      roll_number: existing?.roll_number || `TEJAS-2026-${programPrefix}-${serial}`,
      student_name: params.application.full_name,
      student_email: params.application.email,
      student_phone: params.application.phone,
      program_id: params.application.program_id,
      program_name: params.application.program_title || 'Advanced Deep-Tech Engineering',
      batch_id: params.batchId,
      batch_name: params.batchName,
      counselor_name: params.application.counselor_name || 'Er. Arpita Senapati',
      status: 'PROVISIONAL_OFFER',
      offer_date: now.toISOString().split('T')[0],
      acceptance_deadline: deadline.toISOString().split('T')[0],
      scholarship_title: params.scholarshipTitle || 'Standard Tuition',
      scholarship_percentage: params.scholarshipPercentage || 0,
      documents_verified: false,
      terms_accepted: false,
      created_at: existing?.created_at || now.toISOString(),
      updated_at: now.toISOString(),
      remarks: params.remarks,
    };

    const updated = existing
      ? admissions.map((a) => (a.id === existing.id ? newAdmission : a))
      : [newAdmission, ...admissions];

    this.saveAdmissions(updated);
    return newAdmission;
  }

  static updateAdmissionStatus(
    admissionId: string,
    status: AdmissionStatus,
    patch?: Partial<StudentAdmission>
  ): StudentAdmission | null {
    const admissions = this.getAdmissions();
    const index = admissions.findIndex((a) => a.id === admissionId);
    if (index === -1) return null;

    const updatedItem: StudentAdmission = {
      ...admissions[index],
      status,
      ...patch,
      updated_at: new Date().toISOString(),
    };

    admissions[index] = updatedItem;
    this.saveAdmissions(admissions);
    return updatedItem;
  }

  // ── Invoicing Methods ──

  static getInvoices(): StudentInvoice[] {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.STORAGE_INVOICES);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed reading invoices from localStorage', e);
      }
    }
    return INITIAL_INVOICES;
  }

  static saveInvoices(invoices: StudentInvoice[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_INVOICES, JSON.stringify(invoices));
      } catch (e) {
        console.error('Failed saving invoices to localStorage', e);
      }
    }
  }

  static getInvoicesByApplicationId(applicationId: string): StudentInvoice[] {
    return this.getInvoices().filter((inv) => inv.application_id === applicationId);
  }

  static getInvoiceById(invoiceId: string): StudentInvoice | undefined {
    return this.getInvoices().find((inv) => inv.id === invoiceId);
  }

  static calculateInvoiceGst(params: {
    subtotal: number;
    discount: number;
    state: string;
  }): {
    taxableAmount: number;
    isInterstate: boolean;
    cgst: number;
    sgst: number;
    igst: number;
    totalAmount: number;
  } {
    const taxableAmount = Math.max(0, params.subtotal - params.discount);
    const isInterstate = params.state.trim().toLowerCase() !== 'odisha';

    if (isInterstate) {
      const igst = Math.round(taxableAmount * 0.18);
      return {
        taxableAmount,
        isInterstate: true,
        cgst: 0,
        sgst: 0,
        igst,
        totalAmount: taxableAmount + igst,
      };
    } else {
      const cgst = Math.round(taxableAmount * 0.09);
      const sgst = Math.round(taxableAmount * 0.09);
      return {
        taxableAmount,
        isInterstate: false,
        cgst,
        sgst,
        igst: 0,
        totalAmount: taxableAmount + cgst + sgst,
      };
    }
  }

  static createInvoice(params: {
    application: StudentApplication;
    admissionId?: string;
    items: { description: string; unit_price_inr: number; quantity?: number }[];
    discountInr?: number;
    discountLabel?: string;
    paymentPlan?: PaymentPlanType;
    billingAddress?: string;
    billingCity?: string;
    billingState?: string;
    gstin?: string;
    dueDays?: number;
    notes?: string;
  }): StudentInvoice {
    const invoices = this.getInvoices();
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + (params.dueDays || 10));

    const invoiceNumber = `INV-2026-${String(invoices.length + 1).padStart(4, '0')}`;
    const subtotal = params.items.reduce(
      (sum, item) => sum + item.unit_price_inr * (item.quantity || 1),
      0
    );
    const discount = params.discountInr || 0;
    const state = params.billingState || params.application.city || 'Odisha';

    const taxCalc = this.calculateInvoiceGst({
      subtotal,
      discount,
      state,
    });

    const newInvoice: StudentInvoice = {
      id: `inv_${Date.now()}`,
      invoice_number: invoiceNumber,
      admission_id: params.admissionId,
      application_id: params.application.id,
      student_name: params.application.full_name,
      student_email: params.application.email,
      student_phone: params.application.phone,
      billing_address: params.billingAddress || 'Tech Hub Boulevard, Campus Road',
      billing_city: params.billingCity || params.application.city || 'Bhubaneswar',
      billing_state: state,
      gstin: params.gstin,
      program_id: params.application.program_id,
      program_name: params.application.program_title || 'TEJAS Deep-Tech Specialization',
      issue_date: now.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      payment_plan: params.paymentPlan || 'LUMP_SUM',
      items: params.items.map((item, idx) => ({
        id: `item-${idx + 1}`,
        description: item.description,
        sac_code: '999293',
        quantity: item.quantity || 1,
        unit_price_inr: item.unit_price_inr,
        amount_inr: item.unit_price_inr * (item.quantity || 1),
      })),
      subtotal_inr: subtotal,
      discount_inr: discount,
      discount_label: params.discountLabel,
      taxable_amount_inr: taxCalc.taxableAmount,
      is_interstate: taxCalc.isInterstate,
      cgst_inr: taxCalc.cgst,
      sgst_inr: taxCalc.sgst,
      igst_inr: taxCalc.igst,
      total_amount_inr: taxCalc.totalAmount,
      amount_paid_inr: 0,
      balance_due_inr: taxCalc.totalAmount,
      status: 'ISSUED',
      payments: [],
      notes: params.notes,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    const updated = [newInvoice, ...invoices];
    this.saveInvoices(updated);

    // If an admission was linked, update its status to FEES_PENDING
    if (params.admissionId) {
      this.updateAdmissionStatus(params.admissionId, 'FEES_PENDING');
    }

    return newInvoice;
  }

  static recordPayment(params: {
    invoiceId: string;
    amountInr: number;
    paymentMode: PaymentMode;
    transactionReference?: string;
    notes?: string;
    recordedBy?: string;
  }): { invoice: StudentInvoice; payment: InvoicePayment } | null {
    const invoices = this.getInvoices();
    const index = invoices.findIndex((i) => i.id === params.invoiceId);
    if (index === -1) return null;

    const invoice = invoices[index];
    const receiptNumber = `RCPT-2026-${String(Date.now()).slice(-5)}`;
    const txRef =
      params.transactionReference ||
      `${params.paymentMode}_${Date.now().toString(36).toUpperCase()}`;

    const newPayment: InvoicePayment = {
      id: `pay_${Date.now()}`,
      invoice_id: invoice.id,
      receipt_number: receiptNumber,
      payment_date: new Date().toISOString(),
      amount_inr: params.amountInr,
      payment_mode: params.paymentMode,
      transaction_reference: txRef,
      status: 'SUCCESS',
      notes: params.notes,
      recorded_by: params.recordedBy || 'Finance Desk',
    };

    const newAmountPaid = invoice.amount_paid_inr + params.amountInr;
    const newBalanceDue = Math.max(0, invoice.total_amount_inr - newAmountPaid);
    const newStatus: InvoiceStatus =
      newBalanceDue === 0 ? 'PAID' : newAmountPaid > 0 ? 'PARTIALLY_PAID' : invoice.status;

    const updatedInvoice: StudentInvoice = {
      ...invoice,
      amount_paid_inr: newAmountPaid,
      balance_due_inr: newBalanceDue,
      status: newStatus,
      payments: [newPayment, ...invoice.payments],
      updated_at: new Date().toISOString(),
    };

    invoices[index] = updatedInvoice;
    this.saveInvoices(invoices);

    // If fully paid and linked to an admission, transition admission to ADMITTED
    if (newStatus === 'PAID' && updatedInvoice.admission_id) {
      this.updateAdmissionStatus(updatedInvoice.admission_id, 'ADMITTED', {
        terms_accepted: true,
        documents_verified: true,
      });
    }

    return { invoice: updatedInvoice, payment: newPayment };
  }

  // ── Metrics Calculators ──

  static getAdmissionsMetrics(): AdmissionsMetrics {
    const admissions = this.getAdmissions();
    const total = admissions.length;
    const offersIssued = admissions.filter((a) => a.status === 'PROVISIONAL_OFFER').length;
    const offersAccepted = admissions.filter((a) => a.status === 'OFFER_ACCEPTED').length;
    const feesPending = admissions.filter((a) => a.status === 'FEES_PENDING').length;
    const fullyAdmitted = admissions.filter((a) => a.status === 'ADMITTED').length;

    const conversionRate = total > 0 ? Math.round((fullyAdmitted / total) * 100) : 0;

    return {
      total_applications: total,
      offers_issued: offersIssued,
      offers_accepted: offersAccepted,
      fees_pending: feesPending,
      fully_admitted: fullyAdmitted,
      conversion_rate: conversionRate,
    };
  }

  static getInvoicesMetrics(): InvoicesMetrics {
    const invoices = this.getInvoices();
    const totalInvoiced = invoices.reduce((s, i) => s + i.total_amount_inr, 0);
    const collectedRevenue = invoices.reduce((s, i) => s + i.amount_paid_inr, 0);
    const outstanding = invoices.reduce((s, i) => s + i.balance_due_inr, 0);

    const now = new Date();
    const overdue = invoices
      .filter((i) => i.status !== 'PAID' && new Date(i.due_date) < now)
      .reduce((s, i) => s + i.balance_due_inr, 0);

    const paidCount = invoices.filter((i) => i.status === 'PAID').length;
    const pendingCount = invoices.filter((i) => i.status !== 'PAID' && i.status !== 'CANCELLED').length;

    return {
      total_invoiced_inr: totalInvoiced,
      collected_revenue_inr: collectedRevenue,
      outstanding_balance_inr: outstanding,
      overdue_inr: overdue,
      total_invoices_count: invoices.length,
      paid_invoices_count: paidCount,
      pending_invoices_count: pendingCount,
    };
  }

  // ── Fee Structures ──

  static getFeeStructures(): FeeStructure[] {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.STORAGE_FEE_STRUCTURES);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_FEE_STRUCTURES;
  }
}
