'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Camera,
  Upload,
  ExternalLink,
  History,
  Play,
  Terminal,
  BookOpen,
  CheckSquare,
  Sparkles,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Trash2,
  Monitor,
  Smartphone,
  Shield,
  Layers,
  Check,
  Zap,
} from 'lucide-react';
import {
  QaTestCase,
  QaTestResult,
  TestStatus,
  TestPriority,
  QaCycleSummary,
} from '@/types/qa';
import {
  QaService,
  DEFAULT_QA_TEST_CASES,
  getTodayDateString,
} from '@/lib/qa/qa-service';
import { ScreenshotLightbox } from '@/components/qa/screenshot-lightbox';
import { TestHistoryModal } from '@/components/qa/test-history-modal';

type QaTab = 'execution' | 'playbook' | 'automation';

const STATUS_BUTTONS: { status: TestStatus; label: string; icon: any; activeClass: string; idleClass: string }[] = [
  {
    status: 'passed',
    label: 'Pass',
    icon: CheckCircle2,
    activeClass: 'bg-emerald-500 text-black border-emerald-500 shadow-md shadow-emerald-500/20 font-bold',
    idleClass: 'border-border/60 bg-muted/20 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30',
  },
  {
    status: 'failed',
    label: 'Fail',
    icon: XCircle,
    activeClass: 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20 font-bold',
    idleClass: 'border-border/60 bg-muted/20 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30',
  },
  {
    status: 'retest',
    label: 'Retest',
    icon: RotateCcw,
    activeClass: 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20 font-bold',
    idleClass: 'border-border/60 bg-muted/20 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30',
  },
  {
    status: 'blocked',
    label: 'Blocked',
    icon: AlertTriangle,
    activeClass: 'bg-orange-500 text-black border-orange-500 shadow-md shadow-orange-500/20 font-bold',
    idleClass: 'border-border/60 bg-muted/20 text-muted-foreground hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/30',
  },
];

const PRIORITY_BADGES: Record<TestPriority, { text: string; bg: string; border: string }> = {
  Critical: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  High:     { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  Medium:   { text: 'text-sky-400',   bg: 'bg-sky-500/10',   border: 'border-sky-500/30' },
  Low:      { text: 'text-zinc-400',  bg: 'bg-zinc-500/10',  border: 'border-zinc-500/30' },
};

export default function TestDataPage() {
  const [activeTab, setActiveTab] = useState<QaTab>('execution');
  const [selectedCycleDate, setSelectedCycleDate] = useState<string>(getTodayDateString());
  const [testCases] = useState<QaTestCase[]>(DEFAULT_QA_TEST_CASES);
  const [results, setResults] = useState<QaTestResult[]>([]);
  const [cycleSummary, setCycleSummary] = useState<QaCycleSummary>(QaService.getCycleSummary());

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Interactive Card Local edits
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});
  const [localScreenshots, setLocalScreenshots] = useState<Record<string, string>>({});
  const [savedFeedback, setSavedFeedback] = useState<Record<string, boolean>>({});
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  // Lightbox & History modals
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');
  const [historyModalCase, setHistoryModalCase] = useState<QaTestCase | null>(null);
  const [historyRuns, setHistoryRuns] = useState<QaTestResult[]>([]);

  // Suite Simulation state
  const [isRunningSuite, setIsRunningSuite] = useState(false);
  const [suiteRunMessage, setSuiteRunMessage] = useState<string | null>(null);

  // Hidden File input refs
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Load results for selected date
  const refreshResults = () => {
    const res = QaService.getTestResults(selectedCycleDate);
    setResults(res);
    setCycleSummary(QaService.getCycleSummary(selectedCycleDate));

    // Populate local notes map
    const notesMap: Record<string, string> = {};
    const ssMap: Record<string, string> = {};
    res.forEach((r) => {
      if (r.observations) notesMap[r.test_case_id] = r.observations;
      if (r.screenshot_url) ssMap[r.test_case_id] = r.screenshot_url;
    });
    setLocalNotes(notesMap);
    setLocalScreenshots(ssMap);
  };

  useEffect(() => {
    refreshResults();
  }, [selectedCycleDate]);

  // Map results by test_case_id for quick O(1) lookup
  const resultsByCaseId = useMemo(() => {
    const map = new Map<string, QaTestResult>();
    results.forEach((r) => map.set(r.test_case_id, r));
    return map;
  }, [results]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    testCases.forEach((tc) => set.add(tc.category));
    return Array.from(set);
  }, [testCases]);

  // Filtered Test Cases
  const filteredCases = useMemo(() => {
    return testCases.filter((tc) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        tc.test_id.toLowerCase().includes(q) ||
        tc.title.toLowerCase().includes(q) ||
        tc.category.toLowerCase().includes(q) ||
        tc.module.toLowerCase().includes(q) ||
        (tc.description && tc.description.toLowerCase().includes(q));

      const matchesCat = categoryFilter === 'ALL' || tc.category === categoryFilter;
      const matchesPri = priorityFilter === 'ALL' || tc.priority === priorityFilter;

      const currentRes = resultsByCaseId.get(tc.id);
      const currentStatus = currentRes?.status || 'pending';
      const matchesStatus = statusFilter === 'ALL' || currentStatus === statusFilter;

      return matchesSearch && matchesCat && matchesPri && matchesStatus;
    });
  }, [testCases, searchQuery, categoryFilter, priorityFilter, statusFilter, resultsByCaseId]);

  // 1-Click Status Toggle
  const handleSetStatus = (testCase: QaTestCase, newStatus: TestStatus) => {
    const saved = QaService.saveTestResult({
      test_case_id: testCase.id,
      test_id: testCase.test_id,
      test_title: testCase.title,
      tester_email: 'qa.lead@tejas.ac.in',
      tester_name: 'Subhranshu Jena',
      status: newStatus,
      cycle_date: selectedCycleDate,
      observations: localNotes[testCase.id] || '',
      screenshot_url: localScreenshots[testCase.id],
      run_mode: 'manual',
      device_info: 'Desktop Chrome 1440x900 (Windows 11)',
      duration_ms: Math.floor(180 + Math.random() * 250),
    });

    refreshResults();
  };

  // Save Observation Notes & Screenshot
  const handleSaveObservation = (testCase: QaTestCase) => {
    const currentRes = resultsByCaseId.get(testCase.id);
    const status = currentRes?.status || 'passed';

    QaService.saveTestResult({
      test_case_id: testCase.id,
      test_id: testCase.test_id,
      test_title: testCase.title,
      tester_email: 'qa.lead@tejas.ac.in',
      tester_name: 'Subhranshu Jena',
      status,
      cycle_date: selectedCycleDate,
      observations: localNotes[testCase.id] || '',
      screenshot_url: localScreenshots[testCase.id],
      run_mode: 'manual',
      device_info: 'Desktop Chrome 1440x900 (Windows 11)',
    });

    setSavedFeedback((prev) => ({ ...prev, [testCase.id]: true }));
    setTimeout(() => {
      setSavedFeedback((prev) => ({ ...prev, [testCase.id]: false }));
    }, 2500);

    refreshResults();
  };

  // Handle Screenshot Upload File Selection
  const handleScreenshotSelected = (testCaseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      setLocalScreenshots((prev) => ({ ...prev, [testCaseId]: dataUrl }));

      // Automatically persist to active result
      const tc = testCases.find((c) => c.id === testCaseId);
      if (tc) {
        QaService.saveTestResult({
          test_case_id: tc.id,
          test_id: tc.test_id,
          test_title: tc.title,
          tester_email: 'qa.lead@tejas.ac.in',
          tester_name: 'Subhranshu Jena',
          status: resultsByCaseId.get(tc.id)?.status || 'retest',
          cycle_date: selectedCycleDate,
          observations: localNotes[tc.id] || 'Attached screenshot error evidence for bug investigation.',
          screenshot_url: dataUrl,
          run_mode: 'manual',
          device_info: 'Desktop Chrome 1440x900',
        });
        refreshResults();
      }
    };
    reader.readAsDataURL(file);
  };

  // Open History Modal
  const handleOpenHistory = (tc: QaTestCase) => {
    const hist = QaService.getTestCaseHistory(tc.id);
    setHistoryRuns(hist);
    setHistoryModalCase(tc);
  };

  // Run Automated Suite Simulation
  const handleRunAutomatedSuite = async () => {
    setIsRunningSuite(true);
    setSuiteRunMessage(null);

    try {
      const res = await fetch('/api/v1/qa/run-suite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suite: 'smoke',
          device: 'Desktop Chrome 1440x900',
          cycle_date: selectedCycleDate,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuiteRunMessage(`Automated Suite Finished: ${data.passed_count}/${data.executed_count} test cases passed.`);
        refreshResults();
      }
    } catch (err: any) {
      setSuiteRunMessage('Suite trigger error: ' + err.message);
    } finally {
      setIsRunningSuite(false);
      setTimeout(() => setSuiteRunMessage(null), 6000);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">

      {/* ── Top Header Bar & Date Selector ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display flex items-center gap-2">
              <span>QA Command Center</span>
            </h1>
            <span className="rounded-full bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/30 px-2.5 py-0.5 text-xs font-bold text-rose-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Manual &amp; Playwright Runner</span>
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Execute manual test cycles, upload error screenshot evidence, track bugs, and review multi-device automation telemetry.
          </p>
        </div>

        {/* Testing Cycle Date Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cycle Date Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Cycle Date:</span>
            <input
              type="date"
              value={selectedCycleDate}
              onChange={(e) => setSelectedCycleDate(e.target.value)}
              className="bg-transparent text-foreground font-mono focus:outline-hidden text-xs cursor-pointer"
            />
          </div>

          {/* Quick Date Presets */}
          <button
            onClick={() => setSelectedCycleDate(getTodayDateString())}
            className="rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted transition"
          >
            Today
          </button>

          {/* Trigger Suite Button */}
          <button
            onClick={handleRunAutomatedSuite}
            disabled={isRunningSuite}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:opacity-95 transition disabled:opacity-50"
          >
            {isRunningSuite ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>{isRunningSuite ? 'Running Headless Tests...' : 'Run Automated Suite'}</span>
          </button>
        </div>
      </div>

      {suiteRunMessage && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-400 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{suiteRunMessage}</span>
          </div>
          <button onClick={() => setSuiteRunMessage(null)} className="text-emerald-400/80 hover:text-emerald-400">
            Dismiss
          </button>
        </div>
      )}

      {/* ── 3 Main Navigation Tabs ── */}
      <div className="flex border-b border-border text-xs sm:text-sm font-bold gap-2 sm:gap-6">
        <button
          onClick={() => setActiveTab('execution')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'execution'
              ? 'border-rose-500 text-rose-400 font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FlaskConical className="h-4 w-4" />
          <span>Tab 1: Test Cases &amp; Execution</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
            {testCases.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('playbook')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'playbook'
              ? 'border-rose-500 text-rose-400 font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Tab 2: Tester Playbook &amp; Instructions</span>
        </button>

        <button
          onClick={() => setActiveTab('automation')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'automation'
              ? 'border-rose-500 text-rose-400 font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Terminal className="h-4 w-4" />
          <span>Tab 3: Automation Framework (Playwright)</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: TEST CASES & EXECUTION WORKSPACE
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'execution' && (
        <div className="space-y-6">

          {/* 5 Summary Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Total Tests */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>Total Test Cases</span>
                <Layers className="h-4 w-4 text-tejas-blue" />
              </div>
              <div className="mt-2 text-2xl font-black font-display text-foreground">
                {cycleSummary.total_tests}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                Across 9 platform modules
              </div>
            </div>

            {/* Passed */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Passed</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-black font-display text-emerald-400">
                {cycleSummary.passed}
              </div>
              <div className="text-[10px] text-emerald-400/80 mt-0.5 font-bold">
                {cycleSummary.pass_percentage}% success rate
              </div>
            </div>

            {/* Failed */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
                <span>Failed</span>
                <XCircle className="h-4 w-4 text-rose-400" />
              </div>
              <div className="mt-2 text-2xl font-black font-display text-rose-400">
                {cycleSummary.failed}
              </div>
              <div className="text-[10px] text-rose-400/80 mt-0.5 font-bold">
                {cycleSummary.fail_percentage}% defect rate
              </div>
            </div>

            {/* Retest */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Pending Retest</span>
                <RotateCcw className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 text-2xl font-black font-display text-amber-400">
                {cycleSummary.retest}
              </div>
              <div className="text-[10px] text-amber-400/80 mt-0.5">
                Fix verification queue
              </div>
            </div>

            {/* Blocked */}
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 shadow-xs col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs text-orange-400 font-semibold">
                <span>Blocked</span>
                <AlertTriangle className="h-4 w-4 text-orange-400" />
              </div>
              <div className="mt-2 text-2xl font-black font-display text-orange-400">
                {cycleSummary.blocked}
              </div>
              <div className="text-[10px] text-orange-400/80 mt-0.5">
                Upstream dependency wait
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by test ID (TC01), title, category, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-rose-500"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-hidden"
              >
                <option value="ALL">All Modules ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-hidden"
              >
                <option value="ALL">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-hidden"
              >
                <option value="ALL">All Statuses</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="retest">Retest</option>
                <option value="blocked">Blocked</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Test Cards Feed */}
          <div className="space-y-4">
            {filteredCases.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-xs text-muted-foreground">
                No test cases match your filter criteria.
              </div>
            ) : (
              filteredCases.map((tc) => {
                const currentRes = resultsByCaseId.get(tc.id);
                const currentStatus = currentRes?.status || 'pending';
                const priorityBadge = PRIORITY_BADGES[tc.priority];
                const isStepsOpen = Boolean(expandedSteps[tc.id]);
                const screenshot = localScreenshots[tc.id];

                return (
                  <div
                    key={tc.id}
                    className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs transition hover:border-border/90"
                  >
                    {/* Header Row: ID, Title, Category, Priority, and History Button */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            {tc.test_id}
                          </span>

                          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            {tc.category}
                          </span>

                          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${priorityBadge.bg} ${priorityBadge.text} ${priorityBadge.border}`}>
                            {tc.priority} Priority
                          </span>

                          {tc.is_automated && (
                            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/20">
                              {tc.automated_tag || 'Automated'}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-foreground font-display">
                          {tc.title}
                        </h3>

                        {tc.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {tc.description}
                          </p>
                        )}
                      </div>

                      {/* Right action group */}
                      <div className="flex items-center gap-2 shrink-0">
                        {tc.target_url && (
                          <Link
                            href={tc.target_url}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
                            title="Open target test screen in new tab"
                          >
                            <span>Open Route</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}

                        <button
                          onClick={() => handleOpenHistory(tc)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
                          title="View historical runs across dates"
                        >
                          <History className="h-3.5 w-3.5" />
                          <span>History</span>
                        </button>
                      </div>
                    </div>

                    {/* Reproduction Steps & Expected Result */}
                    <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setExpandedSteps((p) => ({ ...p, [tc.id]: !p[tc.id] }))}
                          className="flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-rose-400 transition"
                        >
                          {isStepsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          <span>Steps to Reproduce ({tc.steps.length})</span>
                        </button>

                        <span className="text-[10px] font-mono text-muted-foreground">
                          Module: {tc.module}
                        </span>
                      </div>

                      {isStepsOpen && (
                        <div className="space-y-1.5 pt-1 pl-1 text-xs text-muted-foreground font-sans">
                          {tc.steps.map((st, sidx) => (
                            <div key={sidx} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500/70 mt-1.5 shrink-0" />
                              <span>{st}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Expected Result Banner */}
                      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2.5 flex items-start gap-2 text-xs">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-emerald-400 font-bold block mb-0.5">Expected Result:</strong>
                          <span className="text-emerald-300/90 leading-relaxed">{tc.expected_result}</span>
                        </div>
                      </div>
                    </div>

                    {/* 1-Click Status Toggles */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Execution Status for {selectedCycleDate}:
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {STATUS_BUTTONS.map((btn) => {
                          const Icon = btn.icon;
                          const isActive = currentStatus === btn.status;

                          return (
                            <button
                              key={btn.status}
                              onClick={() => handleSetStatus(tc, btn.status)}
                              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs transition ${
                                isActive ? btn.activeClass : btn.idleClass
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span>{btn.label}</span>
                            </button>
                          );
                        })}

                        <span className="text-[11px] text-muted-foreground ml-auto font-mono">
                          Mode: {currentRes?.run_mode || 'manual'}
                        </span>
                      </div>
                    </div>

                    {/* Observation / Bug Notes Box */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                        <span>Tester Observation &amp; Bug Reproduction Notes:</span>
                        <span className="text-[10px] font-normal text-muted-foreground">Auto-saved to cycle record</span>
                      </div>

                      <textarea
                        rows={2}
                        value={localNotes[tc.id] || ''}
                        onChange={(e) => setLocalNotes((p) => ({ ...p, [tc.id]: e.target.value }))}
                        placeholder="Log actual findings, error responses, browser warnings, reproduction caveats..."
                        className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-rose-500 font-mono leading-relaxed"
                      />
                    </div>

                    {/* Screenshot Evidence Row & Save Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      {/* Screenshot attachment preview / button */}
                      <div className="flex items-center gap-2">
                        {screenshot ? (
                          <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-xl p-1.5 pr-3">
                            <img
                              src={screenshot}
                              alt="Error Evidence"
                              onClick={() => {
                                setLightboxImage(screenshot);
                                setLightboxTitle(`${tc.test_id} — ${tc.title}`);
                              }}
                              className="h-10 w-14 object-cover rounded-lg cursor-pointer border border-border hover:opacity-80 transition"
                              title="Click to view full-resolution lightbox"
                            />
                            <div className="text-xs">
                              <span className="font-semibold text-foreground block">Screenshot Attached</span>
                              <button
                                onClick={() => {
                                  setLightboxImage(screenshot);
                                  setLightboxTitle(`${tc.test_id} — ${tc.title}`);
                                }}
                                className="text-[11px] text-rose-400 hover:underline"
                              >
                                View Lightbox
                              </button>
                            </div>
                            <button
                              onClick={() => setLocalScreenshots((p) => {
                                const next = { ...p };
                                delete next[tc.id];
                                return next;
                              })}
                              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-rose-400 ml-2"
                              title="Remove screenshot"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              ref={(el) => {
                                fileInputRefs.current[tc.id] = el;
                              }}
                              onChange={(e) => handleScreenshotSelected(tc.id, e)}
                              className="hidden"
                            />
                            <button
                              onClick={() => fileInputRefs.current[tc.id]?.click()}
                              className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition"
                            >
                              <Camera className="h-3.5 w-3.5 text-rose-400" />
                              <span>Attach Error Screenshot</span>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => handleSaveObservation(tc)}
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                          savedFeedback[tc.id]
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-tejas-blue text-white hover:bg-tejas-blue-dark'
                        }`}
                      >
                        {savedFeedback[tc.id] ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Saved to Cycle!</span>
                          </>
                        ) : (
                          <>
                            <FileText className="h-3.5 w-3.5" />
                            <span>Save Observation</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: TESTER PLAYBOOK & INSTRUCTIONS (SOPs)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'playbook' && (
        <div className="space-y-6">

          {/* Intro Banner */}
          <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-rose-500/10 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-500/15 px-3 py-0.5 text-xs font-bold text-rose-400">
                STANDARD OPERATING PROCEDURE (SOP)
              </span>
              <span className="text-xs text-muted-foreground">Version 2.4 · TEJAS Testing Lab</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
              Manual QA Tester Playbook &amp; Verification Protocol
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              This playbook dictates the rigorous quality assurance workflow for verifying web, mobile, and deep-tech microservices across the TEJAS Institute platform. Follow each SOP step meticulously prior to sprint sign-off.
            </p>
          </div>

          {/* 4 Core SOP Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* SOP 1 */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-tejas-blue/15 text-tejas-blue font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-sm text-foreground">
                  Test Environment &amp; Device Matrix Preparation
                </h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-5 leading-relaxed">
                <li>Always clear application storage and verify session tokens prior to beginning a test cycle.</li>
                <li>Verify execution across 3 primary device profiles: Desktop Chrome (1440x900), Mobile Android Pixel 7 (412x915), and iOS Safari iPhone 13 (390x844).</li>
                <li>Inspect DevTools console for uncaught JavaScript exceptions, unhandled promise rejections, or hydration mismatch warnings.</li>
              </ul>
            </div>

            {/* SOP 2 */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-sm text-foreground">
                  Cycle Execution &amp; 1-Click Status Triage
                </h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-5 leading-relaxed">
                <li><strong className="text-emerald-400">Pass:</strong> All listed steps reproduce expected behavior with 100% fidelity.</li>
                <li><strong className="text-rose-400">Fail:</strong> Assertion fails, UI breaks, button unresponsive, or uncaught exception occurs.</li>
                <li><strong className="text-amber-400">Retest:</strong> Fix was deployed or flakiness detected; requires secondary cycle verification.</li>
                <li><strong className="text-orange-400">Blocked:</strong> Upstream third-party API or database outage prevents completing the test.</li>
              </ul>
            </div>

            {/* SOP 3 */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-sm text-foreground">
                  Bug Reporting Syntax &amp; Reproducibility
                </h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-5 leading-relaxed">
                <li>Always structure observation notes with: <code>[Steps]</code>, <code>[Expected]</code>, <code>[Actual]</code>, and <code>[Environment]</code>.</li>
                <li>Include network payload responses when debugging webhook or API regressions.</li>
                <li>Label priority based on user journey impact (Critical = blocks admissions/onboarding, High = core feature failure, Medium = layout/cosmetic).</li>
              </ul>
            </div>

            {/* SOP 4 */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 font-bold text-sm">
                  4
                </div>
                <h3 className="font-bold text-sm text-foreground">
                  Screenshot &amp; Visual Evidence Standards
                </h3>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-5 leading-relaxed">
                <li>Attach full-viewport screenshots highlighting the regression with red outline or callout.</li>
                <li>Ensure DevTools Console is captured if the bug relates to JavaScript error traces.</li>
                <li>Use the built-in Lightbox to verify image legibility before saving to the cycle record.</li>
              </ul>
            </div>

          </div>

          {/* Test Persona Credentials Matrix */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-tejas-blue" />
              <span>Multi-Role Persona Test Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">Role Persona</th>
                    <th className="py-2.5 px-3">Demo Name</th>
                    <th className="py-2.5 px-3">Key Responsibilities / Test Scope</th>
                    <th className="py-2.5 px-3">Primary Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-muted-foreground">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-sky-400">Fellow / Student</td>
                    <td className="py-2.5 px-3 text-foreground">Rohan Patnaik</td>
                    <td className="py-2.5 px-3">Coursework, video player progress, assignments, lab PR submissions</td>
                    <td className="py-2.5 px-3 font-mono">/dashboard/student</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-amber-400">Admissions CRM</td>
                    <td className="py-2.5 px-3 text-foreground">Priyanka Rout</td>
                    <td className="py-2.5 px-3">Twenty Kanban pipeline, candidate triage, AI email generator, 1-click enrollment</td>
                    <td className="py-2.5 px-3 font-mono">/crm</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">Mentor Reviewer</td>
                    <td className="py-2.5 px-3 text-foreground">Er. Arpita Senapati</td>
                    <td className="py-2.5 px-3">PR code reviews, attendance tracking, project approvals</td>
                    <td className="py-2.5 px-3 font-mono">/dashboard/mentor</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-400">Director / Admin</td>
                    <td className="py-2.5 px-3 text-foreground">Dr. Subhashree Dash</td>
                    <td className="py-2.5 px-3">Executive console, institute metrics, cohort management, audit logs</td>
                    <td className="py-2.5 px-3 font-mono">/dashboard/admin</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-rose-400">QA Lead / Tester</td>
                    <td className="py-2.5 px-3 text-foreground">Subhranshu Jena</td>
                    <td className="py-2.5 px-3">Test cycle execution, bug reporting, Playwright suite runner, activity audit</td>
                    <td className="py-2.5 px-3 font-mono">/test-data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: AUTOMATION FRAMEWORK (PLAYWRIGHT)
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'automation' && (
        <div className="space-y-6">

          {/* Architecture Banner */}
          <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-amber-500/10 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/15 px-3 py-0.5 text-xs font-bold text-amber-400">
                PLAYWRIGHT MULTI-DEVICE HEADLESS ENGINE
              </span>
              <span className="text-xs text-muted-foreground">Chromium · Mobile Android · WebKit iOS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
              Automated End-to-End Suite &amp; Live Database Reporter
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              Every automated test is mapped to a canonical <code>@TCxx</code> tag. When executed via the CLI or CI/CD pipelines, our custom Playwright reporter directly streams outcomes, execution timings, and assertions into the QA Database and this Command Center.
            </p>
          </div>

          {/* Device Emulation Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-tejas-blue" />
                  <span>Desktop Chrome</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">1440 × 900</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Emulates high-density desktop displays. Verifies Kanban horizontal scrolls, tables, sticky headers, and terminal layouts.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-emerald-400" />
                  <span>Pixel 7 (Android)</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">412 × 915 · DPR 2.625</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Chromium mobile viewport emulation. Tests bottom bar docks, touch hit targets, and mobile form keyboards.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-rose-400" />
                  <span>iPhone 13 (iOS)</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">390 × 844 · DPR 3.0</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                WebKit rendering engine emulation. Validates Safari backdrop blurs, safe-area insets, and drawer gestures.
              </p>
            </div>
          </div>

          {/* Interactive Terminal Simulator */}
          <div className="rounded-2xl border border-border bg-[#050607] overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/80 bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-muted-foreground ml-2">bash — tejas-qa-runner</span>
              </div>

              <span className="text-[11px] font-mono text-muted-foreground">
                playwright v1.63.0
              </span>
            </div>

            {/* Terminal Content */}
            <div className="p-5 font-mono text-xs space-y-3 leading-relaxed text-zinc-300">
              <div className="text-muted-foreground">
                # 1. Run all multi-device test suites with custom dashboard reporter
              </div>
              <div className="text-emerald-400 font-bold">
                $ npx playwright test
              </div>

              <div className="text-muted-foreground pt-2">
                # 2. Run only desktop chrome regression suite
              </div>
              <div className="text-emerald-400 font-bold">
                $ npx playwright test --project="Desktop Chrome"
              </div>

              <div className="text-muted-foreground pt-2">
                # 3. Run specific test case by @TCxx tag (e.g. TC01)
              </div>
              <div className="text-emerald-400 font-bold">
                $ npx playwright test --grep "@TC01"
              </div>

              <div className="text-muted-foreground pt-2">
                # 4. Run mobile responsive audit on Pixel 7
              </div>
              <div className="text-emerald-400 font-bold">
                $ npx playwright test --project="Mobile Android" tests/e2e/mobile-responsive.spec.ts
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Lightbox Modal */}
      <ScreenshotLightbox
        imageUrl={lightboxImage}
        title={lightboxTitle}
        onClose={() => setLightboxImage(null)}
      />

      {/* Execution History Modal */}
      <TestHistoryModal
        testCase={historyModalCase}
        history={historyRuns}
        isOpen={Boolean(historyModalCase)}
        onClose={() => setHistoryModalCase(null)}
      />

    </div>
  );
}
