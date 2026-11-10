'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Receipt,
  CreditCard,
  Search,
  Filter,
  Plus,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  Download,
  Calendar,
  ExternalLink,
  GraduationCap,
  Sparkles,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { StudentInvoice, InvoiceStatus } from '@/types/admission-invoice';
import { AdmissionInvoiceService } from '@/lib/crm/admission-invoice-service';
import { useLms } from '@/lib/store/lms-store';
import { PrintableInvoiceModal } from '@/components/crm/printable-invoice-modal';
import { RecordPaymentModal } from '@/components/crm/record-payment-modal';
import { CreateInvoiceModal } from '@/components/crm/create-invoice-modal';

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/30',
  },
  ISSUED: {
    label: 'Issued & Unpaid',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  PARTIALLY_PAID: {
    label: 'Partially Paid',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  PAID: {
    label: 'Fully Paid',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  OVERDUE: {
    label: 'Overdue',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/30',
  },
};

export default function InvoicesPage() {
  const { applications } = useLms();
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<StudentInvoice | null>(null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<StudentInvoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const refreshInvoices = () => {
    setInvoices(AdmissionInvoiceService.getInvoices());
  };

  useEffect(() => {
    refreshInvoices();
  }, []);

  const metrics = useMemo(() => {
    return AdmissionInvoiceService.getInvoicesMetrics();
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.student_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.program_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const handlePaymentSuccess = () => {
    refreshInvoices();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
              Invoice Ninja &amp; GST Standard
            </span>
            <span className="text-xs text-muted-foreground font-mono">SAC 999293 · Technical Education</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground font-display">
            Student Invoices &amp; Fee Billing
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage tax invoices, scholarship deductions, GST calculations, installment schedules, and payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/crm/admissions"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <GraduationCap className="h-3.5 w-3.5 text-amber-400" />
            <span>Admissions Dossiers</span>
          </Link>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* ── Revenue Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Total Invoiced</span>
            <Receipt className="h-4 w-4 text-tejas-blue" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground font-display font-mono">
            ₹{metrics.total_invoiced_inr.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Across {metrics.total_invoices_count} student invoices
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Collected Revenue</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-display font-mono">
            ₹{metrics.collected_revenue_inr.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {metrics.paid_invoices_count} invoices cleared in full
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Outstanding Balance</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400 font-display font-mono">
            ₹{metrics.outstanding_balance_inr.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            {metrics.pending_invoices_count} pending installments
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Overdue Receivables</span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-400 font-display font-mono">
            ₹{metrics.overdue_inr.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Past payment due deadline
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by student name, invoice number, program, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-card p-2 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
        >
          <option value="ALL">All Invoice Statuses</option>
          <option value="PAID">Fully Paid</option>
          <option value="PARTIALLY_PAID">Partially Paid</option>
          <option value="ISSUED">Issued &amp; Pending</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {/* ── Invoices Table ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Fellow / Student</th>
                <th className="py-3 px-4">Program &amp; Plan</th>
                <th className="py-3 px-4 text-right">Net Total</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No student invoices found matching the current criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const st = STATUS_CONFIG[inv.status] || STATUS_CONFIG.ISSUED;
                  const isPaid = inv.status === 'PAID';

                  return (
                    <tr key={inv.id} className="transition hover:bg-muted/30">
                      {/* Invoice Number & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-foreground">
                          {inv.invoice_number}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          Due: {new Date(inv.due_date).toLocaleDateString('en-IN')}
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">{inv.student_name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono truncate max-w-xs">
                          {inv.student_email}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {inv.billing_city}, {inv.billing_state}
                        </div>
                      </td>

                      {/* Program & Plan */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground max-w-xs truncate">
                          {inv.program_name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          Plan: {inv.payment_plan.replace(/_/g, ' ')}
                        </div>
                        {inv.discount_inr > 0 && (
                          <div className="text-[10px] text-emerald-400 font-bold">
                            Less: ₹{inv.discount_inr.toLocaleString('en-IN')} ({inv.discount_label})
                          </div>
                        )}
                      </td>

                      {/* Net Total */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground whitespace-nowrap">
                        ₹{inv.total_amount_inr.toLocaleString('en-IN')}
                      </td>

                      {/* Paid */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                        ₹{inv.amount_paid_inr.toLocaleString('en-IN')}
                      </td>

                      {/* Balance Due */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-400 whitespace-nowrap">
                        ₹{inv.balance_due_inr.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${st.bg} ${st.text} ${st.border}`}
                        >
                          <span>{st.label}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoiceForPrint(inv)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background hover:bg-muted px-2.5 py-1 text-xs font-bold text-foreground transition"
                            title="View / Print Tax Invoice"
                          >
                            <Printer className="h-3 w-3 text-tejas-blue" />
                            <span>View</span>
                          </button>

                          {!isPaid && (
                            <button
                              onClick={() => setSelectedInvoiceForPayment(inv)}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white transition shadow-xs"
                              title="Record Payment Entry"
                            >
                              <CreditCard className="h-3 w-3" />
                              <span>Pay</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: View / Print Tax Invoice ── */}
      <PrintableInvoiceModal
        invoice={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
        onRecordPaymentClick={(inv) => {
          setSelectedInvoiceForPrint(null);
          setSelectedInvoiceForPayment(inv);
        }}
      />

      {/* ── Modal: Record Payment ── */}
      <RecordPaymentModal
        invoice={selectedInvoiceForPayment}
        onClose={() => setSelectedInvoiceForPayment(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* ── Modal: Create New Invoice ── */}
      {isCreateModalOpen && (
        <CreateInvoiceModal
          applications={applications}
          onClose={() => setIsCreateModalOpen(false)}
          onInvoiceCreated={() => {
            refreshInvoices();
          }}
        />
      )}
    </div>
  );
}
