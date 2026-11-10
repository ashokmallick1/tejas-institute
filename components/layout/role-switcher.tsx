'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { UserCheck, ShieldCheck, GraduationCap, Code2, Users, ChevronDown, Kanban, FlaskConical } from 'lucide-react';

export function RoleSwitcher() {
  const { user, loginAs } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { key: 'student', label: 'Fellow / Student', path: '/dashboard/student', role: 'STUDENT', icon: GraduationCap, color: 'text-sky-500' },
    { key: 'counselor', label: 'Admissions CRM', path: '/crm', role: 'COUNSELLOR', icon: Kanban, color: 'text-amber-500' },
    { key: 'trainer', label: 'Trainer / Faculty', path: '/dashboard/trainer', role: 'TRAINER', icon: Code2, color: 'text-indigo-500' },
    { key: 'mentor', label: 'Mentor Reviewer', path: '/dashboard/mentor', role: 'MENTOR', icon: Users, color: 'text-emerald-500' },
    { key: 'admin', label: 'Director / Admin', path: '/dashboard/admin', role: 'SUPER_ADMIN', icon: ShieldCheck, color: 'text-amber-500' },
    { key: 'tester', label: 'QA Lead / Tester', path: '/test-data', role: 'TESTER', icon: FlaskConical, color: 'text-rose-400' },
  ] as const;

  const currentRoleConfig = roles.find(r => r.role === user?.role) || roles[0];
  const CurrentIcon = currentRoleConfig.icon;

  const handleSelectRole = (r: typeof roles[number]) => {
    loginAs(r.key);
    setIsOpen(false);
    router.push(r.path);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-border/70 bg-card/80 px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur transition hover:border-tejas-blue/50 hover:bg-card"
        title="Switch portal perspective"
      >
        <CurrentIcon className={`h-3.5 w-3.5 ${currentRoleConfig.color}`} />
        <span className="hidden 2xl:inline-block">{currentRoleConfig.label.split(' / ')[0]}</span>
        <span className="rounded bg-tejas-blue/10 px-1 py-0.5 text-[10px] font-bold text-tejas-blue">
          DEMO
        </span>
        <ChevronDown className="h-3 w-3 text-muted-foreground opacity-70" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl backdrop-blur">
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Switch Test Perspective
            </div>
            {roles.map(r => {
              const Icon = r.icon;
              const isSelected = user?.role === r.role;
              return (
                <button
                  key={r.key}
                  onClick={() => handleSelectRole(r)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition ${
                    isSelected
                      ? 'bg-tejas-blue/15 text-tejas-blue font-semibold'
                      : 'text-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${r.color}`} />
                  <div className="text-left">
                    <div>{r.label}</div>
                    <div className="text-[10px] text-muted-foreground">{r.path}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
