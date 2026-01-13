import { sequence } from '@sveltejs/kit/hooks';
import { validateSessionToken, SESSION_COOKIE_NAME, setSessionCookie, deleteSessionCookie } from '$lib/server/auth/session';
import { parseUserAgent } from '$lib/server/security/user-agent';
import { setLocale } from '$lib/paraglide/runtime';
import { locales, defaultLocale } from '$lib/config/i18n';
import type { Handle } from '@sveltejs/kit';
import * as Sentry from '@sentry/sveltekit';
import { monitoringConfig } from '$lib/server/config/monitoring';

// Inicializar monitoring
Sentry.init(monitoringConfig);

export const handleError = Sentry.handleErrorWithSentry();

const handleHPP: Handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url);
	const seen = new Set<string>();

	// Check for duplicate query parameters
	for (const key of url.searchParams.keys()) {
		if (seen.has(key)) {
			// Duplicate parameter detected - potential HPP attack
			return new Response('Bad Request', { status: 400 });
		}
		seen.add(key);
	}

	return resolve(event);
};

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

	const [, lang] = url.pathname.split('/');
	const currentLocale = locales.includes(lang as any) ? (lang as any) : defaultLocale;

	setLocale(currentLocale);

	event.cookies.set('PARAGLIDE_LOCALE', currentLocale, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365,
		httpOnly: false,
		sameSite: 'lax',
		secure: false
	});

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', currentLocale)
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
		setSessionCookie(event, token, session.expiresAt);
	} else {
		deleteSessionCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;

	return resolve(event);
};

const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	if (import.meta.env.PROD) {
		response.headers.set('X-Frame-Options', 'DENY');
		response.headers.set('X-Content-Type-Options', 'nosniff');
		response.headers.set(
			'Strict-Transport-Security',
			'max-age=31536000; includeSubDomains; preload'
		);
		response.headers.set('X-XSS-Protection', '1; mode=block');
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

		// Permissions Policy (controla features do browser)
		response.headers.set(
			'Permissions-Policy',
			'geolocation=(), microphone=(), camera=()'
		);
	}

	return response;
};

export const handle = sequence(handleHPP, handleI18n, handleAuth, handleSecurityHeaders);