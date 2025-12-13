import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('admin page redirects when not authenticated', async ({ page }) => {
    await page.goto('/admin');

    // Should redirect to portal login when not authenticated
    await expect(page).toHaveURL(/portal\/login/);
  });

  test('admin clients page redirects when not authenticated', async ({ page }) => {
    await page.goto('/admin/clients');

    await expect(page).toHaveURL(/portal\/login/);
  });

  test('admin CRM page redirects when not authenticated', async ({ page }) => {
    await page.goto('/admin/crm');

    await expect(page).toHaveURL(/portal\/login/);
  });

  test('admin spokespersons page redirects when not authenticated', async ({ page }) => {
    await page.goto('/admin/spokespersons');

    await expect(page).toHaveURL(/portal\/login/);
  });
});

test.describe('Public Pages Load', () => {
  test('how it works page loads', async ({ page }) => {
    await page.goto('/how-it-works');
    await expect(page.locator('main')).toBeVisible();
  });

  test('portfolio page loads', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.locator('main')).toBeVisible();
  });

  test('voice preview page loads', async ({ page }) => {
    await page.goto('/voice-preview');
    await expect(page.locator('main')).toBeVisible();
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.locator('body')).toBeVisible();
  });

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.locator('body')).toBeVisible();
  });
});
