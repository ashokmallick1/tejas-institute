'use client';

import React, { useState, useMemo } from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import { ALL_PROJECTS, type DomainProject } from '@/lib/data/projects-index';
import { ProjectCard } from '@/components/projects/project-card';
import { SCHOOLS, PROGRAMS } from '@/lib/data/programs';
import { CheckCircle2, Search, Briefcase, Sparkles, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  // Group programs by school for lookups
  const programsBySchool = useMemo(() => {
    const map = new Map<string, Set<string>>();
    SCHOOLS.forEach(s => {
      const slugs = new Set(PROGRAMS.filter(p => p.school_id === s.id).map(p => p.slug));
      map.set(s.id, slugs);
    });
    return map;
  }, []);

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((p) => {
      // School filter
      if (selectedSchoolId !== 'all') {
        const allowedSlugs = programsBySchool.get(selectedSchoolId);
        if (allowedSlugs && !allowedSlugs.has(p.programSlug)) return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) {
        return false;
      }

      // Text search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesProblem = p.problemStatement.toLowerCase().includes(q);
        const matchesTech = p.techStack.some(t => t.toLowerCase().includes(q));
        const matchesRoles = p.hiringRoles.some(r => r.toLowerCase().includes(q));
        const matchesCompanies = p.sampleCompanies?.some(c => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesProblem && !matchesTech && !matchesRoles && !matchesCompanies) {
          return false;
        }
      }

      return true;
    });
  }, [selectedSchoolId, selectedDifficulty, searchQuery, programsBySchool]);

  const activeSchool = selectedSchoolId === 'all'
    ? null
    : SCHOOLS.find(s => s.id === selectedSchoolId);

  return (
    <PublicShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card/80 via-card/40 to-background py-16 md:py-24">
        {/* Glow */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(0,85,255,0.2) 0%, transparent 70%)' }}
        />

        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              180+ Real-World Engineering Deliverables
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight font-display text-foreground leading-tight">
              Real-World Projects.<br />
              <span className="gradient-flame">Job-Ready Engineers.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              We do not build toy calculators or hello-world clones. TEJAS fellows engineer production-grade distributed architectures, custom silicon RTL, and enterprise integrations commissioned directly from industry playbooks.
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="border-b border-border bg-card/40 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <div>
              <div className="text-3xl font-black text-foreground font-display">180</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">Production Projects</div>
            </div>
            <div>
              <div className="text-3xl font-black text-tejas-blue font-display">18</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">Deep-Tech Programs</div>
            </div>
            <div>
              <div className="text-3xl font-black text-tejas-flame font-display">100%</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">Company-Grade Briefs</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-500 font-display flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-6 w-6" /> Direct
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">Placement Pipeline</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Explorer */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Controls Bar: Search & Difficulty */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by tech (e.g. PyTorch, Kubernetes, RISC-V, Kafka)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
              />
            </div>

            {/* Difficulty Filter — Touch-friendly horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-touch py-1 max-w-full">
              <span className="text-xs font-semibold text-muted-foreground shrink-0 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Level:
              </span>
              <div className="flex gap-1 shrink-0">
                {(['all', 'Foundation', 'Intermediate', 'Advanced', 'Expert'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition shrink-0 ${
                      selectedDifficulty === diff
                        ? 'bg-tejas-blue text-white shadow-sm'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {diff === 'all' ? 'All Levels' : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* School Tabs */}
          <div className="overflow-x-auto no-scrollbar scroll-touch pb-2">
            <div className="inline-flex gap-1.5 rounded-xl border border-border bg-card p-1.5 min-w-full sm:min-w-0">
              <button
                onClick={() => setSelectedSchoolId('all')}
                className={`whitespace-nowrap rounded-lg px-3.5 sm:px-4 py-2 text-xs font-semibold transition ${
                  selectedSchoolId === 'all'
                    ? 'bg-tejas-blue text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                All Schools ({ALL_PROJECTS.length})
              </button>
              {SCHOOLS.map(school => {
                const schoolSlugs = programsBySchool.get(school.id);
                const count = ALL_PROJECTS.filter(p => schoolSlugs?.has(p.programSlug)).length;
                return (
                  <button
                    key={school.id}
                    onClick={() => setSelectedSchoolId(school.id)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      selectedSchoolId === school.id
                        ? 'bg-tejas-blue text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    {school.name.replace('School of ', '')} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active School Banner */}
          {activeSchool && (
            <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-tejas-orange">
                  Active School Focus
                </span>
                <h2 className="text-xl font-bold font-display text-foreground">
                  {activeSchool.name}
                </h2>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  {activeSchool.description}
                </p>
              </div>
              <Link
                href={`/schools/${activeSchool.slug}`}
                className="shrink-0 rounded-xl border border-tejas-blue/40 bg-tejas-blue/10 px-4 py-2 text-xs font-bold text-tejas-blue hover:bg-tejas-blue hover:text-white transition"
              >
                Explore School Programs &rarr;
              </Link>
            </div>
          )}

          {/* Projects Results Count */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing <strong className="text-foreground">{filteredProjects.length}</strong> real-world projects</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-tejas-blue hover:underline"
              >
                Clear search filter
              </button>
            )}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
              <Briefcase className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No projects match your filter</h3>
              <p className="text-xs text-muted-foreground">
                Try selecting &ldquo;All Schools&rdquo; or clearing the search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="flex flex-col">
                  <ProjectCard
                    project={project}
                    expanded={expandedProjectId === project.id}
                  />
                  <button
                    onClick={() => setExpandedProjectId(
                      expandedProjectId === project.id ? null : project.id
                    )}
                    className="mt-2 text-center text-xs font-semibold text-tejas-blue hover:underline py-1"
                  >
                    {expandedProjectId === project.id ? 'Show less' : 'View full problem & deliverables &rarr;'}
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </PublicShell>
  );
}
