import { db } from '$lib/server/db/client';
import { token as tokenTable, user as userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateEmailVerificationToken, hashToken } from './token';
import { sendVerificationEmail } from '../email/client'; // Import ajustado para a nova pasta

const EXPIRES_IN_MS = 1000 * 60 * 15; // 15 Minutos

export async function createAndSendVerificationToken(userId: string, email: string, locale: 'en' | 'pt-br') {
  await db.delete(tokenTable).where(eq(tokenTable.userId, userId));

  const token = generateEmailVerificationToken();
  const hashed = hashToken(token);
  const expiresAt = new Date(Date.now() + EXPIRES_IN_MS);

  await db.insert(tokenTable).values({
    hash: hashed,
    userId: userId,
    type: 'email_verification',
    expiresAt: expiresAt
  });

  await sendVerificationEmail(email, token, locale);
}

export async function verifyUserToken(token: string) {
  const hashed = hashToken(token);

  return await db.transaction(async (tx) => {
    const storedToken = await tx
      .select()
      .from(tokenTable)
      .where(eq(tokenTable.hash, hashed))
      .limit(1);

    if (storedToken.length === 0) {
      return false;
    }

    const tokenData = storedToken[0];

    if (Date.now() > tokenData.expiresAt.getTime()) {
      await tx.delete(tokenTable).where(eq(tokenTable.hash, hashed));
      return false;
    }

    if (tokenData.type !== 'email_verification') {
      return false;
    }

    await tx
      .update(userTable)
      .set({ isVerified: true })
      .where(eq(userTable.id, tokenData.userId));

    await tx.delete(tokenTable).where(eq(tokenTable.hash, hashed));

    return true;
  });
}