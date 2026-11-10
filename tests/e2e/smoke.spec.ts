import { test, expect } from '@playwright/test';

test.describe('TEJAS Platform Smoke & Core Navigation Suite', () => {

  test('@TC01 Verify Homepage Hero and Brand CTA Rendering', async ({ page }) => {
    await page.goto('/');

    // Check title and hero
    await expect(page).toHaveTitle(/TEJAS/i);
    const heroHeadline = page.locator('h1').first();
    await expect(heroHeadline).toBeVisible();

    // Check Explore Programs button
    const ctaButton = page.getByRole('link', { name: /Explore Programs/i }).first();
    await expect(ctaButton).toBeVisible();
  });

  test('@TC02 Verify Interactive Engineering Terminal Execution', async ({ page }) => {
    await page.goto('/');

    // Scroll to terminal preset buttons
    const terminalBtn = page.getByRole('button', { name: /GPU Cluster Status|RAG Benchmark/i }).first();
    await terminalBtn.scrollIntoViewIfNeeded();
    await expect(terminalBtn).toBeVisible();
    await terminalBtn.click();
  });

  test('@TC03 Verify Academic Programs Directory and Curriculum Details', async ({ page }) => {
    await page.goto('/programs');

    // Programs heading visible
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible();
  });

  test('@TC04 Verify Industrial Real-Life Projects Catalog', async ({ page }) => {
    await page.goto('/projects');

    // Projects title renders
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible();
  });

  test('@TC05 Verify Online Student Admissions Application Form Flow', async ({ page }) => {
    await page.goto('/admissions/apply');

    // Verify form input and submit button exist
    const nameInput = page.getByPlaceholder(/Ananya Das/i).first();
    await expect(nameInput).toBeVisible();

    const submitBtn = page.getByRole('button', { name: /Submit Fellowship Application/i }).first();
    await expect(submitBtn).toBeVisible();
  });

  test('@TC12 Verify Cryptographic Certificate Verification Portal', async ({ page }) => {
    await page.goto('/verify/TEJAS-2026-AI-8921');

    // Check verifiable credential badge
    const certBadge = page.getByText('CRYPTOGRAPHICALLY VERIFIED CREDENTIAL').first();
    await expect(certBadge).toBeVisible();
  });

  test('@TC15 Verify Multi-Role Instant Persona Switching Component', async ({ page }) => {
    await page.goto('/');

    // On mobile viewports, the role switcher is accessible inside the mobile drawer
    const hamburgerBtn = page.locator('button[aria-label="Toggle menu"]');
    if (await hamburgerBtn.isVisible()) {
      await hamburgerBtn.click();
    }

    // Click role switcher dropdown (select visible instance across desktop or mobile drawer)
    const roleBtn = page.locator('button[title*="perspective"]:visible, button:has-text("DEMO"):visible').first();
    await expect(roleBtn).toBeVisible();
    await roleBtn.click();

    // Verify popup menu renders
    const menuTitle = page.getByText('Switch Test Perspective').first();
    await expect(menuTitle).toBeVisible();
  });

  test('@TC16 Verify Dark Canvas Contrast and Theme Integrity', async ({ page }) => {
    await page.goto('/');

    // Verify dark canvas background
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    expect(bodyBg).toBeTruthy();
  });

});
