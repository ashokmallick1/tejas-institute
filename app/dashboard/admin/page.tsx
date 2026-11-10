'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { useAuth } from '@/lib/auth/auth-context';
import { useLms } from '@/lib/store/lms-store';
import { PROGRAMS, SCHOOLS } from '@/lib/data/programs';
import { DEMO_PROFILES, SAMPLE_BATCH } from '@/lib/data/mock-store';
import { formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Calendar,
  Award,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
  Sparkles,
  Kanban,
  Brain,
  Zap,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { applications, updateApplicationStatus, enrollments, certificates } = useLms();

  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'batches' | 'audit'>('overview');
  const [filterAppStatus, setFilterAppStatus] = useState<string>('ALL');

  const filteredApps = applications.filter(a => {
    if (filterAppStatus === 'ALL') return true;
    return a.status === filterAppStatus;
  });

  const auditLogs = [
    { id: 'aud-1', actor: 'Dr. Subhashree Dash (Director)', action: 'Batch Alpha Enrolled 21 Fellows', time: '10 mins ago', type: 'ENROLLMENT' },
    { id: 'aud-2', actor: 'Er. Arpita Senapati (Mentor)', action: 'Graded PR #42: Scaled Dot-Product Attention', time: '2 hours ago', type: 'ACADEMIC' },
    { id: 'aud-3', actor: 'Prof. Priyadarshi Mohapatra', action: 'Published Course: Enterprise RAG Systems', time: 'Yesterday', type: 'CONTENT' },
    { id: 'aud-4', actor: 'System RBAC Guard', action: 'Verified SHA-256 Ledger for Cert TEJAS-2026-AI-8921', time: '2 days ago', type: 'SECURITY' },
  ];

  return (
    <DashboardShell activeRole="admin">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Banner */}
        <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-amber-500/10 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="rounded-full bg-amber-500/15 px-3 py-0.5 text-xs font-bold text-amber-500">
                DIRECTOR &amp; OPERATIONS CENTER
              </span>
              <h1 className="mt-2 text-2xl font-bold font-display text-foreground sm:text-3xl">
                Executive Console — {user?.full_name || 'Dr. Subhashree Dash'}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground max-w-xl">
                Monitor institute-wide metrics, admissions funnel, cohort batches, credential issuance, and audit security logs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-mono text-muted-foreground">
                Location: Bhubaneswar
              </span>
            </div>
          </div>
        </div>

        {/* Executive Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Active Fellows</span>
              <GraduationCap className="h-4 w-4 text-tejas-blue" />
            </div>
            <div className="mt-2 text-2xl font-black font-display text-foreground">
              124
            </div>
            <div className="mt-1 text-[11px] text-emerald-500 font-semibold">
              +18% from last cohort
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Programs &amp; Schools</span>
              <Layers className="h-4 w-4 text-tejas-orange" />
            </div>
            <div className="mt-2 text-2xl font-black font-display text-foreground">
              17 / 5
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Across 5 advanced schools
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Completion Standing</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-black font-display text-foreground">
              94.2%
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              Demo Day qualification rate
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Admissions In Review</span>
              <UserCheck className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl font-black font-display text-foreground">
              {applications.length}
            </div>
            <div className="mt-1 text-[11px] text-tejas-blue font-semibold">
              Batch Alpha 2026
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-border pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === 'overview' ? 'bg-tejas-blue text-white' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            System Overview
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === 'applications' ? 'bg-tejas-blue text-white' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Admissions Pipeline ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === 'batches' ? 'bg-tejas-blue text-white' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Cohorts &amp; Batches
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === 'audit' ? 'bg-tejas-blue text-white' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Audit Security Logs
          </button>
        </div>

        {/* TAB 1: System Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold font-display text-foreground">
                Academic Program Distribution
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SCHOOLS.map(s => (
                  <div key={s.id} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                    <div className="text-xs font-bold text-foreground">{s.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {PROGRAMS.filter(p => p.school_id === s.id).length} Active Specializations
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              {/* Twenty AI Admissions CRM Widget */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    <h2 className="text-base font-bold font-display text-foreground">
                      Twenty AI Admissions
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500">
                    crm.tejas.ac.in
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-border bg-muted/20 p-3">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Active Pipeline</div>
                    <div className="text-lg font-black font-display text-foreground mt-0.5">{applications.length} Leads</div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/20 p-3">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Hot Candidates</div>
                    <div className="text-lg font-black font-display text-rose-500 mt-0.5">
                      {applications.filter(a => a.sentiment === 'HIGH_INTENT').length} High Intent
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/20 p-3">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Confirmed Enrolled</div>
                    <div className="text-lg font-black font-display text-emerald-400 mt-0.5">
                      {applications.filter(a => a.status === 'ENROLLED').length} Fellows
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/20 p-3">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Pipeline Value</div>
                    <div className="text-lg font-black font-display text-foreground mt-0.5 font-mono">
                      ₹{(applications.reduce((acc, a) => acc + (a.deal_value_inr || 90000), 0) / 100000).toFixed(1)}L
                    </div>
                  </div>
                </div>

                <Link
                  href="/crm"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-tejas-blue to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition"
                >
                  <Kanban className="h-4 w-4" />
                  <span>Launch Twenty CRM Pipeline &rarr;</span>
                </Link>
              </div>

              {/* Verifiable Credentials */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold font-display text-foreground">
                  Verifiable Credentials
                </h2>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Immutable Certificate Registry</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-foreground">
                    TEJAS-2026-AI-8921
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Student: Rohan Patnaik • Grade: Distinction
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/verify/TEJAS-2026-AI-8921"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-tejas-blue hover:underline"
                    >
                      <span>Inspect Public Verification Page</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Admissions Pipeline */}
        {activeTab === 'applications' && (
          <div id="applications" className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
            {/* Quick Link to Twenty CRM */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Need AI Resume Extraction, Drag-and-Drop Kanban, or Automated Email Sequences?
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Manage admissions in the full Twenty AI Edition Admissions CRM console.
                  </div>
                </div>
              </div>

              <Link
                href="/crm"
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 text-black px-4 py-2 text-xs font-bold hover:bg-amber-400 transition shrink-0"
              >
                <Kanban className="h-3.5 w-3.5" />
                <span>Open Twenty CRM</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-display text-foreground">
                  Admissions Candidates (2026 Cycle)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Review applicant dossiers, set interview standings, and confirm fellowship enrollments.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['ALL', 'NEW', 'COUNSELLING', 'SHORTLISTED', 'ENROLLED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterAppStatus(st)}
                    className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                      filterAppStatus === st
                        ? 'bg-tejas-blue text-white'
                        : 'border border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredApps.map(app => (
                <div
                  key={app.id}
                  className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <span className="font-bold text-sm text-foreground">{app.full_name}</span>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {app.email} • {app.phone} • {app.city}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-tejas-blue/15 text-tejas-blue uppercase">
                        {app.status}
                      </span>
                      <select
                        value={app.status}
                        onChange={e => updateApplicationStatus(app.id, e.target.value as any)}
                        className="rounded-xl border border-border bg-card px-2.5 py-1 text-xs text-foreground focus:outline-none"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="COUNSELLING">COUNSELLING</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="ENROLLED">ENROLLED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-t border-border/50 pt-2 text-muted-foreground">
                    <div>Program: <strong className="text-foreground">{app.program_title || 'AI Fellowship'}</strong></div>
                    <div>Education: <strong className="text-foreground">{app.education}</strong></div>
                    <div>Experience: {app.experience}</div>
                    <div>Mode: {app.preferred_mode}</div>
                  </div>

                  {app.admin_notes && (
                    <div className="rounded-xl bg-card p-2.5 text-xs text-muted-foreground border border-border">
                      <span className="font-bold text-foreground">Director Notes:</span> {app.admin_notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Batches */}
        {activeTab === 'batches' && (
          <div id="batches" className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold font-display text-foreground">Active Cohort Management</h2>
            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-foreground">{SAMPLE_BATCH.name}</span>
                <span className="rounded bg-emerald-500/15 text-emerald-500 font-bold text-xs px-2.5 py-0.5">
                  {SAMPLE_BATCH.status}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Batch Code: <strong className="font-mono text-foreground">{SAMPLE_BATCH.code}</strong> • Capacity: {SAMPLE_BATCH.enrolled_count} / {SAMPLE_BATCH.max_capacity}
              </div>
              <div className="text-xs text-muted-foreground">
                Lead Trainer: {SAMPLE_BATCH.trainer_name} • Mentor: {SAMPLE_BATCH.mentor_name}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Audit Logs */}
        {activeTab === 'audit' && (
          <div id="audit" className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold font-display text-foreground">Administrative Audit Trail</h2>
            <p className="text-xs text-muted-foreground">
              Cryptographically timestamped administrative events and RBAC privilege modifications.
            </p>
            <div className="space-y-2">
              {auditLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-xs">
                  <div>
                    <div className="font-bold text-foreground">{log.action}</div>
                    <div className="text-[11px] text-muted-foreground">Actor: {log.actor}</div>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-tejas-blue">
                      {log.type}
                    </span>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
