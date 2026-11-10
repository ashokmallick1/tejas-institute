'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedQaRoute } from '@/components/qa/protected-qa-route';
import { RoleSwitcher } from '@/components/layout/role-switcher';
import {
  FlaskConical,
  Activity,
  ExternalLink,
} from 'lucide-react';

export default function TesterActivityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedQaRoute>
      <div className="min-h-screen bg-[#08090a] text-foreground flex flex-col font-sans selection:bg-tejas-blue selection:text-white">
        {/* Top QA Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white font-black font-display shadow-md">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-tight text-foreground font-display">
                      TEJAS QA
                    </span>
                    <span className="rounded-full bg-tejas-blue/10 px-2 py-0.5 text-[10px] font-bold text-tejas-blue border border-tejas-blue/20">
                      ACTIVITY AUDIT
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    Real-Time Tester Telemetry &amp; Audit Logs
                  </div>
                </div>
              </Link>
            </div>

            {/* QA Section Navigation */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              <Link
                href="/test-data"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  pathname === '/test-data'
                    ? 'bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <FlaskConical className="h-3.5 w-3.5" />
                <span>Test Execution &amp; Feedback</span>
              </Link>

              <Link
                href="/tester-activity"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  pathname === '/tester-activity'
                    ? 'bg-tejas-blue/15 text-tejas-blue font-bold border border-tejas-blue/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Tester Activity Monitor</span>
              </Link>

              <Link
                href="/crm"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <span>CRM</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </Link>

              <Link
                href="/dashboard/admin"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <span>Admin</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </Link>
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
              >
                <span>Main Site</span>
                <ExternalLink className="h-3 w-3" />
              </Link>

              <RoleSwitcher />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pb-16">
          {children}
        </main>
      </div>
    </ProtectedQaRoute>
  );
}
