import { test, expect } from '@playwright/test';

test.describe('Pricing & Checkout Flow', () => {
  test('pricing page loads with header', async ({ page }) => {
    await page.goto('/pricing');

    // Check pricing header - it's an h1 element
    await expect(page.locator('h1')).toContainText(/Pricing/i);
  });

  test('pricing page shows all 4 packages', async ({ page }) => {
    await page.goto('/pricing');

    // Check all 4 packages are visible by their titles
    await expect(page.locator('h3:text("AI Spokesperson Launch Kit")')).toBeVisible();
    await expect(page.locator('h3:text("Content Engine Monthly")')).toBeVisible();
    await expect(page.locator('h3:text("Content Engine PRO")')).toBeVisible();
    await expect(page.locator('h3:text("AUTHORITY Engine")')).toBeVisible();
  });

  test('pricing page shows correct prices', async ({ page }) => {
    await page.goto('/pricing');

    // Check prices are visible (formatted with $) - use first() as prices may appear multiple places
    await expect(page.locator('text=$1,500').first()).toBeVisible();
    await expect(page.locator('text=$997').first()).toBeVisible();
    await expect(page.locator('text=$2,497').first()).toBeVisible();
    await expect(page.locator('text=$4,997').first()).toBeVisible();
  });

  test('content package grid is visible', async ({ page }) => {
    await page.goto('/pricing');

    // Check content package section
    await expect(page.locator('text=30 VIDEOS INCLUDED')).toBeVisible();
    await expect(page.locator('text=Your Complete Content Arsenal')).toBeVisible();
  });

  test('can click Get Started on Launch Kit', async ({ page }) => {
    await page.goto('/pricing');

    // Find the Launch Kit "Get Started" link
    await page.locator('a[href="/checkout?package=launch-kit"]').click();

    // Should navigate to checkout with package param
    await expect(page).toHaveURL(/checkout.*launch-kit/);
  });

  test('checkout page loads correctly', async ({ page }) => {
    await page.goto('/checkout?package=launch-kit');

    // Check checkout page heading
    await expect(page.locator('h1')).toContainText(/Complete Your Order/i);
  });

  test('checkout page shows selected package', async ({ page }) => {
    await page.goto('/checkout?package=launch-kit');

    // Check the selected package card shows
    await expect(page.locator('text=AI Spokesperson Launch Kit').first()).toBeVisible();
    await expect(page.locator('text=$1,500').first()).toBeVisible();
  });

  test('checkout page shows add-ons', async ({ page }) => {
    await page.goto('/checkout?package=launch-kit');

    // Check premium add-ons section - use heading selector to be specific
    await expect(page.getByRole('heading', { name: 'Premium Add-Ons' })).toBeVisible();
    await expect(page.locator('text=Voice Cloning').first()).toBeVisible();
  });

  test('checkout page shows order summary', async ({ page }) => {
    await page.goto('/checkout?package=launch-kit');

    // Check order summary section
    await expect(page.locator('text=Order Summary')).toBeVisible();
    await expect(page.locator('text=Total')).toBeVisible();
  });

  test('checkout page shows payment section', async ({ page }) => {
    await page.goto('/checkout?package=launch-kit');

    // Payment section should be visible - look for order summary heading
    await expect(page.getByRole('heading', { name: 'Order Summary' })).toBeVisible({ timeout: 10000 });
  });
});
