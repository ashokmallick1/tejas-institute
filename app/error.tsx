'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import { PublicShell } from '@/components/layout/public-shell';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled TEJAS Application Error:', error);
  }, [error]);

  return (
    <PublicShell>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-background text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-foreground mb-3">
          System Interruption
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
          The TEJAS cluster encountered an unexpected runtime anomaly while processing your request. Our telemetry has logged the incident.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => reset()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-tejas-blue px-6 py-3 text-xs font-bold text-white hover:bg-tejas-blue-dark transition-colors shadow-md"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Reboot Session</span>
          </button>
          
          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
