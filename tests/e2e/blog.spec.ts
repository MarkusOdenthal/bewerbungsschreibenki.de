import { expect, test } from '@playwright/test';

test.describe('Blog', () => {
  test('should load blog listing', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('article, [class*="post"]').first()).toBeVisible();
  });

  test('should navigate to a blog post', async ({ page }) => {
    await page.goto('/blog');
    const firstPost = page.locator('a[href*="/"]').filter({ hasText: /.+/ }).first();
    const href = await firstPost.getAttribute('href');
    if (href) {
      await firstPost.click();
      await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  test('blog post should have title and content', async ({ page }) => {
    const response = await page.goto('/getting-started');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article, .prose').first()).toBeVisible();
  });
});
