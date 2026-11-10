import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { Sparkles, Flag, Target, Compass, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Vision & Deep-Tech Mission | TEJAS Institute',
  description: 'Our vision for building India’s next-generation deep-tech engineering leadership from Bhubaneswar.',
};

export default function VisionPage() {
  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="rounded-full bg-tejas-orange/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-orange">
            Strategic Roadmap
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            Our Vision for Sovereign Indian Deep-Tech
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Transforming India from a consumer of global technologies into a primary architect of foundational intelligence and hardware.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-12">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 space-y-4">
            <div className="flex items-center gap-3 text-tejas-blue">
              <Target className="h-6 w-6" />
              <h2 className="text-2xl font-bold font-display text-foreground">The 2030 Mandate</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              By 2030, India requires over 500,000 engineers capable of designing frontier AI models, verifying complex VLSI silicon, orchestrating bare-metal GPU clusters, and securing critical national infrastructure. TEJAS was established in Bhubaneswar to serve as the premier training ground for these technologists.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-tejas-orange font-bold text-sm">
                <Compass className="h-5 w-5" />
                <span>Foundational Self-Reliance</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                We believe Indian engineers must not merely wrap foreign APIs. We must build our own inference engines, customized compiler optimizations, and synthesizable RTL cores.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <Flag className="h-5 w-5" />
                <span>Eastern India as a Deep-Tech Epicenter</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Bhubaneswar possesses world-class premier universities and an expanding tech corridor. TEJAS bridges academia and high-end industry to make Odisha a global destination for deep-tech.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
