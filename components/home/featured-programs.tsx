import React from 'react';
import Link from 'next/link';
import { PROGRAMS } from '@/lib/data/programs';
import { formatCurrencyINR } from '@/lib/utils';
import { Clock, BookOpen, ArrowRight, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export function FeaturedPrograms() {
  const featured = PROGRAMS.filter(p => p.is_featured).slice(0, 6);

  return (
    <section className="border-t border-border bg-card/20 py-14 sm:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-tejas-orange">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Industry-Aligned Tracks</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl font-display text-foreground">
              Featured Deep-Tech Programs
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Engineered with 36-class intensive laboratory curricula, 1-on-1 weekly code reviews, and production capstone demonstrations.
            </p>
          </div>

          <Link
            href="/programs"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:border-tejas-blue/50 hover:text-tejas-blue transition w-full sm:w-auto"
          >
            <span>View All 18 Programs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Programs Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map(program => (
            <div
              key={program.id}
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-tejas-blue/50 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-tejas-blue uppercase tracking-wider">
                    {program.school_name?.replace('School of ', '')}
                  </span>
                  {program.badge && (
                    <span className="rounded-full bg-tejas-orange/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-tejas-orange">
                      {program.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-tejas-blue transition-colors">
                  <Link href={`/programs/${program.slug}`}>
                    {program.title}
                  </Link>
                </h3>

                <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {program.tagline}
                </p>

                {/* Duration & Classes badge */}
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground border-y border-border/50 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-tejas-blue" />
                    <span>{program.duration_weeks} Weeks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-tejas-orange" />
                    <span>{program.class_count} Master Classes</span>
                  </div>
                </div>

                {/* Key Tools */}
                <div className="mt-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Industry Tools &amp; Frameworks
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {program.tools.slice(0, 4).map(tool => (
                      <span
                        key={tool}
                        className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
                      >
                        {tool}
                      </span>
                    ))}
                    {program.tools.length > 4 && (
                      <span className="rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        +{program.tools.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Fee */}
              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase">Tuition Fee</div>
                  <div className="text-base font-bold text-foreground font-display">
                    {formatCurrencyINR(program.fee_inr)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/programs/${program.slug}`}
                    className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
                  >
                    Curriculum
                  </Link>
                  <Link
                    href={`/admissions/apply?program=${program.slug}`}
                    className="flex items-center gap-1 rounded-xl bg-tejas-blue px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-tejas-blue-dark transition"
                  >
                    <span>Apply</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
