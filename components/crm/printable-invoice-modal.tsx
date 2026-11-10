'use client';

import React, { useRef } from 'react';
import { StudentInvoice } from '@/types/admission-invoice';
import {
  X,
  Printer,
  Download,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  QrCode,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface PrintableInvoiceModalProps {
  invoice: StudentInvoice | null;
  onClose: () => void;
  onRecordPaymentClick?: (invoice: StudentInvoice) => void;
}

export function PrintableInvoiceModal({
  invoice,
  onClose,
  onRecordPaymentClick,
}: PrintableInvoiceModalProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.status === 'PAID';
  const isPartiallyPaid = invoice.status === 'PARTIALLY_PAID';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden my-auto">
        {/* Modal Controls Header (Screen Only) */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5 no-print">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-tejas-blue" />
            <span className="text-sm font-bold text-foreground">
              Tax Invoice — {invoice.invoice_number}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                isPaid
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : isPartiallyPaid
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {invoice.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isPaid && onRecordPaymentClick && (
              <button
                onClick={() => onRecordPaymentClick(invoice)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
              >
                <CreditCard className="h-3.5 w-3.5" />
                <span>Record Payment</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div
          ref={printAreaRef}
          className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-zinc-900 font-sans print:p-0 print:m-0"
        >
          {/* Header & Institute Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-zinc-200 pb-6">
            <div className="flex items-start gap-3.5">
              <div className="h-14 w-14 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-black text-xl tracking-tighter shrink-0 shadow-md">
                TJ
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-zinc-950 font-display">
                  TEJAS INSTITUTE OF DEEP TECHNOLOGIES
                </h1>
                <p className="text-xs text-zinc-600 max-w-sm mt-0.5 leading-relaxed">
                  Advanced Engineering Fellowship &amp; Research Labs<br />
                  Plot 42, Infocity Avenue, Patia, Bhubaneswar, Odisha — 751024<br />
                  <strong>GSTIN:</strong> 21AAACT9821Q1ZU &nbsp;|&nbsp; <strong>State Code:</strong> 21 (Odisha)
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block rounded-md bg-zinc-900 text-white px-2.5 py-1 text-xs font-black uppercase tracking-wider">
                TAX INVOICE
              </span>
              <div className="mt-2 text-xs text-zinc-600 space-y-0.5">
                <div><strong>Invoice No:</strong> <span className="font-mono font-bold text-zinc-950">{invoice.invoice_number}</span></div>
                <div><strong>Date of Issue:</strong> {new Date(invoice.issue_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                <div><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                <div><strong>SAC Code:</strong> <span className="font-mono">999293</span> (Technical Training)</div>
              </div>
            </div>
          </div>

          {/* Student Billing & Academic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
            <div>
              <div className="font-bold uppercase tracking-wider text-zinc-500 text-[10px] mb-1">
                Billed To (Fellow / Student)
              </div>
              <div className="text-sm font-black text-zinc-950">{invoice.student_name}</div>
              <div className="text-zinc-600 mt-0.5">{invoice.billing_address}</div>
              <div className="text-zinc-600">{invoice.billing_city}, {invoice.billing_state}</div>
              <div className="text-zinc-600 font-mono mt-1">
                Email: {invoice.student_email} &nbsp;|&nbsp; Ph: {invoice.student_phone}
              </div>
              {invoice.gstin && (
                <div className="text-zinc-700 font-mono mt-0.5">
                  <strong>Corporate GSTIN:</strong> {invoice.gstin}
                </div>
              )}
            </div>

            <div className="sm:border-l sm:border-zinc-200 sm:pl-6">
              <div className="font-bold uppercase tracking-wider text-zinc-500 text-[10px] mb-1">
                Academic Program &amp; Terms
              </div>
              <div className="text-sm font-bold text-zinc-950">{invoice.program_name}</div>
              <div className="text-zinc-600 mt-0.5">
                <strong>Payment Plan:</strong> {invoice.payment_plan.replace(/_/g, ' ')}
              </div>
              <div className="text-zinc-600 mt-0.5">
                <strong>Cohort:</strong> Batch Alpha 2026 (Live Bhubaneswar Lab)
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="font-bold text-zinc-700">Payment Status:</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wide ${
                  isPaid ? 'bg-emerald-100 text-emerald-800' : isPartiallyPaid ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                }`}>
                  {invoice.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-zinc-900 bg-zinc-100 text-zinc-900 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-10">#</th>
                <th className="py-2.5 px-3">Description of Services</th>
                <th className="py-2.5 px-3 text-center w-24">SAC Code</th>
                <th className="py-2.5 px-3 text-center w-16">Qty</th>
                <th className="py-2.5 px-3 text-right w-28">Rate (₹)</th>
                <th className="py-2.5 px-3 text-right w-28">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {invoice.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-3 px-3 font-mono text-zinc-500">{index + 1}</td>
                  <td className="py-3 px-3 font-semibold text-zinc-950">{item.description}</td>
                  <td className="py-3 px-3 text-center font-mono text-zinc-600">{item.sac_code}</td>
                  <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono">₹{item.unit_price_inr.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-zinc-950">₹{item.amount_inr.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & GST Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-4 border-t-2 border-zinc-200 text-xs">
            {/* Bank & Remittance Instructions */}
            <div className="rounded-xl border border-zinc-200 p-4 bg-zinc-50 space-y-2">
              <div className="font-black uppercase tracking-wider text-zinc-900 text-[11px] flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-zinc-700" />
                <span>Institute Bank Remittance Account</span>
              </div>
              <div className="text-[11px] text-zinc-700 space-y-1 font-mono">
                <div><strong>Bank:</strong> HDFC Bank Ltd.</div>
                <div><strong>A/C Name:</strong> TEJAS INSTITUTE OF DEEP TECH</div>
                <div><strong>A/C No:</strong> 50200089217412 (Current A/C)</div>
                <div><strong>IFSC Code:</strong> HDFC0001234 (Patia Branch)</div>
                <div><strong>UPI ID:</strong> tejas.institute@hdfcbank</div>
              </div>
              <div className="pt-2 border-t border-zinc-200 text-[10px] text-zinc-500">
                Payment note must include Invoice Number: <strong>{invoice.invoice_number}</strong>
              </div>
            </div>

            {/* Calculations Table */}
            <div className="space-y-1.5 text-right font-mono text-xs">
              <div className="flex justify-between py-1 text-zinc-700">
                <span>Subtotal (Standard Tuition):</span>
                <span>₹{invoice.subtotal_inr.toLocaleString('en-IN')}</span>
              </div>

              {invoice.discount_inr > 0 && (
                <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                  <span>Less Scholarship / Grant ({invoice.discount_label || 'Merit Waiver'}):</span>
                  <span>- ₹{invoice.discount_inr.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-t border-zinc-200 text-zinc-900 font-bold">
                <span>Net Taxable Value:</span>
                <span>₹{invoice.taxable_amount_inr.toLocaleString('en-IN')}</span>
              </div>

              {!invoice.is_interstate ? (
                <>
                  <div className="flex justify-between py-0.5 text-zinc-600">
                    <span>CGST (9%):</span>
                    <span>₹{invoice.cgst_inr.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-0.5 text-zinc-600">
                    <span>SGST (9%):</span>
                    <span>₹{invoice.sgst_inr.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-0.5 text-zinc-600">
                  <span>IGST (18% - Interstate):</span>
                  <span>₹{invoice.igst_inr.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between py-2 border-t-2 border-zinc-900 text-sm font-black text-zinc-950">
                <span>Total Amount Due (INR):</span>
                <span>₹{invoice.total_amount_inr.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-1 text-emerald-700 font-bold border-t border-zinc-200">
                <span>Total Amount Paid:</span>
                <span>₹{invoice.amount_paid_inr.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-1.5 text-sm font-black text-rose-600 border-t border-zinc-300">
                <span>Balance Due:</span>
                <span>₹{invoice.balance_due_inr.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Payment Receipts History Table (if payments recorded) */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div className="mt-6 pt-4 border-t border-zinc-200">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-2">
                Recorded Payment Receipts
              </h3>
              <div className="rounded-xl border border-zinc-200 overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-100 text-zinc-700 border-b border-zinc-200">
                    <tr>
                      <th className="p-2">Receipt No</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Mode</th>
                      <th className="p-2">Reference / UTR</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {invoice.payments.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2 font-bold text-zinc-950">{p.receipt_number}</td>
                        <td className="p-2 text-zinc-600">
                          {new Date(p.payment_date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="p-2 text-zinc-700">{p.payment_mode}</td>
                        <td className="p-2 text-zinc-600 truncate max-w-xs">{p.transaction_reference}</td>
                        <td className="p-2 text-right font-bold text-emerald-700">
                          ₹{p.amount_inr.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer & Digital Verification Seal */}
          <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded border border-zinc-300 bg-zinc-50 flex items-center justify-center">
                <QrCode className="h-7 w-7 text-zinc-700" />
              </div>
              <div className="text-[10px] leading-tight text-zinc-600">
                <strong className="text-zinc-900">Tamper-Proof Verification</strong><br />
                Scannable cryptographic hash registered on TEJAS Ledger.<br />
                Verification URL: verify.tejas.ac.in/inv/{invoice.invoice_number}
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-serif italic text-zinc-800 text-sm font-semibold">
                Subhashree Dash, Ph.D.
              </div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                Authorized Signatory · Finance Controller
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
