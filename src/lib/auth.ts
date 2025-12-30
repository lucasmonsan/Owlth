import { db } from '$lib/server/db/client';
import { session, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { hash, verify } from '@node-rs/argon2';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth_session';

// 1. Gerar Token de Sessão Seguro
export function generateSessionToken(): string {
  // Cria uma string aleatória para ser o ID da sessão no Cookie
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeHexLowerCase(bytes);
}

// 2. Criar a Sessão no Banco
export async function createSession(token: string, userId: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const newSession = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + DAY_IN_MS * 30), // 30 dias
    // TODO: Adicionar ipAddress e UserAgent aqui depois via Request
  };

  await db.insert(session).values(newSession);
  return newSession;
}

// 3. Validar Sessão (Roda em toda requisição)
export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  // Busca sessão e dados do usuário em uma única query
  const result = await db
    .select({ user: user, session: session })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .where(eq(session.id, sessionId));

  if (result.length < 1) return { session: null, user: null };

  const { user: currentUser, session: currentSession } = result[0];

  // Verifica se expirou
  if (Date.now() >= currentSession.expiresAt.getTime()) {
    await db.delete(session).where(eq(session.id, session.id));
    return { session: null, user: null };
  }

  // Renovação automática (Sliding Window): Se faltar menos de 15 dias, estende por mais 30
  if (Date.now() >= currentSession.expiresAt.getTime() - DAY_IN_MS * 15) {
    currentSession.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
    await db
      .update(session)
      .set({ expiresAt: currentSession.expiresAt })
      .where(eq(session.id, currentSession.id));
  }

  return { session: currentSession, user: currentUser };
}

// 4. Invalidar Sessão (Logout)
export async function invalidateSession(sessionId: string) {
  await db.delete(session).where(eq(session.id, sessionId));
}

// 5. Hash de Senha (Argon2id)
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    // Configurações recomendadas pela OWASP
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return await verify(hash, password);
}