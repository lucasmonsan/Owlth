# Google OAuth Configuration

This guide covers the setup of Google OAuth authentication with Supabase.

## Prerequisites

- Google Cloud Console account
- Supabase project configured

## Google Cloud Console Setup

### 1. Create OAuth Credentials

1. Access [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**

### 2. Configure OAuth Consent Screen

Before creating credentials, configure the consent screen:

- **User Type**: External
- **App name**: Monsan
- **User support email**: Your email
- **Developer contact**: Your email

**Scopes required:**

- `userinfo.email`
- `userinfo.profile`
- `openid`

### 3. Create Web Application Client

**Application type:** Web application

**Authorized JavaScript origins:**

```
http://localhost:5173
https://your-production-domain.com
```

**Authorized redirect URIs:**

```
https://YOUR_PROJECT.supabase.co/auth/v1/callback
```

> Replace `YOUR_PROJECT` with your actual Supabase project reference.

## Supabase Configuration

### Enable Google Provider

1. Open Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Google**
4. Configure:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console

### Configure Redirect URLs

Navigate to **Authentication** → **URL Configuration**

**Site URL:**

```
http://localhost:5173
```

**Redirect URLs:**

```
http://localhost:5173/auth/callback
http://localhost:5173/**
```

For production, add your production domain:

```
https://your-domain.com/auth/callback
https://your-domain.com/**
```

## Testing

1. Start development server: `bun run dev`
2. Navigate to `/login` or `/register`
3. Click "Sign in with Google"
4. Complete OAuth flow

## Troubleshooting

### redirect_uri_mismatch

**Cause:** Redirect URI in Google Cloud doesn't match Supabase callback URL

**Solution:** Verify the redirect URI is exactly:

```
https://YOUR_PROJECT.supabase.co/auth/v1/callback
```

### provider is not enabled

**Cause:** Google provider not enabled in Supabase

**Solution:**

1. Check Authentication → Providers → Google is enabled
2. Wait 1-2 minutes after enabling

### Invalid credentials

**Cause:** Client ID or Secret incorrect

**Solution:** Re-copy credentials from Google Cloud Console

## Security Notes

- Never commit `.env` file with credentials
- Use environment variables for all sensitive data
- Rotate secrets periodically
- Monitor OAuth usage in both dashboards

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
