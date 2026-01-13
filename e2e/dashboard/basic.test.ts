import { test, expect } from '@playwright/test';
import { login, logout, generateTestEmail, register } from '../helpers';

test.describe('Dashboard', () => {
  test('authenticated user can access dashboard', async ({ page }) => {
    await login(page, 'verified@example.com', 'correctpassword');

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1, h2')).toContainText(/dashboard|apps/i);
  });

  test('user can logout from dashboard', async ({ page }) => {
    await login(page, 'verified@example.com', 'correctpassword');
    await expect(page).toHaveURL(/dashboard/);

    await logout(page);

    await expect(page).toHaveURL('/');
  });

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL('/');
  });
});
