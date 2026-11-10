import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Careers at TEJAS | Build India’s Next-Gen Technologists',
  description: 'Join TEJAS Institute as a Principal Faculty, Lab Mentor, or Curriculum Engineer in Bhubaneswar, Odisha.',
};

export default function CareerPage() {
  const openings = [
    {
      role: 'Principal Architect & Faculty — Generative AI & LLMs',
      type: 'Full-time / In-Person (Bhubaneswar)',
      exp: '5+ years production AI experience',
      desc: 'Lead curriculum design, GPU cluster research, and 1-on-1 code reviews for our flagship AI Engineering fellowship.',
    },
    {
      role: 'Staff Mentor — VLSI RTL & Functional Verification',
      type: 'Full-time / Hybrid (Bhubaneswar)',
      exp: '4+ years SystemVerilog / UVM experience',
      desc: 'Guide fellows through digital chip modeling, synthesis constraints, and UVM testbench verification.',
    },
    {
      role: 'Lab Platform Engineer — HPC, Slurm & InfiniBand',
      type: 'Full-time / In-Person (Bhubaneswar)',
      exp: '3+ years Linux HPC cluster admin experience',
      desc: 'Operate and optimize our multi-node NVIDIA H100/A100 GPU clusters, Lustre storage, and Slurm scheduling.',
    },
  ];

  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="rounded-full bg-tejas-blue/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-blue">
            Join Our Faculty &amp; Lab Team
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            Shape India&apos;s Engineering Future
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Work alongside elite practitioners, lead frontier laboratories, and mentor India’s most driven engineering minds.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
          <h2 className="text-xl font-bold font-display text-foreground">Current Open Positions</h2>

          <div className="space-y-4">
            {openings.map(job => (
              <div
                key={job.role}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-tejas-blue/40 sm:flex-row sm:items-center gap-4"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground">{job.role}</h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.exp}</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground max-w-xl">{job.desc}</p>
                </div>

                <a
                  href="mailto:careers@tejas.ac.in"
                  className="rounded-xl bg-tejas-blue px-4 py-2 text-xs font-bold text-white hover:bg-tejas-blue-dark transition text-center shrink-0"
                >
                  Apply via Email
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
