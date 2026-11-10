const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\d02ca969-bf82-484f-9595-f6790db8ef7f\\screenshots';

async function capture() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  
  // Desktop Context (1440x900)
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark'
  });
  const page = await desktopCtx.newPage();

  console.log('Navigating to /crm/admissions...');
  await page.goto('http://localhost:3004/crm/admissions', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'crm_admissions_desktop.png'), fullPage: false });
  console.log('Saved crm_admissions_desktop.png');

  console.log('Navigating to /crm/invoices...');
  await page.goto('http://localhost:3004/crm/invoices', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'crm_invoices_desktop.png'), fullPage: false });
  console.log('Saved crm_invoices_desktop.png');

  console.log('Navigating to /crm/fee-structures...');
  await page.goto('http://localhost:3004/crm/fee-structures', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'crm_fee_structures_desktop.png'), fullPage: false });
  console.log('Saved crm_fee_structures_desktop.png');

  console.log('Navigating to /crm and opening candidate drawer...');
  await page.goto('http://localhost:3004/crm', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  // Click first lead card
  const firstLead = page.locator('div[class*="cursor-pointer"]').first();
  if (await firstLead.isVisible()) {
    await firstLead.click();
    await page.waitForTimeout(1000);
    // Click Admission tab in drawer
    const admissionTab = page.locator('button:has-text("Admission")').first();
    if (await admissionTab.isVisible()) {
      await admissionTab.click();
      await page.waitForTimeout(800);
    }
  }
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'crm_pipeline_drawer_admission.png'), fullPage: false });
  console.log('Saved crm_pipeline_drawer_admission.png');

  // Mobile Context (390x844 - iPhone 13 / modern phone)
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark'
  });
  const mPage = await mobileCtx.newPage();

  console.log('Navigating mobile to /crm/admissions...');
  await mPage.goto('http://localhost:3004/crm/admissions', { waitUntil: 'networkidle', timeout: 30000 });
  await mPage.waitForTimeout(1000);
  await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'crm_admissions_mobile.png'), fullPage: false });
  console.log('Saved crm_admissions_mobile.png');

  console.log('Navigating mobile to /crm/invoices...');
  await mPage.goto('http://localhost:3004/crm/invoices', { waitUntil: 'networkidle', timeout: 30000 });
  await mPage.waitForTimeout(1000);
  await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'crm_invoices_mobile.png'), fullPage: false });
  console.log('Saved crm_invoices_mobile.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
