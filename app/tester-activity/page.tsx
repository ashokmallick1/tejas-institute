'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Terminal,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Camera,
  Play,
  FileText,
  Eye,
  SlidersHorizontal,
  Wifi,
  Radio,
} from 'lucide-react';
import { QaTesterActivityLog, QaActionType } from '@/types/qa';
import { QaService } from '@/lib/qa/qa-service';
import { MetadataInspectorModal } from '@/components/qa/metadata-inspector-modal';

const ACTION_CONFIG: Record<QaActionType, { label: string; icon: any; bg: string; text: string; border: string }> = {
  login:             { label: 'Login',           icon: User,         bg: 'bg-sky-500/10',    text: 'text-sky-400',    border: 'border-sky-500/30' },
  logout:            { label: 'Logout',          icon: User,         bg: 'bg-zinc-500/10',   text: 'text-zinc-400',   border: 'border-zinc-500/30' },
  page_view:         { label: 'Page View',       icon: Eye,          bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  test_execute:      { label: 'Test Executed',   icon: CheckCircle2, bg: 'bg-emerald-500/10',text: 'text-emerald-400',border: 'border-emerald-500/30' },
  observation_save:  { label: 'Bug Note Saved',  icon: FileText,     bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/30' },
  screenshot_upload: { label: 'Evidence Upload', icon: Camera,       bg: 'bg-rose-500/10',   text: 'text-rose-400',   border: 'border-rose-500/30' },
  suite_trigger:     { label: 'Suite Trigger',   icon: Play,         bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
};

export default function AdminTesterActivityPage() {
  const [logs, setLogs] = useState<QaTesterActivityLog[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [testerFilter, setTesterFilter] = useState('ALL');
  const [selectedLogForInspect, setSelectedLogForInspect] = useState<QaTesterActivityLog | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load logs
  const loadLogs = () => {
    setIsRefreshing(true);
    const data = QaService.getActivityLogs(200);
    setLogs(data);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Auto-refresh interval (polling every 4 seconds)
  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(() => {
      const data = QaService.getActivityLogs(200);
      setLogs(data);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  // Unique testers
  const testersList = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.tester_email));
    return Array.from(set);
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        log.tester_email.toLowerCase().includes(q) ||
        (log.tester_name && log.tester_name.toLowerCase().includes(q)) ||
        (log.metadata?.test_id && log.metadata.test_id.toLowerCase().includes(q)) ||
        (log.metadata?.route && log.metadata.route.toLowerCase().includes(q)) ||
        (log.metadata?.observations && log.metadata.observations.toLowerCase().includes(q));

      const matchesAction = actionFilter === 'ALL' || log.action_type === actionFilter;
      const matchesTester = testerFilter === 'ALL' || log.tester_email === testerFilter;

      return matchesSearch && matchesAction && matchesTester;
    });
  }, [logs, searchQuery, actionFilter, testerFilter]);

  // Aggregate stats
  const metrics = useMemo(() => {
    const total = logs.length;
    const executions = logs.filter((l) => l.action_type === 'test_execute').length;
    const bugNotes = logs.filter((l) => l.action_type === 'observation_save').length;
    const screenshots = logs.filter((l) => l.action_type === 'screenshot_upload').length;
    const uniqueTesters = new Set(logs.map((l) => l.tester_email)).size;

    return { total, executions, bugNotes, screenshots, uniqueTesters };
  }, [logs]);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display flex items-center gap-2">
              <span>Tester Activity Monitor</span>
            </h1>
            <span className="rounded-full bg-tejas-blue/15 border border-tejas-blue/30 px-2.5 py-0.5 text-xs font-bold text-tejas-blue flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Audit</span>
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Administrative surveillance and live telemetry stream tracking manual tester actions, Playwright headless runs, and bug submissions.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              isAutoRefresh
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-border bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            <Radio className={`h-3.5 w-3.5 ${isAutoRefresh ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>Auto-Refresh: {isAutoRefresh ? 'ON (4s)' : 'PAUSED'}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={loadLogs}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
            title="Refresh logs now"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 5 Real-Time Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground font-semibold flex items-center justify-between">
            <span>Total Logged Events</span>
            <Activity className="h-4 w-4 text-tejas-blue" />
          </div>
          <div className="mt-2 text-2xl font-black font-display text-foreground">
            {metrics.total}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Audit actions recorded</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground font-semibold flex items-center justify-between">
            <span>Active Testers</span>
            <User className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-display text-indigo-400">
            {metrics.uniqueTesters}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Unique identities</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-xs">
          <div className="text-xs text-emerald-400 font-semibold flex items-center justify-between">
            <span>Test Executions</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-display text-emerald-400">
            {metrics.executions}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">Automated &amp; manual</div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-xs">
          <div className="text-xs text-amber-400 font-semibold flex items-center justify-between">
            <span>Observations Saved</span>
            <FileText className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-display text-amber-400">
            {metrics.bugNotes}
          </div>
          <div className="text-[10px] text-amber-400/80 mt-0.5">Repro findings logged</div>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-xs text-rose-400 font-semibold flex items-center justify-between">
            <span>Evidence Uploads</span>
            <Camera className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-display text-rose-400">
            {metrics.screenshots}
          </div>
          <div className="text-[10px] text-rose-400/80 mt-0.5">Screenshots attached</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by tester, TC ID, route, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-tejas-blue"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-hidden"
          >
            <option value="ALL">All Actions ({logs.length})</option>
            <option value="test_execute">Test Executed</option>
            <option value="observation_save">Bug Note Saved</option>
            <option value="screenshot_upload">Screenshot Upload</option>
            <option value="suite_trigger">Suite Trigger</option>
            <option value="page_view">Page View</option>
            <option value="login">Login</option>
          </select>

          {/* Tester Filter */}
          <select
            value={testerFilter}
            onChange={(e) => setTesterFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-hidden"
          >
            <option value="ALL">All Testers</option>
            {testersList.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Feed Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Tester</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target / Test</th>
                <th className="py-3 px-4">Telemetry Summary</th>
                <th className="py-3 px-4 text-right">Payload</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                    No activity logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const actionCfg = ACTION_CONFIG[log.action_type] || ACTION_CONFIG.page_view;
                  const ActionIcon = actionCfg.icon;

                  return (
                    <tr key={log.id} className="transition hover:bg-muted/30">
                      {/* Timestamp */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-foreground font-semibold">
                          {new Date(log.created_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {new Date(log.created_at).toLocaleDateString('en-IN')}
                        </div>
                      </td>

                      {/* Tester */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground">
                          {log.tester_name || 'QA Tester'}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono truncate max-w-xs">
                          {log.tester_email}
                        </div>
                      </td>

                      {/* Action Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${actionCfg.bg} ${actionCfg.text} ${actionCfg.border}`}>
                          <ActionIcon className="h-3 w-3" />
                          <span>{actionCfg.label}</span>
                        </span>
                      </td>

                      {/* Target / Test ID */}
                      <td className="py-3 px-4">
                        {log.metadata?.test_id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              {log.metadata.test_id}
                            </span>
                            <span className="truncate max-w-[200px] text-foreground font-medium">
                              {log.metadata.test_title || ''}
                            </span>
                          </div>
                        ) : log.metadata?.route ? (
                          <span className="font-mono text-xs text-foreground bg-muted/50 px-2 py-0.5 rounded border border-border">
                            {log.metadata.route}
                          </span>
                        ) : log.metadata?.suite ? (
                          <span className="font-mono text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            suite: {log.metadata.suite}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Platform Root</span>
                        )}
                      </td>

                      {/* Summary */}
                      <td className="py-3 px-4 max-w-sm truncate text-muted-foreground">
                        {log.metadata?.observations ? (
                          <span className="text-foreground">{log.metadata.observations}</span>
                        ) : log.metadata?.status ? (
                          <span>Marked status as <strong className="uppercase font-mono text-foreground">{log.metadata.status}</strong> ({log.metadata.duration_ms || 320}ms)</span>
                        ) : log.metadata?.user_agent ? (
                          <span className="font-mono text-[11px]">{log.metadata.user_agent.slice(0, 45)}...</span>
                        ) : log.metadata?.passed_count !== undefined ? (
                          <span>{log.metadata.passed_count}/{log.metadata.total_executed} passed on {log.metadata.device}</span>
                        ) : (
                          <span>Event captured successfully</span>
                        )}
                      </td>

                      {/* Action Button: Inspect */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedLogForInspect(log)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
                        >
                          <Terminal className="h-3 w-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metadata Inspector Modal */}
      <MetadataInspectorModal
        log={selectedLogForInspect}
        onClose={() => setSelectedLogForInspect(null)}
      />

    </div>
  );
}
