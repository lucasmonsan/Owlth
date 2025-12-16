import { redirect, fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const loginSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	
	if (session) {
		throw redirect(303, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString() || '';
		const password = formData.get('password')?.toString() || '';

		// Validação
		const result = loginSchema.safeParse({ email, password });
		
		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return fail(400, {
				email,
				errors
			});
		}

		// Autenticação
		const { error } = await locals.supabase.auth.signInWithPassword({
			email: result.data.email,
			password: result.data.password
		});

		if (error) {
			return fail(400, {
				email,
				message: 'Email ou senha incorretos'
			});
		}

		throw redirect(303, '/dashboard');
	},

	google: async ({ locals, url }) => {
		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${url.origin}/auth/callback?next=/dashboard`
			}
		});

		if (error) {
			return fail(400, { message: 'Erro ao fazer login com Google' });
		}

		if (data.url) {
			throw redirect(303, data.url);
		}
	}
};
