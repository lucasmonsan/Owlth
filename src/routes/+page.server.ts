import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db/client';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '$lib/server/auth/hashing';
import { createSession, generateSessionToken, SESSION_COOKIE_NAME, setSessionCookie } from '$lib/server/auth/session';
import { checkRateLimit, incrementRateLimit, clearRateLimit } from '$lib/server/security/ratelimit';
import { checkEmailRateLimit, recordEmailSent } from '$lib/server/security/email-ratelimit';
import { createAndSendVerificationToken } from '$lib/server/auth/verification';
import * as m from '$lib/paraglide/messages';
import type { Actions, PageServerLoad } from './$types';

const DUMMY_ARGON2_HASH =
  '$argon2id$v=19$m=19456,t=2,p=1$oHgO+ynJ9iKEzGr3znmt1A$Qn/coTVMMphOPOtyCc/WVs38NOHTvr+VMIZKk5shexI';

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
        let message = m.invalid_credentials();

        if (rateLimit.code === 'ACCOUNT_BLOCKED_15MIN') {
          message = m.rate_limit_account_blocked();
        } else if (rateLimit.code === 'TOO_MANY_WAIT_5MIN') {
          message = m.rate_limit_too_many();
        } else if (rateLimit.code === 'WAIT_30_SECONDS') {
          message = m.rate_limit_wait();
        }

        return returnFailure(429, message);
      }

      const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);

      if (existingUser.length === 0) {
        await verifyPassword(DUMMY_ARGON2_HASH, password);
        await incrementRateLimit(email, clientIp);
        return returnFailure(400, m.invalid_credentials());
      }

      // Proteção contra timing attack: delay mesmo para contas OAuth-only
      if (!existingUser[0].passwordHash || existingUser[0].passwordHash === '') {
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

      setSessionCookie(event, token, session.expiresAt);

      // Redirecionar para dashboard (limpa query params)
      throw redirect(302, '/dashboard');
    } catch (error) {
      console.error(error);
      return returnFailure(500, 'Internal Server Error');
    }
  },

  resend: async (event) => {
    // Verifica se usuário está logado
    if (!event.locals.user) {
      return fail(401, {
        success: false,
        message: 'Unauthorized'
      });
    }

    // Verifica se já está verificado
    if (event.locals.user.isVerified) {
      return fail(400, {
        success: false,
        message: 'Email already verified'
      });
    }

    const email = event.locals.user.email;

    try {
      // Checa rate limit
      const rateLimit = await checkEmailRateLimit(email);

      if (!rateLimit.allowed) {
        const seconds = rateLimit.retryAfter || 60;
        const minutes = Math.ceil(seconds / 60);

        return fail(429, {
          success: false,
          message:
            seconds > 60
              ? m.email_limit_reached({ minutes })
              : m.email_rate_limit({ seconds }),
          retryAfter: seconds,
          action: 'resend'
        });
      }

      // Envia email
      const currentLocale = event.url.pathname.startsWith('/pt-br') ? 'pt-br' : 'en';
      await createAndSendVerificationToken(event.locals.user.id, email, currentLocale as 'en' | 'pt-br');

      // Registra envio
      await recordEmailSent(email);

      return {
        success: true,
        message: m.email_sent(),
        retryAfter: 60,
        action: 'resend'
      };
    } catch (error) {
      console.error('Resend email error:', error);
      return fail(500, {
        success: false,
        message: 'Internal Server Error',
        action: 'resend'
      });
    }
  },

  logout: async (event) => {
    if (!event.locals.session) return fail(401);

    const { invalidateSession } = await import('$lib/server/auth/session');
    await invalidateSession(event.locals.session.id);

    event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });

    redirect(302, '/');
  }
};