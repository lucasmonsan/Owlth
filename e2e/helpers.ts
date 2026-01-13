import { expect, type Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/');
  // Esperar hidratação/network
  await page.waitForLoadState('domcontentloaded');
  // Pequena pausa para garantir que o JS anexou os event listeners (hydrate)
  await page.waitForTimeout(500);

  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
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
  await page.waitForLoadState('networkidle');
}

export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 9);
  return `test-${timestamp}-${random}@example.com`;
}

export async function logout(page: Page) {
  await page.click('[aria-label="Logout"]');
  await page.waitForURL('/');
}
