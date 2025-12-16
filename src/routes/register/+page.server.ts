import { redirect, fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const registerSchema = z.object({
	fullName: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
	email: z.string().email('Email inválido'),
	password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
	confirmPassword: z.string(),
	turnstileToken: z.string().min(1, 'Verificação de segurança necessária')
});

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession();
	
	if (session) {
		throw redirect(303, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	register: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const fullName = formData.get('fullName')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const password = formData.get('password')?.toString() || '';
		const confirmPassword = formData.get('confirmPassword')?.toString() || '';
		const turnstileToken = formData.get('cf-turnstile-response')?.toString() || '';

		// Validação
		const result = registerSchema.safeParse({
			fullName,
			email,
			password,
			confirmPassword,
			turnstileToken
		});
		
		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return fail(400, {
				fullName,
				email,
				errors
			});
		}

		// Verificar se senhas são iguais
		if (password !== confirmPassword) {
			return fail(400, {
				fullName,
				email,
				errors: {
					confirmPassword: ['As senhas não coincidem']
				}
			});
		}

		// Criar usuário
		const { error: signUpError } = await locals.supabase.auth.signUp({
			email: result.data.email,
			password: result.data.password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`,
				data: {
					full_name: result.data.fullName
				}
			}
		});

		if (signUpError) {
			return fail(400, {
				fullName,
				email,
				message: signUpError.message === 'User already registered'
					? 'Este email já está cadastrado'
					: 'Erro ao criar conta. Tente novamente.'
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
