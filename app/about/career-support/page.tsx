import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { Briefcase, Building2, Presentation, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Career Support & Incubation | TEJAS Institute',
  description: 'Career partnerships, placement acceleration, Demo Day hiring, and deep-tech startup incubation at TEJAS Bhubaneswar.',
};

export default function CareerSupportPage() {
  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-500">
            Industry Placement &amp; Incubation
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            Career Acceleration &amp; Deep-Tech Incubation
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Connecting our fellows directly with top-tier deep-tech engineering teams, tier-1 product organizations, and venture incubators.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <Presentation className="h-6 w-6 text-tejas-orange" />
              <h2 className="text-base font-bold font-display text-foreground">Demo Day Hiring Panels</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rather than sending resumes through HR filters, fellows demonstrate their live code, benchmarks, and architectures directly to VP of Engineering and Staff Architect hiring panels.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <Briefcase className="h-6 w-6 text-tejas-blue" />
              <h2 className="text-base font-bold font-display text-foreground">High-Impact Roles</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our fellows step directly into specialist roles: Generative AI Engineers, MLOps Leads, ASIC Verification Specialists, BMS Firmware Architects, and SRE Platform Leads.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 space-y-4">
            <h2 className="text-xl font-bold font-display text-foreground">
              Deep-Tech Incubation Sandbox
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For fellows building proprietary intellectual property, TEJAS offers seed compute grants, legal IP support, and direct pitch introductions to venture capital funds focused on Indian deep-tech.
            </p>
            <div className="pt-2">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-tejas-blue px-5 py-2.5 text-xs font-bold text-white"
              >
                <span>Join the 2026 Cohort</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
