import { NextRequest } from 'next/server';
import { jsonResponse, handleOptions } from '@/app/api/v1/cors';
import { CrmAiEngine } from '@/lib/crm/ai-engine';

export async function OPTIONS() {
  return handleOptions();
}

/**
 * POST /api/v1/crm/ai
 * Twenty-style AI Copilot Endpoint for Lead Scoring, Outreach & Profile Extraction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, lead, rawText, template } = body;

    switch (action) {
      case 'ANALYZE_LEAD': {
        if (!lead) return jsonResponse({ error: 'Lead object required' }, 400);
        const analysis = CrmAiEngine.analyzeLead(lead);
        return jsonResponse({ success: true, analysis });
      }

      case 'GENERATE_OUTREACH': {
        if (!lead) return jsonResponse({ error: 'Lead object required' }, 400);
        const outreach = CrmAiEngine.generateOutreach(lead, template || 'FDE_INVITATION');
        return jsonResponse({ success: true, outreach });
      }

      case 'PARSE_RESUME': {
        if (!rawText) return jsonResponse({ error: 'rawText required' }, 400);
        const extracted = CrmAiEngine.parseResumeText(rawText);
        return jsonResponse({ success: true, profile: extracted });
      }

      default:
        return jsonResponse({ error: 'Invalid action. Supported: ANALYZE_LEAD, GENERATE_OUTREACH, PARSE_RESUME' }, 400);
    }
  } catch (error: any) {
    return jsonResponse({ error: error.message || 'AI Copilot processing failed' }, 500);
  }
}
