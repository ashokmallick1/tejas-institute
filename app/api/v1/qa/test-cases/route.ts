import { NextRequest } from 'next/server';
import { jsonResponse, handleOptions } from '@/app/api/v1/cors';
import { DEFAULT_QA_TEST_CASES, QaService } from '@/lib/qa/qa-service';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');

    let cases = DEFAULT_QA_TEST_CASES;

    if (category && category !== 'ALL') {
      cases = cases.filter((c) => c.category === category);
    }
    if (priority && priority !== 'ALL') {
      cases = cases.filter((c) => c.priority === priority);
    }

    return jsonResponse({
      success: true,
      count: cases.length,
      test_cases: cases,
    });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
