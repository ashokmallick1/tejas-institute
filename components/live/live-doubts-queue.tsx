'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Radio,
  Send,
  Sparkles,
  User,
  Filter,
} from 'lucide-react';
import { LiveDoubt } from '@/types/live-class';

interface LiveDoubtsQueueProps {
  doubts: LiveDoubt[];
  onAskDoubt: (text: string) => void;
  onToggleUpvote: (doubtId: string) => void;
}

export function LiveDoubtsQueue({
  doubts,
  onAskDoubt,
  onToggleUpvote,
}: LiveDoubtsQueueProps) {
  const [doubtInput, setDoubtInput] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ANSWERING' | 'RESOLVED'>('ALL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtInput.trim()) return;
    onAskDoubt(doubtInput.trim());
    setDoubtInput('');
  };

  const filteredDoubts = doubts.filter((d) => {
    if (filter === 'ANSWERING') return d.status === 'ANSWERING_LIVE';
    if (filter === 'RESOLVED') return d.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden">
      {/* ── Header Bar ── */}
      <div className="p-4 border-b border-border bg-card/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-display">Live Doubt Queue</h3>
              <p className="text-[11px] text-muted-foreground">TAs &amp; Faculty resolving questions live</p>
            </div>
          </div>

          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-mono font-bold text-muted-foreground">
            {doubts.length} Doubts
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-border/50 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
              filter === 'ALL'
                ? 'bg-tejas-blue text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            All ({doubts.length})
          </button>
          <button
            onClick={() => setFilter('ANSWERING')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
              filter === 'ANSWERING'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Radio className="h-3 w-3 animate-pulse" />
            <span>On Stream ({doubts.filter((d) => d.status === 'ANSWERING_LIVE').length})</span>
          </button>
          <button
            onClick={() => setFilter('RESOLVED')}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
              filter === 'RESOLVED'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Resolved ({doubts.filter((d) => d.status === 'RESOLVED').length})
          </button>
        </div>
      </div>

      {/* ── Scrollable Doubts List ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-border/30">
        {filteredDoubts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
            <HelpCircle className="h-8 w-8 opacity-40 mb-2" />
            <p className="text-xs font-medium">No doubts matching this filter.</p>
            <p className="text-[11px] mt-0.5">Post your question below for real-time TA support.</p>
          </div>
        ) : (
          filteredDoubts.map((doubt) => (
            <div key={doubt.id} className="pt-3.5 first:pt-0 space-y-2">
              {/* Question Header & Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold">
                    {doubt.student_name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground">{doubt.student_name}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">{doubt.timestamp_str}</span>
                  </div>
                </div>

                {/* Status Badges */}
                {doubt.status === 'ANSWERING_LIVE' && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-extrabold text-amber-400 animate-pulse">
                    <Radio className="h-2.5 w-2.5" />
                    <span>ANSWERING ON STREAM</span>
                  </span>
                )}
                {doubt.status === 'RESOLVED' && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    <span>RESOLVED</span>
                  </span>
                )}
                {doubt.status === 'OPEN' && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    IN QUEUE
                  </span>
                )}
              </div>

              {/* Question Text */}
              <p className="text-xs leading-relaxed text-foreground/90 pl-8">
                {doubt.doubt_text}
              </p>

              {/* Answer Box if Resolved */}
              {doubt.answer && (
                <div className="ml-8 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                    <Sparkles className="h-3 w-3" />
                    <span>TA Response · {doubt.answered_by}</span>
                    <span className="text-muted-foreground font-normal ml-auto text-[10px]">
                      {doubt.answered_at}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {doubt.answer}
                  </p>
                </div>
              )}

              {/* Actions: Upvote Button */}
              <div className="flex items-center justify-between pl-8 pt-1 text-xs">
                <button
                  onClick={() => onToggleUpvote(doubt.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    doubt.upvoted_by_user
                      ? 'bg-tejas-blue/20 text-tejas-blue border border-tejas-blue/40 font-bold'
                      : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  title="I have this doubt too"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>{doubt.upvotes}</span>
                  <span className="text-[10px] opacity-80 hidden sm:inline">Have Doubt</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Bottom Input Form ── */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card/90">
        <div className="relative">
          <input
            type="text"
            value={doubtInput}
            onChange={(e) => setDoubtInput(e.target.value)}
            placeholder="Ask a doubt for faculty or TAs (e.g. KV Cache allocation)..."
            className="w-full rounded-xl border border-border bg-background pl-3.5 pr-20 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!doubtInput.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-40 transition flex items-center gap-1"
          >
            <span>Ask</span>
            <Send className="h-3 w-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
