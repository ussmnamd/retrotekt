import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/',            canonical: 'https://www.retrotekt.com' },
  { path: '/services',   canonical: 'https://www.retrotekt.com/services' },
  { path: '/portfolio',  canonical: 'https://www.retrotekt.com/portfolio' },
  { path: '/consulting', canonical: 'https://www.retrotekt.com/consulting' },
];

test.describe('SEO — canonical tags', () => {
  for (const { path, canonical } of PAGES) {
    test(`${path} has correct canonical`, async ({ page }) => {
      await page.goto(path);
      const canonicalHref = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonicalHref).toBe(canonical);
    });
  }
});

test.describe('SEO — meta robots', () => {
  test('homepage is indexable', async ({ page }) => {
    await page.goto('/');
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute('content');
    expect(robots).toContain('index');
    expect(robots).toContain('follow');
  });
});

test.describe('SEO — OG tags', () => {
  test('homepage has og:title and og:image', async ({ page }) => {
    await page.goto('/');
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content');
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(ogTitle).toBeTruthy();
    expect(ogImage).toBeTruthy();
  });
});

test.describe('SEO — sitemap', () => {
  test('sitemap.xml is accessible and contains www URLs', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain('www.retrotekt.com');
  });
});

test.describe('SEO — robots.txt', () => {
  test('robots.txt allows all and points to sitemap', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain('Allow');
    expect(content).toContain('sitemap');
  });
});

test.describe('SEO — portfolio images', () => {
  test('project images use descriptive alt text', async ({ page }) => {
    await page.goto('/portfolio/chocolate-fish-modesto');

    await expect(
      page.getByAltText(
        'Photorealistic 3D interior render of Chocolate Fish Cafe Modesto California, view 1'
      )
    ).toBeAttached();

    const genericAltCount = await page
      .locator('img[alt^="Chocolate Fish"][alt*="render "]')
      .count();
    expect(genericAltCount).toBe(0);
  });
});

test.describe('SEO — footer crawl links', () => {
  test('footer exposes clean service and portfolio hrefs', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('footer a[href="/services#renders"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/services#walkthroughs"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/services#floor-plans"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/portfolio"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/consulting"]')).toHaveCount(1);
  });
});
