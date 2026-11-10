import { NextRequest } from 'next/server';
import { jsonResponse, handleOptions } from '@/app/api/v1/cors';
import { SAMPLE_APPLICATIONS } from '@/lib/data/mock-store';
import { StudentApplication } from '@/types';

// In-memory store fallback for development
let memoryLeads: StudentApplication[] = [...SAMPLE_APPLICATIONS];

export async function OPTIONS() {
  return handleOptions();
}

/**
 * GET /api/v1/crm/leads
 * Mobile & CRM Subdomain Lead Pipeline API
 * Query params: status, q, program_id
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const statusFilter = searchParams.get('status');
  const query = searchParams.get('q')?.toLowerCase();

  let leads = [...memoryLeads];

  if (statusFilter && statusFilter !== 'ALL') {
    leads = leads.filter(l => l.status === statusFilter);
  }

  if (query) {
    leads = leads.filter(
      l =>
        l.full_name.toLowerCase().includes(query) ||
        l.email.toLowerCase().includes(query) ||
        l.phone.toLowerCase().includes(query) ||
        l.city?.toLowerCase().includes(query)
    );
  }

  // Pipeline metrics
  const stats = {
    total: memoryLeads.length,
    new: memoryLeads.filter(l => l.status === 'NEW').length,
    contacted: memoryLeads.filter(l => l.status === 'CONTACTED').length,
    counselling: memoryLeads.filter(l => l.status === 'COUNSELLING').length,
    shortlisted: memoryLeads.filter(l => l.status === 'SHORTLISTED').length,
    enrolled: memoryLeads.filter(l => l.status === 'ENROLLED').length,
    rejected: memoryLeads.filter(l => l.status === 'REJECTED').length,
  };

  return jsonResponse({
    success: true,
    stats,
    count: leads.length,
    leads,
  });
}

/**
 * POST /api/v1/crm/leads
 * Lead capture endpoint (Admissions form, Mobile App, Counselor quick-add)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.full_name || !body.email || !body.phone) {
      return jsonResponse({ error: 'Name, email, and phone are mandatory' }, 400);
    }

    const newLead: StudentApplication = {
      id: `app-${Date.now()}`,
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      education: body.education || 'Graduate',
      experience: body.experience || 'Fresher / Student',
      program_id: body.program_id || 'prog-fde',
      program_title: body.program_title || 'Forward Deployment Engineer (FDE) Fellowship',
      current_skills: body.current_skills || '',
      career_goal: body.career_goal || '',
      preferred_mode: body.preferred_mode || 'HYBRID_BHUBANESWAR',
      city: body.city || 'Bhubaneswar',
      status: body.status || 'NEW',
      admin_notes: body.admin_notes || 'Captured via CRM API',
      created_at: new Date().toISOString(),
    };

    memoryLeads.unshift(newLead);

    return jsonResponse(
      {
        success: true,
        message: 'Lead created successfully',
        lead: newLead,
      },
      201
    );
  } catch (error: any) {
    return jsonResponse({ error: error.message || 'Failed to process lead' }, 500);
  }
}
