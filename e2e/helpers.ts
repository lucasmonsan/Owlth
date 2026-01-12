import { expect, type Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');
}

export async function register(
  page: Page,
  fullName: string,
  email: string,
  password: string
) {
  await page.goto('/register');
  await page.fill('[name="fullName"]', fullName);
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.fill('[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');
}

export function generateTestEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}
