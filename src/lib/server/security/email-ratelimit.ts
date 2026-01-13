import { db } from '$lib/server/db/client';
import { emailAttempt } from '$lib/server/db/schema';
import { eq, and, gte } from 'drizzle-orm';

const RATE_LIMIT_SECONDS = 60;
const MAX_EMAILS_PER_HOUR = 5;
const ONE_HOUR_MS = 1000 * 60 * 60;

export interface EmailRateLimitResult {
  allowed: boolean;
  retryAfter?: number;
  remainingEmails?: number;
}

export async function checkEmailRateLimit(email: string): Promise<EmailRateLimitResult> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - ONE_HOUR_MS);
  const rateLimitSeconds = new Date(now.getTime() - RATE_LIMIT_SECONDS * 1000);

  const attempts = await db
    .select()
    .from(emailAttempt)
    .where(and(eq(emailAttempt.email, email), gte(emailAttempt.sentAt, oneHourAgo)));

  if (attempts.length === 0) {
    return { allowed: true, remainingEmails: MAX_EMAILS_PER_HOUR };
  }

  if (attempts.length >= MAX_EMAILS_PER_HOUR) {
    const oldestAttempt = attempts.reduce((oldest, current) =>
      current.sentAt < oldest.sentAt ? current : oldest
    );

    const retryAfter = Math.ceil(
      (oldestAttempt.sentAt.getTime() + ONE_HOUR_MS - now.getTime()) / 1000
    );

    return {
      allowed: false,
      retryAfter,
      remainingEmails: 0
    };
  }

  const lastAttempt = attempts.reduce((latest, current) =>
    current.sentAt > latest.sentAt ? current : latest
  );

  if (lastAttempt.sentAt >= rateLimitSeconds) {
    const retryAfter = Math.ceil(
      (lastAttempt.sentAt.getTime() + RATE_LIMIT_SECONDS * 1000 - now.getTime()) / 1000
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

  await db.insert(emailAttempt).values({
    email,
    purpose: 'verification',
    sentAt: now,
    expiresAt
  });
}

export async function cleanupExpiredEmailAttempts(): Promise<void> {
  const now = new Date();
  await db.delete(emailAttempt).where(gte(emailAttempt.expiresAt, now));
}