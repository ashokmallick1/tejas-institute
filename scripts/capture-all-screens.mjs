import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3004';
const SCREENSHOT_DIR = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\d02ca969-bf82-484f-9595-f6790db8ef7f\\screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const SCREENS = [
  // ── Public Brand Experience ──
  { name: '01_homepage', path: '/', role: 'student', desc: 'Homepage Hero & Deep-Tech Foundations' },
  { name: '02_programs_catalog', path: '/programs', role: 'student', desc: '18 Programs & School Filter' },
  { name: '03_schools_directory', path: '/schools', role: 'student', desc: '6 Advanced Engineering Schools' },
  { name: '04_projects_showcase', path: '/projects', role: 'student', desc: 'Deep-Tech Projects Catalog' },
  { name: '05_admissions_apply', path: '/admissions/apply', role: 'student', desc: 'Fellowship Application Form' },
  { name: '06_certificate_verification', path: '/verify/TEJAS-2026-AI-8921', role: 'student', desc: 'Cryptographic Certificate Portal' },
  { name: '07_about_labs', path: '/about/labs', role: 'student', desc: 'Bhubaneswar DGX & Hardware Labs' },
  { name: '08_learn_while_you_work', path: '/learn-while-you-work', role: 'student', desc: 'Earn & Learn Fellowship Model' },

  // ── Admissions & Tax Invoicing CRM ──
  { name: '09_crm_pipeline', path: '/crm', role: 'counselor', desc: 'Twenty AI CRM Kanban Pipeline' },
  { name: '10_crm_admissions', path: '/crm/admissions', role: 'counselor', desc: 'Admissions Register & Dossiers' },
  { name: '11_crm_invoices', path: '/crm/invoices', role: 'counselor', desc: 'GST Tax Invoicing & Billing' },
  { name: '12_crm_fee_structures', path: '/crm/fee-structures', role: 'counselor', desc: 'Fee Structures & Installments' },

  // ── LMS & Scaler-Style Live Classroom ──
  { name: '13_student_lms_overview', path: '/dashboard/student', role: 'student', desc: 'Student Dashboard & Progress' },
  { name: '14_student_live_classes_hub', path: '/dashboard/student/live', role: 'student', desc: 'Scaler Live Classes Timetable Hub' },
  { name: '15_student_live_classroom_studio', path: '/dashboard/student/live/live-vllm-01', role: 'student', desc: 'Live Classroom Studio (Stream + Doubts + Sandbox)' },
  { name: '16_trainer_studio', path: '/dashboard/trainer', role: 'trainer', desc: 'Faculty Curriculum Studio' },
  { name: '17_trainer_live_broadcast_studio', path: '/dashboard/trainer/live-studio', role: 'trainer', desc: 'Faculty Live Broadcast & Doubt Triage Console' },
  { name: '18_mentor_review_desk', path: '/dashboard/mentor', role: 'mentor', desc: 'Mentor Code Review Console' },
  { name: '19_admin_director_console', path: '/dashboard/admin', role: 'admin', desc: 'Director Console & Operations' },

  // ── QA Framework Portals ──
  { name: '20_qa_command_center', path: '/test-data', role: 'admin', desc: 'Unified QA Command Center' },
  { name: '21_qa_tester_activity', path: '/tester-activity', role: 'admin', desc: 'Real-time Tester Activity Monitor' },
];

async function captureAllScreens() {
  console.log(`============================================================`);
  console.log(`  TEJAS AUTOMATED SCREENSHOT DISCOVERY ENGINE`);
  console.log(`  Target: ${BASE_URL} | Total Screens: ${SCREENS.length}`);
  console.log(`============================================================\n`);

  const browser = await chromium.launch({ headless: true });

  const capturedManifest = [];

  for (const screen of SCREENS) {
    console.log(`\n[Capturing] ${screen.name} (${screen.path})...`);

    // ── 1. Desktop Viewport (1440x900) ──
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1.5,
    });
    const desktopPage = await desktopContext.newPage();

    await desktopPage.addInitScript((role) => {
      localStorage.setItem('tejas_active_role', role);
      localStorage.setItem('tejas_user_id', 'user-student-01');
    }, screen.role);

    try {
      await desktopPage.goto(`${BASE_URL}${screen.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await desktopPage.waitForTimeout(1000); // Allow any CSS animations to settle

      const desktopFile = `desktop_${screen.name}.png`;
      const desktopFullPath = path.join(SCREENSHOT_DIR, desktopFile);
      await desktopPage.screenshot({ path: desktopFullPath, fullPage: false });
      console.log(`  ✓ Desktop saved: ${desktopFile}`);
    } catch (err) {
      console.error(`  ✗ Desktop error on ${screen.path}: ${err.message}`);
    }
    await desktopContext.close();

    // ── 2. Mobile Viewport (Pixel 7 / iPhone: 390x844) ──
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.addInitScript((role) => {
      localStorage.setItem('tejas_active_role', role);
      localStorage.setItem('tejas_user_id', 'user-student-01');
    }, screen.role);

    try {
      await mobilePage.goto(`${BASE_URL}${screen.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await mobilePage.waitForTimeout(1000);

      const mobileFile = `mobile_${screen.name}.png`;
      const mobileFullPath = path.join(SCREENSHOT_DIR, mobileFile);
      await mobilePage.screenshot({ path: mobileFullPath, fullPage: false });
      console.log(`  ✓ Mobile saved:  ${mobileFile}`);

      capturedManifest.push({
        name: screen.name,
        path: screen.path,
        desc: screen.desc,
        desktopFile: `desktop_${screen.name}.png`,
        mobileFile: `mobile_${screen.name}.png`,
      });
    } catch (err) {
      console.error(`  ✗ Mobile error on ${screen.path}: ${err.message}`);
    }
    await mobileContext.close();
  }

  await browser.close();

  // Write catalog manifest
  const manifestPath = path.join(SCREENSHOT_DIR, 'screen_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(capturedManifest, null, 2));

  console.log(`\n============================================================`);
  console.log(`  SNAPSHOT CAPTURE COMPLETE! Saved ${capturedManifest.length * 2} images.`);
  console.log(`  Output Directory: ${SCREENSHOT_DIR}`);
  console.log(`============================================================\n`);
}

captureAllScreens().catch(console.error);
