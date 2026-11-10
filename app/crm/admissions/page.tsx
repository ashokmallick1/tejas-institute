'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  Plus,
  FileCheck,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Calendar,
  ExternalLink,
  Receipt,
  FileText,
  UserCheck,
  Send,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { StudentAdmission, AdmissionStatus } from '@/types/admission-invoice';
import { StudentApplication } from '@/types';
import { AdmissionInvoiceService } from '@/lib/crm/admission-invoice-service';
import { useLms } from '@/lib/store/lms-store';
import { PROGRAMS } from '@/lib/data/programs';
import { AdmissionOfferModal } from '@/components/crm/admission-offer-modal';
import { CreateInvoiceModal } from '@/components/crm/create-invoice-modal';

const STATUS_CONFIG: Record<
  AdmissionStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  PROVISIONAL_OFFER: {
    label: 'Provisional Offer',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  OFFER_ACCEPTED: {
    label: 'Offer Accepted',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
  },
  DOCUMENTS_VERIFIED: {
    label: 'Documents Verified',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
  },
  FEES_PENDING: {
    label: 'Fees Pending',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  ADMITTED: {
    label: 'Admitted & Enrolled',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  DEFERRED: {
    label: 'Deferred Cohort',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/30',
  },
  REVOKED: {
    label: 'Offer Revoked',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
};

export default function AdmissionsPage() {
  const { applications, enrollLeadAsStudent } = useLms();
  const [admissions, setAdmissions] = useState<StudentAdmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [programFilter, setProgramFilter] = useState<string>('ALL');

  // Modals
  const [selectedAdmissionForOffer, setSelectedAdmissionForOffer] = useState<StudentAdmission | null>(null);
  const [selectedAdmissionForInvoice, setSelectedAdmissionForInvoice] = useState<StudentAdmission | null>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedAppForNewOffer, setSelectedAppForNewOffer] = useState<StudentApplication | null>(null);

  // New Offer Form State
  const [newOfferBatch, setNewOfferBatch] = useState('batch-alpha-2026');
  const [newOfferScholarship, setNewOfferScholarship] = useState('Odisha AI Merit Fellowship (40%)');
  const [newOfferScholarshipPct, setNewOfferScholarshipPct] = useState(40);

  const refreshData = () => {
    setAdmissions(AdmissionInvoiceService.getAdmissions());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const metrics = useMemo(() => {
    return AdmissionInvoiceService.getAdmissionsMetrics();
  }, [admissions]);

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((adm) => {
      const matchesSearch =
        adm.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adm.student_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adm.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adm.admission_number.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || adm.status === statusFilter;
      const matchesProgram = programFilter === 'ALL' || adm.program_id === programFilter;

      return matchesSearch && matchesStatus && matchesProgram;
    });
  }, [admissions, searchQuery, statusFilter, programFilter]);

  const handleAcceptOffer = (admissionId: string) => {
    AdmissionInvoiceService.updateAdmissionStatus(admissionId, 'OFFER_ACCEPTED', {
      terms_accepted: true,
    });
    refreshData();
    if (selectedAdmissionForOffer?.id === admissionId) {
      setSelectedAdmissionForOffer((prev) => (prev ? { ...prev, status: 'OFFER_ACCEPTED' } : null));
    }
  };

  const handleAdmitStudent = (adm: StudentAdmission) => {
    AdmissionInvoiceService.updateAdmissionStatus(adm.id, 'ADMITTED', {
      terms_accepted: true,
      documents_verified: true,
    });
    enrollLeadAsStudent(adm.application_id, adm.batch_id);
    refreshData();
  };

  const handleCreateOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForNewOffer) return;

    const newAdm = AdmissionInvoiceService.issueAdmissionOffer({
      application: selectedAppForNewOffer,
      batchId: newOfferBatch,
      batchName: newOfferBatch === 'batch-alpha-2026' ? 'Batch Alpha 2026 (Bhubaneswar Hub)' : 'Batch Beta 2026',
      scholarshipTitle: newOfferScholarship,
      scholarshipPercentage: newOfferScholarshipPct,
      remarks: 'Issued via Admissions Console.',
    });

    refreshData();
    setIsIssueModalOpen(false);
    setSelectedAdmissionForOffer(newAdm);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center rounded-md bg-amber-500/15 border border-amber-500/30 px-2 text-[10px] font-black text-amber-500 uppercase tracking-wider">
              Frappe Education Model
            </span>
            <span className="text-xs text-muted-foreground font-mono">ERPNext Student Admission</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground font-display">
            Admissions &amp; Offer Dossiers
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage applicant evaluation, provisional admission offers, scholarship waivers, and enrollment handshakes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/crm/invoices"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
          >
            <Receipt className="h-3.5 w-3.5 text-tejas-blue" />
            <span>Go to Invoices</span>
          </Link>
          <button
            onClick={() => {
              setSelectedAppForNewOffer(applications[0] || null);
              setIsIssueModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Issue Admission Offer</span>
          </button>
        </div>
      </div>

      {/* ── Metrics Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Applications</span>
            <Users className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground font-display">
            {metrics.total_applications}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Under evaluation</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Offers Issued</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400 font-display">
            {metrics.offers_issued}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Provisional offers</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Accepted</span>
            <FileCheck className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-400 font-display">
            {metrics.offers_accepted}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Terms confirmed</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Fees Pending</span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-400 font-display">
            {metrics.fees_pending}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Awaiting invoice clearance</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Admitted Fellows</span>
            <GraduationCap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400 font-display">
            {metrics.fully_admitted}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Active in LMS</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">Offer Conversion</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-400 font-display">
            {metrics.conversion_rate}%
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Offer-to-admit yield</div>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by student name, roll number, admission ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-card p-2 text-xs text-foreground focus:border-amber-500 focus:outline-none"
        >
          <option value="ALL">All Admission Stages</option>
          <option value="PROVISIONAL_OFFER">Provisional Offer</option>
          <option value="OFFER_ACCEPTED">Offer Accepted</option>
          <option value="DOCUMENTS_VERIFIED">Documents Verified</option>
          <option value="FEES_PENDING">Fees Pending</option>
          <option value="ADMITTED">Admitted &amp; Enrolled</option>
        </select>

        <select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          className="rounded-xl border border-border bg-card p-2 text-xs text-foreground focus:border-amber-500 focus:outline-none"
        >
          <option value="ALL">All Academic Programs</option>
          <option value="prog-fde-01">FDE Fellowship</option>
          <option value="prog-agentic-ai-02">Agentic AI Systems</option>
        </select>
      </div>

      {/* ── Admissions Catalog Grid ── */}
      <div className="space-y-3">
        {filteredAdmissions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            <GraduationCap className="mx-auto h-8 w-8 opacity-40 mb-2" />
            <p className="text-sm font-semibold">No admissions records matching current filter.</p>
          </div>
        ) : (
          filteredAdmissions.map((adm) => {
            const st = STATUS_CONFIG[adm.status] || STATUS_CONFIG.PROVISIONAL_OFFER;
            return (
              <div
                key={adm.id}
                className="rounded-2xl border border-border bg-card p-4 sm:p-5 transition hover:border-border/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Dossier Info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                      {adm.roll_number}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {adm.admission_number}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${st.bg} ${st.text} ${st.border}`}
                    >
                      <span>{st.label}</span>
                    </span>
                    {adm.scholarship_percentage > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        <Award className="h-3 w-3" />
                        <span>{adm.scholarship_percentage}% Fellowship Waiver</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-foreground font-display">
                      {adm.student_name}
                    </h2>
                    <div className="text-xs text-muted-foreground font-mono flex flex-wrap gap-x-3 gap-y-1 mt-0.5">
                      <span>{adm.student_email}</span>
                      <span>·</span>
                      <span>{adm.student_phone}</span>
                      <span>·</span>
                      <span className="text-foreground font-semibold">{adm.program_name}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3 text-tejas-blue" />
                      <span>{adm.batch_name}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Offer Date: {new Date(adm.offer_date).toLocaleDateString('en-IN')}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-rose-400 font-semibold">
                      <Clock className="h-3 w-3" />
                      <span>Deadline: {new Date(adm.acceptance_deadline).toLocaleDateString('en-IN')}</span>
                    </span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 md:justify-end shrink-0">
                  <button
                    onClick={() => setSelectedAdmissionForOffer(adm)}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-muted px-3 py-2 text-xs font-bold text-foreground transition"
                  >
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    <span>View Offer Letter</span>
                  </button>

                  <button
                    onClick={() => setSelectedAdmissionForInvoice(adm)}
                    className="flex items-center gap-1.5 rounded-xl border border-tejas-blue/30 bg-tejas-blue/10 hover:bg-tejas-blue/20 px-3 py-2 text-xs font-bold text-tejas-blue transition"
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    <span>Generate Invoice</span>
                  </button>

                  {adm.status === 'PROVISIONAL_OFFER' && (
                    <button
                      onClick={() => handleAcceptOffer(adm.id)}
                      className="flex items-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-xs font-bold text-white transition shadow-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Accept Offer</span>
                    </button>
                  )}

                  {adm.status !== 'ADMITTED' && (
                    <button
                      onClick={() => handleAdmitStudent(adm)}
                      className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 px-3.5 py-2 text-xs font-bold text-white transition shadow-md shadow-emerald-600/20"
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>Admit in LMS</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Modal: View / Print Admission Offer ── */}
      <AdmissionOfferModal
        admission={selectedAdmissionForOffer}
        onClose={() => setSelectedAdmissionForOffer(null)}
        onAcceptOffer={handleAcceptOffer}
        onGenerateInvoiceClick={(adm) => {
          setSelectedAdmissionForOffer(null);
          setSelectedAdmissionForInvoice(adm);
        }}
      />

      {/* ── Modal: Create Invoice for Admission ── */}
      {selectedAdmissionForInvoice && (
        <CreateInvoiceModal
          initialAdmission={selectedAdmissionForInvoice}
          applications={applications}
          onClose={() => setSelectedAdmissionForInvoice(null)}
          onInvoiceCreated={() => {
            refreshData();
          }}
        />
      )}

      {/* ── Modal: Issue New Admission Offer ── */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-foreground font-display">
                  Issue Provisional Admission Offer
                </h3>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOfferSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-foreground mb-1">Select Candidate</label>
                <select
                  value={selectedAppForNewOffer?.id || ''}
                  onChange={(e) => {
                    const app = applications.find((a) => a.id === e.target.value);
                    setSelectedAppForNewOffer(app || null);
                  }}
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.full_name} ({app.email}) — {app.program_title || 'General'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Batch / Cohort Allocation</label>
                <select
                  value={newOfferBatch}
                  onChange={(e) => setNewOfferBatch(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                >
                  <option value="batch-alpha-2026">Batch Alpha 2026 (Bhubaneswar Hub)</option>
                  <option value="batch-beta-2026">Batch Beta 2026 (Winter Intake)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-foreground mb-1">Scholarship Title</label>
                  <input
                    type="text"
                    value={newOfferScholarship}
                    onChange={(e) => setNewOfferScholarship(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-foreground mb-1">Waiver Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newOfferScholarshipPct}
                    onChange={(e) => setNewOfferScholarshipPct(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-mono text-xs text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md"
                >
                  <span>Dispatch Offer Letter</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
