import { sequence } from '@sveltejs/kit/hooks';
import { validateSessionToken, SESSION_COOKIE_NAME } from '$lib/server/auth/session';
import { setLocale } from '$lib/paraglide/runtime';
import type { Handle } from '@sveltejs/kit';

const handleI18n: Handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url);

	if (url.pathname === '/' && !event.cookies.get('PARAGLIDE_LOCALE')) {
		const acceptLanguage = event.request.headers.get('accept-language') || '';

		if (acceptLanguage.toLowerCase().includes('pt')) {
			return new Response(null, {
				status: 302,
				headers: { Location: '/pt-br/' }
			});
		}
	}

	const lang = url.pathname.startsWith('/pt-br') ? 'pt-br' : 'en';

	setLocale(lang);

	event.cookies.set('PARAGLIDE_LOCALE', lang, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365,
		httpOnly: false,
		sameSite: 'lax',
		secure: false
	});

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', lang)
	});
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SESSION_COOKIE_NAME) ?? null;

	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);

	if (session !== null) {
		event.cookies.set(SESSION_COOKIE_NAME, token, {
			path: '/',
			secure: import.meta.env.PROD,
			httpOnly: true,
			sameSite: 'lax',
			expires: session.expiresAt
		});
	} else {
		event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
	}

	event.locals.session = session;
	event.locals.user = user;

	return resolve(event);
};

export const handle = sequence(handleI18n, handleAuth);