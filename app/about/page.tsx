import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { MapPin, ShieldCheck, Cpu, Users, Award, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About TEJAS | Institute of Advanced Technology',
  description: 'Learn about TEJAS Institute in Bhubaneswar, our deep-tech mission, faculty, and industry-backed education model.',
};

export default function AboutPage() {
  const pillars = [
    {
      title: 'Built in Bhubaneswar, Built for India',
      desc: 'Headquartered in Odisha’s tech corridor, TEJAS is engineered to make Eastern India a powerhouse of deep-tech engineering talent.',
      icon: MapPin,
    },
    {
      title: 'LEARN WHILE YOU WORK',
      desc: 'Our 7-stage engineering flywheel eliminates passive tutorials. Fellows engineer production systems and undergo strict mentor PR critiques.',
      icon: Cpu,
    },
    {
      title: 'Distinguished Faculty & Mentors',
      desc: 'Mentored by practicing staff architects, distributed systems leads, and chip design specialists from premier global companies.',
      icon: Users,
    },
    {
      title: 'Verifiable Proof of Work',
      desc: 'No empty certificates. Fellows graduate with verified public GitHub repositories, deployed systems, and cryptographically signed credentials.',
      icon: ShieldCheck,
    },
  ];

  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="rounded-full bg-tejas-blue/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-blue">
            About the Institute
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            Architecting India&apos;s Deep-Tech Talent
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto leading-relaxed">
            TEJAS Institute of Advanced Technology is an autonomous engineering academy founded in Bhubaneswar to train the engineers who will architect India’s sovereign technological future.
          </p>
        </div>
      </section>

      {/* Sub-nav Links */}
      <div className="border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 py-3 overflow-x-auto text-xs font-semibold">
          <Link href="/about" className="text-tejas-blue">Overview</Link>
          <Link href="/about/vision" className="text-muted-foreground hover:text-foreground">Vision &amp; Mission</Link>
          <Link href="/about/faculty" className="text-muted-foreground hover:text-foreground">Faculty &amp; Directors</Link>
          <Link href="/about/labs" className="text-muted-foreground hover:text-foreground">Labs &amp; Compute</Link>
          <Link href="/about/career-support" className="text-muted-foreground hover:text-foreground">Career &amp; Incubation</Link>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {pillars.map(pillar => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tejas-blue/10 text-tejas-blue">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold font-display text-foreground">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 rounded-3xl border border-border bg-card p-8 lg:p-12 text-center space-y-4">
            <h2 className="text-2xl font-bold font-display text-foreground">
              Campus Headquarters in Bhubaneswar
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Located in the Infocity &amp; Chandaka Tech Corridor, Bhubaneswar, Odisha. Our state-of-the-art facility includes specialized GPU compute clusters, an FPGA synthesis laboratory, an active cyber range, and a robotics sandbox.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-tejas-blue hover:underline"
              >
                <span>Plan a Campus Visit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
