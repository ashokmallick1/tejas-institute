'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import {
  Video,
  Radio,
  Users,
  BarChart3,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Clock,
  Pin,
  ExternalLink,
} from 'lucide-react';
import {
  LiveClassService,
  SAMPLE_LIVE_SESSIONS,
} from '@/lib/live/live-class-service';
import { LiveDoubt, LivePoll, LiveChatMessage } from '@/types/live-class';

export default function TrainerLiveStudioPage() {
  const session = SAMPLE_LIVE_SESSIONS[0]; // Active live session

  const [doubts, setDoubts] = useState<LiveDoubt[]>([]);
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [poll, setPoll] = useState<LivePoll | null>(null);

  // New Poll Modal state
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptionA, setPollOptionA] = useState('');
  const [pollOptionB, setPollOptionB] = useState('');
  const [pollOptionC, setPollOptionC] = useState('');
  const [pollOptionD, setPollOptionD] = useState('');

  // TA quick response state
  const [activeAnsweringDoubtId, setActiveAnsweringDoubtId] = useState<string | null>(null);
  const [taAnswerText, setTaAnswerText] = useState('');

  useEffect(() => {
    setDoubts(LiveClassService.getDoubts(session.id));
    setMessages(LiveClassService.getChatMessages(session.id));
    setPoll(LiveClassService.getActivePoll(session.id));
  }, [session.id]);

  // Mark Doubt as "Answering on Stream"
  const handleMarkAnsweringLive = (doubtId: string) => {
    const updated = LiveClassService.updateDoubtStatus(session.id, doubtId, 'ANSWERING_LIVE');
    setDoubts(updated);
  };

  // Submit TA Resolution
  const handleResolveDoubt = (doubtId: string) => {
    if (!taAnswerText.trim()) return;
    const updated = LiveClassService.updateDoubtStatus(
      session.id,
      doubtId,
      'RESOLVED',
      taAnswerText.trim(),
      'Prof. Priyadarshi Mohapatra'
    );
    setDoubts(updated);
    setActiveAnsweringDoubtId(null);
    setTaAnswerText('');
  };

  // Create & Push Live Poll to Class
  const handleLaunchPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion || !pollOptionA || !pollOptionB) return;

    const newPoll: LivePoll = {
      id: `poll-${Date.now()}`,
      session_id: session.id,
      question: pollQuestion,
      options: [
        { id: 'opt-a', text: pollOptionA, votes: 0 },
        { id: 'opt-b', text: pollOptionB, votes: 0 },
        ...(pollOptionC ? [{ id: 'opt-c', text: pollOptionC, votes: 0 }] : []),
        ...(pollOptionD ? [{ id: 'opt-d', text: pollOptionD, votes: 0 }] : []),
      ],
      correct_option_id: 'opt-a',
      is_active: true,
      duration_seconds: 45,
      seconds_remaining: 45,
      total_votes: 0,
      explanation: 'Verified by Faculty live on stream.',
    };

    localStorage.setItem(`tejas_live_poll_${session.id}`, JSON.stringify(newPoll));
    setPoll(newPoll);
    setShowPollModal(false);
    setPollQuestion('');
  };

  return (
    <DashboardShell activeRole="trainer">
      <div className="space-y-6">
        {/* ── Studio Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-rose-600/30">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                <span>FACULTY BROADCAST CONSOLE</span>
              </span>
              <span className="text-xs font-mono text-muted-foreground">{session.batch_code}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-foreground mt-2">
              {session.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPollModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2.5 text-xs font-bold text-black transition shadow-lg shadow-amber-500/20"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Push Live Poll to Class</span>
            </button>

            <Link
              href={`/dashboard/student/live/${session.id}`}
              target="_blank"
              className="flex items-center gap-1 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
            >
              <span>View Fellow Screen</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Telemetry Health Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              <span>Active Attendance</span>
            </div>
            <div className="text-2xl font-bold font-display text-foreground">{session.active_viewers}</div>
            <div className="text-[10px] text-emerald-400 font-mono">100% Ingest Health</div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
              <span>Pending Doubts</span>
            </div>
            <div className="text-2xl font-bold font-display text-amber-400">
              {doubts.filter((d) => d.status === 'OPEN').length}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">{doubts.filter((d) => d.status === 'RESOLVED').length} Resolved by TAs</div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5 text-tejas-blue" />
              <span>Active Poll Votes</span>
            </div>
            <div className="text-2xl font-bold font-display text-foreground">
              {poll ? poll.total_votes : 0}
            </div>
            <div className="text-[10px] text-tejas-blue font-mono">{poll ? `${poll.seconds_remaining}s timer left` : 'No active poll'}</div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Radio className="h-3.5 w-3.5 text-rose-500" />
              <span>Broadcast Bitrate</span>
            </div>
            <div className="text-2xl font-bold font-display text-foreground">6,500 <span className="text-xs font-normal text-muted-foreground">kbps</span></div>
            <div className="text-[10px] text-emerald-400 font-mono">1080p60 · H.264 WebRTC</div>
          </div>
        </div>

        {/* ── Main Console Layout: Doubts Queue Management & Stream Chat ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Doubts Queue (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-amber-400" />
                <h2 className="text-base font-bold font-display text-foreground">
                  Class Doubt Queue &amp; Triage
                </h2>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Sorted by Fellow Upvotes</span>
            </div>

            <div className="space-y-3">
              {doubts.map((doubt) => (
                <div
                  key={doubt.id}
                  className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-foreground">{doubt.student_name}</span>
                      <span className="text-[10px] text-muted-foreground ml-2 font-mono">
                        ▲ {doubt.upvotes} fellows have this doubt
                      </span>
                    </div>

                    {doubt.status === 'ANSWERING_LIVE' && (
                      <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-black text-amber-400 animate-pulse">
                        ON STREAM NOW
                      </span>
                    )}
                    {doubt.status === 'RESOLVED' && (
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        RESOLVED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                    &ldquo;{doubt.doubt_text}&rdquo;
                  </p>

                  {doubt.answer && (
                    <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/30 p-2.5 text-xs text-emerald-300">
                      <strong>Answer:</strong> {doubt.answer}
                    </div>
                  )}

                  {/* Actions for Faculty / TAs */}
                  <div className="flex items-center gap-2 pt-1 border-t border-border/40 text-xs">
                    {doubt.status !== 'ANSWERING_LIVE' && (
                      <button
                        onClick={() => handleMarkAnsweringLive(doubt.id)}
                        className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition flex items-center gap-1"
                      >
                        <Radio className="h-3 w-3" />
                        <span>Answer Live on Stream</span>
                      </button>
                    )}

                    {activeAnsweringDoubtId === doubt.id ? (
                      <div className="w-full space-y-2 pt-2">
                        <textarea
                          value={taAnswerText}
                          onChange={(e) => setTaAnswerText(e.target.value)}
                          placeholder="Type TA technical answer..."
                          className="w-full rounded-lg border border-border bg-background p-2 text-xs focus:outline-none focus:border-emerald-500"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolveDoubt(doubt.id)}
                            className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-bold text-black"
                          >
                            Submit TA Answer
                          </button>
                          <button
                            onClick={() => setActiveAnsweringDoubtId(null)}
                            className="rounded-lg bg-muted px-3 py-1 text-xs text-muted-foreground"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      doubt.status !== 'RESOLVED' && (
                        <button
                          onClick={() => {
                            setActiveAnsweringDoubtId(doubt.id);
                            setTaAnswerText('');
                          }}
                          className="rounded-lg bg-muted px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted/80 transition"
                        >
                          Type TA Answer
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Stream & Poll Status (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Poll Live Results */}
            {poll && (
              <div className="rounded-2xl border border-amber-500/40 bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <BarChart3 className="h-4 w-4" />
                    <span>Active Live Poll Breakdown</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{poll.total_votes} total responses</span>
                </div>

                <p className="text-xs font-medium text-foreground">{poll.question}</p>

                <div className="space-y-2 pt-1">
                  {poll.options.map((opt) => {
                    const pct = poll.total_votes > 0 ? Math.round((opt.votes / poll.total_votes) * 100) : 0;
                    return (
                      <div key={opt.id} className="space-y-1 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span className="truncate pr-2">{opt.text}</span>
                          <span className="font-mono font-bold text-foreground">{pct}% ({opt.votes})</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Chat Monitor */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 h-[450px] flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-tejas-blue" />
                  <h3 className="text-sm font-bold font-display text-foreground">Fellow Chat Stream</h3>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">Live Feed</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 text-xs">
                {messages.map((m) => (
                  <div key={m.id} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-foreground">{m.sender_name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{m.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{m.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Launch Poll Modal ── */}
        {showPollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                <span>Create &amp; Push Live Poll</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Pushes an instant Fastest-Finger-First pop-up to all active fellows in the stream.
              </p>

              <form onSubmit={handleLaunchPoll} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">Question</label>
                  <input
                    type="text"
                    required
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="e.g. Which layer eliminates internal fragmentation?"
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Option A (Correct Choice)</label>
                  <input
                    type="text"
                    required
                    value={pollOptionA}
                    onChange={(e) => setPollOptionA(e.target.value)}
                    placeholder="e.g. PagedAttention with 16-token physical blocks"
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Option B</label>
                  <input
                    type="text"
                    required
                    value={pollOptionB}
                    onChange={(e) => setPollOptionB(e.target.value)}
                    placeholder="e.g. Naive contiguous allocation"
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Option C (Optional)</label>
                  <input
                    type="text"
                    value={pollOptionC}
                    onChange={(e) => setPollOptionC(e.target.value)}
                    placeholder="e.g. DeepSpeed ZeRO-3"
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition"
                  >
                    Broadcast Poll Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPollModal(false)}
                    className="rounded-xl bg-muted px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
