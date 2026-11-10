'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Terminal, Zap, ChevronRight } from 'lucide-react';
import { MarqueeTicker } from '@/components/ui/marquee-ticker';

const METRICS = [
  { value: '18',   sub: 'Programs',           color: 'text-foreground' },
  { value: '6',    sub: 'Schools',             color: 'text-tejas-blue' },
  { value: '100%', sub: 'Hands-on Labs',       color: 'text-tejas-flame' },
  { value: '1:8',  sub: 'Mentor Ratio',        color: 'text-emerald-400' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-24 md:pt-16 md:pb-32 texture-noise">

      {/* ── Ambient radial glows (Scaler/Vercel pattern) ── */}
      {/* Primary blue glow — top center */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[800px] w-[1100px] -translate-x-1/2 rounded-full opacity-100"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 85% 30%, rgba(0,85,255,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 15% 70%, rgba(0,85,255,0.04) 0%, transparent 60%)',
        }}
      />
      {/* Flame glow — bottom right */}
      <div
        className="pointer-events-none absolute -bottom-16 right-0 -z-10 h-[400px] w-[600px] rounded-full opacity-60"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 80% 100%, rgba(230,57,0,0.12), transparent)',
        }}
      />
      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-dot-grid opacity-30 dark:opacity-15" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* ── Highlighted FDE Registration Banner & Admissions ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 px-2 max-w-full">
            <Link
              href="/programs/forward-deployment-engineer"
              className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 sm:px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm transition-all hover:bg-orange-500/20 hover:border-orange-500 shadow-sm max-w-full text-center"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tejas-flame opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-tejas-flame" />
              </span>
              <span className="font-bold text-tejas-flame uppercase tracking-wider text-[10px] shrink-0">
                NOW REGISTERING:
              </span>
              <span className="text-foreground font-semibold truncate min-w-0">
                <span className="sm:hidden">FDE Fellowship</span>
                <span className="hidden sm:inline">Forward Deployment Engineer (FDE) Fellowship</span>
              </span>
              <span className="text-tejas-flame text-xs font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                &rarr;
              </span>
            </Link>

            <Link
              href="/projects"
              className="group hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm transition-all hover:border-tejas-blue/40 text-muted-foreground hover:text-foreground"
            >
              <span>180+ Industry Projects</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* ── Main headline — Source Serif 4 (Scaler technique) ── */}
          <div className="mt-6 sm:mt-8 text-center px-1">
            <h1
              className="text-3xl min-[400px]:text-4xl sm:text-6xl lg:text-7xl xl:text-[90px] font-medium leading-[1.08] sm:leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              {/* Line 1 — foreground */}
              <span className="block text-foreground dark:text-white">
                Building India's
              </span>
              {/* Line 2 — the key editorial moment: Scaler gradient clip */}
              <span
                className="block"
                style={{
                  background: 'linear-gradient(90deg, #0055FF 0%, #06B6D4 25%, #0055FF 50%, #06B6D4 75%, #0055FF 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'shimmer 5s linear infinite',
                }}
              >
                Next-Generation
              </span>
              {/* Line 3 — TEJAS flame gradient matching logo streak */}
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #E63900 0%, #FF6B00 35%, #FF8C00 65%, #FFD700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Technologists.
              </span>
            </h1>

            {/* ── Core USP pill ── */}
            <div className="mt-5 sm:mt-7 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/25 bg-orange-500/8 px-4 py-1.5 sm:px-5 sm:py-2 dark:border-orange-400/20 dark:bg-orange-500/10">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-tejas-flame shrink-0" />
                <span
                  className="text-[11px] sm:text-xs font-bold uppercase tracking-[1.5px] sm:tracking-[1.8px] text-tejas-flame"
                >
                  Learn While You Work
                </span>
              </div>
            </div>

            {/* ── Supporting copy ── */}
            <p className="mx-auto mt-5 sm:mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-xl">
              Don't just learn technology.{' '}
              <span className="font-semibold text-foreground">Build with it.</span>
              {' '}India's engineering academy where fellows construct production-grade
              AI systems, cloud platforms, silicon RTL, and industrial robotics
              under senior mentor guidance.
            </p>

            {/* ── CTAs: mobile-first stacked on small screens, row on desktop ── */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-xs sm:max-w-none mx-auto">
              {/* Primary — solid Scaler blue */}
              <Link
                href="/programs"
                className="group inline-flex items-center justify-center gap-2 rounded-none border border-transparent px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] w-full sm:w-auto"
                style={{ background: '#0055FF', letterSpacing: '0.02em' }}
              >
                Explore Programs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              {/* Secondary — flame gradient (logo streak) */}
              <Link
                href="/admissions/apply"
                className="group inline-flex items-center justify-center gap-2 rounded-none px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #E63900, #FF8C00)',
                  letterSpacing: '0.02em',
                }}
              >
                <Sparkles className="h-4 w-4" />
                Apply Now
              </Link>

              {/* Ghost — demo */}
              <Link
                href="/dashboard/student"
                className="inline-flex items-center justify-center gap-2 rounded-none border border-border bg-card/60 sm:bg-transparent px-6 py-3.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:text-foreground hover:border-foreground/40 w-full sm:w-auto"
                style={{ letterSpacing: '0.02em' }}
              >
                <Terminal className="h-4 w-4" />
                LMS Demo
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>★★★★★ <span className="text-amber-400 font-semibold">4.9</span> by early fellows</span>
              <span className="hidden sm:block text-border">·</span>
              <span>Production-first curriculum</span>
              <span className="hidden sm:block text-border">·</span>
              <span>Built in <span className="font-semibold" style={{ color: '#0055FF' }}>Bhubaneswar</span></span>
            </div>
          </div>

          {/* ── Metrics grid — gap-px technique (creates 1px dividers) ── */}
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.sub} className="bg-background px-6 py-6 text-center">
                <div className={`text-3xl font-black tracking-tight sm:text-4xl ${m.color}`}
                  style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  {m.value}
                </div>
                <div className="mt-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  {m.sub}
                </div>
              </div>
            ))}
          </div>

          {/* ── Marquee ticker ── Scaler-style masked infinite scroll ── */}
          <div className="mt-12">
            <MarqueeTicker label="18 Programs across 6 Engineering Schools" speed={35} />
          </div>

          {/* ── Brand lockup ── */}
          <div className="mt-16 flex flex-col items-center gap-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
              <Image
                src="/tejas-logo.jpg"
                alt="TEJAS Institute of Advanced Technology"
                fill
                sizes="80px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold tracking-tight text-foreground">
                TEJAS · Institute of Advanced Technology
              </p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[2px] text-muted-foreground">
                Learn · Build · Work · Grow
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
