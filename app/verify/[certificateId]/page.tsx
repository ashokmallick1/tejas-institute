import React from 'react';
import { PublicShell } from '@/components/layout/public-shell';
import { SAMPLE_CERTIFICATE } from '@/lib/data/mock-store';
import { formatDate } from '@/lib/utils';
import { ShieldCheck, CheckCircle2, Award, Calendar, ExternalLink, Printer } from 'lucide-react';
import Link from 'next/link';

interface VerifyPageProps {
  params: Promise<{ certificateId: string }>;
}

export default async function CertificateVerificationPage({ params }: VerifyPageProps) {
  const { certificateId } = await params;

  // Verify against sample credential or mock registry
  const cert = certificateId === SAMPLE_CERTIFICATE.certificate_id ? SAMPLE_CERTIFICATE : {
    ...SAMPLE_CERTIFICATE,
    certificate_id: certificateId,
    student_name: 'Fellow Credential Record',
  };

  return (
    <PublicShell>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* Status Badge */}
          <div className="mb-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
              <span>CRYPTOGRAPHICALLY VERIFIED CREDENTIAL</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">Status: ACTIVE</span>
          </div>

          {/* Certificate Certificate Presentation Canvas */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-card p-8 md:p-14 shadow-2xl">
            {/* Subtle decorative security background watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
              <span className="font-display text-9xl font-black">TEJAS</span>
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-3 border-b border-border/80 pb-8">
              <div className="inline-block font-display text-2xl font-black tracking-widest text-foreground">
                TEJAS
              </div>
              <div className="text-xs uppercase tracking-widest text-tejas-blue font-bold">
                Institute of Advanced Technology • Bhubaneswar, India
              </div>
              <h1 className="text-xl font-bold font-display uppercase tracking-wider text-muted-foreground pt-4">
                Official Credential of Completion
              </h1>
            </div>

            {/* Student & Award details */}
            <div className="py-8 text-center space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                This is to certify that
              </p>
              <h2 className="text-3xl font-extrabold font-display text-foreground sm:text-4xl">
                {cert.student_name}
              </h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                has successfully defended all laboratory projects, satisfied 1-on-1 mentor code audits, and demonstrated production engineering competency in:
              </p>
              <div className="inline-block rounded-2xl border border-tejas-blue/30 bg-tejas-blue/10 px-6 py-2.5 text-sm font-bold text-tejas-blue">
                {cert.program_title}
              </div>
              <div className="text-xs font-semibold text-emerald-500">
                Evaluation Standing: {cert.grade}
              </div>
            </div>

            {/* Skills / Competency tags */}
            <div className="border-t border-border/60 py-6">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center mb-3">
                Verified Architectural Competencies
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {cert.skills_covered.map(skill => (
                  <span
                    key={skill}
                    className="rounded-lg bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Signatory & Issuance */}
            <div className="mt-6 border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
              <div className="text-left space-y-1">
                <div className="text-muted-foreground">Issuance Date</div>
                <div className="font-bold text-foreground font-display flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-tejas-orange" />
                  <span>{formatDate(cert.issued_at)}</span>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  ID: {cert.certificate_id}
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-display font-bold text-foreground text-sm">
                  {cert.authorized_signatory}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {cert.signatory_title}
                </div>
              </div>
            </div>

            {/* Cryptographic hash */}
            <div className="mt-8 rounded-xl border border-border/80 bg-muted/40 p-3 text-[10px] font-mono text-muted-foreground break-all">
              <span className="font-bold text-foreground">SHA-256 Ledger Hash:</span> {cert.verification_hash}
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Questions regarding academic verification? Contact{' '}
            <a href="mailto:verify@tejas.ac.in" className="text-tejas-blue underline">
              verify@tejas.ac.in
            </a>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
