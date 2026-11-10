import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { SCHOOLS, PROGRAMS } from '@/lib/data/programs';
import { Brain, Cloud, Code2, Cpu, Factory, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Academic Schools | TEJAS Institute of Advanced Technology',
  description: 'Explore the 5 multidisciplinary schools of TEJAS: AI, Cloud, Software, Semiconductor, and Industrial Technology in Bhubaneswar.',
};

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Cloud,
  Code2,
  Cpu,
  Factory,
};

export default function SchoolsPage() {
  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-tejas-blue/40 bg-tejas-blue/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-blue">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Academic Architecture</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            The 5 Foundational Schools
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Multidisciplinary centers of deep-tech engineering, dedicated laboratories, and industry research in Bhubaneswar, Odisha.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {SCHOOLS.map((school, index) => {
            const Icon = iconMap[school.icon] || Brain;
            const schoolPrograms = PROGRAMS.filter(p => p.school_id === school.id);

            return (
              <div
                key={school.id}
                className="rounded-3xl border border-border bg-card p-8 shadow-sm transition hover:border-tejas-blue/30 hover:shadow-lg lg:p-12"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-tejas-blue/10 text-tejas-blue">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-tejas-orange">
                        School 0{index + 1}
                      </span>
                      <h2 className="mt-1 text-2xl font-bold font-display text-foreground sm:text-3xl">
                        {school.name}
                      </h2>
                      <div className="text-sm font-semibold text-tejas-blue mt-0.5">
                        {school.tagline}
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
                        {school.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/schools/${school.slug}`}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted self-start"
                  >
                    <span>School Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Programs under this School */}
                <div className="mt-8 border-t border-border/60 pt-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Programs Offered ({schoolPrograms.length})
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {schoolPrograms.map(prog => (
                      <Link
                        key={prog.id}
                        href={`/programs/${prog.slug}`}
                        className="group flex flex-col justify-between rounded-xl border border-border/70 bg-background/50 p-4 transition hover:border-tejas-blue/40 hover:bg-card"
                      >
                        <div>
                          <div className="text-[10px] font-bold uppercase text-tejas-orange">
                            {prog.badge || `${prog.duration_weeks} Weeks`}
                          </div>
                          <h3 className="mt-1 text-xs font-bold text-foreground group-hover:text-tejas-blue transition">
                            {prog.title}
                          </h3>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                          <span>{prog.class_count} Classes</span>
                          <span className="font-semibold text-foreground group-hover:text-tejas-blue flex items-center gap-0.5">
                            View <ArrowRight className="h-2.5 w-2.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PublicShell>
  );
}
