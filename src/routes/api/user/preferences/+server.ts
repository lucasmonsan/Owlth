import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { notificationPreference } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const prefs = await db
    .select()
    .from(notificationPreference)
    .where(eq(notificationPreference.userId, locals.user.id));

  // Convert array to object
  const preferences = {
    emailSecurity: prefs.find((p) => p.type === 'security')?.email ?? true,
    emailLogin: prefs.find((p) => p.type === 'login')?.email ?? true,
    emailApps: prefs.find((p) => p.type === 'app_notification')?.email ?? true
  };

  return json({ preferences });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { emailSecurity, emailLogin, emailApps } = await request.json();

  const types = [
    { type: 'security', email: emailSecurity },
    { type: 'login', email: emailLogin },
    { type: 'app_notification', email: emailApps }
  ];

  // Upsert preferences
  for (const { type, email } of types) {
    const existing = await db
      .select()
      .from(notificationPreference)
      .where(
        and(
          eq(notificationPreference.userId, locals.user.id),
          eq(notificationPreference.type, type)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(notificationPreference)
        .set({ email })
        .where(eq(notificationPreference.id, existing[0].id));
    } else {
      await db.insert(notificationPreference).values({
        userId: locals.user.id,
        type,
        email
      });
    }
  }

  return json({ success: true });
};
