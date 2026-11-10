'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import {
  ShieldAlert,
  Kanban,
  FlaskConical,
  GraduationCap,
  Sparkles,
  ChevronRight,
  X,
  Lock,
} from 'lucide-react';
import { RoleSwitcher } from './role-switcher';

export function StaffPrivilegedBar() {
  const { user, role } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Only show if the active user is a staff member or tester (not public or default student)
  const isStaffOrTester =
    role === 'SUPER_ADMIN' ||
    role === 'ADMIN' ||
    role === 'COUNSELLOR' ||
    role === 'TRAINER' ||
    role === 'MENTOR' ||
    role === 'TESTER' ||
    role === 'QA_ENGINEER' ||
    role === 'FINANCE';

  if (!isStaffOrTester || dismissed) {
    return null;
  }

  const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    SUPER_ADMIN: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    ADMIN: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    COUNSELLOR: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    FINANCE: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    TRAINER: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    MENTOR: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
    TESTER: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
    QA_ENGINEER: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  };

  const currentTheme = roleColors[role || 'ADMIN'] || roleColors.ADMIN;

  return (
    <aside
      aria-label="Staff Security Console"
      className="fixed bottom-18 md:bottom-4 right-4 z-40 max-w-sm rounded-2xl border border-border/80 bg-card/95 p-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-300"
    >
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/50">
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Privileged Staff Session
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Dismiss banner"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      <div className="pt-2 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-foreground truncate max-w-[150px]">
            {user?.full_name}
          </div>
          <span
            className={`inline-block mt-0.5 rounded px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider border ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}
          >
            {role?.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <RoleSwitcher />
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold">
        <Link
          href="/crm"
          className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 py-1 transition"
        >
          <Kanban className="h-3 w-3" />
          <span>CRM</span>
        </Link>
        <Link
          href="/test-data"
          className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 py-1 transition"
        >
          <FlaskConical className="h-3 w-3" />
          <span>QA</span>
        </Link>
        <Link
          href="/dashboard/admin"
          className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-tejas-blue/10 hover:bg-tejas-blue/20 text-tejas-blue border border-tejas-blue/30 py-1 transition"
        >
          <span>Admin</span>
        </Link>
      </div>
    </aside>
  );
}
