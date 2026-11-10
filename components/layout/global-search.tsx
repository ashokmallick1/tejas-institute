'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Layers, Code2, ArrowRight } from 'lucide-react';
import { PROGRAMS } from '@/lib/data/programs';
import { SAMPLE_COURSES, SAMPLE_PROJECTS } from '@/lib/data/mock-store';

export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedPrograms = query
    ? PROGRAMS.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.tools.some(t => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 4)
    : [];

  const matchedProjects = query
    ? SAMPLE_PROJECTS.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.tech_stack.some(t => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-20 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-4 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            placeholder="Search programs, tools, projects, lessons..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 max-h-80 overflow-y-auto space-y-3 text-xs">
          {query && matchedPrograms.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-tejas-blue mb-1 px-2">
                Programs
              </div>
              {matchedPrograms.map(p => (
                <Link
                  key={p.id}
                  href={`/programs/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl p-2 hover:bg-muted transition"
                >
                  <div className="font-semibold text-foreground">{p.title}</div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}

          {query && matchedProjects.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1 px-2">
                Projects
              </div>
              {matchedProjects.map(proj => (
                <Link
                  key={proj.id}
                  href="/projects"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl p-2 hover:bg-muted transition"
                >
                  <div className="font-semibold text-foreground truncate max-w-sm">{proj.title}</div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-4 text-center text-muted-foreground">
              Type to search programs, tools like <span className="text-tejas-blue">PyTorch</span>, <span className="text-tejas-blue">SystemVerilog</span>, or <span className="text-tejas-blue">ROS2</span>...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
