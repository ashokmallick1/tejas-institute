import { NextRequest } from 'next/server';
import { jsonResponse, handleOptions } from '@/app/api/v1/cors';
import { QaService, getTodayDateString, DEFAULT_QA_TEST_CASES } from '@/lib/qa/qa-service';
import { QaTestResult } from '@/types/qa';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cycleDate = searchParams.get('cycle_date') || getTodayDateString();
    const testId = searchParams.get('test_id');

    let results = QaService.getTestResults(cycleDate);

    if (testId) {
      results = results.filter((r) => r.test_id === testId || r.test_case_id === testId);
    }

    const summary = QaService.getCycleSummary(cycleDate);

    return jsonResponse({
      success: true,
      cycle_date: cycleDate,
      summary,
      count: results.length,
      results,
    });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      test_id,
      test_case_id,
      tester_email = 'qa.lead@tejas.ac.in',
      tester_name = 'Playwright Automation',
      status = 'passed',
      cycle_date = getTodayDateString(),
      observations,
      screenshot_url,
      run_mode = 'automated',
      device_info,
      duration_ms = 0,
      error_message,
    } = body;

    if (!test_id && !test_case_id) {
      return jsonResponse({ success: false, error: 'test_id or test_case_id required' }, 400);
    }

    // Match test case by test_id (e.g. TC01) if test_case_id not given
    const matchedCase = DEFAULT_QA_TEST_CASES.find(
      (tc) => tc.test_id === test_id || tc.id === test_case_id
    );

    const savedResult = QaService.saveTestResult({
      test_case_id: matchedCase?.id || test_case_id || `case-${test_id}`,
      test_id: test_id || matchedCase?.test_id,
      test_title: matchedCase?.title,
      tester_email,
      tester_name,
      status,
      cycle_date,
      observations,
      screenshot_url,
      run_mode,
      device_info,
      duration_ms,
      error_message,
    });

    return jsonResponse({
      success: true,
      message: 'Test result logged and synchronized successfully.',
      result: savedResult,
    }, 201);
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
