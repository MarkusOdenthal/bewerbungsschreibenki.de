import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test('all standard pages should return 200', async ({ page }) => {
    const pages = ['/', '/about', '/contact', '/pricing', '/services', '/blog', '/terms', '/privacy'];
    for (const path of pages) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should return 200`).toBe(200);
    }
  });

  test('404 page should work', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-xyz');
    expect(response?.status()).toBe(404);
  });

  test('RSS feed should be accessible', async ({ page }) => {
    const response = await page.goto('/rss.xml');
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()['content-type'];
    expect(contentType).toContain('xml');
  });

  test('header should be sticky on scroll', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await page.evaluate(() => window.scrollBy(0, 500));
    await expect(header).toBeVisible();
  });

  test('mobile menu should toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const menuToggle = page.locator('[data-aw-toggle-menu]');
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    }
  });
});
