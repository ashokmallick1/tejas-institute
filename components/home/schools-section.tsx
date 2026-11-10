import React from 'react';
import Link from 'next/link';
import { SCHOOLS } from '@/lib/data/programs';
import { Brain, Cloud, Code2, Cpu, Factory, Building2, ArrowRight, Sparkles } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Cloud,
  Code2,
  Cpu,
  Factory,
  Building2,
};

export function SchoolsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-tejas-blue">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Academic Foundations</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl font-display text-foreground">
              The 6 Advanced Schools of TEJAS
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Organized into multidisciplinary schools engineered to meet India’s strategic deep-tech priorities.
            </p>
          </div>

          <Link
            href="/schools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-tejas-blue hover:underline"
          >
            <span>Explore All Schools</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SCHOOLS.map(school => {
            const Icon = iconMap[school.icon] || Brain;
            return (
              <div
                key={school.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-tejas-blue/50 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tejas-blue/10 text-tejas-blue transition-colors group-hover:bg-tejas-blue group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {school.programs_count} Programs
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-foreground group-hover:text-tejas-blue transition-colors">
                    {school.name}
                  </h3>
                  <div className="text-xs font-medium text-tejas-orange mt-0.5">
                    {school.tagline}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {school.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <Link
                    href={`/schools/${school.slug}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-tejas-blue"
                  >
                    <span>View School &amp; Programs</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Admissions CTA Card */}
          <div className="flex flex-col justify-between rounded-2xl border border-tejas-blue/30 bg-gradient-to-br from-tejas-navy-900 via-tejas-navy-800 to-tejas-blue-dark p-6 text-white shadow-xl">
            <div>
              <span className="rounded-full bg-tejas-orange/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-tejas-orange">
                Fellowship Cohort 2026
              </span>
              <h3 className="mt-4 text-xl font-bold font-display">
                Need guidance selecting your engineering specialization?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                Connect with our academic directors in Bhubaneswar for an in-depth curriculum consultation and lab walk-through.
              </p>
            </div>

            <div className="mt-6 pt-4">
              <Link
                href="/admissions/apply"
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-tejas-navy-900 transition hover:bg-slate-100"
              >
                <span>Apply for Academic Counselling</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
