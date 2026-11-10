import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { Sparkles, Calendar, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Admissions 2026 | TEJAS Institute of Advanced Technology',
  description: 'Admissions process, eligibility criteria, cohort calendar, and application guidelines for TEJAS Institute Bhubaneswar.',
};

export default function AdmissionsPage() {
  const steps = [
    {
      num: '01',
      title: 'Online Application & Track Selection',
      desc: 'Submit your educational background, engineering interests, GitHub profile, and career goals via our online portal.',
    },
    {
      num: '02',
      title: 'Technical Diagnostic Assessment',
      desc: 'A 45-minute logic, programming, and first-principles math evaluation to assess your foundational problem-solving abilities.',
    },
    {
      num: '03',
      title: 'Faculty Technical Interview',
      desc: 'A 30-minute 1-on-1 discussion with a TEJAS faculty architect focusing on your curiosity, previous projects, and dedication to intensive lab work.',
    },
    {
      num: '04',
      title: 'Cohort Offer & Lab Compute Provisioning',
      desc: 'Selected fellows receive their enrollment credential, batch assignment, and credentials to TEJAS GPU clusters and lab platforms.',
    },
  ];

  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-tejas-orange/40 bg-tejas-orange/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-orange">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Admissions 2026 Cohorts</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            Admissions &amp; Fellowship Selection
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Selective, merit-driven cohort admissions for engineers committed to deep-tech excellence at our Bhubaneswar campus.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/admissions/apply"
              className="rounded-xl bg-tejas-blue px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-tejas-blue-dark transition"
            >
              Start Online Application
            </Link>
          </div>
        </div>
      </section>

      {/* 4-Step Admissions Process */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold font-display text-foreground sm:text-3xl">
              Selection Process
            </h2>
            <p className="text-xs text-muted-foreground mt-2">
              Designed to identify genuine passion and problem-solving aptitude rather than memorization.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {steps.map(s => (
              <div key={s.num} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <span className="font-mono text-2xl font-black text-tejas-orange">{s.num}</span>
                <h3 className="mt-2 text-base font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Admission Key Dates */}
          <div className="mt-14 rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Calendar className="h-4 w-4 text-tejas-blue" />
              <span>2026 Cohort Calendar</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-muted-foreground">Batch Alpha Deadline</div>
                <div className="font-bold text-foreground text-sm mt-1">15 April 2026</div>
                <div className="text-[11px] text-emerald-500 mt-0.5">Applications Open</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-muted-foreground">Technical Evaluations</div>
                <div className="font-bold text-foreground text-sm mt-1">Rolling Weekly</div>
                <div className="text-[11px] text-tejas-blue mt-0.5">Online &amp; Campus</div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-muted-foreground">Classes &amp; Labs Commence</div>
                <div className="font-bold text-foreground text-sm mt-1">02 May 2026</div>
                <div className="text-[11px] text-tejas-orange mt-0.5">Bhubaneswar / Hybrid</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
