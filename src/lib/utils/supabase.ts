import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '../types/database.types';

export const createSupabaseClient = () => {
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
		throw new Error('Missing Supabase environment variables. Check your .env file.');
	}
	return createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
};

export const createSupabaseServerClient = (
	cookieStore: {
		get: (name: string) => string | undefined;
		set: (name: string, value: string, options: any) => void;
		remove: (name: string, options: any) => void;
	}
) => {
	if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
		throw new Error('Missing Supabase environment variables. Check your .env file.');
	}
	return createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get(name) {
				return cookieStore.get(name);
			},
			set(name, value, options) {
				cookieStore.set(name, value, { ...options, path: '/' });
			},
			remove(name, options) {
				cookieStore.remove(name, { ...options, path: '/' });
			}
		}
	});
};

