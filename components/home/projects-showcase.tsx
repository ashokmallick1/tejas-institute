import React from 'react';
import Link from 'next/link';
import { SAMPLE_PROJECTS } from '@/lib/data/mock-store';
import { Github, ExternalLink, Code2, ArrowRight, CheckCircle } from 'lucide-react';

export function ProjectsShowcase() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
              <Code2 className="h-3.5 w-3.5" />
              <span>Evidence of Mastery</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl font-display text-foreground">
              What TEJAS Fellows Actually Build
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Every graduate leaves with production-grade repositories and demonstrated systems—not just multiple choice certificates.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-tejas-blue hover:underline"
          >
            <span>View All Fellow Projects</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SAMPLE_PROJECTS.map(project => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-tejas-blue/40 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 border border-emerald-500/20">
                    {project.status}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Fellow: <span className="font-semibold text-foreground">{project.student_name}</span>
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-foreground">
                  {project.title}
                </h3>
                <div className="text-xs font-medium text-tejas-blue mt-1">
                  {project.tagline}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech_stack.map(tech => (
                    <span
                      key={tech}
                      className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 font-medium text-foreground hover:text-tejas-blue transition"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>View Repository</span>
                  </a>
                )}
                {project.deployment_url && (
                  <a
                    href={project.deployment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-semibold text-tejas-orange hover:underline"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
