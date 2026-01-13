import { db } from '../db/client';
import { session, user } from '../db/schema';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { parseUserAgent } from '../security/user-agent';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SESSION_EXPIRATION_DAYS = 30;
const RENEWAL_THRESHOLD_DAYS = 15;

export const SESSION_COOKIE_NAME = 'auth_session';

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeHexLowerCase(bytes);
}

export async function createSession(token: string, userId: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + DAY_IN_MS * SESSION_EXPIRATION_DAYS);

  const newSession = {
    id: sessionId,
    userId,
    expiresAt,
    ipAddress: null,
    userAgent: null,
    device: null,
    browser: null
  };

  await db.insert(session).values(newSession);
  return newSession;
}

export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await db
    .select({ user, session })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .where(eq(session.id, sessionId));

  if (result.length < 1) {
    return { session: null, user: null };
  }

  const { user: currentUser, session: currentSession } = result[0];

  if (Date.now() >= currentSession.expiresAt.getTime()) {
    await db.delete(session).where(eq(session.id, currentSession.id));
    return { session: null, user: null };
  }

  // Renova sessão se faltar menos de 15 dias para expirar
  const renewalThreshold = Date.now() + DAY_IN_MS * RENEWAL_THRESHOLD_DAYS;
  if (currentSession.expiresAt.getTime() <= renewalThreshold) {
    currentSession.expiresAt = new Date(Date.now() + DAY_IN_MS * SESSION_EXPIRATION_DAYS);
    await db
      .update(session)
      .set({ expiresAt: currentSession.expiresAt })
      .where(eq(session.id, currentSession.id));
  }

  return { session: currentSession, user: currentUser };
}

export async function invalidateSession(sessionId: string) {
  await db.delete(session).where(eq(session.id, sessionId));
}

export function setSessionCookie(
  event: RequestEvent,
  token: string,
  expiresAt: Date
) {
  const isProduction = import.meta.env.PROD;

  event.cookies.set(SESSION_COOKIE_NAME, token, {
    path: '/',
    domain: isProduction && !event.url.hostname.includes('localhost') ? '.monsan.dev.br' : undefined,
    secure: isProduction && !event.url.hostname.includes('localhost'),
    httpOnly: true,
    sameSite: 'lax',
    expires: expiresAt
  });
}

export function deleteSessionCookie(event: RequestEvent) {
  const isProduction = import.meta.env.PROD;

  event.cookies.delete(SESSION_COOKIE_NAME, {
    path: '/',
    domain: isProduction ? '.monsan.dev.br' : undefined
  });
}