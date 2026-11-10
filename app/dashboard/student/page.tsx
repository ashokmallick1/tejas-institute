'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { useAuth } from '@/lib/auth/auth-context';
import { useLms } from '@/lib/store/lms-store';
import { formatDate } from '@/lib/utils';
import {
  BookOpen,
  PlayCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Github,
  TrendingUp,
  UserCheck,
  Radio,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const {
    enrollments,
    attendance,
    submissions,
    projects,
    announcements,
    certificates,
    getStudentAttendanceStats,
  } = useLms();

  const currentEnrollment = enrollments[0];
  const attendanceStats = getStudentAttendanceStats(user?.id || 'user-student-01');
  const mySubmissions = submissions.filter(s => s.student_id === (user?.id || 'user-student-01'));
  const myProjects = projects.filter(p => p.student_id === (user?.id || 'user-student-01'));

  const moduleStages = [
    { name: 'Foundations & Math', status: 'completed' },
    { name: 'PyTorch & Transformers', status: 'completed' },
    { name: 'Enterprise RAG Systems', status: 'completed' },
    { name: 'Agentic Workflows & MCP', status: 'completed' },
    { name: 'Production LLM Serving (vLLM)', status: 'active' },
    { name: 'Demo Day Capstone Defense', status: 'upcoming' },
  ];

  return (
    <DashboardShell activeRole="student">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome & Fellowship Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-card via-card/80 to-tejas-blue/10 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-tejas-orange/15 px-3 py-0.5 text-xs font-bold text-tejas-orange">
                  FELLOWSHIP IN PROGRESS
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Batch: {currentEnrollment?.batch?.code || 'TEJAS-AI-2026-A'}
                </span>
              </div>
              <h1 className="text-2xl font-bold font-display sm:text-3xl text-foreground">
                Welcome back, {user?.full_name || 'Rohan'}
              </h1>
              <p className="text-xs text-muted-foreground max-w-xl">
                Track your laboratory code submissions, mentor reviews, and production capstone milestones at TEJAS Bhubaneswar.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/student/courses/course-ai-01/learn/les-01"
                className="flex items-center gap-2 rounded-2xl bg-tejas-blue px-5 py-3 text-xs font-bold text-white shadow-lg shadow-tejas-blue/25 hover:bg-tejas-blue-dark transition hover:scale-[1.02]"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Continue Learning</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Overall Progress */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Program Progress</span>
              <TrendingUp className="h-4 w-4 text-tejas-blue" />
            </div>
            <div className="mt-2 text-2xl font-black font-display text-foreground">
              {currentEnrollment?.progress_percentage || 82.5}%
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-tejas-blue to-tejas-blue-glow rounded-full"
                style={{ width: `${currentEnrollment?.progress_percentage || 82.5}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              Module 5 of 6 in progress
            </div>
          </div>

          {/* Attendance */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Lab Attendance</span>
              <Calendar className="h-4 w-4 text-tejas-orange" />
            </div>
            <div className="mt-2 text-2xl font-black font-display text-foreground">
              {attendanceStats.percentage}%
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>{attendanceStats.present} of {attendanceStats.total} Sessions Verified</span>
            </div>
          </div>

          {/* Assignments */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Assignments</span>
              <Layers className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-2xl font-black font-display text-foreground">
              {mySubmissions.filter(s => s.status === 'APPROVED').length} / {mySubmissions.length}
            </div>
            <div className="mt-2 text-[11px] text-emerald-500 font-semibold">
              Latest Grade: 96/100 (Distinction)
            </div>
          </div>

          {/* Certificate Credential */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Credentials</span>
              <Award className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black font-display text-foreground">
              1 Issued
            </div>
            <Link
              href={`/verify/${certificates[0]?.certificate_id || 'TEJAS-2026-AI-8921'}`}
              className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-tejas-blue hover:underline"
            >
              <span>View Verified Credential</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column (8 cols): Active Learning & Modules */}
          <div className="lg:col-span-8 space-y-8">
            {/* Active Learning Track Card */}
            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-tejas-blue">
                    Current Track
                  </span>
                  <h2 className="text-base sm:text-lg font-bold font-display text-foreground mt-0.5">
                    {currentEnrollment?.program?.title || 'AI Engineering & Generative AI'}
                  </h2>
                </div>
                <Link
                  href="/dashboard/student/courses/course-ai-01/learn/les-01"
                  className="inline-flex items-center justify-center rounded-xl bg-tejas-blue/15 px-3.5 py-2 text-xs font-bold text-tejas-blue hover:bg-tejas-blue hover:text-white transition w-full sm:w-auto"
                >
                  Enter Course Player
                </Link>
              </div>

              {/* Module Progress Stepper */}
              <div className="mt-6">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Curriculum Module Roadmap
                </div>
                <div className="space-y-2">
                  {moduleStages.map((mod, idx) => (
                    <div
                      key={mod.name}
                      className={`flex items-center justify-between rounded-xl p-3 text-xs ${
                        mod.status === 'completed'
                          ? 'border border-emerald-500/20 bg-emerald-500/5 text-foreground'
                          : mod.status === 'active'
                          ? 'border border-tejas-blue bg-tejas-blue/10 font-bold text-tejas-blue'
                          : 'border border-border/40 text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px]">0{idx + 1}</span>
                        <span>{mod.name}</span>
                      </div>
                      <span className="text-[11px] uppercase tracking-wider">
                        {mod.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        {mod.status === 'active' && 'IN PROGRESS →'}
                        {mod.status === 'upcoming' && 'UPCOMING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Assignments & PR Submissions */}
            <div id="assignments" className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold font-display text-foreground">
                    Assignments &amp; Code Reviews
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Evaluated under the LEARN WHILE YOU WORK methodology.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {mySubmissions.map(sub => (
                  <div
                    key={sub.id}
                    className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-foreground">
                          {sub.assignment_title}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Submitted {formatDate(sub.submitted_at)}
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 uppercase">
                        {sub.status} • {sub.score}/100
                      </span>
                    </div>

                    {sub.feedback && (
                      <div className="rounded-xl border border-border bg-card p-3 text-xs space-y-1">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-tejas-blue">
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>Mentor Review by {sub.reviewer_name}:</span>
                        </div>
                        <p className="text-muted-foreground italic text-[11px]">
                          &ldquo;{sub.feedback}&rdquo;
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs">
                      {sub.github_repo_url && (
                        <a
                          href={sub.github_repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>Repository</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Projects (Learn While You Work) */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold font-display text-foreground">
                My Production Project
              </h2>
              {myProjects.map(proj => (
                <div key={proj.id} className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-tejas-orange/20 px-2.5 py-0.5 text-[10px] font-bold text-tejas-orange uppercase">
                      STATUS: {proj.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Mentor: <strong className="text-foreground">{proj.mentor_name}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {proj.tech_stack.map(tech => (
                      <span key={tech} className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (4 cols): Schedule, Attendance, Announcements */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Master Class Studio Card (Scaler Live Experience) */}
            <div className="rounded-3xl border-2 border-rose-500/40 bg-gradient-to-br from-card via-card to-rose-950/20 p-6 shadow-lg space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <Radio className="h-4 w-4" />
                  <span>LIVE MASTERCLASS ACTIVE</span>
                </div>
                <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                  148 Watching
                </span>
              </div>

              <h3 className="text-base font-bold font-display text-foreground leading-snug">
                High-Throughput vLLM &amp; PagedAttention Lab
              </h3>

              <div className="text-xs text-muted-foreground space-y-1">
                <div>Instructor: <strong className="text-foreground">Prof. Priyadarshi Mohapatra</strong></div>
                <div>Format: Interactive Studio · Live Doubts &amp; Sandboxes</div>
                <div className="text-emerald-400 font-medium">✓ Automatic Attendance Tracking Enabled</div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link
                  href="/dashboard/student/live/live-vllm-01"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-tejas-orange py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:scale-[1.02] transition"
                >
                  <Radio className="h-3.5 w-3.5" />
                  <span>Join Live Stream</span>
                </Link>

                <Link
                  href="/dashboard/student/live"
                  className="rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground text-center"
                >
                  Schedule
                </Link>
              </div>
            </div>

            {/* Attendance Ledger */}
            <div id="attendance" className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Recent Attendance Log
                </h3>
                <span className="text-xs font-bold text-emerald-500 font-mono">
                  {attendanceStats.percentage}% Verified
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {attendance.slice(0, 5).map(att => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-2.5"
                  >
                    <div>
                      <div className="font-semibold text-foreground line-clamp-1">
                        {att.session_topic || 'Lab Session'}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{att.session_date}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      att.status === 'PRESENT' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                    }`}>
                      {att.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Institute Announcements
              </h3>
              <div className="space-y-3">
                {announcements.map(ann => (
                  <div key={ann.id} className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
                    <div className="text-xs font-bold text-foreground">{ann.title}</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                      {ann.content}
                    </p>
                    <div className="text-[10px] text-tejas-blue font-semibold pt-1">
                      {ann.author_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
