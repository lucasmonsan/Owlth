import { createSupabaseServerClient } from '$lib';
import { type Handle, redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		get: (name: string) => event.cookies.get(name),
		set: (name: string, value: string, options: any) => {
			console.log('[SSO] Setting cookie:', name, 'with domain:', '.monsan.duckdns.org');
			event.cookies.set(name, value, {
				...options,
				path: '/',
				domain: '.monsan.duckdns.org',
				secure: true,
				httpOnly: true,
				sameSite: 'lax'
			});
		},
		remove: (name: string, options: any) => {
			console.log('[SSO] Removing cookie:', name);
			event.cookies.delete(name, {
				...options,
				path: '/',
				domain: '.monsan.duckdns.org'
			});
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		
		if (error) {
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

