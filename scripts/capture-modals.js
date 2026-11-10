const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\d02ca969-bf82-484f-9595-f6790db8ef7f\\screenshots';

async function captureModals() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark'
  });
  const page = await context.newPage();

  // 1. Capture Admission Offer Letter Modal
  console.log('Navigating to /crm/admissions to open Offer Letter modal...');
  await page.goto('http://localhost:3004/crm/admissions', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const viewOfferBtn = page.locator('button:has-text("View Offer Letter")').first();
  if (await viewOfferBtn.isVisible()) {
    await viewOfferBtn.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'crm_admission_offer_letter_modal.png'), fullPage: false });
    console.log('Saved crm_admission_offer_letter_modal.png');
  }

  // 2. Capture Printable Tax Invoice Modal
  console.log('Navigating to /crm/invoices to open Tax Invoice modal...');
  await page.goto('http://localhost:3004/crm/invoices', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const viewInvoiceBtn = page.locator('button:has-text("View")').first();
  if (await viewInvoiceBtn.isVisible()) {
    await viewInvoiceBtn.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'crm_printable_tax_invoice_modal.png'), fullPage: false });
    console.log('Saved crm_printable_tax_invoice_modal.png');
  }

  await browser.close();
  console.log('Modal captures completed!');
}

captureModals().catch((err) => {
  console.error('Error in captureModals:', err);
  process.exit(1);
});
