import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
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
  ShieldAlert,
  Zap,
} from 'lucide-react';

export const metadata = {
  title: 'Learn While You Work | TEJAS Pedagogy & Engineering Flywheel',
  description: 'Learn → Lab → Apply → Mentor Review → Improve → Document → Demonstrate. The rigorous 7-stage engineering methodology at TEJAS Institute of Advanced Technology.',
};

export default function LearnWhileYouWorkPage() {
  const flywheelStages = [
    {
      step: '01',
      name: 'LEARN (Concept)',
      icon: BookOpen,
      tagline: 'Deep Theoretical & Mathematical Grounding',
      whatYouDo: 'Master first principles rather than superficial abstractions. Fellows dissect loss landscape geometry, transformer tensor mathematics, distributed consensus algorithms (Raft/Paxos), and silicon timing constraints.',
      labsInvolved: 'Interactive mathematical notebooks & derivation seminars.',
      output: 'Validated theoretical mental model & architectural blueprint.',
    },
    {
      step: '02',
      name: 'LAB (Hands-on Lab)',
      icon: FlaskConical,
      tagline: 'Immediate Hardware & Cluster Verification',
      whatYouDo: 'No lecture ends without an immediate lab. Within 30 minutes of theory, fellows log into our Bhubaneswar GPU clusters or hardware benches to run kernels, capture logic traces, or profile VRAM consumption.',
      labsInvolved: 'H100 GPU nodes, FPGA synthesizers, CAN-bus simulators.',
      output: 'Passing automated unit tests and bench measurements.',
    },
    {
      step: '03',
      name: 'APPLY (Real Project)',
      icon: Hammer,
      tagline: 'Constructing Production-Grade Systems',
      whatYouDo: 'Transition from isolated snippets to architecting multi-service systems. Every fellow builds real enterprise software—handling real edge cases, concurrent workloads, authentication, and database schemas.',
      labsInvolved: 'Dockerized microservices, Kubernetes clusters, vector stores.',
      output: 'End-to-end repository with continuous integration pipelines.',
    },
    {
      step: '04',
      name: 'MENTOR REVIEW (Weekly PR Critique)',
      icon: UserCheck,
      tagline: 'Tough, Uncompromising Code Audits',
      whatYouDo: 'Senior architects review your code line by line. Reviews inspect algorithmic complexity, memory leaks, defensive exception handling, latency profiling, and zero-trust security.',
      labsInvolved: 'GitHub Pull Request inline comments & 1-on-1 code defense.',
      output: 'Detailed code review action plan with required revisions.',
    },
    {
      step: '05',
      name: 'IMPROVE (Iteration & Hardening)',
      icon: RefreshCw,
      tagline: 'Refining Under Load & Stress',
      whatYouDo: 'Fellows address all mentor feedback. Synthetic load generators test system resiliency. Code is refactored for cache efficiency, lower p99 response times, and failure isolation.',
      labsInvolved: 'K6 synthetic load testing, memory profiling tools, Chaos testing.',
      output: 'Benchmark verification report showing measurable latency/throughput gains.',
    },
    {
      step: '06',
      name: 'DOCUMENT (Engineering Specs)',
      icon: FileCode2,
      tagline: 'Whitepapers, Diagrams & Technical Specs',
      whatYouDo: 'High-performing engineers write exceptional documentation. Fellows author comprehensive architecture RFCs, sequence diagrams, API references, and benchmark whitepapers.',
      labsInvolved: 'Mermaid diagrams, Swagger OpenAPI specs, benchmark writeups.',
      output: 'Publication-quality repository documentation and technical blog post.',
    },
    {
      step: '07',
      name: 'DEMONSTRATE (Demo Day Defense)',
      icon: Presentation,
      tagline: 'Live Defense in Front of Technical Panels',
      whatYouDo: 'On TEJAS Demo Day, fellows present live functioning software to our technical advisory board and corporate hiring partners. Fellows simulate live system failures and explain architectural choices.',
      labsInvolved: 'Main Auditorium & live video stream to industry partners.',
      output: 'Cryptographically signed TEJAS credential and hiring offers.',
    },
  ];

  return (
    <PublicShell>
      {/* Header */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 border-b border-border bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-tejas-orange/40 bg-tejas-orange/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-orange">
            Central Educational Philosophy
          </div>
          <h1 className="mt-5 sm:mt-6 text-3xl min-[400px]:text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-foreground">
            LEARN WHILE YOU WORK
          </h1>
          <p className="mt-4 text-base font-medium text-foreground sm:text-xl">
            Learn → Lab → Apply → Mentor Review → Improve → Document → Demonstrate
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto leading-relaxed">
            The conventional coaching model of passive video watching and superficial MCQs produces unemployable resumes. TEJAS reverses this paradigm through an uncompromising 7-stage engineering flywheel.
          </p>
        </div>
      </section>

      {/* Flywheel Breakdown */}
      <section className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="space-y-8 sm:space-y-12">
            {flywheelStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="relative rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm transition hover:border-tejas-blue/40 hover:shadow-xl lg:p-10"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-tejas-navy-900 to-tejas-blue-dark text-tejas-blue-glow shadow-md">
                        <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-tejas-orange/20 px-2 py-0.5 text-xs font-bold text-tejas-orange font-mono">
                            STAGE {stage.step}
                          </span>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            Rigor Gate {idx + 1} of 7
                          </span>
                        </div>
                        <h2 className="mt-1 text-xl sm:text-2xl font-bold font-display text-foreground">
                          {stage.name}
                        </h2>
                        <div className="text-xs sm:text-sm font-semibold text-tejas-blue mt-0.5">
                          {stage.tagline}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/70 bg-muted/30 px-3.5 py-2 text-xs text-muted-foreground lg:max-w-xs">
                      <span className="font-semibold text-foreground">Environment:</span> {stage.labsInvolved}
                    </div>
                  </div>

                  <p className="mt-5 sm:mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {stage.whatYouDo}
                  </p>

                  <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-t border-border/60 pt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-muted-foreground">Mandatory Exit Output:</span>
                      <span className="font-bold text-foreground">{stage.output}</span>
                    </div>

                    <span className="text-muted-foreground/60 font-mono text-[11px]">
                      Required for progression
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Admission CTA */}
          <div className="mt-12 sm:mt-16 text-center rounded-2xl sm:rounded-3xl border border-border bg-gradient-to-b from-card to-muted/40 p-6 sm:p-10">
            <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground">
              Experience the 7-Stage Flywheel First-Hand
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Join the next fellowship cohort at TEJAS Institute of Advanced Technology in Bhubaneswar.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
              <Link
                href="/admissions/apply"
                className="w-full sm:w-auto rounded-xl bg-tejas-blue px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-tejas-blue-dark transition text-center"
              >
                Apply for Fellowship
              </Link>
              <Link
                href="/programs"
                className="w-full sm:w-auto rounded-xl border border-border bg-card px-6 py-3 text-xs font-semibold text-foreground hover:bg-muted transition text-center"
              >
                View 18 Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
