import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { validateSessionToken, SESSION_COOKIE_NAME } from '$lib/server/auth/session';
import type { Handle } from '@sveltejs/kit';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

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

export const handle = sequence(handleParaglide, handleAuth);