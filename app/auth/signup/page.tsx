'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { getSupabaseBrowserClient, isDemoMode } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);

    try {
      if (isDemoMode) {
        setStep('verify');
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName, role: 'STUDENT' },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) { setError(authError.message); return; }
      setStep('verify');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We've sent a verification link to <strong className="text-foreground">{form.email || 'your email'}</strong>.
            Click the link to activate your TEJAS portal account.
          </p>
          {isDemoMode && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-600 dark:text-amber-400">
              Demo mode — no email sent. Go to{' '}
              <Link href="/auth/signin" className="underline font-semibold">Sign In</Link> to enter the portal.
            </div>
          )}
          <Link href="/auth/signin"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white"
            style={{ background: '#0055FF' }}>
            Go to Sign In <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0E2B6E 0%, #1A56DB 60%, #0E2B6E 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }} />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/10 p-1 ring-1 ring-white/20">
            <Image src="/tejas-logo.jpg" alt="TEJAS" width={48} height={48} className="object-contain" />
          </div>
          <div>
            <p className="text-lg font-black text-white">TEJAS</p>
            <p className="text-[10px] uppercase tracking-[2px] text-white/60">Institute of Advanced Technology</p>
          </div>
        </Link>

        <div className="relative z-10 space-y-4">
          <p className="text-3xl font-medium text-white leading-snug" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Start your journey into deep technology.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: '17', l: 'Programs' }, { n: '100%', l: 'Project-led' },
              { n: '1:8', l: 'Mentor ratio' }, { n: '6mo', l: 'Average duration' },
            ].map(({ n, l }) => (
              <div key={l} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-xl font-black text-white">{n}</p>
                <p className="text-xs text-white/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-9 w-9 overflow-hidden rounded-lg">
              <Image src="/tejas-logo.jpg" alt="TEJAS" width={36} height={36} className="object-contain" />
            </div>
            <span className="font-black text-foreground">TEJAS Institute</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground tracking-tight">Create your portal account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Already enrolled?{' '}
            <Link href="/auth/signin" className="font-semibold" style={{ color: '#0055FF' }}>Sign in →</Link>
          </p>

          <form onSubmit={handleSignUp} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Full Name</label>
              <input type="text" value={form.fullName} onChange={set('fullName')} required placeholder="Aarav Sharma"
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-tejas-blue focus:outline-none focus:ring-2 focus:ring-tejas-blue/20 transition" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</label>
              <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-tejas-blue focus:outline-none focus:ring-2 focus:ring-tejas-blue/20 transition" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Password</label>
              <div className="relative mt-1.5">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} required placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 pr-10 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-tejas-blue focus:outline-none focus:ring-2 focus:ring-tejas-blue/20 transition" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={set('confirm')} required placeholder="Repeat password"
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-tejas-blue focus:outline-none focus:ring-2 focus:ring-tejas-blue/20 transition" />
            </div>

            {error && <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-500">{error}</p>}

            <p className="text-[11px] text-muted-foreground">
              By creating an account you agree to our{' '}
              <Link href="/legal/terms" className="underline hover:text-foreground">Terms of Service</Link> and{' '}
              <Link href="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: loading ? '#555' : '#0055FF' }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
