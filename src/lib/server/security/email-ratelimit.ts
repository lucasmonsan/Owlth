import { db } from '$lib/server/db/client';
import { loginAttempt } from '$lib/server/db/schema';
import { eq, and, gte } from 'drizzle-orm';

const RATE_LIMIT_SECONDS = 60;
const MAX_EMAILS_PER_HOUR = 5;
const ONE_HOUR_MS = 1000 * 60 * 60;

interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // segundos até poder tentar novamente
  remainingEmails?: number;
}

export async function checkEmailRateLimit(email: string): Promise<RateLimitResult> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - ONE_HOUR_MS);
  const rateLimitSeconds = new Date(now.getTime() - RATE_LIMIT_SECONDS * 1000);

  // Busca tentativas na última hora
  const attempts = await db
    .select()
    .from(loginAttempt)
    .where(and(eq(loginAttempt.email, email), gte(loginAttempt.lastAttemptAt, oneHourAgo)));

  if (attempts.length === 0) {
    return { allowed: true, remainingEmails: MAX_EMAILS_PER_HOUR };
  }

  // Checa se ultrapassou limite de emails por hora
  if (attempts.length >= MAX_EMAILS_PER_HOUR) {
    const oldestAttempt = attempts.reduce((oldest, current) =>
      current.lastAttemptAt < oldest.lastAttemptAt ? current : oldest
    );

    const retryAfter = Math.ceil(
      (oldestAttempt.lastAttemptAt.getTime() + ONE_HOUR_MS - now.getTime()) / 1000
    );

    return {
      allowed: false,
      retryAfter,
      remainingEmails: 0
    };
  }

  // Checa se passou tempo mínimo desde último envio
  const lastAttempt = attempts.reduce((latest, current) =>
    current.lastAttemptAt > latest.lastAttemptAt ? current : latest
  );

  if (lastAttempt.lastAttemptAt >= rateLimitSeconds) {
    const retryAfter = Math.ceil(
      (lastAttempt.lastAttemptAt.getTime() + RATE_LIMIT_SECONDS * 1000 - now.getTime()) / 1000
    );

    return {
      allowed: false,
      retryAfter,
      remainingEmails: MAX_EMAILS_PER_HOUR - attempts.length
    };
  }

  return {
    allowed: true,
    remainingEmails: MAX_EMAILS_PER_HOUR - attempts.length
  };
}

export async function recordEmailSent(email: string): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ONE_HOUR_MS);

  await db.insert(loginAttempt).values({
    email,
    ipAddress: 'email-verification', // Marcador especial
    attempts: 1,
    lastAttemptAt: now,
    expiresAt
  });
}

export async function cleanupExpiredEmailAttempts(): Promise<void> {
  const now = new Date();
  await db.delete(loginAttempt).where(gte(loginAttempt.expiresAt, now));
}