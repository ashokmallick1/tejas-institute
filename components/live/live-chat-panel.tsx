'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Pin, Flame, Sparkles } from 'lucide-react';
import { LiveChatMessage } from '@/types/live-class';

interface LiveChatPanelProps {
  messages: LiveChatMessage[];
  onSendMessage: (text: string) => void;
  onSendReaction: (emoji: string) => void;
}

export function LiveChatPanel({
  messages,
  onSendMessage,
  onSendReaction,
}: LiveChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const pinnedMessage = messages.find((m) => m.is_pinned);

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden">
      {/* ── Header ── */}
      <div className="p-3.5 border-b border-border bg-card/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-tejas-blue/10 text-tejas-blue border border-tejas-blue/20">
            <MessageSquare className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-xs font-bold text-foreground font-display">Fellow Live Chat</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-time Stream</span>
        </div>
      </div>

      {/* ── Pinned Instructor Message ── */}
      {pinnedMessage && (
        <div className="border-b border-border bg-gradient-to-r from-tejas-blue/10 via-card to-tejas-blue/10 p-2.5 text-xs">
          <div className="flex items-start gap-2">
            <Pin className="h-3.5 w-3.5 text-tejas-blue shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-tejas-blue text-[11px] block">
                PINNED BY FACULTY ({pinnedMessage.sender_name}):
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                {pinnedMessage.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Chat Messages Scroll Area ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
        {messages.map((msg) => {
          const isInstructor = msg.sender_role === 'INSTRUCTOR';
          const isTa = msg.sender_role === 'TA';

          return (
            <div key={msg.id} className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-bold text-[11px] ${
                    isInstructor
                      ? 'text-tejas-orange flex items-center gap-1'
                      : isTa
                      ? 'text-emerald-400 flex items-center gap-1'
                      : 'text-foreground'
                  }`}
                >
                  {isInstructor && <Flame className="h-3 w-3 inline text-tejas-orange" />}
                  {isTa && <Sparkles className="h-3 w-3 inline text-emerald-400" />}
                  {msg.sender_name}
                </span>

                {isInstructor && (
                  <span className="rounded bg-tejas-orange/15 px-1 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-tejas-orange">
                    FACULTY
                  </span>
                )}
                {isTa && (
                  <span className="rounded bg-emerald-500/15 px-1 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-emerald-400">
                    TA
                  </span>
                )}

                <span className="text-[10px] text-muted-foreground/60 ml-auto font-mono">
                  {msg.timestamp}
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                {msg.message}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Quick Reactions Tapper ── */}
      <div className="px-3 py-1.5 border-t border-border/40 bg-muted/20 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          React Live:
        </span>
        <div className="flex items-center gap-1">
          {['🔥', '💡', '🚀', '👏', '💯'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSendReaction(emoji)}
              className="text-base px-1 hover:scale-130 active:scale-95 transition"
              title={`Send ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input Box ── */}
      <form onSubmit={handleSubmit} className="p-2.5 border-t border-border bg-card/90">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send message to fellow cohort..."
            className="w-full rounded-xl border border-border bg-background pl-3 pr-10 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-tejas-blue p-1.5 text-white hover:bg-tejas-blue-dark disabled:opacity-40 transition"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
