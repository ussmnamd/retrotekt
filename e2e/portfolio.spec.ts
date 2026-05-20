import { test, expect } from '@playwright/test';

test.describe('Portfolio page', () => {
  test('page loads and contains project names in HTML', async ({ page }) => {
    const response = await page.goto('/portfolio');
    expect(response?.status()).toBe(200);
    const html = await page.content();
    expect(html).toContain('Chocolate Fish');
  });

  test('all three project slugs resolve to 200', async ({ page }) => {
    const slugs = [
      '/portfolio/chocolate-fish-modesto',
      '/portfolio/chocolate-fish-livermore',
      '/portfolio/chocolate-fish-sacramento',
    ];
    for (const slug of slugs) {
      const response = await page.goto(slug);
      expect(response?.status()).toBe(200);
    }
  });

  test('flagship project page contains project name', async ({ page }) => {
    await page.goto('/portfolio/chocolate-fish-modesto');
    await expect(page.locator('body')).toContainText('Modesto');
  });

  test('filter buttons are visible', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.getByText('All', { exact: true }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Renders', { exact: true }).first()).toBeVisible();
  });
});
