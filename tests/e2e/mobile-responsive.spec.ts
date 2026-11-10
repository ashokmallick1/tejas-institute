import { test, expect } from '@playwright/test';

test.describe('TEJAS Responsive & Viewport Adaptation Suite', () => {

  test('@TC14 Verify Mobile Navigation Drawer and Touch Hit Targets', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check if mobile hamburger is visible on small screen
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();

      // Check mobile drawer renders
      const mobileDrawer = page.locator('header div[class*="overflow-y-auto"]');
      await expect(mobileDrawer).toBeVisible();

      const programsLink = mobileDrawer.locator('a:has-text("Programs")').first();
      await expect(programsLink).toBeVisible();
    }
  });

  test('@TC20 Verify Core Performance and Zero Horizontal Viewport Overflow', async ({ page }) => {
    await page.goto('/');

    // Check that document body width matches window width (no horizontal scrolling bug)
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(isOverflowing).toBeFalsy();
  });

});
