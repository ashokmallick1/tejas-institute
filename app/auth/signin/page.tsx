'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { getSupabaseBrowserClient, isDemoMode } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/auth-context';

export default function SignInPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isDemoMode) {
        // Demo: derive role from email prefix
        const roleMap: Record<string, 'student' | 'trainer' | 'mentor' | 'admin'> = {
          student: 'student', trainer: 'trainer', mentor: 'mentor', admin: 'admin',
        };
        const prefix = email.split('@')[0].toLowerCase();
        const role = roleMap[prefix] || 'student';
        loginAs(role);
        router.push(`/dashboard/${role}`);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0E2B6E 0%, #1A56DB 60%, #0E2B6E 100%)' }}>
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* Flame glow */}
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #FF8C00, transparent)' }} />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/10 p-1 shadow-lg ring-1 ring-white/20">
            <Image src="/tejas-logo.jpg" alt="TEJAS" width={48} height={48} className="object-contain" />
          </div>
          <div>
            <p className="text-lg font-black text-white tracking-tight">TEJAS</p>
            <p className="text-[10px] uppercase tracking-[2px] text-white/60">Institute of Advanced Technology</p>
          </div>
        </Link>

        <div className="relative z-10 space-y-6">
          <blockquote className="text-3xl font-medium text-white leading-snug" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
            "Don't just learn technology.<br />Build with it."
          </blockquote>
          <div className="space-y-3">
            {['Learn While You Work', 'Production-grade projects', 'Mentor-led reviews', 'Job-ready portfolio'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Learn · Build · Work · Grow</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-9 w-9 overflow-hidden rounded-lg">
              <Image src="/tejas-logo.jpg" alt="TEJAS" width={36} height={36} className="object-contain" />
            </div>
            <span className="font-black text-foreground">TEJAS Institute</span>
          </Link>

          <h1 className="text-2xl font-bold text-foreground tracking-tight">Sign in to your portal</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            New here?{' '}
            <Link href="/admissions/apply" className="font-semibold" style={{ color: '#0055FF' }}>
              Apply for admission →
            </Link>
          </p>

          {isDemoMode && (
            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-600 dark:text-amber-400">
              <strong>Demo mode:</strong> Use <code>student@</code>, <code>trainer@</code>, <code>mentor@</code>, or <code>admin@</code> as the email prefix to switch roles.
            </div>
          )}

          <form onSubmit={handleSignIn} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-tejas-blue focus:outline-none focus:ring-2 focus:ring-tejas-blue/20 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!isDemoMode}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 pr-10 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-tejas-blue focus:outline-none focus:ring-2 focus:ring-tejas-blue/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: loading ? '#555' : '#0055FF' }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Demo role shortcuts */}
          {isDemoMode && (
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Quick demo access</p>
              <div className="grid grid-cols-2 gap-2">
                {(['student', 'trainer', 'mentor', 'admin'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => { loginAs(role); router.push(`/dashboard/${role}`); }}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground capitalize hover:border-tejas-blue/40 hover:text-tejas-blue transition"
                  >
                    {role} portal →
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
