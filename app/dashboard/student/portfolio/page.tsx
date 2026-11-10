'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { useLms } from '@/lib/store/lms-store';
import { useAuth } from '@/lib/auth/auth-context';
import { StudentProject, ProjectStatus } from '@/types';
import {
  Folder,
  Github,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  Layers,
  Upload,
  Star,
} from 'lucide-react';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  COMPLETED: { label: 'Completed', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-950/40' },
  BUILDING: { label: 'In Progress', color: 'text-tejas-blue', bg: 'bg-blue-100 dark:bg-blue-950/40' },
  PLANNING: { label: 'Planning', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-950/40' },
  REVIEW: { label: 'In Review', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-950/40' },
  IMPROVEMENT: { label: 'Improving', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-950/40' },
  DEMONSTRATED: { label: 'Demonstrated', color: 'text-tejas-cyan', bg: 'bg-cyan-100 dark:bg-cyan-950/40' },
  IDEA: { label: 'Idea', color: 'text-muted-foreground', bg: 'bg-muted' },
};

export default function StudentPortfolioPage() {
  const { projects } = useLms();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'COMPLETED' | 'BUILDING'>('all');

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your project portfolio — showcasing real work built during the program
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
              <ExternalLink className="h-4 w-4" />
              View Public Portfolio
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-tejas-blue px-4 py-2 text-sm font-semibold text-white hover:bg-tejas-blue/90 transition-colors">
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total Projects', value: projects.length, icon: Folder, color: 'text-tejas-blue' },
            { label: 'Completed', value: projects.filter(p => p.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-green-500' },
            { label: 'In Progress', value: projects.filter(p => p.status === 'BUILDING').length, icon: Clock, color: 'text-yellow-500' },
            { label: 'Mentor Reviews', value: projects.filter(p => p.score !== null && p.score !== undefined).length, icon: Star, color: 'text-tejas-orange' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <Icon className={`h-5 w-5 mb-2 ${color}`} />
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
          {(['all', 'COMPLETED', 'BUILDING'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'BUILDING' ? 'In Progress' : f === 'COMPLETED' ? 'Completed' : 'All'}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(project => {
              const status = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.IDEA;
              return (
                <div key={project.id} className="group rounded-xl border border-border bg-card hover:border-tejas-blue/40 transition-all overflow-hidden">
                  {/* Thumbnail */}
                  <div className="h-32 bg-gradient-to-br from-tejas-navy to-tejas-blue/80 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Folder className="h-10 w-10 text-white/20" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    {project.score !== null && project.score !== undefined && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        {project.score}/10
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-tejas-blue transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech tags */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {project.tech_stack.slice(0, 4).map((tech: string) => (
                          <span key={tech} className="rounded-full bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 4 && (
                          <span className="rounded-full bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                            +{project.tech_stack.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Mentor feedback */}
                    {project.mentor_feedback && (
                      <div className="mt-3 rounded-lg bg-tejas-blue/5 border border-tejas-blue/20 p-2">
                        <div className="text-xs font-semibold text-tejas-blue mb-0.5">Mentor Feedback</div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{project.mentor_feedback}</p>
                      </div>
                    )}

                    {/* Links */}
                    <div className="mt-4 flex gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium hover:bg-muted/60 transition-colors"
                        >
                          <Github className="h-3.5 w-3.5" />
                          GitHub
                        </a>
                      )}
                      {project.deployment_url && (
                        <a
                          href={project.deployment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-tejas-blue px-3 py-1.5 text-xs font-medium text-white hover:bg-tejas-blue/90 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Demo
                        </a>
                      )}
                      {!project.github_url && !project.deployment_url && (
                        <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-tejas-blue/50 transition-colors">
                          <Upload className="h-3.5 w-3.5" />
                          Add Links
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Folder className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Projects Yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              Start building projects as you progress through your program.
            </p>
            <Link
              href="/dashboard/student"
              className="inline-flex items-center gap-2 rounded-lg bg-tejas-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-tejas-blue/90 transition-colors"
            >
              Continue Learning
            </Link>
          </div>
        )}

        {/* Portfolio tips */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-tejas-cyan" />
            Portfolio Building Tips
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Add a README to every GitHub repo — explain what it does, why, and how to run it.',
              'Include a live demo link. Even a simple Vercel/Render deployment shows initiative.',
              'Document your architecture decisions. Recruiters love engineers who can explain their choices.',
              'Tag relevant technologies so your profile shows up in the right searches.',
              'Write a short blog post about each major project. Link it from the project.',
              'Ask your mentor for a written review — add it as a testimonial on LinkedIn.',
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 rounded-lg bg-muted/30 p-3">
                <span className="text-tejas-cyan font-bold text-sm shrink-0">{i + 1}.</span>
                <p className="text-xs text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
