import React from 'react';
import { notFound } from 'next/navigation';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { PROGRAMS } from '@/lib/data/programs';
import { getProjectsByProgram } from '@/lib/data/projects-index';
import { ProjectCard } from '@/components/projects/project-card';
import { formatCurrencyINR } from '@/lib/utils';
import {
  Clock,
  BookOpen,
  Calendar,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  HelpCircle,
  Server,
  Code2,
} from 'lucide-react';

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROGRAMS.map(program => ({
    slug: program.slug,
  }));
}

export async function generateMetadata({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = PROGRAMS.find(p => p.slug === slug);
  if (!program) return { title: 'Program Not Found | TEJAS' };

  return {
    title: `${program.title} | TEJAS Institute of Advanced Technology`,
    description: program.overview,
  };
}

export default async function SingleProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = PROGRAMS.find(p => p.slug === slug);

  if (!program) {
    notFound();
  }

  const domainProjects = getProjectsByProgram(program.slug);

  // 36-class structure breakdown (6 Modules of 6 master classes)
  const curriculumModules = [
    {
      moduleNum: 1,
      title: 'Foundations, First Principles & Mathematical Rigor',
      classes: 'Classes 1 - 6',
      desc: 'Deep theoretical modeling, architecture internals, and setting up reproducible local and cluster environments.',
    },
    {
      moduleNum: 2,
      title: 'Core System Implementation & Laboratory Benchmarking',
      classes: 'Classes 7 - 12',
      desc: 'Hands-on hardware/cluster implementation, custom component writing, and baseline performance profiling.',
    },
    {
      moduleNum: 3,
      title: 'Distributed Scaling, Latency & Optimization',
      classes: 'Classes 13 - 18',
      desc: 'Concurrency models, memory management, zero-copy serializations, and high-throughput execution under stress.',
    },
    {
      moduleNum: 4,
      title: 'Production Guardrails, Resilience & Security',
      classes: 'Classes 19 - 24',
      desc: 'Defensive architecture, failover mechanisms, zero-trust policies, and automated observability telemetry.',
    },
    {
      moduleNum: 5,
      title: 'Enterprise Capstone Engineering & Mentor Review',
      classes: 'Classes 25 - 30',
      desc: 'Building the multi-service capstone project. Weekly 1-on-1 code reviews, PR audits, and refactoring.',
    },
    {
      moduleNum: 6,
      title: 'Hardening, Documentation & Demo Day Defense',
      classes: 'Classes 31 - 36',
      desc: 'Stress testing, writing comprehensive RFCs/whitepapers, and live demonstration before industry hiring panels.',
    },
  ];

  return (
    <PublicShell>
      {/* Program Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card/60 via-card/30 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/programs"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Programs
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-xs font-semibold text-tejas-blue">
                {program.school_name}
              </span>
              {program.badge && (
                <span className="ml-auto rounded-full bg-tejas-orange/20 px-3 py-0.5 text-xs font-bold text-tejas-orange border border-tejas-orange/30">
                  {program.badge}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-display text-foreground">
              {program.title}
            </h1>

            <p className="text-lg font-medium text-foreground sm:text-xl">
              {program.tagline}
            </p>

            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {program.overview}
            </p>

            {/* Program Vital Stats Bar */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Duration</div>
                <div className="text-base font-bold text-foreground mt-0.5 flex items-center gap-1.5 font-display">
                  <Clock className="h-4 w-4 text-tejas-blue" />
                  <span>{program.duration_weeks} Weeks</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Curriculum</div>
                <div className="text-base font-bold text-foreground mt-0.5 flex items-center gap-1.5 font-display">
                  <BookOpen className="h-4 w-4 text-tejas-orange" />
                  <span>{program.class_count} Master Classes</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tuition Fee</div>
                <div className="text-base font-bold text-emerald-500 mt-0.5 font-display">
                  {formatCurrencyINR(program.fee_inr)}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Location &amp; Mode</div>
                <div className="text-xs font-semibold text-foreground mt-1">
                  Bhubaneswar / Hybrid
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/admissions/apply?program=${program.slug}`}
                className="flex items-center gap-2 rounded-xl bg-tejas-blue px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-tejas-blue/20 hover:bg-tejas-blue-dark transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Apply for this Fellowship</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/learn-while-you-work"
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition"
              >
                <span>Learn While You Work Methodology</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left 8 Cols: Curriculum & Program Details */}
            <div className="lg:col-span-8 space-y-12">
              {/* 36-Class Curriculum Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-tejas-blue/15 px-2.5 py-0.5 text-xs font-bold text-tejas-blue uppercase">
                    Curriculum Structure
                  </span>
                  <span className="text-xs text-muted-foreground">36 Master Classes across 6 Rigor Modules</span>
                </div>
                <h2 className="text-2xl font-bold font-display text-foreground">
                  The 36-Class Engineering Syllabus
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Each master class combines 60 minutes of theoretical derivation with 90 minutes of dedicated laboratory implementation.
                </p>

                <div className="space-y-4 mt-6">
                  {curriculumModules.map(m => (
                    <div
                      key={m.moduleNum}
                      className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-tejas-blue/30"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-tejas-orange">
                          MODULE 0{m.moduleNum}
                        </span>
                        <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          {m.classes}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-foreground">
                        {m.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Labs & Infrastructure */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold font-display text-foreground">
                  Dedicated Laboratory &amp; Compute Quotas
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {program.labs.map(lab => (
                    <div key={lab} className="rounded-xl border border-border bg-muted/20 p-4 flex items-start gap-3">
                      <Server className="h-5 w-5 text-tejas-blue shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-foreground">{lab}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">Physical hardware quota on Bhubaneswar campus</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Projects */}
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Solve These &amp; Get Hired
                  </div>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-bold font-display text-foreground">
                    10 Production Problem Statements You Will Solve
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    At TEJAS, you do not build toy calculators or clone tutorials. You solve production engineering challenges commissioned directly from enterprise architecture playbooks. Complete, document, and defend these systems under senior mentor review to unlock direct hiring referrals.
                  </p>
                </div>

                {domainProjects && domainProjects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {domainProjects.map((proj) => (
                      <ProjectCard key={proj.id} project={proj} expanded={true} />
                    ))}
                  </div>
                ) : (
                  program.projects_highlight && (
                    <div className="space-y-3">
                      {program.projects_highlight.map((proj, idx) => (
                        <div key={idx} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                          <Code2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-semibold text-foreground">{proj}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Undergoes 1-on-1 weekly code review, performance profiling, and Demo Day defense.
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>

              {/* FAQs */}
              {program.faqs && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold font-display text-foreground">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {program.faqs.map((faq, i) => (
                      <div key={i} className="rounded-xl border border-border bg-card p-5">
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                          <HelpCircle className="h-4 w-4 text-tejas-orange shrink-0" />
                          <span>{faq.question}</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground pl-6">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Capstone Projects Collection */}
              {getProjectsByProgram(program.slug).length > 0 && (
                <div className="space-y-6 pt-8 border-t border-border">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold font-display text-foreground">
                      Build Real Things. Get Hired.
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Our fellows don't build toy apps. They build industry-grade, complex systems that solve real problems. Here are some of the capstone projects built in this program.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getProjectsByProgram(program.slug).map((project, idx) => (
                      <ProjectCard key={idx} project={project} expanded={false} />
                    ))}
                  </div>
                </div>
              )}
            </div>
              )}
            </div>

            {/* Right 4 Cols: Sticky Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Apply Box */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tuition Investment</span>
                    <div className="text-3xl font-extrabold text-foreground font-display mt-0.5">
                      {formatCurrencyINR(program.fee_inr)}
                    </div>
                    <span className="text-[11px] text-muted-foreground">Flexible installment &amp; sponsorship plans available</span>
                  </div>

                  <Link
                    href={`/admissions/apply?program=${program.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-tejas-blue py-3.5 text-xs font-bold text-white shadow-md hover:bg-tejas-blue-dark transition"
                  >
                    <span>Apply for Fellowship</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="space-y-2 border-t border-border/60 pt-4 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Dedicated lab compute allocation</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Weekly 1-on-1 senior mentor reviews</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Demo Day presentation &amp; verifiable credential</span>
                    </div>
                  </div>
                </div>

                {/* Prerequisites Card */}
                <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Prerequisites
                  </h3>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {program.prerequisites.map(req => (
                      <li key={req} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-tejas-orange shrink-0 mt-1.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Career Outcomes */}
                <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Target Engineering Roles
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {program.career_outcomes.map(outcome => (
                      <span
                        key={outcome}
                        className="rounded-lg bg-tejas-blue/10 px-2.5 py-1 text-xs font-medium text-tejas-blue border border-tejas-blue/20"
                      >
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Apply Bar (< lg screens) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-xl lg:hidden">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            {program.badge || `${program.duration_weeks} Weeks`}
          </span>
          <span className="text-sm font-black font-display text-foreground">
            {program.fee_inr === 0 ? 'Merit Fellowship' : formatCurrencyINR(program.fee_inr)}
          </span>
        </div>
        <Link
          href={`/admissions/apply?program=${program.slug}`}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-tejas-flame-red via-tejas-flame-orange to-tejas-flame-amber px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 active:scale-95 transition"
        >
          <span>Apply Now</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </PublicShell>
  );
}
