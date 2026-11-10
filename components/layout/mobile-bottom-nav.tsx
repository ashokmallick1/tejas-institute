'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Home,
  BookOpen,
  Send,
  GraduationCap,
  Menu,
  X,
  Kanban,
  FlaskConical,
  ShieldCheck,
  Moon,
  Sun,
  Search,
  ExternalLink,
} from 'lucide-react';
import { RoleSwitcher } from './role-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);

  // If inside an active lesson player, hide bottom nav to maximize code editor area
  if (pathname.includes('/learn/')) {
    return null;
  }

  const getDashboardPath = () => {
    if (!user) return '/dashboard/student';
    switch (user.role) {
      case 'TRAINER':
        return '/dashboard/trainer';
      case 'MENTOR':
        return '/dashboard/mentor';
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return '/dashboard/admin';
      case 'COUNSELLOR':
      case 'FINANCE':
        return '/crm';
      case 'TESTER':
      case 'QA_ENGINEER':
        return '/test-data';
      default:
        return '/dashboard/student';
    }
  };

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Programs',
      href: '/programs',
      icon: BookOpen,
      isActive: pathname.startsWith('/programs') || pathname.startsWith('/schools'),
    },
    {
      label: 'Apply',
      href: '/admissions/apply',
      icon: Send,
      isPrimary: true,
      isActive: pathname.startsWith('/admissions/apply'),
    },
    {
      label: 'Portal',
      href: getDashboardPath(),
      icon: GraduationCap,
      isActive: pathname.startsWith('/dashboard') || pathname.startsWith('/crm') || pathname.startsWith('/test-data'),
    },
    {
      label: 'More',
      onClick: () => setMenuSheetOpen(true),
      icon: Menu,
      isActive: menuSheetOpen,
    },
  ];

  return (
    <>
      {/* Mobile Floating / Docked Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/90 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(0,0,0,0.35)]"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;

            if (item.isPrimary) {
              return (
                <div key={item.label} className="flex items-center justify-center -mt-5">
                  <Link
                    href={item.href!}
                    prefetch={false}
                    className="flex flex-col items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-tejas-flame-red via-tejas-flame-orange to-tejas-flame-amber text-white shadow-lg shadow-orange-500/30 active:scale-95 transition"
                    aria-label="Apply for Fellowship"
                  >
                    <Icon className="h-5 w-5 fill-current" />
                  </Link>
                </div>
              );
            }

            const content = (
              <div
                className={`flex flex-col items-center justify-center py-1 transition ${
                  item.isActive
                    ? 'text-tejas-blue font-bold scale-105'
                    : 'text-muted-foreground hover:text-foreground active:scale-95'
                }`}
              >
                <div className="relative">
                  <Icon className="h-4.5 w-4.5" />
                  {item.isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-tejas-blue" />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium tracking-tight">{item.label}</span>
              </div>
            );

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex items-center justify-center h-full w-full focus:outline-hidden"
                  aria-label="Open More Menu"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href!}
                prefetch={false}
                className="flex items-center justify-center h-full w-full focus:outline-hidden"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Slide-Up Mobile Bottom Sheet Menu */}
      {menuSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMenuSheetOpen(false)}
          />

          {/* Bottom Sheet Drawer */}
          <div className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-card p-5 shadow-2xl space-y-4 pb-[calc(env(safe-area-inset-bottom,16px)+16px)]">
            {/* Sheet Handle */}
            <div className="mx-auto h-1.5 w-12 rounded-full bg-muted-foreground/30 mb-2" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-foreground font-display">TEJAS Navigation</span>
                <span className="rounded-full bg-tejas-blue/15 px-2 py-0.5 text-[10px] font-bold text-tejas-blue">
                  Institute App
                </span>
              </div>
              <button
                onClick={() => setMenuSheetOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Role & Staff Quick Switch */}
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Active Staff / Student Session</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted-foreground">Switch Role Perspective:</span>
                <RoleSwitcher />
              </div>
            </div>

            {/* Privileged Portals Shortcuts */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                Privileged Portals
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/crm"
                  onClick={() => setMenuSheetOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 font-bold text-amber-400 hover:bg-amber-500/20 transition"
                >
                  <Kanban className="h-4 w-4 shrink-0" />
                  <span>Admissions CRM</span>
                </Link>

                <Link
                  href="/crm/invoices"
                  onClick={() => setMenuSheetOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
                >
                  <GraduationCap className="h-4 w-4 shrink-0" />
                  <span>Invoices &amp; Fees</span>
                </Link>

                <Link
                  href="/test-data"
                  onClick={() => setMenuSheetOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 font-bold text-rose-400 hover:bg-rose-500/20 transition"
                >
                  <FlaskConical className="h-4 w-4 shrink-0" />
                  <span>QA Command Desk</span>
                </Link>

                <Link
                  href="/dashboard/admin"
                  onClick={() => setMenuSheetOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-tejas-blue/30 bg-tejas-blue/10 p-2.5 font-bold text-tejas-blue hover:bg-tejas-blue/20 transition"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Admin Console</span>
                </Link>
              </div>
            </div>

            {/* Academic Schools & Public Sections */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                Academic Hub
              </span>

              <div className="divide-y divide-border/40 rounded-2xl border border-border bg-card">
                <Link
                  href="/learn-while-you-work"
                  onClick={() => setMenuSheetOpen(false)}
                  className="flex items-center justify-between p-3 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <span>Learn While You Work (Core Model)</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>

                <Link
                  href="/schools"
                  onClick={() => setMenuSheetOpen(false)}
                  className="flex items-center justify-between p-3 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <span>All 4 Academic Schools</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>

                <Link
                  href="/projects"
                  onClick={() => setMenuSheetOpen(false)}
                  className="flex items-center justify-between p-3 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <span>Fellow Capstone Showcase</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>

                <Link
                  href="/verify"
                  onClick={() => setMenuSheetOpen(false)}
                  className="flex items-center justify-between p-3 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <span>Cryptographic Certificate Verification</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
