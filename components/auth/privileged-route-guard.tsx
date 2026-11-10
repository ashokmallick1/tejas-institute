'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/types';
import Link from 'next/link';
import { ShieldAlert, Lock, ArrowRight, Home, LogIn, Sparkles, UserCheck } from 'lucide-react';
import { isDemoMode } from '@/lib/supabase/client';

interface PrivilegedRouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  moduleTitle: string;
  moduleDescription?: string;
}

export function PrivilegedRouteGuard({
  children,
  allowedRoles,
  moduleTitle,
  moduleDescription,
}: PrivilegedRouteGuardProps) {
  const { user, role, loginAs, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-tejas-blue border-t-transparent" />
          <span className="text-xs text-muted-foreground font-mono">Verifying Access Credentials...</span>
        </div>
      </div>
    );
  }

  const isAuthorized = role && allowedRoles.includes(role);

  if (!isAuthorized) {
    // Recommend best role to switch to for this module
    const recommendedRoleKey = allowedRoles.includes('COUNSELLOR')
      ? 'counselor'
      : allowedRoles.includes('TESTER')
      ? 'tester'
      : allowedRoles.includes('ADMIN') || allowedRoles.includes('SUPER_ADMIN')
      ? 'admin'
      : allowedRoles.includes('TRAINER')
      ? 'trainer'
      : allowedRoles.includes('MENTOR')
      ? 'mentor'
      : 'admin';

    const roleLabels: Record<string, string> = {
      counselor: 'Admissions Counselor',
      tester: 'Principal QA Lead',
      admin: 'Director / Administrator',
      trainer: 'Faculty / Trainer',
      mentor: 'Mentor Reviewer',
    };

    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-amber-500/30 bg-card/95 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl animate-in fade-in duration-300">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lock className="h-7 w-7" />
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
            <span>Privileged Access Protected</span>
          </div>

          <h2 className="mt-3 text-xl font-bold font-display text-foreground tracking-tight">
            {moduleTitle}
          </h2>

          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            {moduleDescription ||
              'This workspace is restricted to authorized personnel. Proper credentials and security clearance are required to view student records or institute operations.'}
          </p>

          {/* Current Session Inspection */}
          <div className="mt-5 p-3 rounded-2xl bg-muted/30 border border-border text-left space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">Active Persona:</span>
              <span className="font-bold text-foreground truncate max-w-[200px]">
                {user?.full_name || 'Anonymous Visitor'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground text-[11px]">Current Role:</span>
              <span className="font-mono text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                {role || 'PUBLIC_VISITOR'}
              </span>
            </div>
            <div className="pt-1 border-t border-border/50 text-[10px] text-muted-foreground">
              Required Clearance: <span className="text-foreground font-mono">{allowedRoles.join(' · ')}</span>
            </div>
          </div>

          {/* Quick Elevation / Staff Switch for Demo & Testing */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => loginAs(recommendedRoleKey as any)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:opacity-95 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Elevate Clearance to {roleLabels[recommendedRoleKey]}</span>
            </button>

            <Link
              href="/auth/signin"
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-tejas-blue/40 bg-tejas-blue/10 hover:bg-tejas-blue/20 px-4 py-2 text-xs font-semibold text-tejas-blue transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In with Staff Account</span>
            </Link>

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
