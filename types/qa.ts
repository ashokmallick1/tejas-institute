export type TestPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type TestStatus = 'passed' | 'failed' | 'retest' | 'blocked' | 'pending';

export type RunMode = 'manual' | 'automated';

export type QaActionType =
  | 'login'
  | 'logout'
  | 'page_view'
  | 'test_execute'
  | 'observation_save'
  | 'screenshot_upload'
  | 'suite_trigger';

export interface QaTestCase {
  id: string;
  test_id: string; // e.g. "TC01", "TC02"
  title: string;
  category: string; // e.g. "Authentication", "Admissions", "LMS", "CRM", "Mobile"
  module: string;
  description: string;
  steps: string[]; // Ordered step-by-step instructions
  expected_result: string;
  priority: TestPriority;
  is_automated: boolean;
  automated_tag?: string; // e.g. "@TC01"
  target_url?: string;
  created_at: string;
}

export interface QaTestResult {
  id: string;
  test_case_id: string;
  test_id?: string;
  test_title?: string;
  tester_id?: string;
  tester_email: string;
  tester_name: string;
  status: TestStatus;
  cycle_date: string; // "YYYY-MM-DD"
  observations?: string;
  screenshot_url?: string;
  run_mode: RunMode;
  device_info?: string; // e.g. "Desktop Chrome 1440x900", "Pixel 7 (Android)"
  duration_ms?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface QaTesterActivityLog {
  id: string;
  tester_id?: string;
  tester_email: string;
  tester_name?: string;
  action_type: QaActionType;
  metadata: {
    route?: string;
    test_id?: string;
    test_title?: string;
    status?: TestStatus;
    observations?: string;
    screenshot_name?: string;
    duration_ms?: number;
    error_message?: string;
    user_agent?: string;
    viewport?: string;
    device?: string;
    [key: string]: any;
  };
  created_at: string;
}

export interface QaCycleSummary {
  cycle_date: string;
  total_tests: number;
  passed: number;
  failed: number;
  retest: number;
  blocked: number;
  pending: number;
  pass_percentage: number;
  fail_percentage: number;
}
