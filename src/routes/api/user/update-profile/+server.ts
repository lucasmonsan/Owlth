import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { uploadAvatar } from '$lib/server/storage/r2';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const fullName = formData.get('fullName') as string;
  const photo = formData.get('photo') as File | null;

  const updates: Partial<typeof user.$inferInsert> = {};

  if (fullName && fullName.trim()) {
    updates.fullName = fullName.trim();
  }

  if (photo && photo.size > 0) {
    // Upload to R2
    const photoUrl = await uploadAvatar(locals.user.id, photo);
    updates.profilePicture = photoUrl;
  }

  if (Object.keys(updates).length === 0) {
    return json({ error: 'No changes provided' }, { status: 400 });
  }

  await db.update(user).set(updates).where(eq(user.id, locals.user.id));

  return json({ success: true });
};
