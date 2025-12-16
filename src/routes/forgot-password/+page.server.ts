import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const emailSchema = z.object({
	email: z.string().email('Email inválido')
});

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString() || '';

		// Validação
		const result = emailSchema.safeParse({ email });
		
		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return fail(400, {
				email,
				errors
			});
		}

		// Enviar email de recuperação
		const { error } = await locals.supabase.auth.resetPasswordForEmail(result.data.email, {
			redirectTo: `${url.origin}/reset-password`
		});

		if (error) {
			return fail(400, {
				email,
				message: 'Erro ao enviar email. Tente novamente.'
			});
		}

		// Retorna sucesso (mesmo que email não exista, por segurança)
		return { success: true, email };
	}
};

