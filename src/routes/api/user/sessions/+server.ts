import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { session } from '$lib/server/db/schema';
import { eq, gt, and } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals, cookies }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentSessionId = cookies.get('session');

  const sessions = await db
    .select()
    .from(session)
    .where(
      and(
        eq(session.userId, locals.user.id),
        gt(session.expiresAt, new Date())
      )
    );

  return json({
    sessions: sessions.map((s: typeof session.$inferSelect) => ({
      ...s,
      isCurrent: s.id === currentSessionId
    }))
  });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId } = await request.json();

  if (!sessionId) {
    return json({ error: 'Session ID required' }, { status: 400 });
  }

  // Delete the session
  await db.delete(session).where(eq(session.id, sessionId));

  return json({ success: true });
};
