import { expect, test } from '@playwright/test';

test('home page shows login form', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toHaveText('Sign In');
	await expect(page.locator('[name="email"]')).toBeVisible();
	await expect(page.locator('[name="password"]')).toBeVisible();
	await expect(page.locator('button[type="submit"]')).toBeVisible();
});
