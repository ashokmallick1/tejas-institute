import React from 'react';
import Link from 'next/link';
import { TerminalSquare, ArrowRight, Home } from 'lucide-react';
import { PublicShell } from '@/components/layout/public-shell';

export default function NotFoundPage() {
  return (
    <PublicShell>
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-background text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-tejas-orange/10 text-tejas-orange mb-6 border border-tejas-orange/20">
          <TerminalSquare className="h-8 w-8" />
        </div>
        
        <div className="text-sm font-bold uppercase tracking-widest text-tejas-orange mb-3">
          Error 404: Node Not Found
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-foreground mb-4">
          Uncharted Territory
        </h1>
        
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
          The requested endpoint or module does not exist in the TEJAS architecture. It may have been deprecated, moved, or restricted.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-tejas-blue px-6 py-3 text-xs font-bold text-white hover:bg-tejas-blue-dark transition-colors shadow-md"
          >
            <Home className="h-4 w-4" />
            <span>Return to Main Platform</span>
          </Link>
          
          <Link
            href="/programs"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <span>Explore Programs</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
