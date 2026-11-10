'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { RoleSwitcher } from './role-switcher';
import { useAuth } from '@/lib/auth/auth-context';
import { GlobalSearchModal } from './global-search';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Brain,
  Search,
} from 'lucide-react';
import { SCHOOLS } from '@/lib/data/programs';

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [schoolsDropdown, setSchoolsDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSchoolsDropdown(false);
  }, [pathname]);

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
      default:
        return '/dashboard/student';
    }
  };

  const navLinks = [
    { name: 'Programs', href: '/programs' },
    { name: 'Learn While You Work', href: '/learn-while-you-work', highlight: true },
    { name: 'Schools', href: '/schools', hasDropdown: true },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Resources', href: '/resources/whitepapers' },
    { name: 'About', href: '/about' },
    { name: 'Admissions', href: '/admissions' },
  ];

  const isCurrent = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'navbar-blur' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex">
          {navLinks.map(link => {
            if (link.hasDropdown) {
              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setSchoolsDropdown(true)}
                  onMouseLeave={() => setSchoolsDropdown(false)}
                >
                  <Link
                    href={link.href}
                    className={`whitespace-nowrap flex items-center gap-1 rounded-lg px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium transition-colors ${
                      isCurrent(link.href)
                        ? 'text-tejas-blue font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </Link>

                  {/* Schools Dropdown Panel */}
                  {schoolsDropdown && (
                    <div className="absolute left-0 top-full mt-1 w-80 rounded-2xl border border-border bg-card p-3 shadow-2xl backdrop-blur-xl">
                      <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Academic Schools
                      </div>
                      <div className="space-y-1">
                        {SCHOOLS.map(school => (
                          <Link
                            key={school.id}
                            href={`/schools/${school.slug}`}
                            className="group flex flex-col rounded-xl p-2.5 transition hover:bg-muted/70"
                          >
                            <span className="text-xs font-semibold text-foreground group-hover:text-tejas-blue">
                              {school.name}
                            </span>
                            <span className="line-clamp-1 text-[11px] text-muted-foreground">
                              {school.tagline}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`whitespace-nowrap relative items-center gap-1 xl:gap-1.5 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs xl:text-[13px] font-medium transition-colors ${
                  link.name === 'Resources' || link.name === 'About' ? 'hidden 2xl:flex' : 'flex'
                } ${
                  isCurrent(link.href)
                    ? 'text-tejas-blue font-semibold'
                    : link.highlight
                    ? 'text-tejas-orange font-semibold hover:bg-tejas-orange/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {link.highlight && <Sparkles className="h-3.5 w-3.5 text-tejas-orange animate-pulse shrink-0" />}
                {link.name === 'Learn While You Work' ? (
                  <>
                    <span className="hidden 2xl:inline">Learn While You Work</span>
                    <span className="2xl:hidden">Pedagogy</span>
                  </>
                ) : (
                  <span>{link.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden items-center gap-1.5 xl:gap-2 lg:flex">
          {/* Quick Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground transition shrink-0"
            title="Search programs, tools, and projects (Cmd+K)"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Role Switcher for instant Demo testing */}
          <RoleSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* LMS / Dashboard Link */}
          <Link
            href={getDashboardPath()}
            className="whitespace-nowrap flex items-center gap-1.5 rounded-xl border border-tejas-blue/30 bg-tejas-blue/10 px-2.5 py-1.5 text-xs font-semibold text-tejas-blue transition hover:bg-tejas-blue hover:text-white hover:border-tejas-blue shrink-0"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="hidden 2xl:inline">Enter Portal</span>
          </Link>

          {/* Primary Apply CTA — flame gradient from logo */}
          <Link
            href="/admissions/apply"
            className="whitespace-nowrap flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-tejas-flame-red via-tejas-flame-orange to-tejas-flame-amber px-3 xl:px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02] hover:shadow-lg hover:opacity-95 active:scale-[0.98] shrink-0"
          >
            <span>Apply Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Actions: Clean Search, Theme, Hamburger Toggle (Role switcher inside drawer) */}
        <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card p-1 text-muted-foreground hover:bg-muted shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation with backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 border-b border-border bg-card/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-2xl lg:hidden max-h-[calc(100vh-4.5rem)] overflow-y-auto">
            {/* Mobile Role Switcher Bar */}
            <div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-muted/40 p-2 text-xs">
              <span className="font-semibold text-muted-foreground">Demo Role Portal</span>
              <RoleSwitcher />
            </div>

            {/* Quick Search Bar Trigger */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="mb-3 flex w-full items-center justify-between rounded-xl border border-border bg-background/80 px-3.5 py-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-tejas-blue" />
                <span>Search 18 programs, tools &amp; projects...</span>
              </span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">⌘K</span>
            </button>

            {/* Special FDE Registration Banner inside Mobile Drawer */}
            <Link
              href="/programs/forward-deployment-engineer"
              onClick={() => setMobileMenuOpen(false)}
              className="mb-3 flex items-center justify-between rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-tejas-flame animate-pulse shrink-0" />
                <div>
                  <span className="font-bold text-tejas-flame uppercase tracking-wider text-[10px] block">
                    Now Registering
                  </span>
                  <span className="font-semibold text-foreground">
                    Forward Deployment Engineer (FDE)
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-tejas-flame shrink-0" />
            </Link>

            <div className="flex flex-col space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    isCurrent(link.href)
                      ? 'bg-tejas-blue/15 text-tejas-blue font-semibold'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.name}
                    {link.highlight && (
                      <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] font-bold text-orange-500 uppercase">
                        Core USP
                      </span>
                    )}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
              ))}

              <div className="pt-3 border-t border-border flex flex-col gap-2 mt-2">
                <Link
                  href={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-tejas-blue/40 bg-tejas-blue/10 py-3 text-xs font-semibold text-tejas-blue"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Enter LMS / Fellow Portal</span>
                </Link>
                <Link
                  href="/admissions/apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-tejas-flame-red via-tejas-flame-orange to-tejas-flame-amber py-3 text-xs font-bold text-white shadow-md shadow-orange-500/20"
                >
                  <span>Apply for 2026 Cohort</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
