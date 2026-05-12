import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/consulting');
    await page.waitForLoadState('networkidle');
  });

  test('form is present on the page', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
  });

  test('shows validation error when name is empty', async ({ page }) => {
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('I need architectural renders for my project.');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 8000 });
  });

  test('shows validation error when email is invalid', async ({ page }) => {
    await page.locator('#name').fill('John Smith');
    await page.locator('#email').fill('not-an-email');
    await page.locator('#message').fill('I need architectural renders for my project.');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 8000 });
  });

  test('shows validation error when message is empty', async ({ page }) => {
    await page.locator('#name').fill('John Smith');
    await page.locator('#email').fill('test@example.com');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 8000 });
  });

  test('submit button changes text while sending', async ({ page }) => {
    // Fill valid form
    await page.locator('#name').fill('John Smith');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('I need architectural renders for my project.');

    // Intercept the API call so it hangs — lets us catch the loading state
    await page.route('/api/contact', (route) => {
      // Delay response to observe loading state
      setTimeout(() => route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }), 2000);
    });

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('button[type="submit"]')).toContainText(/Sending/i);
  });

  test('shows success state after successful submission', async ({ page }) => {
    await page.locator('#name').fill('John Smith');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('I need architectural renders for my project.');

    // Mock a successful API response
    await page.route('/api/contact', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })
    );

    await page.locator('button[type="submit"]').click();
    await expect(page.locator('h2')).toContainText(/Message Sent/i, { timeout: 5000 });
  });
});
