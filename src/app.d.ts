import type { InferSelectModel } from 'drizzle-orm';
import type * as schema from '$lib/server/db/schema';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: InferSelectModel<typeof schema.user> | null;
			session: InferSelectModel<typeof schema.session> | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };