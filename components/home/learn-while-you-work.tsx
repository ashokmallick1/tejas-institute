'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FlaskConical,
  Hammer,
  UserCheck,
  RefreshCw,
  FileCode2,
  Presentation,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export function LearnWhileYouWorkSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'step-1',
      number: '01',
      name: 'Learn',
      sub: 'Concept & Theory',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      title: 'Rigorous Deep-Tech Foundations',
      description: 'Move beyond surface-level syntax. Master first-principles mathematics, distributed systems concurrency models, transformer mechanics, and silicon architectures taught by distinguished engineering faculty.',
      deliverable: 'Mathematical comprehension & architectural blueprints',
      quote: '“Theoretical depth is what separates an engineer who prompts from an architect who invents.”',
    },
    {
      id: 'step-2',
      number: '02',
      name: 'Lab',
      sub: 'Hands-on Lab',
      icon: FlaskConical,
      color: 'from-sky-500 to-cyan-600',
      badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      title: 'Real-Time Hardware & Cluster Execution',
      description: 'Every lecture is matched immediately with a live laboratory session. Access our Bhubaneswar H100 GPU clusters, FPGA synthesis boards, battery test benches, and live cyber defense range.',
      deliverable: 'Tested tensor notebooks, kernel modules, & lab verification',
      quote: '“If it hasn’t run under load on hardware, it isn’t learned.”',
    },
    {
      id: 'step-3',
      number: '03',
      name: 'Apply',
      sub: 'Real Project',
      icon: Hammer,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      title: 'Constructing Production Systems',
      description: 'Build end-to-end applications designed for actual deployment—whether that is an enterprise multi-modal RAG engine, an autonomous K8s SRE agent, or a 16-cell BMS firmware controller.',
      deliverable: 'Production codebase with CI/CD, tests, & infrastructure manifests',
      quote: '“No toy projects. Every fellow builds software meant to run in real production.”',
    },
    {
      id: 'step-4',
      number: '04',
      name: 'Mentor Review',
      sub: 'Senior Code Review',
      icon: UserCheck,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      title: '1-on-1 Architectural & PR Critique',
      description: 'Senior architects inspect your GitHub pull requests, reviewing cyclomatic complexity, memory profiling, latency bottlenecks, and zero-trust security postures.',
      deliverable: 'In-line GitHub PR annotations & 1-on-1 mentoring calls',
      quote: '“Tough, rigorous feedback is the fastest catalyst for engineering excellence.”',
    },
    {
      id: 'step-5',
      number: '05',
      name: 'Improve',
      sub: 'Iteration & Optimization',
      icon: RefreshCw,
      color: 'from-violet-500 to-purple-600',
      badgeColor: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
      title: 'Refining, Benchmarking & Hardening',
      description: 'Act on mentor critiques. Stress-test under concurrent synthetic traffic, profile GPU VRAM utilization, eliminate memory leaks, and achieve tight p99 latency SLAs.',
      deliverable: 'Optimization benchmark diffs & hardened production release',
      quote: '“Engineering is not about making it work once; it is about making it resilient.”',
    },
    {
      id: 'step-6',
      number: '06',
      name: 'Document',
      sub: 'Technical Portfolio',
      icon: FileCode2,
      color: 'from-pink-500 to-rose-600',
      badgeColor: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
      title: 'Engineering Specs & Whitepapers',
      description: 'Great engineers communicate with precision. Produce comprehensive READMEs, architectural diagrams, RFC documents, API specs, and benchmark whitepapers.',
      deliverable: 'Public GitHub repository, technical documentation, & architecture diagram',
      quote: '“Your public documentation and codebase are your irreversible proof of capability.”',
    },
    {
      id: 'step-7',
      number: '07',
      name: 'Demonstrate',
      sub: 'Demo Day Defense',
      icon: Presentation,
      color: 'from-tejas-orange to-red-500',
      badgeColor: 'bg-tejas-orange/20 text-tejas-orange border-tejas-orange/40',
      title: 'Live Technical Panel Presentation',
      description: 'Present live running systems, demonstrate failover behavior, explain architectural trade-offs, and defend technical choices in front of our industry advisory board and corporate hiring partners.',
      deliverable: 'Live interactive demonstration & verifiable credential minting',
      quote: '“Stand behind what you built. Demo Day is where fellows earn industry recognition.”',
    },
  ];

  const current = steps[activeStep];
  const CurrentIcon = current.icon;

  return (
    <section className="relative border-t border-border bg-card/40 py-14 sm:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-tejas-orange/40 bg-tejas-orange/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-tejas-orange">
            The TEJAS Differentiator
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl font-display text-foreground">
            LEARN WHILE YOU WORK
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Our 7-stage engineering flywheel bridges the gulf between academic theory and enterprise deep-tech execution.
          </p>
        </div>

        {/* 7 Steps Interactive Pipeline Navigator */}
        <div className="mt-10 sm:mt-12">
          {/* Step Pill Buttons */}
          <div className="flex items-center justify-start gap-2 overflow-x-auto pb-4 lg:justify-center no-scrollbar scroll-touch px-1 -mx-1">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(idx)}
                  className={`group flex items-center gap-2 shrink-0 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-foreground text-background shadow-md scale-105'
                      : 'border border-border/70 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${isActive ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'}`}>
                    {s.number}
                  </span>
                  <span>{s.name}</span>
                  {idx < steps.length - 1 && (
                    <span className="hidden xl:inline text-muted-foreground/40 font-normal">→</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Step Detailed Interactive Showcase Card */}
          <div className="mt-6 sm:mt-8 overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-10 shadow-xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Details */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${current.badgeColor}`}>
                    <CurrentIcon className="h-3.5 w-3.5" />
                    <span>Stage {current.number}: {current.name}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{current.sub}</span>
                </div>

                <h3 className="text-2xl font-bold text-foreground sm:text-3xl font-display">
                  {current.title}
                </h3>

                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {current.description}
                </p>

                <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-tejas-blue">
                    Mandatory Stage Deliverable
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{current.deliverable}</span>
                  </div>
                </div>

                <blockquote className="border-l-2 border-tejas-orange pl-3 text-xs italic text-muted-foreground">
                  {current.quote}
                </blockquote>
              </div>

              {/* Right Column: Visual Infographic / Terminal Representation */}
              <div className="lg:col-span-5">
                <div className="relative rounded-xl border border-border/80 bg-tejas-navy-950 p-4 sm:p-5 shadow-2xl text-slate-200 font-mono text-xs overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-[10px] text-slate-400">tejas-flywheel://stage/{current.number}</span>
                    </div>
                    <span className="text-[10px] text-tejas-orange font-bold">BHUBANESWAR LABS</span>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-slate-400">
                      <span className="text-emerald-400">$</span> tejas-cli evaluate --stage &quot;{current.name}&quot;
                    </p>
                    <div className="rounded bg-slate-900/90 p-3 text-[11px] leading-relaxed border border-slate-800">
                      <div className="text-sky-400 font-bold">=== STATUS: STAGE ACTIVE ===</div>
                      <div className="mt-1 text-slate-300">Phase: {current.title}</div>
                      <div className="text-slate-400">Reviewer: Senior Fellow / Staff Architect</div>
                      <div className="text-emerald-400 mt-2 font-semibold">✓ Automated Rigor Checks Passing</div>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Next milestone: {steps[(activeStep + 1) % steps.length].name} →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <Link
            href="/learn-while-you-work"
            className="inline-flex items-center gap-2 text-sm font-semibold text-tejas-blue hover:underline"
          >
            <span>Read Complete Pedagogical Manifesto &amp; Evaluation Rubrics</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
