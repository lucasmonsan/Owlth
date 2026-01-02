import { db } from '$lib/server/db/client';
import { loginAttempt } from '$lib/server/db/schema';
import { eq, and, gt, lt } from 'drizzle-orm';

const WINDOW_MINUTES = 15;

export async function checkRateLimit(email: string, ip: string): Promise<{ blocked: boolean; message?: string }> {
  await db.delete(loginAttempt)
    .where(and(
      eq(loginAttempt.email, email),
      lt(loginAttempt.expiresAt, new Date())
    ));

  const attempts = await db
    .select()
    .from(loginAttempt)
    .where(
      and(
        eq(loginAttempt.email, email),
        gt(loginAttempt.expiresAt, new Date())
      )
    )
    .limit(1);

  if (attempts.length === 0) return { blocked: false };

  const record = attempts[0];

  if (record.attempts >= 15) return { blocked: true, message: 'Conta bloqueada temporariamente. Tente em 15 minutos.' };

  if (record.attempts >= 10) {
    if (Date.now() - record.lastAttemptAt.getTime() < 1000 * 60 * 5) {
      return { blocked: true, message: 'Muitas tentativas. Aguarde 5 minutos.' };
    }
  }

  if (record.attempts >= 5) {
    if (Date.now() - record.lastAttemptAt.getTime() < 1000 * 30) {
      return { blocked: true, message: 'Aguarde 30 segundos antes de tentar novamente.' };
    }
  }

  return { blocked: false };
}

export async function incrementRateLimit(email: string, ip: string) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + WINDOW_MINUTES * 60 * 1000);

  const existing = await db
    .select()
    .from(loginAttempt)
    .where(eq(loginAttempt.email, email))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(loginAttempt)
      .set({
        attempts: existing[0].attempts + 1,
        lastAttemptAt: now,
        expiresAt: expiresAt,
        ipAddress: ip
      })
      .where(eq(loginAttempt.id, existing[0].id));
  } else {
    await db.insert(loginAttempt).values({
      email,
      ipAddress: ip,
      attempts: 1,
      lastAttemptAt: now,
      expiresAt: expiresAt
    });
  }
}

export async function clearRateLimit(email: string) {
  await db.delete(loginAttempt).where(eq(loginAttempt.email, email));
}