'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { useLms } from '@/lib/store/lms-store';
import { useAuth } from '@/lib/auth/auth-context';
import { formatDate } from '@/lib/utils';
import { uploadFileToR2, getFileDownloadUrl } from '@/lib/storage/upload';
import type { Assignment, AssignmentSubmission } from '@/types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Eye,
  Calendar,
  BookOpen,
  Award,
  X,
  ExternalLink,
  Github,
  Globe,
  Loader2,
  Download,
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-950/40', icon: Clock },
  submitted: { label: 'Submitted', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-950/40', icon: CheckCircle2 },
  graded: { label: 'Graded', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-950/40', icon: Award },
  late: { label: 'Late', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-950/40', icon: AlertCircle },
  overdue: { label: 'Overdue', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-950/40', icon: AlertCircle },
} as const;

export default function StudentAssignmentsPage() {
  const { assignments, submissions, submitAssignment } = useLms();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  // Modals state
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<{ assignment: Assignment; submission: AssignmentSubmission } | null>(null);

  // Form state
  const [githubRepoUrl, setGithubRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const enriched = assignments.map(a => {
    const sub = submissions.find(s => s.assignment_id === a.id);
    const dueDate = new Date(a.due_date);
    const now = new Date();
    let status: keyof typeof STATUS_CONFIG = 'pending';
    if (sub) {
      status = sub.score !== null && sub.score !== undefined ? 'graded' : 'submitted';
    } else if (dueDate < now) {
      status = 'overdue';
    }
    return { ...a, submission: sub, status, isOverdue: !sub && dueDate < now };
  });

  const filtered = filter === 'all' ? enriched : enriched.filter(a => a.status === filter);

  const pending = enriched.filter(a => a.status === 'pending' || a.status === 'overdue');
  const submitted = enriched.filter(a => a.status === 'submitted');
  const graded = enriched.filter(a => a.status === 'graded');

  const handleOpenSubmitModal = (assignment: Assignment) => {
    setSubmittingAssignment(assignment);
    setGithubRepoUrl('');
    setLiveDemoUrl('');
    setSubmissionNotes('');
    setSelectedFile(null);
    setUploadProgress(null);
    setErrorMsg('');
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment || !user) return;

    setErrorMsg('');
    setIsUploading(true);

    try {
      let r2Key: string | undefined = undefined;
      let fileName: string | undefined = undefined;

      if (selectedFile) {
        setUploadProgress(0);
        const { key } = await uploadFileToR2(selectedFile, 'assignments', (pct) => {
          setUploadProgress(pct);
        });
        r2Key = key;
        fileName = selectedFile.name;
      }

      submitAssignment({
        assignment_id: submittingAssignment.id,
        assignment_title: submittingAssignment.title,
        student_id: user.id,
        student_name: user.full_name,
        submission_text: submissionNotes,
        github_repo_url: githubRepoUrl || undefined,
        live_demo_url: liveDemoUrl || undefined,
        r2_submission_file_key: r2Key,
        file_name: fileName,
      });

      setSubmittingAssignment(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload assignment file.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-display">Assignments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submit your work directly to Cloudflare R2 storage and track mentor feedback
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total', value: enriched.length, icon: FileText, color: 'text-tejas-blue' },
            { label: 'Pending', value: pending.length, icon: Clock, color: 'text-yellow-500' },
            { label: 'Submitted', value: submitted.length, icon: CheckCircle2, color: 'text-blue-500' },
            { label: 'Graded', value: graded.length, icon: Award, color: 'text-green-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-4">
              <Icon className={`h-5 w-5 mb-2 ${color}`} />
              <div className="text-2xl font-bold font-display">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
          {(['all', 'pending', 'submitted', 'graded'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Assignment list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-sm">No assignments in this category.</p>
            </div>
          ) : (
            filtered.map(assignment => {
              const cfg = STATUS_CONFIG[assignment.status];
              const StatusIcon = cfg.icon;
              const dueDate = new Date(assignment.due_date);
              const isUrgent = !assignment.submission && (dueDate.getTime() - Date.now()) < 86400000 * 2;

              return (
                <div
                  key={assignment.id}
                  className={`rounded-xl border bg-card p-5 transition-all hover:border-tejas-blue/30 ${
                    isUrgent ? 'border-red-200 dark:border-red-900/40' : 'border-border'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                      <StatusIcon className={`h-4 w-4 ${cfg.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">{assignment.instructions}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className={isUrgent ? 'text-red-500 font-semibold' : ''}>
                            Due: {formatDate(assignment.due_date)}
                          </span>
                          {isUrgent && <span className="text-red-500 font-semibold">(Urgent)</span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Max marks: {assignment.max_score}</span>
                        </div>
                        {assignment.submission?.score !== null && assignment.submission?.score !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              Grade: {assignment.submission.score}/{assignment.max_score}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Mentor feedback */}
                      {assignment.submission?.feedback && (
                        <div className="mt-3 rounded-lg bg-tejas-blue/5 border border-tejas-blue/20 p-3">
                          <div className="text-xs font-semibold text-tejas-blue mb-1">Mentor Feedback</div>
                          <p className="text-xs text-muted-foreground">{assignment.submission.feedback}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {!assignment.submission && (
                          <button
                            onClick={() => handleOpenSubmitModal(assignment)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-tejas-blue px-4 py-2 text-xs font-semibold text-white hover:bg-tejas-blue-dark transition-colors shadow-sm"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Submit Assignment
                          </button>
                        )}
                        {assignment.submission && (
                          <button
                            onClick={() => setViewingSubmission({ assignment, submission: assignment.submission! })}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Submission
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Submit Modal (Direct Cloudflare R2 Upload) ── */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar scroll-touch rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-tejas-blue">Cloudflare R2 Direct Upload</span>
                <h2 className="text-lg font-bold text-foreground font-display">Submit Assignment</h2>
              </div>
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Assignment</label>
                <div className="mt-1 rounded-lg bg-muted/40 border border-border p-3 text-xs text-foreground font-medium">
                  {submittingAssignment.title}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5" /> GitHub Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project-repo"
                  value={githubRepoUrl}
                  onChange={(e) => setGithubRepoUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Live Demonstration URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://my-app.tejas.live or vercel.app"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
                />
              </div>

              {/* Cloudflare R2 File Upload */}
              <div>
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5" /> Upload Archive / Deliverable (.zip, .pdf, .ipynb)
                </label>
                <div className="mt-1.5 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center">
                  <input
                    type="file"
                    id="assignment-file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <label
                    htmlFor="assignment-file"
                    className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted/60 transition"
                  >
                    <Upload className="h-3.5 w-3.5 text-tejas-blue" />
                    {selectedFile ? 'Change File' : 'Select Local File'}
                  </label>
                  {selectedFile ? (
                    <div className="mt-2 text-xs font-medium text-foreground">
                      {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ) : (
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Max file size: 50MB. Uploads securely to Cloudflare R2 bucket.
                    </p>
                  )}
                </div>

                {/* Upload Progress Bar */}
                {uploadProgress !== null && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Streaming to Cloudflare R2...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-tejas-blue transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Notes for Mentor</label>
                <textarea
                  rows={3}
                  placeholder="Summarize your architecture decisions, edge cases handled, or questions for your reviewer..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-base sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-500">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 rounded-lg bg-tejas-blue px-5 py-2 text-xs font-bold text-white hover:bg-tejas-blue-dark transition disabled:opacity-60"
                >
                  {isUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {isUploading ? 'Streaming to R2...' : 'Submit Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Submission Modal ── */}
      {viewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar scroll-touch rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xl animate-scale-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Submitted Deliverable</span>
                <h2 className="text-lg font-bold text-foreground font-display">{viewingSubmission.assignment.title}</h2>
              </div>
              <button
                onClick={() => setViewingSubmission(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-muted-foreground">Submitted At:</span>
                <span className="ml-2 text-foreground font-medium">{formatDate(viewingSubmission.submission.submitted_at)}</span>
              </div>

              {viewingSubmission.submission.github_repo_url && (
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={viewingSubmission.submission.github_repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tejas-blue hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>{viewingSubmission.submission.github_repo_url}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {viewingSubmission.submission.live_demo_url && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={viewingSubmission.submission.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tejas-blue hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>{viewingSubmission.submission.live_demo_url}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {viewingSubmission.submission.file_name && (
                <div className="rounded-xl border border-border bg-muted/30 p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-foreground">{viewingSubmission.submission.file_name}</span>
                    <span className="block text-[11px] text-muted-foreground">Stored securely on Cloudflare R2</span>
                  </div>
                  {viewingSubmission.submission.r2_submission_file_key && (
                    <button
                      onClick={async () => {
                        const url = await getFileDownloadUrl(viewingSubmission.submission.r2_submission_file_key!);
                        window.open(url, '_blank');
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-card border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                    >
                      <Download className="h-3.5 w-3.5 text-tejas-blue" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              )}

              {viewingSubmission.submission.submission_text && (
                <div>
                  <span className="font-semibold text-muted-foreground block mb-1">Student Notes:</span>
                  <div className="rounded-xl border border-border bg-muted/20 p-3 text-muted-foreground leading-relaxed">
                    {viewingSubmission.submission.submission_text}
                  </div>
                </div>
              )}

              {viewingSubmission.submission.feedback && (
                <div className="rounded-xl border border-tejas-blue/30 bg-tejas-blue/10 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-tejas-blue">Mentor Review &amp; Feedback</span>
                    {viewingSubmission.submission.score !== undefined && (
                      <span className="font-bold text-green-600 dark:text-green-400">
                        Score: {viewingSubmission.submission.score}/{viewingSubmission.assignment.max_score}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {viewingSubmission.submission.feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setViewingSubmission(null)}
                className="rounded-lg bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/80"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
