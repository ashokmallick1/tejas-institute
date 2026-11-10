'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PublicShell } from '@/components/layout/public-shell';
import Link from 'next/link';
import { PROGRAMS } from '@/lib/data/programs';
import { useLms } from '@/lib/store/lms-store';
import { CheckCircle2, ArrowRight, Sparkles, Send, ShieldCheck } from 'lucide-react';

function ApplicationForm() {
  const searchParams = useSearchParams();
  const preselectedProgram = searchParams.get('program') || '';
  const { submitApplication } = useLms();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    experience: 'Fresher / Final Year Student',
    programSlug: preselectedProgram || PROGRAMS[0].slug,
    currentSkills: '',
    careerGoal: '',
    preferredMode: 'IN_PERSON_BHUBANESWAR',
    city: 'Bhubaneswar',
  });

  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedProg = PROGRAMS.find(p => p.slug === formData.programSlug) || PROGRAMS[0];

    setTimeout(() => {
      const newAppId = submitApplication({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        education: formData.education,
        experience: formData.experience,
        program_id: selectedProg.id,
        program_title: selectedProg.title,
        current_skills: formData.currentSkills,
        career_goal: formData.careerGoal,
        preferred_mode: formData.preferredMode,
        city: formData.city,
      });

      setIsSubmitting(false);
      setSubmittedId(newAppId);
    }, 600);
  };

  if (submittedId) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-emerald-500/40 bg-card p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <span className="mt-4 inline-block rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-500">
          Application Received
        </span>
        <h2 className="mt-3 text-2xl font-bold font-display text-foreground">
          Welcome to the TEJAS Admissions Pipeline
        </h2>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Your application ID is <strong className="font-mono text-foreground">{submittedId}</strong>. Our academic admissions committee in Bhubaneswar has received your dossier.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4 text-left text-xs space-y-2">
          <div className="font-bold text-foreground">Next Immediate Steps:</div>
          <div className="text-muted-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-tejas-blue" />
            <span>Check your email for the technical diagnostic schedule.</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-tejas-orange" />
            <span>Explore the LMS portal in demo mode to preview course materials.</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard/student"
            className="w-full sm:w-auto rounded-xl bg-tejas-blue px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-tejas-blue-dark transition"
          >
            Explore Student LMS Portal
          </Link>
          <Link
            href="/programs"
            className="w-full sm:w-auto rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            Review Curricula
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-8 md:p-10 shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
          Fellowship Application Form
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Complete the fields below. Selective admissions for 2026 batches at our Bhubaneswar campus.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-foreground">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Das"
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Email Address *</label>
            <input
              type="email"
              required
              placeholder="ananya@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-foreground">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">City / State *</label>
            <input
              type="text"
              required
              placeholder="e.g. Bhubaneswar, Odisha"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground">Preferred Program Specialization *</label>
          <select
            value={formData.programSlug}
            onChange={e => setFormData({ ...formData, programSlug: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground focus:border-tejas-blue focus:outline-none"
          >
            {PROGRAMS.map(prog => (
              <option key={prog.slug} value={prog.slug}>
                {prog.title} ({prog.school_name?.replace('School of ', '')})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-foreground">Highest Education Qualification *</label>
            <input
              type="text"
              required
              placeholder="e.g. B.Tech Computer Science, 2025"
              value={formData.education}
              onChange={e => setFormData({ ...formData, education: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Current Experience Level *</label>
            <select
              value={formData.experience}
              onChange={e => setFormData({ ...formData, experience: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground focus:border-tejas-blue focus:outline-none"
            >
              <option value="Fresher / Final Year Student">Fresher / Final Year Student</option>
              <option value="1 - 2 Years Working Engineer">1 - 2 Years Working Engineer</option>
              <option value="3+ Years Working Professional">3+ Years Working Professional</option>
              <option value="Postgraduate / Researcher">Postgraduate / Researcher</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground">Current Technical Skills &amp; GitHub Profile</label>
          <input
            type="text"
            placeholder="e.g. Python, Docker, C++, github.com/username"
            value={formData.currentSkills}
            onChange={e => setFormData({ ...formData, currentSkills: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground">What is your primary career goal?</label>
          <textarea
            rows={3}
            placeholder="e.g. Transition from generic web development into production LLM and agentic AI systems..."
            value={formData.careerGoal}
            onChange={e => setFormData({ ...formData, careerGoal: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground">Preferred Attendance Mode</label>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer text-xs transition ${
              formData.preferredMode === 'IN_PERSON_BHUBANESWAR' ? 'border-tejas-blue bg-tejas-blue/10 text-foreground font-semibold' : 'border-border text-muted-foreground'
            }`}>
              <input
                type="radio"
                name="mode"
                value="IN_PERSON_BHUBANESWAR"
                checked={formData.preferredMode === 'IN_PERSON_BHUBANESWAR'}
                onChange={() => setFormData({ ...formData, preferredMode: 'IN_PERSON_BHUBANESWAR' })}
                className="hidden"
              />
              <span>In-Person (Bhubaneswar Labs)</span>
            </label>
            <label className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer text-xs transition ${
              formData.preferredMode === 'HYBRID_BHUBANESWAR' ? 'border-tejas-blue bg-tejas-blue/10 text-foreground font-semibold' : 'border-border text-muted-foreground'
            }`}>
              <input
                type="radio"
                name="mode"
                value="HYBRID_BHUBANESWAR"
                checked={formData.preferredMode === 'HYBRID_BHUBANESWAR'}
                onChange={() => setFormData({ ...formData, preferredMode: 'HYBRID_BHUBANESWAR' })}
                className="hidden"
              />
              <span>Hybrid (Remote + Campus Lab Access)</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-tejas-blue py-3.5 text-xs font-bold text-white shadow-lg shadow-tejas-blue/25 hover:bg-tejas-blue-dark transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Processing Application...</span>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Fellowship Application</span>
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-muted-foreground">
          By submitting, you agree to undergo our technical diagnostic evaluation and adhere to TEJAS honor code policies.
        </p>
      </form>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <PublicShell>
      <section className="py-10 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-center text-xs text-muted-foreground">Loading form...</div>}>
            <ApplicationForm />
          </Suspense>
        </div>
      </section>
    </PublicShell>
  );
}
