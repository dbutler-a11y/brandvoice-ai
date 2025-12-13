import { test, expect } from '@playwright/test';

test.describe('Footer Navigation', () => {
  test('footer has all required links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check Pages section links
    await expect(page.locator('footer a[href="/how-it-works"]')).toBeVisible();
    await expect(page.locator('footer a[href="/pricing"]')).toBeVisible();
    await expect(page.locator('footer a[href="/portfolio"]')).toBeVisible();
    await expect(page.locator('footer a[href="/faq"]')).toBeVisible();
    await expect(page.locator('footer a[href="/contact"]')).toBeVisible();

    // Check Account section links
    await expect(page.locator('footer a[href="/portal"]')).toBeVisible();
    await expect(page.locator('footer a[href="/terms"]')).toBeVisible();
    await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
  });

  test('footer shows copyright', async ({ page }) => {
    await page.goto('/');

    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check copyright text
    await expect(page.locator('footer')).toContainText('2025');
    await expect(page.locator('footer')).toContainText('BrandVoice.AI');
  });

  test('footer has Book a Call button', async ({ page }) => {
    await page.goto('/');

    await page.locator('footer').scrollIntoViewIfNeeded();

    await expect(page.locator('footer a[href="/#book-call"]')).toBeVisible();
  });
});

test.describe('FAQ Page', () => {
  test('FAQ page loads', async ({ page }) => {
    await page.goto('/faq');

    // Check for FAQ content - page should load without error
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Portfolio Page', () => {
  test('portfolio page loads with heading', async ({ page }) => {
    await page.goto('/portfolio');

    // Check main heading
    await expect(page.locator('h1')).toContainText(/Action/i);
  });

  test('portfolio page has industry filters', async ({ page }) => {
    await page.goto('/portfolio');

    // Check filter buttons exist - use exact match to avoid matching cookie banner buttons
    await expect(page.getByRole('button', { name: 'All', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Med Spa' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Real Estate' })).toBeVisible();
  });

  test('portfolio page shows video cards', async ({ page }) => {
    await page.goto('/portfolio');

    // Check that video cards with play buttons exist
    const videoCards = page.locator('.group.cursor-pointer');
    await expect(videoCards.first()).toBeVisible();
  });
});

test.describe('How It Works Page', () => {
  test('how it works page loads', async ({ page }) => {
    await page.goto('/how-it-works');

    // Page should load without error
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });
});
