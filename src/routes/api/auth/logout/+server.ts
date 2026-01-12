import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { invalidateSession, SESSION_COOKIE_NAME, deleteSessionCookie } from '$lib/server/auth/session';

export const POST: RequestHandler = async (event) => {
  const { cookies, locals } = event;
  const token = cookies.get(SESSION_COOKIE_NAME);

  if (token && locals.session) {
    await invalidateSession(locals.session.id);
  }

  deleteSessionCookie(event);

  return json({ success: true });
};
