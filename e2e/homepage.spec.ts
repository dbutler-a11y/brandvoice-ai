import { test, expect } from '@playwright/test';

test.describe('Homepage & Navigation', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/BrandVoice/i);

    // Check main content loads
    await expect(page.locator('main')).toBeVisible();
  });

  test('hero video loads', async ({ page }) => {
    await page.goto('/');

    // Check that hero video exists with autoplay attributes
    const heroVideo = page.locator('video[autoplay]').first();
    await expect(heroVideo).toBeVisible({ timeout: 10000 });
  });

  test('navigation links are visible', async ({ page }) => {
    await page.goto('/');

    // Test main nav links exist using exact href selectors
    await expect(page.locator('a[href="/pricing"]').first()).toBeVisible();
    await expect(page.locator('a[href="/how-it-works"]').first()).toBeVisible();
    await expect(page.locator('a[href="/portfolio"]').first()).toBeVisible();
  });

  test('can navigate to pricing page', async ({ page }) => {
    await page.goto('/');

    // Click pricing link in header nav (use first() to get desktop nav, not mobile)
    await page.locator('header a[href="/pricing"]').first().click();

    // Verify we're on pricing page
    await expect(page).toHaveURL(/pricing/);
    await expect(page.locator('h1')).toContainText(/Pricing/i);
  });

  test('can navigate to how it works page', async ({ page }) => {
    await page.goto('/');

    await page.locator('header a[href="/how-it-works"]').first().click();

    await expect(page).toHaveURL(/how-it-works/);
  });

  test('can navigate to portfolio/examples page', async ({ page }) => {
    await page.goto('/');

    // The nav link text says "Examples" but goes to /portfolio
    await page.locator('header a[href="/portfolio"]').first().click();

    await expect(page).toHaveURL(/portfolio/);
  });

  test('footer links are present', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check footer has key links (footer uses specific href paths)
    await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
    await expect(page.locator('footer a[href="/terms"]')).toBeVisible();
  });

  test('voice agent widget loads', async ({ page }) => {
    await page.goto('/');

    // The Samira AI assistant widget appears as a button with her image
    const widget = page.locator('button img[alt*="Samira"]').first();
    await expect(widget).toBeVisible({ timeout: 15000 });
  });

  test('hero section has call-to-action buttons', async ({ page }) => {
    await page.goto('/');

    // Check for "Book a Call" and "See Pricing" buttons in hero
    await expect(page.locator('a[href="#book-call"]').first()).toBeVisible();
    await expect(page.locator('a[href="#pricing"]')).toBeVisible();
  });

  test('testimonials section loads', async ({ page }) => {
    await page.goto('/');

    // Check testimonials section with carousel
    await expect(page.locator('text=Trusted by Industry Leaders')).toBeVisible();
    await expect(page.locator('.embla')).toBeVisible();
  });
});
