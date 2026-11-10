import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions | TEJAS Institute',
  description: 'Common questions about TEJAS programs, Learn While You Work philosophy, admissions, and campus facilities in Bhubaneswar.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'What is TEJAS Institute of Advanced Technology?',
      a: 'TEJAS is an autonomous engineering academy located in Bhubaneswar, Odisha, India. We are dedicated to training India’s next-generation technologists across AI Engineering, Cloud Systems, VLSI Silicon Design, Embedded 5G, Electric Mobility, and Industrial Robotics.',
    },
    {
      q: 'What does "LEARN WHILE YOU WORK" mean?',
      a: 'It is our core USP and pedagogical flywheel: Learn → Lab → Apply → Mentor Review → Improve → Document → Demonstrate. Instead of passive tutorials, fellows build production-ready systems, undergo weekly 1-on-1 code reviews from senior industry architects, and demonstrate live software on Demo Day.',
    },
    {
      q: 'Are the programs full-time or can working professionals join?',
      a: 'We offer both In-Person Bhubaneswar Fellowships and Hybrid Professional Tracks. Hybrid tracks feature evening seminars and weekend intensive lab immersions, allowing practicing engineers to upskill without pausing their careers.',
    },
    {
      q: 'Do fellows receive real compute quotas?',
      a: 'Yes. Every fellow in our AI, Data, and Platform programs receives dedicated GPU compute quotas on our institutional NVIDIA H100 and A100 cluster managed via Slurm.',
    },
    {
      q: 'How does certificate verification work?',
      a: 'Every graduate receives a cryptographically verifiable digital certificate with a unique ID (e.g., TEJAS-2026-AI-8921) and SHA-256 hash verifiable at /verify/[certificateId] without compromising private student data.',
    },
    {
      q: 'Where is the campus located in Bhubaneswar?',
      a: 'The TEJAS campus is situated in the Infocity & Chandaka Tech Corridor, Bhubaneswar, Odisha 751024, India.',
    },
  ];

  return (
    <PublicShell>
      <section className="border-b border-border bg-card/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <span className="rounded-full bg-tejas-blue/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-tejas-blue">
            Frequently Asked Questions
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl font-display text-foreground">
            Clear Answers for Future Fellows
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Everything you need to know about our pedagogy, labs, cohort admissions, and career pathways.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-tejas-orange shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-foreground">{faq.q}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-12 rounded-3xl border border-border bg-muted/40 p-8 text-center space-y-3">
            <h3 className="text-lg font-bold font-display text-foreground">Have more specific questions?</h3>
            <p className="text-xs text-muted-foreground">Our academic admissions team is happy to assist.</p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-tejas-blue hover:underline"
              >
                <span>Contact Admissions Desk</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
