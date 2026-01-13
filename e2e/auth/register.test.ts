import { test, expect } from '@playwright/test';
import { register, generateTestEmail } from '../helpers';

test.describe('Registration Flow', () => {
  test('user can register with valid data', async ({ page }) => {
    const email = generateTestEmail();

    await register(page, 'Test User', email, 'SecurePass123!');

    await expect(page).toHaveURL(/verify-email/);
    await expect(page.locator('text=/verify/i')).toBeVisible();
  });

  test('shows error for existing email', async ({ page }) => {
    const email = 'existing@example.com';

    await register(page, 'Test User', email, 'SecurePass123!');

    await expect(page.locator('text=/already registered/i')).toBeVisible();
  });

  test('validates password match', async ({ page }) => {
    await page.goto('/register');
    await page.fill('[name="fullName"]', 'Test User');
    await page.fill('[name="email"]', generateTestEmail());
    await page.fill('[name="password"]', 'Password123!');
    await page.fill('[name="confirmPassword"]', 'DifferentPass123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('#confirmPassword-error')).toBeVisible();
  });

  test('rejects pwned password', async ({ page }) => {
    await register(page, 'Test User', generateTestEmail(), 'password123');

    await expect(page.locator('#password-error')).toBeVisible();
  });
});
