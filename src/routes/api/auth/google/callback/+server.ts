import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db/client';
import { user, oauthAccount } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateSessionToken, createSession, setSessionCookie } from '$lib/server/auth/session';

export const GET: RequestHandler = async (event) => {
  const { url } = event;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) {
    throw redirect(302, '/?error=no_code');
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID || '',
        client_secret: env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${env.ORIGIN}/api/auth/google/callback`,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const { access_token } = await tokenResponse.json();

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const googleUser = await userResponse.json();

    const existingOAuth = await db
      .select()
      .from(oauthAccount)
      .where(and(eq(oauthAccount.provider, 'google'), eq(oauthAccount.providerId, googleUser.id)))
      .limit(1);

    let userId: string;

    if (existingOAuth.length > 0) {
      userId = existingOAuth[0].userId;

      const [currentUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      if (!currentUser.profilePicture && googleUser.picture) {
        await db
          .update(user)
          .set({ profilePicture: googleUser.picture })
          .where(eq(user.id, userId));
      } else if (
        currentUser.profilePicture &&
        googleUser.picture &&
        currentUser.profilePicture !== googleUser.picture
      ) {
        event.cookies.set('pending_picture_sync', googleUser.picture, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false
        });
      }
    } else {
      // Verificar se já existe usuário com esse email
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.email, googleUser.email))
        .limit(1);

      if (existingUser.length > 0) {
        userId = existingUser[0].id;
      } else {
        const [newUser] = await db
          .insert(user)
          .values({
            fullName: googleUser.name,
            email: googleUser.email,
            passwordHash: '',
            isVerified: googleUser.verified_email,
            profilePicture: googleUser.picture || null
          })
          .returning();

        userId = newUser.id;
      }

      await db.insert(oauthAccount).values({
        userId,
        provider: 'google',
        providerId: googleUser.id,
        email: googleUser.email
      });
    }

    const token = generateSessionToken();
    const session = await createSession(token, userId);
    setSessionCookie(event, token, session.expiresAt);

    throw redirect(302, '/dashboard');
  } catch (error) {
    if (error instanceof Response && error.status >= 300 && error.status < 400) {
      throw error;
    }

    console.error('Google OAuth error:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    throw redirect(302, '/?error=oauth_failed');
  }
};
