'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  X,
  BarChart3,
} from 'lucide-react';
import { LivePoll } from '@/types/live-class';

interface LivePollOverlayProps {
  poll: LivePoll;
  onVote: (optionId: string) => void;
  onDismiss?: () => void;
}

export function LivePollOverlay({
  poll,
  onVote,
  onDismiss,
}: LivePollOverlayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(poll.user_voted_option_id || null);
  const [hasVoted, setHasVoted] = useState<boolean>(Boolean(poll.user_voted_option_id));
  const [timeLeft, setTimeLeft] = useState<number>(poll.seconds_remaining || 30);
  const [minimized, setMinimized] = useState<boolean>(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVoteSubmit = () => {
    if (!selectedOption) return;
    onVote(selectedOption);
    setHasVoted(true);
  };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-tejas-orange px-4 py-2 text-xs font-bold text-black shadow-2xl animate-bounce"
      >
        <Sparkles className="h-4 w-4" />
        <span>Live Poll Active ({timeLeft}s)</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-50 max-w-sm w-full rounded-2xl border border-amber-500/40 bg-zinc-950/95 text-white p-4 sm:p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4">
      {/* ── Poll Header ── */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-black font-black text-xs">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
              FACULTY LIVE POP QUIZ
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Fastest Finger First · {poll.total_votes} votes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timer Countdown */}
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-xs font-mono font-bold text-amber-400">
            <Clock className="h-3 w-3" />
            <span>{timeLeft}s</span>
          </div>

          <button
            onClick={() => {
              setMinimized(true);
              if (onDismiss) onDismiss();
            }}
            className="text-zinc-400 hover:text-white transition"
            title="Minimize poll"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Question Text ── */}
      <p className="text-xs sm:text-sm font-semibold text-zinc-100 leading-snug mb-3.5">
        {poll.question}
      </p>

      {/* ── Options / Results ── */}
      <div className="space-y-2 mb-4">
        {poll.options.map((opt, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D
          const percentage = poll.total_votes > 0 ? Math.round((opt.votes / poll.total_votes) * 100) : 0;
          const isSelected = selectedOption === opt.id;
          const isCorrect = poll.correct_option_id === opt.id;

          return (
            <button
              type="button"
              key={opt.id}
              onClick={() => {
                if (!hasVoted) setSelectedOption(opt.id);
              }}
              className={`w-full text-left relative overflow-hidden rounded-xl border p-2.5 sm:p-3 transition cursor-pointer ${
                hasVoted
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/30'
                    : isSelected
                    ? 'border-rose-500/50 bg-rose-950/20'
                    : 'border-zinc-800 bg-zinc-900/60'
                  : isSelected
                  ? 'border-amber-500 bg-amber-500/15 shadow-md'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              {/* Animated Percentage Fill Bar when voted */}
              {hasVoted && (
                <div
                  className={`absolute top-0 bottom-0 left-0 opacity-20 transition-all duration-700 ${
                    isCorrect ? 'bg-emerald-500' : 'bg-zinc-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                      hasVoted
                        ? isCorrect
                          ? 'bg-emerald-500 text-black'
                          : 'bg-zinc-800 text-zinc-300'
                        : isSelected
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="font-medium text-zinc-200">{opt.text}</span>
                </div>

                {hasVoted && (
                  <span className="font-mono font-bold text-xs text-zinc-300 shrink-0">
                    {percentage}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Bottom Submit or Explanation ── */}
      {hasVoted ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-2.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Vote Recorded! Explanation:</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            {poll.explanation}
          </p>
        </div>
      ) : (
        <button
          onClick={handleVoteSubmit}
          disabled={!selectedOption}
          className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 text-xs font-bold text-black disabled:opacity-40 transition shadow-lg shadow-amber-500/20"
        >
          Submit Live Vote
        </button>
      )}
    </div>
  );
}
