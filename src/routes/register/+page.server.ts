import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db/client';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '$lib/server/auth/hashing';
import { createSession, generateSessionToken, SESSION_COOKIE_NAME, setSessionCookie } from '$lib/server/auth/session';
import { createAndSendVerificationToken } from '$lib/server/auth/verification';
import * as m from '$lib/paraglide/messages';
import type { Actions, PageServerLoad } from './$types';

const registerSchema = z.object({
  fullName: z.string().min(2, m.validation_name_required()).max(100),
  email: z.email({ message: m.validation_email_required() }),
  password: z.string().min(8, { message: m.validation_password_required() }).max(100),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: m.password_mismatch(),
  path: ["confirmPassword"]
});

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, '/dashboard');
  }
};

export const actions: Actions = {
  register: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const result = registerSchema.safeParse(formData);

    const returnError = (status: number, message: string, fieldErrors: any = {}) => {
      const { password, confirmPassword, ...rest } = formData;
      return fail(status, {
        success: false,
        message,
        data: rest,
        errors: fieldErrors
      });
    };

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      const message = Object.values(fieldErrors).flat()[0] || m.validation_generic_error();
      return returnError(400, message, fieldErrors);
    }

    const { fullName, email, password } = result.data;

    try {
      const existingUser = await db.select().from(user).where(eq(user.email, email));

      if (existingUser.length > 0) {
        return returnError(400, m.email_already_registered());
      }

      const { isPasswordPwned } = await import('$lib/server/auth/hibp');
      const isPwned = await isPasswordPwned(password);
      if (isPwned) {
        return returnError(400, m.password_pwned(), { password: [m.password_pwned()] });
      }

      const passwordHash = await hashPassword(password);

      const [newUser] = await db.insert(user).values({
        fullName,
        email,
        passwordHash,
        isVerified: false
      }).returning();

      const currentLocale = event.url.pathname.startsWith('/pt-br') ? 'pt-br' : 'en';
      await createAndSendVerificationToken(newUser.id, email, currentLocale as 'en' | 'pt-br');

      const token = generateSessionToken();
      const session = await createSession(token, newUser.id);

      setSessionCookie(event, token, session.expiresAt);

    } catch (error) {
      console.error(error);
      return returnError(500, m.internal_server_error());
    }

    redirect(302, '/dashboard');
  }
};