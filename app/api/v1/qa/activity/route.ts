import { NextRequest } from 'next/server';
import { jsonResponse, handleOptions } from '@/app/api/v1/cors';
import { QaService } from '@/lib/qa/qa-service';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const actionType = searchParams.get('action_type');
    const testerEmail = searchParams.get('tester_email');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    let logs = QaService.getActivityLogs(limit);

    if (actionType && actionType !== 'ALL') {
      logs = logs.filter((l) => l.action_type === actionType);
    }
    if (testerEmail && testerEmail !== 'ALL') {
      logs = logs.filter((l) => l.tester_email === testerEmail);
    }

    return jsonResponse({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action_type, metadata = {}, tester_email, tester_name } = body;

    if (!action_type) {
      return jsonResponse({ success: false, error: 'action_type required' }, 400);
    }

    const log = QaService.logActivity(
      action_type,
      metadata,
      { email: tester_email, name: tester_name }
    );

    return jsonResponse({
      success: true,
      message: 'Tester activity log captured.',
      log,
    }, 201);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
