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
    // Trocar code por access token
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

    // Buscar dados do usuário
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const googleUser = await userResponse.json();

    // Buscar conta OAuth existente
    const existingOAuth = await db
      .select()
      .from(oauthAccount)
      .where(and(eq(oauthAccount.provider, 'google'), eq(oauthAccount.providerId, googleUser.id)))
      .limit(1);

    let userId: string;

    if (existingOAuth.length > 0) {
      // Usuário já existe via Google
      userId = existingOAuth[0].userId;
    } else {
      // Verificar se já existe usuário com esse email
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.email, googleUser.email))
        .limit(1);

      if (existingUser.length > 0) {
        // Vincular conta Google ao usuário existente
        userId = existingUser[0].id;
      } else {
        // Criar novo usuário
        const [newUser] = await db
          .insert(user)
          .values({
            fullName: googleUser.name,
            email: googleUser.email,
            passwordHash: '', // OAuth não usa senha
            isVerified: googleUser.verified_email
          })
          .returning();

        userId = newUser.id;
      }

      // Criar vínculo OAuth
      await db.insert(oauthAccount).values({
        userId,
        provider: 'google',
        providerId: googleUser.id,
        email: googleUser.email
      });
    }

    // Criar sessão
    const token = generateSessionToken();
    const session = await createSession(token, userId);
    setSessionCookie(event, token, session.expiresAt);

    throw redirect(302, '/dashboard');
  } catch (error) {
    console.error('Google OAuth error:', error);

    // Log detalhado do erro
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    throw redirect(302, '/?error=oauth_failed');
  }
};
