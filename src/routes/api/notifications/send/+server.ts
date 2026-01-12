import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { notificationPreference } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
  const { userId, type, subject, message } = await request.json();

  if (!userId || !type) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Verificar preferências do usuário
  const prefs = await db
    .select()
    .from(notificationPreference)
    .where(and(eq(notificationPreference.userId, userId), eq(notificationPreference.type, type)))
    .limit(1);

  // Se não tem preferência ou está habilitado, enviar
  if (prefs.length === 0 || prefs[0].email) {
    // Aqui você integraria com seu sistema de email
    // Por enquanto, apenas log
    console.log(`📧 Notification to ${userId}: ${subject}`);

    return json({ success: true, sent: true });
  }

  return json({ success: true, sent: false, reason: 'User disabled this notification type' });
};
