'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { useAuth } from '@/lib/auth/auth-context';
import { useLms } from '@/lib/store/lms-store';
import { formatDate } from '@/lib/utils';
import {
  Users,
  CheckCircle2,
  Clock,
  Github,
  MessageSquare,
  Award,
  AlertCircle,
  FileCode2,
  Send,
  ExternalLink,
} from 'lucide-react';

export default function MentorDashboardPage() {
  const { user } = useAuth();
  const { submissions, reviewSubmission, projects, updateProjectStatus } = useLms();

  // Review Modal state
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [scoreInput, setScoreInput] = useState(95);
  const [feedbackInput, setFeedbackInput] = useState('Clean implementation of causal attention matrix. Benchmark results match expected latency curves.');
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'CHANGES_REQUESTED'>('APPROVED');

  const selectedSub = submissions.find(s => s.id === selectedSubId);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubId) return;

    reviewSubmission(selectedSubId, Number(scoreInput), feedbackInput, reviewStatus);
    setSelectedSubId(null);
  };

  return (
    <DashboardShell activeRole="mentor">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Banner */}
        <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-emerald-500/10 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-500">
                SENIOR CODE REVIEW DESK
              </span>
              <h1 className="mt-2 text-2xl font-bold font-display text-foreground sm:text-3xl">
                Mentor Console — {user?.full_name || 'Er. Arpita Senapati'}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground max-w-xl">
                Review fellow GitHub PRs, conduct 1-on-1 code audits, and grade capstone engineering projects.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center">
              <div className="text-xs text-muted-foreground">Pending Reviews</div>
              <div className="text-2xl font-bold font-display text-foreground mt-0.5">
                {submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'UNDER_REVIEW').length}
              </div>
            </div>
          </div>
        </div>

        {/* Review Dialog / Overlay Form */}
        {selectedSub && (
          <div className="rounded-3xl border-2 border-tejas-blue bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-tejas-blue">Active PR Audit</span>
                <h3 className="text-base font-bold font-display text-foreground">
                  Reviewing: {selectedSub.assignment_title}
                </h3>
                <div className="text-xs text-muted-foreground">
                  Fellow: <strong className="text-foreground">{selectedSub.student_name}</strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubId(null)}
                className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">Score (Out of 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoreInput}
                    onChange={e => setScoreInput(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">Verdict</label>
                  <select
                    value={reviewStatus}
                    onChange={e => setReviewStatus(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                  >
                    <option value="APPROVED">APPROVED (Pass with Distinction)</option>
                    <option value="CHANGES_REQUESTED">CHANGES REQUESTED (Requires PR Revision)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Detailed Architectural Critique &amp; PR Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-tejas-blue focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-tejas-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-tejas-blue-dark transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Mentor Review</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Submissions Awaiting Mentor Review */}
        <div id="reviews" className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display text-foreground">
              Fellow Code &amp; Lab Submissions
            </h2>
            <span className="text-xs text-muted-foreground">{submissions.length} total entries</span>
          </div>

          <div className="space-y-3">
            {submissions.map(sub => (
              <div
                key={sub.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-muted/20 p-4 transition hover:border-border/80 sm:flex-row sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'APPROVED' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-tejas-orange/20 text-tejas-orange'
                    }`}>
                      {sub.status}
                    </span>
                    <span className="text-xs font-bold text-foreground">{sub.student_name}</span>
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-foreground">{sub.assignment_title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{sub.submission_text}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  {sub.github_repo_url && (
                    <a
                      href={sub.github_repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>PR / Repo</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setSelectedSubId(sub.id);
                      setScoreInput(sub.score || 90);
                      setFeedbackInput(sub.feedback || '');
                    }}
                    className="rounded-xl bg-tejas-blue px-3.5 py-1.5 text-xs font-bold text-white hover:bg-tejas-blue-dark"
                  >
                    Audit Work
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Capstone Milestones */}
        <div id="projects" className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold font-display text-foreground">
            Assigned Fellow Projects
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(proj => (
              <div key={proj.id} className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-tejas-blue">
                    {proj.status}
                  </span>
                  <span className="text-xs text-muted-foreground">{proj.student_name}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{proj.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{proj.description}</p>
                <div className="pt-2 flex items-center justify-between text-xs border-t border-border/50">
                  <span className="text-muted-foreground">Demo Status</span>
                  <button
                    onClick={() => updateProjectStatus(proj.id, proj.status === 'DEMONSTRATED' ? 'COMPLETED' : 'DEMONSTRATED')}
                    className="text-xs font-semibold text-tejas-orange hover:underline"
                  >
                    Toggle Demo State
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
