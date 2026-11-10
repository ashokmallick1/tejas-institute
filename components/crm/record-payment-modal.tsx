'use client';

import React, { useState } from 'react';
import { StudentInvoice, PaymentMode } from '@/types/admission-invoice';
import {
  X,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Building,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface RecordPaymentModalProps {
  invoice: StudentInvoice | null;
  onClose: () => void;
  onPaymentSuccess: (invoiceId: string, amount: number) => void;
}

export function RecordPaymentModal({
  invoice,
  onClose,
  onPaymentSuccess,
}: RecordPaymentModalProps) {
  if (!invoice) return null;

  const [amount, setAmount] = useState<number>(invoice.balance_due_inr);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError('Please enter a valid positive payment amount');
      return;
    }
    if (amount > invoice.balance_due_inr) {
      setError(`Payment cannot exceed outstanding balance of ₹${invoice.balance_due_inr.toLocaleString('en-IN')}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/crm/invoices/${invoice.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountInr: amount,
          paymentMode,
          transactionReference: reference || `${paymentMode}_${Date.now().toString(36).toUpperCase()}`,
          notes,
          recordedBy: 'Finance Desk',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to record payment');
      }

      onPaymentSuccess(invoice.id, amount);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong while recording payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">
                Record Fee Payment
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                Invoice {invoice.invoice_number} · {invoice.student_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Invoice Balance Summary Banner */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 rounded-xl border border-border bg-muted/30 p-3 text-xs">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground font-bold">Total Invoiced</div>
            <div className="font-mono font-bold text-foreground mt-0.5">₹{invoice.total_amount_inr.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground font-bold">Paid So Far</div>
            <div className="font-mono font-bold text-emerald-400 mt-0.5">₹{invoice.amount_paid_inr.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground font-bold">Balance Due</div>
            <div className="font-mono font-bold text-rose-400 mt-0.5">₹{invoice.balance_due_inr.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-foreground mb-1">
              Payment Amount (INR) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground font-bold">₹</span>
              <input
                type="number"
                min="1"
                max={invoice.balance_due_inr}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full rounded-xl border border-border bg-background py-2 pl-8 pr-3 font-mono text-sm text-foreground focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => setAmount(invoice.balance_due_inr)}
                className="text-[11px] text-emerald-400 hover:underline font-semibold"
              >
                Clear Full Balance (₹{invoice.balance_due_inr.toLocaleString('en-IN')})
              </button>
              {invoice.balance_due_inr > 25000 && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <button
                    type="button"
                    onClick={() => setAmount(25000)}
                    className="text-[11px] text-muted-foreground hover:underline"
                  >
                    Seat Booking Deposit (₹25,000)
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1">Payment Method / Gateway</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-emerald-500 focus:outline-none"
            >
              <option value="UPI">UPI (Google Pay / PhonePe / QR Code)</option>
              <option value="NET_BANKING">Net Banking (HDFC / ICICI / SBI)</option>
              <option value="RAZORPAY_GATEWAY">Razorpay Online Payment Gateway</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="NEFT_RTGS">NEFT / RTGS Wire Transfer</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1">
              Transaction Reference / UTR Number
            </label>
            <input
              type="text"
              placeholder="e.g. UTR / Razorpay Payment ID: pay_9821873192"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-2.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-foreground mb-1">Internal Notes</label>
            <input
              type="text"
              placeholder="e.g. Cleared by candidate via WhatsApp link"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:opacity-95 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Confirm Payment & Issue Receipt'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
