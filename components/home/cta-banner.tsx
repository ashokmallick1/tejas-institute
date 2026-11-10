import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Users } from 'lucide-react';

export function CtaBanner() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-tejas-blue/40 bg-gradient-to-br from-tejas-navy-950 via-tejas-navy-900 to-tejas-blue-dark p-8 md:p-14 text-white shadow-2xl">
          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-tejas-orange/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-tejas-blue/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-tejas-orange/40 bg-tejas-orange/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-orange">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Admissions Cycle 2026</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl font-display">
              Ready to Build Production Deep-Tech Systems?
            </h2>

            <p className="text-sm leading-relaxed text-slate-300 sm:text-base max-w-xl mx-auto">
              Join India’s top engineers, researchers, and innovators at TEJAS Institute of Advanced Technology. Admissions are selective and cohort-based.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/admissions/apply"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-tejas-flame-red via-tejas-flame-orange to-tejas-flame-amber px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Apply for Fellowship</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/programs/forward-deployment-engineer"
                className="flex items-center gap-2 rounded-xl border border-orange-400/40 bg-orange-500/10 px-6 py-3.5 text-sm font-semibold text-orange-200 backdrop-blur transition hover:bg-orange-500/20"
              >
                <Sparkles className="h-4 w-4 text-tejas-flame" />
                <span>Register for FDE (Open)</span>
              </Link>

              <Link
                href="/programs"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <span>Review All 18 Curricula</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Merit-Based Selection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-sky-400" />
                <span>Small Cohort (25 Fellows / Batch)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-tejas-orange" />
                <span>Bhubaneswar Campus &amp; Hybrid Tracks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
