'use client';

import React from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertTriangle, XCircle, RotateCcw, Monitor } from 'lucide-react';
import { QaTestCase, QaTestResult, TestStatus } from '@/types/qa';

interface TestHistoryModalProps {
  testCase: QaTestCase | null;
  history: QaTestResult[];
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_ICONS: Record<TestStatus, any> = {
  passed: CheckCircle2,
  failed: XCircle,
  retest: RotateCcw,
  blocked: AlertTriangle,
  pending: Clock,
};

const STATUS_COLORS: Record<TestStatus, { text: string; bg: string; border: string }> = {
  passed: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  failed: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  retest: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  blocked: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  pending: { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
};

export function TestHistoryModal({ testCase, history, isOpen, onClose }: TestHistoryModalProps) {
  if (!isOpen || !testCase) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[85vh] flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-tejas-blue/15 text-tejas-blue border border-tejas-blue/30">
                {testCase.test_id}
              </span>
              <h3 className="font-bold text-base text-foreground font-display">
                Execution History
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
              {testCase.title}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* History Runs List */}
        <div className="overflow-y-auto p-6 space-y-3.5">
          {history.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No historical runs recorded for this test case yet.
            </div>
          ) : (
            history.map((run, idx) => {
              const Icon = STATUS_ICONS[run.status] || Clock;
              const colorConfig = STATUS_COLORS[run.status] || STATUS_COLORS.pending;

              return (
                <div
                  key={run.id || idx}
                  className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2.5 transition hover:border-border"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}>
                        <Icon className="h-3.5 w-3.5" />
                        <span className="uppercase tracking-wider">{run.status}</span>
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3" />
                        {run.cycle_date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                      <span>{run.duration_ms || 320}ms</span>
                      <span>·</span>
                      <span className="capitalize">{run.run_mode}</span>
                    </div>
                  </div>

                  {/* Observations */}
                  {run.observations && (
                    <div className="text-xs text-foreground bg-card p-2.5 rounded-lg border border-border/50 leading-relaxed font-sans">
                      {run.observations}
                    </div>
                  )}

                  {/* Device and Tester Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      <Monitor className="h-3 w-3" />
                      <span>{run.device_info || 'Desktop Chrome 1440x900'}</span>
                    </div>
                    <span>Tester: <strong className="text-foreground">{run.tester_name}</strong></span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
