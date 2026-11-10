import { NextRequest } from 'next/server';
import { jsonResponse, handleOptions } from '@/app/api/v1/cors';
import {
  SAMPLE_ENROLLMENTS,
  SAMPLE_COURSES,
  SAMPLE_ATTENDANCE,
  SAMPLE_ASSIGNMENTS,
  SAMPLE_PROJECTS,
  DEMO_PROFILES,
} from '@/lib/data/mock-store';

export async function OPTIONS() {
  return handleOptions();
}

/**
 * GET /api/v1/student/dashboard
 * Mobile Student Dashboard overview: active courses, progress, attendance, pending tasks.
 */
export async function GET(request: NextRequest) {
  const profile = DEMO_PROFILES.student;
  const activeEnrollment = SAMPLE_ENROLLMENTS[0];
  const activeCourse = SAMPLE_COURSES[0];

  // Calculate metrics
  const totalAttendance = SAMPLE_ATTENDANCE.length;
  const presentCount = SAMPLE_ATTENDANCE.filter(a => a.status === 'PRESENT').length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 100;

  return jsonResponse({
    student: {
      id: profile.id,
      name: profile.full_name,
      headline: profile.headline,
      avatar_url: profile.avatar_url,
    },
    metrics: {
      progress_pct: activeEnrollment?.progress_percentage || 74,
      attendance_pct: attendanceRate,
      completed_classes: 27,
      total_classes: 36,
      assignments_pending: 1,
      capstone_status: 'BUILDING',
    },
    current_course: {
      id: activeCourse?.id,
      title: activeCourse?.title,
      modules: activeCourse?.modules?.map(m => ({
        id: m.id,
        title: m.title,
        order_idx: m.order_idx,
        lessons_count: m.lessons?.length || 0,
        completed: m.order_idx <= 2,
      })),
    },
    upcoming_lab_sessions: [
      {
        id: 'session-104',
        title: 'H100 GPU Cluster Slurm Multi-Node Fine-Tuning Bench',
        date: '2026-10-04T10:00:00+05:30',
        venue: 'Hardware Lab 3, Bhubaneswar Campus',
        mode: 'IN_PERSON',
      },
      {
        id: 'session-105',
        title: 'Mentor 1-on-1 Pull Request Architectural Review',
        date: '2026-10-06T15:00:00+05:30',
        venue: 'Virtual Studio Room 2',
        mode: 'ONLINE',
      },
    ],
  });
}
