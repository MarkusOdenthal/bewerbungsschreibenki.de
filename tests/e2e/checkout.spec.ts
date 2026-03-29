import { expect, test } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('pricing page should load', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveTitle(/Pricing/i);
  });

  test('pricing page should have payment link', async ({ page }) => {
    await page.goto('/pricing');
    const buyLink = page
      .locator('a.btn-primary')
      .filter({ hasText: /get started/i })
      .first();
    await expect(buyLink).toBeVisible();
  });

  test('success page should show email instructions', async ({ page }) => {
    await page.goto('/success');
    await expect(page.getByText(/check your email/i)).toBeVisible();
  });
});
