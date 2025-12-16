# Supabase Configuration

Complete configuration guide for Supabase authentication and database.

## Initial Setup

### 1. Create Supabase Project

1. Access [Supabase Dashboard](https://supabase.com)
2. Create new project
3. Wait for provisioning (~2 minutes)
4. Navigate to **Settings** → **API**

### 2. Get API Credentials

Copy these values to your `.env` file:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Authentication Configuration

### URL Configuration

Navigate to **Authentication** → **URL Configuration**

**Development:**

```
Site URL: http://localhost:5173
Redirect URLs:
  - http://localhost:5173/auth/callback
  - http://localhost:5173/**
```

**Production:**

```
Site URL: https://your-domain.com
Redirect URLs:
  - https://your-domain.com/auth/callback
  - https://your-domain.com/**
```

### Email Templates

Customize email templates at **Authentication** → **Email Templates**

Available templates:

- Confirmation email
- Password recovery
- Email change
- Magic link

## Database Schema

### Profiles Table (Optional)

Create a profiles table to store additional user data:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## OAuth Providers

### Enable Providers

Navigate to **Authentication** → **Providers**

Supported providers in this project:

- Google (see `GOOGLE_OAUTH.md`)

### Additional Providers

To enable more providers:

1. Configure provider in their respective console
2. Enable in Supabase dashboard
3. Add UI button in `/login` and `/register` pages

## Security

### Row Level Security (RLS)

Always enable RLS on tables containing user data:

```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
```

### Policies

Create policies to control data access:

```sql
-- Example: Users can only read their own data
CREATE POLICY "policy_name"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);
```

## Environment Variables

Required environment variables:

```env
# Public (client-side)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Private (server-side only) - not used in this project
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Troubleshooting

### Incorrect redirect URL

**Symptom:** Email confirmation links point to wrong domain

**Solution:** Check Site URL in Authentication → URL Configuration

### User not created in profiles table

**Symptom:** Profile data missing after signup

**Solution:**

1. Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. Check trigger function: `SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';`

### OAuth provider not working

**Symptom:** Error "provider is not enabled"

**Solution:** Enable provider in Authentication → Providers

## Migration to Production

When deploying to production:

1. Update Site URL to production domain
2. Add production redirect URLs
3. Update OAuth provider redirect URLs
4. Update environment variables in hosting platform
5. Test complete authentication flow

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/sveltekit)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
