import { test, expect } from '@playwright/test';

test.describe('Rate Limiting', () => {
  test('blocks after 5 failed login attempts', async ({ page }) => {
    const email = 'test@example.com';

    for (let i = 0; i < 5; i++) {
      await page.goto('/');
      await page.fill('[name="email"]', email);
      await page.fill('[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }

    // 6ª tentativa deve ser bloqueada
    await page.goto('/');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=/too many attempts/i')).toBeVisible();
  });
});
