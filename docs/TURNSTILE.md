# Cloudflare Turnstile Configuration

Cloudflare Turnstile provides CAPTCHA-less bot protection for the registration page.

## Setup

### 1. Create Turnstile Site

1. Access [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Turnstile**
3. Click **Add Site**

### 2. Configuration

**Widget name:** `Monsan Auth` (internal reference)

**Domains:**

- Development: `localhost`
- Production: Add your production domain

**Widget Mode:** `Managed` (recommended)

- Cloudflare automatically decides when to show challenges
- Best balance between security and user experience

**Pre-clearance:** Leave disabled unless you have specific rules

### 3. Get Site Key

After creating the site, copy the **Site Key** (not the Secret Key).

### 4. Environment Configuration

Add to your `.env` file:

```env
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...
```

> Note: The `PUBLIC_` prefix exposes this to the client-side, which is expected for Turnstile.

## Widget Modes

### Managed (Recommended)

- Cloudflare decides when to show challenges
- Invisible for most legitimate users
- Shows challenge when suspicious activity detected

### Non-Interactive

- Always invisible
- Only shows challenge for high-risk visitors
- May increase false negatives

### Invisible

- Completely invisible validation
- Runs in background
- Highest user experience, lower security

## Integration

The Turnstile widget is integrated in `/register` page:

```svelte
<Turnstile
	siteKey={PUBLIC_TURNSTILE_SITE_KEY}
	on:turnstile-callback={(e) => {
		turnstileVerified = true;
	}}
	theme="dark"
/>
```

The form submit button is disabled until Turnstile verification completes.

## Production Deployment

When deploying to production:

1. Return to Cloudflare Turnstile dashboard
2. Click your widget
3. Add production domain to **Domains** list
4. The same Site Key works for both localhost and production

## Troubleshooting

### Widget not visible

**Possible causes:**

- Site Key incorrect
- Domain not in allowed list
- Browser extensions blocking Cloudflare scripts

**Solutions:**

1. Verify Site Key in `.env`
2. Check domain is listed in Turnstile dashboard
3. Test in incognito/private browsing

### "Invalid site key" error

**Cause:** Wrong key or missing `PUBLIC_` prefix

**Solution:**

- Copy Site Key (not Secret Key)
- Ensure variable name is `PUBLIC_TURNSTILE_SITE_KEY`

### "Hostname verification failed"

**Cause:** Current domain not in allowed list

**Solution:** Add current hostname to Turnstile dashboard

## Security Considerations

- Site Key is public and can be exposed in client-side code
- Secret Key should never be exposed (not used in this project)
- Server-side validation can be added for additional security
- Monitor Turnstile dashboard for abuse patterns

## Rate Limits

Free tier includes:

- Unlimited verifications
- Analytics dashboard
- All widget modes

## References

- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile)
- [svelte-turnstile Package](https://github.com/beynar/svelte-turnstile)
