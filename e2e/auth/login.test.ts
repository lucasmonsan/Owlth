import { test, expect } from '@playwright/test';
import { login } from '../helpers';

test.describe('Login Flow', () => {
  test('user can login with valid credentials', async ({ page }) => {
    await login(page, 'verified@example.com', 'correctpassword');

    await expect(page).toHaveURL(/dashboard/);
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await login(page, 'test@example.com', 'wrongpassword');

    await expect(page.locator('text=/invalid email or password/i')).toBeVisible();
  });

  test('shows verification warning for unverified users', async ({ page }) => {
    await login(page, 'unverified@example.com', 'correctpassword');

    await expect(page.locator('text=/not verified/i')).toBeVisible();
    await expect(page.locator('button:has-text("Continue")')).toBeDisabled();
  });
});
