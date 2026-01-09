import { redirect } from '@sveltejs/kit';
import { verifyUserToken } from '$lib/server/auth/verification';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const token = event.url.searchParams.get('token');

  if (!token) {
    redirect(302, '/dashboard');
  }

  const success = await verifyUserToken(token);

  if (success) {
    redirect(302, '/dashboard?verified=true');
  } else {
    redirect(302, '/dashboard?error=invalid_token');
  }
};