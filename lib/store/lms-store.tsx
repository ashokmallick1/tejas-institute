'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Enrollment,
  LessonProgress,
  Assignment,
  AssignmentSubmission,
  StudentProject,
  AttendanceRecord,
  StudentApplication,
  AnnouncementItem,
  Certificate,
} from '@/types';
import {
  SAMPLE_ENROLLMENTS,
  SAMPLE_ATTENDANCE,
  SAMPLE_ASSIGNMENTS,
  SAMPLE_SUBMISSIONS,
  SAMPLE_PROJECTS,
  SAMPLE_CERTIFICATE,
  SAMPLE_APPLICATIONS,
  SAMPLE_ANNOUNCEMENTS,
} from '@/lib/data/mock-store';
import { CrmAiEngine } from '@/lib/crm/ai-engine';

interface LmsContextType {
  enrollments: Enrollment[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  projects: StudentProject[];
  attendance: AttendanceRecord[];
  applications: StudentApplication[];
  announcements: AnnouncementItem[];
  certificates: Certificate[];
  lessonProgress: Record<string, { isCompleted: boolean; watchedSeconds: number; totalSeconds: number }>;
  markLessonComplete: (studentId: string, lessonId: string) => void;
  updateVideoProgress: (studentId: string, lessonId: string, watchedSeconds: number, totalSeconds: number) => void;
  submitAssignment: (sub: Omit<AssignmentSubmission, 'id' | 'submitted_at' | 'status'>) => void;
  reviewSubmission: (submissionId: string, score: number, feedback: string, status: AssignmentSubmission['status']) => void;
  submitApplication: (app: Omit<StudentApplication, 'id' | 'created_at' | 'status'>) => string;
  updateApplicationStatus: (appId: string, status: StudentApplication['status'], notes?: string) => void;
  updateApplication: (appId: string, partial: Partial<StudentApplication>) => void;
  addApplication: (lead: StudentApplication) => void;
  deleteApplication: (appId: string) => void;
  enrollLeadAsStudent: (leadId: string, batchId?: string) => void;
  updateProjectStatus: (projectId: string, status: StudentProject['status'], feedback?: string) => void;
  recordAttendance: (batchId: string, studentId: string, date: string, status: AttendanceRecord['status'], remarks?: string) => void;
  getStudentAttendanceStats: (studentId: string) => { total: number; present: number; percentage: number };
}

const LmsContext = createContext<LmsContextType | null>(null);

export function LmsProvider({ children }: { children: React.ReactNode }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tejas_lms_enrollments');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return SAMPLE_ENROLLMENTS;
  });
  const [assignments] = useState<Assignment[]>(SAMPLE_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(SAMPLE_SUBMISSIONS);
  const [projects, setProjects] = useState<StudentProject[]>(SAMPLE_PROJECTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(SAMPLE_ATTENDANCE);
  const [applications, setApplications] = useState<StudentApplication[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tejas_crm_applications');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return SAMPLE_APPLICATIONS;
  });
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(SAMPLE_ANNOUNCEMENTS);
  const [certificates, setCertificates] = useState<Certificate[]>([SAMPLE_CERTIFICATE]);


  const [lessonProgress, setLessonProgress] = useState<Record<string, { isCompleted: boolean; watchedSeconds: number; totalSeconds: number }>>({
    'user-student-01_les-01': { isCompleted: true, watchedSeconds: 1680, totalSeconds: 1680 },
    'user-student-01_les-02': { isCompleted: true, watchedSeconds: 2520, totalSeconds: 2520 },
  });

  const markLessonComplete = (studentId: string, lessonId: string) => {
    const key = `${studentId}_${lessonId}`;
    setLessonProgress(prev => ({
      ...prev,
      [key]: {
        isCompleted: true,
        watchedSeconds: prev[key]?.totalSeconds || 100,
        totalSeconds: prev[key]?.totalSeconds || 100,
      },
    }));

    // Update student enrollment progress
    setEnrollments(prev =>
      prev.map(enr => {
        if (enr.student_id === studentId) {
          const newPct = Math.min(100, enr.progress_percentage + 4.5);
          return { ...enr, progress_percentage: Number(newPct.toFixed(1)) };
        }
        return enr;
      })
    );
  };

  const updateVideoProgress = (studentId: string, lessonId: string, watchedSeconds: number, totalSeconds: number) => {
    const key = `${studentId}_${lessonId}`;
    const watchedPct = totalSeconds > 0 ? (watchedSeconds / totalSeconds) * 100 : 0;
    const isCompleted = watchedPct >= 80;

    setLessonProgress(prev => ({
      ...prev,
      [key]: {
        isCompleted: prev[key]?.isCompleted || isCompleted,
        watchedSeconds,
        totalSeconds,
      },
    }));

    if (isCompleted && !lessonProgress[key]?.isCompleted) {
      markLessonComplete(studentId, lessonId);
    }
  };

  const submitAssignment = (sub: Omit<AssignmentSubmission, 'id' | 'submitted_at' | 'status'>) => {
    const newSubmission: AssignmentSubmission = {
      ...sub,
      id: `sub_${Date.now()}`,
      submitted_at: new Date().toISOString(),
      status: 'SUBMITTED',
    };
    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const reviewSubmission = (
    submissionId: string,
    score: number,
    feedback: string,
    status: AssignmentSubmission['status']
  ) => {
    setSubmissions(prev =>
      prev.map(s => {
        if (s.id === submissionId) {
          return {
            ...s,
            score,
            feedback,
            status,
            reviewed_at: new Date().toISOString(),
          };
        }
        return s;
      })
    );
  };

  const submitApplication = (app: Omit<StudentApplication, 'id' | 'created_at' | 'status'>) => {
    const newId = `app_${Date.now()}`;
    const baseLead: StudentApplication = {
      ...app,
      id: newId,
      status: 'NEW',
      created_at: new Date().toISOString(),
      counselor_name: 'Priyanka Rout',
      source: 'WEBSITE',
    };

    // Auto-evaluate with Twenty CRM AI Copilot
    const analysis = CrmAiEngine.analyzeLead(baseLead);
    const enrichedLead: StudentApplication = {
      ...baseLead,
      ai_score: analysis.score,
      ai_summary: analysis.summary,
      ai_recommendation: analysis.fellowshipRecommendation,
      sentiment: analysis.sentiment,
    };

    setApplications(prev => {
      const updated = [enrichedLead, ...prev];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('tejas_crm_applications', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

    return newId;
  };

  const updateApplicationStatus = (appId: string, status: StudentApplication['status'], notes?: string) => {
    setApplications(prev => {
      const updated = prev.map(a =>
        a.id === appId
          ? {
              ...a,
              status,
              admin_notes: notes !== undefined ? notes : a.admin_notes,
            }
          : a
      );
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('tejas_crm_applications', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const updateApplication = (appId: string, partial: Partial<StudentApplication>) => {
    setApplications(prev => {
      const updated = prev.map(a => (a.id === appId ? { ...a, ...partial } : a));
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('tejas_crm_applications', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const addApplication = (lead: StudentApplication) => {
    setApplications(prev => {
      const updated = [lead, ...prev];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('tejas_crm_applications', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const deleteApplication = (appId: string) => {
    setApplications(prev => {
      const updated = prev.filter(a => a.id !== appId);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('tejas_crm_applications', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const enrollLeadAsStudent = (leadId: string, batchId?: string) => {
    const lead = applications.find(a => a.id === leadId);
    if (!lead) return;

    // 1. Mark status as ENROLLED
    updateApplicationStatus(leadId, 'ENROLLED', `${lead.admin_notes || ''}\n[${new Date().toLocaleDateString('en-IN')}] Confirmed enrollment & provisioned LMS Fellow Access.`);

    // 2. Provision active student enrollment in LMS
    const newEnrollment: Enrollment = {
      id: `enr_${Date.now()}`,
      student_id: lead.id,
      program_id: lead.program_id,
      batch_id: batchId || 'batch-alpha-2026',
      status: 'ACTIVE',
      progress_percentage: 0,
      enrolled_at: new Date().toISOString(),
    };

    setEnrollments(prev => {
      const exists = prev.some(e => e.student_id === lead.id && e.program_id === lead.program_id);
      if (exists) return prev;
      const updated = [newEnrollment, ...prev];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('tejas_lms_enrollments', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const updateProjectStatus = (projectId: string, status: StudentProject['status'], feedback?: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, status, mentor_feedback: feedback !== undefined ? feedback : p.mentor_feedback }
          : p
      )
    );
  };

  const recordAttendance = (
    batchId: string,
    studentId: string,
    date: string,
    status: AttendanceRecord['status'],
    remarks?: string
  ) => {
    setAttendance(prev => {
      const existingIdx = prev.findIndex(a => a.batch_id === batchId && a.student_id === studentId && a.session_date === date);
      const record: AttendanceRecord = {
        id: `att_${Date.now()}`,
        batch_id: batchId,
        student_id: studentId,
        session_date: date,
        status,
        remarks,
      };
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = record;
        return next;
      }
      return [...prev, record];
    });
  };

  const getStudentAttendanceStats = (studentId: string) => {
    const records = attendance.filter(a => a.student_id === studentId);
    const total = records.length;
    if (total === 0) return { total: 0, present: 0, percentage: 100 };
    const presentCount = records.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const percentage = Number(((presentCount / total) * 100).toFixed(1));
    return { total, present: presentCount, percentage };
  };

  return (
    <LmsContext.Provider
      value={{
        enrollments,
        assignments,
        submissions,
        projects,
        attendance,
        applications,
        announcements,
        certificates,
        lessonProgress,
        markLessonComplete,
        updateVideoProgress,
        submitAssignment,
        reviewSubmission,
        submitApplication,
        updateApplicationStatus,
        updateApplication,
        addApplication,
        deleteApplication,
        enrollLeadAsStudent,
        updateProjectStatus,
        recordAttendance,
        getStudentAttendanceStats,
      }}
    >
      {children}
    </LmsContext.Provider>
  );
}

export function useLms() {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error('useLms must be used within an LmsProvider');
  }
  return context;
}
