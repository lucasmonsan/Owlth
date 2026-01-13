import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db/client';
import { userApp } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const schema = z.object({
  appId: z.string().uuid()
});

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const result = schema.safeParse(body);

  if (!result.success) {
    return json({ error: 'Invalid data' }, { status: 400 });
  }

  const { appId } = result.data;

  try {
    const existingEntry = await db
      .select()
      .from(userApp)
      .where(and(eq(userApp.userId, locals.user.id), eq(userApp.appId, appId)))
      .limit(1);

    if (existingEntry.length > 0) {
      // Atualiza lastAccessedAt
      await db
        .update(userApp)
        .set({ lastAccessedAt: new Date() })
        .where(eq(userApp.id, existingEntry[0].id));
    } else {
      // Cria novo registro
      await db.insert(userApp).values({
        userId: locals.user.id,
        appId: appId,
        lastAccessedAt: new Date()
      });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Error tracking app usage:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
