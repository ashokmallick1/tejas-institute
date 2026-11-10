'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { RoleSwitcher } from '@/components/layout/role-switcher';
import {
  Users,
  Layers,
  GraduationCap,
  ExternalLink,
  Kanban,
  FileText,
  CreditCard,
  Building,
  Globe,
  Receipt,
  BookOpen,
} from 'lucide-react';
import { PrivilegedRouteGuard } from '@/components/auth/privileged-route-guard';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';

const CRM_NAV_ITEMS = [
  {
    name: 'Admissions Pipeline',
    href: '/crm',
    icon: Kanban,
    exact: true,
  },
  {
    name: 'Admissions & Offers',
    href: '/crm/admissions',
    icon: GraduationCap,
    exact: false,
  },
  {
    name: 'Invoices & Billing',
    href: '/crm/invoices',
    icon: Receipt,
    exact: false,
  },
  {
    name: 'Fee Structures',
    href: '/crm/fee-structures',
    icon: Building,
    exact: false,
  },
];

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isNavActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Subdomain Top Bar ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand & Subdomain Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                <Image
                  src="/tejas-logo.jpg"
                  alt="TEJAS Institute"
                  fill
                  sizes="36px"
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-foreground font-display">TEJAS</span>
                  <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                    CRM &amp; ERP
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Admissions · Billing · Frappe
                </span>
              </div>
            </Link>

            {/* Subdomain Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3 text-tejas-blue" />
              <span className="font-mono text-[11px]">crm.tejas.ac.in</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </div>
          </div>

          {/* Primary CRM Module Tabs */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            {CRM_NAV_ITEMS.map((item) => {
              const active = isNavActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition ${
                    active
                      ? 'bg-tejas-blue/15 text-tejas-blue font-bold border border-tejas-blue/30 shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Portal Switcher & Persona Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin"
              className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-muted"
            >
              <Layers className="h-3 w-3" />
              <span>Operations</span>
            </Link>
            <RoleSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Module Bar */}
        <div className="flex md:hidden border-t border-border bg-card/60 px-4 py-2 overflow-x-auto gap-2 text-xs font-semibold scrollbar-none">
          {CRM_NAV_ITEMS.map((item) => {
            const active = isNavActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition shrink-0 ${
                  active
                    ? 'bg-tejas-blue/15 text-tejas-blue font-bold border border-tejas-blue/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* ── Main CRM Content ── */}
      <main className="flex-1">
        <PrivilegedRouteGuard
          allowedRoles={['SUPER_ADMIN', 'ADMIN', 'COUNSELLOR', 'FINANCE', 'TESTER']}
          moduleTitle="Admissions CRM & Invoicing Console"
          moduleDescription="Candidate triage, provisional admission offer letters, GST tax invoices (SAC 999293), and fee billing records are protected and restricted to authorized admissions counselors and administrators."
        >
          {children}
        </PrivilegedRouteGuard>
      </main>

      {/* ── CRM Footer ── */}
      <footer className="border-t border-border bg-card/60 py-4 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            TEJAS Admissions &amp; Invoicing ERP · Powered by Frappe Education &amp; Invoice Ninja Architecture · GSTIN: 21AAACT9821Q1ZU
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-foreground">Institute Home</Link>
            <span>·</span>
            <Link href="/crm/admissions" className="hover:text-foreground">Admissions</Link>
            <span>·</span>
            <Link href="/crm/invoices" className="hover:text-foreground">Invoicing</Link>
            <span>·</span>
            <Link href="/dashboard" className="hover:text-foreground">LMS Portal</Link>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
