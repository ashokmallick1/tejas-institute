'use client';

import React, { useState, useMemo } from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { PROGRAMS, SCHOOLS } from '@/lib/data/programs';
import { formatCurrencyINR } from '@/lib/utils';
import {
  Search,
  Filter,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';

export default function ProgramsCataloguePage() {
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPrograms = useMemo(() => {
    return PROGRAMS.filter(program => {
      const matchesSchool = selectedSchool === 'all' || program.school_id === selectedSchool;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        program.title.toLowerCase().includes(query) ||
        program.tagline.toLowerCase().includes(query) ||
        program.overview.toLowerCase().includes(query) ||
        program.tools.some(t => t.toLowerCase().includes(query));

      return matchesSchool && matchesQuery;
    });
  }, [selectedSchool, searchQuery]);

  return (
    <PublicShell>
      {/* Catalog Hero Banner */}
      <section className="border-b border-border bg-card/30 py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-tejas-blue/40 bg-tejas-blue/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-blue">
            <Sparkles className="h-3.5 w-3.5" />
            <span>18 Comprehensive Specializations</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            Academic &amp; Engineering Catalog
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Rigorous 36-class programs designed and mentored by senior industry architects in Bhubaneswar.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search programs, tools (e.g. PyTorch, Kubernetes, ROS2, VLSI)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none focus:ring-1 focus:ring-tejas-blue"
            />
          </div>
        </div>
      </section>

      {/* Main Filterable Content */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* School Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            <button
              onClick={() => setSelectedSchool('all')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold shrink-0 transition ${
                selectedSchool === 'all'
                  ? 'bg-tejas-blue text-white shadow-md'
                  : 'border border-border bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              All 18 Programs
            </button>
            {SCHOOLS.map(school => (
              <button
                key={school.id}
                onClick={() => setSelectedSchool(school.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold shrink-0 transition ${
                  selectedSchool === school.id
                    ? 'bg-tejas-blue text-white shadow-md'
                    : 'border border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                {school.name.replace('School of ', '')}
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing <strong className="text-foreground">{filteredPrograms.length}</strong> of {PROGRAMS.length} programs</span>
            {selectedSchool !== 'all' && (
              <button
                onClick={() => setSelectedSchool('all')}
                className="text-tejas-blue hover:underline"
              >
                Clear school filter
              </button>
            )}
          </div>

          {/* Programs Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map(program => (
              <div
                key={program.id}
                className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-tejas-blue/50 hover:shadow-xl"
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

                  <h2 className="mt-3 text-lg font-bold text-foreground group-hover:text-tejas-blue transition-colors">
                    <Link href={`/programs/${program.slug}`}>
                      {program.title}
                    </Link>
                  </h2>

                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {program.tagline}
                  </p>

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

                  {/* Tools */}
                  <div className="mt-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Core Frameworks &amp; Tools
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {program.tools.slice(0, 5).map(tool => (
                        <span
                          key={tool}
                          className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
                        >
                          {tool}
                        </span>
                      ))}
                      {program.tools.length > 5 && (
                        <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          +{program.tools.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

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

          {filteredPrograms.length === 0 && (
            <div className="mt-16 text-center py-12 rounded-2xl border border-border bg-card">
              <Search className="h-8 w-8 text-muted-foreground mx-auto" />
              <h3 className="mt-3 text-base font-bold text-foreground">No matching programs found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try searching with a different keyword or select another school.
              </p>
              <button
                onClick={() => { setSelectedSchool('all'); setSearchQuery(''); }}
                className="mt-4 rounded-xl bg-tejas-blue px-4 py-2 text-xs font-semibold text-white"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
