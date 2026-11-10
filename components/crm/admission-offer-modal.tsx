'use client';

import React from 'react';
import { StudentAdmission } from '@/types/admission-invoice';
import {
  X,
  Printer,
  Download,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  UserCheck,
  Building,
} from 'lucide-react';

interface AdmissionOfferModalProps {
  admission: StudentAdmission | null;
  onClose: () => void;
  onAcceptOffer?: (admissionId: string) => void;
  onGenerateInvoiceClick?: (admission: StudentAdmission) => void;
}

export function AdmissionOfferModal({
  admission,
  onClose,
  onAcceptOffer,
  onGenerateInvoiceClick,
}: AdmissionOfferModalProps) {
  if (!admission) return null;

  const handlePrint = () => {
    window.print();
  };

  const isAccepted =
    admission.status === 'OFFER_ACCEPTED' ||
    admission.status === 'ADMITTED' ||
    admission.status === 'FEES_PENDING';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden my-auto">
        {/* Controls Header (Screen Only) */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5 no-print">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-bold text-foreground">
              Official Admission Offer Dossier — {admission.admission_number}
            </span>
            <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-black text-amber-400 uppercase tracking-wider">
              {admission.status.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isAccepted && onAcceptOffer && (
              <button
                onClick={() => onAcceptOffer(admission.id)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Accept Offer on Behalf of Fellow</span>
              </button>
            )}
            {onGenerateInvoiceClick && (
              <button
                onClick={() => onGenerateInvoiceClick(admission)}
                className="flex items-center gap-1.5 rounded-lg bg-tejas-blue/15 hover:bg-tejas-blue/25 border border-tejas-blue/30 px-3 py-1.5 text-xs font-bold text-tejas-blue transition"
              >
                <span>Generate Tuition Invoice</span>
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

        {/* Formal Offer Letter Paper */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 bg-white text-zinc-900 font-serif print:p-0 print:m-0">
          {/* Header */}
          <div className="text-center border-b-2 border-zinc-900 pb-6">
            <div className="mx-auto h-12 w-12 rounded-xl bg-zinc-900 text-white font-sans font-black text-xl flex items-center justify-center mb-2 shadow">
              TJ
            </div>
            <h1 className="text-2xl font-black font-sans uppercase tracking-tight text-zinc-950">
              TEJAS INSTITUTE OF DEEP TECHNOLOGIES
            </h1>
            <p className="text-xs font-sans text-zinc-600 tracking-wider uppercase mt-1">
              Bhubaneswar Campus · Autonomous Systems &amp; Advanced Engineering Hub
            </p>
            <p className="text-[11px] font-sans text-zinc-500 mt-0.5">
              Ref: {admission.admission_number} &nbsp;|&nbsp; Roll No: <strong className="text-zinc-950">{admission.roll_number}</strong>
            </p>
          </div>

          {/* Date & Addressee */}
          <div className="my-6 font-sans text-xs flex justify-between items-start text-zinc-800">
            <div>
              <p><strong>To:</strong></p>
              <p className="text-sm font-bold text-zinc-950 font-serif">{admission.student_name}</p>
              <p className="text-zinc-600 font-mono">{admission.student_email}</p>
              <p className="text-zinc-600 font-mono">{admission.student_phone}</p>
            </div>
            <div className="text-right">
              <p><strong>Date of Issuance:</strong> {new Date(admission.offer_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              <p><strong>Acceptance Valid Until:</strong> <span className="text-red-700 font-bold">{new Date(admission.acceptance_deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span></p>
            </div>
          </div>

          {/* Subject Line */}
          <div className="my-4 font-sans text-xs bg-zinc-100 p-3 rounded-lg border border-zinc-200">
            <strong>SUBJECT:</strong> Provisional Offer of Admission &amp; Fellowship Fellowship Award for{' '}
            <span className="text-zinc-950 font-black">{admission.program_name}</span> ({admission.batch_name})
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-xs sm:text-[13px] leading-relaxed text-zinc-800 text-justify">
            <p>
              Dear <strong>{admission.student_name}</strong>,
            </p>

            <p>
              On behalf of the Academic Admissions Committee and the Directorate of TEJAS Institute of Deep Technologies,
              we are delighted to offer you formal provisional admission into the <strong>{admission.program_name}</strong>,
              allocated to <strong>{admission.batch_name}</strong>.
            </p>

            <p>
              Your candidacy stood out remarkably during our rigorous technical evaluation and portfolio triage. You demonstrated
              the analytical rigor, foundational engineering depth, and problem-solving tenacity required to operate at the frontiers
              of production deep technologies.
            </p>

            {/* Scholarship Callout */}
            {admission.scholarship_percentage > 0 && (
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 my-3 font-sans text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span>Merit Fellowship Award: {admission.scholarship_title}</span>
                </div>
                <p className="text-zinc-700 text-[11px] leading-relaxed">
                  In recognition of your exceptional performance, the Academic Directorate has approved a{' '}
                  <strong className="text-amber-900 font-bold">{admission.scholarship_percentage}% Tuition Fee Waiver</strong> for your fellowship.
                  This scholarship will be automatically credited across your program fee schedule.
                </p>
              </div>
            )}

            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-zinc-900 pt-2">
              Key Fellowship Provisions &amp; Milestone Obligations:
            </h3>

            <ol className="list-decimal pl-5 space-y-1.5 font-sans text-xs text-zinc-700">
              <li>
                <strong>Academic Standing &amp; Integrity:</strong> Fellows must maintain a minimum of 85% attendance and active code contributions to designated industrial git repositories.
              </li>
              <li>
                <strong>High-Density Compute Lab Access:</strong> You are granted dedicated compute credentials for our A100/H100 clusters strictly for curriculum-assigned agentic modeling and distributed deployments.
              </li>
              <li>
                <strong>Capstone Defense &amp; Ledger Verification:</strong> Graduation and verifiable cryptographic certificate issuance are contingent upon defending your real-life industrial projects before the Faculty Board.
              </li>
              <li>
                <strong>Acceptance &amp; Seat Confirmation:</strong> Please execute acceptance of this offer and complete your seat reservation deposit by <strong>{new Date(admission.acceptance_deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong> to secure your cohort bench.
              </li>
            </ol>

            <p>
              We look forward to welcoming you to the TEJAS Research Labs in Bhubaneswar.
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-10 pt-6 border-t-2 border-zinc-200 grid grid-cols-2 gap-8 font-sans text-xs">
            <div>
              <div className="font-serif italic text-sm font-semibold text-zinc-900">
                Dr. Subhashree Dash, Ph.D.
              </div>
              <div className="text-[11px] font-bold text-zinc-900">Dean of Academic Affairs</div>
              <div className="text-[10px] text-zinc-500">TEJAS Institute of Deep Technologies</div>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-sm font-semibold text-zinc-900">
                Er. Arpita Senapati
              </div>
              <div className="text-[11px] font-bold text-zinc-900">Lead, Admissions &amp; Fellow Onboarding</div>
              <div className="text-[10px] text-zinc-500">Admissions Directorate</div>
            </div>
          </div>

          {/* Tamper Proof Footer */}
          <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-sans">
            <div>Verification Ledger Hash: SHA256-TEJAS-{admission.roll_number.replace(/-/g, '')}-VERIFIED</div>
            <div>Issued from Bhubaneswar Testing &amp; Research Campus</div>
          </div>
        </div>
      </div>
    </div>
  );
}
