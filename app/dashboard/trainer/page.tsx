'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { useAuth } from '@/lib/auth/auth-context';
import { useLms } from '@/lib/store/lms-store';
import { SAMPLE_COURSES, SAMPLE_BATCH } from '@/lib/data/mock-store';
import {
  BookOpen,
  Plus,
  Video,
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Send,
  UploadCloud,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function TrainerDashboardPage() {
  const { user } = useAuth();
  const { attendance, recordAttendance, announcements } = useLms();

  const [activeTab, setActiveTab] = useState<'courses' | 'batches' | 'attendance' | 'announcements'>('courses');
  const [courses, setCourses] = useState(SAMPLE_COURSES);

  // New Lesson form state
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<'VIDEO' | 'READING' | 'ASSIGNMENT'>('VIDEO');
  const [newLessonDuration, setNewLessonDuration] = useState(30);

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle) return;

    setCourses(prev => {
      const copy = [...prev];
      const mod = copy[0].modules?.[0];
      if (mod) {
        mod.lessons = mod.lessons || [];
        mod.lessons.push({
          id: `les-${Date.now()}`,
          module_id: mod.id,
          title: newLessonTitle,
          slug: newLessonTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          lesson_type: newLessonType,
          order_idx: mod.lessons.length + 1,
          duration_mins: newLessonDuration,
          is_free_preview: false,
        });
      }
      return copy;
    });

    setNewLessonTitle('');
    setIsAddingLesson(false);
  };

  // Quick Attendance Marking
  const [attendanceDate, setAttendanceDate] = useState('2026-03-31');
  const [attendanceStatus, setAttendanceStatus] = useState<'PRESENT' | 'ABSENT' | 'LATE'>('PRESENT');
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const handleMarkAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    recordAttendance(SAMPLE_BATCH.id, 'user-student-01', attendanceDate, attendanceStatus, 'Marked by Trainer Prof. Priyadarshi');
    setAttendanceMarked(true);
    setTimeout(() => setAttendanceMarked(false), 3000);
  };

  return (
    <DashboardShell activeRole="trainer">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Banner */}
        <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-indigo-500/10 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="rounded-full bg-indigo-500/15 px-3 py-0.5 text-xs font-bold text-indigo-400">
                FACULTY &amp; CURRICULUM STUDIO
              </span>
              <h1 className="mt-2 text-2xl font-bold font-display text-foreground sm:text-3xl">
                Instructor Console — {user?.full_name || 'Prof. Priyadarshi Mohapatra'}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground max-w-xl">
                Manage lesson content, author laboratory curricula, record batch attendance, and broadcast announcements.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingLesson(true)}
                className="flex items-center gap-1.5 rounded-xl bg-tejas-blue px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-tejas-blue-dark transition"
              >
                <Plus className="h-4 w-4" />
                <span>Author New Lesson</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('courses')}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === 'courses' ? 'bg-tejas-blue text-white' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Curriculum Authoring
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === 'batches' ? 'bg-tejas-blue text-white' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Batches &amp; Cohorts
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`rounded-xl px-4 py-2 transition ${
              activeTab === 'attendance' ? 'bg-tejas-blue text-white' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Mark Attendance
          </button>
        </div>

        {/* TAB 1: Courses & Modules */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {isAddingLesson && (
              <div className="rounded-2xl border border-tejas-blue/40 bg-card p-6 shadow-xl">
                <h3 className="text-base font-bold font-display text-foreground">
                  Author New Lesson (R2 Video &amp; Document Asset)
                </h3>
                <form onSubmit={handleAddLesson} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-foreground">Lesson Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1.4 PagedAttention Kernel Optimization"
                      value={newLessonTitle}
                      onChange={e => setNewLessonTitle(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">Lesson Format</label>
                    <select
                      value={newLessonType}
                      onChange={e => setNewLessonType(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                    >
                      <option value="VIDEO">Video Stream (R2)</option>
                      <option value="READING">Reading Theory</option>
                      <option value="ASSIGNMENT">Lab Assignment</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingLesson(false)}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-tejas-blue px-4 py-2 text-xs font-bold text-white hover:bg-tejas-blue-dark"
                    >
                      Publish Lesson to LMS
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {courses.map(courseItem => (
                <div key={courseItem.id} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div>
                      <span className="rounded bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 uppercase">
                        {courseItem.status}
                      </span>
                      <h2 className="mt-1 text-lg font-bold font-display text-foreground">
                        {courseItem.title}
                      </h2>
                    </div>
                    <span className="text-xs text-muted-foreground">{courseItem.estimated_hours} Hours</span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {courseItem.modules?.map(module => (
                      <div key={module.id} className="rounded-2xl border border-border/60 bg-muted/20 p-4 space-y-2">
                        <div className="text-xs font-bold text-foreground">{module.title}</div>
                        <div className="space-y-1">
                          {module.lessons?.map(les => (
                            <div
                              key={les.id}
                              className="flex items-center justify-between rounded-xl bg-card p-2.5 text-xs border border-border/40"
                            >
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                                  {les.lesson_type}
                                </span>
                                <span className="font-semibold text-foreground">{les.title}</span>
                              </div>
                              <div className="flex items-center gap-3 text-muted-foreground">
                                <span>{les.duration_mins}m</span>
                                <Link
                                  href={`/dashboard/student/courses/${courseItem.id}/learn/${les.id}`}
                                  className="text-tejas-blue hover:underline"
                                >
                                  Preview in Player →
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Batches */}
        {activeTab === 'batches' && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold font-display text-foreground">Active Batch Overview</h2>
            <div className="rounded-2xl border border-border bg-muted/20 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="rounded bg-tejas-orange/20 px-2 py-0.5 text-[10px] font-bold text-tejas-orange uppercase">
                  {SAMPLE_BATCH.status}
                </span>
                <h3 className="mt-1 text-base font-bold text-foreground">{SAMPLE_BATCH.name}</h3>
                <div className="mt-1 text-xs text-muted-foreground">
                  Enrolled: <strong className="text-foreground">{SAMPLE_BATCH.enrolled_count} / {SAMPLE_BATCH.max_capacity} Fellows</strong> • Start: {SAMPLE_BATCH.start_date}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Mentor: <strong className="text-foreground">{SAMPLE_BATCH.mentor_name}</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Mark Attendance */}
        {activeTab === 'attendance' && (
          <div className="max-w-xl rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold font-display text-foreground">Record Lab Session Attendance</h2>
            <p className="text-xs text-muted-foreground">
              Marks fellow presence for physical and hybrid lab telemetry.
            </p>

            <form onSubmit={handleMarkAttendance} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Session Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={e => setAttendanceDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Attendance Status</label>
                <select
                  value={attendanceStatus}
                  onChange={e => setAttendanceStatus(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="LATE">LATE</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="EXCUSED">EXCUSED</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-tejas-blue py-2.5 text-xs font-bold text-white hover:bg-tejas-blue-dark transition"
              >
                Log Verified Attendance
              </button>

              {attendanceMarked && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-center text-xs font-bold text-emerald-500">
                  ✓ Attendance Logged Successfully
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
