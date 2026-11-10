-- ============================================================
-- TEJAS INSTITUTE OF ADVANCED TECHNOLOGY
-- Unified In-App QA & Automation Testing Framework Migration
-- Location: Bhubaneswar, Odisha, India
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: qa_test_cases
CREATE TABLE IF NOT EXISTS qa_test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id TEXT NOT NULL UNIQUE, -- e.g. "TC01", "TC02"
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g. "Authentication", "Admissions", "LMS", "CRM", "Mobile"
  module TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb, -- Ordered list of reproduction instructions
  expected_result TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
  is_automated BOOLEAN NOT NULL DEFAULT false,
  automated_tag TEXT, -- e.g. "@TC01"
  target_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table: qa_test_results
CREATE TABLE IF NOT EXISTS qa_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_case_id UUID NOT NULL REFERENCES qa_test_cases(id) ON DELETE CASCADE,
  tester_id UUID,
  tester_email TEXT NOT NULL,
  tester_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'retest', 'blocked', 'pending')),
  cycle_date DATE NOT NULL DEFAULT CURRENT_DATE, -- e.g. '2026-10-04'
  observations TEXT,
  screenshot_url TEXT,
  run_mode TEXT NOT NULL DEFAULT 'manual' CHECK (run_mode IN ('manual', 'automated')),
  device_info TEXT, -- e.g. "Desktop Chrome 1440x900", "Pixel 7 (Android)"
  duration_ms INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table: qa_tester_activity_logs
CREATE TABLE IF NOT EXISTS qa_tester_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tester_id UUID,
  tester_email TEXT NOT NULL,
  tester_name TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('login', 'logout', 'page_view', 'test_execute', 'observation_save', 'screenshot_upload', 'suite_trigger')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Indexes for High-Efficiency Querying
CREATE INDEX IF NOT EXISTS idx_qa_test_cases_test_id ON qa_test_cases(test_id);
CREATE INDEX IF NOT EXISTS idx_qa_test_cases_category ON qa_test_cases(category);
CREATE INDEX IF NOT EXISTS idx_qa_test_cases_priority ON qa_test_cases(priority);
CREATE INDEX IF NOT EXISTS idx_qa_test_results_cycle_date ON qa_test_results(cycle_date);
CREATE INDEX IF NOT EXISTS idx_qa_test_results_test_case_id ON qa_test_results(test_case_id);
CREATE INDEX IF NOT EXISTS idx_qa_test_results_status ON qa_test_results(status);
CREATE INDEX IF NOT EXISTS idx_qa_tester_activity_logs_created_at ON qa_tester_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qa_tester_activity_logs_tester_email ON qa_tester_activity_logs(tester_email);

-- 5. Row Level Security (RLS)
ALTER TABLE qa_test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_tester_activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated and anonymous users in demo mode
CREATE POLICY "Public read test cases"
  ON qa_test_cases FOR SELECT
  USING (true);

CREATE POLICY "Testers and admins manage test cases"
  ON qa_test_cases FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read test results"
  ON qa_test_results FOR SELECT
  USING (true);

CREATE POLICY "Testers manage test results"
  ON qa_test_results FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read activity logs"
  ON qa_tester_activity_logs FOR SELECT
  USING (true);

CREATE POLICY "Insert activity logs"
  ON qa_tester_activity_logs FOR INSERT
  WITH CHECK (true);

-- 6. Storage Bucket for Screenshot Evidence
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'qa-evidence',
  'qa-evidence',
  true,
  10485760, -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- Storage policies
CREATE POLICY "Public read qa evidence"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'qa-evidence');

CREATE POLICY "Authenticated users upload qa evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'qa-evidence');

-- ============================================================
-- 7. Seed Data: Comprehensive Enterprise Test Catalog (20 TCs)
-- ============================================================

INSERT INTO qa_test_cases (test_id, title, category, module, description, steps, expected_result, priority, is_automated, automated_tag, target_url)
VALUES
(
  'TC01',
  'Public Homepage & Hero Brand CTA Verification',
  'Public Portal',
  'Marketing Web',
  'Verify homepage renders TEJAS header, navigation bar, hero headline, and Explore Programs button without hydration errors.',
  '["1. Navigate to /", "2. Verify TEJAS Institute brand logo renders", "3. Check navigation items: Programs, Whitepapers, Projects", "4. Click Explore Programs button and verify smooth scroll or route transition"]'::jsonb,
  'Hero renders in under 1.5s with zero console errors and accessible CTA links.',
  'Critical',
  true,
  '@TC01',
  '/'
),
(
  'TC02',
  'Interactive Engineering Terminal Command Execution',
  'Public Portal',
  'Interactive Tools',
  'Ensure the embedded terminal on homepage executes simulated deep-tech commands (e.g. tejas build, docker run, vllm serve).',
  '["1. Scroll to Interactive Terminal section", "2. Click terminal input or click suggestion pill", "3. Execute help and observe simulated stdout stream", "4. Execute clear and verify terminal reset"]'::jsonb,
  'Terminal displays streaming output with green prompt and maintains history without state corruption.',
  'High',
  true,
  '@TC02',
  '/#terminal'
),
(
  'TC03',
  'Academic Programs Directory & School Filtering',
  'Academics',
  'Curriculum Catalog',
  'Test multi-school filtering across the 5 advanced engineering schools and 17 specialized programs.',
  '["1. Navigate to /programs", "2. Click School of AI, Data & Automation filter pill", "3. Verify program grid updates to only show matching specializations", "4. Click View Curriculum on FDE Fellowship"]'::jsonb,
  'Filter updates instantaneously without layout shift and loads full syllabus breakdown.',
  'High',
  true,
  '@TC03',
  '/programs'
),
(
  'TC04',
  'Industrial Real-Life Projects Catalog Filtering',
  'Academics',
  'Project Showcase',
  'Validate exploration of production-grade industrial challenges students must solve for placement readiness.',
  '["1. Navigate to /projects", "2. Filter by domain: Distributed Systems or Autonomous Agents", "3. Click a project card to inspect specs, repo rubric, and tech stack tags", "4. Verify GitHub starter link accessibility"]'::jsonb,
  'Real-life projects render with difficulty tags, company badges, and detailed deliverables.',
  'Medium',
  true,
  '@TC04',
  '/projects'
),
(
  'TC05',
  'Student Online Admissions Application Dossier Submission',
  'Admissions',
  'Application Funnel',
  'Submit candidate application form on /admissions/apply and verify AI scoring and application ID generation.',
  '["1. Navigate to /admissions/apply", "2. Fill Full Name, Email, Phone, College, Track, and Skills", "3. Click Submit Application Dossier", "4. Verify success screen displaying assigned Application ID"]'::jsonb,
  'Form validates input fields, submits asynchronously, and displays assigned tracking ID with confirmation.',
  'Critical',
  true,
  '@TC05',
  '/admissions/apply'
),
(
  'TC06',
  'Twenty-Grade Admissions CRM Kanban Pipeline Navigation',
  'CRM',
  'Admissions Operations',
  'Verify the Twenty-style Kanban pipeline displays deal sums, column stages, and candidate cards at /crm.',
  '["1. Navigate to /crm", "2. Verify 6 pipeline columns: New Inquiries to Enrolled", "3. Inspect top-level deal value sums and conversion rate widget", "4. Toggle between Kanban Board, Table View, and AI Radar"]'::jsonb,
  'All 3 view modes toggle seamlessly with exact candidate counts and deal sums formatted in INR.',
  'Critical',
  true,
  '@TC06',
  '/crm'
),
(
  'TC07',
  'CRM Candidate Dossier Drawer & AI Copilot Fit Analysis',
  'CRM',
  'AI Copilot',
  'Open candidate dossier drawer, view AI Fit Score, radar attributes, and generate personalized outreach email.',
  '["1. In /crm, click candidate Rakesh Behera card", "2. Verify right slide-over drawer opens with AI Fit Score and Strengths", "3. Switch to AI Outreach tab and select Fellowship Offer template", "4. Click Copy Email and verify clipboard feedback"]'::jsonb,
  'Slide-over displays AI Fit Score (0-100), customized interview questions, and instant email draft.',
  'High',
  true,
  '@TC07',
  '/crm'
),
(
  'TC08',
  'Inbound Multi-Channel CRM Webhook Lead Ingestion',
  'CRM',
  'API Webhook',
  'Send POST payload to /api/v1/crm/webhook and verify real-time AI scoring and lead persistence.',
  '["1. Send POST request to /api/v1/crm/webhook with name, email, phone, and track", "2. Verify HTTP 201 Created response", "3. Confirm response body contains ai_evaluation object with score and sentiment", "4. Verify GET /api/v1/crm/webhook returns schema documentation"]'::jsonb,
  'Webhook ingests lead, assigns UUID, evaluates candidate via CrmAiEngine, and queues for triage.',
  'Critical',
  true,
  '@TC08',
  '/api/v1/crm/webhook'
),
(
  'TC09',
  'Lead-to-Fellow 1-Click LMS Enrollment Handshake',
  'Admissions & LMS',
  'Student Onboarding',
  'Test enrolling a shortlisted candidate directly from CRM and verifying active student access in LMS.',
  '["1. Open shortlisted candidate drawer in /crm", "2. Click Enroll Fellow in LMS button", "3. Observe confirmation banner and stage change to ENROLLED", "4. Verify student enrollment record is created for Batch Alpha 2026"]'::jsonb,
  'Candidate status transitions to ENROLLED and active course enrollment is provisioned in the LMS.',
  'Critical',
  true,
  '@TC09',
  '/crm'
),
(
  'TC10',
  'Student LMS Dashboard Coursework & Video Progression',
  'LMS',
  'Learning Portal',
  'Verify enrolled fellow can view enrolled courses, watch video lessons, and mark modules completed.',
  '["1. Navigate to /dashboard/student as Rohan Patnaik", "2. Click Continue Learning on Agentic AI Systems", "3. Progress video player or click Complete Lesson", "4. Verify course progress percentage increases"]'::jsonb,
  'Progress bar increments accurately and state persists across browser refreshes.',
  'High',
  false,
  '@TC10',
  '/dashboard/student'
),
(
  'TC11',
  'Enterprise Lab PR Submission & Mentor Code Review Flow',
  'LMS',
  'Academic Grading',
  'Verify student can submit assignment repository URL and mentor can grade with rubric score and feedback.',
  '["1. In student portal, navigate to Assignments tab", "2. Submit GitHub PR URL for Scaled Dot-Product Attention", "3. Switch role to Mentor (Er. Arpita Senapati)", "4. Grade submission with 95/100 and approve"]'::jsonb,
  'Submission status transitions from SUBMITTED to APPROVED with persistent grade record.',
  'High',
  false,
  '@TC11',
  '/dashboard/mentor'
),
(
  'TC12',
  'Cryptographic Verifiable Certificate Lookup & Ledger Validation',
  'Credentials',
  'Trust & Verification',
  'Validate public credential verification page at /verify/:certId for tamper-proof certificate lookup.',
  '["1. Navigate to /verify/TEJAS-2026-AI-8921", "2. Verify student name Rohan Patnaik and Distinction grade render", "3. Check SHA-256 cryptographic verification ledger badge", "4. Verify QR code and certificate PDF preview"]'::jsonb,
  'Verification page loads instantly with authentic badge, issuance timestamp, and valid curriculum record.',
  'Critical',
  true,
  '@TC12',
  '/verify/TEJAS-2026-AI-8921'
),
(
  'TC13',
  'Executive Director Operations Command Center Telemetry',
  'Admin',
  'Executive Console',
  'Verify Admin Dashboard at /dashboard/admin displays institute-wide cohorts, completion rates, and Twenty CRM widget.',
  '["1. Switch to Director role (Dr. Subhashree Dash)", "2. Navigate to /dashboard/admin", "3. Inspect Executive Metrics: 124 Active Fellows, 94.2% completion", "4. Inspect Twenty AI Admissions widget and click Launch Pipeline"]'::jsonb,
  'Executive console renders telemetry metrics and links directly to CRM pipeline.',
  'High',
  true,
  '@TC13',
  '/dashboard/admin'
),
(
  'TC14',
  'Mobile Responsive Navigation Drawer & Viewport Adaptation',
  'Mobile & UX',
  'Responsive Shell',
  'Test mobile layout behavior at 390px (iPhone 13) and 412px (Pixel 7).',
  '["1. Set viewport to 390x844 (Mobile)", "2. Click hamburger menu button in header", "3. Verify mobile slide-out navigation menu renders all links", "4. Verify no horizontal viewport clipping or overflow-x scrolling"]'::jsonb,
  'Menu opens smoothly, backdrop locks body scroll, and all buttons are touch-target compliant (>44px).',
  'Critical',
  true,
  '@TC14',
  '/'
),
(
  'TC15',
  'Multi-Role Instant Persona Switching (RoleSwitcher)',
  'Authentication',
  'Role-Based Access',
  'Verify switching between Student, Counselor, Trainer, Mentor, Admin, and QA Tester updates global context.',
  '["1. Click RoleSwitcher dropdown in top right header", "2. Select QA Lead / Tester perspective", "3. Verify redirect to /test-data with active tester session", "4. Select Admissions CRM and verify redirect to /crm"]'::jsonb,
  'Active role updates instantly with persistent session and switches dashboard perspective.',
  'High',
  true,
  '@TC15',
  '/'
),
(
  'TC16',
  'Dark Mode & Contrast Compliance (#08090a Canvas)',
  'Design System',
  'Theme & Accessibility',
  'Validate color contrast ratios across dark canvas #08090a, text typography, and button interactive states.',
  '["1. Inspect body background color (#08090a)", "2. Verify text-muted-foreground contrast meets WCAG AA (4.5:1)", "3. Verify primary button hover states and focus rings", "4. Verify card borders are subtly visible border-border/70"]'::jsonb,
  'Design conforms to TEJAS dark deep-tech aesthetic with zero contrast accessibility violations.',
  'Medium',
  true,
  '@TC16',
  '/'
),
(
  'TC17',
  'Subdomain Host Header Ingress Routing Simulation',
  'Infrastructure',
  'Edge Routing',
  'Verify host header routing across crm.tejas.ac.in, lms.tejas.ac.in, and api.tejas.ac.in.',
  '["1. Navigate to /?subdomain=crm or host crm.tejas.bhashaai.in", "2. Verify CRM landing route is served", "3. Navigate to /?subdomain=lms and verify LMS portal is served", "4. Test /api/v1/health endpoint"]'::jsonb,
  'Host rewrite rules route traffic cleanly to designated workspace modules.',
  'High',
  false,
  '@TC17',
  '/?subdomain=crm'
),
(
  'TC18',
  'Offline Demo Mode LocalStorage State Resilience',
  'Resilience',
  'Client Storage',
  'Ensure offline or demo mode gracefully caches application changes without crashing.',
  '["1. Disable network or simulate Supabase downtime", "2. Submit a new lead in /crm Quick Add modal", "3. Refresh the browser page", "4. Verify the newly added lead persists from localStorage cache"]'::jsonb,
  'Platform gracefully falls back to localStorage with zero unhandled promise rejections.',
  'High',
  true,
  '@TC18',
  '/crm'
),
(
  'TC19',
  'Whitepapers, Research Articles & Technical Deep-Dives',
  'Content',
  'Research Library',
  'Verify public research papers and technical whitepapers render with KaTeX math and architecture diagrams.',
  '["1. Navigate to /whitepapers or /articles", "2. Open an article: Deploying High-Throughput vLLM Clusters", "3. Verify markdown formatting, code block syntax highlighting, and reading time badge", "4. Verify share button"]'::jsonb,
  'Technical articles render with clean typography, code snippets, and fast initial load.',
  'Medium',
  true,
  '@TC19',
  '/whitepapers'
),
(
  'TC20',
  'Global Performance: Asset Sizes & Core Web Vitals',
  'Performance',
  'Site Speed',
  'Measure Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS).',
  '["1. Run Lighthouse or Playwright performance audit on /", "2. Verify LCP is under 2.0s", "3. Verify image assets have explicit width/height or sizes attributes", "4. Check zero CLS during banner load"]'::jsonb,
  'Core Web Vitals in green zone (LCP < 2.0s, CLS < 0.05, FID < 50ms) across desktop and mobile.',
  'High',
  true,
  '@TC20',
  '/'
)
ON CONFLICT (test_id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  module = EXCLUDED.module,
  description = EXCLUDED.description,
  steps = EXCLUDED.steps,
  expected_result = EXCLUDED.expected_result,
  priority = EXCLUDED.priority,
  is_automated = EXCLUDED.is_automated,
  automated_tag = EXCLUDED.automated_tag,
  target_url = EXCLUDED.target_url;

-- Baseline test results for active testing cycle
INSERT INTO qa_test_results (test_case_id, tester_email, tester_name, status, cycle_date, observations, run_mode, device_info, duration_ms)
SELECT
  id,
  'qa.lead@tejas.ac.in',
  'Subhranshu Jena',
  CASE
    WHEN test_id IN ('TC01', 'TC02', 'TC03', 'TC06', 'TC08', 'TC12', 'TC14', 'TC15') THEN 'passed'
    WHEN test_id IN ('TC05', 'TC07') THEN 'passed'
    WHEN test_id = 'TC04' THEN 'retest'
    WHEN test_id = 'TC10' THEN 'pending'
    ELSE 'passed'
  END,
  CURRENT_DATE,
  CASE
    WHEN test_id = 'TC01' THEN 'Verified Desktop Chrome 1440x900 and Pixel 7. Zero console warnings.'
    WHEN test_id = 'TC04' THEN 'Filter pill animation has slight delay on first click. Retesting in next sprint.'
    WHEN test_id = 'TC06' THEN 'Twenty CRM Kanban board verified. All 6 columns render accurate INR totals.'
    WHEN test_id = 'TC08' THEN 'Tested via webhook curl POST. HTTP 201 received with AI score 65.'
    ELSE 'Executed as per SOP guidelines. All criteria met.'
  END,
  CASE WHEN is_automated THEN 'automated' ELSE 'manual' END,
  'Desktop Chrome 1440x900 (Windows 11)',
  (RANDOM() * 800 + 200)::integer
FROM qa_test_cases
ON CONFLICT DO NOTHING;

-- Initial Activity Logs
INSERT INTO qa_tester_activity_logs (tester_email, tester_name, action_type, metadata, created_at)
VALUES
('qa.lead@tejas.ac.in', 'Subhranshu Jena', 'login', '{"route": "/test-data", "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}'::jsonb, NOW() - INTERVAL '4 hours'),
('qa.lead@tejas.ac.in', 'Subhranshu Jena', 'page_view', '{"route": "/test-data", "tab": "execution"}'::jsonb, NOW() - INTERVAL '3 hours 50 minutes'),
('qa.lead@tejas.ac.in', 'Subhranshu Jena', 'test_execute', '{"test_id": "TC01", "status": "passed", "duration_ms": 320}'::jsonb, NOW() - INTERVAL '3 hours 40 minutes'),
('qa.lead@tejas.ac.in', 'Subhranshu Jena', 'test_execute', '{"test_id": "TC06", "status": "passed", "duration_ms": 480}'::jsonb, NOW() - INTERVAL '3 hours 20 minutes'),
('qa.lead@tejas.ac.in', 'Subhranshu Jena', 'observation_save', '{"test_id": "TC04", "status": "retest", "observations": "Filter animation slight delay."}'::jsonb, NOW() - INTERVAL '2 hours 15 minutes'),
('qa.lead@tejas.ac.in', 'Subhranshu Jena', 'suite_trigger', '{"suite": "smoke", "device": "Desktop Chrome", "tests_count": 8}'::jsonb, NOW() - INTERVAL '1 hour 10 minutes');
