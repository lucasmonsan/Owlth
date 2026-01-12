# 🦉 Owlth

Authentication Hub profissional para suite de aplicações. Sistema completo de autenticação com foco em segurança, escalabilidade e experiência do usuário.

## ✨ Features

### Autenticação

- 🔐 Email/Senha com validação robusta
- 🔑 OAuth Google
- 📧 Verificação de email obrigatória
- 🛡️ Proteção contra senhas comprometidas (HIBP)

### Segurança

- 🛡️ CSRF Protection
- 🔒 CSP Headers
- 🚫 HPP Protection
- ⏱️ Rate Limiting (login, email)
- 🔐 Argon2 password hashing
- 🍪 Secure cookies (httpOnly, sameSite, secure)
- 📊 Login history com tracking de dispositivos
- 🔄 Session management com renovação automática
- 🗑️ Soft deletes para auditoria

### UX & Acessibilidade

- 🌍 i18n (EN/PT-BR) com Paraglide
- ♿ WCAG 2.1 compliant
- ⌨️ Keyboard navigation
- 📱 Responsive design
- 🎨 Dark mode
- ⚡ Loading states
- 🎯 Prefers-reduced-motion
- 🚨 Error boundary customizado

### Infraestrutura

- 📊 Monitoring (GlitchTip self-hosted)
- 📈 Analytics (Umami self-hosted)
- ☁️ Cloudflare R2 (avatares otimizados com Sharp)
- 📧 AWS SES (emails transacionais)
- 🗄️ PostgreSQL + Drizzle ORM

## 🚀 Quick Start

### Pré-requisitos

- Bun >= 1.0
- PostgreSQL >= 14
- Cloudflare R2 account
- AWS SES account
- Google OAuth credentials

### Instalação

```bash
# Clone
git clone https://github.com/lucasmonsan/owlth.git
cd owlth

# Instalar dependências
bun install

# Configurar ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Database
bun run db:generate
bun run db:push

# Desenvolvimento
bun run dev
```

### Variáveis de Ambiente

Ver [.env.example](.env.example) para lista completa.

**Essenciais**:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/owlth
R2_ACCOUNT_ID=your-account-id
GOOGLE_CLIENT_ID=your-client-id
```

**Opcionais** (Monitoring & Analytics):

```env
GLITCHTIP_DSN=https://xxx@monitoring.monsan.dev.br/1
PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

## 🧪 Testes

```bash
# Unit tests
bun run test:unit

# E2E tests
bun run test:e2e

# Todos
bun run test
```

**Cobertura**:

- E2E: 8 testes (registro, login, rate limiting)
- Unit: 7 testes (user-agent, HIBP)

## 📦 Build & Deploy

```bash
# Build
bun run build

# Preview
bun run preview

# Deploy
# Ver guia de deployment no Coolify
```

## 🏗️ Arquitetura

```
src/
├── lib/
│   ├── components/          # Componentes Svelte 5
│   │   ├── dashboard/       # Dashboard específicos
│   │   ├── icons/           # Ícones SVG
│   │   ├── interface/       # Componentes reutilizáveis
│   │   └── layout/          # Layout components
│   ├── server/              # Server-only code
│   │   ├── auth/            # Autenticação
│   │   ├── config/          # Configurações (env, monitoring)
│   │   ├── db/              # Database (schema, helpers)
│   │   ├── email/           # Email sending
│   │   ├── security/        # Security utils
│   │   ├── storage/         # R2 storage
│   │   └── utils/           # Server utils
│   ├── stores/              # Svelte stores
│   ├── styles/              # Global CSS
│   └── types/               # TypeScript types
├── routes/                  # SvelteKit routes
└── hooks.server.ts          # Global hooks
```

## 🔒 Segurança

- **Session-based auth** com SHA-256 tokens
- **Cookies**: httpOnly, secure (prod), sameSite: lax
- **CSRF protection** ativado
- **CSP headers** configurados
- **HPP protection** contra parameter pollution
- **Rate limiting**: 5 tentativas/15min
- **Argon2** password hashing
- **HIBP integration** (k-anonymity)
- **Soft deletes** para auditoria
- **Image optimization**: Sharp (WebP, 200x200, ~20-30KB)

## 🌍 Internacionalização

- **Paraglide.js** para i18n
- **Idiomas**: EN, PT-BR
- **Auto-detecção** de idioma do navegador
- **Mensagens parametrizadas**
- **SEO-friendly** URLs (`/en`, `/pt-br`)

## 📊 Monitoring & Analytics

### GlitchTip (Error Tracking)

- Self-hosted no Coolify
- Compatível com Sentry SDK
- Tracking server e client-side
- Filtragem de dados sensíveis

### Umami (Analytics)

- Self-hosted no Coolify
- Privacy-first (GDPR compliant)
- Pageviews, eventos, devices
- Zero cookies

Ver [guia completo](docs/monitoring-analytics.md) para setup.

## 🧩 Stack Tecnológica

- **Framework**: SvelteKit + Svelte 5 (Runes)
- **Language**: TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Session-based (SHA-256)
- **Storage**: Cloudflare R2
- **Email**: AWS SES
- **i18n**: Paraglide.js
- **Testing**: Playwright (E2E) + Vitest (Unit)
- **Monitoring**: GlitchTip (self-hosted)
- **Analytics**: Umami (self-hosted)
- **Image Processing**: Sharp

## 📝 Scripts

```bash
# Desenvolvimento
bun run dev              # Dev server
bun run build            # Build produção
bun run preview          # Preview build

# Database
bun run db:generate      # Gerar migrations
bun run db:push          # Aplicar migrations
bun run db:studio        # Drizzle Studio

# Testes
bun run test             # Todos os testes
bun run test:unit        # Unit tests
bun run test:e2e         # E2E tests

# Qualidade
bun run check            # Type check
bun run lint             # ESLint
bun run format           # Prettier
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/amazing`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing`)
5. Abra um Pull Request

## 📄 Licença

GPL-3.0 - Ver [LICENSE](LICENSE)

## 👤 Autor

**Lucas Monsan**

- GitHub: [@lucasmonsan](https://github.com/lucasmonsan)
- Email: lucasmonsan@gmail.com

---

**Status**: ✅ Produção-ready | **Versão**: 1.0.0 | **Score**: 10/10
