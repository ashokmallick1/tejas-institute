'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building,
  GraduationCap,
  Receipt,
  Layers,
  CheckCircle2,
  Percent,
  Clock,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { INITIAL_FEE_STRUCTURES } from '@/lib/crm/admission-invoice-service';

export default function FeeStructuresPage() {
  const feeStructures = INITIAL_FEE_STRUCTURES;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center rounded-md bg-purple-500/15 border border-purple-500/30 px-2 text-[10px] font-black text-purple-400 uppercase tracking-wider">
              Frappe Education ERP
            </span>
            <span className="text-xs text-muted-foreground font-mono">Fee Category &amp; Fee Structure Registry</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground font-display">
            Program Fee Structures
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Standardized fee components, SAC 999293 GST taxation rules, compute lab allocations, and installment schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/crm/invoices"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <Receipt className="h-3.5 w-3.5 text-tejas-blue" />
            <span>View Invoices</span>
          </Link>
          <Link
            href="/crm/admissions"
            className="flex items-center gap-1.5 rounded-xl bg-tejas-blue/15 border border-tejas-blue/30 px-4 py-2 text-xs font-bold text-tejas-blue hover:bg-tejas-blue/25 transition"
          >
            <GraduationCap className="h-4 w-4" />
            <span>Admissions Console</span>
          </Link>
        </div>
      </div>

      {/* ── Fee Structures Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeStructures.map((fs) => (
          <div
            key={fs.id}
            className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between shadow-xs transition hover:border-tejas-blue/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground font-bold">
                  AY {fs.academic_year}
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] font-black text-emerald-400">
                  SAC {fs.hsn_sac_code} (18% GST)
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold text-foreground font-display">
                {fs.program_name}
              </h2>
              <div className="mt-2 text-2xl font-black font-mono text-foreground">
                ₹{fs.base_tuition_inr.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-muted-foreground"> / fellowship</span>
              </div>

              {/* Components Breakdown */}
              <div className="mt-5 space-y-2.5 pt-4 border-t border-border">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Itemized Fee Components (Frappe Category):
                </div>
                {fs.components.map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-start justify-between gap-2 rounded-xl bg-muted/30 p-2.5 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-foreground">{comp.name}</div>
                      <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                        {comp.description}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-foreground shrink-0 text-right">
                      ₹{comp.amount_inr.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Installment Plans */}
              <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                <span className="font-bold text-foreground">Approved Payment Plans:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5 font-mono text-[10px]">
                  {fs.allowed_plans.map((plan) => (
                    <span
                      key={plan}
                      className="rounded bg-muted px-2 py-0.5 border border-border text-foreground"
                    >
                      {plan.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>GST Tax Invoiced</span>
              </span>
              <Link
                href="/crm/admissions"
                className="flex items-center gap-1 text-xs font-bold text-tejas-blue hover:underline"
              >
                <span>Issue Candidate Offer</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
