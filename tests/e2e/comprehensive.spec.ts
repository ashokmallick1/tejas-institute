import { test, expect } from '@playwright/test';

test.describe('TEJAS Enterprise Comprehensive Multi-Device & Network Interception Suite', () => {

  // ── 1. Public Routes & Navigation Smoke ──────────────────────────────────────────

  test('@TC_PUB_01 Verify Homepage Core Layout, Brand Header & CTAs', async ({ page }) => {
    await page.goto('/');

    // Validate brand logo and identity
    const brand = page.locator('text=TEJAS').first();
    await expect(brand).toBeVisible();

    // Verify main navigation links
    await expect(page.locator('a[href="/programs"]').first()).toBeVisible();
    await expect(page.locator('a[href="/projects"]').first()).toBeVisible();

    // Verify primary hero CTA
    const exploreCta = page.locator('a:has-text("Explore Programs")').first();
    await expect(exploreCta).toBeVisible();
  });

  test('@TC_PUB_02 Verify Global Quick Search Modal Trigger & Filtering', async ({ page }) => {
    await page.goto('/');

    // Trigger search modal via search icon button or Cmd+K
    const searchBtn = page.locator('button[title*="Search"], button[aria-label="Search"]').first();
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();

    // Verify search modal input opens
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await expect(searchInput).toBeVisible();

    // Type query
    await searchInput.fill('Forward Deployment');
    
    // Verify search results appear
    const resultItem = page.locator('text=Forward Deployment Engineer').first();
    await expect(resultItem).toBeVisible();
  });

  // ── 2. Network Mock Interception & Protected Routing ─────────────────────────────

  test('@TC_MOCK_AUTH_01 Intercept Supabase Auth & Verify Protected Fellow LMS Portal', async ({ page }) => {
    // Intercept Supabase auth session endpoints
    await page.route('**/auth/v1/session**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-jwt-fellow-token-2026',
          token_type: 'bearer',
          expires_in: 3600,
          user: {
            id: 'mock-fellow-uuid-001',
            email: 'ananya.das@tejas.ac.in',
            user_metadata: {
              full_name: 'Ananya Das',
              role: 'STUDENT',
              batch: 'TEJAS-2026-FDE-01',
            },
          },
        }),
      });
    });

    // Seed local storage with active role
    await page.addInitScript(() => {
      localStorage.setItem('tejas_active_role', 'student');
      localStorage.setItem('tejas_user_id', 'mock-fellow-uuid-001');
    });

    // Navigate to student dashboard
    await page.goto('/dashboard/student');

    // Verify greeting and progress indicators render
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Welcome back/i);
    await expect(page.locator('text=FELLOWSHIP IN PROGRESS').first()).toBeVisible();
    await expect(page.locator('text=Program Progress').first()).toBeVisible();
  });

  test('@TC_MOCK_API_02 Intercept Programs API with Mock Enterprise Curricula', async ({ page }) => {
    const mockPrograms = [
      {
        id: 'mock-ai-01',
        title: 'Mock Synthetic AI Engineering Fellowship',
        slug: 'mock-synthetic-ai-engineering',
        tagline: 'Intercepted Test Program for Automated Assertion',
        school_id: 'school-ai',
        school_name: 'School of Artificial Intelligence',
        fee_inr: 95000,
        duration: '24 Weeks',
        class_count: 36,
        badge: 'AUTOMATED MOCK',
        is_featured: true,
        tools: ['PyTorch', 'vLLM', 'Ray'],
        labs: ['Mock DGX Cluster Bench'],
        projects_count: 5,
      },
    ];

    // Intercept GET /api/v1/programs
    await page.route('**/api/v1/programs', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockPrograms,
          count: mockPrograms.length,
        }),
      });
    });

    // Trigger browser fetch to verify route interception in real page context
    await page.goto('/');
    const interceptedData = await page.evaluate(async () => {
      const res = await fetch('/api/v1/programs');
      return res.json();
    });

    expect(interceptedData.success).toBe(true);
    expect(interceptedData.data.length).toBe(1);
    expect(interceptedData.data[0].title).toBe('Mock Synthetic AI Engineering Fellowship');
  });

  // ── 3. Feature-Specific Form & Viewport Validation ───────────────────────────────

  test('@TC_FORM_01 Verify Fellowship Online Application Form Validation', async ({ page }) => {
    await page.goto('/admissions/apply');

    // Verify application form header
    await expect(page.getByRole('heading', { name: /Fellowship Application Form/i })).toBeVisible();

    // Fill form fields
    await page.locator('input[placeholder*="Ananya"]').fill('Debashish Mohanty');
    await page.locator('input[placeholder*="ananya@example.com"]').fill('debashish.test@tejas.ac.in');
    await page.locator('input[placeholder*="+91"]').fill('+91 94370 12345');
    await page.locator('input[placeholder*="Bhubaneswar"]').fill('Bhubaneswar, Odisha');

    // Submit button is active
    const submitBtn = page.getByRole('button', { name: /Submit Fellowship Application/i });
    await expect(submitBtn).toBeEnabled();
  });

  test('@TC_NAV_03 Verify Mobile Bottom Navigation Dock & Safe Bottom Padding', async ({ page }) => {
    await page.goto('/');

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      // Mobile bottom nav should be rendered on mobile viewports
      const bottomNav = page.locator('nav').filter({ hasText: /Home/i }).last();
      await expect(bottomNav).toBeVisible();
    } else {
      // Desktop should render main top navbar
      const desktopNav = page.locator('header nav').first();
      await expect(desktopNav).toBeVisible();
    }
  });

});
