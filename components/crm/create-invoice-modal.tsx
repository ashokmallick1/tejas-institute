'use client';

import React, { useState, useMemo } from 'react';
import { StudentApplication } from '@/types';
import { StudentAdmission, PaymentPlanType, StudentInvoice } from '@/types/admission-invoice';
import { AdmissionInvoiceService } from '@/lib/crm/admission-invoice-service';
import { PROGRAMS } from '@/lib/data/programs';
import {
  X,
  FilePlus,
  Building,
  CheckCircle2,
  Percent,
  CreditCard,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CreateInvoiceModalProps {
  initialApplication?: StudentApplication | null;
  initialAdmission?: StudentAdmission | null;
  applications: StudentApplication[];
  onClose: () => void;
  onInvoiceCreated: (invoice: StudentInvoice) => void;
}

export function CreateInvoiceModal({
  initialApplication,
  initialAdmission,
  applications,
  onClose,
  onInvoiceCreated,
}: CreateInvoiceModalProps) {
  const [selectedAppId, setSelectedAppId] = useState<string>(
    initialApplication?.id || initialAdmission?.application_id || applications[0]?.id || ''
  );

  const selectedApp = useMemo(() => {
    return applications.find((a) => a.id === selectedAppId) || initialApplication || null;
  }, [applications, selectedAppId, initialApplication]);

  const [programTitle, setProgramTitle] = useState<string>(
    selectedApp?.program_title || 'Forward Deployment Engineer (FDE) Fellowship'
  );
  const [baseTuition, setBaseTuition] = useState<number>(250000);
  const [includeComputeLab, setIncludeComputeLab] = useState<boolean>(true);
  const computeLabFee = 50000;

  const [scholarshipPercent, setScholarshipPercent] = useState<number>(
    initialAdmission?.scholarship_percentage || (selectedApp?.deal_value_inr && selectedApp.deal_value_inr < 200000 ? 30 : 0)
  );
  const [scholarshipLabel, setScholarshipLabel] = useState<string>(
    initialAdmission?.scholarship_title || 'Merit Waiver'
  );

  const [billingState, setBillingState] = useState<string>(selectedApp?.city || 'Odisha');
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanType>('LUMP_SUM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Calculations
  const subtotal = baseTuition + (includeComputeLab ? computeLabFee : 0);
  const discountInr = Math.round((subtotal * scholarshipPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountInr);
  const isInterstate = billingState.trim().toLowerCase() !== 'odisha';
  const gstAmount = Math.round(taxableAmount * 0.18);
  const totalAmount = taxableAmount + gstAmount;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsSubmitting(true);

    const items = [
      {
        description: `${programTitle} — Curriculum & Mentor Retainer (SAC 999293)`,
        unit_price_inr: baseTuition,
        quantity: 1,
      },
    ];

    if (includeComputeLab) {
      items.push({
        description: 'Dedicated A100/H100 GPU Cluster Compute Lab Allocation (SAC 999293)',
        unit_price_inr: computeLabFee,
        quantity: 1,
      });
    }

    const newInvoice = AdmissionInvoiceService.createInvoice({
      application: selectedApp,
      admissionId: initialAdmission?.id,
      items,
      discountInr,
      discountLabel: scholarshipPercent > 0 ? `${scholarshipLabel} (${scholarshipPercent}%)` : undefined,
      paymentPlan,
      billingState,
      billingCity: selectedApp.city || 'Bhubaneswar',
      notes: `Generated via TEJAS Admissions Console for cohort registration.`,
    });

    setIsSubmitting(false);
    onInvoiceCreated(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-y-auto my-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tejas-blue/15 border border-tejas-blue/30 text-tejas-blue">
              <FilePlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground font-display">
                Generate Student Tax Invoice
              </h3>
              <p className="text-xs text-muted-foreground">
                GST Compliant (SAC 999293) · Auto-links to Admissions &amp; CRM
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

        <form onSubmit={handleGenerate} className="mt-4 space-y-4 text-xs">
          {/* Select Candidate */}
          <div>
            <label className="block font-bold text-foreground mb-1">
              Select Candidate / Student <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.full_name} ({app.email}) — {app.program_title || 'General'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">Academic Program</label>
              <input
                type="text"
                value={programTitle}
                onChange={(e) => setProgramTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-foreground mb-1">Base Tuition (INR)</label>
              <input
                type="number"
                value={baseTuition}
                onChange={(e) => setBaseTuition(Number(e.target.value))}
                required
                className="w-full rounded-xl border border-border bg-background p-2.5 font-mono text-xs text-foreground focus:border-tejas-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Compute Infrastructure Lab Addon */}
          <div className="rounded-xl border border-border bg-muted/20 p-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-foreground">Include A100/H100 GPU Cloud Lab Compute</div>
              <div className="text-[11px] text-muted-foreground">Dedicated cluster hours for autonomous agent models (₹50,000)</div>
            </div>
            <input
              type="checkbox"
              checked={includeComputeLab}
              onChange={(e) => setIncludeComputeLab(e.target.checked)}
              className="h-4 w-4 rounded border-border text-tejas-blue focus:ring-tejas-blue cursor-pointer"
            />
          </div>

          {/* Scholarship & Concessions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">
                Scholarship Waiver (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={scholarshipPercent}
                  onChange={(e) => setScholarshipPercent(Number(e.target.value))}
                  className="w-24 rounded-xl border border-border bg-background p-2.5 font-mono text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                />
                <span className="text-muted-foreground">%</span>
                <span className="font-mono text-emerald-400 font-bold text-[11px]">
                  - ₹{discountInr.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div>
              <label className="block font-bold text-foreground mb-1">Scholarship Title / Grant</label>
              <input
                type="text"
                placeholder="e.g. Odisha AI Merit Fellowship"
                value={scholarshipLabel}
                onChange={(e) => setScholarshipLabel(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Billing Location & Payment Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-foreground mb-1">
                Billing State (GST Treatment)
              </label>
              <select
                value={billingState}
                onChange={(e) => setBillingState(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
              >
                <option value="Odisha">Odisha (Intra-state: 9% CGST + 9% SGST)</option>
                <option value="Karnataka">Karnataka (Inter-state: 18% IGST)</option>
                <option value="Maharashtra">Maharashtra (Inter-state: 18% IGST)</option>
                <option value="Delhi">Delhi (Inter-state: 18% IGST)</option>
                <option value="Telangana">Telangana (Inter-state: 18% IGST)</option>
                <option value="West Bengal">West Bengal (Inter-state: 18% IGST)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-foreground mb-1">Payment Schedule Plan</label>
              <select
                value={paymentPlan}
                onChange={(e) => setPaymentPlan(e.target.value as PaymentPlanType)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
              >
                <option value="LUMP_SUM">Full Payment (Single Tranche)</option>
                <option value="INSTALLMENT_2_PARTS">2-Part Installment (50% : 50%)</option>
                <option value="INSTALLMENT_3_PARTS">3-Part Installment (Seat : 40% : 30%)</option>
              </select>
            </div>
          </div>

          {/* Real-Time Financial Summary Preview */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Standard Subtotal:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountInr > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Scholarship Concession ({scholarshipPercent}%):</span>
                <span>- ₹{discountInr.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-foreground font-bold border-t border-border pt-1">
              <span>Taxable Service Value:</span>
              <span>₹{taxableAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>
                GST 18% ({isInterstate ? 'IGST' : 'CGST 9% + SGST 9%'}):
              </span>
              <span>₹{gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-base font-black text-foreground border-t-2 border-border pt-1.5">
              <span>Net Invoice Total:</span>
              <span className="text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
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
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-tejas-blue to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-tejas-blue/20 hover:opacity-95 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Invoice...' : 'Generate Official Tax Invoice'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
