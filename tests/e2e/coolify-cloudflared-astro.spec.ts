import { test, expect } from '@playwright/test';

/**
 * Playwright E2E Test Suite for Cloudflared URL from Coolify Project
 * Target URL: https://astro.bhashaai.in
 * Infrastructure: Oracle Cloud (OCI aarch64) + Coolify v4.7.5 + Cloudflare Tunnel
 */

const CLOUDFLARED_URL = 'https://astro.bhashaai.in';

test.describe('Coolify Project Cloudflared URL E2E Verification (@TC_COOLIFY)', () => {

  test('@TC_COOLIFY_01: Verify Cloudflare Tunnel Connectivity & HTTP 200 Response', async ({ page }) => {
    const response = await page.goto(CLOUDFLARED_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    // Verify Cloudflare CDN edge headers or document readiness
    const title = await page.title();
    expect(title).toContain('Vedic Astro API');
  });

  test('@TC_COOLIFY_02: Validate SPA Root Render & Brand Typography', async ({ page }) => {
    await page.goto(CLOUDFLARED_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // Verify root container is mounted
    const root = page.locator('#root');
    await expect(root).toBeVisible();

    // Verify institutional brand presence
    const brandHeading = page.getByText('Jagannath Astro AI', { exact: false });
    await expect(brandHeading.first()).toBeVisible();

    const subtitle = page.getByText('Authentic Vedic Astrology powered by Swiss Ephemeris', { exact: false });
    await expect(subtitle.first()).toBeVisible();
  });

  test('@TC_COOLIFY_03: Verify Core Astrological Architectural Badges', async ({ page }) => {
    await page.goto(CLOUDFLARED_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // Validate the 3 core capability badges
    const badgeParashari = page.getByText('Parashari System');
    const badgeDasha = page.getByText('120-Year Dasha');
    const badgeMatching = page.getByText('36-Guna Matching');

    await expect(badgeParashari.first()).toBeVisible();
    await expect(badgeDasha.first()).toBeVisible();
    await expect(badgeMatching.first()).toBeVisible();
  });

  test('@TC_COOLIFY_04: Verify Authentication Interface & Form Fields', async ({ page }) => {
    await page.goto(CLOUDFLARED_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // Verify Welcome back header
    await expect(page.getByText('Welcome back').first()).toBeVisible();

    // Verify Form Inputs
    const usernameInput = page.locator('input[type="text"], input[name="username"], input[placeholder*="Username"], input[placeholder*="Mobile"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitBtn = page.getByRole('button', { name: /Sign In/i });

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // Verify user can interact with inputs
    await usernameInput.fill('test_user@bhashaai.in');
    await expect(usernameInput).toHaveValue('test_user@bhashaai.in');

    await passwordInput.fill('SecurePassword123');
    await expect(passwordInput).toHaveValue('SecurePassword123');
  });

  test('@TC_COOLIFY_05: Verify Health API Endpoint /v1/health', async ({ request }) => {
    const response = await request.get(`${CLOUDFLARED_URL}/v1/health`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('healthy');
    expect(body.version).toBeDefined();
    expect(body.availableServices).toBeInstanceOf(Array);
    expect(body.availableServices.length).toBeGreaterThan(5);

    // Verify key microservices are declared
    expect(body.availableServices).toContain('POST /v1/charts/calculate');
    expect(body.availableServices).toContain('POST /v1/panchang');
    expect(body.availableServices).toContain('POST /v1/matchmaking');
  });

  test('@TC_COOLIFY_06: Verify Interactive API Documentation /docs Endpoint', async ({ page }) => {
    const response = await page.goto(`${CLOUDFLARED_URL}/docs`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
  });

  test('@TC_COOLIFY_07: Multi-Device Mobile & Desktop Rendering', async ({ page }) => {
    await page.goto(CLOUDFLARED_URL, { waitUntil: 'networkidle', timeout: 30000 });

    // Ensure no horizontal scrollbar overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // 2px margin of error for subpixel rendering
  });

});
