import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { db } from '$lib/server/db/client';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '$lib/server/auth/hashing';
import { createSession, generateSessionToken, SESSION_COOKIE_NAME } from '$lib/server/auth/session';
import { createAndSendVerificationToken } from '$lib/server/auth/verification';
import type { Actions, PageServerLoad } from './$types';

const registerSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100),
  email: z.email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "Senha deve ter no mínimo 8 caracteres" }).max(100),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, '/dashboard');
  }
};

export const actions: Actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());
    const result = registerSchema.safeParse(formData);

    // Helper para retornar erros mantendo os dados preenchidos
    const returnError = (status: number, message: string, fieldErrors: any = {}) => {
      const { password, confirmPassword, ...rest } = formData;
      return fail(status, {
        success: false,
        message,
        data: rest, // Devolve fullName e email para o formulário
        errors: fieldErrors
      });
    };

    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      // Pega o primeiro erro de cada campo para simplificar
      const message = Object.values(fieldErrors).flat()[0] || "Erro de validação";
      return returnError(400, message, fieldErrors);
    }

    const { fullName, email, password } = result.data;

    try {
      const existingUser = await db.select().from(user).where(eq(user.email, email));

      if (existingUser.length > 0) {
        return returnError(400, "Este email já está cadastrado");
      }

      const passwordHash = await hashPassword(password);

      // Inserção no banco com fullName
      const [newUser] = await db.insert(user).values({
        fullName,
        email,
        passwordHash,
        isVerified: false
      }).returning();

      // Envia email de verificação
      await createAndSendVerificationToken(newUser.id, email);

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
      return returnError(500, "Erro interno do servidor");
    }

    redirect(302, '/dashboard');
  }
};