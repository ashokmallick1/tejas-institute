'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import Link from 'next/link';
import { ShieldAlert, FlaskConical, ArrowRight, Home } from 'lucide-react';

interface ProtectedQaRouteProps {
  children: React.ReactNode;
}

export function ProtectedQaRoute({ children }: ProtectedQaRouteProps) {
  const { user, role, loginAs, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-tejas-blue border-t-transparent" />
          <span className="text-xs text-muted-foreground font-mono">Verifying QA Credentials...</span>
        </div>
      </div>
    );
  }

  // Allowed roles: SUPER_ADMIN, ADMIN, TESTER, QA_ENGINEER
  const isAuthorized =
    role === 'SUPER_ADMIN' ||
    role === 'ADMIN' ||
    role === 'TESTER' ||
    role === 'QA_ENGINEER' ||
    user?.email?.includes('qa') ||
    user?.email?.includes('admin');

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-rose-500/30 bg-card/90 p-8 text-center shadow-2xl backdrop-blur">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
            <ShieldAlert className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-xl font-bold font-display text-foreground">
            Restricted QA Command Center
          </h2>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            This module is reserved for Principal QA Architects, Test Automation Engineers, and System Administrators.
          </p>

          <div className="mt-4 p-3 rounded-xl bg-muted/30 border border-border text-[11px] text-muted-foreground text-left">
            Current Session: <strong className="text-foreground">{user?.full_name || 'Anonymous'}</strong> ({role || 'STUDENT'})
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => loginAs('tester')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/20 hover:opacity-95 transition"
            >
              <FlaskConical className="h-4 w-4" />
              <span>Switch to QA Tester Perspective</span>
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Return to Public Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
