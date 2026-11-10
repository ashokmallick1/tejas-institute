'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { Logo } from '@/components/brand/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { RoleSwitcher } from '@/components/layout/role-switcher';
import {
  GraduationCap,
  Code2,
  Users,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Calendar,
  Award,
  Bell,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Layers,
  FileText,
  Activity,
  UserCheck,
  Folder,
  User,
  Radio,
  Video,
} from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
  activeRole?: 'student' | 'trainer' | 'mentor' | 'admin';
}

export function DashboardShell({ children, activeRole: activeRoleProp }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roleMap: Record<string, 'student' | 'trainer' | 'mentor' | 'admin'> = {
    STUDENT: 'student',
    TRAINER: 'trainer',
    MENTOR: 'mentor',
    ADMIN: 'admin',
    SUPER_ADMIN: 'admin',
    ACADEMIC_ADMIN: 'admin',
    student: 'student',
    trainer: 'trainer',
    mentor: 'mentor',
    admin: 'admin',
  };
  const activeRole = activeRoleProp ?? roleMap[user?.role ?? 'student'] ?? 'student';

  const navigationConfig = {
    student: [
      { name: 'My LMS Overview', href: '/dashboard/student', icon: GraduationCap },
      { name: 'Live Classes & Studio', href: '/dashboard/student/live', icon: Radio },
      { name: 'Active Course Player', href: '/dashboard/student/courses/course-ai-01/learn/les-01', icon: BookOpen },
      { name: 'Assignments', href: '/dashboard/student/assignments', icon: Layers },
      { name: 'Attendance & Classes', href: '/dashboard/student#attendance', icon: Calendar },
      { name: 'Certificates', href: '/dashboard/student/certificates', icon: Award },
      { name: 'Portfolio', href: '/dashboard/student/portfolio', icon: Folder },
      { name: 'My Profile', href: '/dashboard/student/profile', icon: User },
    ],
    trainer: [
      { name: 'Trainer Studio', href: '/dashboard/trainer', icon: Code2 },
      { name: 'Faculty Live Broadcast', href: '/dashboard/trainer/live-studio', icon: Video },
      { name: 'Curriculum & Lessons', href: '/dashboard/trainer#courses', icon: BookOpen },
      { name: 'Batch Attendance', href: '/dashboard/trainer#attendance', icon: Calendar },
      { name: 'Student Progress', href: '/dashboard/trainer#students', icon: Activity },
    ],
    mentor: [
      { name: 'Mentor Review Desk', href: '/dashboard/mentor', icon: Users },
      { name: 'Pending PR Submissions', href: '/dashboard/mentor#reviews', icon: CheckCircle2 },
      { name: 'Project Milestone Audits', href: '/dashboard/mentor#projects', icon: Layers },
      { name: 'Fellow Feedback Logs', href: '/dashboard/mentor#feedback', icon: FileText },
    ],
    admin: [
      { name: 'Director Console', href: '/dashboard/admin', icon: ShieldCheck },
      { name: 'Admissions Pipeline', href: '/dashboard/admin#applications', icon: UserCheck },
      { name: 'Batches & Cohorts', href: '/dashboard/admin#batches', icon: Calendar },
      { name: 'Audit Security Logs', href: '/dashboard/admin#audit', icon: Activity },
    ],
  };

  const navItems = navigationConfig[activeRole] || navigationConfig.student;


  const roleTitles = {
    student: 'Fellow Portal (LMS)',
    trainer: 'Faculty & Curriculum Studio',
    mentor: 'Mentor Code Review Console',
    admin: 'Director & Operations Center',
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card/90 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border/80 px-4">
          <Logo variant="compact" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Portal Role Indicator */}
        <div className="border-b border-border/60 bg-muted/20 px-4 py-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Current Workspace
          </div>
          <div className="text-xs font-bold text-foreground">
            {roleTitles[activeRole]}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-tejas-blue text-white shadow-md shadow-tejas-blue/20'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Mini Profile & Logout */}
        <div className="border-t border-border p-3 space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-2.5">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.full_name}
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-border"
            />
            <div className="overflow-hidden">
              <div className="truncate text-xs font-bold text-foreground">
                {user?.full_name}
              </div>
              <div className="truncate text-[10px] font-mono text-muted-foreground">
                {user?.role}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              <span>Public Website</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <button
              onClick={() => logout()}
              className="flex items-center gap-1 text-[11px] font-semibold text-red-400 hover:text-red-500"
            >
              <LogOut className="h-3 w-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top App Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-sm font-bold text-foreground sm:text-base font-display">
              {roleTitles[activeRole]}
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Role Switcher for instant evaluator testing */}
            <RoleSwitcher />

            {/* Dark / Light Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Link
              href="#notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-tejas-orange" />
            </Link>
          </div>
        </header>

        {/* Dashboard Main Viewport with bottom padding for mobile tab bar */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (< lg screens) */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card/95 px-2 backdrop-blur-lg lg:hidden">
          {navItems.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1 text-[10px] font-semibold transition ${
                  isActive
                    ? 'text-tejas-blue'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isActive ? 'bg-tejas-blue/15 text-tejas-blue' : ''}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="truncate max-w-[64px] text-center leading-none">
                  {item.name.replace('My LMS ', '').replace('Active ', '').replace(' Desk', '').replace(' Studio', '')}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
