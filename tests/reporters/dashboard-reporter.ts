import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

/**
 * Custom Playwright Reporter for TEJAS QA Command Center
 * 
 * Intercepts automated test outcomes and persists status, duration,
 * and error messages directly into the centralized QA Database & Dashboard.
 */
class DashboardReporter implements Reporter {
  private baseUrl: string = process.env.BASE_URL || 'http://localhost:3004';
  private apiUrl: string = `${process.env.BASE_URL || 'http://localhost:3004'}/api/v1/qa/results`;
  private activityUrl: string = `${process.env.BASE_URL || 'http://localhost:3004'}/api/v1/qa/activity`;
  private executedCount: number = 0;
  private passedCount: number = 0;
  private failedCount: number = 0;

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`\n============================================================`);
    console.log(`[TEJAS QA Reporter] Initializing automated multi-device run...`);
    console.log(`[TEJAS QA Reporter] Target API: ${this.apiUrl}`);
    console.log(`============================================================\n`);
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    this.executedCount++;

    // Extract @TCxx tag from test title (e.g. "@TC01", "@TC_PUB_01", "@TC_GEO_01")
    const fullTitle = test.titlePath().join(' > ');
    const tagMatch = fullTitle.match(/@(TC[A-Z0-9_]+)/i) || test.title.match(/@(TC[A-Z0-9_]+)/i);
    const testId = tagMatch ? tagMatch[1].toUpperCase() : null;

    const projectName = test.parent.project()?.name || 'Desktop Chrome';
    const isPassed = result.status === 'passed';

    if (isPassed) {
      this.passedCount++;
    } else {
      this.failedCount++;
    }

    const payload = {
      test_id: testId,
      tester_name: `Playwright Runner (${projectName})`,
      tester_email: 'playwright-runner@tejas.ac.in',
      status: isPassed ? 'passed' : 'failed',
      cycle_date: new Date().toISOString().slice(0, 10),
      run_mode: 'automated',
      device_info: projectName,
      duration_ms: Math.round(result.duration),
      observations: isPassed
        ? `[Automated E2E] All locators & assertions passed in ${Math.round(result.duration)}ms on ${projectName}.`
        : `[Automated E2E Regression] Test failed on ${projectName}. Error: ${result.error?.message?.slice(0, 200)}`,
      error_message: result.error?.message,
    };

    console.log(
      `[QA Reporter] ${isPassed ? '✓ PASS' : '✗ FAIL'} ${testId || 'NO-TAG'} - ${test.title} (${Math.round(result.duration)}ms) [${projectName}]`
    );

    // Sync to TEJAS QA API endpoint asynchronously
    if (testId) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          // Fallback or non-blocking warning
        }
      } catch (err: any) {
        // Non-blocking if Next.js dev server is compiling
      }
    }
  }

  async onEnd(result: FullResult) {
    console.log(`\n============================================================`);
    console.log(`[TEJAS QA Reporter] Run Complete.`);
    console.log(`[TEJAS QA Reporter] Total Executed: ${this.executedCount} | Passed: ${this.passedCount} | Failed: ${this.failedCount}`);
    console.log(`[TEJAS QA Reporter] Results synchronized to /test-data & /tester-activity.`);
    console.log(`============================================================\n`);

    // Log suite completion event to Activity Monitor
    try {
      await fetch(this.activityUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: 'suite_trigger',
          tester_name: 'Playwright Automated Suite',
          tester_email: 'playwright-runner@tejas.ac.in',
          metadata: {
            total_executed: this.executedCount,
            passed: this.passedCount,
            failed: this.failedCount,
            status: result.status,
          },
        }),
      });
    } catch {}
  }
}

export default DashboardReporter;
