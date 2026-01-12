import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { validateSessionToken, SESSION_COOKIE_NAME } from '$lib/server/auth/session';

export const GET: RequestHandler = async ({ cookies }) => {
  const token = cookies.get(SESSION_COOKIE_NAME);

  if (!token) {
    return json({ authenticated: false }, { status: 401 });
  }

  const { session, user } = await validateSessionToken(token);

  if (!session || !user) {
    return json({ authenticated: false }, { status: 401 });
  }

  return json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isVerified: user.isVerified
    }
  });
};
