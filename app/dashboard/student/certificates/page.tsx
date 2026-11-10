'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { useLms } from '@/lib/store/lms-store';
import { PROGRAMS } from '@/lib/data/programs';
import { formatDate } from '@/lib/utils';
import { Certificate } from '@/types';
import {
  Award,
  Download,
  ExternalLink,
  Shield,
  Calendar,
  BookOpen,
  CheckCircle2,
  QrCode,
} from 'lucide-react';

function CertificateCard({ cert }: { cert: Certificate }) {
  const program = PROGRAMS.find(p => p.id === cert.program_id);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-tejas-blue/40 transition-all">
      {/* Certificate header gradient */}
      <div className="h-2 bg-gradient-to-r from-tejas-navy via-tejas-blue to-tejas-cyan" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-tejas-blue to-tejas-cyan shadow">
            <Award className="h-6 w-6 text-white" />
          </div>
          <span className="rounded-full bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2.5 py-0.5 text-xs font-medium">
            ✓ Valid
          </span>
        </div>

        <div className="mt-4">
          <div className="text-xs text-tejas-cyan font-medium uppercase tracking-wide mb-1">Certificate of Completion</div>
          <h3 className="font-semibold text-foreground leading-snug">
            {cert.program_title}
          </h3>
          <div className="mt-1 text-xs text-muted-foreground">{program?.school_name ?? 'TEJAS Institute'}</div>
        </div>

        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-tejas-blue" />
            <span className="font-mono">{cert.certificate_id}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Issued: {formatDate(cert.issued_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-3.5 w-3.5 text-yellow-500" />
            <span>Grade: {cert.grade}</span>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Link
            href={`/verify/${cert.certificate_id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-medium hover:bg-muted/60 transition-colors"
          >
            <QrCode className="h-3.5 w-3.5" />
            Verify
          </Link>
          <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-tejas-blue px-3 py-2 text-xs font-medium text-white hover:bg-tejas-blue/90 transition-colors">
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </button>
          <a
            href={cert.verification_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-medium hover:bg-muted/60 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function StudentCertificatesPage() {
  const { certificates, enrollments } = useLms();
  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE');

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Certificates</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your earned credentials and completion certificates
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Certificates Earned', value: certificates.length, icon: Award, color: 'text-yellow-500' },
            { label: 'Active Programs', value: activeEnrollments.length, icon: BookOpen, color: 'text-tejas-blue' },
            { label: 'Verified Credentials', value: certificates.length, icon: Shield, color: 'text-green-500' },
            { label: 'Programs Completed', value: enrollments.filter(e => e.status === 'COMPLETED').length, icon: CheckCircle2, color: 'text-tejas-cyan' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <Icon className={`h-5 w-5 mb-2 ${color}`} />
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Certificates grid */}
        {certificates.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map(cert => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Certificates Yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              Complete a program to earn your first TEJAS Institute certificate.
            </p>
            <Link
              href="/dashboard/student"
              className="inline-flex items-center gap-2 rounded-lg bg-tejas-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-tejas-blue/90 transition-colors"
            >
              Continue Learning
            </Link>
          </div>
        )}

        {/* In-progress programs */}
        {activeEnrollments.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Upcoming Certificates</h2>
            <div className="space-y-3">
              {activeEnrollments.map(enr => {
                const program = PROGRAMS.find(p => p.id === enr.program_id);
                return (
                  <div key={enr.id} className="flex items-center justify-between gap-4 rounded-lg bg-muted/30 p-3">
                    <div>
                      <div className="text-sm font-medium">{program?.title ?? 'Program'}</div>
                      <div className="text-xs text-muted-foreground">
                        Active · {Math.round(enr.progress_percentage)}% complete
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-tejas-blue to-tejas-cyan"
                          style={{ width: `${enr.progress_percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                        {Math.round(enr.progress_percentage)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
