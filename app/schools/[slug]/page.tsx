import React from 'react';
import { notFound } from 'next/navigation';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { SCHOOLS, PROGRAMS } from '@/lib/data/programs';
import { formatCurrencyINR } from '@/lib/utils';
import { Brain, Cloud, Code2, Cpu, Factory, Clock, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SchoolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SCHOOLS.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: SchoolPageProps) {
  const { slug } = await params;
  const school = SCHOOLS.find(s => s.slug === slug);
  if (!school) return { title: 'School Not Found | TEJAS' };
  return {
    title: `${school.name} | TEJAS Institute of Advanced Technology`,
    description: school.description,
  };
}

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Cloud,
  Code2,
  Cpu,
  Factory,
};

export default async function SingleSchoolPage({ params }: SchoolPageProps) {
  const { slug } = await params;
  const school = SCHOOLS.find(s => s.slug === slug);
  if (!school) notFound();

  const Icon = iconMap[school.icon] || Brain;
  const programs = PROGRAMS.filter(p => p.school_id === school.id);

  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-tejas-blue/10 text-tejas-blue">
            <Icon className="h-8 w-8" />
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-tejas-orange">
            Academic School
          </div>
          <h1 className="text-3xl font-extrabold sm:text-5xl font-display text-foreground">
            {school.name}
          </h1>
          <p className="text-base font-semibold text-tejas-blue">
            {school.tagline}
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {school.description}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold font-display text-foreground mb-6">
            Programs under {school.name}
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map(prog => (
              <div
                key={prog.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-tejas-blue/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-tejas-orange uppercase">
                      {prog.badge || 'Fellowship'}
                    </span>
                    <span className="text-xs text-muted-foreground">{prog.duration_weeks} Weeks</span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-foreground">
                    <Link href={`/programs/${prog.slug}`} className="hover:text-tejas-blue">
                      {prog.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {prog.tagline}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {prog.tools.slice(0, 4).map(t => (
                      <span key={t} className="rounded bg-muted px-2 py-0.5 text-[10px] text-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Tuition</div>
                    <div className="text-sm font-bold text-foreground">{formatCurrencyINR(prog.fee_inr)}</div>
                  </div>
                  <Link
                    href={`/programs/${prog.slug}`}
                    className="flex items-center gap-1 rounded-xl bg-tejas-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-tejas-blue-dark transition"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
