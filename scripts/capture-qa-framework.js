const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\d02ca969-bf82-484f-9595-f6790db8ef7f\\screenshots';
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('1. Navigating to /test-data...');
  await page.goto('http://localhost:3002/test-data', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Check if gated by ProtectedQaRoute
  const switchBtn = page.locator('button:has-text("Switch to QA Tester Perspective")');
  if (await switchBtn.isVisible()) {
    console.log('Capturing ProtectedQaRoute authorization gate...');
    await page.screenshot({ path: path.join(screenshotsDir, 'qa_route_guard_gate.png'), fullPage: false });
    await switchBtn.click();
    await page.waitForTimeout(1000);
  }

  console.log('Capturing QA Command Center Tab 1: Execution & Feedback...');
  await page.screenshot({ path: path.join(screenshotsDir, 'qa_command_center_execution.png'), fullPage: false });

  console.log('2. Clicking Playbook tab in /test-data...');
  const playbookTab = page.locator('button:has-text("Tester Playbook")');
  await playbookTab.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotsDir, 'qa_command_center_playbook.png'), fullPage: false });

  console.log('3. Clicking Automation Framework tab in /test-data...');
  const automationTab = page.locator('button:has-text("Automation Framework")');
  await automationTab.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotsDir, 'qa_command_center_automation.png'), fullPage: false });

  console.log('4. Navigating to /tester-activity (Live Real-Time Telemetry Monitor)...');
  await page.goto('http://localhost:3002/tester-activity', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, 'qa_tester_activity_monitor.png'), fullPage: false });

  console.log('5. Clicking Inspect button on first activity row...');
  const inspectBtn = page.locator('button:has-text("Inspect")').first();
  if (await inspectBtn.isVisible()) {
    await inspectBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotsDir, 'qa_metadata_inspector_modal.png'), fullPage: false });
    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // Also take a mobile viewport screenshot of QA Command Center
  console.log('6. Taking mobile viewport of /test-data...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3002/test-data', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, 'qa_command_center_mobile.png'), fullPage: false });

  await browser.close();
  console.log('All QA screenshots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
