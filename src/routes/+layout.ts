import { createSupabaseClient } from '$lib';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends }) => {
	depends('supabase:auth');

	const supabase = createSupabaseClient();

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return {
		supabase,
		session: session ?? data.session
	};
};

