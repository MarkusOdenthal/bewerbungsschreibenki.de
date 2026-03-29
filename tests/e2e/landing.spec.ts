import { expect, test } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Your Product Name/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('[data-widget="hero"], section').first();
    await expect(hero).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    const pricingLink = page.getByRole('link', { name: /pricing/i }).first();
    await expect(pricingLink).toBeVisible();
  });

  test('should have dark mode toggle', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-aw-toggle-color-scheme]');
    if (await toggle.isVisible()) {
      await toggle.click();
      await expect(page.locator('html')).toHaveClass(/dark/);
    }
  });

  test('homepage variants should load', async ({ page }) => {
    const variants = ['/homes/saas', '/homes/startup', '/homes/personal', '/homes/mobile-app'];
    for (const variant of variants) {
      const response = await page.goto(variant);
      expect(response?.status()).toBe(200);
    }
  });

  test('landing page variants should load', async ({ page }) => {
    const variants = [
      '/landing/lead-generation',
      '/landing/sales',
      '/landing/click-through',
      '/landing/product',
      '/landing/pre-launch',
      '/landing/subscription'
    ];
    for (const variant of variants) {
      const response = await page.goto(variant);
      expect(response?.status()).toBe(200);
    }
  });
});
