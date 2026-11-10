import { test, expect } from '@playwright/test';

test.describe('TEJAS Scaler-Style Live Classroom & Interactive Studio Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('tejas_active_role', 'student');
      localStorage.setItem('tejas_user_id', 'user-student-01');
    });
  });

  test('@TC_LIVE_01 Verify Live Classes Timetable Hub & Active Session Card', async ({ page }) => {
    await page.goto('/dashboard/student/live');

    // Page title and live pill
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Live Interactive Classes/i);
    await expect(page.locator('text=HAPPENING NOW').first()).toBeVisible();

    // Verify upcoming sessions schedule list
    await expect(page.locator('text=Upcoming Live Schedule').first()).toBeVisible();
    await expect(page.locator('text=Forward Deployment Architecture').first()).toBeVisible();

    // Verify recordings archive section
    await expect(page.locator('text=Class Recordings & Handouts Archive').first()).toBeVisible();
  });

  test('@TC_LIVE_02 Verify Live Classroom Studio Video Ingress & Multi-Tab Interface', async ({ page }) => {
    await page.goto('/dashboard/student/live/live-vllm-01');

    // Verify stream video element
    const video = page.locator('video');
    await expect(video).toBeVisible();

    // Verify Live Stream HUD & active viewers count
    await expect(page.locator('text=LIVE STREAM').first()).toBeVisible();
    await expect(page.locator('text=Fellows Watching').first()).toBeVisible();

    // Verify attendance logger button or badge
    const attendanceBtn = page.locator('button:has-text("Log Attendance"), div:has-text("Attendance Logged")').first();
    await expect(attendanceBtn).toBeVisible();

    // Verify Scaler multi-tab navigation pills: Doubts, Chat, Code, Notes
    await expect(page.locator('button:has-text("Doubts")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Chat")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Code")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Notes")').first()).toBeVisible();
  });

  test('@TC_LIVE_03 Verify Live Doubts Queue, Upvoting & In-Class Question Submission', async ({ page }) => {
    await page.goto('/dashboard/student/live/live-vllm-01');

    // Doubts tab should be active by default
    await expect(page.locator('text=Live Doubt Queue').first()).toBeVisible();

    // Verify pre-seeded doubt from fellow
    await expect(page.locator('text=Rohan Patnaik').first()).toBeVisible();
    await expect(page.locator('button[title*="I have this doubt too"]').first()).toBeVisible();

    // Upvote a doubt
    const upvoteBtn = page.locator('button[title*="I have this doubt too"]').first();
    await upvoteBtn.click();

    // Ask a new doubt
    const input = page.locator('input[placeholder*="Ask a doubt"]');
    await expect(input).toBeVisible();
    await input.fill('Is PagedAttention backward compatible with vLLM continuous batching?');
    await page.locator('button:has-text("Ask")').click();

    // Verify toast or new item added
    await expect(page.locator('text=Is PagedAttention backward compatible').first()).toBeVisible();
  });

  test('@TC_LIVE_04 Verify In-Class Coding Sandbox Execution on GPU Cluster', async ({ page }) => {
    await page.goto('/dashboard/student/live/live-vllm-01');

    // Switch to Code Sandbox tab
    const codeTabBtn = page.locator('button:has-text("Code")').first();
    await codeTabBtn.click();

    // Verify sandbox editor and initial code
    await expect(page.locator('text=paged_kv_cache.py').first()).toBeVisible();

    // Click "Run Code"
    const runBtn = page.locator('button:has-text("Run Code")').first();
    await expect(runBtn).toBeVisible();
    await runBtn.click();

    // Verify terminal output stdout updates
    await expect(page.locator('text=Bhubaneswar Cluster Output').first()).toBeVisible();
    await expect(page.locator('text=Allocated physical block IDs').first()).toBeVisible({ timeout: 5000 });
  });

  test('@TC_LIVE_05 Verify Fastest-Finger-First Live Poll Pop-up and Voting Breakdown', async ({ page }) => {
    await page.goto('/dashboard/student/live/live-vllm-01');

    // Poll overlay should be active
    const pollHeading = page.locator('text=FACULTY LIVE POP QUIZ').first();
    await expect(pollHeading).toBeVisible();

    // Select Option A and vote
    const optionA = page.locator('button:has-text("Internal fragmentation")').first();
    await expect(optionA).toBeVisible();
    await optionA.click();

    // Submit live vote
    const submitBtn = page.locator('button:has-text("Submit Live Vote")').first();
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Verify results bar chart is revealed
    await expect(page.locator('text=Vote Recorded!').first()).toBeVisible();
  });

});
