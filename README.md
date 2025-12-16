# 🔐 Monsan

Centralized authentication portal (SSO) and application launcher built with **Svelte 5** and **Supabase**.

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Svelte](https://img.shields.io/badge/Svelte-5.0-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-cyan)

## Features

- 🔐 Complete authentication (email/password + Google OAuth)
- 🎨 Glassmorphism design with deep dark mode
- 🚀 Smooth animations with svelte-motion
- 🔒 Cloudflare Turnstile bot protection
- 📱 Fully responsive mobile-first design
- ⚡ TypeScript strict mode
- 🎯 Full SSR with SvelteKit
- 🛡️ Server-side route protection

## Tech Stack

- **Frontend**: Svelte 5 (Runes), TailwindCSS v4, svelte-motion
- **Backend**: SvelteKit, Supabase Auth
- **Validation**: Zod
- **Security**: Cloudflare Turnstile
- **Runtime**: Bun

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/              # Base components (Button, Input, GlassCard)
│   │   └── toast/           # Toast notification system
│   ├── stores/              # Svelte 5 stores
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── routes/
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── forgot-password/     # Password recovery
│   ├── dashboard/           # Protected dashboard
│   └── auth/callback/       # OAuth callback
└── app.css                  # Global styles
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) runtime
- [Supabase](https://supabase.com) account
- [Cloudflare](https://cloudflare.com) account (for Turnstile)

### Installation

```bash
# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
bun run dev
```

Visit `http://localhost:5173`

### Configuration

See detailed setup guides in the `docs/` folder:

- [Setup Guide](./SETUP.md) - Complete setup instructions
- [Supabase Configuration](./docs/SUPABASE.md)
- [Google OAuth](./docs/GOOGLE_OAUTH.md)
- [Turnstile Setup](./docs/TURNSTILE.md)

## Available Scripts

```bash
bun run dev          # Development server
bun run build        # Production build
bun run preview      # Preview production build
bun run check        # TypeScript type checking
bun run lint         # Lint code
bun run format       # Format code
```

## Design System

### Components

- **GlassCard**: Glassmorphism card component
- **Button**: Button with 3 variants (Primary, Ghost, Outline)
- **Input**: Input with floating label and validation
- **Toast**: Animated toast notification system

### Color Palette

```css
--color-deep-black: #0a0a0a;
--color-accent: #3b82f6;
--color-glass-white: rgba(255, 255, 255, 0.05);
```

## Security Features

- ✅ TypeScript Strict Mode
- ✅ Cloudflare Turnstile bot protection
- ✅ Server-side validation with Zod
- ✅ CSRF protection (SvelteKit built-in)
- ✅ Secure httpOnly cookies
- ✅ Row Level Security on Supabase

## Project Status

- [x] Email/password authentication
- [x] Google OAuth integration
- [x] Protected dashboard
- [x] Glassmorphism UI
- [x] Toast notification system
- [x] Password recovery
- [x] Mobile responsive design
- [ ] Additional OAuth providers
- [ ] User profile management
- [ ] Two-factor authentication

## Environment Variables

Required environment variables:

```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

See `.env.example` for details.

## License

[GNU GPL v3](./LICENSE)

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

---

Built with Svelte 5 and Supabase
