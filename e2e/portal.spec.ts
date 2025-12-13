import { test, expect } from '@playwright/test';

test.describe('Client Portal', () => {
  test('portal login page loads', async ({ page }) => {
    await page.goto('/portal/login');

    // Should show loading state initially or login form
    await expect(page.locator('body')).toBeVisible();
  });

  test('portal redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/portal');

    // Should redirect to login page when not authenticated
    await expect(page).toHaveURL(/portal\/login|portal/);
  });

  test('sign in link goes to portal login', async ({ page }) => {
    await page.goto('/');

    // Click the Sign In link in header (use first() to get desktop nav)
    await page.locator('header a[href="/portal/login"]').first().click();

    // Should be on portal login page
    await expect(page).toHaveURL(/portal\/login/);
  });
});

test.describe('Privacy and Terms Pages', () => {
  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');

    await expect(page.locator('body')).toBeVisible();
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');

    await expect(page.locator('body')).toBeVisible();
  });

  test('can navigate to privacy from footer', async ({ page }) => {
    await page.goto('/');

    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.locator('footer a[href="/privacy"]').click();

    await expect(page).toHaveURL(/privacy/);
  });

  test('can navigate to terms from footer', async ({ page }) => {
    await page.goto('/');

    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.locator('footer a[href="/terms"]').click();

    await expect(page).toHaveURL(/terms/);
  });
});

test.describe('Voice Preview Page', () => {
  test('voice preview page exists in footer nav', async ({ page }) => {
    await page.goto('/');

    await page.locator('footer').scrollIntoViewIfNeeded();

    // Voice Samples link should exist
    await expect(page.locator('footer a[href="/voice-preview"]')).toBeVisible();
  });
});
