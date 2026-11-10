const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\d02ca969-bf82-484f-9595-f6790db8ef7f\\screenshots';

async function capture() {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile Phone (iPhone 13 - 390x844) - Homepage with Docked Mobile Bottom Nav
  console.log('Capturing mobile homepage with bottom nav...');
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
  });
  const mPage = await mobileCtx.newPage();
  await mPage.goto('http://localhost:3004/', { waitUntil: 'networkidle', timeout: 30000 });
  await mPage.waitForTimeout(1200);
  await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_docked_bottom_nav.png'), fullPage: false });
  console.log('Saved mobile_docked_bottom_nav.png');

  // 2. Mobile Menu Bottom Sheet (Click "More" in bottom nav)
  console.log('Opening mobile bottom sheet menu...');
  const moreBtn = mPage.locator('button[aria-label="Open More Menu"]').first();
  if (await moreBtn.isVisible()) {
    await moreBtn.click();
    await mPage.waitForTimeout(1000);
    await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile_bottom_sheet_menu.png'), fullPage: false });
    console.log('Saved mobile_bottom_sheet_menu.png');
  }

  // 3. Privileged Access Gate (Simulate visiting /crm while role is STUDENT)
  console.log('Capturing Privileged Access Gate...');
  const gateCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const gatePage = await gateCtx.newPage();
  // Set localStorage active role to 'student' before loading /crm
  await gatePage.addInitScript(() => {
    localStorage.setItem('tejas_active_role', 'student');
  });
  await gatePage.goto('http://localhost:3004/crm', { waitUntil: 'networkidle', timeout: 30000 });
  await gatePage.waitForTimeout(1200);
  await gatePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'privileged_access_gate_desktop.png'), fullPage: false });
  console.log('Saved privileged_access_gate_desktop.png');

  // 4. Staff Privileged Bar on Public Homepage (when logged in as ADMIN)
  console.log('Capturing Staff Privileged Bar on Homepage...');
  const adminCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const adminPage = await adminCtx.newPage();
  await adminPage.addInitScript(() => {
    localStorage.setItem('tejas_active_role', 'admin');
  });
  await adminPage.goto('http://localhost:3004/', { waitUntil: 'networkidle', timeout: 30000 });
  await adminPage.waitForTimeout(1200);
  await adminPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'staff_privileged_bar_homepage.png'), fullPage: false });
  console.log('Saved staff_privileged_bar_homepage.png');

  await browser.close();
  console.log('All privileged and mobile captures completed!');
}

capture().catch((err) => {
  console.error('Error capturing:', err);
  process.exit(1);
});
