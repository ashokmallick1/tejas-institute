import {
  QaTestCase,
  QaTestResult,
  QaTesterActivityLog,
  QaCycleSummary,
  TestStatus,
  QaActionType,
} from '@/types/qa';

export const DEFAULT_QA_TEST_CASES: QaTestCase[] = [
  {
    id: 'case-tc01',
    test_id: 'TC01',
    title: 'Public Homepage & Hero Brand CTA Verification',
    category: 'Public Portal',
    module: 'Marketing Web',
    description: 'Verify homepage renders TEJAS header, navigation bar, hero headline, and Explore Programs button without hydration errors.',
    steps: [
      '1. Navigate to /',
      '2. Verify TEJAS Institute brand logo renders with high-resolution clarity',
      '3. Check navigation items: Programs, Whitepapers, Projects, Admissions',
      '4. Click Explore Programs button and verify smooth scroll or route transition'
    ],
    expected_result: 'Hero renders in under 1.5s with zero console errors and accessible CTA links.',
    priority: 'Critical',
    is_automated: true,
    automated_tag: '@TC01',
    target_url: '/',
    created_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'case-tc02',
    test_id: 'TC02',
    title: 'Interactive Engineering Terminal Command Execution',
    category: 'Public Portal',
    module: 'Interactive Tools',
    description: 'Ensure the embedded terminal on homepage executes simulated deep-tech commands (e.g. tejas build, docker run, vllm serve).',
    steps: [
      '1. Scroll down to Interactive Terminal section',
      '2. Click terminal input or click command suggestion pill',
      '3. Execute help and observe simulated stdout stream',
      '4. Execute clear and verify terminal state reset'
    ],
    expected_result: 'Terminal displays streaming output with green prompt and maintains history without state corruption.',
    priority: 'High',
    is_automated: true,
    automated_tag: '@TC02',
    target_url: '/#terminal',
    created_at: '2026-01-15T09:10:00Z',
  },
  {
    id: 'case-tc03',
    test_id: 'TC03',
    title: 'Academic Programs Directory & School Filtering',
    category: 'Academics',
    module: 'Curriculum Catalog',
    description: 'Test multi-school filtering across the 5 advanced engineering schools and 17 specialized programs.',
    steps: [
      '1. Navigate to /programs',
      '2. Click School of AI, Data & Automation filter pill',
      '3. Verify program grid updates to only show matching specializations',
      '4. Click View Curriculum on FDE Fellowship'
    ],
    expected_result: 'Filter updates instantaneously without layout shift and loads full syllabus breakdown.',
    priority: 'High',
    is_automated: true,
    automated_tag: '@TC03',
    target_url: '/programs',
    created_at: '2026-01-15T09:20:00Z',
  },
  {
    id: 'case-tc04',
    test_id: 'TC04',
    title: 'Industrial Real-Life Projects Catalog Filtering',
    category: 'Academics',
    module: 'Project Showcase',
    description: 'Validate exploration of production-grade industrial challenges students must solve for placement readiness.',
    steps: [
      '1. Navigate to /projects',
      '2. Filter by domain: Distributed Systems or Autonomous Agents',
      '3. Click a project card to inspect specs, repo rubric, and tech stack tags',
      '4. Verify GitHub starter link accessibility'
    ],
    expected_result: 'Real-life projects render with difficulty tags, company badges, and detailed deliverables.',
    priority: 'Medium',
    is_automated: true,
    automated_tag: '@TC04',
    target_url: '/projects',
    created_at: '2026-01-15T09:30:00Z',
  },
  {
    id: 'case-tc05',
    test_id: 'TC05',
    title: 'Student Online Admissions Application Dossier Submission',
    category: 'Admissions',
    module: 'Application Funnel',
    description: 'Submit candidate application form on /admissions/apply and verify AI scoring and application ID generation.',
    steps: [
      '1. Navigate to /admissions/apply',
      '2. Fill Full Name, Email, Phone, College, Track, and Skills',
      '3. Click Submit Application Dossier',
      '4. Verify success screen displaying assigned Application ID'
    ],
    expected_result: 'Form validates input fields, submits asynchronously, and displays assigned tracking ID with confirmation.',
    priority: 'Critical',
    is_automated: true,
    automated_tag: '@TC05',
    target_url: '/admissions/apply',
    created_at: '2026-01-15T09:40:00Z',
  },
  {
    id: 'case-tc06',
    test_id: 'TC06',
    title: 'Twenty-Grade Admissions CRM Kanban Pipeline Navigation',
    category: 'CRM',
    module: 'Admissions Operations',
    description: 'Verify the Twenty-style Kanban pipeline displays deal sums, column stages, and candidate cards at /crm.',
    steps: [
      '1. Navigate to /crm',
      '2. Verify 6 pipeline columns: New Inquiries to Enrolled',
      '3. Inspect top-level deal value sums and conversion rate widget',
      '4. Toggle between Kanban Board, Table View, and AI Radar'
    ],
    expected_result: 'All 3 view modes toggle seamlessly with exact candidate counts and deal sums formatted in INR.',
    priority: 'Critical',
    is_automated: true,
    automated_tag: '@TC06',
    target_url: '/crm',
    created_at: '2026-01-15T09:50:00Z',
  },
  {
    id: 'case-tc07',
    test_id: 'TC07',
    title: 'CRM Candidate Dossier Drawer & AI Copilot Fit Analysis',
    category: 'CRM',
    module: 'AI Copilot',
    description: 'Open candidate dossier drawer, view AI Fit Score, radar attributes, and generate personalized outreach email.',
    steps: [
      '1. In /crm, click candidate Rakesh Behera card',
      '2. Verify right slide-over drawer opens with AI Fit Score and Strengths',
      '3. Switch to AI Outreach tab and select Fellowship Offer template',
      '4. Click Copy Email and verify clipboard feedback'
    ],
    expected_result: 'Slide-over displays AI Fit Score (0-100), customized interview questions, and instant email draft.',
    priority: 'High',
    is_automated: true,
    automated_tag: '@TC07',
    target_url: '/crm',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'case-tc08',
    test_id: 'TC08',
    title: 'Inbound Multi-Channel CRM Webhook Lead Ingestion',
    category: 'CRM',
    module: 'API Webhook',
    description: 'Send POST payload to /api/v1/crm/webhook and verify real-time AI scoring and lead persistence.',
    steps: [
      '1. Send POST request to /api/v1/crm/webhook with name, email, phone, and track',
      '2. Verify HTTP 201 Created response',
      '3. Confirm response body contains ai_evaluation object with score and sentiment',
      '4. Verify GET /api/v1/crm/webhook returns schema documentation'
    ],
    expected_result: 'Webhook ingests lead, assigns UUID, evaluates candidate via CrmAiEngine, and queues for triage.',
    priority: 'Critical',
    is_automated: true,
    automated_tag: '@TC08',
    target_url: '/api/v1/crm/webhook',
    created_at: '2026-01-15T10:10:00Z',
  },
  {
    id: 'case-tc09',
    test_id: 'TC09',
    title: 'Lead-to-Fellow 1-Click LMS Enrollment Handshake',
    category: 'Admissions & LMS',
    module: 'Student Onboarding',
    description: 'Test enrolling a shortlisted candidate directly from CRM and verifying active student access in LMS.',
    steps: [
      '1. Open shortlisted candidate drawer in /crm',
      '2. Click Enroll Fellow in LMS button',
      '3. Observe confirmation banner and stage change to ENROLLED',
      '4. Verify student enrollment record is created for Batch Alpha 2026'
    ],
    expected_result: 'Candidate status transitions to ENROLLED and active course enrollment is provisioned in the LMS.',
    priority: 'Critical',
    is_automated: true,
    automated_tag: '@TC09',
    target_url: '/crm',
    created_at: '2026-01-15T10:20:00Z',
  },
  {
    id: 'case-tc10',
    test_id: 'TC10',
    title: 'Student LMS Dashboard Coursework & Video Progression',
    category: 'LMS',
    module: 'Learning Portal',
    description: 'Verify enrolled fellow can view enrolled courses, watch video lessons, and mark modules completed.',
    steps: [
      '1. Navigate to /dashboard/student as Rohan Patnaik',
      '2. Click Continue Learning on Agentic AI Systems',
      '3. Progress video player or click Complete Lesson',
      '4. Verify course progress percentage increases'
    ],
    expected_result: 'Progress bar increments accurately and state persists across browser refreshes.',
    priority: 'High',
    is_automated: false,
    automated_tag: '@TC10',
    target_url: '/dashboard/student',
    created_at: '2026-01-15T10:30:00Z',
  },
  {
    id: 'case-tc11',
    test_id: 'TC11',
    title: 'Enterprise Lab PR Submission & Mentor Code Review Flow',
    category: 'LMS',
    module: 'Academic Grading',
    description: 'Verify student can submit assignment repository URL and mentor can grade with rubric score and feedback.',
    steps: [
      '1. In student portal, navigate to Assignments tab',
      '2. Submit GitHub PR URL for Scaled Dot-Product Attention',
      '3. Switch role to Mentor (Er. Arpita Senapati)',
      '4. Grade submission with 95/100 and approve'
    ],
    expected_result: 'Submission status transitions from SUBMITTED to APPROVED with persistent grade record.',
    priority: 'High',
    is_automated: false,
    automated_tag: '@TC11',
    target_url: '/dashboard/mentor',
    created_at: '2026-01-15T10:40:00Z',
  },
  {
    id: 'case-tc12',
    test_id: 'TC12',
    title: 'Cryptographic Verifiable Certificate Lookup & Ledger Validation',
    category: 'Credentials',
    module: 'Trust & Verification',
    description: 'Validate public credential verification page at /verify/:certId for tamper-proof certificate lookup.',
    steps: [
      '1. Navigate to /verify/TEJAS-2026-AI-8921',
      '2. Verify student name Rohan Patnaik and Distinction grade render',
      '3. Check SHA-256 cryptographic verification ledger badge',
      '4. Verify QR code and certificate PDF preview'
    ],
    expected_result: 'Verification page loads instantly with authentic badge, issuance timestamp, and valid curriculum record.',
    priority: 'Critical',
    is_automated: true,
    automated_tag: '@TC12',
    target_url: '/verify/TEJAS-2026-AI-8921',
    created_at: '2026-01-15T10:50:00Z',
  },
  {
    id: 'case-tc13',
    test_id: 'TC13',
    title: 'Executive Director Operations Command Center Telemetry',
    category: 'Admin',
    module: 'Executive Console',
    description: 'Verify Admin Dashboard at /dashboard/admin displays institute-wide cohorts, completion rates, and Twenty CRM widget.',
    steps: [
      '1. Switch to Director role (Dr. Subhashree Dash)',
      '2. Navigate to /dashboard/admin',
      '3. Inspect Executive Metrics: 124 Active Fellows, 94.2% completion',
      '4. Inspect Twenty AI Admissions widget and click Launch Pipeline'
    ],
    expected_result: 'Executive console renders telemetry metrics and links directly to CRM pipeline.',
    priority: 'High',
    is_automated: true,
    automated_tag: '@TC13',
    target_url: '/dashboard/admin',
    created_at: '2026-01-15T11:00:00Z',
  },
  {
    id: 'case-tc14',
    test_id: 'TC14',
    title: 'Mobile Responsive Navigation Drawer & Viewport Adaptation',
    category: 'Mobile & UX',
    module: 'Responsive Shell',
    description: 'Test mobile layout behavior at 390px (iPhone 13) and 412px (Pixel 7).',
    steps: [
      '1. Set viewport to 390x844 (Mobile)',
      '2. Click hamburger menu button in header',
      '3. Verify mobile slide-out navigation menu renders all links',
      '4. Verify no horizontal viewport clipping or overflow-x scrolling'
    ],
    expected_result: 'Menu opens smoothly, backdrop locks body scroll, and all buttons are touch-target compliant (>44px).',
    priority: 'Critical',
    is_automated: true,
    automated_tag: '@TC14',
    target_url: '/',
    created_at: '2026-01-15T11:10:00Z',
  },
  {
    id: 'case-tc15',
    test_id: 'TC15',
    title: 'Multi-Role Instant Persona Switching (RoleSwitcher)',
    category: 'Authentication',
    module: 'Role-Based Access',
    description: 'Verify switching between Student, Counselor, Trainer, Mentor, Admin, and QA Tester updates global context.',
    steps: [
      '1. Click RoleSwitcher dropdown in top right header',
      '2. Select QA Lead / Tester perspective',
      '3. Verify redirect to /test-data with active tester session',
      '4. Select Admissions CRM and verify redirect to /crm'
    ],
    expected_result: 'Active role updates instantly with persistent session and switches dashboard perspective.',
    priority: 'High',
    is_automated: true,
    automated_tag: '@TC15',
    target_url: '/',
    created_at: '2026-01-15T11:20:00Z',
  },
  {
    id: 'case-tc16',
    test_id: 'TC16',
    title: 'Dark Mode & Contrast Compliance (#08090a Canvas)',
    category: 'Design System',
    module: 'Theme & Accessibility',
    description: 'Validate color contrast ratios across dark canvas #08090a, text typography, and button interactive states.',
    steps: [
      '1. Inspect body background color (#08090a)',
      '2. Verify text-muted-foreground contrast meets WCAG AA (4.5:1)',
      '3. Verify primary button hover states and focus rings',
      '4. Verify card borders are subtly visible border-border/70'
    ],
    expected_result: 'Design conforms to TEJAS dark deep-tech aesthetic with zero contrast accessibility violations.',
    priority: 'Medium',
    is_automated: true,
    automated_tag: '@TC16',
    target_url: '/',
    created_at: '2026-01-15T11:30:00Z',
  },
  {
    id: 'case-tc17',
    test_id: 'TC17',
    title: 'Subdomain Host Header Ingress Routing Simulation',
    category: 'Infrastructure',
    module: 'Edge Routing',
    description: 'Verify host header routing across crm.tejas.ac.in, lms.tejas.ac.in, and api.tejas.ac.in.',
    steps: [
      '1. Navigate to /?subdomain=crm or host crm.tejas.bhashaai.in',
      '2. Verify CRM landing route is served',
      '3. Navigate to /?subdomain=lms and verify LMS portal is served',
      '4. Test /api/v1/health endpoint'
    ],
    expected_result: 'Host rewrite rules route traffic cleanly to designated workspace modules.',
    priority: 'High',
    is_automated: false,
    automated_tag: '@TC17',
    target_url: '/?subdomain=crm',
    created_at: '2026-01-15T11:40:00Z',
  },
  {
    id: 'case-tc18',
    title: 'Offline Demo Mode LocalStorage State Resilience',
    test_id: 'TC18',
    category: 'Resilience',
    module: 'Client Storage',
    description: 'Ensure offline or demo mode gracefully caches application changes without crashing.',
    steps: [
      '1. Disable network or simulate Supabase downtime',
      '2. Submit a new lead in /crm Quick Add modal',
      '3. Refresh the browser page',
      '4. Verify the newly added lead persists from localStorage cache'
    ],
    expected_result: 'Platform gracefully falls back to localStorage with zero unhandled promise rejections.',
    priority: 'High',
    is_automated: true,
    automated_tag: '@TC18',
    target_url: '/crm',
    created_at: '2026-01-15T11:50:00Z',
  },
  {
    id: 'case-tc19',
    test_id: 'TC19',
    title: 'Whitepapers, Research Articles & Technical Deep-Dives',
    category: 'Content',
    module: 'Research Library',
    description: 'Verify public research papers and technical whitepapers render with KaTeX math and architecture diagrams.',
    steps: [
      '1. Navigate to /whitepapers or /articles',
      '2. Open an article: Deploying High-Throughput vLLM Clusters',
      '3. Verify markdown formatting, code block syntax highlighting, and reading time badge',
      '4. Verify share button'
    ],
    expected_result: 'Technical articles render with clean typography, code snippets, and fast initial load.',
    priority: 'Medium',
    is_automated: true,
    automated_tag: '@TC19',
    target_url: '/whitepapers',
    created_at: '2026-01-15T12:00:00Z',
  },
  {
    id: 'case-tc20',
    test_id: 'TC20',
    title: 'Global Performance: Asset Sizes & Core Web Vitals',
    category: 'Performance',
    module: 'Site Speed',
    description: 'Measure Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS).',
    steps: [
      '1. Run Lighthouse or Playwright performance audit on /',
      '2. Verify LCP is under 2.0s',
      '3. Verify image assets have explicit width/height or sizes attributes',
      '4. Check zero CLS during banner load'
    ],
    expected_result: 'Core Web Vitals in green zone (LCP < 2.0s, CLS < 0.05, FID < 50ms) across desktop and mobile.',
    priority: 'High',
    is_automated: true,
    automated_tag: '@TC20',
    target_url: '/',
    created_at: '2026-01-15T12:10:00Z',
  },
];

// Helper to get today's date formatted as YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function generateInitialResults(dateStr: string): QaTestResult[] {
  return DEFAULT_QA_TEST_CASES.map((tc, idx) => {
    let status: TestStatus = 'passed';
    let observations = 'Executed according to standard QA SOP. All assertions validated.';

    if (tc.test_id === 'TC04') {
      status = 'retest';
      observations = 'Domain filter badge animation has minor 40ms layout recalculation delay. Retesting on latest build.';
    } else if (tc.test_id === 'TC10') {
      status = 'pending';
      observations = 'Awaiting new video player integration test sprint.';
    } else if (tc.test_id === 'TC17') {
      status = 'passed';
      observations = 'Subdomain rewrite simulated on localhost and Cloudflare tunnel verified.';
    } else if (tc.test_id === 'TC08') {
      status = 'passed';
      observations = 'Tested via webhook curl POST. HTTP 201 received with AI fit evaluation score 65.';
    }

    return {
      id: `res-${tc.test_id}-${dateStr}`,
      test_case_id: tc.id,
      test_id: tc.test_id,
      test_title: tc.title,
      tester_email: 'qa.lead@tejas.ac.in',
      tester_name: 'Subhranshu Jena',
      status,
      cycle_date: dateStr,
      observations,
      run_mode: tc.is_automated ? 'automated' : 'manual',
      device_info: 'Desktop Chrome 1440x900 (Windows 11)',
      duration_ms: Math.floor(250 + (idx * 35) % 600),
      created_at: `${dateStr}T10:${String(idx).padStart(2, '0')}:00Z`,
      updated_at: `${dateStr}T10:${String(idx).padStart(2, '0')}:00Z`,
    };
  });
}

export const INITIAL_ACTIVITY_LOGS: QaTesterActivityLog[] = [
  {
    id: 'log-1',
    tester_email: 'qa.lead@tejas.ac.in',
    tester_name: 'Subhranshu Jena',
    action_type: 'login',
    metadata: {
      route: '/test-data',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0',
      device: 'Desktop Chrome 1440x900',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'log-2',
    tester_email: 'qa.lead@tejas.ac.in',
    tester_name: 'Subhranshu Jena',
    action_type: 'page_view',
    metadata: {
      route: '/test-data',
      tab: 'execution',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 170).toISOString(),
  },
  {
    id: 'log-3',
    tester_email: 'qa.lead@tejas.ac.in',
    tester_name: 'Subhranshu Jena',
    action_type: 'test_execute',
    metadata: {
      test_id: 'TC01',
      test_title: 'Public Homepage & Hero Brand CTA Verification',
      status: 'passed',
      duration_ms: 310,
    },
    created_at: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
  },
  {
    id: 'log-4',
    tester_email: 'qa.lead@tejas.ac.in',
    tester_name: 'Subhranshu Jena',
    action_type: 'test_execute',
    metadata: {
      test_id: 'TC06',
      test_title: 'Twenty-Grade Admissions CRM Kanban Pipeline Navigation',
      status: 'passed',
      duration_ms: 480,
    },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'log-5',
    tester_email: 'qa.lead@tejas.ac.in',
    tester_name: 'Subhranshu Jena',
    action_type: 'observation_save',
    metadata: {
      test_id: 'TC04',
      status: 'retest',
      observations: 'Filter pill animation has slight delay on first click. Retesting in next sprint.',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: 'log-6',
    tester_email: 'qa.lead@tejas.ac.in',
    tester_name: 'Subhranshu Jena',
    action_type: 'suite_trigger',
    metadata: {
      suite: 'smoke',
      device: 'Desktop Chrome 1440x900',
      tests_count: 8,
    },
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

/**
 * Universal QA Data Service
 * Synchronizes across LocalStorage, in-memory, and Supabase PostgreSQL
 */
export class QaService {
  private static STORAGE_KEY_TEST_CASES = 'tejas_qa_test_cases';
  private static STORAGE_KEY_RESULTS = 'tejas_qa_test_results';
  private static STORAGE_KEY_LOGS = 'tejas_qa_activity_logs';

  // 1. Get Test Cases
  public static getTestCases(): QaTestCase[] {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY_TEST_CASES);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_QA_TEST_CASES;
  }

  // 2. Get Test Results for a Cycle Date
  public static getTestResults(cycleDate?: string): QaTestResult[] {
    const targetDate = cycleDate || getTodayDateString();
    let allResults: QaTestResult[] = [];

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY_RESULTS);
        if (saved) {
          allResults = JSON.parse(saved);
        }
      } catch {}
    }

    if (allResults.length === 0) {
      allResults = generateInitialResults(targetDate);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(this.STORAGE_KEY_RESULTS, JSON.stringify(allResults));
        } catch {}
      }
    }

    // Filter results for target date or generate for date if not yet populated
    const dateResults = allResults.filter((r) => r.cycle_date === targetDate);
    if (dateResults.length === 0) {
      const newCycleResults = generateInitialResults(targetDate);
      allResults = [...newCycleResults, ...allResults];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(this.STORAGE_KEY_RESULTS, JSON.stringify(allResults));
        } catch {}
      }
      return newCycleResults;
    }

    return dateResults;
  }

  // 3. Save or Update Test Result
  public static saveTestResult(resultUpdate: Partial<QaTestResult> & { test_case_id: string }): QaTestResult {
    const cycleDate = resultUpdate.cycle_date || getTodayDateString();
    let allResults: QaTestResult[] = [];

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY_RESULTS);
        if (saved) allResults = JSON.parse(saved);
      } catch {}
    }

    if (allResults.length === 0) {
      allResults = generateInitialResults(cycleDate);
    }

    const testCase = DEFAULT_QA_TEST_CASES.find((tc) => tc.id === resultUpdate.test_case_id || tc.test_id === resultUpdate.test_id);
    const existingIndex = allResults.findIndex(
      (r) => (r.test_case_id === resultUpdate.test_case_id || r.test_id === resultUpdate.test_id) && r.cycle_date === cycleDate
    );

    let updatedResult: QaTestResult;

    if (existingIndex >= 0) {
      updatedResult = {
        ...allResults[existingIndex],
        ...resultUpdate,
        test_title: testCase?.title || allResults[existingIndex].test_title,
        updated_at: new Date().toISOString(),
      };
      allResults[existingIndex] = updatedResult;
    } else {
      updatedResult = {
        id: resultUpdate.id || `res-${resultUpdate.test_id || 'TC'}-${Date.now()}`,
        test_case_id: resultUpdate.test_case_id,
        test_id: resultUpdate.test_id || testCase?.test_id,
        test_title: testCase?.title || resultUpdate.test_title || 'Untitled Test',
        tester_email: resultUpdate.tester_email || 'qa.lead@tejas.ac.in',
        tester_name: resultUpdate.tester_name || 'Subhranshu Jena',
        status: resultUpdate.status || 'passed',
        cycle_date: cycleDate,
        observations: resultUpdate.observations || '',
        screenshot_url: resultUpdate.screenshot_url,
        run_mode: resultUpdate.run_mode || 'manual',
        device_info: resultUpdate.device_info || 'Desktop Chrome 1440x900',
        duration_ms: resultUpdate.duration_ms || 320,
        error_message: resultUpdate.error_message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      allResults = [updatedResult, ...allResults];
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY_RESULTS, JSON.stringify(allResults));
      } catch {}
    }

    // Log the observation save or test execution action
    this.logActivity(
      resultUpdate.observations ? 'observation_save' : 'test_execute',
      {
        test_id: updatedResult.test_id,
        test_title: updatedResult.test_title,
        status: updatedResult.status,
        has_screenshot: Boolean(updatedResult.screenshot_url),
        cycle_date: cycleDate,
      },
      {
        email: updatedResult.tester_email,
        name: updatedResult.tester_name,
      }
    );

    return updatedResult;
  }

  // 4. Log Tester Activity
  public static logActivity(
    actionType: QaActionType,
    metadata: Record<string, any>,
    tester?: { email?: string; name?: string }
  ): QaTesterActivityLog {
    const newLog: QaTesterActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      tester_email: tester?.email || 'qa.lead@tejas.ac.in',
      tester_name: tester?.name || 'Subhranshu Jena',
      action_type: actionType,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    };

    let logs = this.getActivityLogs();
    logs = [newLog, ...logs];

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY_LOGS, JSON.stringify(logs.slice(0, 300)));
      } catch {}
    }

    return newLog;
  }

  // 5. Get Activity Logs
  public static getActivityLogs(limit: number = 100): QaTesterActivityLog[] {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY_LOGS);
        if (saved) return JSON.parse(saved).slice(0, limit);
      } catch {}
    }
    return INITIAL_ACTIVITY_LOGS.slice(0, limit);
  }

  // 6. Get Historical Runs for a Specific Test Case
  public static getTestCaseHistory(testCaseIdOrTestId: string): QaTestResult[] {
    let allResults: QaTestResult[] = [];
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY_RESULTS);
        if (saved) allResults = JSON.parse(saved);
      } catch {}
    }

    if (allResults.length === 0) {
      allResults = generateInitialResults(getTodayDateString());
    }

    return allResults.filter(
      (r) => r.test_case_id === testCaseIdOrTestId || r.test_id === testCaseIdOrTestId
    );
  }

  // 7. Calculate Cycle Summary
  public static getCycleSummary(cycleDate?: string): QaCycleSummary {
    const results = this.getTestResults(cycleDate);
    const total = results.length;
    const passed = results.filter((r) => r.status === 'passed').length;
    const failed = results.filter((r) => r.status === 'failed').length;
    const retest = results.filter((r) => r.status === 'retest').length;
    const blocked = results.filter((r) => r.status === 'blocked').length;
    const pending = results.filter((r) => r.status === 'pending').length;

    return {
      cycle_date: cycleDate || getTodayDateString(),
      total_tests: total,
      passed,
      failed,
      retest,
      blocked,
      pending,
      pass_percentage: total > 0 ? Math.round((passed / total) * 100) : 0,
      fail_percentage: total > 0 ? Math.round((failed / total) * 100) : 0,
    };
  }
}
