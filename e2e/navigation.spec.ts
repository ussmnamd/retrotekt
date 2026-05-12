import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Retrotekt/);
  });

  test('/services loads', async ({ page }) => {
    await page.goto('/services');
    await expect(page).toHaveTitle(/Services|Retrotekt/i);
    expect(page.url()).toContain('/services');
  });

  test('/portfolio loads', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page).toHaveTitle(/Portfolio|Retrotekt/i);
  });

  test('/consulting loads', async ({ page }) => {
    await page.goto('/consulting');
    await expect(page).toHaveTitle(/Consulting|Retrotekt/i);
  });

  test('/nonexistent returns branded 404', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-xyz');
    expect(response?.status()).toBe(404);
    await expect(page.locator('body')).toContainText('404');
  });

  test('portfolio slug pages load', async ({ page }) => {
    await page.goto('/portfolio/chocolate-fish-modesto');
    await expect(page).toHaveTitle(/Chocolate Fish.*Modesto|Retrotekt/i);
  });
});
