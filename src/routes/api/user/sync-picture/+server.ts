import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { pictureUrl } = await request.json();

  if (!pictureUrl) {
    return json({ error: 'Missing picture URL' }, { status: 400 });
  }

  await db
    .update(user)
    .set({ profilePicture: pictureUrl })
    .where(eq(user.id, locals.user.id));

  cookies.set('pending_picture_sync', '', { path: '/' });

  return json({ success: true });
};
