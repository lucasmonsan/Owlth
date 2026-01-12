import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { loginHistory } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const history = await db
    .select()
    .from(loginHistory)
    .where(eq(loginHistory.userId, locals.user.id))
    .orderBy(desc(loginHistory.createdAt))
    .limit(20);

  return json({ history });
};
