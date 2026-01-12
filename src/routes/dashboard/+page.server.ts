import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { app, userApp } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  // Redirecionar se não estiver autenticado
  if (!locals.user) {
    throw redirect(302, '/');
  }

  // Buscar todos os apps
  const allApps = await db.select().from(app).orderBy(app.order);

  // Buscar apps que o usuário já usou
  const usedApps = await db
    .select()
    .from(userApp)
    .where(eq(userApp.userId, locals.user.id));

  const usedAppIds = new Set(usedApps.map((ua) => ua.appId));

  // Marcar apps como usados ou não
  const appsWithUsage = allApps.map((a) => ({
    ...a,
    isUsed: usedAppIds.has(a.id)
  }));

  return {
    apps: appsWithUsage,
    user: locals.user
  };
};