import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db/client';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '$lib/server/auth/hashing';
import { createSession, generateSessionToken, SESSION_COOKIE_NAME } from '$lib/server/auth/session';
import type { Actions, PageServerLoad } from './$types';

const registerSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(100),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, '/');
  }
};

export const actions: Actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const result = registerSchema.safeParse(formData);

    const returnError = (status: number, message: string, fieldErrors: any = {}) => {
      const { password, confirmPassword, ...rest } = formData;
      return fail(status, {
        success: false,
        message,
        data: rest,
        errors: {
          email: fieldErrors.email || [],
          password: fieldErrors.password || [],
          confirmPassword: fieldErrors.confirmPassword || [],
          ...fieldErrors
        }
      });
    };

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      return returnError(400, "Validation failed", fieldErrors);
    }

    const { email, password } = result.data;

    try {
      const existingUser = await db.select().from(user).where(eq(user.email, email));

      if (existingUser.length > 0) {
        return returnError(400, "User already exists", {
          email: ['Email already registered']
        });
      }

      const passwordHash = await hashPassword(password);

      const [newUser] = await db.insert(user).values({
        email,
        passwordHash,
        isVerified: false
      }).returning();

      const token = generateSessionToken();
      const session = await createSession(token, newUser.id);

      event.cookies.set(SESSION_COOKIE_NAME, token, {
        path: '/',
        secure: import.meta.env.PROD,
        httpOnly: true,
        sameSite: 'lax',
        expires: session.expiresAt
      });

    } catch (error) {
      console.error(error);
      return returnError(500, "Internal Server Error");
    }

    redirect(302, '/');
  }
};