'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import {
  Radio,
  Calendar,
  Clock,
  Users,
  Video,
  Play,
  ArrowRight,
  Sparkles,
  Download,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Flame,
  Search,
  Filter,
} from 'lucide-react';
import {
  LiveClassService,
  SAMPLE_LIVE_SESSIONS,
} from '@/lib/live/live-class-service';
import { LiveClassSession } from '@/types/live-class';

export default function StudentLiveClassesHubPage() {
  const [sessions] = useState<LiveClassSession[]>(SAMPLE_LIVE_SESSIONS);
  const [filterTag, setFilterTag] = useState<string>('ALL');

  const liveSession = sessions.find((s) => s.status === 'LIVE');
  const upcomingSessions = sessions.filter((s) => s.status === 'UPCOMING');
  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED');

  return (
    <DashboardShell activeRole="student">
      <div className="space-y-8">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span>Scaler-Style Live Masterclass Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-foreground mt-2">
              Live Interactive Classes &amp; Labs
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Attend live architecture walkthroughs, resolve doubts with TAs in real time, and code along in your cluster sandbox.
            </p>
          </div>

          {liveSession && (
            <Link
              href={`/dashboard/student/live/${liveSession.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-tejas-orange px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-rose-600/30 hover:scale-105 transition shrink-0"
            >
              <Radio className="h-4 w-4 animate-pulse" />
              <span>Join Active Stream Now</span>
            </Link>
          )}
        </div>

        {/* ── Active Live Stream Hero Card ── */}
        {liveSession && (
          <div className="relative overflow-hidden rounded-3xl border-2 border-rose-500/50 bg-gradient-to-br from-card via-card/90 to-rose-950/20 p-6 sm:p-8 shadow-2xl">
            {/* Glow effect */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full opacity-30 blur-3xl"
              style={{ background: 'radial-gradient(circle, #e11d48, transparent)' }}
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-rose-600/40">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    <span>HAPPENING NOW</span>
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-mono font-medium text-foreground">
                    {liveSession.batch_code}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{liveSession.active_viewers} Fellows Watching Live</span>
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground leading-tight">
                    {liveSession.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {liveSession.description}
                  </p>
                </div>

                {/* Faculty & TA Details */}
                <div className="flex items-center gap-4 pt-2">
                  <img
                    src={liveSession.instructor_avatar}
                    alt={liveSession.instructor_name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-rose-500/50 shadow-md"
                  />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">
                      {liveSession.instructor_name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {liveSession.instructor_role} · TAs: {liveSession.ta_names.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <Link
                  href={`/dashboard/student/live/${liveSession.id}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-tejas-orange px-6 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-xl shadow-rose-600/30 hover:opacity-90 transition text-center"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Enter Live Classroom</span>
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-mono">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Session Length: {liveSession.duration_mins} Minutes</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Upcoming Masterclasses Timetable ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-tejas-blue" />
              <h2 className="text-lg font-bold font-display text-foreground">
                Upcoming Live Schedule
              </h2>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              Synchronized with Bhubaneswar Lab Calendar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-tejas-blue/40 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-tejas-blue/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-tejas-blue">
                      UPCOMING MASTERCLASS
                    </span>
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(session.scheduled_at).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-display text-foreground leading-snug">
                    {session.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {session.description}
                  </p>

                  {/* Instructor Pill */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <img
                      src={session.instructor_avatar}
                      alt={session.instructor_name}
                      className="h-7 w-7 rounded-full object-cover border border-border"
                    />
                    <div className="text-xs font-semibold text-foreground">
                      {session.instructor_name}
                      <span className="text-[10px] font-normal text-muted-foreground block">
                        {session.instructor_role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/60">
                  <div className="flex flex-wrap gap-1">
                    {session.topic_tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => alert(`Reminder set! You will receive an SMS/email alert 15 minutes before "${session.title}" starts.`)}
                    className="rounded-lg bg-muted px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted/80 transition"
                  >
                    Set Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Completed Classes & Library Archive ── */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-bold font-display text-foreground">
                Class Recordings &amp; Handouts Archive
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Searchable full-HD recordings with timestamped doubts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedSessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      RECORDING AVAILABLE (1080P)
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {session.duration_mins} mins
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-display text-foreground leading-snug">
                    {session.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {session.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/60">
                  <div className="text-xs text-muted-foreground">
                    Instructor: <strong className="text-foreground">{session.instructor_name}</strong>
                  </div>

                  <Link
                    href={`/dashboard/student/live/${session.id}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-tejas-blue/15 border border-tejas-blue/30 px-3.5 py-1.5 text-xs font-bold text-tejas-blue hover:bg-tejas-blue hover:text-white transition"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Watch Recording</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
