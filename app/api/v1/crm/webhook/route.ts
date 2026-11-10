import { NextRequest, NextResponse } from 'next/server';
import { CrmAiEngine } from '@/lib/crm/ai-engine';
import { StudentApplication, LeadSource } from '@/types';
import { PROGRAMS } from '@/lib/data/programs';

/**
 * Future-Proof Inbound Lead Ingestion Webhook
 * 
 * Supports webhook ingestion from:
 * - Meta Lead Ads / Instagram Lead Forms
 * - Google Ads Lead Form extensions
 * - WhatsApp Business API bots
 * - Offline Campus Hackathon & Drive QR registrations
 * - Zapier, Make.com, or custom admissions landing pages
 */

// Simple in-memory rate limit map (Swap with Upstash/Redis in production)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip) || { count: 0, timestamp: now };
    
    if (now - clientRecord.timestamp > RATE_LIMIT_WINDOW) {
      clientRecord.count = 1;
      clientRecord.timestamp = now;
    } else {
      clientRecord.count++;
      if (clientRecord.count > MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json({ success: false, error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
      }
    }
    rateLimitMap.set(ip, clientRecord);

    const body = await request.json();

    const {
      full_name,
      email,
      phone,
      education = 'Graduate / B.Tech',
      experience = 'Fresher',
      program_id = 'prog-fde',
      city = 'Bhubaneswar',
      career_goal = '',
      current_skills = 'Python, Git, Problem Solving',
      preferred_mode = 'IN_PERSON_BHUBANESWAR',
      source = 'DIRECT_INQUIRY',
      secret_key,
    } = body;

    if (!full_name || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required lead parameters. Required: full_name, email, phone.',
        },
        { status: 400 }
      );
    }

    const matchedProgram = PROGRAMS.find((p) => p.id === program_id || p.slug === program_id) || PROGRAMS[0];

    const newLead: StudentApplication = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      education: education.trim(),
      experience: experience.trim(),
      program_id: matchedProgram.id,
      program_title: matchedProgram.title,
      current_skills: current_skills.trim(),
      career_goal: career_goal.trim(),
      preferred_mode: preferred_mode as any,
      city: city.trim(),
      status: 'NEW',
      admin_notes: `Ingested via Webhook [Source: ${source}]. Ingestion timestamp: ${new Date().toISOString()}`,
      created_at: new Date().toISOString(),
      deal_value_inr: matchedProgram.fee_inr || 95000,
      counselor_name: 'Priyanka Rout',
      source: (source as LeadSource) || 'DIRECT_INQUIRY',
    };

    // Run AI Evaluation Pipeline
    const aiAnalysis = CrmAiEngine.analyzeLead(newLead);
    newLead.ai_score = aiAnalysis.score;
    newLead.ai_summary = aiAnalysis.summary;
    newLead.ai_recommendation = aiAnalysis.fellowshipRecommendation;
    newLead.sentiment = aiAnalysis.sentiment;

    // Output structured JSON response
    return NextResponse.json(
      {
        success: true,
        message: 'Lead received and processed through TEJAS AI Scoring Pipeline.',
        lead: newLead,
        ai_evaluation: {
          score: aiAnalysis.score,
          sentiment: aiAnalysis.sentiment,
          grade: aiAnalysis.grade,
          recommended_track: aiAnalysis.recommendedTrack,
          recommendation: aiAnalysis.fellowshipRecommendation,
          summary: aiAnalysis.summary,
        },
        webhook_status: 'QUEUED_FOR_COUNSELLOR_TRIAGE',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process lead webhook',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET Documentation endpoint for Webhook Integrators
 */
export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    service: 'TEJAS Admissions Twenty-Grade CRM Ingestion Webhook',
    endpoint: '/api/v1/crm/webhook',
    supported_methods: ['POST'],
    supported_sources: [
      'META_ADS',
      'GOOGLE_ADS',
      'WHATSAPP_BOT',
      'CAMPUS_DRIVE',
      'WEBSITE',
      'LINKEDIN',
      'REFERRAL',
      'DIRECT_INQUIRY',
    ],
    sample_payload: {
      full_name: 'Debasis Sahoo',
      email: 'debasis@example.com',
      phone: '+91 94371 99999',
      education: 'B.Tech Computer Science 2026',
      experience: 'Fresher with Python & Linux project experience',
      program_id: 'prog-fde',
      city: 'Bhubaneswar',
      career_goal: 'Aiming for deployment role in high-growth AI companies',
      source: 'CAMPUS_DRIVE',
    },
    headers_required: {
      'Content-Type': 'application/json',
    },
  });
}
