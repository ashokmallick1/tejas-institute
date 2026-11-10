'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Clock, User, Shield } from 'lucide-react';
import { QaTesterActivityLog } from '@/types/qa';

interface MetadataInspectorModalProps {
  log: QaTesterActivityLog | null;
  onClose: () => void;
}

export function MetadataInspectorModal({ log, onClose }: MetadataInspectorModalProps) {
  const [copied, setCopied] = useState(false);

  if (!log) return null;

  const jsonString = JSON.stringify(log.metadata, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-tejas-blue/15 text-tejas-blue">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-foreground font-display">
                  Telemetry Event Metadata
                </span>
                <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                  {log.action_type}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                Log ID: {log.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-4">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Tester Identity</span>
              </span>
              <div className="font-bold text-foreground">{log.tester_name || 'Anonymous'}</div>
              <div className="text-[11px] text-muted-foreground font-mono truncate">{log.tester_email}</div>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Event Timestamp</span>
              </span>
              <div className="font-mono text-foreground font-bold text-xs">{new Date(log.created_at).toLocaleTimeString('en-IN')}</div>
              <div className="text-[11px] text-muted-foreground font-mono">{new Date(log.created_at).toLocaleDateString('en-IN')}</div>
            </div>
          </div>

          {/* JSON Payload Inspector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              JSON Event Payload:
            </span>
            <pre className="rounded-xl border border-border bg-[#050607] p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-80">
              {jsonString}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
