'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  FileText,
  Building,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  X,
  RefreshCw,
  ExternalLink,
  Kanban,
  Table as TableIcon,
  Bot,
  Brain,
  SlidersHorizontal,
  Download,
  Copy,
  Check,
  Zap,
  Flame,
  Award,
  AlertTriangle,
  Send,
  MoreVertical,
  CheckSquare,
  Square,
  Receipt,
  CreditCard,
  Printer,
} from 'lucide-react';
import { StudentApplication, ApplicationStatus, LeadSentiment } from '@/types';
import { StudentAdmission, StudentInvoice } from '@/types/admission-invoice';
import { SAMPLE_APPLICATIONS } from '@/lib/data/mock-store';
import { PROGRAMS, SCHOOLS } from '@/lib/data/programs';
import { CrmAiEngine, LeadAnalysisResult } from '@/lib/crm/ai-engine';
import { AdmissionInvoiceService } from '@/lib/crm/admission-invoice-service';
import { AdmissionOfferModal } from '@/components/crm/admission-offer-modal';
import { PrintableInvoiceModal } from '@/components/crm/printable-invoice-modal';
import { CreateInvoiceModal } from '@/components/crm/create-invoice-modal';
import { RecordPaymentModal } from '@/components/crm/record-payment-modal';
import { useLms } from '@/lib/store/lms-store';

type CrmViewMode = 'kanban' | 'table' | 'ai_intelligence';

const PIPELINE_COLUMNS: { id: ApplicationStatus; label: string; color: string; badgeBg: string; border: string }[] = [
  { id: 'NEW',          label: 'New Inquiries',     color: 'text-sky-400',     badgeBg: 'bg-sky-500/10 text-sky-400',     border: 'border-sky-500/30' },
  { id: 'CONTACTED',    label: 'Contacted',         color: 'text-indigo-400',  badgeBg: 'bg-indigo-500/10 text-indigo-400', border: 'border-indigo-500/30' },
  { id: 'COUNSELLING',  label: 'Under Counselling', color: 'text-amber-400',   badgeBg: 'bg-amber-500/10 text-amber-400',  border: 'border-amber-500/30' },
  { id: 'SHORTLISTED',  label: 'Shortlisted',       color: 'text-purple-400',  badgeBg: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/30' },
  { id: 'ENROLLED',     label: 'Enrolled Fellows',  color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'REJECTED',     label: 'Closed / Ineligible', color: 'text-red-400',   badgeBg: 'bg-red-500/10 text-red-400',     border: 'border-red-500/30' },
];

const SENTIMENT_CONFIG: Record<LeadSentiment, { label: string; icon: any; color: string; bg: string }> = {
  HIGH_INTENT: { label: 'High Intent', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/30' },
  WARM:        { label: 'Warm',        icon: Zap,   color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' },
  NURTURING:   { label: 'Nurturing',   icon: Clock, color: 'text-sky-400',   bg: 'bg-sky-500/10 border-sky-500/30' },
  PRICE_SENSITIVE: { label: 'Price Sensitive', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  SKEPTICAL:   { label: 'Skeptical',   icon: AlertTriangle, color: 'text-zinc-400', bg: 'bg-zinc-500/10 border-zinc-500/30' },
};

export default function TwentyCrmApp() {
  const {
    applications,
    updateApplicationStatus,
    updateApplication,
    addApplication,
    enrollLeadAsStudent,
  } = useLms();

  const [viewMode, setViewMode] = useState<CrmViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('ALL');
  const [sentimentFilter, setSentimentFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<StudentApplication | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'ai' | 'timeline' | 'outreach' | 'tasks' | 'admission' | 'invoices'>('ai');
  const [selectedLeadsIds, setSelectedLeadsIds] = useState<string[]>([]);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);
  
  // Admission & Invoicing Modals
  const [selectedAdmissionModal, setSelectedAdmissionModal] = useState<StudentAdmission | null>(null);
  const [selectedPrintInvoiceModal, setSelectedPrintInvoiceModal] = useState<StudentInvoice | null>(null);
  const [selectedPaymentInvoiceModal, setSelectedPaymentInvoiceModal] = useState<StudentInvoice | null>(null);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiParserOpen, setIsAiParserOpen] = useState(false);
  const [rawResumeText, setRawResumeText] = useState('');
  const [isParsingAi, setIsParsingAi] = useState(false);

  // Outreach generator
  const [outreachTemplate, setOutreachTemplate] = useState<'FDE_INVITATION' | 'INTERVIEW_SHORTLIST' | 'CURRICULUM_DEEPDIVE' | 'FELLOWSHIP_OFFER'>('FDE_INVITATION');
  const [copiedOutreach, setCopiedOutreach] = useState(false);

  // Notes state
  const [newNote, setNewNote] = useState('');

  // Quick Add state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    program_id: 'prog-fde',
    city: 'Bhubaneswar',
    career_goal: '',
    admin_notes: '',
  });

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        app.full_name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.includes(q) ||
        app.education.toLowerCase().includes(q) ||
        (app.city && app.city.toLowerCase().includes(q)) ||
        (app.program_title && app.program_title.toLowerCase().includes(q));

      const matchesProgram = programFilter === 'ALL' || app.program_id === programFilter;
      const matchesSentiment = sentimentFilter === 'ALL' || app.sentiment === sentimentFilter;

      return matchesSearch && matchesProgram && matchesSentiment;
    });
  }, [applications, searchQuery, programFilter, sentimentFilter]);

  // Aggregate Pipeline Metrics
  const pipelineMetrics = useMemo(() => {
    const total = applications.length;
    const enrolled = applications.filter((a) => a.status === 'ENROLLED').length;
    const totalDealValue = applications.reduce((acc, a) => acc + (a.deal_value_inr || 90000), 0);
    const enrolledValue = applications.filter(a => a.status === 'ENROLLED').reduce((acc, a) => acc + (a.deal_value_inr || 90000), 0);
    const avgAiScore = Math.round(applications.reduce((acc, a) => acc + (a.ai_score || 75), 0) / (total || 1));
    const hotLeads = applications.filter(a => a.sentiment === 'HIGH_INTENT').length;

    return {
      total,
      enrolled,
      conversionRate: total > 0 ? Math.round((enrolled / total) * 100) : 0,
      totalDealValue,
      enrolledValue,
      avgAiScore,
      hotLeads,
    };
  }, [applications]);

  // Lead stage updater
  const handleMoveStatus = (id: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(id, newStatus);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Add counselor note
  const handleAddNote = (quickText?: string) => {
    if (!selectedLead) return;
    const textToAdd = quickText || newNote.trim();
    if (!textToAdd) return;

    const timestamp = new Date().toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const appended = `${selectedLead.admin_notes || ''}\n[${timestamp}] ${textToAdd}`.trim();

    updateApplicationStatus(selectedLead.id, selectedLead.status, appended);
    setSelectedLead((prev) => (prev ? { ...prev, admin_notes: appended } : null));
    setNewNote('');
  };

  // Run AI Lead Re-Analysis
  const handleRunAiAnalysis = (lead: StudentApplication) => {
    const analysis = CrmAiEngine.analyzeLead(lead);
    updateApplication(lead.id, {
      ai_score: analysis.score,
      ai_summary: analysis.summary,
      ai_recommendation: analysis.fellowshipRecommendation,
      sentiment: analysis.sentiment,
    });
    if (selectedLead && selectedLead.id === lead.id) {
      setSelectedLead((prev) =>
        prev
          ? {
              ...prev,
              ai_score: analysis.score,
              ai_summary: analysis.summary,
              ai_recommendation: analysis.fellowshipRecommendation,
              sentiment: analysis.sentiment,
            }
          : null
      );
    }
  };

  // AI Resume Parser submit
  const handleParseResume = () => {
    if (!rawResumeText.trim()) return;
    setIsParsingAi(true);
    setTimeout(() => {
      const extracted = CrmAiEngine.parseResumeText(rawResumeText);
      const analysis = CrmAiEngine.analyzeLead(extracted as StudentApplication);
      const newApp: StudentApplication = {
        ...(extracted as StudentApplication),
        id: `app-${Date.now()}`,
        ai_score: analysis.score,
        ai_summary: analysis.summary,
        ai_recommendation: analysis.fellowshipRecommendation,
        sentiment: analysis.sentiment,
        deal_value_inr: 95000,
        counselor_name: 'Priyanka Rout',
        source: 'WEBSITE',
      };
      addApplication(newApp);
      setIsParsingAi(false);
      setIsAiParserOpen(false);
      setRawResumeText('');
      setSelectedLead(newApp);
    }, 600);
  };

  // Manual Add Form
  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.phone) return;
    const prog = PROGRAMS.find((p) => p.id === formData.program_id);
    const baseLead: StudentApplication = {
      id: `app-${Date.now()}`,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      education: formData.education || 'Graduate',
      experience: formData.experience || 'Fresher',
      program_id: formData.program_id,
      program_title: prog ? prog.title : 'Forward Deployment Engineer (FDE) Fellowship',
      current_skills: 'Python, Problem Solving',
      career_goal: formData.career_goal,
      preferred_mode: 'IN_PERSON_BHUBANESWAR',
      city: formData.city || 'Bhubaneswar',
      status: 'NEW',
      admin_notes: formData.admin_notes || 'Logged manually in Twenty CRM',
      created_at: new Date().toISOString(),
      deal_value_inr: prog?.fee_inr || 95000,
      counselor_name: 'Amitabh Sen',
      source: 'DIRECT_INQUIRY',
    };
    const analysis = CrmAiEngine.analyzeLead(baseLead);
    baseLead.ai_score = analysis.score;
    baseLead.ai_summary = analysis.summary;
    baseLead.ai_recommendation = analysis.fellowshipRecommendation;
    baseLead.sentiment = analysis.sentiment;

    addApplication(baseLead);
    setIsAddModalOpen(false);
    setSelectedLead(baseLead);
  };

  // Direct Lead Enrollment into LMS
  const handleEnrollLead = (leadId: string) => {
    enrollLeadAsStudent(leadId);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: 'ENROLLED' } : null));
    }
    setEnrollSuccessMessage('Fellow has been officially enrolled! Batch Alpha LMS credentials active.');
    setTimeout(() => setEnrollSuccessMessage(null), 6000);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID,Name,Email,Phone,Education,Program,Status,AI_Score,Sentiment,City,Deal_Value_INR'];
    const rows = applications.map((a) =>
      `"${a.id}","${a.full_name}","${a.email}","${a.phone}","${a.education}","${a.program_title || ''}","${a.status}","${a.ai_score || ''}","${a.sentiment || ''}","${a.city}","${a.deal_value_inr || 0}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tejas_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Current lead AI analysis object
  const currentLeadAnalysis = useMemo(() => {
    if (!selectedLead) return null;
    return CrmAiEngine.analyzeLead(selectedLead);
  }, [selectedLead]);

  // Current lead outreach email draft
  const currentOutreach = useMemo(() => {
    if (!selectedLead) return null;
    return CrmAiEngine.generateOutreach(selectedLead, outreachTemplate);
  }, [selectedLead, outreachTemplate]);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">

      {/* ── Twenty-Style Top Bar: Title, Subdomain Pill & Action Group ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display flex items-center gap-2">
              <span>TEJAS Admissions CRM</span>
            </h1>
            <span className="rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-500 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Twenty AI Edition</span>
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Open-source AI-native CRM for candidate triage, AI resume enrichment, automated outreach, and enrollment pipeline.
          </p>
        </div>

        {/* Global CRM Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Resume Parser Button */}
          <button
            onClick={() => setIsAiParserOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-tejas-blue/40 bg-tejas-blue/10 px-3.5 py-2 text-xs font-semibold text-tejas-blue transition hover:bg-tejas-blue/20"
            title="Paste candidate text or resume for AI extraction"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>AI Resume Parser</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition"
            title="Export candidate pipeline to CSV"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add Candidate */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-tejas-flame-red via-tejas-flame-orange to-tejas-flame-amber px-4 py-2 text-xs font-bold text-white shadow-md transition hover:scale-102 active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* ── Real-Time Twenty KPI Ribbon ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Pipeline</div>
          <div className="mt-1 text-2xl font-black text-foreground font-display">{pipelineMetrics.total}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">₹{(pipelineMetrics.totalDealValue / 100000).toFixed(1)}L Pipeline Value</div>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="h-3 w-3" />
            <span>Hot Leads</span>
          </div>
          <div className="mt-1 text-2xl font-black text-rose-400 font-display">{pipelineMetrics.hotLeads}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">High enrollment intent</div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Avg AI Fit Score</div>
          <div className="mt-1 text-2xl font-black text-amber-400 font-display">{pipelineMetrics.avgAiScore}<span className="text-xs font-normal text-muted-foreground">/100</span></div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Curriculum readiness</div>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">Under Evaluation</div>
          <div className="mt-1 text-2xl font-black text-purple-400 font-display">
            {applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'COUNSELLING').length}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Interviews &amp; triage</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Enrolled Fellows</div>
          <div className="mt-1 text-2xl font-black text-emerald-400 font-display">{pipelineMetrics.enrolled}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">₹{(pipelineMetrics.enrolledValue / 100000).toFixed(1)}L Confirmed</div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Conversion</div>
          <div className="mt-1 text-2xl font-black text-tejas-blue font-display">{pipelineMetrics.conversionRate}%</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Target: 35%</div>
        </div>
      </div>

      {/* ── Twenty View Switcher & Filter Toolbar ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-card/70 border border-border p-2.5 rounded-2xl shadow-xs">
        
        {/* View Mode Toggle (Kanban vs Table vs AI Intelligence) */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'kanban'
                ? 'bg-card text-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Kanban className="h-3.5 w-3.5" />
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'table'
                ? 'bg-card text-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>Table View</span>
          </button>

          <button
            onClick={() => setViewMode('ai_intelligence')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'ai_intelligence'
                ? 'bg-card text-amber-500 shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>AI Radar</span>
          </button>
        </div>

        {/* Search & Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search candidate, college, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-8.5 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-tejas-blue"
            />
          </div>

          {/* Program Filter */}
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-hidden"
          >
            <option value="ALL">All Programs</option>
            <option value="prog-fde">FDE Fellowship</option>
            <option value="prog-01">AI &amp; Generative AI</option>
            <option value="prog-02">Agentic AI Systems</option>
            <option value="prog-05">Kubernetes &amp; Cloud</option>
            <option value="prog-09">VLSI Semiconductor</option>
            <option value="prog-13">EV Battery &amp; BMS</option>
          </select>

          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-hidden"
          >
            <option value="ALL">All Sentiments</option>
            <option value="HIGH_INTENT">🔥 High Intent</option>
            <option value="WARM">⚡ Warm</option>
            <option value="PRICE_SENSITIVE">💳 Price Sensitive</option>
            <option value="NURTURING">🌱 Nurturing</option>
          </select>
        </div>

      </div>

      {/* ── VIEW 1: TWENTY KANBAN BOARD VIEW ── */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-6">
          {PIPELINE_COLUMNS.map((col) => {
            const colApps = filteredApps.filter((a) => a.status === col.id);
            const colValue = colApps.reduce((acc, a) => acc + (a.deal_value_inr || 90000), 0);

            return (
              <div key={col.id} className="flex flex-col rounded-2xl border border-border bg-card/40 p-3 min-w-[245px] shadow-xs">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                  <div>
                    <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                    <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                      ₹{(colValue / 1000).toFixed(0)}k ({colApps.length})
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black border ${col.badgeBg} ${col.border}`}>
                    {colApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="mt-3 space-y-2.5">
                  {colApps.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-muted-foreground border border-dashed border-border/60 rounded-xl">
                      No candidates in this stage
                    </div>
                  ) : (
                    colApps.map((app) => {
                      const sentiment = app.sentiment ? SENTIMENT_CONFIG[app.sentiment] : SENTIMENT_CONFIG.WARM;
                      const SentimentIcon = sentiment.icon;

                      return (
                        <div
                          key={app.id}
                          onClick={() => {
                            setSelectedLead(app);
                            setActiveDrawerTab('ai');
                          }}
                          className="group cursor-pointer rounded-xl border border-border bg-card p-3 shadow-xs transition hover:border-tejas-blue/60 hover:shadow-md hover:-translate-y-0.5 space-y-2"
                        >
                          {/* Name, AI Score Badge, Date */}
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <div className="text-xs font-bold text-foreground group-hover:text-tejas-blue transition-colors">
                                {app.full_name}
                              </div>
                              <div className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                                {app.education.split(',')[0]}
                              </div>
                            </div>

                            {/* Twenty AI Score Pill */}
                            {app.ai_score && (
                              <div
                                className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-black border ${
                                  app.ai_score >= 88
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : app.ai_score >= 75
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                                }`}
                                title={`AI Fit Score: ${app.ai_score}/100`}
                              >
                                <Sparkles className="h-2.5 w-2.5" />
                                <span>{app.ai_score}</span>
                              </div>
                            )}
                          </div>

                          {/* Target Program Badge */}
                          <div>
                            <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground truncate max-w-full">
                              {app.program_title?.replace('Engineering', 'Eng') || 'FDE Fellowship'}
                            </span>
                          </div>

                          {/* Sentiment Tag & Deal Value */}
                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/40">
                            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold border ${sentiment.bg} ${sentiment.color}`}>
                              <SentimentIcon className="h-2.5 w-2.5" />
                              <span>{sentiment.label}</span>
                            </span>

                            <span className="font-mono font-bold text-foreground">
                              ₹{((app.deal_value_inr || 90000) / 1000).toFixed(0)}k
                            </span>
                          </div>

                          {/* Counselor Snippet / Notes */}
                          {app.admin_notes && (
                            <div className="rounded-lg bg-muted/30 p-1.5 text-[10px] text-muted-foreground line-clamp-2 italic">
                              &quot;{app.admin_notes}&quot;
                            </div>
                          )}

                          {/* Stage Transition Quick Selector */}
                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-tejas-blue flex items-center gap-0.5">
                              <span>Profile</span>
                              <ChevronRight className="h-3 w-3" />
                            </span>

                            <select
                              value={app.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handleMoveStatus(app.id, e.target.value as ApplicationStatus)}
                              className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-foreground focus:outline-hidden"
                            >
                              <option value="NEW">New</option>
                              <option value="CONTACTED">Contacted</option>
                              <option value="COUNSELLING">Counselling</option>
                              <option value="SHORTLISTED">Shortlisted</option>
                              <option value="ENROLLED">Enrolled</option>
                              <option value="REJECTED">Closed</option>
                            </select>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VIEW 2: TWENTY MODERN DATA TABLE VIEW ── */}
      {viewMode === 'table' && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              {/* Header */}
              <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-8">
                    <input
                      type="checkbox"
                      checked={selectedLeadsIds.length === filteredApps.length && filteredApps.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedLeadsIds(filteredApps.map(a => a.id));
                        else setSelectedLeadsIds([]);
                      }}
                      className="rounded border-border"
                    />
                  </th>
                  <th className="py-3 px-4">Candidate &amp; Contact</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4">Target Program</th>
                  <th className="py-3 px-4">Sentiment</th>
                  <th className="py-3 px-4">Education / College</th>
                  <th className="py-3 px-4">Counselor</th>
                  <th className="py-3 px-4">Deal Value</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-border">
                {filteredApps.map((app) => {
                  const isSelected = selectedLeadsIds.includes(app.id);
                  const sentiment = app.sentiment ? SENTIMENT_CONFIG[app.sentiment] : SENTIMENT_CONFIG.WARM;
                  const SentimentIcon = sentiment.icon;

                  return (
                    <tr
                      key={app.id}
                      onClick={() => {
                        setSelectedLead(app);
                        setActiveDrawerTab('ai');
                      }}
                      className={`cursor-pointer transition hover:bg-muted/40 ${isSelected ? 'bg-tejas-blue/5' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedLeadsIds([...selectedLeadsIds, app.id]);
                            else setSelectedLeadsIds(selectedLeadsIds.filter(id => id !== app.id));
                          }}
                          className="rounded border-border"
                        />
                      </td>

                      {/* Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground hover:text-tejas-blue">
                          {app.full_name}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{app.email}</span>
                          <span>·</span>
                          <span>{app.phone}</span>
                        </div>
                      </td>

                      {/* Stage dropdown */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={app.status}
                          onChange={(e) => handleMoveStatus(app.id, e.target.value as ApplicationStatus)}
                          className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold focus:outline-hidden"
                        >
                          <option value="NEW">New Inquiries</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="COUNSELLING">Under Counselling</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="ENROLLED">Enrolled</option>
                          <option value="REJECTED">Closed / Ineligible</option>
                        </select>
                      </td>

                      {/* AI Score Badge */}
                      <td className="py-3 px-4">
                        {app.ai_score ? (
                          <div
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-black border ${
                              app.ai_score >= 88
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : app.ai_score >= 75
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                            }`}
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>{app.ai_score}/100</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </td>

                      {/* Target Program */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-foreground truncate max-w-xs block">
                          {app.program_title || 'FDE Fellowship'}
                        </span>
                      </td>

                      {/* Sentiment */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${sentiment.bg} ${sentiment.color}`}>
                          <SentimentIcon className="h-3 w-3" />
                          <span>{sentiment.label}</span>
                        </span>
                      </td>

                      {/* Education / College */}
                      <td className="py-3 px-4 max-w-xs truncate text-muted-foreground">
                        {app.education}
                      </td>

                      {/* Counselor */}
                      <td className="py-3 px-4 text-muted-foreground">
                        {app.counselor_name || 'Unassigned'}
                      </td>

                      {/* Deal Value */}
                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        ₹{((app.deal_value_inr || 90000)).toLocaleString('en-IN')}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedLead(app);
                            setActiveDrawerTab('ai');
                          }}
                          className="rounded-lg border border-border px-2.5 py-1 text-xs font-semibold hover:bg-muted text-tejas-blue"
                        >
                          View Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── VIEW 3: AI INTELLIGENCE & RADAR VIEW ── */}
      {viewMode === 'ai_intelligence' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Hot Leads Watchlist */}
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-rose-500" />
                  <h3 className="text-base font-bold text-foreground font-display">
                    High-Intent Fellows Priority Watchlist
                  </h3>
                </div>
                <span className="rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 text-xs font-bold">
                  Immediate Callback Recommended
                </span>
              </div>

              <div className="divide-y divide-border/60">
                {applications
                  .filter(a => (a.ai_score || 0) >= 85 || a.sentiment === 'HIGH_INTENT')
                  .map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setActiveDrawerTab('ai');
                      }}
                      className="py-3 flex items-center justify-between cursor-pointer hover:bg-muted/40 rounded-xl px-2 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{lead.full_name}</span>
                          <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.2 text-[10px] font-black">
                            Score: {lead.ai_score}/100
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {lead.education} · {lead.program_title}
                        </p>
                        <p className="text-[11px] text-amber-400 font-medium italic">
                          AI: {lead.ai_summary}
                        </p>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                          {lead.status}
                        </span>
                        <button className="text-xs font-bold text-tejas-blue hover:underline">
                          Open Dossier →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Feeder Colleges & Demographics */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-tejas-blue" />
                <h3 className="text-base font-bold text-foreground font-display">
                  Top Feeder Universities
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'NIT Rourkela', count: 1, quality: 'A+ Tier' },
                  { name: 'KIIT University Bhubaneswar', count: 1, quality: 'A Tier' },
                  { name: 'ITER SOA University', count: 1, quality: 'A Tier' },
                  { name: 'OUTR (CET) Bhubaneswar', count: 1, quality: 'A Tier' },
                  { name: 'VSSUT Burla', count: 1, quality: 'A Tier' },
                  { name: 'Ravenshaw University Cuttack', count: 1, quality: 'B+ Tier' },
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-muted/30 border border-border/40">
                    <div>
                      <div className="font-bold text-foreground">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.quality}</div>
                    </div>
                    <span className="font-mono font-bold text-tejas-blue">{c.count} Applicant</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── TWENTY-GRADE SLIDE-OVER LEAD DETAIL DRAWER ── */}
      {selectedLead && currentLeadAnalysis && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
          {/* Backdrop click to close */}
          <div className="flex-1" onClick={() => setSelectedLead(null)} />

          {/* Slide-over panel */}
          <div className="w-full max-w-2xl bg-card border-l border-border h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-border bg-muted/20 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tejas-blue/15 text-tejas-blue font-black text-xl font-display shrink-0">
                  {selectedLead.full_name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground font-display">
                      {selectedLead.full_name}
                    </h2>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      ₹{((selectedLead.deal_value_inr || 90000) / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{selectedLead.email}</span>
                    <span>·</span>
                    <span>{selectedLead.phone}</span>
                    {selectedLead.city && (
                      <>
                        <span>·</span>
                        <span>{selectedLead.city}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Drawer */}
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stage Selector & Quick Re-analyze Bar */}
            <div className="px-5 py-3 border-b border-border/60 bg-card flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground">Stage:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleMoveStatus(selectedLead.id, e.target.value as ApplicationStatus)}
                  className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold text-foreground focus:outline-hidden"
                >
                  <option value="NEW">New Inquiries</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="COUNSELLING">Under Counselling</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="ENROLLED">Enrolled</option>
                  <option value="REJECTED">Closed / Ineligible</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunAiAnalysis(selectedLead)}
                  className="flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-500 hover:bg-amber-500/20"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Re-Score AI</span>
                </button>
              </div>
            </div>

            {/* Direct LMS Enrollment Bridge Banner */}
            <div className="px-5 py-3 border-b border-border/80 bg-muted/20">
              {selectedLead.status === 'ENROLLED' ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Enrolled Fellow · LMS Access Active (Batch Alpha 2026)</span>
                  </div>
                  <Link
                    href="/dashboard/student"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 text-black px-3 py-1 text-xs font-bold hover:bg-emerald-400 transition shrink-0"
                  >
                    <span>View Student LMS</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="rounded-xl border border-tejas-blue/30 bg-tejas-blue/5 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-tejas-blue" />
                      <span>Ready to formally admit candidate?</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Provisions Batch Alpha 2026 course schedule and grants portal access.
                    </div>
                  </div>
                  <button
                    onClick={() => handleEnrollLead(selectedLead.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black px-3.5 py-1.5 text-xs font-bold hover:opacity-95 shadow-md shadow-emerald-500/20 transition shrink-0"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Enroll Fellow</span>
                  </button>
                </div>
              )}

              {enrollSuccessMessage && (
                <div className="mt-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 px-3 py-2 text-xs font-semibold text-emerald-400 flex items-center gap-2 animate-in fade-in">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{enrollSuccessMessage}</span>
                </div>
              )}
            </div>

            {/* Tab Navigation (AI Copilot | Timeline | AI Outreach | Tasks) */}
            <div className="px-5 border-b border-border flex gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveDrawerTab('ai')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
                  activeDrawerTab === 'ai'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Brain className="h-4 w-4" />
                <span>AI Copilot Analysis</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('timeline')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
                  activeDrawerTab === 'timeline'
                    ? 'border-tejas-blue text-tejas-blue'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Call Logs &amp; Notes</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('outreach')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
                  activeDrawerTab === 'outreach'
                    ? 'border-tejas-blue text-tejas-blue'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Send className="h-4 w-4" />
                <span>AI Outreach Email</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('tasks')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
                  activeDrawerTab === 'tasks'
                    ? 'border-tejas-blue text-tejas-blue'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <CheckSquare className="h-4 w-4" />
                <span>Tasks</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('admission')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
                  activeDrawerTab === 'admission'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Admission Offer</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('invoices')}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
                  activeDrawerTab === 'invoices'
                    ? 'border-emerald-500 text-emerald-500'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Receipt className="h-4 w-4" />
                <span>Invoices &amp; Fees</span>
              </button>
            </div>

            {/* Drawer Body Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              
              {/* ── TAB 1: AI COPILOT ANALYSIS ── */}
              {activeDrawerTab === 'ai' && (
                <div className="space-y-4">
                  {/* Score Hero Card */}
                  <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        <span className="font-bold text-foreground text-sm">Twenty AI Fit Appraisal</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-amber-500 font-display">
                          {currentLeadAnalysis.score}/100
                        </div>
                        <div className="text-[10px] text-muted-foreground font-semibold">
                          Grade {currentLeadAnalysis.grade} Match
                        </div>
                      </div>
                    </div>

                    <p className="text-foreground leading-relaxed">
                      {currentLeadAnalysis.summary}
                    </p>

                    <div className="rounded-xl bg-amber-500/15 border border-amber-500/30 p-2 text-amber-400 font-bold text-[11px]">
                      {currentLeadAnalysis.fellowshipRecommendation}
                    </div>
                  </div>

                  {/* Strengths & Risk Factors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-card p-3 space-y-2">
                      <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Key Strengths</span>
                      </span>
                      <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                        {currentLeadAnalysis.keyStrengths.map((s, idx) => (
                          <li key={idx} className="leading-snug">{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-3 space-y-2">
                      <span className="font-bold text-amber-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Curriculum Gaps</span>
                      </span>
                      <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                        {currentLeadAnalysis.riskFactors.map((r, idx) => (
                          <li key={idx} className="leading-snug">{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommended Screening Questions */}
                  <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
                    <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                      <HelpCircleIcon className="h-4 w-4 text-tejas-blue" />
                      <span>Recommended Technical Interview Questions</span>
                    </span>
                    <div className="space-y-2 text-muted-foreground font-mono text-[11px] bg-muted/40 p-3 rounded-xl">
                      {currentLeadAnalysis.interviewQuestions.map((q, idx) => (
                        <div key={idx} className="leading-relaxed">{q}</div>
                      ))}
                    </div>
                  </div>

                  {/* Core Profile Properties */}
                  <div className="rounded-xl border border-border bg-card p-3.5 space-y-2.5">
                    <span className="font-bold text-foreground text-xs">Applicant Dossier Properties</span>
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                      <div><strong className="text-foreground">College:</strong> {selectedLead.education}</div>
                      <div><strong className="text-foreground">Experience:</strong> {selectedLead.experience}</div>
                      <div><strong className="text-foreground">Skills:</strong> {selectedLead.current_skills || 'None'}</div>
                      <div><strong className="text-foreground">Preferred Mode:</strong> {selectedLead.preferred_mode}</div>
                      <div><strong className="text-foreground">Assigned Counselor:</strong> {selectedLead.counselor_name || 'Unassigned'}</div>
                      <div><strong className="text-foreground">Source:</strong> {selectedLead.source || 'Website'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 2: CALL LOGS & TIMELINE ── */}
              {activeDrawerTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs">Counselor Interaction Log</span>
                    <span className="text-[11px] text-muted-foreground">Auto-timestamped</span>
                  </div>

                  {/* Quick Tag Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Called - Connected',
                      'FDE Assessment Scheduled',
                      'Discussed EMI Financing',
                      'Technical Round Passed',
                      'Lab Visit Scheduled',
                    ].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleAddNote(tag)}
                        className="rounded-lg border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>

                  {/* Timeline Feed */}
                  <div className="rounded-xl border border-border bg-muted/30 p-3 font-mono text-xs whitespace-pre-wrap text-muted-foreground max-h-64 overflow-y-auto">
                    {selectedLead.admin_notes || 'No activity notes logged yet.'}
                  </div>

                  {/* Add Note Input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Type call notes, feedback, or follow-up status..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-tejas-blue"
                    />
                    <button
                      onClick={() => handleAddNote()}
                      className="rounded-xl bg-tejas-blue px-4 py-2 font-bold text-white hover:bg-tejas-blue/90"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {/* ── TAB 3: AI OUTREACH EMAIL ── */}
              {activeDrawerTab === 'outreach' && currentOutreach && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs">AI Personalized Email Outreach</span>
                    <div className="flex items-center gap-1">
                      <select
                        value={outreachTemplate}
                        onChange={(e) => setOutreachTemplate(e.target.value as any)}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs font-semibold focus:outline-hidden"
                      >
                        <option value="FDE_INVITATION">FDE Fellowship Invite</option>
                        <option value="INTERVIEW_SHORTLIST">Technical Interview Shortlist</option>
                        <option value="FELLOWSHIP_OFFER">Formal Admissions Offer</option>
                        <option value="CURRICULUM_DEEPDIVE">Curriculum Follow-up</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div className="rounded-xl border border-border bg-card p-3 space-y-1">
                    <span className="font-semibold text-muted-foreground text-[10px] uppercase">Subject</span>
                    <p className="font-bold text-foreground">{currentOutreach.subject}</p>
                  </div>

                  {/* Body Preview */}
                  <div className="rounded-xl border border-border bg-muted/30 p-3.5 font-sans whitespace-pre-wrap text-foreground leading-relaxed text-xs">
                    {currentOutreach.body}
                  </div>

                  {/* Copy & Email Action Buttons */}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`Subject: ${currentOutreach.subject}\n\n${currentOutreach.body}`);
                        setCopiedOutreach(true);
                        setTimeout(() => setCopiedOutreach(false), 2000);
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 font-semibold text-foreground hover:bg-muted"
                    >
                      {copiedOutreach ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedOutreach ? 'Copied!' : 'Copy Email'}</span>
                    </button>

                    <a
                      href={`mailto:${selectedLead.email}?subject=${encodeURIComponent(currentOutreach.subject)}&body=${encodeURIComponent(currentOutreach.body)}`}
                      className="flex items-center gap-1.5 rounded-xl bg-tejas-blue px-4 py-2 font-bold text-white hover:bg-tejas-blue/90"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Open in Mail Client</span>
                    </a>
                  </div>
                </div>
              )}

              {/* ── TAB 4: TASKS & FOLLOW-UPS ── */}
              {activeDrawerTab === 'tasks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs">Counselor Tasks for {selectedLead.full_name}</span>
                    <span className="text-[11px] text-muted-foreground">Follow-up schedule</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { id: 't1', title: 'Conduct initial technical diagnostic assessment', due: 'Tomorrow 11:00 AM', done: selectedLead.status !== 'NEW' },
                      { id: 't2', title: 'Schedule 1-on-1 interview with Chief Architect', due: 'In 3 days', done: selectedLead.status === 'ENROLLED' || selectedLead.status === 'SHORTLISTED' },
                      { id: 't3', title: 'Send Bhubaneswar campus physical lab pass', due: 'In 5 days', done: selectedLead.status === 'ENROLLED' },
                    ].map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                        <div className="flex items-center gap-2.5">
                          {task.done ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                          )}
                          <div>
                            <div className={`font-semibold ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.title}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{task.due}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.done ? 'bg-emerald-500/10 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                          {task.done ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 5: ADMISSION OFFER DOSSIER ── */}
              {activeDrawerTab === 'admission' && (() => {
                const admission = AdmissionInvoiceService.getAdmissionByApplicationId(selectedLead.id);
                return (
                  <div className="space-y-4">
                    {admission ? (
                      <div className="rounded-2xl border border-amber-500/30 bg-card p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {admission.admission_number}
                          </span>
                          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold text-foreground uppercase">
                            {admission.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div>
                          <div className="text-sm font-bold text-foreground">
                            Roll Number: <span className="font-mono text-tejas-blue">{admission.roll_number}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Batch: {admission.batch_name}
                          </div>
                        </div>

                        {admission.scholarship_percentage > 0 && (
                          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-400 font-semibold flex items-center gap-2">
                            <Award className="h-4 w-4 shrink-0" />
                            <span>{admission.scholarship_title} ({admission.scholarship_percentage}% Waiver)</span>
                          </div>
                        )}

                        <div className="pt-2 flex flex-wrap gap-2 border-t border-border">
                          <button
                            onClick={() => setSelectedAdmissionModal(admission)}
                            className="flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-bold text-foreground transition"
                          >
                            <FileText className="h-3.5 w-3.5 text-amber-400" />
                            <span>View Full Offer Letter</span>
                          </button>

                          <button
                            onClick={() => setIsCreateInvoiceModalOpen(true)}
                            className="flex items-center gap-1.5 rounded-xl border border-tejas-blue/30 bg-tejas-blue/10 hover:bg-tejas-blue/20 px-3 py-1.5 text-xs font-bold text-tejas-blue transition"
                          >
                            <Receipt className="h-3.5 w-3.5" />
                            <span>Generate Invoice</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border p-6 text-center space-y-3">
                        <GraduationCap className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                        <div>
                          <p className="font-bold text-foreground text-sm">No Admission Offer Issued</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Issue a formal provisional admission offer with scholarship waiver and assigned roll number.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const newAdm = AdmissionInvoiceService.issueAdmissionOffer({
                              application: selectedLead,
                              batchId: 'batch-alpha-2026',
                              batchName: 'Batch Alpha 2026 (Bhubaneswar Hub)',
                              scholarshipTitle: 'Merit Fellowship (30%)',
                              scholarshipPercentage: 30,
                            });
                            setSelectedAdmissionModal(newAdm);
                            setRefreshTrigger((v) => v + 1);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Issue Provisional Admission Offer</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── TAB 6: INVOICES & FEES ── */}
              {activeDrawerTab === 'invoices' && (() => {
                const invoices = AdmissionInvoiceService.getInvoicesByApplicationId(selectedLead.id);
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-xs">Fee Invoices for {selectedLead.full_name}</span>
                      <button
                        onClick={() => setIsCreateInvoiceModalOpen(true)}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-xs font-bold transition"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Create Invoice</span>
                      </button>
                    </div>

                    {invoices.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border p-6 text-center space-y-3">
                        <Receipt className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                        <div>
                          <p className="font-bold text-foreground text-sm">No Invoices Found</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Generate a GST-compliant tax invoice (SAC 999293) for seat registration or tuition.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsCreateInvoiceModalOpen(true)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition shadow-sm"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Generate Tax Invoice</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {invoices.map((inv) => (
                          <div
                            key={inv.id}
                            className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-foreground">
                                {inv.invoice_number}
                              </span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                  inv.status === 'PAID'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : inv.status === 'PARTIALLY_PAID'
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {inv.status.replace(/_/g, ' ')}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="text-[10px] text-muted-foreground block">Net Total</span>
                                <span className="font-mono font-bold text-foreground">₹{inv.total_amount_inr.toLocaleString('en-IN')}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-muted-foreground block">Paid</span>
                                <span className="font-mono font-bold text-emerald-400">₹{inv.amount_paid_inr.toLocaleString('en-IN')}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-muted-foreground block">Balance</span>
                                <span className="font-mono font-bold text-rose-400">₹{inv.balance_due_inr.toLocaleString('en-IN')}</span>
                              </div>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                              <button
                                onClick={() => setSelectedPrintInvoiceModal(inv)}
                                className="inline-flex items-center gap-1 rounded-lg border border-border bg-background hover:bg-muted px-2.5 py-1 text-xs font-bold text-foreground transition"
                              >
                                <Printer className="h-3 w-3 text-tejas-blue" />
                                <span>View / Print</span>
                              </button>

                              {inv.status !== 'PAID' && (
                                <button
                                  onClick={() => setSelectedPaymentInvoiceModal(inv)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-xs font-bold transition shadow-xs"
                                >
                                  <CreditCard className="h-3 w-3" />
                                  <span>Record Payment</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>

          </div>
        </div>
      )}

      {/* ── MODAL 1: AI RESUME & APPLICANT PARSER MODAL ── */}
      {isAiParserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsAiParserOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-tejas-blue" />
              <div>
                <h2 className="text-lg font-bold text-foreground font-display">Twenty AI Resume &amp; Inquiry Parser</h2>
                <p className="text-xs text-muted-foreground">Paste raw text from a candidate resume, LinkedIn snippet, or email inquiry.</p>
              </div>
            </div>

            <textarea
              rows={6}
              placeholder="e.g. Ananya Dash, B.Tech CSE KIIT 2025. Phone: +91 94370 12345. Email: ananya@gmail.com. Experience: 1 year backend engineer with Python, Docker, FastAPI, and Kubernetes. Interested in Forward Deployment Engineering..."
              value={rawResumeText}
              onChange={(e) => setRawResumeText(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-tejas-blue font-mono"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-muted-foreground">AI will extract contact, college, skills, target track, and compute initial fit score.</span>
              <button
                disabled={isParsingAi || !rawResumeText.trim()}
                onClick={handleParseResume}
                className="flex items-center gap-1.5 rounded-xl bg-tejas-blue px-4 py-2 font-bold text-white hover:bg-tejas-blue/90 disabled:opacity-50"
              >
                {isParsingAi ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>{isParsingAi ? 'Parsing...' : 'Extract & Add Lead'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: MANUAL CANDIDATE ENTRY MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold text-foreground font-display">Add Candidate Dossier</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Record a walk-in inquiry or direct candidate application into Twenty CRM.</p>

            <form onSubmit={handleCreateManualLead} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sweta Mohanty"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-hidden focus:border-tejas-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sweta@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-hidden focus:border-tejas-blue"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-hidden focus:border-tejas-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Target Track</label>
                  <select
                    value={formData.program_id}
                    onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-hidden"
                  >
                    <option value="prog-fde">FDE Fellowship</option>
                    <option value="prog-01">AI &amp; Generative AI</option>
                    <option value="prog-02">Agentic AI Systems</option>
                    <option value="prog-05">Kubernetes &amp; Cloud</option>
                    <option value="prog-09">VLSI RTL Design</option>
                    <option value="prog-13">EV Battery &amp; BMS</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Bhubaneswar / Cuttack"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Education Background &amp; College</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science, KIIT Bhubaneswar 2025"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Counselor Initial Notes</label>
                <textarea
                  rows={2}
                  placeholder="Aptitude rating, communication, technical experience..."
                  value={formData.admin_notes}
                  onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-tejas-blue px-5 py-2 font-bold text-white shadow-md hover:bg-tejas-blue/90"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: ADMISSION OFFER LETTER MODAL ── */}
      <AdmissionOfferModal
        admission={selectedAdmissionModal}
        onClose={() => setSelectedAdmissionModal(null)}
        onAcceptOffer={(admId) => {
          AdmissionInvoiceService.updateAdmissionStatus(admId, 'OFFER_ACCEPTED', { terms_accepted: true });
          setRefreshTrigger((v) => v + 1);
        }}
        onGenerateInvoiceClick={() => {
          setSelectedAdmissionModal(null);
          setIsCreateInvoiceModalOpen(true);
        }}
      />

      {/* ── MODAL 4: PRINTABLE GST TAX INVOICE MODAL ── */}
      <PrintableInvoiceModal
        invoice={selectedPrintInvoiceModal}
        onClose={() => setSelectedPrintInvoiceModal(null)}
        onRecordPaymentClick={(inv) => {
          setSelectedPrintInvoiceModal(null);
          setSelectedPaymentInvoiceModal(inv);
        }}
      />

      {/* ── MODAL 5: RECORD PAYMENT MODAL ── */}
      <RecordPaymentModal
        invoice={selectedPaymentInvoiceModal}
        onClose={() => setSelectedPaymentInvoiceModal(null)}
        onPaymentSuccess={() => setRefreshTrigger((v) => v + 1)}
      />

      {/* ── MODAL 6: CREATE TAX INVOICE MODAL ── */}
      {isCreateInvoiceModalOpen && (
        <CreateInvoiceModal
          initialApplication={selectedLead}
          applications={applications}
          onClose={() => setIsCreateInvoiceModalOpen(false)}
          onInvoiceCreated={() => setRefreshTrigger((v) => v + 1)}
        />
      )}

    </div>
  );
}

function HelpCircleIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
