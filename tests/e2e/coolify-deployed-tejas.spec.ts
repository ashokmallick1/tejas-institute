import { test, expect } from '@playwright/test';

/**
 * Playwright E2E Test Suite for Live Production Deployment via Coolify on OCI
 * Primary Custom Domain: https://tejas.bhashaai.in (Cloudflare Named Tunnel)
 * Coolify TryCloudflare / sslip.io overridable via process.env.TEST_URL
 * Infrastructure: Oracle Cloud (OCI aarch64 / Ampere Altra) + Coolify v4.7.5 + Traefik v3.7 + Cloudflared
 */

const COOLIFY_TEJAS_URL = process.env.TEST_URL || 'https://tejas.bhashaai.in';

test.describe('TEJAS Platform Live Deployment on Coolify/OCI (@TC_TEJAS_DEPLOY)', () => {

  test.beforeEach(async ({ page }) => {
    // Set active persona to admin to authorize privileged route guards
    await page.addInitScript(() => {
      localStorage.setItem('tejas_active_role', 'admin');
    });
  });

  test('@TC_TEJAS_DEPLOY_01: Verify Production Deployment Connectivity & HTTP 200', async ({ page }) => {
    const response = await page.goto(COOLIFY_TEJAS_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    expect(page.url()).toContain(new URL(COOLIFY_TEJAS_URL).hostname);

    if (COOLIFY_TEJAS_URL.includes('bhashaai.in') || COOLIFY_TEJAS_URL.includes('trycloudflare.com')) {
      expect(response!.headers()['server']?.toLowerCase()).toContain('cloudflare');
    }

    const title = await page.title();
    expect(title).toContain('TEJAS | Institute of Advanced Technology');
  });

  test('@TC_TEJAS_DEPLOY_02: Verify Homepage Hero, Marquee, & Institutional Brand', async ({ page }) => {
    await page.goto(COOLIFY_TEJAS_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // Verify institutional brand presence
    await expect(page.getByText('TEJAS').first()).toBeVisible();
    await expect(page.getByText('Bhubaneswar, Odisha', { exact: false }).first()).toBeVisible();

    // Verify primary navigation and CTAs
    const exploreProgramsBtn = page.getByRole('link', { name: /Explore Programs/i }).first();
    await expect(exploreProgramsBtn).toBeVisible();
  });

  test('@TC_TEJAS_DEPLOY_03: Verify 18 Academic Programs Across 6 Schools (/programs)', async ({ page }) => {
    const response = await page.goto(`${COOLIFY_TEJAS_URL}/programs`, { waitUntil: 'networkidle', timeout: 30000 });
    expect(response!.status()).toBe(200);

    // Verify program catalog heading
    await expect(page.getByText('18 Comprehensive Specializations', { exact: false }).first()).toBeVisible();

    // Verify core program specializations are present
    await expect(page.getByText('AI Engineering & Generative AI', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Agentic AI & AI Automation Engineering', { exact: false }).first()).toBeVisible();
  });

  test('@TC_TEJAS_DEPLOY_04: Verify Twenty AI Admissions CRM Kanban Pipeline (/crm)', async ({ page }) => {
    const response = await page.goto(`${COOLIFY_TEJAS_URL}/crm`, { waitUntil: 'networkidle', timeout: 30000 });
    expect(response!.status()).toBe(200);

    // Verify CRM pipeline stages
    await expect(page.getByText('New Inquiries', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Enrolled Fellows', { exact: false }).first()).toBeVisible();
  });

  test('@TC_TEJAS_DEPLOY_05: Verify Indian GST Invoicing Ledger (/crm/invoices)', async ({ page }) => {
    const response = await page.goto(`${COOLIFY_TEJAS_URL}/crm/invoices`, { waitUntil: 'networkidle', timeout: 30000 });
    expect(response!.status()).toBe(200);

    // Verify GST compliance details (SAC 9992, CGST 9% + SGST 9%)
    await expect(page.getByText('Tax Invoices', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('SAC 9992', { exact: false }).first()).toBeVisible();
  });

  test('@TC_TEJAS_DEPLOY_06: Verify Scaler-Style Live Classroom Studio (/dashboard/student/live/live-vllm-01)', async ({ page }) => {
    const response = await page.goto(`${COOLIFY_TEJAS_URL}/dashboard/student/live/live-vllm-01`, { waitUntil: 'networkidle', timeout: 30000 });
    expect(response!.status()).toBe(200);

    // Verify studio components: Stream, Doubts, Chat, GPU Code Sandbox, Notes
    await expect(page.getByRole('heading', { name: /vLLM & PagedAttention/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Doubts/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Chat/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Code/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Notes/i }).first()).toBeVisible();
  });

  test('@TC_TEJAS_DEPLOY_07: Verify QA Command Center & Tester Activity (/test-data & /tester-activity)', async ({ page }) => {
    // Check QA Command Center
    const qaResponse = await page.goto(`${COOLIFY_TEJAS_URL}/test-data`, { waitUntil: 'networkidle', timeout: 30000 });
    expect(qaResponse!.status()).toBe(200);
    await expect(page.getByRole('heading', { name: /QA Command Center/i })).toBeVisible();

    // Check Tester Activity Monitor
    const activityResponse = await page.goto(`${COOLIFY_TEJAS_URL}/tester-activity`, { waitUntil: 'networkidle', timeout: 30000 });
    expect(activityResponse!.status()).toBe(200);
    await expect(page.getByRole('heading', { name: /Tester Activity Monitor/i })).toBeVisible();
  });

});
