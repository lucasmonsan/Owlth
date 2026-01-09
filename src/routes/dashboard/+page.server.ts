import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    redirect(302, '/');
  }

  if (!event.locals.user.isVerified) {
    redirect(302, '/');
  }

  return {
    user: event.locals.user
  };
};