import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db/client';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '$lib/server/auth/hashing';
import { createSession, generateSessionToken, SESSION_COOKIE_NAME } from '$lib/server/auth/session';
import { checkRateLimit, incrementRateLimit, clearRateLimit } from '$lib/server/security/ratelimit';
import * as m from '$lib/paraglide/messages';
import type { Actions, PageServerLoad } from './$types';

const DUMMY_ARGON2_HASH = "$argon2id$v=19$m=19456,t=2,p=1$oHgO+ynJ9iKEzGr3znmt1A$Qn/coTVMMphOPOtyCc/WVs38NOHTvr+VMIZKk5shexI";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

export const load: PageServerLoad = async (event) => {
  return {
    user: event.locals.user
  };
};

export const actions: Actions = {
  login: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const result = loginSchema.safeParse(formData);
    const emailStr = formData.email?.toString() ?? '';
    const clientIp = event.getClientAddress();

    const returnFailure = (status: number, message: string) => {
      return fail(status, {
        success: false,
        message,
        email: emailStr
      });
    };

    if (!result.success) {
      return returnFailure(400, m.invalid_credentials());
    }

    const { email, password } = result.data;

    try {
      const rateLimit = await checkRateLimit(email, clientIp);
      if (rateLimit.blocked) {
        return returnFailure(429, rateLimit.message || "Too many attempts");
      }

      const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);

      if (existingUser.length === 0) {
        await verifyPassword(DUMMY_ARGON2_HASH, password);

        await incrementRateLimit(email, clientIp);

        return returnFailure(400, m.invalid_credentials());
      }

      const validPassword = await verifyPassword(existingUser[0].passwordHash, password);

      if (!validPassword) {
        await incrementRateLimit(email, clientIp);
        return returnFailure(400, m.invalid_credentials());
      }

      await clearRateLimit(email);

      const token = generateSessionToken();
      const session = await createSession(token, existingUser[0].id);

      event.cookies.set(SESSION_COOKIE_NAME, token, {
        path: '/',
        secure: import.meta.env.PROD,
        httpOnly: true,
        sameSite: 'lax',
        expires: session.expiresAt
      });

    } catch (error) {
      console.error(error);
      return returnFailure(500, "Internal Server Error");
    }

    redirect(302, '/dashboard');
  },

  logout: async (event) => {
    if (!event.locals.session) return fail(401);

    const { invalidateSession } = await import('$lib/server/auth/session');
    await invalidateSession(event.locals.session.id);

    event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });

    redirect(302, '/');
  }
};