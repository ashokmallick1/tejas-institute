import { NextRequest } from 'next/server';
import { jsonResponse, handleOptions } from '@/app/api/v1/cors';
import { SAMPLE_APPLICATIONS } from '@/lib/data/mock-store';

export async function OPTIONS() {
  return handleOptions();
}

/**
 * PATCH /api/v1/crm/leads/[id]
 * Updates lead pipeline status, notes, or counselor assignment.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const leadIndex = SAMPLE_APPLICATIONS.findIndex(l => l.id === id);
    if (leadIndex === -1 && !id.startsWith('app-')) {
      return jsonResponse({ error: 'Lead not found' }, 404);
    }

    const updatedLead = {
      ...(SAMPLE_APPLICATIONS[leadIndex] || { id }),
      ...body,
      updated_at: new Date().toISOString(),
    };

    if (leadIndex !== -1) {
      SAMPLE_APPLICATIONS[leadIndex] = updatedLead;
    }

    return jsonResponse({
      success: true,
      message: 'Lead updated successfully',
      lead: updatedLead,
    });
  } catch (error: any) {
    return jsonResponse({ error: error.message || 'Failed to update lead' }, 500);
  }
}
