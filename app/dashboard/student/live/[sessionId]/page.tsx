'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Radio,
  Users,
  MessageSquare,
  HelpCircle,
  Terminal,
  FileText,
  Download,
  Share2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  LiveClassService,
  SAMPLE_LIVE_SESSIONS,
} from '@/lib/live/live-class-service';
import { LiveClassroomPlayer } from '@/components/live/live-classroom-player';
import { LiveDoubtsQueue } from '@/components/live/live-doubts-queue';
import { LiveChatPanel } from '@/components/live/live-chat-panel';
import { LiveInteractiveSandbox } from '@/components/live/live-interactive-sandbox';
import { LivePollOverlay } from '@/components/live/live-poll-overlay';
import {
  LiveClassSession,
  LiveChatMessage,
  LiveDoubt,
  LivePoll,
} from '@/types/live-class';
import { useAuth } from '@/lib/auth/auth-context';

type ActiveRightTab = 'doubts' | 'chat' | 'sandbox' | 'handouts';

export default function LiveClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const sessionId = (params?.sessionId as string) || 'live-vllm-01';

  const [session, setSession] = useState<LiveClassSession | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<ActiveRightTab>('doubts');
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [doubts, setDoubts] = useState<LiveDoubt[]>([]);
  const [poll, setPoll] = useState<LivePoll | null>(null);
  const [attendanceVerified, setAttendanceVerified] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load session data
  useEffect(() => {
    const s = LiveClassService.getSessionById(sessionId);
    setSession(s);
    setMessages(LiveClassService.getChatMessages(sessionId));
    setDoubts(LiveClassService.getDoubts(sessionId));
    setPoll(LiveClassService.getActivePoll(sessionId));

    const studentId = user?.id || 'user-student-01';
    setAttendanceVerified(LiveClassService.isAttendanceVerified(sessionId, studentId));
  }, [sessionId, user]);

  // Handle Asking a Doubt
  const handleAskDoubt = (text: string) => {
    const studentName = user?.full_name || 'Rohan Patnaik';
    const newDoubt = LiveClassService.addDoubt(sessionId, text, studentName);
    setDoubts(LiveClassService.getDoubts(sessionId));
    showToast('Your doubt was added to the Queue for TAs and Faculty!');
  };

  // Handle Upvoting a Doubt
  const handleToggleUpvote = (doubtId: string) => {
    const updated = LiveClassService.toggleUpvoteDoubt(sessionId, doubtId);
    setDoubts(updated);
  };

  // Handle Sending Chat Message
  const handleSendMessage = (text: string) => {
    const senderName = user?.full_name || 'Rohan Patnaik';
    LiveClassService.addChatMessage(sessionId, {
      session_id: sessionId,
      sender_name: senderName,
      sender_role: 'STUDENT',
      message: text,
    });
    setMessages(LiveClassService.getChatMessages(sessionId));
  };

  // Handle Poll Vote
  const handleVotePoll = (optionId: string) => {
    const updatedPoll = LiveClassService.voteInPoll(sessionId, optionId);
    setPoll(updatedPoll);
    showToast('Your vote was counted in the Live Class Poll!');
  };

  // Handle Attendance Verification
  const handleVerifyAttendance = () => {
    const studentId = user?.id || 'user-student-01';
    LiveClassService.verifyAndLogAttendance(sessionId, studentId);
    setAttendanceVerified(true);
    showToast('✓ Attendance logged! Session credited to your Fellowship record.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">Loading Live Class Studio...</p>
        </div>
      </div>
    );
  }

  // Check if any doubt is currently being answered live
  const activeDoubt = doubts.find((d) => d.status === 'ANSWERING_LIVE');

  return (
    <div className="min-h-screen bg-[#08090a] text-foreground flex flex-col font-sans selection:bg-tejas-blue selection:text-white">
      {/* ── Top Header Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Back & Session Info */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard/student/live"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition shrink-0"
              title="Back to Live Timetable"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>LIVE CLASSROOM</span>
                </span>
                <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                  {session.batch_code}
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-foreground font-display truncate">
                {session.title}
              </h1>
            </div>
          </div>

          {/* Instructor & Exit */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 pr-3 border-r border-border">
              <img
                src={session.instructor_avatar}
                alt={session.instructor_name}
                className="h-7 w-7 rounded-full object-cover border border-white/20"
              />
              <div className="text-left">
                <div className="text-xs font-bold leading-none">{session.instructor_name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{session.instructor_role}</div>
              </div>
            </div>

            <Link
              href="/dashboard/student"
              className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              Exit Studio
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Studio Grid (Video on Left, Interactive Hub on Right) ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Column: Video Player & Overview (7 or 8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4">
          <LiveClassroomPlayer
            session={session}
            activeDoubtBeingAnswered={activeDoubt}
            attendanceVerified={attendanceVerified}
            onVerifyAttendance={handleVerifyAttendance}
            onSendReaction={(emoji) => handleSendMessage(`[Sent reaction ${emoji}]`)}
          />

          {/* Instructor & Handouts Quick Bar */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-tejas-blue">
                  {session.program_title}
                </span>
                <h2 className="text-base sm:text-lg font-bold font-display text-foreground mt-0.5">
                  {session.title}
                </h2>
              </div>

              {/* Handouts Download */}
              {session.notebook_url && (
                <a
                  href={session.notebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-tejas-blue/30 bg-tejas-blue/10 px-3.5 py-2 text-xs font-bold text-tejas-blue hover:bg-tejas-blue hover:text-white transition shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Lab Notebook</span>
                </a>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {session.description}
            </p>

            {/* Topic Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {session.topic_tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Scaler-style Multi-Tab Interactive Hub (5 or 4 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[650px] lg:h-[calc(100vh-6.5rem)] sticky top-16">
          {/* Tab Selector Headers */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-card border border-border mb-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('doubts')}
              className={`flex items-center justify-center gap-1 py-2 rounded-lg transition relative ${
                activeTab === 'doubts'
                  ? 'bg-amber-500 text-black font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Doubts</span>
              {doubts.length > 0 && (
                <span
                  className={`text-[9px] px-1 rounded-full font-mono ${
                    activeTab === 'doubts' ? 'bg-black text-amber-400' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {doubts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center justify-center gap-1 py-2 rounded-lg transition ${
                activeTab === 'chat'
                  ? 'bg-tejas-blue text-white font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center justify-center gap-1 py-2 rounded-lg transition ${
                activeTab === 'sandbox'
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Code</span>
            </button>

            <button
              onClick={() => setActiveTab('handouts')}
              className={`flex items-center justify-center gap-1 py-2 rounded-lg transition ${
                activeTab === 'handouts'
                  ? 'bg-tejas-orange text-white font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Notes</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 min-h-0">
            {activeTab === 'doubts' && (
              <LiveDoubtsQueue
                doubts={doubts}
                onAskDoubt={handleAskDoubt}
                onToggleUpvote={handleToggleUpvote}
              />
            )}

            {activeTab === 'chat' && (
              <LiveChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                onSendReaction={(emoji) => handleSendMessage(`[Sent reaction ${emoji}]`)}
              />
            )}

            {activeTab === 'sandbox' && (
              <LiveInteractiveSandbox
                initialCode={session.initial_code?.code || 'print("TEJAS Cluster Sandbox")'}
                filename={session.initial_code?.filename || 'solution.py'}
                language={session.initial_code?.language || 'python'}
              />
            )}

            {activeTab === 'handouts' && (
              <div className="h-full bg-card rounded-2xl border border-border p-4 space-y-4 overflow-y-auto text-xs">
                <div className="space-y-1">
                  <h3 className="font-bold text-foreground text-sm font-display">Live Lecture Notes &amp; Handouts</h3>
                  <p className="text-muted-foreground text-[11px]">Download synced materials for this masterclass.</p>
                </div>

                <div className="space-y-2.5">
                  <div className="rounded-xl border border-border p-3 space-y-2 bg-muted/20">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-tejas-blue" />
                      <span>{session.handout_name || 'Lecture_Architecture_RFC.pdf'}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Full derivation of continuous batching mathematical latency bounds.
                    </p>
                    <button
                      onClick={() => showToast('Downloading lecture PDF...')}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-tejas-blue hover:underline"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download PDF (4.2 MB)</span>
                    </button>
                  </div>

                  {session.github_repo_url && (
                    <div className="rounded-xl border border-border p-3 space-y-2 bg-muted/20">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <Terminal className="h-4 w-4 text-emerald-400" />
                        <span>GitHub Class Repository</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Live repository with automated testbench and Slurm job submission scripts.
                      </p>
                      <a
                        href={session.github_repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Open GitHub Repo</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Scaler Live Poll Pop-up Overlay (Fastest Finger First) ── */}
      {poll && poll.is_active && (
        <LivePollOverlay
          poll={poll}
          onVote={handleVotePoll}
          onDismiss={() => setPoll(null)}
        />
      )}

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-zinc-900 border border-white/20 text-white px-4 py-2 text-xs font-semibold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
