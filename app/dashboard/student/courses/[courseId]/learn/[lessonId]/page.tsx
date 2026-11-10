'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SAMPLE_COURSES, SAMPLE_ASSESSMENT, SAMPLE_ASSIGNMENTS } from '@/lib/data/mock-store';
import { useAuth } from '@/lib/auth/auth-context';
import { useLms } from '@/lib/store/lms-store';
import { ThemeToggle } from '@/components/theme-toggle';
import { RoleSwitcher } from '@/components/layout/role-switcher';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  MessageSquare,
  HelpCircle,
  Send,
  UploadCloud,
  Github,
  Award,
} from 'lucide-react';

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const {
    lessonProgress,
    markLessonComplete,
    updateVideoProgress,
    submitAssignment,
  } = useLms();

  const courseId = (params?.courseId as string) || 'course-ai-01';
  const lessonId = (params?.lessonId as string) || 'les-01';

  const course = SAMPLE_COURSES.find(c => c.id === courseId) || SAMPLE_COURSES[0];
  const allLessons = course.modules?.flatMap(m => m.lessons || []) || [];
  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];

  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  // Active view tab in center panel
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'assignment' | 'discussion'>('content');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(true);
  const [studentNote, setStudentNote] = useState('Scaled dot product scaling factor sqrt(d_k) stabilizes softmax gradients for large dimensions.');

  // Video State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(1680);

  const progressKey = `${user?.id || 'user-student-01'}_${currentLesson.id}`;
  const isLessonCompleted = !!lessonProgress[progressKey]?.isCompleted;

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = Math.floor(videoRef.current.currentTime);
      const total = Math.floor(videoRef.current.duration) || 1680;
      setWatchedSeconds(current);
      setTotalSeconds(total);
      updateVideoProgress(user?.id || 'user-student-01', currentLesson.id, current, total);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  // Interactive Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleSelectQuizAnswer = (qId: string, optId: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const handleGradeQuiz = () => {
    let score = 0;
    SAMPLE_ASSESSMENT.questions?.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        score += q.points;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    markLessonComplete(user?.id || 'user-student-01', currentLesson.id);
  };

  // Assignment State
  const [assignmentRepo, setAssignmentRepo] = useState('https://github.com/rohan-tejas-fellow/pytorch-mha-from-scratch');
  const [assignmentText, setAssignmentText] = useState('Implemented full causal masking and compared gradient flow with PyTorch 2.0 SDPA.');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAssignment({
      assignment_id: 'asg-01',
      assignment_title: currentLesson.title,
      student_id: user?.id || 'user-student-01',
      student_name: user?.full_name || 'Rohan Patnaik',
      submission_text: assignmentText,
      github_repo_url: assignmentRepo,
    });
    setAssignmentSubmitted(true);
    markLessonComplete(user?.id || 'user-student-01', currentLesson.id);
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Top Player Navigation Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/student"
            className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exit to Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="truncate text-xs font-bold text-foreground">
            {course.title}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mark Complete Checkbox */}
          <button
            onClick={() => markLessonComplete(user?.id || 'user-student-01', currentLesson.id)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              isLessonCompleted
                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                : 'border border-border bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">{isLessonCompleted ? 'Lesson Completed' : 'Mark Completed'}</span>
          </button>

          <RoleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* 3-Pane Player Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT PANE: Course Curriculum Navigation (Collapsible on mobile) */}
        <aside
          className={`fixed inset-y-14 left-0 z-30 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="border-b border-border p-3.5 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Course Curriculum
            </span>
            <span className="text-[11px] font-semibold text-tejas-blue">
              {allLessons.filter(l => lessonProgress[`${user?.id || 'user-student-01'}_${l.id}`]?.isCompleted).length} / {allLessons.length} Completed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {course.modules?.map((mod, modIdx) => (
              <div key={mod.id} className="space-y-1">
                <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  {mod.title}
                </div>
                <div className="space-y-0.5">
                  {mod.lessons?.map(les => {
                    const isSelected = les.id === currentLesson.id;
                    const isCompleted = !!lessonProgress[`${user?.id || 'user-student-01'}_${les.id}`]?.isCompleted;
                    return (
                      <Link
                        key={les.id}
                        href={`/dashboard/student/courses/${course.id}/learn/${les.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-start gap-2.5 rounded-xl px-2.5 py-2 text-xs transition ${
                          isSelected
                            ? 'bg-tejas-blue text-white font-semibold shadow-sm'
                            : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 mt-0.5 opacity-40" />
                        )}
                        <div className="overflow-hidden">
                          <div className="truncate leading-tight">{les.title}</div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                            {les.lesson_type} • {les.duration_mins} mins
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Mobile backdrop for curriculum drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* CENTER PANE: Active Video Player & Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8 flex flex-col">
          <div className="mx-auto w-full max-w-4xl space-y-6">
            {/* Breadcrumb & Title */}
            <div>
              <div className="text-xs font-semibold text-tejas-blue uppercase tracking-wider">
                Lesson {currentLessonIndex + 1} of {allLessons.length}
              </div>
              <h1 className="mt-1 text-xl font-bold font-display text-foreground sm:text-2xl">
                {currentLesson.title}
              </h1>
            </div>

            {/* Video Player (Requirement 11 & 12) */}
            {currentLesson.video && (
              <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-2xl">
                <div className="relative aspect-video w-full bg-slate-950">
                  <video
                    ref={videoRef}
                    src={currentLesson.video.video_url}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => markLessonComplete(user?.id || 'user-student-01', currentLesson.id)}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Custom Video Controls Bar */}
                <div className="flex flex-wrap items-center justify-between border-t border-slate-800 bg-slate-900/90 px-4 py-2 text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-tejas-blue text-white hover:bg-tejas-blue-dark transition"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                    </button>
                    <span className="font-mono text-[11px] text-slate-300">
                      {Math.floor(watchedSeconds / 60)}:{String(watchedSeconds % 60).padStart(2, '0')} / {Math.floor(totalSeconds / 60)}:{String(totalSeconds % 60).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Speed:</span>
                    {[1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => changeSpeed(speed)}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          playbackSpeed === speed ? 'bg-tejas-blue text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                    <span className="text-[10px] font-mono text-emerald-400 ml-2 hidden sm:inline">
                      R2 SIGNED URL
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tabs (Overview, Quiz, Assignment, Discussion) — touch scrollable on mobile */}
            <div className="border-b border-border flex items-center gap-4 text-xs font-semibold overflow-x-auto no-scrollbar scroll-touch whitespace-nowrap pb-0.5">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-2.5 border-b-2 shrink-0 transition ${
                  activeTab === 'content' ? 'border-tejas-blue text-tejas-blue' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Lesson Reading &amp; Theory
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`pb-2.5 border-b-2 shrink-0 transition ${
                  activeTab === 'quiz' ? 'border-tejas-blue text-tejas-blue' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Assessment Quiz
              </button>
              <button
                onClick={() => setActiveTab('assignment')}
                className={`pb-2.5 border-b-2 shrink-0 transition ${
                  activeTab === 'assignment' ? 'border-tejas-blue text-tejas-blue' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Lab Assignment Submission
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`pb-2.5 border-b-2 shrink-0 transition ${
                  activeTab === 'discussion' ? 'border-tejas-blue text-tejas-blue' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Mentor Q&amp;A
              </button>
            </div>

            {/* Tab 1: Lesson Markdown Theory */}
            {activeTab === 'content' && (
              <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {currentLesson.content_markdown || (
                    <div>
                      <p>In this lesson we study the foundational mechanics of the topic.</p>
                      <pre className="p-3 bg-muted rounded-xl font-mono text-xs overflow-x-auto">
                        {`# PyTorch Vectorized Attention Implementation\nscores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)\nattn = torch.softmax(scores, dim=-1)\noutput = torch.matmul(attn, V)`}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Assessment Engine */}
            {activeTab === 'quiz' && (
              <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold font-display text-foreground">
                    {SAMPLE_ASSESSMENT.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pass mark: {SAMPLE_ASSESSMENT.pass_percentage}% • Time limit: {SAMPLE_ASSESSMENT.time_limit_mins} mins
                  </p>
                </div>

                <div className="space-y-6">
                  {SAMPLE_ASSESSMENT.questions?.map((q, idx) => (
                    <div key={q.id} className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                      <div className="flex items-start gap-2 text-xs font-semibold text-foreground">
                        <span className="font-mono text-tejas-orange">Q{idx + 1}.</span>
                        <span>{q.question_text}</span>
                      </div>

                      <div className="space-y-2">
                        {q.options.map(opt => {
                          const isSelected = selectedAnswers[q.id] === opt.id;
                          const isCorrect = q.correct_answer === opt.id;
                          return (
                            <label
                              key={opt.id}
                              onClick={() => handleSelectQuizAnswer(q.id, opt.id)}
                              className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer text-xs transition ${
                                isSelected
                                  ? 'border-tejas-blue bg-tejas-blue/10 text-foreground font-semibold'
                                  : 'border-border bg-background text-muted-foreground hover:bg-muted'
                              } ${
                                quizSubmitted && isCorrect
                                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                                  : ''
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                checked={isSelected}
                                onChange={() => handleSelectQuizAnswer(q.id, opt.id)}
                                className="mt-0.5"
                                disabled={quizSubmitted}
                              />
                              <span>{opt.text}</span>
                            </label>
                          );
                        })}
                      </div>

                      {quizSubmitted && q.explanation && (
                        <div className="rounded-lg bg-card p-3 text-[11px] text-muted-foreground border border-border">
                          <span className="font-bold text-foreground">Explanation:</span> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {quizSubmitted ? (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
                    <span className="text-xs font-bold text-emerald-500">
                      Quiz Completed! You scored {quizScore} / {SAMPLE_ASSESSMENT.questions?.reduce((acc, q) => acc + q.points, 0)} points.
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleGradeQuiz}
                    className="rounded-xl bg-tejas-blue px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-tejas-blue-dark transition"
                  >
                    Submit Quiz &amp; Grade
                  </button>
                )}
              </div>
            )}

            {/* Tab 3: Assignment Submission */}
            {activeTab === 'assignment' && (
              <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div>
                  <h3 className="text-base font-bold font-display text-foreground">
                    Lab Assignment: Custom Tensor Implementation
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submit your GitHub repository link and verification writeup for mentor review.
                  </p>
                </div>

                {assignmentSubmitted ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-2">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
                    <div className="text-xs font-bold text-foreground">Assignment Submitted Successfully</div>
                    <p className="text-[11px] text-muted-foreground">
                      Status: SUBMITTED → Awaiting review by Er. Arpita Senapati.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground">GitHub Repository URL *</label>
                      <input
                        type="url"
                        required
                        value={assignmentRepo}
                        onChange={e => setAssignmentRepo(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-tejas-blue focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground">Implementation Notes &amp; Benchmark Results</label>
                      <textarea
                        rows={3}
                        value={assignmentText}
                        onChange={e => setAssignmentText(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-tejas-blue focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-tejas-blue px-5 py-2.5 text-xs font-bold text-white hover:bg-tejas-blue-dark transition"
                    >
                      <UploadCloud className="h-4 w-4" />
                      <span>Submit for Mentor Code Review</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Tab 4: Discussion */}
            {activeTab === 'discussion' && (
              <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-bold font-display text-foreground">
                  Mentor &amp; Fellow Discussion
                </h3>
                <div className="space-y-3">
                  <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-tejas-blue">
                      <span>Er. Arpita Senapati (Mentor)</span>
                      <span className="text-muted-foreground font-normal">Yesterday</span>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      Remember that when causal masking is used, tokens can only attend to earlier indices. Ensure your attention mask sets future logits to -inf before softmax.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next / Previous Lesson Nav Buttons */}
            <div className="flex items-center justify-between border-t border-border pt-6">
              {prevLesson ? (
                <Link
                  href={`/dashboard/student/courses/${course.id}/learn/${prevLesson.id}`}
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous: {prevLesson.title.split(' ')[0]}</span>
                </Link>
              ) : <div />}

              {nextLesson ? (
                <Link
                  href={`/dashboard/student/courses/${course.id}/learn/${nextLesson.id}`}
                  className="flex items-center gap-2 rounded-xl bg-tejas-blue px-4 py-2 text-xs font-bold text-white hover:bg-tejas-blue-dark"
                >
                  <span>Next: {nextLesson.title.split(' ')[0]}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : <div />}
            </div>
          </div>
        </main>

        {/* RIGHT PANE: Resources & Notes */}
        <aside className="hidden xl:flex w-72 flex-col border-l border-border bg-card p-4 space-y-6">
          {/* Downloadable R2 Resources (Requirement 11 & 22) */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Protected R2 Resources
            </span>
            <div className="space-y-2 text-xs">
              {currentLesson.resources?.map(res => (
                <a
                  key={res.id}
                  href="#"
                  onClick={e => { e.preventDefault(); alert(`Generating signed Cloudflare R2 download URL for ${res.title}`); }}
                  className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-2.5 transition hover:bg-muted hover:border-tejas-blue/40"
                >
                  <div className="overflow-hidden">
                    <div className="truncate font-semibold text-foreground">{res.title}</div>
                    <div className="text-[10px] text-muted-foreground">{res.file_type}</div>
                  </div>
                  <Download className="h-4 w-4 text-tejas-blue shrink-0" />
                </a>
              )) || (
                <div className="text-[11px] text-muted-foreground italic">
                  No additional attachments for this lesson.
                </div>
              )}
            </div>
          </div>

          {/* Student Scratchpad Notes */}
          <div className="flex-1 flex flex-col space-y-2 border-t border-border pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Personal Lesson Notes
            </span>
            <textarea
              rows={8}
              value={studentNote}
              onChange={e => setStudentNote(e.target.value)}
              placeholder="Record your derivation takeaways, kernel commands, or questions..."
              className="w-full flex-1 rounded-xl border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-tejas-blue focus:outline-none resize-none font-mono"
            />
            <div className="text-[10px] text-muted-foreground text-right">
              Auto-saved to local session
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
