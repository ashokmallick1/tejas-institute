import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/logo';
import { MapPin, Mail, Phone, ExternalLink, ShieldCheck, Award, ArrowUpRight } from 'lucide-react';
import { SCHOOLS, PROGRAMS } from '@/lib/data/programs';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 text-muted-foreground">
      {/* 7-Step Flywheel Micro Banner */}
      <div className="border-b border-border/60 bg-tejas-navy-900/40 py-4 text-xs">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-tejas-orange/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-tejas-orange uppercase">
              Core USP
            </span>
            <span className="font-semibold text-foreground">LEARN WHILE YOU WORK</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
            <span>Learn</span>
            <span>→</span>
            <span>Lab</span>
            <span>→</span>
            <span>Apply</span>
            <span>→</span>
            <span>Mentor Review</span>
            <span>→</span>
            <span>Improve</span>
            <span>→</span>
            <span>Document</span>
            <span>→</span>
            <span className="text-tejas-blue font-bold">Demonstrate</span>
          </div>
          <Link
            href="/learn-while-you-work"
            className="flex items-center gap-1 text-[11px] font-semibold text-tejas-blue hover:underline"
          >
            <span>Explore Pedagogy</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <Logo variant="full" />
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              TEJAS Institute of Advanced Technology is India&apos;s premier engineering academy dedicated to building the country&apos;s next-generation technologists. Operating through intensive lab immersion, mentor code reviews, and enterprise project demonstrations.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-foreground">
                <MapPin className="h-4 w-4 text-tejas-orange shrink-0" />
                <span>Infocity &amp; Chandaka Tech Corridor, Bhubaneswar, Odisha 751024, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-tejas-blue shrink-0" />
                <a href="mailto:admissions@tejas.ac.in" className="hover:text-foreground">
                  admissions@tejas.ac.in
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-tejas-blue shrink-0" />
                <span>+91 (0674) 295-8800 / +91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Academic Schools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Schools of Study
            </h4>
            <ul className="space-y-2 text-xs">
              {SCHOOLS.map(school => (
                <li key={school.id}>
                  <Link
                    href={`/schools/${school.slug}`}
                    className="transition hover:text-foreground hover:underline"
                  >
                    {school.name.replace('School of ', '')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Featured Programs
            </h4>
            <ul className="space-y-2 text-xs">
              {PROGRAMS.slice(0, 6).map(prog => (
                <li key={prog.id}>
                  <Link
                    href={`/programs/${prog.slug}`}
                    className="transition hover:text-foreground hover:underline line-clamp-1"
                  >
                    {prog.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/programs/forward-deployment-engineer"
                  className="font-semibold text-orange-500 hover:underline flex items-center gap-1"
                >
                  <span>🔥 FDE Fellowship (Registering)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="font-semibold text-tejas-blue hover:underline flex items-center gap-1"
                >
                  <span>View All 18 Programs</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Institute & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Knowledge &amp; Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/projects" className="hover:text-foreground font-medium text-foreground">180+ Industry Projects</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">DeepTech Insights Blog</Link></li>
              <li><Link href="/resources/whitepapers" className="hover:text-foreground">Research &amp; Whitepapers</Link></li>
              <li><Link href="/about" className="hover:text-foreground">About TEJAS</Link></li>
              <li><Link href="/about/vision" className="hover:text-foreground">Vision &amp; Deep-Tech Mission</Link></li>
              <li><Link href="/about/labs" className="hover:text-foreground">GPU &amp; Engineering Labs</Link></li>
              <li><Link href="/admissions/apply" className="hover:text-foreground font-semibold text-tejas-orange">Admissions &amp; Registration 2026</Link></li>
              <li><Link href="/auth/signin" className="hover:text-foreground font-medium text-tejas-blue">Student / Trainer Portal Sign In</Link></li>
              <li>
                <Link
                  href="/verify/TEJAS-2026-AI-8921"
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:underline"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verify Credential</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-[11px] sm:flex-row text-center sm:text-left">
          <p>© {new Date().getFullYear()} TEJAS Institute of Advanced Technology. Bhubaneswar, Odisha. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <Link href="/faq" className="hover:text-foreground">FAQs</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
            <Link href="/career" className="hover:text-foreground">Careers at TEJAS</Link>
            <span className="text-muted-foreground/60 hidden sm:inline">Autonomous Engineering Academy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
